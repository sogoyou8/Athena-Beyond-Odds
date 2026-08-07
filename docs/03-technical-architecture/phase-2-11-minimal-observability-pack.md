# Dossier de validation — Phase 2.11 : observabilité minimale et sûre

- **Projet :** Athena Beyond Odds
- **Phase :** 2.11 — Observabilité minimale et sûre
- **Date :** 2026-08-05
- **Commit de référence :** `fcd3d80d20157baec4c407c9fe7d653384aa1e33`
- **Branche de base :** `architecture/phase-2-technical-design`
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvé — implémentation encore non autorisée

---

## 1. État Technique au Commit de Référence

### Architecture et composants actuels
Le dépôt est organisé en architecture **ports-and-adapters** stricte :

| Couche | Fichier(s) |
|---|---|
| Interfaces HTTP | `src/interfaces/http/matches-route.ts` |
| Application (Use Case) | `src/application/use-cases/list-scheduled-matches.ts` |
| Port | `src/application/ports/sports-data-provider.ts` |
| Infrastructure (cache) | `src/infrastructure/cache/memory/in-memory-cache.ts` |
| Infrastructure (provider réel) | `src/infrastructure/providers/football-data-org/football-data-org-adapter.ts` |
| Infrastructure (provider fictif) | `src/infrastructure/providers/in-memory/in-memory-sports-data-provider.ts` |
| Composition | `src/app.ts` |
| Serveur HTTP | `src/server.ts` |

---

## 2. Diagnostic d'Observabilité Actuel

### Absence de journalisation applicative
- Seul `src/server.ts` possède un `console.log` d'information au démarrage du serveur HTTP.
- Aucun fichier de la couche `src/` (`app.ts`, `in-memory-cache.ts`, `football-data-org-adapter.ts`, `matches-route.ts`) n'émet de logs, d'événements ou de métriques.

### Événements actuellement invisibles
- **Cache :** `cache_hit`, `cache_miss`, `cache_expired`, `cache_bypass`, `cache_in_flight_join`.
- **Fournisseur :** `provider_request_started`, `provider_request_succeeded`, `provider_rate_limited`, `provider_unavailable`.
- **Performance :** Durées d'exécution (`durationMs`) des requêtes fournisseur.

### Observabilité externe restreinte
Seuls les codes de statut HTTP (`200`, `404`, `429`, `503`) sont observables côté client via Express. L'appelant ne peut pas déterminer si une réponse HTTP 200 provient du cache ou d'un appel réseau réel vers `football-data.org`.

---

## 3. Décisions Fondatrices Approuvées — DEC-009

### DEC-009.1 — Événements Observables

#### Événements Cache Approuvés
- `cache_hit` : Une valeur encore valide est retournée depuis le cache.
- `cache_miss` : Aucune valeur utilisable n'existe et un appel fournisseur est nécessaire.
- `cache_expired` : Une entrée existe mais son TTL est dépassé.
- `cache_bypass` : Une seule borne temporelle est fournie et le cache est volontairement contourné.
- `cache_in_flight_join` : Une requête rejoint une promesse fournisseur déjà en cours pour la même clé logique.

#### Événements Fournisseur Approuvés
- `provider_request_started` : Une requête réelle vers le fournisseur va être effectuée.
- `provider_request_succeeded` : La réponse fournisseur a été reçue, validée et normalisée.
- `provider_rate_limited` : Le fournisseur a produit le cas correspondant à `ProviderRateLimitError`.
- `provider_unavailable` : Le fournisseur a produit le cas correspondant à `ProviderUnavailableError`.

#### Durée (`durationMs`)
Il n'existe pas d'événement séparé `provider_request_duration`. La durée d'exécution est un champ `durationMs` présent sur `provider_request_succeeded`, `provider_rate_limited` et `provider_unavailable`. La durée est numérique, finie, supérieure ou égale à zéro, mesurée autour de l'appel fournisseur (distincte de l'horloge UTC des dates de matchs).

#### Éléments non observés
Aucun événement n'est ajouté dans `matches-route.ts`, `ListScheduledMatchesUseCase`, `SportsDataProvider` ou le domaine.

---

### DEC-009.2 — Observer Typé Injectable

#### Décision : Option A — Observer typé injectable par constructeur
Une abstraction légère et sans dépendance est définie dans `src/shared/observability/telemetry.ts` :

```typescript
export type TelemetryEvent =
  | {
      type: 'cache_hit';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
      matchCount: number;
    }
  | {
      type: 'cache_miss';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
    }
  | {
      type: 'cache_expired';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
    }
  | {
      type: 'cache_bypass';
      competitionCode: string;
      providedBound: 'from-only' | 'to-only';
    }
  | {
      type: 'cache_in_flight_join';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
    }
  | {
      type: 'provider_request_started';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
    }
  | {
      type: 'provider_request_succeeded';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
      durationMs: number;
      matchCount: number;
    }
  | {
      type: 'provider_rate_limited';
      competitionCode: string;
      durationMs: number;
    }
  | {
      type: 'provider_unavailable';
      competitionCode: string;
      durationMs: number;
      failureKind: ProviderFailureKind;
    };

export type ProviderFailureKind =
  | 'timeout'
  | 'network'
  | 'unauthorized'
  | 'forbidden'
  | 'upstream_5xx'
  | 'invalid_response'
  | 'unknown';

export type TelemetryObserver = (event: TelemetryEvent) => void;
```

#### Injection et Observer par défaut
- L'observer est optionnel et injectable par constructeur dans `InMemoryCache` et `FootballDataOrgAdapter`.
- L'observer par défaut est un no-op : `() => {}`. Sans observer explicite, aucun événement n'est émis ou affiché.
- Le domaine et le port `SportsDataProvider` restent inchangés.

#### Isolation Obligatoire des Erreurs de l'Observer
Une exception levée par l'observer ne doit jamais altérer le traitement métier ou le cache. Les notifications passent par une fonction de garde :

```typescript
function safeObserve(
  observer: TelemetryObserver,
  event: TelemetryEvent
): void {
  try {
    observer(event);
  } catch {
    // L'observabilité ne peut pas casser le traitement métier.
  }
}
```

Les observers asynchrones sont hors contrat. Le type reste synchrone : `(event: TelemetryEvent) => void`.

---

### DEC-009.3 — Activation par Variable d'Environnement

Variable d'environnement optionnelle : `ATHENA_TELEMETRY=off|console`

| `ATHENA_TELEMETRY` | Comportement |
|---|---|
| Absente | Observabilité désactivée (observer no-op) |
| `off` | Observabilité désactivée (observer no-op) |
| `console` | Observer console structuré activé |
| Autre valeur | Échec au démarrage (erreur de configuration explicite) |

Contraintes :
- Aucune variable d'environnement obligatoire.
- Aucun fichier `.env`, aucun `dotenv`, aucune dépendance npm.
- Aucun effet sur `SPORTS_DATA_PROVIDER` ou `FOOTBALL_DATA_API_KEY`.
- Aucune activation automatique dans les tests.

---

### DEC-009.4 — Données Autorisées et Sécurité des Secrets

#### Données autorisées
Champs autorisés : `type`, `competitionCode`, `dateFrom`, `dateTo`, `matchCount`, `durationMs`, `providedBound`, `failureKind`. Dates au format strict `YYYY-MM-DD`.

#### Clé de cache
La clé complète du cache ne figure pas dans les événements (découplage). Les bornes `dateFrom` et `dateTo` sont transmises séparément.

#### Données strictement interdites
Il est strictement interdit d'inclure :
`FOOTBALL_DATA_API_KEY`, valeur de `X-Auth-Token`, headers HTTP complets, URL complète du fournisseur, query string brute, corps brut du fournisseur, objets `Request`/`Response`/`Error`, message d'erreur brut, stack trace, PID, chemins locaux, variables d'environnement, clés internes de cache.

#### Catégories d'erreur contrôlées (`failureKind`)
Seules les valeurs énumérées sont autorisées : `timeout`, `network`, `unauthorized`, `forbidden`, `upstream_5xx`, `invalid_response`, `unknown`. Aucun message brut issu du réseau ou d'une exception n'est copié.

---

### DEC-009.5 — Destination et Format Console

#### Format console
Lorsque `ATHENA_TELEMETRY=console`, chaque événement est émis au format NDJSON (une ligne JSON valide par événement) contenant obligatoirement `"scope": "athena.telemetry"` :

```json
{"scope":"athena.telemetry","type":"cache_hit","competitionCode":"FL1","dateFrom":"2026-08-05","dateTo":"2026-08-12","matchCount":3}
```

#### Canaux console
- `stdout` via `console.log` : `cache_hit`, `cache_miss`, `cache_expired`, `cache_bypass`, `cache_in_flight_join`, `provider_request_started`, `provider_request_succeeded`.
- `stderr` via `console.error` : `provider_rate_limited`, `provider_unavailable`.

#### Absence de rétention
Aucune rétention n'est ajoutée (pas de fichier de log, pas de SQLite, pas de Redis, pas de Prometheus, pas d'OpenTelemetry, pas de cloud/SaaS). Les sorties console sont purement éphémères.

---

### DEC-009.6 — Stratégie de Tests Obligatoires

Une future implémentation devra couvrir au minimum les 45 cas suivants sans appel réseau et sans attente réelle :

1. `cache_miss` sur cache froid.
2. `cache_hit` sur cache chaud.
3. `cache_hit` contient le bon `matchCount`.
4. `cache_expired` sur entrée expirée.
5. Expiration suivie d'un renouvellement fournisseur.
6. `cache_bypass` avec `from-only`.
7. `cache_bypass` avec `to-only`.
8. `cache_in_flight_join` sur requête dédupliquée.
9. Deux requêtes simultanées de même clé ne produisent qu'un appel fournisseur.
10. Clés différentes restent indépendantes.
11. Aucune donnée sensible transmise à l'observer.
12. Exception levée par l'observer ne casse pas le cache.
13. Exception levée par l'observer n'empêche pas le nettoyage `in-flight`.
14. Observer no-op ne modifie aucun comportement.
15. Appel fournisseur émet `provider_request_started`.
16. Succès fournisseur émet `provider_request_succeeded`.
17. Succès fournisseur contient le bon `matchCount`.
18. Succès contient un `durationMs` fini >= 0.
19. Réponse 429 émet `provider_rate_limited`.
20. Indisponibilité émet `provider_unavailable`.
21. Catégories `failureKind` strictement contrôlées.
22. Aucune erreur brute transmise.
23. Aucune URL complète transmise.
24. Aucun header transmis.
25. Aucune valeur de clé API transmise.
26. Exception d'observer ne masque pas l'erreur fournisseur.
27. Instrumentation ne déclenche aucun retry.
28. Instrumentation ne déclenche aucun appel réseau supplémentaire.
29. Mesure de durée injectable/contrôlable.
30. Aucun `setTimeout` réel dans les tests.
31. Aucun test ne dépend de l'heure système.
32. Mesure de durée ne modifie pas le calcul de `clockFn` des fenêtres UTC.
33. Deux bornes explicites respectent la règle `clockFn`.
34. Durée négative normalisée à 0.
35. Variable absente → aucun observer console.
36. `ATHENA_TELEMETRY=off` → aucun observer console.
37. `ATHENA_TELEMETRY=console` → observer console activé.
38. Valeur inconnue → échec au démarrage.
39. Événement normal → une ligne JSON sur `console.log`.
40. Événement d'erreur → une ligne JSON sur `console.error`.
41. Chaque ligne console est un JSON valide.
42. Chaque ligne contient `"scope": "athena.telemetry"`.
43. Aucune sortie console pendant les tests normaux sans activation.
44. Mocks console restaurés après chaque test.
45. Aucun appel réseau réel.

---

## 4. Périmètre Technique Prévisionnel

### Fichiers potentiellement concernés par une future implémentation
- `src/shared/observability/telemetry.ts` (nouveau)
- `src/infrastructure/cache/memory/in-memory-cache.ts`
- `src/infrastructure/providers/football-data-org/football-data-org-adapter.ts`
- `src/app.ts`
- `src/server.ts`
- `tests/unit/telemetry.test.ts` (nouveau)
- `tests/unit/in-memory-cache.test.ts`
- `tests/unit/football-data-org-adapter.test.ts`
- `tests/integration/provider-selection.test.ts`

### Fichiers protégés (inchangés)
```text
src/domain/
src/application/ports/sports-data-provider.ts
src/application/use-cases/list-scheduled-matches.ts
src/interfaces/http/matches-route.ts
src/infrastructure/providers/in-memory/
package.json
package-lock.json
tsconfig.json
vitest.config.ts
```

---

## 5. Éléments Hors Périmètre

- Changement du domaine ou du port `SportsDataProvider`.
- Modification des routes HTTP publiques.
- Nouveaux endpoints ou endpoints de métriques.
- Persistance ou fichiers de logs.
- Dépendances npm supplémentaires (Winston, Pino, etc.).
- Services cloud, SaaS, Grafana, Prometheus, OpenTelemetry.
- Retry, backoff, stale-on-error.
- Test réel Phase 2.9 Niveau 2.

---

## 6. Verdict Documentaire

```text
CADRAGE PHASE 2.11 APPROUVÉ — IMPLÉMENTATION ENCORE NON AUTORISÉE
```

> Made in Abyss : Spark by the King
