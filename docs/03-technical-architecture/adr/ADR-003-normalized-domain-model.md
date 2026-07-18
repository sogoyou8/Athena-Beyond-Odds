# ADR-003 — Modèle de domaine normalisé et agnostique

* **Statut :** Accepté
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`

---

## Contexte et Problématique

Les fournisseurs de données sportives utilisent des vocabulaires, des structures de données et des conventions de nommage très différents. Par exemple, une rencontre peut être appelée `match` chez l'un, `fixture` chez l'autre, et identifiée par des formats d'ID numériques ou textuels variés. Si l'application Athena utilisait ces structures brutes en interne, toute modification chez le fournisseur polluerait les composants de calcul de probabilités et les interfaces utilisateur, augmentant drastiquement le risque d'anomalies.

## Décision

Nous créons et imposons un **Modèle de Domaine Normalisé et Agnostique** au cœur de l'application Athena.

* **Normalisation des entités :** L'application manipule exclusivement des classes/interfaces définies par Athena (ex: `AthenaMatch`, `AthenaTeam`, `AthenaSeason`).
* **Format d'identifiant unifié :** Les adaptateurs de données sont responsables de la traduction des identifiants des fournisseurs en structures cohérentes au sein du Domaine (mapping d'ID).
* **Immuabilité et validation :** Les objets du domaine sont instanciés avec des données validées (utilisation de schémas simples de validation ou de constructeurs stricts), assurant la complétude des champs requis pour le Match Center (score, statut, équipes, statistiques).

## Conséquences

### Positives
* **Fiabilité des calculs métiers :** Les algorithmes de probabilités et d' Explainable AI (XAI) d'Athena travaillent sur des structures prévisibles et normalisées, réduisant les risques d'erreur de calcul dus à des formats inattendus.
* **Isolation du schéma :** Les couches supérieures (présentation, traitement de probabilités) sont totalement imperméables aux modifications de schémas de données de football-data.org ou Sportmonks.
* **Clarté de la base de code :** Les termes du dictionnaire métier d'Athena (Ubiquitous Language) sont portés directement par le code source.

### Négatives / Risques
* **Rôle critique des mappers :** La complexité est déplacée vers les convertisseurs de données dans la couche d'infrastructure. Une modification de structure d'API nécessite une mise à jour immédiate et rigoureuse du mapper correspondant, sous peine de bloquer l'ingestion de la donnée.

---

> **Made in Abyss : Spark by the King**
