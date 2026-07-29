# Dossier de validation — Phase 2.8 : connexion au fournisseur réel

- **Projet :** Athena Beyond Odds
- **Phase :** 2.8
- **Branche de base :** `architecture/phase-2-technical-design`
- **Commit de référence :** `a40f467769aba31bba1332b57772ffa66a09cfeb`
- **Date :** 2026-07-30
- **Statut :** Approuvé — implémentation encore non autorisée
- **Responsable :** Fondateur ABYSS
- **Décision associée :** [DEC-006](../06-operations/decision-log.md#dec-006--approbation-du-cadrage-de-connexion-au-fournisseur-réel)

> **Approbation complète — 6/6 décisions fondatrices validées**

---

## 1. État fusionné des Phases 2.6 et 2.7

Au commit `a40f467769aba31bba1332b57772ffa66a09cfeb`, l'état du dépôt est :

### Composants actifs

| Couche | Composant | État |
|---|---|---|
| Domain | `Match`, `Team`, `Season`, `Competition`, `Score`, `MatchStatus`, `ProviderMetadata` | Stable — inchangeable |
| Application | Port `SportsDataProvider` | Contrat figé |
| Application | `ListScheduledMatchesUseCase` | Opérationnel — `FL1` uniquement |
| Application | `CompetitionNotAvailableError` | Opérationnel |
| Infrastructure | `InMemorySportsDataProvider` | Câblé — 3 matchs fictifs |
| Infrastructure | `FootballDataOrgAdapter` | Présent — lève `NotImplementedError` sur toutes les méthodes |
| Infrastructure | `InMemoryCache` | Inchangé — inactif |
| Infrastructure | `SqlitePersistence` | Inchangée — inactive |
| Interfaces | `GET /health` | Opérationnel |
| Interfaces | `GET /competitions/:code/matches` | Opérationnel — données fictives uniquement |
| Tests | 9 fichiers — 37 tests | Tous verts |

### Ce que la Phase 2.8 doit apporter

La Phase 2.8 remplace le fournisseur fictif par une connexion réelle à football-data.org pour le seul endpoint `GET /competitions/FL1/matches`, en lecture seule, sans modifier le domaine ni les contrats.

---

## 2. Correction de la prémisse factuelle

Le cadrage initial soumis le 2026-07-30 comportait l'affirmation selon laquelle la Ligue 1 ne serait pas couverte par le plan gratuit de football-data.org, et proposait de remplacer `FL1` par `PL`.

**Cette affirmation est inexacte et a été rejetée par le Fondateur.**

Au 2026-07-30, la page officielle de couverture de football-data.org présente la **Ligue 1** parmi les compétitions accessibles sur le **Free Tier** :

- Plan annoncé : `0 €`
- Compétitions incluses : 12 (dont `FL1`)
- Limite de débit : 10 appels par minute

Le code API officiel de la Ligue 1 est `FL1`.

La continuité avec l'endpoint de Phase 2.7 est donc préservée sans migration artificielle vers une autre compétition.

### Références officielles datées (2026-07-30)

| Ressource | URL |
|---|---|
| Page de couverture | `https://www.football-data.org/coverage` |
| Page de tarification | `https://www.football-data.org/pricing` |
| Documentation compétitions v4 | `https://docs.football-data.org/general/v4/competition.html` |
| Politiques d'utilisation | `https://docs.football-data.org/general/v4/policies.html` |

> **Avertissement :** La couverture d'un service tiers peut évoluer sans préavis. Une vérification officielle devra être rejouée avant l'implémentation et avant tout test réel authentifié. Si un appel réel retourne HTTP `403` pour `FL1`, l'implémentation doit être arrêtée sans bascule automatique vers une autre compétition.

---

## 3. Objectif fonctionnel de la Phase 2.8

Remplacer `InMemorySportsDataProvider` par `FootballDataOrgAdapter` dans la composition de l'application, pour `GET /competitions/FL1/matches`, en lecture seule, sur le plan gratuit de football-data.org.

**Flux cible :**

```text
Interface HTTP
→ ListScheduledMatchesUseCase
→ SportsDataProvider
→ FootballDataOrgAdapter
→ fetch natif
→ football-data.org
→ mapping vers les modèles de domaine normalisés
→ réponse HTTP
```

**Flux de tests automatisés :**

```text
Interface HTTP
→ ListScheduledMatchesUseCase
→ SportsDataProvider
→ InMemorySportsDataProvider ou transport HTTP simulé
→ réponse déterministe
```

---

## 4. Décisions fondatrices approuvées

### DEC-006.1 — Gestion de la clé API

- La possession d'une clé active est un prérequis opérationnel, non une décision d'architecture.
- Nom de variable d'environnement exact :

```text
FOOTBALL_DATA_API_KEY
```

- La clé est lue exclusivement depuis l'environnement d'exécution.
- Aucune valeur de clé ne doit apparaître dans Git, les documents, les tests, les logs ou les rapports.
- Aucun support applicatif de fichier `.env` n'est autorisé.
- Aucune dépendance `dotenv` n'est autorisée.
- Les tests automatisés fonctionnent sans clé réelle (transport HTTP simulé).
- Un test réel manuel reste conditionné à la présence d'une clé valide.
- Lorsque le fournisseur réel est sélectionné et que la clé est absente, l'application échoue au démarrage avec une erreur de configuration explicite ne révélant aucun secret.
- L'absence de clé ne provoque jamais de bascule silencieuse vers les données fictives.

### DEC-006.2 — Compétition réelle retenue

```text
FL1 — Ligue 1
```

Justifications :

- continuité avec l'endpoint de Phase 2.7 ;
- conservation du contrat fonctionnel sans migration ;
- présence de la Ligue 1 dans la couverture officielle gratuite au 2026-07-30 ;
- absence de migration artificielle vers `PL`, `CL` ou `BL1`.

Contraintes :

- la Phase 2.8 est strictement limitée à `FL1` ;
- tout code différent de `FL1` produit HTTP `404` avec `{ "error": "COMPETITION_NOT_AVAILABLE" }` sans appel au fournisseur ;
- si un contrôle réel authentifié retourne HTTP `403` pour `FL1` : arrêt de la validation, soumission d'un nouvel arbitrage au Fondateur, aucune substitution automatique.

### DEC-006.3 — Activation du fournisseur

Variable d'environnement :

```text
SPORTS_DATA_PROVIDER
```

Valeurs acceptées :

| Valeur | Comportement |
|---|---|
| Absente ou `in-memory` | Fournisseur fictif Phase 2.7 |
| `football-data-org` | Fournisseur réel |
| Toute autre valeur | Échec explicite au démarrage |

Règles :

- aucune sélection dans le domaine ou les cas d'usage ;
- la sélection est confinée à la racine de composition de l'application ;
- aucun registre extensible de fournisseurs ;
- aucun fallback automatique vers les données fictives ;
- aucune bascule après erreur réseau.

Cette décision remplace explicitement l'interdiction de sélection dynamique établie pour la seule Phase 2.7 par `DEC-005 §6`. Les autres décisions de `DEC-005` restent inchangées.

### DEC-006.4 — Client HTTP

```text
fetch natif (globalThis.fetch)
```

Contraintes :

- aucune dépendance npm supplémentaire ;
- `FootballDataOrgAdapter` reçoit un transport HTTP injectable et typé ;
- le transport par défaut repose sur `globalThis.fetch` ;
- les tests injectent une fonction simulée ;
- aucun monkey-patching global permanent ;
- authentification par en-tête `X-Auth-Token` uniquement ;
- URL de base figée :

```text
https://api.football-data.org/v4
```

- aucun token dans l'URL ;
- aucun token dans les messages d'erreur ou les logs ;
- aucun enregistrement du corps brut dans les logs ;
- délai maximal : 8 secondes, via `AbortController` ou mécanisme natif équivalent ;
- aucune nouvelle bibliothèque HTTP.

### DEC-006.5 — Fenêtre temporelle

```text
7 jours calendaires UTC
```

Définition exacte :

- `dateFrom` : date UTC courante au format `YYYY-MM-DD`
- `dateTo` : `dateFrom + 7 jours`
- intervalle fonctionnel : `[dateFrom, dateTo)` — `dateTo` est une borne exclusive
- la fenêtre couvre exactement sept dates calendaires UTC
- le filtrage final conserve uniquement le statut `SCHEDULED`

Contraintes de test :

- l'horloge est injectable dans l'adaptateur ;
- aucun test ne dépend de la date réelle de la machine ;
- aucun `Date.now()` non encapsulé dans la logique testée ;
- les paramètres `dateFrom` et `dateTo` doivent être vérifiés dans les tests unitaires de l'adaptateur.

### DEC-006.6 — Gestion des erreurs du fournisseur

#### Limite de débit

Une réponse amont HTTP `429` produit :

- erreur : `ProviderRateLimitError`
- réponse HTTP : `429`
- corps :

```json
{ "error": "PROVIDER_RATE_LIMIT" }
```

#### Fournisseur indisponible

Les situations suivantes produisent `ProviderUnavailableError` :

- erreur réseau
- délai dépassé
- HTTP `401`
- HTTP `403`
- HTTP `5xx`
- JSON invalide ou incompatible avec le mapping requis

Réponse HTTP : `503`

Corps :

```json
{ "error": "PROVIDER_UNAVAILABLE" }
```

#### Garde-fous

- aucun détail interne du fournisseur dans la réponse HTTP ;
- aucun token dans la réponse ou les logs ;
- aucune conversion d'une erreur inconnue en `404` ;
- les erreurs inconnues continuent vers `next(error)` ;
- aucun fallback vers `InMemorySportsDataProvider`.

---

## 5. Questions ouvertes résolues

### QO-2.8-1 — Tests automatisés avec réseau réel

**Résolu :** Aucun appel réel à football-data.org dans `npm test`. Les tests de l'adaptateur utilisent un transport `fetch` injecté avec des réponses JSON simulées. Un test manuel séparé et non requis par la CI peut être exécuté avec une clé réelle.

### QO-2.8-2 — Codes de compétition transmis au fournisseur

**Résolu :** `FL1` uniquement pendant la Phase 2.8. Aucun code arbitraire n'est transmis au fournisseur. Tout autre code déclenche `CompetitionNotAvailableError` dans le cas d'usage avant tout appel réseau.

### QO-2.8-3 — Chargement de la clé API

**Résolu :** Variable d'environnement `FOOTBALL_DATA_API_KEY` uniquement. Aucun fichier `.env` chargé par l'application. Aucune dépendance supplémentaire. Aucun secret versionné.

---

## 6. Stratégie de tests

### Tests automatisés (sans réseau réel)

| Fichier | Couverture |
|---|---|
| `tests/unit/football-data-org-adapter.test.ts` | Mapping nominal, paramètres `dateFrom`/`dateTo`, HTTP `401`, `403`, `429`, `5xx`, erreur réseau, délai dépassé, JSON invalide |
| `tests/integration/matches.test.ts` (existant) | Conservé — fournisseur fictif injecté directement |
| `tests/integration/unknown-competition.test.ts` (existant) | Conservé — inchangé |

Les tests existants Phase 2.7 doivent rester verts sans modification.

### Test manuel (optionnel, hors CI)

Un test manuel avec une clé réelle permettra de valider le flux complet. Ce test ne fait pas partie de `npm test` et n'est pas requis pour l'autorisation d'implémentation.

---

## 7. Gestion des secrets

- `FOOTBALL_DATA_API_KEY` est lue depuis l'environnement d'exécution uniquement.
- Aucune valeur de clé ne doit figurer dans Git, les documents, les tests, les logs ou les rapports d'erreur.
- Aucun fichier `.env` n'est chargé par l'application.
- La valeur de la clé ne doit jamais être journalisée, même en mode debug.
- En cas d'erreur de configuration (clé absente avec fournisseur réel sélectionné), l'application affiche un message d'erreur non révélateur :

```text
[Athena] ERREUR DE CONFIGURATION : FOOTBALL_DATA_API_KEY est requis quand SPORTS_DATA_PROVIDER=football-data-org
```

---

## 8. Erreurs HTTP produites

| Situation | Erreur interne | HTTP | Corps |
|---|---|---|---|
| Compétition ≠ FL1 | `CompetitionNotAvailableError` | 404 | `{ "error": "COMPETITION_NOT_AVAILABLE" }` |
| Limite de débit API | `ProviderRateLimitError` | 429 | `{ "error": "PROVIDER_RATE_LIMIT" }` |
| API indisponible, timeout, 401, 403, 5xx, JSON invalide | `ProviderUnavailableError` | 503 | `{ "error": "PROVIDER_UNAVAILABLE" }` |
| Erreur inconnue | — | propagée via `next(error)` | — |

---

## 9. Contraintes juridiques et budgétaires

- Développement local uniquement — aucun déploiement public autorisé.
- Aucun utilisateur tiers.
- Aucune redistribution du JSON brut retourné par football-data.org.
- Mapping obligatoire vers les modèles de domaine normalisés.
- Aucune conservation longue durée des données.
- Aucune activation de SQLite.
- Aucun cache actif.
- Aucune donnée de pari, cote, prédiction ou recommandation.
- football-data.org reste provisoire et remplaçable.
- Sportmonks reste non implémenté.
- Aucun fournisseur définitif n'est sélectionné.
- Budget maximal maintenu à **0 €**.
- Aucun service payant.
- Aucun abonnement.

---

## 10. Fichiers potentiellement concernés lors de l'implémentation

> Cette liste identifie les fichiers susceptibles d'être modifiés. Elle n'autorise aucune modification pendant la phase documentaire.

### Fichiers source à modifier

```text
src/app.ts
src/infrastructure/providers/football-data-org/football-data-org-adapter.ts
```

### Fichiers source non modifiés

```text
src/application/ports/sports-data-provider.ts
src/application/use-cases/list-scheduled-matches.ts
src/interfaces/http/matches-route.ts
src/domain/
src/infrastructure/cache/
src/infrastructure/persistence/
src/infrastructure/providers/in-memory/
```

### Tests à créer

```text
tests/unit/football-data-org-adapter.test.ts
```

### Tests à conserver sans modification

```text
tests/unit/in-memory-sports-data-provider.test.ts
tests/unit/list-scheduled-matches.test.ts
tests/integration/matches.test.ts
tests/integration/unknown-competition.test.ts
tests/integration/health.test.ts
tests/unit/match-status.test.ts
tests/unit/sqlite-persistence.test.ts
tests/unit/in-memory-cache.test.ts
tests/contract/sports-data-provider.test.ts
```

---

## 11. Hors périmètre de la Phase 2.8

- Sportmonks ou tout autre fournisseur tiers
- Ligue 1 en production (aucun déploiement public)
- Mise en cache des réponses (`InMemoryCache`)
- Persistance SQLite
- Authentification utilisateur
- Sessions
- Écritures utilisateur
- Matchs en direct
- Résultats terminés
- Détail individuel d'un match
- Endpoint de liste des compétitions
- Plusieurs compétitions actives
- Nouvelles dépendances npm
- Données de pari, cotes, probabilités, prédictions, recommandations

---

## 12. Critères d'arrêt

L'implémentation doit être arrêtée et un nouvel arbitrage soumis au Fondateur si :

- un appel réel authentifié à football-data.org retourne HTTP `403` pour `FL1` ;
- football-data.org modifie son API v4 de façon incompatible avec le mapping prévu ;
- `npm run typecheck` produit des erreurs liées à des types non satisfiables sans modifier les contrats du domaine ;
- une neuvième décision fondatrice devient nécessaire.

---

## 13. Conclusion

Les six décisions fondatrices sont approuvées.

Le cadrage de la Phase 2.8 est figé.

Ce document n'autorise aucune modification sous `src/` ou `tests/`.

Une autorisation séparée est requise avant la création d'une branche d'implémentation ou l'écriture de code.

**CADRAGE PHASE 2.8 APPROUVÉ — IMPLÉMENTATION ENCORE NON AUTORISÉE**
