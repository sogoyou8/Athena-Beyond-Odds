# Conception détaillée — Structure du Projet

* **Statut :** Approuvé (DEC-004)
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`

---

## 1. Principes d'organisation

Conformément à **ADR-001 (Monolithe modulaire)** et **ADR-002 (Abstraction des fournisseurs)**, l'arborescence de fichiers du code source respecte une architecture hexagonale (Clean Architecture) stricte au sein de modules logiques étanches.

Chaque module ou dossier applicatif regroupe les couches suivantes :
1. **Domain (Noyau métier)** : Structures de données normalisées, entités de domaine et règles métier pures. Cette couche ne dépend d'aucune bibliothèque externe ni d'aucune autre couche.
2. **Application (Cas d'usage)** : Orchestration de la logique métier, définition des ports (interfaces d'infrastructure et de services). Elle ne dépend que de la couche Domain.
3. **Infrastructure (Adaptateurs secondaires)** : Implémentations concrètes des ports (accès HTTP, persistance SQLite, cache mémoire local, variables d'environnement). Elle dépend de la couche Application et de bibliothèques externes.
4. **Presentation (Adaptateurs primaires)** : Contrôleurs HTTP (Express), points d'accès API, pages de rendu pour la visualisation. Elle dépend de la couche Application.

---

## 2. Arborescence conceptuelle du projet

Voici la structure de dossiers prévue pour le prototype, organisée par modules et par couches :

```text
athena-beyond-odds/
│
├── docs/                               # Documentation d'architecture et d'opérations
│   └── 03-technical-architecture/      # Conceptions détaillées et ADRs
│
├── src/                                # Répertoire principal des sources
│   │
│   ├── shared/                         # Code partagé de bas niveau (sans logique métier)
│   │   ├── errors/                     # Classes d'erreurs communes
│   │   └── utils/                      # Utilitaires génériques (dates, formatage)
│   │
│   ├── domain/                         # Entités et contrats normalisés globaux
│   │   ├── Match.ts                    # Représentation d'un match (sans préfixe Athena)
│   │   ├── Team.ts                     # Représentation d'une équipe
│   │   ├── Season.ts                   # Représentation d'une saison
│   │   ├── Competition.ts              # Représentation d'une compétition (ex: Ligue 1)
│   │   └── value-objects.ts            # Objets de valeur (ex: Score, MatchStatus)
│   │
│   ├── modules/                        # Modules fonctionnels autonomes (ADR-001)
│   │   │
│   │   ├── ingestion/                  # Module responsable de l'acquisition de données sportives
│   │   │   ├── application/
│   │   │   │   ├── ports/
│   │   │   │   │   └── SportsDataProvider.ts    # Port d'abstraction du fournisseur de données
│   │   │   │   └── use-cases/
│   │   │   │       └── SyncMatchesUseCase.ts    # Cas d'usage d'ingestion et de synchronisation
│   │   │   └── infrastructure/
│   │   │       ├── providers/
│   │   │       │   ├── football-data-org/       # Adaptateur du fournisseur football-data.org
│   │   │       │   │   ├── mapper.ts            # Convertisseur de payload brut en entités normalisées
│   │   │       │   │   └── adapter.ts           # Implémentation cliente HTTP
│   │   │       │   └── InMemorySportsDataProvider.ts # Double de test pour le développement hors ligne
│   │   │       └── SportsDataProviderFactory.ts # Fabrique d'adaptateurs pilotée par .env.local
│   │   │
│   │   ├── match-center/               # Module de gestion et d'affichage des matchs
│   │   │   ├── application/
│   │   │   │   ├── ports/
│   │   │   │   │   └── MatchRepository.ts       # Port d'accès à la base de données
│   │   │   │   └── use-cases/
│   │   │   │       ├── GetLiveMatchesUseCase.ts
│   │   │   │       └── GetMatchDetailsUseCase.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── persistence/
│   │   │   │   │   ├── SQLiteMatchRepository.ts # Implémentation SQLite de persistance
│   │   │   │   │   └── InMemoryMatchRepository.ts # Alternative mémoire pure si SQLite désactivée
│   │   │   │   └── cache/
│   │   │   │       └── LocalMemoryCache.ts      # Cache en mémoire avec TTL court
│   │   │   └── presentation/
│   │   │       ├── controllers/
│   │   │       │   └── MatchCenterController.ts # Gestionnaire de routes HTTP Express
│   │   │       └── views/
│   │   │           └── templates/               # Rendu HTML basique (prototype en lecture seule)
│   │   │
│   │   └── analysis/                   # Module d'analyse (futur moteur de probabilités/XAI)
│   │       ├── domain/
│   │       └── application/
│   │
│   └── app.ts                          # Configuration globale de l'application Express (ADR-005)
│
├── tests/                              # Tests d'intégration et de validation globale
│   ├── integration/
│   └── unit/
│
├── .env.example                        # Modèle de variables d'environnement
├── .env.local                          # Variables locales (clé API, db path, etc.) - EXCLUS DE GIT
├── .gitignore                          # Règles d'exclusion Git
└── README.md                           # Documentation de démarrage du projet
```

---

## 3. Règles d'isolation et d'imports

Afin de préserver l'étanchéité des modules et d'empêcher les dépendances circulaires, les règles strictes suivantes sont établies :

1. **Pas d'import transversal interne** : Un fichier situé dans `src/modules/ingestion/` ne doit jamais importer directement un fichier interne situé dans `src/modules/match-center/` (et vice versa). Les modules communiquent uniquement via les contrats partagés du domaine général (`src/domain/`) ou à travers des évènements applicatifs.
2. **Direction des dépendances** : Les couches d'infrastructure et de présentation peuvent importer les couches d'application et de domaine. L'application ne peut importer que le domaine. Le domaine ne peut rien importer d'autre que lui-même ou des types primitifs/shared.
3. **Contrôle automatisé** : Lors de la phase d'implémentation, l'outil `dependency-cruiser` sera mis en place avec des règles de blocage dans l'outillage de CI pour interdire les violations d'architecture et les imports directs interdits.

---

> **Made in Abyss : Spark by the King**
