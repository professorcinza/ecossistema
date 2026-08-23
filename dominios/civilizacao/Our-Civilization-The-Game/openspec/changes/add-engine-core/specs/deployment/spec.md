## ADDED Requirements

### Requirement: Docker Compose stack

The project SHALL provide `docker-compose.yml` with backend (FastAPI/uv, port 8642, healthcheck at `/api/health`, event store on a named volume) and frontend (multi-stage Vite build served by nginx on port 8080 with `/api` proxy and SSE without buffering), orchestrated with `depends_on` conditioned on healthcheck.

#### Scenario: Full startup

- **WHEN** `docker compose up -d --build --wait` is executed
- **THEN** both services SHALL be healthy
- **AND** the game SHALL be accessible at `:8080` with the API responding via the nginx proxy

#### Scenario: Restart preserves state

- **WHEN** the backend container restarts
- **THEN** imported scenarios and campaigns SHALL persist (volume + SQLite)

### Requirement: Neo4j as an optional profile

The Neo4j service SHALL sit behind a profile (`--profile graph`), outside the default stack, faithful to the architecture decision of an in-memory graph with Neo4j as an optional upgrade.

#### Scenario: Default stack

- **WHEN** `docker compose up -d` without a profile
- **THEN** no Neo4j container SHALL be created

### Requirement: Credentials out of the image

No credential SHALL enter the Docker images; the backend receives `.env` via `env_file` (optional) and the compose defines no provider defaults that override the `.env`.

#### Scenario: Missing env_file

- **WHEN** the deploy runs without `backend/.env`
- **THEN** the backend SHALL come up with the mock provider and remain healthy

### Requirement: Host access for the Hermes proxy

The backend service SHALL resolve `host.docker.internal` (`extra_hosts: host-gateway`) to consume the Hermes Agent proxy running on the host machine.

#### Scenario: Proxy on the host

- **WHEN** `MTG_HERMES_BASE_URL=http://host.docker.internal:8645/v1` with the proxy active on the host
- **THEN** the backend container SHALL reach the endpoint
