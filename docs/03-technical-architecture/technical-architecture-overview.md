# Aperçu de l'Architecture Technique du Prototype Athena

**Statut :** Approuvé pour la conception détaillée (2026-07-18)
**Phase :** Phase 2 — Architecture technique
**Auteur :** Antigravity
**Branche :** `architecture/phase-2-technical-design`
**Date :** 2026-07-18

---

## 1. Principes Directeurs d'Architecture

Conformément à la décision d'arbitrage **DEC-002**, l'architecture technique du prototype Athena repose sur les principes fondateurs suivants :

1. **Agnosticisme de la source de données :** Le code métier d'Athena ne doit avoir aucune dépendance directe avec les structures d'API ou formats de payload de football-data.org.
2. **Couche d'abstraction stricte :** Utilisation d'un modèle d'architecture découplé (de type ports et adaptateurs / architecture hexagonale) où le fournisseur externe n'est qu'un adaptateur interchangeable.
3. **Budget d'infrastructure à 0 € :** Pas d'hébergement payant ni de services cloud managés coûteux pour la phase de prototype. Les technologies sélectionnées doivent pouvoir s'exécuter localement ou sur des plans gratuits.
4. **Portabilité et réversibilité :** Aucun choix d'infrastructure (base de données spécifique, cloud provider, etc.) ne doit être structurant ou difficile à remplacer.
5. **Sécurité et conformité :** API utilisées strictement en lecture seule, aucune conservation longue durée de données tierces ni redistribution brute de données d'API. Aucune clé secrète dans le code ou les journaux.

---

## 2. Modèle Conceptuel de Couches

L'architecture est structurée en trois couches concentriques étanches :

```
       +-------------------------------------------------+
       |               Couche Infrastructure             |
       |  (Adaptateurs : Client HTTP football-data.org,  |
       |   Stockage local en mémoire ou fichier JSON)    |
       +-----------------------+-------------------------+
                               |
                               | (Implémente)
                               v
       +-------------------------------------------------+
       |                  Couche Application             |
       |  (Interfaces/Ports : DataProviderInterface,     |
       |   Services de coordination, Cas d'usage)        |
       +-----------------------+-------------------------+
                               |
                               | (Utilise)
                               v
       +-------------------------------------------------+
       |                    Couche Domaine               |
       |  (Modèles métiers : Rencontre, Championnat,     |
       |   Statistiques, Métrique de probabilité)        |
       +-------------------------------------------------+
```

### 2.1 Couche de Domaine (Domain Layer)
* **Rôle :** Contient la logique métier pure et les structures de données Athena (Match, Team, League, Odds, Probability).
* **Règle d'or :** Ne dépend d'aucune bibliothèque externe ni d'aucun format d'API de données. Elle est totalement isolée.

### 2.2 Couche Application (Application Layer)
* **Rôle :** Orchestre les cas d'usage et définit les contrats d'interface (Ports) pour les services externes.
* **Composant clé :** `DataProviderPort` (interface JavaScript/TypeScript définissant les signatures des méthodes d'accès aux données : `fetchMatchesForLeague(leagueId, season)`, etc.).

### 2.3 Couche Infrastructure (Infrastructure Layer)
* **Rôle :** Contient les adaptateurs concrets pour interagir avec le monde extérieur.
* **Adaptateur Prototype :** `FootballDataOrgAdapter` implémente `DataProviderPort` en effectuant des requêtes HTTPS sécurisées vers `api.football-data.org` et en transformant (mapping) les données reçues en entités du Domaine Athena.
* **Adaptateur Stockage :** Un stockage simple fichier (JSON) ou mémoire est privilégié pour le prototype afin de ne pas imposer de base de données à ce stade.

---

## 3. Flux de Données du Prototype

```
+-------------+         Appel API (HTTPS)         +-------------------+
|             | --------------------------------> |                   |
|  Adaptateur |                                   | football-data.org |
|  Provider   | <-------------------------------- |                   |
|             |          Réponse JSON brute       +-------------------+
+------+------+
       |
       | Transformation (Mapping)
       v
+--------------+          Données normalisées
|              | ==================================> Vers Services Métiers Athena
| Entités du   |
| Domaine      |
+--------------+
```

---

## 4. Stratégie d'Infrastructure et de Persistance (0 €)

* **Runtime :** Node.js LTS (local).
* **Base de données :** Stockage temporaire via un système d'écriture fichier local indexé (JSON) ou SQLite en mémoire. Aucun serveur de base de données (PostgreSQL, MongoDB) n'est requis au stade du prototype.
* **Hébergement :** Exécution et tests exclusivement en environnement de développement local ou via des déploiements sur des plateformes avec offres gratuites (offres d'essai Vercel / Render / Fly.io sans carte bancaire requise).

---

## 5. Gestion de la transition vers d'autres fournisseurs

L'intégration d'un autre fournisseur de données (par exemple Sportmonks) en Phase 3 n'exigera aucun changement dans les couches Applicatives et Domaine :
1. Implémenter un nouvel adaptateur `SportmonksAdapter` respectant le contrat `DataProviderPort`.
2. Mapper les payloads Sportmonks vers les entités de Domaine.
3. Modifier la configuration d'injection ou la factory d'adaptateur pour basculer sur le nouvel adaptateur.

---

## 6. Statut final

`Validation humaine requise`

---

> **Made in Abyss : Spark by the King**
