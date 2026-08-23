## ADDED Requirements

### Requirement: Campaign flow in the UI

The UI SHALL offer: scenario selection (list by language), question setup (choice as buttons, text as input), opening generation, turn loop with SSE prose rendered incrementally, control tags displayed discreetly, rewind in the HUD, and return to the scenario list.

#### Scenario: Turn played through the UI

- **WHEN** the player submits an action
- **THEN** the prose SHALL appear streaming on the canvas
- **AND** the `[USAGE]/[TRACE]/[DONE]` tags SHALL be rendered without breaking the layout

### Requirement: Production build and deploy

The frontend SHALL build for production (`npm run build`) and be served by the Docker Compose nginx with an `/api` proxy to the backend; the UI consumes exclusively relative `/api` routes (compatible with the Vite dev-proxy and nginx).

#### Scenario: Dev and production identical

- **WHEN** the same UI runs in `vite dev` (5173) and in nginx (8080)
- **THEN** the calls SHALL use the same relative `/api` path
