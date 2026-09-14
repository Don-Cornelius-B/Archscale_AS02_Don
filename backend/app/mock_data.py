from .schemas import ActiveBaselineState, PresetScenario, ExtractedPayload, ActionItem, ConflictAlert

ACTIVE_BASELINE = ActiveBaselineState(
    project_name="Skyline Residences - Phase 2",
    active_drawing_revision="REV 05",
    active_material_spec="Italian Statuario Marble",
    active_hardware_spec="Brushed Brass Series B"
)

# Pre-baked deterministic fallback responses
FALLBACK_PAYLOADS = {
    "outdated_rev": ExtractedPayload(
        summary="Direction to proceed with outdated plumbing layout.",
        decisions=[],
        actions=[],
        conflict=ConflictAlert(
            is_conflict=True,
            severity="critical",
            reason="Referencing REV 04 when active project drawing is locked to REV 05."
        )
    ),
    "spec_ambiguity": ExtractedPayload(
        summary="Request to use 'previous marble' in the foyer.",
        decisions=[],
        actions=[
            ActionItem(
                task="Confirm if 'previous marble' refers to Italian Statuario Marble.",
                assigned_role="Architect",
                zone_or_room="Foyer",
                priority="Normal"
            )
        ],
        conflict=ConflictAlert(
            is_conflict=True,
            severity="warning",
            reason="Ambiguous spec: Must confirm if previous refers to Italian Statuario Marble."
        )
    ),
    "site_snag": ExtractedPayload(
        summary="Waterproofing failed inspection at master bath.",
        decisions=[],
        actions=[
            ActionItem(
                task="Redo waterproofing in master bath by Thursday.",
                assigned_role="Contractor",
                zone_or_room="Master Bath",
                priority="Urgent"
            )
        ],
        conflict=ConflictAlert(
            is_conflict=False,
            severity="none",
            reason=None
        )
    ),
    "partial_signoff": ExtractedPayload(
        summary="Approval given for master layout excluding bathroom fittings.",
        decisions=["Approved master layout (except bathroom fittings)."],
        actions=[
            ActionItem(
                task="Review and resolve bathroom fittings for sign-off.",
                assigned_role="Architect",
                zone_or_room="Master Bath",
                priority="Normal"
            )
        ],
        conflict=ConflictAlert(
            is_conflict=False,
            severity="none",
            reason=None
        )
    )
}

PRESETS = [
    PresetScenario(
        id="outdated_rev",
        label="Outdated Rev",
        channel="Email",
        sender="Site Supervisor",
        raw_text="Please proceed with plumbing layout as per Rev 04 drawings."
    ),
    PresetScenario(
        id="spec_ambiguity",
        label="Spec Ambiguity",
        channel="WhatsApp",
        sender="Client",
        raw_text="Use previous marble in the foyer."
    ),
    PresetScenario(
        id="site_snag",
        label="Site Snag",
        channel="Site Note",
        sender="Inspector",
        raw_text="Waterproofing failed inspection at master bath. Contractor redo by Thursday."
    ),
    PresetScenario(
        id="partial_signoff",
        label="Partial Sign-off",
        channel="WhatsApp",
        sender="Client",
        raw_text="Approved master layout except bathroom fittings."
    )
]
