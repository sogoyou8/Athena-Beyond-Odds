# Dossier de validation — Phase 2.5 Conception détaillée

- Statut : `En attente de validation du Fondateur`
- Date de préparation : `2026-07-18`
- Branche : `architecture/phase-2-technical-design`
- Référence de conception : `f157045`

---

## Statut

`En attente de validation du Fondateur`

---

## Objet de la validation

Ce dossier soumet à validation humaine finale la conception documentaire de la Phase 2.5 avant toute création de code.

Toute création de code reste soumise à une validation explicite du Fondateur après revue de ces documents.

Cette validation porte sur :
- la structure logique du projet ;
- les contrats du domaine ;
- le contrat `SportsDataProvider` ;
- la conception de l’adaptateur football-data.org ;
- la conception SQLite ;
- la conception du cache mémoire.

---

## Documents soumis

- [Structure détaillée du projet](detailed-project-structure.md)
- [Contrats du domaine Athena](domain-contracts.md)
- [Contrat SportsDataProvider](sports-data-provider-contract.md)
- [Conception détaillée de l’adaptateur football-data.org](football-data-org-adapter-design.md)
- [Conception de la persistance SQLite](sqlite-persistence-design.md)
- [Conception du cache mémoire local](in-memory-cache-design.md)
- [Vue d’ensemble de l’architecture](technical-architecture-overview.md)

---

## Synthèse de la conception

- **Architecture globale** : Monolithe modulaire TypeScript / Node.js.
- **Framework** : Express avec structure modulaire explicite.
- **Organisation des dossiers** : Séparation stricte Domain / Application / Infrastructure / Interfaces (Presentation).
- **Modèles de domaine normalisés** (aucun préfixe "Athena" ne doit être ajouté) :
  - `Competition`
  - `Season`
  - `Team`
  - `Match`
  - `Score`
  - `MatchStatus`
  - `ProviderMetadata`
- **Contrat fournisseur d'abstraction** : Nommé exactement `SportsDataProvider`.
- **Adaptateur** : Implémentation football-data.org provisoire et entièrement remplaçable.
- **Persistance** : SQLite locale, minimale, désactivable et supprimable (sans impact sur le domaine).
- **Cache** : Cache mémoire local (in-process), à durée de vie courte et désactivable.
- **Infrastructure** : Aucune dépendance cloud obligatoire.
- **État d'implémentation** : Aucun dossier applicatif réel, aucun fichier source et aucun fichier de configuration applicative n'ont été créés.

---

## Points déjà validés

Les éléments d'architecture et les contraintes opérationnelles validés lors des phases précédentes restent inchangés :
- ADR-001 à ADR-007 acceptés ;
- DEC-003 et DEC-004 validés ;
- Budget maximal de `0 €` ;
- Lecture seule des données ;
- Maximum trois compétitions ;
- football-data.org provisoire ;
- Sportmonks non implémenté ;
- Aucun fournisseur définitif ;
- Aucune souscription payante ;
- Aucune redistribution de données brutes ;
- Aucune conservation longue durée avant validation juridique ;
- Aucun service cloud obligatoire.

---

## Points restant à confirmer

- Validation finale de la structure logique de dossiers et d'imports ;
- Validation finale des contrats du domaine (`Match`, `Team`, `Season`, `Competition`, etc.) ;
- Validation finale du contrat d'abstraction `SportsDataProvider` ;
- Validation finale du mapping et du rate limiting pour football-data.org ;
- Validation finale des règles et de la substituabilité de SQLite ;
- Validation finale des principes de TTL et de débrayage du cache mémoire ;
- Confirmation que les éléments marqués « À confirmer lors de l’implémentation » restent différés ;
- Décision explicite d’autoriser ou non la création du squelette technique ;
- Décision explicite d’autoriser ou non l’écriture de code applicatif.

---

## Contrôles de conformité

- [x] Les six documents de conception sont approuvés sans modification
- [x] La structure du monolithe modulaire est approuvée
- [x] Les contrats du domaine sont approuvés
- [x] Le contrat `SportsDataProvider` est approuvé
- [x] La conception de l’adaptateur football-data.org est approuvée
- [x] La conception SQLite est approuvée
- [x] La conception du cache mémoire est approuvée
- [x] Aucun nouveau choix technologique implicite n’a été introduit
- [x] Aucun code applicatif n’a été créé
- [x] Les contraintes de budget, fournisseur et conservation restent respectées

---

## Arbitrage du Fondateur

### Décision sur la conception

- [x] Conception détaillée approuvée sans modification
- [ ] Conception détaillée approuvée avec corrections mineures
- [ ] Conception détaillée refusée
- [ ] Décision reportée

### Autorisations suivantes

- [x] Autoriser la création du squelette technique du projet
- [x] Autoriser la création des contrats TypeScript
- [x] Autoriser les tests unitaires et contractuels
- [x] Autoriser l’implémentation de l’adaptateur football-data.org
- [x] Autoriser l’implémentation SQLite
- [x] Autoriser l’implémentation du cache mémoire
- [ ] Autoriser l’écriture générale de code applicatif métier
- [x] Ne pas encore autoriser l’écriture générale de code applicatif métier

## Périmètre précis de l’autorisation

L’autorisation couvre uniquement :

- l’initialisation du projet TypeScript / Node.js ;
- la structure du monolithe modulaire ;
- les contrats et modèles normalisés du domaine ;
- le contrat `SportsDataProvider` ;
- les adaptateurs et composants techniques approuvés ;
- les tests unitaires, d’intégration technique et contractuels ;
- la configuration minimale nécessaire au fonctionnement local.

L’autorisation ne couvre pas encore :

- les fonctionnalités métier destinées aux utilisateurs ;
- le moteur de probabilités ;
- les prédictions ;
- l’authentification ;
- une interface utilisateur ;
- le déploiement ;
- un hébergeur ou service cloud ;
- l’ajout d’un autre fournisseur sportif ;
- la conservation longue durée des données.

## Contraintes maintenues

- [x] Budget maximal maintenu à `0 €`
- [x] football-data.org reste provisoire
- [x] Sportmonks reste non implémenté
- [x] Aucun fournisseur définitif n’est sélectionné
- [x] Maximum trois compétitions
- [x] Lecture seule
- [x] Aucune souscription payante
- [x] Aucune redistribution de données brutes
- [x] Aucune conservation longue durée avant validation juridique
- [x] Aucune donnée brute fournisseur persistée
- [x] SQLite reste locale, minimale, désactivable et supprimable
- [x] Le cache mémoire reste court et désactivable
- [x] Aucun service cloud n’est obligatoire
- [x] Aucun secret ne doit être committé

---

## Décision finale

**Décision du Fondateur :**
La conception détaillée de la Phase 2.5 est approuvée sans modification. La création du squelette technique, des contrats TypeScript, des tests et des implémentations techniques approuvées est autorisée. Le développement général des fonctionnalités métier reste différé.

**Justification :**
La conception respecte le monolithe modulaire, l’indépendance vis-à-vis du fournisseur, le modèle de domaine normalisé et la contrainte budgétaire de `0 €`. Une implémentation technique progressive et testée peut commencer sans engager prématurément les fonctionnalités métier, le déploiement ou les composants encore différés.

**Corrections demandées :**
Aucune.

**Date :**
2026-07-18.

---

## Références

- [Structure détaillée du projet](detailed-project-structure.md)
- [Contrats du domaine Athena](domain-contracts.md)
- [Contrat SportsDataProvider](sports-data-provider-contract.md)
- [Conception détaillée de l’adaptateur football-data.org](football-data-org-adapter-design.md)
- [Conception de la persistance SQLite](sqlite-persistence-design.md)
- [Conception du cache mémoire local](in-memory-cache-design.md)
- [Vue d’ensemble de l’architecture](technical-architecture-overview.md)
- [Registre des ADR](adr/README.md)
- [Decision Log](../06-operations/decision-log.md)
- [Décision DEC-003](../06-operations/decision-log.md#dec-003--approbation-de-larchitecture-technique-de-phase-2)
- [Décision DEC-004](../06-operations/decision-log.md#dec-004--approbation-des-choix-technologiques-de-la-phase-24)

---

> Made in Abyss : Spark by the King
