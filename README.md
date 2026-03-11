# Personal Expense Report ✨

![CI Status](https://github.com/DOX69/personal-expense-report/actions/workflows/ci.yml/badge.svg)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

### About
**Personal Expense Report** is a financial dashboard for tracking personal expenses. 
It allows users to import bank statement files (CSV), automatically analyze, categorize, and save transactions in a database. It provides various visualizations and relevant metrics (KPIs) for effective budget management (Income / Expenses / Net Cashflow), as well as tracking recurring subscriptions and budgets.

### Tech Stack
The project was recently migrated to a modern decoupled stack:
- **Frontend / App:** Next.js (React), Tailwind CSS.
- **Backend / API:** FastAPI (Python).
- **Data Processing:** Pandas (CSV manipulation, filtering, date and category management).
- **Data Visualization:** Recharts (Time-series charts, cashflow histograms, and Sankey diagrams).
- **Database:** MySQL (communicating with the API via `mysql-connector-python`).
- **Deployment & Containerization:** Docker and Docker Compose.
- **Testing:** Jest & React Testing Library (Frontend), Pytest (Backend).

### Architecture

```mermaid
flowchart TD
    %% Definitions
    User(("👤 User"))

    subgraph Frontend ["🖥️ App Frontend (Next.js)"]
        direction TB
        UI["User Interface
        (Dashboard, Transactions, Import)"]
        Auth["🔒 Auth Middleware
        (Password Login)"]
        Charts["📊 Recharts"]
        UI -.-> Charts
        UI --> Auth
    end

    subgraph Backend ["⚙️ App Backend (FastAPI)"]
        direction TB
        API["🔌 API Endpoints"]
        Sec["🛡️ API Key Middleware
        (X-API-Key)"]
        Pandas["🐼 Data Processor (Pandas)"]
        DBLogic["🗄️ DB Connector"]

        API --> Sec
        Sec --> Pandas
        Sec <--> DBLogic
    end
...
### 🔐 Security Schema

This application is designed for personal use and implements two layers of security:

1.  **Frontend Authentication**: A password-protected login page sets an `httpOnly` session cookie to prevent unauthorized browser access.
2.  **API Security**: All communication between the Frontend and Backend is protected by a shared secret key passed in the `X-API-Key` header. Direct access to the Backend URL without this key will return `401 Unauthorized`.

---

## 🚀 Railway Deployment

This project is optimized for deployment on [Railway.app](https://railway.app/).

### 📋 Required Environment Variables

| Variable | Source | Description |
| :--- | :--- | :--- |
| `PORT` | Railway | Auto-injected by Railway |
| `ALLOWED_ORIGINS` | Manual | Comma-separated list of allowed frontend URLs |
| `API_SECRET_KEY` | Manual | Shared secret for backend authentication |
| `DB_HOST` | Railway | Auto-referenced from Railway MySQL |
| `DB_PORT` | Railway | Auto-referenced from Railway MySQL |
| `DB_USER` | Railway | Auto-referenced from Railway MySQL |
| `DB_PASSWORD` | Railway | Auto-referenced from Railway MySQL |
| `DB_NAME` | Railway | Auto-referenced from Railway MySQL |
| `NEXT_PUBLIC_API_URL` | Manual | Public URL of your Railway Backend |
| `NEXT_PUBLIC_API_SECRET_KEY`| Manual | Must match `API_SECRET_KEY` |
| `APP_PASSWORD` | Manual | Password for your web login |

### 🛠️ Railway Configuration Notes
- **MySQL Integration**: When you add a MySQL service in the same Railway project, the variable names in the table above will automatically link to the database.
- **Port Handling**: The application uses the dynamic `${PORT}` variable provided by Railway.
- **Source of Truth**: The `Dockerfile` at the root is used for the build. `railway.json` handles the environment runtime settings.

### ⌨️ Railway CLI Setup (Reproduction)
To set up or reproduce this environment via the [Railway CLI](https://docs.railway.app/guides/cli):

1. **Login**: `railway login`
2. **Link Project**: `railway link --project 390e801c-866e-4bee-a143-b2432d40e778`
3. **Add MySQL**: `railway add --database mysql`
4. **Configure MySQL Variables**:
   ```bash
   railway variable set --service MySQL \
     MYSQL_DATABASE=expense_report \
     MYSQL_ROOT_PASSWORD=your_root_password \
     MYSQLUSER=root \
     'MYSQL_PUBLIC_URL=mysql://${{MYSQLUSER}}:${{MYSQL_ROOT_PASSWORD}}@${{RAILWAY_TCP_PROXY_DOMAIN}}:${{RAILWAY_TCP_PROXY_PORT}}/${{MYSQL_DATABASE}}' \
     'MYSQL_URL=mysql://${{MYSQLUSER}}:${{MYSQL_ROOT_PASSWORD}}@${{RAILWAY_PRIVATE_DOMAIN}}:3306/${{MYSQL_DATABASE}}' \
     'MYSQLDATABASE=${{MYSQL_DATABASE}}' \
     'MYSQLHOST=${{RAILWAY_PRIVATE_DOMAIN}}' \
     'MYSQLPASSWORD=${{MYSQL_ROOT_PASSWORD}}' \
     MYSQLPORT=3306
   ```
5. **Configure Backend Variables**:
   ```bash
   railway variable set --service personal-expense-report \
     'DB_HOST=${{MySQL.MYSQLHOST}}' \
     DB_PORT=3306 \
     DB_USER=root \
     'DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}' \
     'DB_NAME=${{MySQL.MYSQLDATABASE}}' \
     API_SECRET_KEY=your_secret \
     ALLOWED_ORIGINS=http://localhost:3000 \
     APP_PASSWORD=your_app_password
   ```

### 🏠 Local Testing (Docker Compose)
To emulate the Railway environment locally:
1. Ensure your `.env` file reflects the variables in `.env.example`.
2. Run `docker-compose up --build`.
3. Access the frontend at `http://localhost:3000`.

    subgraph Storage ["💾 Data Storage (Kimball Star Schema)"]
        direction TB
        Fact[("� Fact: Transactions")]
        Dim[("� Dim: Categories")]
        Fact -- "FK: category_id" --> Dim
    end

    %% Interactions
    User -- "Views & Interacts" --> UI
    User -- "Uploads CSV" --> UI

    UI -- "Fetches Metrics & Data" --> API
    UI -- "Sends File" --> API

    Pandas -- "Categorization Logic" --> API
    DBLogic <--> Fact
    DBLogic <--> Dim

    %% Styling
    classDef frontend fill:#E3F2FD,stroke:#2196F3,stroke-width:2px,color:#0D47A1;
    classDef backend fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px,color:#1B5E20;
    classDef storage fill:#FFF3E0,stroke:#FF9800,stroke-width:2px,color:#E65100;
    classDef user fill:#FCE4EC,stroke:#E91E63,stroke-width:2px,color:#880E4F;

    class Frontend,UI,Charts frontend;
    class Backend,API,Pandas,DBLogic backend;
    class Storage,Fact,Dim storage;
    class User user;
```

#### Analytical Data Model (Star Schema)
The project utilizes a **Kimball Star Schema** to ensure high-performance analytical queries and clean data organization:
- **Fact Table (`transactions`)**: Stores quantitative metrics (amounts) and foreign keys to dimensions.
- **Dimension Table (`dim_categories`)**: Stores descriptive attributes for categorization:
    - `flow_type`: `income`, `expense`, or `transfer`.
    - `flow_sub_type`: 
        - `income`: `active`, `passive`, `exceptional`, `other`.
        - `expense`: `fixed`, `variable`, `savings`, `investment`.
        - `transfer`: `internal`.
    - `category`: Specific English category name (e.g., `Salary`, `Rent`, `Groceries`).
    - `is_recurrent`: Boolean flag (0/1) for subscription/salary tracking.


#### Component Breakdown
- **Next.js Frontend**: A modern, responsive SPA using Tailwind CSS for styling and Lucide icons. All API interactions are handled via a centralized `apiClient.ts` for consistent security and performance.
- **FastAPI Backend**: A high-performance Python API handling business logic and data orchestration. Protected by custom API Key middleware.
- **Pandas Processor**: Handles complex CSV manipulations and deterministic keyword-based auto-categorization.
- **MySQL Storage**: Robust relational database using a star schema for persistence and analytical flexibility.

#### Data Lifecycle
1. **Upload**: User uploads CSV bank statements.
2. **Standardization**: `data_processor.py` cleans descriptions and standardizes date/amount formats.
3. **Categorization**: Transactions are mapped to English categories in `dim_categories` using a deterministic keyword-matching engine.
    - `category`: Specific category name (e.g., `Salary`, `Rent`, `Groceries`).
    - `is_recurrent`: Boolean flag for subscription/salary tracking.

### 🔐 Security Schema
1.  **Session Authorization**: A password-protected login page sets an `httpOnly` session cookie via Next.js Server Actions/Routes.
2.  **Server-Side Supabase Client**: All database operations happen within API routes using a `supabase-js` client initialized with a `SUPABASE_SERVICE_ROLE_KEY`, ensuring no private keys are ever exposed to the client.

---

## 🚀 Deployment

### Supabase Setup
1. Create a project at [Supabase.com](https://supabase.com).
2. Execute the schema initialization (found in `supabase/migrations` or provided via SQL editor).
3. Copy your `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

### Vercel / Railway Deployment (Frontend + API)
Since the app is now a unified Next.js project, you only need to deploy the `app-frontend` directory.

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Private Service Role Key (Server-side) |
| `APP_PASSWORD` | Password for your web login |

### 🛠️ Local Development
1. Clone the project and navigate to `app-frontend`.
2. Install dependencies: `npm install`.
3. Create a `.env.local` file with your Supabase credentials.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Access the app at `http://localhost:3000`.

### 🧪 Running Tests
```bash
npm test
```

### How it works?
The project is a unified Next.js application.
- **Frontend**: Responsive dashboard built with React and Tailwind.
- **API**: Serverless route handlers managing transaction logic and database interaction.
- **Data Persistence**: Supabase handles the heavy lifting of data storage and schema management.
Make sure it is *all green* before validating your feature (PR).
