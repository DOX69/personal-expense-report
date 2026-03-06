# Personal Expense Report ✨

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## Navigation
- [A propos](#a-propos)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Comment ça marche ?](#comment-ça-marche-)
- [Installation & Utilisation](#installation--utilisation)
- [Développement](#développement)

---

## A propos

**Personal Expense Report** est un tableau de bord financier de suivi de dépenses personnelles. 
Il permet d'importer des fichiers d'extraction bancaire (CSV), d'analyser, de classer et de sauvegarder automatiquement les transactions effectuées dans une base de données, pour ensuite proposer différentes visualisations et métriques (KPIs) pertinentes pour la bonne tenue d'un budget (Income / Expenses / Net Cashflow), ainsi que le suivi de budgets et d'abonnements récurrents.

## Tech Stack

Le projet a récemment été migré sur une stack moderne découplée :
- **Frontend / Application :** Next.js (React), Tailwind CSS.
- **Backend / API :** FastAPI (Python).
- **Data Processing :** Pandas (manipulation de CSV, filtrage, gestion des dates et catégories).
- **Data Visualization :** Recharts (Graphiques temporels, histogrammes de caisse, et diagrammes de Sankey).
- **Base de données :** MySQL (communicant à l'API via `mysql-connector-python`).
- **Déploiement / Conteneurisation :** Docker et Docker Compose.
- **Tests :** Jest & React Testing Library (Frontend), Pytest (Backend).

## Architecture

```text
personal-expense-report/
├── app-frontend/               # Application React Next.js (Interface utilisateur)
│   ├── src/
│   │   ├── app/                # Pages Next.js (Dashboard, Transactions, Budgets...)
│   │   └── components/         # Composants React (Graphiques, UI, Layout)
│   ├── package.json            # Dépendances Node.js
│   └── tailwind.config.ts      # Configuration de Tailwind CSS
├── app-backend/                # API FastAPI Python
│   ├── main.py                 # Point d'entrée FastAPI (Endpoints REST)
│   ├── db.py                   # Connecteur MySQL et requêtes SQL.
│   ├── data_processor.py       # Logique de traitement des CSV et auto-catégorisation.
│   └── tests/                  # Suite de tests unitaires et intégration (Pytest).
├── tests/                      # Anciens tests globaux ou e2e
├── sample-data/                # (Optionnel) Jeux de données d'exemple.
├── docker-compose.yml          # Orchestration des services app-frontend, app-backend et db (MySQL).
├── requirements.txt            # Dépendances Python.
└── pyproject.toml              # Métadonnées du projet python (version, deps, outillages).
```

### Le Cycle de vie des données
1. **L'utilisateur** dépose un ou plusieurs `CSV` depuis l'interface Upload (ou Drag & Drop dans les Transactions).
2. L'API FastAPI via `data_processor.py` le lit, le nettoie, vérifie les doublons et va appliquer une auto-catégorisation basée sur la colonne "Description" des transactions.
3. Ces nouvelles données normalisées sont enregistrées en base de données MySQL via `db.py`.
4. **L'utilisateur** peut consulter l'onglet "Dashboard" pour visualiser ses dépenses. Le frontend Next.js interroge les endpoints FastAPI pour générer les graphiques Recharts (Cashflow, KPIs, Sankey).

## Comment ça marche ?

Le projet est entièrement conteneurisé. Sans aucune dépendance logicielle autre que Docker, vous pouvez faire tourner l'application et sa base de données associée.
- Le backend (FastAPI) tourne en exposant le port **8000**.
- Le frontend (Next.js) tourne en affichant l'interface sur le port **3000**.
- La BDD (MySQL) tourne en tâche de fond et garantit la persistance des données (volume docker persistant localement : `db_data`).

## Installation & Utilisation

### Pré-requis
- **Docker** et **Docker Compose** d'installés sur votre machine (ou Docker Desktop).

### 1. Cloner le repo
```bash
git clone https://github.com/votre-nom/personal-expense-report.git
cd personal-expense-report
```

### 2. Variables d'environnement (Optionnel)
Le projet contient un `docker-compose.yml` préconfiguré, mais vous pouvez sécuriser ou modifier la base de données via un `.env` :
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_ROOT_PASSWORD`

### 3. Exécuter l'application
Lancez l'orchestration de tous les outils avec docker compose en arrière plan :
```bash
docker-compose up --build -d
```

### 4. Accès
L'interface web Next.js est alors accessible sur votre navigateur à l'adresse URL :
**[http://localhost:3000](http://localhost:3000)**

L'API Rest (et sa documentation Swagger auto-générée) est accessible ici :
**[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## Développement

Si vous souhaitez contribuer, apporter des modifications ou développer vos propres intégrations.

### Pré-requis de développement local
- Node.js `>= 18` (pour le frontend Next.js)
- Python `>= 3.11` (pour le backend FastAPI)
- Un serveur MySQL local actif *ou* lancé via docker : `docker-compose up db -d`

### Base de Données
Exportez les identifiants locaux correspondants ou installez un `.env` :
```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=rootpassword
export DB_NAME=expense_report
```

### Backend (Python / FastAPI)
1. **Créer un environnement virtuel :**
```bash
python -m venv .venv
source .venv/bin/activate       # MacOS / Linux
.\.venv\Scripts\activate        # Windows
```
2. **Installation et Lancement :**
```bash
pip install -r requirements.txt
pip install -r app-backend/requirements-dev.txt # S'il y a
cd app-backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
3. **Tests Backend :**
```bash
python -m pytest tests/ -v
```

### Frontend (Node.js / Next.js)
1. **Installation des dépendances :**
```bash
cd app-frontend
npm install
```
2. **Lancer le serveur de développement :**
```bash
npm run dev
```
*(Le frontend tournera par défaut sur http://localhost:3000)*
3. **Tests Frontend (Jest) :**
```bash
npm run test
```

### Git flow & TDD
Nous recommandons fortement une approche **Test-Driven-Development (TDD)** :
1. Ecrire d'abord le test en casculant dans les dossiers `tests/` ou `__tests__/`. Le fail est garanti (**Red**)
2. Coder la logique nécessaire au strict passage au test (**Green**)
3. Opérer une session de **Refactorisation** tout en gardant l'ensemble de la suite de tests valides.
Assurez-vous qu'elle est *all green* avant de valider votre fonctionnalité (PR).
