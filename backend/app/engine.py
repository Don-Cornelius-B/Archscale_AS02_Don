import os
import json
from google import genai
from .schemas import InboundMessageRequest, ExtractedPayload
from .mock_data import ACTIVE_BASELINE, FALLBACK_PAYLOADS, PRESETS

# System prompt for Gemini
SYSTEM_PROMPT = f"""You are the ArchScale Comm-Engine, an AEC communication reconciliation AI.
Your job is to extract structured action items, locked decisions, and detect conflicts against the active project baseline.

ACTIVE PROJECT BASELINE:
- Project: {ACTIVE_BASELINE.project_name}
- Drawing Revision: {ACTIVE_BASELINE.active_drawing_revision}
- Material Spec: {ACTIVE_BASELINE.active_material_spec}
- Hardware Spec: {ACTIVE_BASELINE.active_hardware_spec}

Analyze the incoming message and return ONLY a JSON object that perfectly matches this schema:
{{
  "summary": "string",
  "decisions": ["string"],
  "actions": [
    {{
      "task": "string",
      "assigned_role": "Architect" | "Contractor" | "Supplier" | "Client",
      "zone_or_room": "string" | null,
      "priority": "Low" | "Normal" | "Urgent"
    }}
  ],
  "conflict": {{
    "is_conflict": boolean,
    "severity": "none" | "warning" | "critical",
    "reason": "string" | null
  }}
}}
"""

def reconcile_communication(request: InboundMessageRequest) -> ExtractedPayload:
    # Deterministic mock fallback matching
    for preset in PRESETS:
        if preset.raw_text.strip().lower() == request.raw_text.strip().lower():
            return FALLBACK_PAYLOADS[preset.id]

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        print("GEMINI_API_KEY missing or invalid. Falling back to mock (using outdated_rev).")
        return FALLBACK_PAYLOADS["outdated_rev"]

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[SYSTEM_PROMPT, f"Incoming Message from {request.sender or 'Unknown'} via {request.channel}:\n{request.raw_text}"],
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        data = json.loads(response.text)
        return ExtractedPayload(**data)
    except Exception as e:
        print(f"Gemini API call failed: {e}. Falling back to mock (using spec_ambiguity).")
        # Graceful fallback so presentation never crashes
        return FALLBACK_PAYLOADS["spec_ambiguity"]
