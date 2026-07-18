# ADR-007 — Stratégie de cache

* **Statut :** Proposé
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`
* **Dépendances :** ADR-002 (abstraction fournisseur), ADR-006 (persistance)

---

## Contexte et Problématique

Le prototype Athena effectue des requêtes vers le fournisseur de données actif (football-data.org). Ce fournisseur impose des limites de fréquence strictes :

* **Plan gratuit football-data.org :** 10 requêtes par minute, données mises à jour quotidiennement pour les résultats historiques.
* **Conséquences sans cache :** chaque accès au Match Center déclencherait une requête HTTP directe, épuisant rapidement le quota et dégradant les performances utilisateur.

Un cache doit intercaler entre la couche Application et l'adaptateur du fournisseur pour :
* absorber les requêtes répétées sans solliciter l'API externe ;
* respecter les TTL (Time-To-Live) cohérents avec la fréquence de mise à jour des données sportives (résultats : minutes à heures ; classements : heures à jours) ;
* ne conserver aucune donnée brute du fournisseur au-delà de la durée d'utilisation (conformité aux conditions d'utilisation — pas de redistribution ni de conservation longue durée).

Contrainte budgétaire : `0 €` — les solutions nécessitant une instance Redis dédiée payante sont exclues.

## Options examinées

### Option A — Cache en mémoire (in-process)

**Description :** Stockage des réponses déjà transformées en entités Athena directement en mémoire vive du processus Node.js, avec TTL géré par le code (bibliothèques `node-cache`, `lru-cache` ou implémentation manuelle).

**Avantages :**
* Aucun service externe, coût `0 €` absolu.
* Latence d'accès nulle (mémoire locale).
* Contrôle total du TTL et de l'éviction des entrées.
* Implémentable dans la couche Infrastructure, derrière le port `DataProviderPort` — transparent pour la couche Application.

**Inconvénients :**
* Cache perdu à chaque redémarrage du processus (plans gratuits avec dormance fréquente).
* Limité par la mémoire disponible de l'instance (souvent 512 Mo sur les plans gratuits).
* Non partageable entre plusieurs instances (non critique pour le monolithe du prototype).

---

### Option B — Redis via service cloud gratuit (Upstash)

**Description :** Cache clé-valeur externe via Upstash Redis (plan gratuit : 10 000 commandes/jour, 256 Mo, serverless).

**Avantages :**
* Cache persistant entre les redémarrements du processus.
* Partageable entre instances si le monolithe évolue.
* TTL natif par clé, gestion de l'éviction automatique.
* Latence faible (< 5 ms dans la même région).

**Inconvénients :**
* Dépendance à un service tiers avec limites du plan gratuit (10 000 commandes/jour — à surveiller selon le trafic).
* Latence réseau additionnelle par rapport au cache en mémoire.
* Gestion de la variable `REDIS_URL` dans les secrets d'environnement.

---

### Option C — Cache HTTP navigateur / CDN uniquement

**Description :** Déléguer la mise en cache aux en-têtes HTTP (`Cache-Control`, `ETag`) pour les clients et les CDN (Cloudflare, Vercel Edge).

**Avantages :**
* Aucune logique de cache côté serveur.
* Réduction de la charge sur le serveur pour les requêtes identiques depuis le même client.

**Inconvénients :**
* Ne résout pas le problème de quota côté fournisseur : même si le navigateur met en cache, le serveur peut encore appeler football-data.org lors de la première requête de chaque utilisateur.
* Non applicable pour les traitements asynchrones (ingestion planifiée, calcul de probabilités).
* Insuffisant seul pour respecter les limites de l'API fournisseur.

---

### Option D — Pas de cache (requêtes directes limitées par le code)

**Description :** Aucun cache ; les requêtes vers le fournisseur sont planifiées à intervalles fixes (cron) et les résultats sont uniquement lus depuis la base de données persistante (ADR-006).

**Avantages :**
* Aucune complexité de cache.
* Le TTL est implicitement géré par la fréquence du cron d'ingestion.

**Inconvénients :**
* La fraîcheur des données dépend entièrement de la fréquence du cron — pas de lecture à la demande.
* Si la persistance (ADR-006) n'est pas encore en place, cette option n'est pas viable.

---

## Décision

> **À arbitrer par le Fondateur.** Aucune technologie définitive n'est sélectionnée à ce stade.

L'option recommandée par l'équipe architecture est **Option A — Cache en mémoire** pour le prototype initial, avec migration vers **Option B — Redis Upstash** si la dormance des plans gratuits entraîne des rechargements trop fréquents depuis l'API fournisseur.

Justification de la recommandation :
* Le cache en mémoire est suffisant pour le volume limité (3 compétitions, données quotidiennes).
* Le budget `0 €` est respecté sans dépendance externe.
* La stratégie est encapsulée dans la couche Infrastructure derrière le port `DataProviderPort` (ADR-002) : une migration vers Redis ne modifiera pas la couche Application ni le domaine.

Cette recommandation est soumise à validation du Fondateur. L'arbitrage doit être enregistré avant toute écriture de code de cache.

## Conséquences

### Positives (si Option A retenue)
* Respect garanti du quota API de football-data.org (10 requêtes/minute) par le TTL du cache.
* Aucune donnée brute du fournisseur n'est conservée au-delà de la durée du TTL — conformité aux conditions d'utilisation.
* Les entités Athena normalisées (ADR-003) sont mises en cache, pas les payloads bruts du fournisseur.

### Négatives / Risques (si Option A retenue)
* Après chaque redémarrage de l'instance (commun sur les plans gratuits avec dormance), le cache est vide et les premières requêtes sollicitent le fournisseur — à surveiller pour ne pas dépasser le quota de 10 requêtes par minute.
* Si le TTL est mal calibré (trop court), le quota peut être épuisé. Le TTL doit être défini selon la fréquence de mise à jour réelle de football-data.org (résultats : min 1 minute ; classements : min 1 heure).

---

> **Made in Abyss : Spark by the King**
