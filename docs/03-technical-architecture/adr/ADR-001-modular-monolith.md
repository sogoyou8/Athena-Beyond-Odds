# ADR-001 — Choix d'un monolithe modulaire pour le prototype

* **Statut :** Accepté
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`

---

## Contexte et Problématique

Le prototype Athena doit pouvoir être conçu rapidement, testé en environnement de développement local par une équipe resserrée, et déployé sans complexité opérationnelle. De plus, le budget alloué à l'infrastructure est strictement fixé à `0 €` pour cette phase. Une architecture microservices introduirait des surcoûts financiers (hébergement de multiples conteneurs, réseaux) et opérationnels (coordination, surveillance, déploiement) injustifiés à ce stade.

## Décision

Nous choisissons une architecture de **Monolithe Modulaire (Modular Monolith)** pour l'implémentation du prototype Athena sous Node.js.

* Le code sera regroupé au sein d'une base de code unique (monolithe).
* La structure sera découpée en modules logiques étanches (par exemple: `Ingestion`, `Analyse`, `MatchCenter`).
* Les communications entre modules se feront exclusivement via des interfaces (ports/contrats) bien définies, évitant les couplages directs et les requêtes transversales non contrôlées.

## Conséquences

### Positives
* **Simplicité de développement et de déploiement :** Une seule application à exécuter et déployer localement ou sur des plans cloud gratuits (Render, Vercel, Fly.io) respectant la contrainte budgétaire de `0 €`.
* **Évolutivité facilitée :** Le découpage en modules étanches prépare le terrain pour une transition naturelle vers des microservices ou fonctions cloud si la charge ou la structure de l'équipe le demande ultérieurement.
* **Performance :** Les appels intra-processus évitent les latences réseau inhérentes aux architectures distribuées.

### Négatives / Risques
* **Rigueur requise :** L'équipe doit veiller à ne pas violer les frontières des modules (pas d'importations directes de fichiers internes d'un autre module). Des outils de contrôle (linter, dépendances de modules comme `dependency-cruiser` ou règles TypeScript) devront être configurés en Phase 2.

---

> **Made in Abyss : Spark by the King**
