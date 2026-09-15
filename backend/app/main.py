from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from .schemas import ActiveBaselineState, PresetScenario, InboundMessageRequest, ExtractedPayload, ProjectHistoryItem
from .mock_data import ACTIVE_BASELINE, PRESETS, PROJECT_HISTORY
from .engine import reconcile_communication
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ArchScale Comm-Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/baseline", response_model=ActiveBaselineState)
def get_baseline():
    return ACTIVE_BASELINE

@app.get("/api/presets", response_model=List[PresetScenario])
def get_presets():
    return PRESETS

@app.get("/api/history", response_model=List[ProjectHistoryItem])
def get_history():
    return PROJECT_HISTORY

@app.post("/api/process", response_model=ExtractedPayload)
def process_message(request: InboundMessageRequest):
    return reconcile_communication(request)
