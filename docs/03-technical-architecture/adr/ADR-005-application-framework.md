# ADR-005 — Choix du framework applicatif

* **Statut :** Proposé
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`
* **Dépendance :** ADR-004 (langage) doit être arbitré avant que cet ADR puisse être finalisé

---

## Contexte et Problématique

Le prototype Athena requiert un serveur HTTP exposant :

* une API interne pour le Match Center (lecture des résultats, des classements) ;
* un point d'entrée pour déclencher l'ingestion de données depuis le fournisseur actif ;
* une interface de visualisation minimale (page de résultats pour la validation humaine).

Le choix du framework conditionne :
* la structure des routes et des middlewares ;
* la facilité d'injection de dépendance (port → adaptateur, conforme à ADR-002) ;
* le temps de démarrage et la consommation mémoire, critiques sur les plans gratuits à `0 €`.

**Contrainte de séquençage :** le framework applicatif dépend directement du langage retenu dans ADR-004. Cet ADR ne peut être finalisé qu'après validation de ADR-004. Les options sont donc présentées par langage candidat.

---

## Options examinées

### Scénario A — Si TypeScript / Node.js est retenu (ADR-004 Option A)

#### A1 — Express avec structure modulaire explicite

**Description :** Framework HTTP minimaliste et non-opinioné pour Node.js, organisé manuellement selon les couches de l'architecture hexagonale (Domain / Application / Infrastructure).

**Avantages :**
* Très léger : démarrage rapide, empreinte mémoire minimale — compatible avec les contraintes `0 €`.
* Liberté totale d'organisation : l'injection du port/adaptateur est contrôlée par le développeur, parfaitement alignée avec ADR-002.
* Connaissance très répandue, documentation abondante.
* Support TypeScript via `@types/express`.

**Inconvénients :**
* Aucune convention d'organisation imposée : la discipline d'isolation des couches repose entièrement sur l'équipe et devra être vérifiée par `dependency-cruiser`.
* Pas de système d'injection de dépendance intégré — à implémenter manuellement via la fabrique d'adaptateurs.

---

#### A2 — Fastify

**Description :** Framework HTTP performant pour Node.js, avec validation native de schémas JSON et support TypeScript.

**Avantages :**
* Performances supérieures à Express pour les requêtes HTTP (benchmark officiel Fastify).
* Validation des requêtes et réponses par schéma JSON — renforce les contrats de l'API.
* Architecture de plugins compatible avec l'injection de dépendance.
* Support TypeScript natif.

**Inconvénients :**
* Courbe d'apprentissage légèrement supérieure à Express pour les plugins et le cycle de vie.
* Moins de ressources d'apprentissage disponibles pour les débutants.

---

#### A3 — NestJS

**Description :** Framework TypeScript opinioné et structuré, inspiré d'Angular, avec injection de dépendance intégrée, modules, contrôleurs et services.

**Avantages :**
* Modules et injection de dépendance alignés avec l'architecture hexagonale.
* Génération de documentation OpenAPI intégrée.

**Inconvénients :**
* Empreinte mémoire importante au démarrage — risque de dépassement des limites des plans gratuits (`0 €`).
* Surcharge de configuration pour un prototype.
* Courbe d'apprentissage élevée.

---

#### A4 — Hono

**Description :** Framework HTTP ultraléger compatible Node.js, Deno, Cloudflare Workers et Bun.

**Avantages :**
* Empreinte minimale, démarrage instantané — idéal pour les plans gratuits avec mise en veille.
* API simple et intuitive, proche d'Express.
* Compatible avec les environnements edge si l'hébergement évolue.

**Inconvénients :**
* Écosystème moins mature qu'Express ou Fastify.
* Moins de bibliothèques middleware disponibles.

---

### Scénario B — Si Python est retenu (ADR-004 Option B)

Une comparaison complémentaire sera nécessaire avant toute sélection. Les candidats initiaux sont :

#### B1 — FastAPI

**Description :** Framework Python asynchrone moderne basé sur les annotations de type Python.

**Avantages :**
* Génération automatique de documentation OpenAPI (Swagger UI).
* Validation des requêtes et réponses via `pydantic` — adapté aux entités du domaine normalisé (ADR-003).
* Support `async/await` natif.

**Inconvénients :**
* Dépend de `uvicorn` ou `gunicorn` comme serveur ASGI — composant supplémentaire à configurer.
* Pydantic v2 introduit des changements de migration à anticiper.

---

#### B2 — Flask avec structure modulaire explicite

**Description :** Micro-framework Python synchrone, non-opinioné.

**Avantages :**
* Légèreté et simplicité de démarrage, comparable à Express pour Python.
* Flexibilité d'organisation compatible avec l'architecture hexagonale.

**Inconvénients :**
* Synchrone par défaut — gestion de la concurrence plus limitée que FastAPI.
* Validation des données à implémenter manuellement (pas de schéma intégré).

---

#### B3 — Django

**Description :** Framework Python complet (batteries included) avec ORM, administration, authentification.

**Avantages :**
* Très complet — ORM intégré, système d'administration.

**Inconvénients :**
* Surcharge majeure pour un prototype : empreinte mémoire élevée, configuration complexe.
* L'ORM Django crée un couplage fort avec la base de données — difficilement compatible avec l'isolation des couches (ADR-001, ADR-002).
* Non recommandé pour le prototype à `0 €`.

---

### Scénario C — Si Go est retenu (ADR-004 Option C)

Une comparaison complémentaire sera nécessaire avant toute sélection. Les candidats initiaux sont :

#### C1 — Bibliothèque standard `net/http`

**Description :** Serveur HTTP inclus dans la bibliothèque standard Go, sans dépendance externe.

**Avantages :**
* Aucune dépendance externe — compatibilité totale et coût `0 €` absolu.
* Performances excellentes, binaire unique produit à la compilation.
* Adapté aux architectures hexagonales (pas de conventions imposées).

**Inconvénients :**
* Routage et middleware à implémenter entièrement manuellement.
* Verbosité du code pour des cas d'usage simples.

---

#### C2 — chi

**Description :** Routeur HTTP léger pour Go, compatible avec la bibliothèque standard.

**Avantages :**
* Légèreté et compatibilité totale avec `net/http`.
* Middleware composable.
* Aucune opinion sur l'organisation — aligné avec l'architecture hexagonale.

**Inconvénients :**
* Fonctionnalités limitées par rapport à des frameworks plus complets.

---

#### C3 — Fiber ou Gin (à évaluer)

**Description :** Frameworks HTTP Go plus complets et expressifs.

**Avantages :**
* API proche d'Express (Fiber) ou bien documentée (Gin).
* Performances optimisées.

**Inconvénients :**
* Introduisent des dépendances supplémentaires.
* Evaluation complémentaire requise avant sélection si Go est retenu.

---

## Décision

> **À arbitrer par le Fondateur. Aucune technologie définitive n'est sélectionnée à ce stade.**

La sélection finale du framework dépend d'abord de l'acceptation de ADR-004 (choix du langage).

Si TypeScript est retenu dans ADR-004, Express avec une structure modulaire explicite constitue la recommandation provisoire. Pour Python ou Go, une comparaison complémentaire devra être validée avant sélection.

Aucun framework Python ou Go ne sera choisi avant la décision sur le langage.

## Conséquences

### Positives (quelle que soit l'option retenue)
* Le point d'entrée HTTP reste une couche fine : les routes délèguent immédiatement aux cas d'usage de la couche Application, sans logique métier dans les contrôleurs — conformément à ADR-001.
* L'injection de l'adaptateur actif (football-data.org ou mock) se fait via la fabrique d'adaptateurs (ADR-002), indépendamment du framework choisi.

### Négatives / Risques
* La discipline d'isolation des couches doit être maintenue manuellement dans les scénarios A et C, et vérifiée par un outil d'analyse de dépendances (`dependency-cruiser` pour TypeScript, équivalent pour Python ou Go).
* Un mauvais choix de framework imposant un ORM intégré (ex. Django) risque de créer un couplage fort entre la couche Infrastructure et le domaine — à éviter impérativement.

---

> **Made in Abyss : Spark by the King**
