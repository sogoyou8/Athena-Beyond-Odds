# ADR-004 — Choix du langage de développement principal

* **Statut :** Accepté (Décision Fondateur — 2026-07-18)
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`

---

## Contexte et Problématique

L'architecture retenue (monolithe modulaire, ports et adaptateurs) est agnostique vis-à-vis du langage d'implémentation. Le choix du langage conditionne cependant :

* la productivité de développement et la facilité d'itération sur le prototype ;
* la sécurité de typage des entités du domaine (`AthenaMatch`, `AthenaTeam`, `AthenaSeason`) ;
* la qualité des outils de test et de contrôle des frontières de modules ;
* la compatibilité avec les plans d'hébergement gratuits respectant la contrainte budgétaire de `0 €`.

La décision porte sur le langage de la couche applicative principale (serveur, domaine, infrastructure). Elle n'exclut pas un langage différent pour d'éventuels scripts ou outils auxiliaires.

## Options examinées

### Option A — TypeScript (sur Node.js)

**Description :** Sur-ensemble typé de JavaScript exécuté par le moteur Node.js. L'écosystème npm offre des bibliothèques pour l'accès HTTP, la validation de schémas, les ORM et les frameworks applicatifs.

**Avantages :**
* Typage statique optionnel (interfaces, types) adapté aux entités du domaine normalisé.
* Détection anticipée des erreurs de mapping (adaptateurs) à la compilation plutôt qu'à l'exécution.
* Compatibilité native avec les plans gratuits (Render, Fly.io, Railway) sans couche de compilation supplémentaire.
* Outillage mature : `tsc`, `eslint`, `vitest`, `dependency-cruiser` pour contrôler les frontières de modules.
* L'équipe a déjà produit des scripts en JavaScript dans ce dépôt (base de connaissance existante).

**Inconvénients :**
* Performances I/O asynchrone excellentes, mais performances CPU limitées par rapport à des langages compilés (Rust, Go) — non critique pour le volume de données du prototype.
* Configuration initiale `tsconfig` / outillage à établir.

---

### Option B — Python

**Description :** Langage interprété généraliste, très utilisé dans les domaines de la data science et du traitement probabiliste.

**Avantages :**
* Écosystème riche pour les calculs statistiques (`numpy`, `scipy`, `pandas`) — pertinent pour le moteur de probabilités futur.
* Facilité de prototypage et lisibilité du code.

**Inconvénients :**
* Typage nominal par annotations (`mypy`) moins expressif pour les contrats stricts de ports et adaptateurs.
* Gestion asynchrone plus récente et moins idiomatique (`asyncio`) que Node.js.
* Plans d'hébergement gratuits moins répandus et souvent limités en mémoire pour des processus Python persistants.
* Rupture avec la base de code JavaScript existante dans le dépôt.

---

### Option C — Go

**Description :** Langage compilé et statiquement typé de Google, performant et peu verbeux.

**Avantages :**
* Performances réseau et de concurrence très élevées.
* Binaire unique produit à la compilation — déploiement simple.

**Inconvénients :**
* Courbe d'apprentissage plus élevée et rupture complète avec les scripts existants.
* Écosystème plus limité pour les bibliothèques de probabilités et d'analyse de données.
* Surqualifié pour un prototype à `0 €`.

---

## Décision

> **À arbitrer par le Fondateur.** Aucune technologie définitive n'est sélectionnée à ce stade.

Le Fondateur a retenu **Option A — TypeScript / Node.js**.

Justification validée :
* Alignement avec la base de code JavaScript existante dans le dépôt.
* Typage statique adapté aux contrats des ports et adaptateurs (ADR-002).
* Outillage disponible sans dépense (`eslint`, `vitest`, `dependency-cruiser`).
* Compatibilité confirmée avec les plans d'hébergement gratuits.
* Choix simple, gratuit et réversible, cohérent avec la contrainte de budget nul.

L'écriture de code applicatif reste conditionnée à la finalisation des contrats de domaine et de la structure détaillée du projet.

## Conséquences

### Positives (si Option A retenue)
* Cohérence de l'écosystème entre scripts auxiliaires existants et code applicatif.
* Interfaces TypeScript comme contrat machine-lisible des ports (`DataProviderPort`, `MatchRepositoryPort`).
* Tests unitaires de domaine déconnectés des fournisseurs réels.

### Négatives / Risques (si Option A retenue)
* Les performances CPU du moteur de probabilités devront être surveillées si les algorithmes deviennent intensifs ; une migration partielle vers un module natif (via N-API) resterait possible sans remplacer l'ensemble de l'application.

---

> **Made in Abyss : Spark by the King**
