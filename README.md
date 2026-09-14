# ArchScale Comm-Engine

ArchScale Comm-Engine is an AEC (Architecture, Engineering, Construction) communication reconciliation and conflict detection prototype targeting Problem Statement AS-02: **Make project communication intelligent, not overwhelming**.

## Executive Summary
In complex construction projects, critical directives, approvals, and snags are scattered across informal channels (WhatsApp, Emails, Site Notes). This fragmentation leads to missed actions, ignored drawing revisions, and costly on-site rework. 

**ArchScale Comm-Engine** solves this by acting as an intelligent reconciliation layer. It intercepts unstructured communication, compares it against the locked project baseline (drawings, specs), detects conflicts instantly, and extracts structured, role-assigned action items.

## Architecture & Flow
1. **Unstructured Ingestion**: Takes raw text from any channel.
2. **AI Reconciliation (Gemini 2.5 Flash)**: Instructed via a strict system prompt to analyze the input against an `ActiveBaselineState`.
3. **Structured Payload Output**: Enforces a strict snake_case JSON Pydantic data contract mapping to `summary`, `decisions`, `actions`, and `conflict`.
4. **Role-based Triage UI**: Frontend dashboard consumes the structured output to display instant clash alerts and role-filtered action lists.

## Differentiators
- **Active Baseline Conflict Detection**: Unlike generic summarizers, this engine inherently knows the active drawing revisions and material specs. If a site supervisor references "Rev 04" when "Rev 05" is active, it flags a critical conflict before cement is poured.
- **Deterministic Mock Fallback**: Ensures a flawless presentation experience. If the AI service fails or hits rate limits, the backend gracefully falls back to deterministic pre-baked scenarios that map 1:1 with the demo presets.
- **Accountability Extraction**: Automatically tags the responsible role (`Architect`, `Contractor`, `Supplier`, `Client`) and priority level for every inferred task.

## Local Run Instructions

### 1. Start the Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Optional: Add your GEMINI_API_KEY to .env for live AI, otherwise it uses robust fallback mocks
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The API will be available at `http://localhost:8000`.

### 2. Start the Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
The UI will be available at `http://localhost:5173`.

## AI Built vs. Production Roadmap
**What we built today:**
- The end-to-end reconciliation engine, the strict Pydantic schemas, and the React triage dashboard with baseline state management.

**Production Roadmap:**
- **Automated CAD Sync**: Sync the `ActiveBaselineState` directly from Autodesk BIM 360 / Procore webhooks.
- **WhatsApp Webhooks**: Real-time integration via Twilio or WhatsApp Business API instead of manual input.
- **Automated RFI Logging**: Auto-draft contractual RFIs or submittal logs from detected "Warning" and "Critical" conflicts and push them to the PM software.
