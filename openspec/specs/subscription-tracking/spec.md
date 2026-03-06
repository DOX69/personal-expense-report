## ADDED Requirements

### Requirement: Identify Recurring Subscriptions
The system SHALL aggregate recurring transactions (e.g., monthly identical charges from a single entity) and flag them as active subscriptions.

#### Scenario: System processes known subscriptions
- **WHEN** multiple exact or similar transactions occur on a regular monthly cadence (e.g., "Spotify 10.99")
- **THEN** the system flags them as active subscriptions under "Dépenses Fixes - Abonnements".

### Requirement: Subscription Management Dashboard
The system SHALL list all active subscriptions for the user to review.

#### Scenario: User reviews monthly subscriptions
- **WHEN** the user navigates to the Subscriptions section
- **THEN** the system displays a clear list of all detected subscriptions, their cycle, and their amounts.
