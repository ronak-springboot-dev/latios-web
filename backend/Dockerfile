FROM python:3.11-slim

WORKDIR /app

# build-essential covers native deps some packages in requirements.txt need to compile
# (cryptography, pymupdf, etc.)
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir gunicorn

COPY . .

EXPOSE 8000

# server.py defines `app = FastAPI()` in backend/server.py
CMD ["gunicorn", "server:app", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "-w", "2", "--timeout", "120"]
