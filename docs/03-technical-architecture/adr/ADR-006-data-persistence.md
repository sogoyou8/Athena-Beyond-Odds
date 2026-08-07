# ADR-006 — Stratégie de persistance des données

* **Statut :** Accepté (Décision Fondateur — 2026-07-18)
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`
* **Dépendances :** ADR-001 (monolithe), ADR-002 (abstraction fournisseur), ADR-003 (modèle de domaine)

---

## Contexte et Problématique

Le prototype Athena doit persister des données pour :

* **Résultats de matchs ingérés** : éviter de solliciter le fournisseur à chaque requête et respecter les quotas API (football-data.org impose des limites de fréquence strictes).
* **Calculs de probabilités** : stocker les résultats intermédiaires pour le Match Center.
* **Classements et statistiques** : données de référence (équipes, compétitions) utilisées par les algorithmes.

Contraintes déterminantes :
* **Budget `0 €`** : les plans gratuits des bases de données cloud sont limités (stockage, connexions simultanées, dormance).
* **Lecture seule des données fournisseur** : aucune écriture de données brutes non transformées ; seules les entités Athena normalisées (ADR-003) sont persistées.
* **Maximum 3 compétitions** : volume de données contenu, pas besoin de solutions à grande échelle.
* **Pas de redistribution** : les données doivent rester internes, pas d'API publique d'export.

## Options examinées

### Option A — SQLite (fichier local)

**Description :** Base de données relationnelle embarquée, stockée dans un fichier unique sur le système de fichiers du serveur.

**Avantages :**
* Aucune infrastructure externe requise — coût `0 €` garanti.
* Requêtes SQL standard avec support des jointures et agrégats utiles pour les statistiques de match.
* Intégration Node.js via `better-sqlite3` (synchrone, performant) ou `@libsql/client`.
* Adapté au volume faible (3 compétitions, lectures seules des données fournisseur).

**Inconvénients :**
* Fichier lié à l'instance de déploiement : perte de données si le conteneur est réinitialisé (commun sur Render, Fly.io en plan gratuit avec système de fichiers éphémère).
* Pas adapté à plusieurs instances simultanées (architecture monolithique — non critique pour le prototype).
* Nécessite une stratégie de sauvegarde ou de volume persistant si la donnée doit survivre aux redémarrages.

---

### Option B — PostgreSQL (plan gratuit cloud)

**Description :** Base de données relationnelle robuste et riche en fonctionnalités, utilisée via un service cloud (Neon, Supabase, ElephantSQL).

**Avantages :**
* Persistance durable indépendante du serveur applicatif.
* Fonctionnalités avancées : types JSON natifs, recherche plein texte, indexation partielle.
* Plans gratuits disponibles (Neon : 512 Mo, Supabase : 500 Mo).
* Aligné avec les ORM courants (Prisma, Drizzle) pour TypeScript.

**Inconvénients :**
* Dépendance à un service tiers — risque de modification des conditions du plan gratuit.
* Latence réseau additionnelle entre le serveur applicatif et la base distante.
* Configuration de connexion et gestion du pool de connexions à prévoir.

---

### Option C — MongoDB Atlas (plan gratuit M0)

**Description :** Base de données orientée documents, accessible via un cluster cloud partagé gratuit (512 Mo).

**Avantages :**
* Schéma flexible — adapté aux structures JSON hétérogènes des adaptateurs.
* Plan gratuit permanent (M0, 512 Mo partagé).
* Pilote Node.js officiel et mature.

**Inconvénients :**
* Modèle documentaire moins naturel pour des données relationnelles (matchs ↔ équipes ↔ compétitions).
* Performances du cluster partagé non garanties.
* Rupture avec le modèle relationnel classique des statistiques sportives.

---

### Option D — Données en mémoire uniquement (pas de persistance)

**Description :** Les données ingérées sont stockées en mémoire vive pendant la durée de vie du processus, rechargées à chaque démarrage depuis le fournisseur.

**Avantages :**
* Aucune infrastructure, aucun coût.
* Simplicité maximale pour le tout premier prototype.

**Inconvénients :**
* Perte totale des données à chaque redémarrage du serveur.
* Solicitation répétée du fournisseur à chaque démarrage — risque de dépassement des quotas API.
* Non viable au-delà du premier prototype de démonstration.

---

## Décision

Le Fondateur a retenu **Option A — SQLite locale, minimale et désactivable**.

Contraintes validées :
* Aucune donnée brute fournisseur ne doit être persistée — seules les entités Athena normalisées (ADR-003) peuvent l'être.
* SQLite doit pouvoir être désactivée ou supprimée sans impacter le domaine (isolation via `MatchRepositoryPort`).
* Conservation minimale uniquement — aucune conservation longue durée avant validation juridique.
* Aucun service cloud n'est obligatoire pour démarrer le prototype.

Option D (aucune persistance) reste utilisable si les cas d'usage initiaux fonctionnent uniquement avec le cache (ADR-007). PostgreSQL et MongoDB sont différés à une phase ultérieure.

## Conséquences

### Positives (quelle que soit l'option retenue)
* La couche de persistance est isolée dans la couche Infrastructure (ADR-001) via un port `MatchRepositoryPort` — le choix de la technologie de stockage peut être remplacé sans toucher au domaine ni à la couche Application.
* Les entités Athena normalisées (ADR-003) constituent le schéma de référence, indépendamment du moteur de stockage.

### Positives spécifiques (si Option A — SQLite retenue)
* Aucune dépendance externe, aucun compte tiers requis, coût `0 €` garanti.
* Fichier unique — sauvegarde et migration triviales.
* Conservation désactivable : le port `MatchRepositoryPort` peut être substitué par une implémentation en mémoire sans modifier le domaine.

### Négatives / Risques (si Option A — SQLite retenue)
* Perte des données en cas de réinitialisation du système de fichiers de l'instance (commun sur les plans gratuits avec stockage éphémère) — à surveiller selon la plateforme d'hébergement choisie dans un ADR ultérieur.
* Non adapté à plusieurs instances simultanées (non critique pour le monolithe du prototype).

### Négatives / Risques (si Option D — aucune persistance retenue)
* Les données sont perdues à chaque redémarrage ; la capacité de rejouer l'ingestion sans dépasser les quotas API (football-data.org : 10 requêtes/minute) doit être vérifiée avant de retenir cette option.

---

> **Made in Abyss : Spark by the King**
