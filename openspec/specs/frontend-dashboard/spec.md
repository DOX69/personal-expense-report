## ADDED Requirements

### Requirement: Display Main Dashboard
The system SHALL provide a main dashboard view that aggregates financial data.

#### Scenario: User views the dashboard
- **WHEN** the user navigates to the dashboard route
- **THEN** the system displays the Total Balance, Month's Income, Month's Expenses, and Savings Goal progress as top-level metric cards.

### Requirement: Interactive Data Visualizations
The system SHALL provide interactive charts to visualize spending and cash flow.

#### Scenario: User views cashflow evolution
- **WHEN** the user views the dashboard
- **THEN** an Income vs Expenses line chart is displayed for the selected time period.

#### Scenario: User views spending breakdown
- **WHEN** the user views the dashboard
- **THEN** a donut or pie chart displays the breakdown of expenses by category (e.g., Alimentation, Transport, Loisirs) for the current month.

### Requirement: Clear Cash Flow Diagram
The system SHALL display a strict directional Sankey diagram representing the flow of money.

#### Scenario: User analyzes money flow
- **WHEN** the user views the Sankey diagram
- **THEN** the money must clearly flow from Income Sources -> Current Account -> Expense Categories / Savings without any recursive loops.
