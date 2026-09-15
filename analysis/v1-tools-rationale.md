# v1 Tool Declaration Rationale

## Goal

Improve tool selection and argument quality after the v0 base evaluation. The v1 changes are limited to clearer tool descriptions and parameter guidance in `starter_v0/artifacts/tools.yaml`.

## Changes and reasons

| v1 change | v0 problem addressed | Expected effect |
|---|---|---|
| Clarified `search_kb` | The agent may use a knowledge search when the user asks for live service status. | Use `search_kb` only for internal troubleshooting instructions and how-to articles. |
| Clarified `check_service_status` | Environment mistakes and confusion between shared services and devices. | Check one service in `production` or `staging`; ask when the environment is unclear. |
| Clarified `inspect_device` | Missing or invented asset IDs and defaulting to `check=all`. | Require the exact user-provided asset ID and use the requested check category. |
| Clarified `lookup_user` | The agent may search with an ambiguous or missing employee ID. | Ask for the exact employee ID instead of guessing. |
| Improved `clarify` descriptions | Missing-information cases were handled by calling a lookup or inspection tool directly. | Ask for missing values; use `yes_no` before write actions and `choice` for enum decisions. |
| Improved `create_ticket` | The agent created tickets before confirmation or reused confirmation after changes. | Confirm the current summary, priority, and asset; ask again after edits and respect cancellation. |
| Clarified `format_incident_report` | The agent may collect findings again when the user requests formatting only. | Format supplied findings without unnecessary diagnostic or lookup calls. |

## Validation

- YAML parsing succeeded.
- All 9 registered tool names remain unchanged.
- No evaluation cases or tool implementations were changed.
- The next step is to rerun the fixed base suite as v1 and compare its run JSON with v0.

## Evidence limitation

The v0 run identified these observed failures: H04, H10, H11, H12, H13, M05, H17, H19, and M09. Runtime tool checks also showed that invalid input can return an error. v1 improvement must be measured by a new provider run; this file does not claim an improvement before that run is completed.