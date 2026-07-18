# Dossier de validation d'architecture — Phase 2

**Statut :** Proposition soumise au Fondateur — En attente d'arbitrage
**Date :** 2026-07-18
**Auteur :** Antigravity
**Branche :** `architecture/phase-2-technical-design`
**Contexte :** Phase 2 — Architecture technique

---

## 1. Objet du dossier

Ce dossier récapitule les choix d'architecture structurels proposés pour le prototype Athena, conçus dans le respect des contraintes de budget (`0 €`), de portabilité et d'indépendance vis-à-vis des fournisseurs définies par la décision **DEC-002**.

L'objectif est d'obtenir la validation du Fondateur ABYSS sur ces choix techniques structurants afin d'autoriser le passage à la phase de conception détaillée (Phase 2.2).

---

## 2. Synthèse des choix soumis à validation

### 2.1 Vue d'ensemble de l'architecture
* **Principe :** Isolation en trois couches étanches (Domaine, Application, Infrastructure). Le code métier (Domaine) n'a aucune dépendance directe avec les bibliothèques et API externes.
* Lien relatif : [Consulter l'aperçu de l'architecture](technical-architecture-overview.md)

### 2.2 ADR-001 — Choix d'un monolithe modulaire
* **Décision :** Conception sous la forme d'une base de code unique (monolithe) structurée en modules logiques étanches communiquant exclusivement par des interfaces définies.
* **Statut proposé :** Proposé
* Lien relatif : [Consulter ADR-001](adr/ADR-001-modular-monolith.md)

### 2.3 ADR-002 — Abstraction de la source de données sportives
* **Décision :** Utilisation d'un modèle Ports et Adaptateurs. L'application interagit avec l'interface `DataProviderPort` et les adaptateurs tiers (football-data.org) encapsulent les appels d'API HTTPS et le mapping.
* **Statut proposé :** Proposé (En attente d'approbation formelle)
* Lien relatif : [Consulter ADR-002](adr/ADR-002-provider-abstraction.md)

### 2.4 ADR-003 — Modèle de domaine normalisé et agnostique
* **Décision :** Création d'entités métiers propres à Athena (`AthenaMatch`, `AthenaTeam`) servant de pivot de données. Les adaptateurs gèrent la traduction des structures d'API externes vers ce domaine.
* **Statut proposé :** Proposé
* Lien relatif : [Consulter ADR-003](adr/ADR-003-normalized-domain-model.md)

---

## 3. Fiche d'arbitrage du Fondateur

*Cochez les options autorisées :*

### 3.1 Vue d'ensemble et principes directeurs
- [ ] **Approuvé** — La structure en couches et l'agnosticisme technique sont validés.
- [ ] **Refusé** — Modifications requises : `À compléter`

### 3.2 Choix du Monolithe Modulaire (ADR-001)
- [ ] **Approuvé** — Le développement initial sous forme de monolithe modulaire à budget 0 € est validé.
- [ ] **Refusé** — Choix alternatif requis : `À compléter`

### 3.3 Abstraction et Modèle de Domaine (ADR-002 & ADR-003)
- [ ] **Approuvé** — Le modèle Ports & Adaptateurs et le domaine normalisé sont validés. Le prototype provisoire s'appuiera sur football-data.org avec ces garde-fous.
- [ ] **Refusé** — Modifications requises : `À compléter`

---

## 4. Conditions de passage à la conception détaillée

Le passage à la conception détaillée des adaptateurs et interfaces est proposé sous réserve des engagements suivants :
1. Aucun composant d'infrastructure payant (SaaS, Cloud payant, base de données managée) ne sera introduit à cette étape (budget maintenu à 0 €).
2. L'injection des dépendances (sélection de l'adaptateur actif) sera configurable dynamiquement sans modification du code applicatif.
3. Les structures de données d'ingestion football-data.org seront documentées au niveau de l'adaptateur sans fuite dans le domaine métier d'Athena.

---

## 5. Décision finale du Fondateur

**Décision :**
`À compléter`

**Justification :**
`À compléter`

**Date :**
`À compléter`

**Signature :**
`☐ En attente de signature humaine`

---

> **Made in Abyss : Spark by the King**
