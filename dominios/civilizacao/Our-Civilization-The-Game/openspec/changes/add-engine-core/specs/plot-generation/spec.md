## ADDED Requirements

### Requirement: Seed persistence and inspection

Plot seeds SHALL be `PLOT_GENERATION` events (`kind=generated`/`consumed`) reconstructed by replay; the generator state (active, triggers, cooldowns) SHALL derive exclusively from the event store, and manual generation SHALL use the same rules as the automatic one.

#### Scenario: Manual generation respects the lock

- **WHEN** `POST /generate` is called with an active, unconsumed seed
- **THEN** the response SHALL refuse with the plot lock reason
