# v2 Tool Declaration Analysis

## Decision

`starter_v0/artifacts/tools.yaml` is unchanged in v2. The v1 declarations already address the tool-specific failures found in the v0 run. V2 focuses on conversation-state rules in `system_prompt.md` because the remaining problems concern multi-turn intent handling, corrections, cancellation, and confirmation state.

## Why no new `tools.yaml` changes were needed

| Existing declaration | Problem already addressed |
|---|---|
| `search_kb` clearly targets troubleshooting instructions | Prevents confusing documentation search with live service status or device inspection |
| `check_service_status` requires a production or staging environment | Reduces invalid or guessed environment values |
| `inspect_device` requires an exact `asset_id` and named check category | Prevents invented IDs and accidental `check=all` calls |
| `lookup_user` requires an exact `employee_id` | Prevents lookups based on ambiguous employee descriptions |
| `clarify` supports text, yes/no, and choice questions | Supports missing-information and confirmation flows |
| `create_ticket` requires confirmation of the current payload | Prevents ticket creation before confirmation and invalidates stale confirmation after edits |
| `format_incident_report` formats existing findings only | Prevents unnecessary diagnostic or lookup calls |

## V2 changes handled in the system prompt

- The latest user message replaces earlier conflicting values.
- Cancellation or pause removes stale actions.
- Independent checks use separate calls with exact arguments.
- Missing values are never invented for dependent calls.
- Any ticket payload change requires fresh confirmation.

## Validation

- The YAML declaration still contains all 9 registered tools.
- Tool names and parameter names remain unchanged.
- V2 should be evaluated with the same `data/eval_base.json` used for v0 and v1.
- Compare both routing/argument scores and `tool_results`; a routing PASS alone does not prove execution success.

## Limitation

No v1 run JSON is currently available in this checkout. Therefore, this document records the v2 hypothesis and scope; it does not claim a measured v2 improvement.