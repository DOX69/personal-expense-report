# Personal Expense Report ✨

![CI Status](https://github.com/DOX69/personal-expense-report/actions/workflows/ci.yml/badge.svg)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

🌎 **[Français (French Version)](#version-française)** | 🇬🇧 **[English Version](#english-version)**

---

## 🇬🇧 English Version

### About
**Personal Expense Report** is a financial dashboard for tracking personal expenses. 
It allows users to import bank statement files (CSV), automatically analyze, categorize, and save transactions in a database. It provides various visualizations and relevant metrics (KPIs) for effective budget management (Income / Expenses / Net Cashflow), as well as tracking recurring subscriptions and budgets.

### Tech Stack
The project uses a modern decoupled stack:
- **Frontend / App:** Next.js (React), Tailwind CSS.
- **Backend / API:** FastAPI (Python).
- **Data Processing:** Pandas.
- **Data Visualization:** Recharts.
- **Database:** MySQL.
- **Deployment & Containerization:** Docker and Docker Compose.
- **Testing:** Jest & React Testing Library (Frontend), Pytest (Backend).

### Architecture

```mermaid
graph TD
    User((User))
    
    subgraph Frontend ["App Frontend (Next.js)"]
        Dashboard[Dashboard Page]
        Transactions[Transactions Page]
        Import[Import Page]
        Charts[Recharts Components]
    end

    subgraph Backend ["App Backend (FastAPI)"]
        API[FastAPI Endpoints]
        Processor[Data Processor (Pandas)]
        DB_Logic[DB Logic (Connector)]
    end

    subgraph Storage ["Data Storage"]
        CSV[(transactions.csv)]
        MySQL[(MySQL Database)]
    end

    User -->|Views/Interacts| Dashboard
    User -->|Uploads CSV| Import
    Dashboard -->|Get Metrics/Sankey| API
    Dashboard -->|Get Transactions| API
    Import -->|Upload File| API
    API -->|Parse & Clean| Processor
    Processor -->|Update/Read| CSV
    Processor -->|Save/Select| DB_Logic
    DB_Logic -->|Query/Insert| MySQL
    API -->|Fetch Data| DB_Logic
```

### Installation & Usage

#### Case A: Docker (Recommended)
1. **Prerequisites**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
2. **Clone & Build**:
   ```bash
   git clone https://github.com/DOX69/personal-expense-report.git
   cd personal-expense-report
   docker-compose up --build -d
   ```
3. **Access**: 
   - App: [http://localhost:3000](http://localhost:3000)
   - Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

#### Case B: Setup Guide (Manual)
1. Install Python 3.11+, Node.js 18+, Git, and MySQL.
2. Clone the repository.
3. Setup Backend:
   ```bash
   python -m venv .venv
   source .venv/bin/activate # or .\.venv\Scripts\activate on Windows
   pip install -r requirements.txt
   cd app-backend
   uvicorn main:app --reload --port 8000
   ```
4. Setup Frontend (new terminal):
   ```bash
   cd app-frontend
   npm install
   npm run dev
   ```

---

## 🇫🇷 Version Française

### A propos
**Personal Expense Report** est un tableau de bord financier de suivi de dépenses personnelles. 
Il permet d'importer des fichiers d'extraction bancaire (CSV), d'analyser, de classer et de sauvegarder automatiquement les transactions effectuées dans une base de données, pour ensuite proposer différentes visualisations et métriques (KPIs) pertinentes pour la bonne tenue d'un budget (Income / Expenses / Net Cashflow), ainsi que le suivi de budgets et d'abonnements récurrents.

### Tech Stack
Le projet a été migré sur une stack moderne découplée :
- **Frontend / Application :** Next.js (React), Tailwind CSS.
- **Backend / API :** FastAPI (Python).
- **Data Processing :** Pandas.
- **Data Visualization :** Recharts.
- **Base de données :** MySQL.
- **Déploiement / Conteneurisation :** Docker et Docker Compose.
- **Tests :** Jest & React Testing Library (Frontend), Pytest (Backend).

### Installation & Utilisation

#### Cas A: Docker (Recommandé)
1. **Pré-requis**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé.
2. **Cloner et Construire**:
   ```bash
   git clone https://github.com/DOX69/personal-expense-report.git
   cd personal-expense-report
   docker-compose up --build -d
   ```
3. **Accès**: 
   - App: [http://localhost:3000](http://localhost:3000)
   - Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

#### Cas B: Guide d'installation (Manuel)
1. Installez Python 3.11+, Node.js 18+, Git, et MySQL.
2. Clonez le dépôt.
3. Backend :
   ```bash
   python -m venv .venv
   source .venv/bin/activate # ou .\.venv\Scripts\activate sous Windows
   pip install -r requirements.txt
   cd app-backend
   uvicorn main:app --reload --port 8000
   ```
4. Frontend (nouveau terminal) :
   ```bash
   cd app-frontend
   npm install
   npm run dev
   ```

### Développement
Nous recommandons fortement une approche **Test-Driven-Development (TDD)**:
1. Ecrire d'abord le test (fail garanti - **Red**)
2. Coder la logique nécessaire au passage du test (**Green**)
3. Opérer une session de **Refactorisation**.
Assurez-vous que la suite est *all green* avant de valider via PR.
