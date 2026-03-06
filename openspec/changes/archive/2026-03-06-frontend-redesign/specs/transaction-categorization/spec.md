## ADDED Requirements

### Requirement: Hybrid Automatic Categorization
The system SHALL automatically parse and categorize imported CSV transactions using a keyword-based rule system and text analysis.

#### Scenario: System matches a known keyword
- **WHEN** a transaction description contains a known keyword (e.g., "NETFLIX", "SPOTIFY")
- **THEN** the system automatically assigns the corresponding category (e.g., "Abonnements Télécom/Loisirs") and tags the transaction.

#### Scenario: System encounters an unknown transaction
- **WHEN** a transaction description does not match any predefined keywords
- **THEN** the system applies a fallback heuristic (basic text analysis) to suggest a likely category, or categorizes it as "Inconnue" for manual user review.

### Requirement: 4-Pillar Categorization Structure
The system SHALL organize all categories into exactly 4 high-level pillars: Revenus, Dépenses Fixes, Dépenses Variables, and Dépenses Occasionnelles/Épargne.

#### Scenario: User reviews transaction categories
- **WHEN** the user filters transactions by category
- **THEN** the user can filter by the 4 main pillars or the max 10-12 sub-categories beneath them.
