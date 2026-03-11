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
4. **Persistence**: Validated and categorized data is stored in the Star Schema.
5. **Visualization**: Backend calculates metrics (KPIs) by joining facts and dimensions, excluding internal transfers for accurate cashflow analysis.

### How it works ?
The project is completely containerized. Without any software dependency other than Docker, you can run the application and its associated database.
- The backend (FastAPI) runs by exposing port **8000**.
- The frontend (Next.js) runs by displaying the interface on port **3000**.
- The DB (MySQL) runs in the background and guarantees data persistence (local persistent docker volume: `db_data`).

### Installation & Usage

#### Case A: Docker (Recommended)
The simplest way to run the project.

1. **Prerequisites**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
2. **Clone & Build**:
   ```bash
   git clone https://github.com/DOX69/personal-expense-report.git
   cd personal-expense-report
   docker-compose up --build -d
   ```
3. **Restart without data loss**:
   ```bash
   docker compose up -d --build --force-recreate backend frontend db
   ```
3. **Access**: 
   - App: [http://localhost:3000](http://localhost:3000)
   - Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

#### Case B: Windows Setup Guide (Manual)
Follow these steps to set up a full development environment on a fresh Windows machine.

1. **Install Dependencies**
Ensure you have the following installed:
- **Python 3.11+**: [Download here](https://www.python.org/downloads/windows/). *Check "Add Python to PATH" during installation.*
- **Node.js 18+**: [Download here](https://nodejs.org/).
- **Git**: [Download here](https://git-scm.com/download/win).
- **MySQL/MariaDB**: (Or use Docker for just the database: `docker-compose up db -d`).

2. **Clone the Project**
Open a Terminal (PowerShell or CMD) and run:
```powershell
git clone https://github.com/DOX69/personal-expense-report.git
cd personal-expense-report
```

3. **Backend Setup**
```powershell
# Create Virtual Environment
python -m venv .venv
.\.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start Backend (API)
cd app-backend
uvicorn main:app --reload --port 8000
```

4. **Frontend Setup**
Open a *new* terminal window:
```powershell
cd personal-expense-report/app-frontend

# Install node packages
npm install

# Start Frontend (Dashboard)
npm run dev
```

5. **Verify the Installation**
- Navigate to `http://localhost:3000`.
- Go to the **Import** tab and upload a test CSV to populate the dashboard!

### Development

If you wish to contribute, make modifications or develop your own integrations.

#### Local Development Prerequisites
- Node.js `>= 18` (for the Next.js frontend)
- Python `>= 3.11` (for the FastAPI backend)
- An active local MySQL server *or* launched via docker: `docker-compose up db -d`

#### Database
Export the corresponding local credentials or install a `.env`:
```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=rootpassword
export DB_NAME=expense_report
```

#### Backend (Python / FastAPI)
1. **Create a virtual environment:**
```bash
python -m venv .venv
source .venv/bin/activate       # MacOS / Linux
.\.venv\Scripts\activate        # Windows
```
2. **Installation and Launch:**
```bash
pip install -r requirements.txt
pip install -r app-backend/requirements-dev.txt # If exists
cd app-backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
3. **Backend Tests:**
```bash
python -m pytest tests/ -v
```

#### Frontend (Node.js / Next.js)
1. **Install dependencies:**
```bash
cd app-frontend
npm install
```
2. **Launch the development server:**
```bash
npm run dev
```
*(The frontend will run by default on http://localhost:3000)*
3. **Frontend Tests (Jest):**
```bash
npm run test
```

#### Git flow & TDD
We highly recommend a **Test-Driven-Development (TDD)** approach:
1. Write the test first by going into the `tests/` or `__tests__/` folders. A fail is guaranteed (**Red**)
2. Code the necessary logic to strict pass the test (**Green**)
3. Operate a **Refactoring** session while keeping the entire test suite valid.
Make sure it is *all green* before validating your feature (PR).

