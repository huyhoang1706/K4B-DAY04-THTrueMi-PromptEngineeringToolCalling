# V1 Prompt Change Notes

These notes map each v0 problem to the rule added to
`../starter_v0/artifacts/system_prompt.md`. The evaluation case wording and IDs
are documented here for analysis only; they are not hard-coded into the prompt.

| Case ID | V0 problem | V1 prompt rule added |
|---|---|---|
| `H10_missing_asset` | Generic word “laptop” was used as an asset ID. | Validate asset IDs; missing/invalid IDs require `clarify`. |
| `H11_missing_employee` | Department name `Sales` was used as an employee ID. | Validate employee IDs; department/name is not an ID. |
| `H19_ambiguous_environment` | “Demo” was mapped to `staging` without evidence. | Ambiguous environments require a production/staging choice. |
| `H12_confirm_before_ticket` | The agent invented `confirmed=true`. | Ticket creation requires explicit confirmation of the full payload. |
| `M05_ticket_confirmation` | Ticket creation happened in the same turn as the confirmation question. | Confirmation turn calls only `clarify`; writing happens later. |
| `M09_confirmation_invalidated` | Old confirmation was reused after payload changes. | Any payload change invalidates the previous confirmation. |
| `H04_user_routing` | Employee ID was passed to `inspect_device`. | Keep employee lookup and asset inspection identifiers separate. |
| `H13_parallel_status_and_device` | VPN symptom did not produce `check="vpn"`. | Select the narrowest symptom-specific device check. |
| `H17_triage_with_three_sources` | Broad `check="all"` replaced a requested VPN check. | Decompose multi-source requests and preserve specific checks. |

Only `system_prompt.md` was changed for this v1 prompt iteration; `tools.yaml`,
source code and fixed evaluation datasets remain unchanged.
