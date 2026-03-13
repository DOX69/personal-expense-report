## ADDED Requirements

### Requirement: Automated build and deployment
The system SHALL support automated build and deployment of the Next.js application to Vercel.

#### Scenario: Successful build and deployment
- **WHEN** the source code is pushed to the linked repository or a deployment is triggered via API
- **THEN** Vercel SHALL build the application using the configured build command and deploy it to a public URL

### Requirement: Environment Variable Configuration
The system SHALL use environment variables for sensitive configuration, ensuring no secrets are committed to the repository.

#### Scenario: Secure secret access
- **WHEN** the application is running in the Vercel production or preview environment
- **THEN** it SHALL have access to `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `APP_PASSWORD` through Vercel environment variables

### Requirement: Root Directory Support
The system SHALL correctly deploy the application from the `app-frontend` subdirectory.

#### Scenario: Correct directory build
- **WHEN** Vercel triggers a build
- **THEN** it SHALL use `app-frontend` as the root directory for the Next.js project
