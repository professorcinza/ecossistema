## ADDED Requirements

### Requirement: hermes provider (OpenAI-compat endpoint)

The router SHALL support the `hermes` provider: a configurable OpenAI-compatible endpoint (`MTG_HERMES_BASE_URL`, default `http://127.0.0.1:8645/v1` for the local Hermes Agent proxy) with an optional key (`MTG_HERMES_API_KEY`). When the endpoint is the local proxy, the OAuth credential is injected by the proxy and the game's bearer is a placeholder; when the endpoint is remote with an explicit key, the key is used directly and the boot performs no network probe (a slow network must not block startup).

#### Scenario: Local proxy without key

- **WHEN** `hermes` is selected without `MTG_HERMES_API_KEY`
- **THEN** the router SHALL validate endpoint reachability before activating and refuse with an actionable instruction if inaccessible

#### Scenario: Remote endpoint with key

- **WHEN** `hermes` is selected with `MTG_HERMES_API_KEY` set
- **THEN** the provider SHALL activate without a network probe at boot
- **AND** the key SHALL be sent as bearer on calls

### Requirement: Configuration via .env file

The backend SHALL load provider configuration from `backend/.env` (gitignored) at boot: `MTG_PROVIDER`, `MTG_NARRATIVE_MODEL`, `MTG_AUXILIARY_MODEL`, `MTG_TEMPERATURE`, plus the per-provider keys. Without `.env` or with a keyless provider, the backend SHALL come up in `mock` with a warning in the trace, never breaking the boot.

#### Scenario: Without .env

- **WHEN** the backend starts without a `.env` file
- **THEN** the active provider SHALL be `mock` and `/api/health` SHALL respond ok

#### Scenario: Transactional provider switch

- **WHEN** `POST /api/settings` receives an invalid provider or one without credentials
- **THEN** no partial mutation SHALL occur (validation before the switch)
- **AND** the response SHALL be 422 with instructions on what to configure
