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

```text
  +-------------------------------------------------+
  |                   👤 User                       |
  +-------------------------------------------------+
                          |
                          v
  +-----------------------+-------------------------+
  |         🖥️ App Frontend (Next.js)              |
  |  (UI, Recharts, Client-side Authorization)      |
  +-----------------------+-------------------------+
                          |
                (API calls via X-API-Key)
                          v
  +-----------------------+-------------------------+
  |         ⚙️ App Backend (FastAPI)               |
  | (Python API, Pandas Processor, DB Connector)    |
  +-----------------------+-------------------------+
                          |
                  (MySQL Connector)
                          v
  +-----------------------+-------------------------+
  |         💾 Data Storage (MySQL)                 |
  |   (Kimball Star Schema: Facts & Dimensions)     |
  +-------------------------------------------------+
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
- **Next.js Frontend**: A modern, responsive SPA using Tailwind CSS for styling and Lucide icons.
- **FastAPI Backend**: A high-performance Python API handling business logic and data orchestration.
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
3. **Restard without data loss**:
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

