"""Backend tests: Turnstile-gated enquiries + chat, admin auth, enquiry inbox.

NOTE (iteration 4): the app now uses the user's REAL Cloudflare Turnstile keys.
A fake/dummy token must therefore be REJECTED with 400. Tests that need a
persisted enquiry / verified chat session seed Mongo directly, since a valid
Turnstile token can only be produced by a real browser challenge.
"""
import os
import uuid
from datetime import datetime, timedelta, timezone

import pytest
import requests
from dotenv import dotenv_values
from pymongo import MongoClient

frontend_env = dotenv_values("/app/frontend/.env")
backend_env = dotenv_values("/app/backend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = backend_env.get("ADMIN_PASSWORD") or "Latios@2026"
FAKE_TOKEN = "XXXX.DUMMY.TOKEN.XXXX"

MONGO_URL = backend_env.get("MONGO_URL")
DB_NAME = backend_env.get("DB_NAME")


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "X-Admin-Key": ADMIN_PASSWORD})
    return s


@pytest.fixture(scope="module")
def db():
    if not MONGO_URL or not DB_NAME:
        pytest.skip("MONGO_URL/DB_NAME missing from backend/.env")
    cli = MongoClient(MONGO_URL)
    yield cli[DB_NAME]
    d = cli[DB_NAME]
    d.enquiries.delete_many({"name": {"$regex": "^TEST_"}})
    d.chat_sessions.delete_many({"session_id": {"$regex": "^TEST_"}})
    d.chat_messages.delete_many({"session_id": {"$regex": "^TEST_"}})
    cli.close()


def seed_enquiry(db, name="TEST_Seeded", email="seed@example.com", company="TEST Co"):
    eid = str(uuid.uuid4())
    db.enquiries.insert_one({
        "id": eid, "name": name, "email": email, "company": company,
        "message": "seeded by backend_test", "source": "footer", "replied": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return eid


# --- module: turnstile config sanity (REAL keys expected) ---
class TestTurnstileConfig:
    def test_keys_are_configured(self):
        assert backend_env.get("TURNSTILE_SECRET_KEY")
        assert frontend_env.get("REACT_APP_TURNSTILE_SITE_KEY")

    def test_keys_are_not_cloudflare_test_keys(self):
        site = frontend_env.get("REACT_APP_TURNSTILE_SITE_KEY")
        secret = (backend_env.get("TURNSTILE_SECRET_KEY") or "").strip('"')
        cf_test_sitekeys = {"1x00000000000000000000AA", "2x00000000000000000000AB",
                            "1x00000000000000000000BB", "2x00000000000000000000BB",
                            "3x00000000000000000000FF"}
        cf_test_secrets = {"1x0000000000000000000000000000000AA",
                           "2x0000000000000000000000000000000AA",
                           "3x0000000000000000000000000000000AA"}
        assert site not in cf_test_sitekeys, f"Frontend uses Cloudflare DUMMY sitekey {site}"
        assert secret not in cf_test_secrets, "Backend uses Cloudflare DUMMY secret"


# --- module: POST /api/enquiries ---
class TestEnquiries:
    def test_missing_token_rejected(self, client):
        r = client.post(f"{API}/enquiries", json={
            "name": "TEST_NoToken", "email": "n@example.com", "message": "hello"})
        assert r.status_code == 422, r.text

    def test_empty_token_rejected(self, client):
        r = client.post(f"{API}/enquiries", json={
            "name": "TEST_Empty", "email": "n@example.com", "message": "hello",
            "turnstile_token": ""})
        assert r.status_code == 422, r.text

    def test_fake_token_rejected_with_real_keys(self, client):
        """CRITICAL: with real keys a forged token must be rejected (400)."""
        r = client.post(f"{API}/enquiries", json={
            "name": "TEST_FakeToken", "email": "fake@example.com",
            "message": "forged token", "turnstile_token": FAKE_TOKEN})
        assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"
        assert "Security check" in r.json().get("detail", "")

    def test_fake_token_enquiry_not_persisted(self, client, admin_client):
        client.post(f"{API}/enquiries", json={
            "name": "TEST_FakeTokenPersist", "email": "fake2@example.com",
            "message": "forged", "turnstile_token": FAKE_TOKEN})
        lst = admin_client.get(f"{API}/enquiries")
        assert lst.status_code == 200
        assert not [e for e in lst.json() if e["name"] == "TEST_FakeTokenPersist"]

    def test_invalid_email_rejected_422(self, client):
        r = client.post(f"{API}/enquiries", json={
            "name": "TEST_BadEmail", "email": "notanemail", "message": "hi",
            "turnstile_token": FAKE_TOKEN})
        assert r.status_code == 422, r.text
        assert "email" in r.text

    def test_validation_name_too_long(self, client):
        r = client.post(f"{API}/enquiries", json={
            "name": "x" * 200, "email": "a@b.com", "message": "hi",
            "turnstile_token": FAKE_TOKEN})
        assert r.status_code == 422


# --- module: admin auth ---
class TestAdminAuth:
    def test_login_success(self, client):
        r = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
        assert r.status_code == 200
        assert r.json() == {"ok": True}

    def test_login_wrong_password(self, client):
        r = client.post(f"{API}/admin/login", json={"password": "nope"})
        assert r.status_code == 401

    def test_enquiries_requires_key(self, client):
        r = client.get(f"{API}/enquiries")
        assert r.status_code == 401

    def test_analytics_requires_key(self, client):
        r = client.get(f"{API}/chat-analytics")
        assert r.status_code == 401

    def test_analytics_with_key(self, admin_client):
        r = admin_client.get(f"{API}/chat-analytics")
        assert r.status_code == 200
        assert isinstance(r.json(), dict)

    def test_enquiries_list_no_mongo_id(self, admin_client, db):
        eid = seed_enquiry(db, name="TEST_ListShape")
        lst = admin_client.get(f"{API}/enquiries")
        assert lst.status_code == 200
        match = [e for e in lst.json() if e["id"] == eid]
        assert match, "seeded enquiry not returned by admin inbox"
        assert "_id" not in match[0]
        assert match[0]["replied"] is False


# --- module: POST /api/chat turnstile gate + 24h session freshness ---
class TestChatGate:
    def test_first_message_without_token_is_403(self, client):
        r = client.post(f"{API}/chat", json={
            "session_id": f"TEST_{uuid.uuid4()}", "message": "hi"})
        assert r.status_code == 403, r.text
        assert "Security check" in r.json().get("detail", "")

    def test_fake_token_rejected_with_real_keys(self, client):
        r = client.post(f"{API}/chat", json={
            "session_id": f"TEST_{uuid.uuid4()}", "message": "hi",
            "turnstile_token": FAKE_TOKEN})
        assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"

    def test_fresh_verified_session_streams(self, client, db):
        sid = f"TEST_{uuid.uuid4()}"
        db.chat_sessions.insert_one({
            "session_id": sid, "verified": True,
            "ts": datetime.now(timezone.utc).isoformat()})
        r = client.post(f"{API}/chat", json={
            "session_id": sid, "message": "Tell me about your laptops"},
            timeout=120, stream=True)
        assert r.status_code == 200, r.text
        body = r.text
        assert "data:" in body, body[:300]
        assert len(body) > 50

    def test_stale_verified_session_requires_new_token(self, client, db):
        """Session verified >24h ago must no longer be Turnstile-exempt."""
        sid = f"TEST_{uuid.uuid4()}"
        stale = datetime.now(timezone.utc) - timedelta(hours=25)
        db.chat_sessions.insert_one({
            "session_id": sid, "verified": True, "ts": stale.isoformat()})
        r = client.post(f"{API}/chat", json={"session_id": sid, "message": "hi"})
        assert r.status_code == 403, f"stale session was accepted: {r.status_code} {r.text[:200]}"

    def test_session_just_under_24h_still_valid(self, client, db):
        sid = f"TEST_{uuid.uuid4()}"
        recent = datetime.now(timezone.utc) - timedelta(hours=23)
        db.chat_sessions.insert_one({
            "session_id": sid, "verified": True, "ts": recent.isoformat()})
        r = client.post(f"{API}/chat", json={"session_id": sid, "message": "hello"},
                        timeout=120, stream=True)
        assert r.status_code == 200, r.text


# --- module: enquiry replied toggle ---
class TestRepliedToggle:
    def test_mark_replied_and_verify(self, admin_client, db):
        eid = seed_enquiry(db, name="TEST_Replied", email="r@example.com")
        p = admin_client.patch(f"{API}/enquiries/{eid}/replied", json={"replied": True})
        assert p.status_code == 200
        assert p.json()["replied"] is True
        lst = admin_client.get(f"{API}/enquiries").json()
        match = [e for e in lst if e["id"] == eid]
        assert match and match[0]["replied"] is True

    def test_mark_replied_requires_admin(self, client, db):
        eid = seed_enquiry(db, name="TEST_RepliedNoAuth")
        p = client.patch(f"{API}/enquiries/{eid}/replied", json={"replied": True})
        assert p.status_code == 401

    def test_mark_replied_unknown_id(self, admin_client):
        p = admin_client.patch(f"{API}/enquiries/does-not-exist/replied", json={"replied": True})
        assert p.status_code == 404
