from fastapi import FastAPI, APIRouter, Request, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
import re
import hmac
import httpx
from datetime import datetime, timezone, timedelta
from emailer import send_enquiry_alert


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')
# Local-dev-only overrides (e.g. Cloudflare Turnstile test keys) — gitignored,
# absent in production, mirrors frontend's .env.local pattern. No-ops if missing.
load_dotenv(ROOT_DIR / '.env.local', override=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = None
    message: str
    replied: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EnquiryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    company: Optional[str] = None
    message: str = Field(min_length=1, max_length=5000)
    turnstile_token: str = Field(min_length=1, max_length=2048)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()

    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])

    return status_checks

TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

async def verify_turnstile(token: str):
    try:
        async with httpx.AsyncClient(timeout=5.0) as http:
            resp = await http.post(
                TURNSTILE_URL,
                json={"secret": os.environ["TURNSTILE_SECRET_KEY"], "response": token},
            )
            result = resp.json()
    except Exception:
        raise HTTPException(status_code=503, detail="Security verification temporarily unavailable — please retry")
    if not result.get("success"):
        logger.warning(f"Turnstile rejected token: {result.get('error-codes')}")
        raise HTTPException(status_code=400, detail="Security check failed — please retry")
    if result.get("action") not in (None, "enquiry", "chat"):
        raise HTTPException(status_code=400, detail="Security check failed")

# Chat abuse control.
#
# Turnstile is the front door and stays the front door: a request that brings a
# token still gets verified, and a verified session is still trusted for a day.
# But the chat cannot REQUIRE a token, because a Turnstile widget that will not
# render for the current hostname issues no token and fires no error, and the
# chat is then dead with a healthy backend behind it and nothing in the logs --
# which is exactly the state the deployed site was found in.
#
# So an unverified caller is allowed through a rate limit instead. That is a
# real control rather than an open door: it bounds what an abuser can spend of
# the Gemini quota per session and per address, and it is enforced server-side
# where a client cannot skip it. Turnstile remains defence in depth, and a
# verified session bypasses the limit entirely.
# Two budgets, deliberately far apart.
#
# A session is one browser, so 12 an hour is a generous conversation and a poor
# scraping rate. An ADDRESS is not one person: Latios sells to organisations,
# and a whole office behind one NAT shares it. Metering the address as tightly
# as the session locked out a fresh session from the same building on the first
# message -- found by testing it rather than by reasoning about it -- so the
# address budget is an order of magnitude higher. It still bounds a single
# source; it just does not mistake a company for an abuser.
CHAT_LIMIT_SESSION = int(os.environ.get("CHAT_LIMIT_SESSION", "12"))
CHAT_LIMIT_IP = int(os.environ.get("CHAT_LIMIT_IP", "150"))
CHAT_LIMIT_WINDOW_S = int(os.environ.get("CHAT_LIMIT_WINDOW_S", "3600"))


def client_ip(request: Request) -> str:
    """
    The caller's address.

    Behind Cloud Run and the Pages proxy the socket peer is a Google front end,
    so the only useful value is the left-most entry of X-Forwarded-For, which is
    what the original client sent. It is spoofable, which is why it is one of
    two keys rather than the only one -- the session id is the other.
    """
    fwd = request.headers.get("x-forwarded-for", "")
    return (fwd.split(",")[0].strip() if fwd else None) or (
        request.client.host if request.client else "unknown")


async def enforce_chat_limit(key: str, kind: str, budget: int) -> None:
    """Count one call against `key`, refusing once the window's budget is spent."""
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(seconds=CHAT_LIMIT_WINDOW_S)
    await db.chat_calls.insert_one({"key": key, "kind": kind, "at": now})
    used = await db.chat_calls.count_documents({"key": key, "at": {"$gte": cutoff}})
    if used > budget:
        logger.warning(f"chat rate limit hit for {kind} {key}: {used} in window")
        raise HTTPException(
            status_code=429,
            detail="That is a lot of questions in a short time. Please pause a moment, "
                   "or email sales@latios.in and a human will pick it up.",
        )


@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(input: EnquiryCreate):
    await verify_turnstile(input.turnstile_token)
    enquiry = Enquiry(**input.model_dump())
    doc = enquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.enquiries.insert_one(doc)
    try:
        email_id = await send_enquiry_alert(enquiry.model_dump())
        logger.info(f"Enquiry alert email id: {email_id}")
    except Exception as e:
        logger.error(f"Enquiry email alert failed: {e}")
    return enquiry

def require_admin(request: Request):
    key = request.headers.get("X-Admin-Key", "")
    if not hmac.compare_digest(key, os.environ["ADMIN_PASSWORD"]):
        raise HTTPException(status_code=401, detail="Unauthorized")


class AdminLogin(BaseModel):
    password: str


@api_router.post("/admin/login")
async def admin_login(input: AdminLogin):
    if not hmac.compare_digest(input.password, os.environ["ADMIN_PASSWORD"]):
        raise HTTPException(status_code=401, detail="Wrong password")
    return {"ok": True}


@api_router.get("/enquiries", response_model=List[Enquiry])
async def list_enquiries(request: Request):
    require_admin(request)
    items = await db.enquiries.find({}, {"_id": 0}).to_list(1000)
    for item in items:
        if isinstance(item['created_at'], str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    return items

class RepliedUpdate(BaseModel):
    replied: bool

@api_router.patch("/enquiries/{enquiry_id}/replied")
async def mark_enquiry_replied(enquiry_id: str, input: RepliedUpdate, request: Request):
    require_admin(request)
    res = await db.enquiries.update_one({"id": enquiry_id}, {"$set": {"replied": input.replied}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"ok": True, "id": enquiry_id, "replied": input.replied}

# LATI chatbot — Gemini powered, streaming SSE
class ChatRequest(BaseModel):
    session_id: str
    message: str
    turnstile_token: Optional[str] = None

@api_router.post("/chat")
async def chat(req: ChatRequest, request: Request):
    import json
    from fastapi.responses import StreamingResponse
    from google import genai
    from google.genai import types
    from knowledge import LATIOS_KNOWLEDGE

    session = await db.chat_sessions.find_one({"session_id": req.session_id})
    session_fresh = False
    if session and session.get("verified"):
        try:
            age = datetime.now(timezone.utc) - datetime.fromisoformat(str(session.get("ts")))
            session_fresh = age.total_seconds() < 86400
        except Exception:
            session_fresh = False
    if not session_fresh:
        if req.turnstile_token:
            # Front door: a token still has to be genuine, and clears the
            # session for a day.
            await verify_turnstile(req.turnstile_token)
            await db.chat_sessions.update_one(
                {"session_id": req.session_id},
                {"$set": {"verified": True, "ts": datetime.now(timezone.utc).isoformat()}},
                upsert=True,
            )
        else:
            # No token: allowed, but metered on both keys, so neither a single
            # session nor a single address can burn the model quota.
            await enforce_chat_limit(req.session_id, "session", CHAT_LIMIT_SESSION)
            await enforce_chat_limit(client_ip(request), "ip", CHAT_LIMIT_IP)

    ts = datetime.now(timezone.utc).isoformat()
    await db.chat_messages.insert_one(
        {"session_id": req.session_id, "role": "user", "content": req.message, "ts": ts}
    )
    history = await db.chat_messages.find(
        {"session_id": req.session_id}, {"_id": 0}
    ).sort("ts", 1).to_list(30)
    prior = "\n".join(f"{m['role']}: {m['content']}" for m in history[:-1])
    system = LATIOS_KNOWLEDGE + (f"\n\nConversation so far:\n{prior}" if prior else "")

    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    async def gen():
        full = ""
        try:
            stream = await client.aio.models.generate_content_stream(
                model="gemini-3.5-flash-lite",
                contents=req.message,
                config=types.GenerateContentConfig(system_instruction=system),
            )
            async for chunk in stream:
                if chunk.text:
                    full += chunk.text
                    yield f"data: {json.dumps({'delta': chunk.text})}\n\n"
        except Exception as e:
            logger.error(f"LATI chat error: {e}")
            yield f"data: {json.dumps({'error': 'unavailable'})}\n\n"
        await db.chat_messages.insert_one(
            {
                "session_id": req.session_id,
                "role": "assistant",
                "content": full,
                "ts": datetime.now(timezone.utc).isoformat(),
            }
        )
        lead_words = ("price", "pricing", "cost", "quote", "buy", "purchase", "bulk", "order", "demo")
        if any(w in req.message.lower() for w in lead_words):
            yield 'data: {"lead": true}\n\n'
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

@api_router.get("/chat-analytics")
async def chat_analytics(request: Request):
    require_admin(request)
    from collections import Counter

    msgs = await db.chat_messages.find({"role": "user"}, {"_id": 0}).sort("ts", -1).to_list(500)
    sessions = len({m["session_id"] for m in msgs})
    stop = set(
        "the a an and or of to in is are do does for with what which how can i me my your you on it this that latios about tell show know more any there best much does do have between vs or not out get".split()
    )
    words = Counter()
    for m in msgs:
        for w in re.findall(r"[a-z']{3,}", m["content"].lower()):
            if w not in stop:
                words[w] += 1
    return {
        "total_questions": len(msgs),
        "total_sessions": sessions,
        "top_keywords": [{"word": w, "count": c} for w, c in words.most_common(12)],
        "recent": msgs[:25],
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def ensure_indexes():
    """
    Expire the rate-limit counters.

    chat_calls gets a row per unverified chat message and is only ever read
    over the trailing window, so without a TTL it grows forever -- and the
    cluster behind this is an Atlas M0 with 512MB to its name. Mongo's TTL
    monitor sweeps the collection on its own once the index exists. Indexed on
    (key, at) as well, because that is the shape of every read.
    """
    try:
        await db.chat_calls.create_index("at", expireAfterSeconds=CHAT_LIMIT_WINDOW_S * 2)
        await db.chat_calls.create_index([("key", 1), ("at", -1)])
    except Exception as e:                       # never block startup on this
        logger.warning(f"could not create chat_calls indexes: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
