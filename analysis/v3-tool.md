# V3 — Tool Declaration Changes (Huy)

## Purpose

Improve argument selection and confirmation routing in `starter_v0/artifacts/tools.yaml`, based on the four failed cases in the v1 base run (26/30 passed).

## Main Changes

| Tool | Observed v1 issue | Change and expected result |
|---|---|---|
| `clarify` | H10 and H11 omitted `response_type`. The tool defaulted to `text`, but the evaluator required an explicit argument. | Make `response_type` required and explain its values: `text` for missing information, `yes_no` for confirmation, and `choice` for ambiguous options. |
| `search_kb` | H03 selected `category=all` instead of `email`, a regression from v0. | Explain category selection and reserve `all` for broad or unspecified topics. |
| `create_ticket` | H12 called `create_ticket(confirmed=false)` instead of asking through `clarify`. The guard correctly prevented ticket creation. | Explicitly require `clarify(response_type=yes_no)` before creation, and fresh confirmation when ticket details change. |

## Validation

- YAML parsing and checks against all 9 tool names and function signatures passed when the changes were applied.
- These declaration changes guide the model; they do not add runtime enforcement.
- V3 improvement has not been measured. Save the v2 result using its original artifacts, then evaluate v3 with the same provider/model and fixed cases. Review regressions and tool results as well as scores.

Evidence: [v1 base run](../starter_v0/runs/v1_B_base_openai_20260915T201320712980.json). Artifact: [tools.yaml](../starter_v0/artifacts/tools.yaml).
