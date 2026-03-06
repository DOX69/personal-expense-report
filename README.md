# Personal Expense Report ✨

![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)
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
Il permet d'importer des fichiers d'extraction bancaire (CSV), d'analyser, de classer et de sauvegarder automatiquement les transactions effectuées dans une base de données, pour ensuite proposer différentes visualisations et métriques (KPIs) pertinentes pour la bonne tenue d'un budget (Income / Expenses / Net Cashflow).

## Tech Stack

Le projet s'appuie sur ces technologies principales :
- **Frontend / Application :** Streamlit
- **Data Processing :** Pandas (manipulation de CSV, filtrage, gestion des dates et catégories).
- **Data Visualization :** Plotly Express et Plotly Graph Objects (Graphiques temporels, histogrammes de caisse, et diagrammes de Sankey pour visualiser les flux de trésorerie).
- **Base de données :** MySQL (communicant à l'application via `mysql-connector-python`).
- **Déploiement / Conteneurisation :** Docker et Docker Compose.
- **Tests :** Pytest (test unitaire) & Pytest-cov.

## Architecture

```text
personal-expense-report/
├── app/                        # Code source de l'application
│   ├── main.py                 # Point d'entrée Streamlit (Routage et initialisation BD)
│   ├── auth.py                 # Module d'authentification basique.
│   ├── db.py                   # Connecteur MySQL et requêtes SQL.
│   ├── data_processor.py       # Logique de traitement des CSV et auto-catégorisation.
│   └── ui/                     # Composants visuels de l'interface graphique.
│       ├── dashboard.py        # Vue principale (KPIs, Graphiques Plotly).
│       └── sidebar.py          # Filtres et menus (ex: sélection de période).
├── tests/                      # Suite de tests unitaires (Pytest).
├── sample-data/                # (Optionnel) Jeux de données d'exemple.
├── Dockerfile                  # Image Docker pour l'application Streamlit.
├── docker-compose.yml          # Orchestration des services app et db (MySQL).
├── requirements.txt            # Dépendances Python.
└── pyproject.toml              # Métadonnées du projet (version, deps, outillages).
```

### Le Cycle de vie des données
1. **L'utilisateur** dépose un ou plusieurs `CSV` depuis l'interface Upload. Les colonnes obligatoires dans le CSV sont: `Date de début`, `Description`, `Montant`, `Devise`.
2. Le `data_processor.py` le lit, le nettoie (reformate les colonnes), vérifie les doublons et va appliquer une auto-catégorisation basée sur la colonne "Description" des transactions (Transport, Repas, Courses, Virements...).
3. Ces nouvelles données normalisées sont enregistrées en base de données via `db.py` (UPSERT: Mise à jour en cas de conflits sur des clés doublons).
4. **L'utilisateur** peut consulter l'onglet "Dashboard" pour filtrer ses dépenses sur une période temporelle. `dashboard.py` va générer les diagrammes Plotly de Cashflow (Graph + Sankey) et les grands indicateurs au moyen de cartes de métriques (UI CSS personnalisée).

## Comment ça marche ?

Le projet est conteneurisé. Sans aucune dépendance logicielle autre que Docker, vous pouvez faire tourner l'application et sa base de données associée.
- Le backend tourne exposant un port **8501** pour Streamlit.
- La BDD tourne en tâche de fond et garantit la persistance des données générées (dans un volume docker dédié persistant localement : `db_data`).

## Installation & Utilisation

### Pré-requis
- **Docker** et **Docker Compose** d'installés sur votre machine (ou Docker Desktop).

### 1. Cloner le repo
```bash
git clone <votre-url-git> personal-expense-report
cd personal-expense-report
```

### 2. Variables d'environnement (Optionnel)
Le composant est pensé pour tourner nativement sans `.env` lors du lancement en développement. 
Mais vous pouvez customiser librement la base de données en ajoutant les variables d'environnement suivantes dans un `.env`:
`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_ROOT_PASSWORD`

### 3. Exécuter l'application
Lancez l'orchestration de tous les outils avec docker compose en arrière plan :
```bash
docker-compose up --build -d
```
Docker va automatiquement :
- Lancer le service `db` en récupérant l'image MySQL 8.0 logicielle et lui créer son volume local.
- Bâtir l'image de `app` en installant ses dépendances via le `Dockerfile`.
- Lancer l'application web.

### 4. Accès
L'interface Streamlit est alors accessible sur navigateur à l'adresse URL :
[http://localhost:8501](http://localhost:8501)

Rendez vous dans la partie "Upload" pour fournir votre premier relevé bancaire CSV.

---

## Développement

Si vous souhaitez contribuer, apporter des modifications ou développer vos propres intégrations.

### Pré-requis de développement local
- Python version `>= 3.11`.
- Optionnel mais recommandé: un serveur MySQL local actif *ou* lancer uniquement la base de données via docker : `docker-compose up db -d`

### Mise en place de l'environnement Python
1. **Créer un environnement virtuel :**
```bash
python -m venv .venv
source .venv/bin/activate       # MacOS / Linux
.\.venv\Scripts\activate      # Windows
```
2. **Installation des dépendances :**
```bash
pip install -r requirements.txt
```

### Configuration Base de Données
Si vous développez en local sans passer par le composant unifié `docker-compose up`, votre application Stremlit va chercher une base de données MySQL fonctionnelle pour insérer des données. Assurez-vous d'avoir exporté dans votre shell les identifiants locaux correspondants ou les avoir insérés en "secrets" si vous testez une autre BDD:
```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=rootpassword
export DB_NAME=expense_report
```

### Lancement en mode Live Reload
Vous pouvez à présent relancer l'outil en mode Dev avec rechargement à chaud à chaque sauvegarde de vos fichiers Python :
```bash
streamlit run app/main.py --server.port=8501
```

### Tests
Pour lancer les suites de tests locales et vérifier que vos modifications n'entraînent pas de régression du traitement des Dataframes ou du connecteur base de données :
```bash
pytest tests/ -v
```
Pensez à regarder si vous avez bien couvert l'aspect que vous étiez en train de coder via les indicateurs de coverage.
```bash
pytest --cov=app tests/
```

### Git flow & TDD
Nous recommandons fortement une approche **Test-Driven-Development (TDD)**:
1. Ecrire d'abord le test en casculant dans les `tests/`. Le fail est garanti (**Red**)
2. Coder la logique nécessaire au strict passage au test dans `app/` (**Green**)
3. Opérer une session de **Refactorisation** tout en gardant l'ensemble de la suite de tests valides.
Assurez-vous qu'elle est *all green* avant de valider votre fonctionnalité (PR).
