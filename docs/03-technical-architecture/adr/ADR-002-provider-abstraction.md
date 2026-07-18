# ADR-002 — Abstraction stricte de la source de données sportives

* **Statut :** Accepté (Conforme à DEC-002)
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`

---

## Contexte et Problématique

La phase de découverte des accès réels a mis en évidence des écarts d'accès majeurs entre les fournisseurs évalués (Sportmonks bloqué sur les ligues cibles du MVP avec le plan d'essai gratuit, football-data.org accessible). Le prototype technique doit démarrer avec football-data.org de manière provisoire sans pour autant créer de dépendance irréversible avec ce fournisseur. L'architecture doit permettre un basculement ou une cohabitation transparente avec Sportmonks (ou un autre fournisseur alternatif) dès qu'un accès sera rétabli.

## Décision

Nous adoptons une **abstraction stricte de la source de données sportives** par l'application du modèle architectural *Ports et Adaptateurs* (Architecture Hexagonale).

* **Le Port (`DataProviderPort`) :** Une interface abstraite dans la couche application d'Athena. Elle définit les contrats d'accès aux données (ex: `getMatches()`, `getLeagueStandings()`).
* **Les Adaptateurs (`FootballDataOrgAdapter`, `SportmonksAdapter`) :** Des implémentations concrètes de l'interface situées dans la couche d'infrastructure. Ils effectuent les appels d'API HTTPS réels, capturent les erreurs selon le modèle de classification HTTP de chaque fournisseur, et mappent les payloads vers les entités métier Athena.
* **Mécanisme de Factory :** L'instanciation de l'adaptateur actif est déléguée à une fabrique pilotée par les variables d'environnement (`.env.local`), éliminant tout appel direct ou importation statique d'un adaptateur au sein de la logique métier.

## Conséquences

### Positives
* **Indépendance totale du fournisseur :** Le changement de fournisseur (ex. passage de football-data.org à Sportmonks) n'impacte en rien le code du Match Center ni les algorithmes d'analyse.
* **Facilité de test :** Possibilité d'injecter un `MockDataProviderAdapter` renvoyant des fichiers JSON locaux pour tester l'application de bout en bout de manière déconnectée et déterministe.
* **Conformité aux garde-fous :** Les limites de requêtes et de quotas peuvent être encapsulées et suivies spécifiquement dans chaque adaptateur sans polluer la logique d'application globale.

### Négatives / Risques
* **Complexité de mapping initial :** Nécessite d'écrire des convertisseurs de données (mappers) pour transformer les structures propres au fournisseur en entités de domaine Athena. Cette surcharge d'écriture est compensée par la sécurité contre le verrouillage de fournisseur (vendor lock-in).

---

> **Made in Abyss : Spark by the King**
