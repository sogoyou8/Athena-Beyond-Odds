# Phase 3.8 corrective prerequisite — Historical Corpus Integrity / Intégrité du corpus historique — Conception technique corrective (DEC-040)

> **Statut :** APPROUVÉE
> **Version :** 1.0
> **Nature :** `CORRECTIVE_TECHNICAL_DESIGN`
> **Date :** 2026-08-21
> **Responsable :** Fondateur ABYSS
> **Branche de base :** `architecture/phase-2-technical-design` (`632e737450469a68de1cdb29750a3ef0163a429b`)
> **Décision associée :** DEC-040
> **Référence de cadrage :** [DEC-039](../06-operations/decision-log.md#dec-039--phase-38-corrective-prerequisite--historical-corpus-integrity--intégrité-du-corpus-historique)
> **Gate A correctif :** GREEN
> **Arbitrages Fondateur :** CR-001 à CR-012, CGA-001 à CGA-008 et CTA-001 à CTA-012 approuvés
> **Statut Phase 3.8 League Context :** `FROZEN_PENDING_CORRECTION`

---

## 1. Objet et autorité

Ce document fixe la conception technique corrective autorisée après le cadrage DEC-039 et le Gate A correctif Historical Corpus Integrity déclaré vert. Il couvre un seul chantier transversal, divisé en deux lots atomiques et séquentiels :

1. Lot A — `CACHE_HISTORY_TRANSPARENCY` ;
2. Lot B — `SPORTS_SEASON_IDENTITY`.

La conception ferme les choix laissés ouverts par DEC-039. Elle ne réécrit aucune décision historique et n'autorise aucune implémentation.

Les preuves statiques acceptées par CGA-001 proviennent de la [documentation officielle football-data.org v4](https://www.football-data.org/documentation/quickstart). Cette documentation établit notamment que :

- un match expose un objet `season` comprenant une identité et des bornes calendaires ;
- une compétition expose `currentSeason` et une collection `seasons` ;
- le paramètre provider `?season=YYYY` désigne l'année de début de la saison, et non son identifiant stable.

Ces éléments complètent les preuves exécutables du repository. Aucun appel réel à football-data.org ou à Sportmonks n'est nécessaire ni autorisé pour cette conception.

```text
CR_001_TO_012=APPROVED
CGA_001_TO_008=APPROVED
CTA_001_TO_012=APPROVED
CORRECTIVE_GATE_A=GREEN
REAL_CALLS=0
```

## 2. Problèmes corrigés et résultat attendu

Le chantier traite exactement les deux anomalies établies par DEC-039 :

- le décorateur `InMemoryCache` ne propage pas actuellement `HistoryFilter`, réduit un appel historique sans dates à une fenêtre synthétique `now/+7 jours` et peut substituer un corpus scheduled au corpus historique ;
- l'adapter football-data.org dérive actuellement `Match.seasonId` de l'année civile de `utcDate`, ce qui scinde une même saison sportive lorsqu'elle traverse le 1er janvier.

Le résultat attendu est un chemin composé dans lequel :

```text
Application
-> InMemoryCache
-> SportsDataProvider concret
```

préserve l'intention exacte de chaque appel, tandis que l'adapter football-data.org distingue strictement :

```text
DOMAIN_SEASON_ID
!=
PROVIDER_SEASON_START_YEAR
```

L'identité domaine provient de `season.id`. L'année de requête provider provient de `season.startDate` sur une saison résolue depuis le catalogue.

## 3. Invariants communs et séquencement

Le chantier reste une correction de prérequis à Phase 3.8, pas une nouvelle capacité produit.

```text
CORRECTIVE_STRUCTURE=ONE_TRANSVERSAL_CORRECTIVE_WORKSTREAM_TWO_ATOMIC_LOTS
LOT_A_FIRST=YES
LOT_A_IMPLEMENTATION_PR_SEPARATE=YES
LOT_B_IMPLEMENTATION_PR_SEPARATE=YES
LEAGUE_CONTEXT_STATUS=FROZEN_PENDING_CORRECTION
```

Le Lot A devra être implémenté, audité, fusionné et audité post-fusion avant toute implémentation du Lot B. Chaque implémentation exigera une autorisation explicite ultérieure du Fondateur.

Les invariants suivants restent inchangés :

- deux appels logiques maximum au provider par requête Application actuelle ;
- un seul appel logique historique ;
- aucun accès réseau par équipe, match cible ou calculator ;
- calculators purs, déterministes, sans I/O, sans réseau, sans `Date.now()` et sans mutation d'entrée ;
- erreurs contrôlées sans fuite du payload provider ;
- aucun real-call dans les validations locales.

## 4. Lot A — Signature complète et transparence du décorateur

`InMemoryCache` devra implémenter la signature complète déjà définie par `SportsDataProvider` :

```typescript
getMatches(
  competitionCode: string,
  fromDate?: Date,
  toDate?: Date,
  historyFilter?: HistoryFilter
): Promise<Match[]>;
```

Le décorateur transmettra les quatre arguments au provider enveloppé, sans modifier leur valeur, leur présence, leur ordre ni leur identité objet.

Sont notamment interdits :

- l'omission du quatrième argument ;
- la fabrication de dates absentes ;
- la copie sémantiquement différente d'un filtre ;
- le tri ou la déduplication de `seasonIds` ;
- la conversion d'une requête historique en requête range ou current-season.

```text
SPORTS_DATA_PROVIDER_CHANGE_REQUIRED=NO
HISTORY_FILTER_CHANGE_REQUIRED=NO
CACHE_FULL_SIGNATURE_REQUIRED=YES
CACHE_ARGUMENT_FORWARDING=EXACT
INPUT_MUTATION=NO
```

## 5. Lot A — Classification déterministe des modes

La présence de `historyFilter` a priorité sur la combinaison de dates. La matrice normative est la suivante :

| `historyFilter` | `fromDate` | `toDate` | Mode | Politique de cache |
|---|---:|---:|---|---|
| présent, y compris `{}` | absent | absent | `HISTORY` | cache namespace `history` |
| présent | présent | absent | `HISTORY` | cache namespace `history` |
| présent | absent | présent | `HISTORY` | cache namespace `history` |
| présent | présent | présent | `HISTORY` | cache namespace `history` |
| absent | présent | présent | `RANGE` | cache namespace `range` |
| absent | absent | absent | `CURRENT_SEASON` | cache namespace `current-season` |
| absent | une seule borne | — | `RANGE_BYPASS` | aucun cache |

La règle de précédence est donc :

1. si `historyFilter !== undefined`, sélectionner `HISTORY` ;
2. sinon, si les deux dates sont présentes, sélectionner `RANGE` ;
3. sinon, si aucune date n'est présente, sélectionner `CURRENT_SEASON` ;
4. sinon, transmettre l'appel en bypass.

Même dans un mode `HISTORY` mixte, toutes les bornes réellement reçues sont transmises inchangées. La conception ne donne pas au cache le droit d'interpréter ou de corriger une combinaison d'arguments appartenant au provider enveloppé.

```text
CURRENT_SEASON_DATE_SYNTHESIS=NO
CURRENT_SEASON_PROVIDER_NATIVE_SEMANTICS=YES
MIXED_DATES_PLUS_FILTER_POLICY=HISTORY_NAMESPACE_FORWARD_ALL_ARGUMENTS_UNCHANGED
ONE_BOUND_RANGE_CACHE_POLICY=BYPASS
ONE_BOUND_WITHOUT_HISTORY_FILTER_CACHE_POLICY=BYPASS
```

## 6. Lot A — Clés canoniques et namespaces

Trois namespaces distincts sont obligatoires :

```text
range
current-season
history
```

La clé devra être construite depuis un payload structuré, déterministe et correctement échappé. Une concaténation ambiguë de valeurs libres est interdite. La représentation textuelle exacte de la sérialisation reste un détail interne tant que les invariants ci-dessous sont prouvés par tests.

### 6.1 Namespace `range`

Le payload logique contient :

```text
{
  mode: "range",
  competitionCode,
  fromUtcDay,
  toUtcDay
}
```

La granularité reste le jour UTC pour les deux bornes. Deux instants distincts appartenant aux mêmes jours UTC représentent donc la même requête range.

### 6.2 Namespace `current-season`

Le payload logique contient :

```text
{
  mode: "current-season",
  competitionCode
}
```

Aucune date n'est ajoutée au payload ou à l'appel provider.

### 6.3 Namespace `history`

Le payload logique contient au minimum :

```text
{
  mode: "history",
  competitionCode,
  fromDate: { presence, exactUtcInstantIfPresent },
  toDate: { presence, exactUtcInstantIfPresent },
  historyFilter: {
    presence: true,
    seasonCount: { presence, valueIfPresent },
    seasonIds: { presence, orderedValuesIncludingDuplicatesIfPresent }
  }
}
```

Les dates historiques présentes sont représentées par leur instant UTC exact et déterministe. La réduction au jour UTC est réservée à `RANGE` : elle ne doit pas fusionner deux appels historiques que le port transmet comme deux `Date` distinctes.

La clé distingue notamment :

- filtre absent et filtre vide `{}` ;
- propriété `seasonIds` absente et tableau vide `[]` ;
- `seasonCount: 2` et `seasonCount: 3` ;
- chaque ordre distinct de `seasonIds` ;
- une occurrence et plusieurs occurrences du même ID ;
- chaque combinaison réelle de bornes présentes ou absentes ;
- `RANGE`, `CURRENT_SEASON` et `HISTORY`, même lorsque d'autres valeurs coïncident.

Si `seasonCount` et `seasonIds` coexistent, les deux propriétés sont encodées. La clé ne décide pas laquelle le provider concret utilisera.

```text
CACHE_NAMESPACES=range,current-season,history
CACHE_KEY_HISTORY_FILTER_AWARE=YES
CACHE_MODE_COLLISION_FORBIDDEN=YES
RANGE_DATE_KEY_GRANULARITY=UTC_DAY
HISTORY_DATE_KEY_GRANULARITY=EXACT_UTC_INSTANT
SEASON_IDS_CACHE_ORDER_POLICY=PRESERVE
SEASON_IDS_CACHE_DUPLICATE_POLICY=PRESERVE
```

## 7. Lot A — TTL, concurrence, succès et erreurs

La correction de clé et de propagation ne change pas les garanties existantes du cache :

- un TTL unique par instance ;
- valeur par défaut `600_000 ms` ;
- toute résolution réussie est mise en cache, y compris `[]` ;
- une erreur n'est jamais mise en cache ;
- aucune valeur expirée n'est servie en stale-on-error ;
- les requêtes simultanées de même clé partagent une promesse `in-flight` ;
- des clés différentes ne partagent jamais leur promesse ;
- le registre `in-flight` est nettoyé dans `finally`, après succès comme après rejet ;
- le bypass à une borne sans filtre ne crée ni entrée cache ni promesse partagée.

```text
TTL_CHANGE_REQUIRED=NO
DEDUP_CHANGE_REQUIRED=NO
DEFAULT_TTL_MS=600000
SUCCESS_EMPTY_ARRAY_CACHED=YES
ERROR_CACHE_POLICY=NEVER_CACHE
ERROR_CACHE_POLICY_CHANGE_REQUIRED=NO
STALE_ON_ERROR=NO
IN_FLIGHT_DEDUPLICATION=PRESERVE_PER_CANONICAL_KEY
IN_FLIGHT_CLEANUP=FINALLY
```

## 8. Lot A — Télémétrie mode-aware

Les événements cache actuels exigent des champs `dateFrom` et `dateTo`. Cette forme ne peut pas décrire honnêtement `CURRENT_SEASON` ou un appel `HISTORY` sans dates après suppression de la fenêtre synthétique.

Le Lot A devra rendre la télémétrie cache discriminée par un champ obligatoire `cacheMode` :

```typescript
type CacheQueryMode = 'range' | 'current-season' | 'history';
```

Les règles sont :

- `range` conserve les deux jours UTC ;
- `current-season` ne contient aucune date métier ;
- `history` ne contient que les dates réellement fournies ;
- `cache_bypass` existe uniquement pour le mode conceptuel `range` avec une borne sans filtre et conserve l'information de la borne présente ;
- aucun événement ne recrée une date absente ;
- aucun événement n'expose la clé canonique complète ;
- aucun événement n'expose le filtre brut ni le tableau brut `seasonIds` ;
- aucun token, header ou payload provider n'est ajouté.

`cache_hit`, `cache_miss`, `cache_expired` et `cache_in_flight_join` deviennent une union discriminée par `cacheMode`. Dans la variante `range`, `dateFrom` et `dateTo` restent obligatoires au jour UTC. Dans la variante `current-season`, ces propriétés sont absentes. Dans la variante `history`, chacune est absente ou présente selon l'argument réellement reçu, sous sa représentation UTC canonique. `cache_bypass` accepte uniquement `cacheMode: 'range'`, conserve `providedBound` et n'invente pas la borne opposée. Aucun appel portant un `HistoryFilter` ne peut produire `cache_bypass`.

L'observer console peut conserver son comportement de sérialisation ; aucun changement de télémétrie provider n'est requis.

```text
CACHE_TELEMETRY_CHANGE_REQUIRED=YES
CACHE_TELEMETRY_MODE_FIELD=cacheMode
CACHE_TELEMETRY_MODE_VALUES=range,current-season,history
CACHE_TELEMETRY_DATE_POLICY=ONLY_ACTUAL_ARGUMENTS
CACHE_BYPASS_MODE_VALUES=range
PROVIDER_TELEMETRY_CHANGE_REQUIRED=NO
CACHE_FULL_KEY_TELEMETRY_EXPOSURE=NO
RAW_HISTORY_FILTER_TELEMETRY_EXPOSURE=NO
```

## 9. Lot A — Plan de tests futur

L'implémentation du Lot A devra ajouter ou adapter des tests unitaires prouvant :

### 9.1 Propagation

- les quatre arguments atteignent le leaf provider ;
- les mêmes objets `Date` et `HistoryFilter` sont reçus ;
- `seasonCount` et `seasonIds` sont inchangés ;
- l'ordre et les doublons de `seasonIds` sont préservés ;
- aucune entrée n'est mutée ;
- les quatre combinaisons de dates avec filtre sont transmises exactement ;
- les cas from-only et to-only avec filtre utilisent le cache `HISTORY` et ne passent pas par le bypass range ;
- le mode current-season transmet quatre arguments dont les trois optionnels valent `undefined` ;
- le bypass sans filtre transmet la borne unique et les autres arguments inchangés.

### 9.2 Clés et collisions

- instants différents du même jour UTC partagent une clé range ;
- jours UTC différents ne partagent pas une clé range ;
- `RANGE`, `CURRENT_SEASON` et `HISTORY` restent isolés ;
- un appel scheduled et `{ seasonCount: 3 }` ne partagent pas de corpus ;
- `seasonCount: 2` et `seasonCount: 3` restent isolés ;
- deux listes `seasonIds` de contenus différents restent isolées ;
- les permutations et duplications de `seasonIds` restent isolées ;
- deux séquences strictement identiques partagent la clé ;
- deux compétitions restent isolées ;
- les propriétés absentes restent distinguées des propriétés explicitement vides ;
- un filtre qui contient les deux propriétés les encode toutes deux.

### 9.3 Non-régressions du cache

- TTL froid, chaud et expiré sur chaque mode ;
- cache des succès `[]` ;
- non-cache des rejets ;
- aucun stale-on-error ;
- déduplication simultanée par clé ;
- absence de déduplication entre clés distinctes ;
- nettoyage `in-flight` après succès et rejet ;
- événements `cache_hit`, `cache_miss`, `cache_expired` et `cache_in_flight_join` vérifiés pour chaque mode ;
- `cache_bypass` vérifié pour une borne from-only et to-only, sans filtre, sans borne inventée ;
- événements télémétriques conformes et sans fuite.

Les tests existants qui imposent `sans dates -> now/+7 jours` devront être remplacés, car ils verrouillent précisément le comportement supersédé par DEC-020 et ciblé par ce correctif.

### 9.4 Test composé obligatoire du Lot A

Un test local devra composer :

```text
Application
-> InMemoryCache
-> controlled / recording SportsDataProvider
```

Sur une même requête `/analysis`, le recording fake fournira un corpus sentinelle scheduled au premier appel et un corpus sentinelle historique distinct au second. Les assertions minimales seront :

```text
leafCall[0] = [competitionCode, fixedNow, fixedNowPlus7, undefined]
leafCall[1] = [competitionCode, undefined, undefined, { seasonCount: 3 }]
leafCallCount = 2
scheduledCorpus != historyCorpus
HTTP_STATUS = 200
```

Une seconde requête identique devra démontrer que les deux namespaces ont chacun leur cache sans nouvel appel leaf. `seasonIds`, qui n'a pas de caller Application actuel, sera prouvé directement au niveau unitaire du cache ; aucun caller artificiel ne sera ajouté à la production.

### 9.5 Estimation de fichiers Lot A

Les fichiers probables sont :

```text
src/infrastructure/cache/memory/in-memory-cache.ts
src/shared/observability/telemetry.ts
tests/unit/in-memory-cache.test.ts
tests/unit/telemetry.test.ts
tests/integration/analysis.test.ts
```

```text
LOT_A_EXPECTED_FILE_COUNT_RANGE=3_TO_5
LOT_A_MOST_LIKELY_FILE_COUNT=5
```

Cette estimation n'est pas un contrat dur. Tout élargissement structurel devra être justifié lors de l'autorisation d'implémentation.

## 10. Lot B — Schémas privés football-data.org

L'adapter devra modéliser, dans ses types de transport privés, les métadonnées nécessaires sans modifier le domaine ni le port.

La forme conceptuelle est :

```typescript
interface FootballDataSeasonPayload {
  readonly id?: unknown;
  readonly startDate?: unknown;
  readonly endDate?: unknown;
}

interface FootballDataMatchPayload {
  // champs existants
  readonly season?: FootballDataSeasonPayload;
}

interface FootballDataCompetitionCatalogPayload {
  readonly currentSeason?: FootballDataSeasonPayload;
  readonly seasons?: readonly FootballDataSeasonPayload[];
}

interface ValidatedProviderSeasonIdentity {
  readonly domainId: string;
}

interface ValidatedCatalogSeason extends ValidatedProviderSeasonIdentity {
  readonly startDate: string;
  readonly startYear: number;
  readonly endDate?: string;
}

function validateProviderSeasonIdentity(
  raw: unknown
): ValidatedProviderSeasonIdentity;

function validateCatalogSeason(
  raw: unknown
): ValidatedCatalogSeason;
```

Ces interfaces décrivent la forme attendue après lecture, sans rendre le JSON fiable. Chaque valeur saison entre comme `unknown` dans l'un des deux validateurs privés. Le mapping d'un match exige seulement `ValidatedProviderSeasonIdentity`; toute résolution catalogue exige `ValidatedCatalogSeason`, dont `startDate` et `startYear` sont obligatoires. Aucune assertion ne peut promouvoir l'identité seule en saison catalogue. Ces représentations validées sont des détails privés de l'adapter, pas de nouvelles entités domaine.

`season.endDate` peut être modélisée et validée lorsqu'elle est présente. Elle n'est pas requise par l'algorithme correctif v1 et ne doit pas devenir un prétexte pour un appel supplémentaire.

```text
PRIVATE_SEASON_SCHEMA_REQUIRED=YES
DOMAIN_CHANGE_REQUIRED=NO
SEASON_END_DATE_REQUIRED_FOR_CORRECTIVE_ALGORITHM=NO
```

## 11. Lot B — Validation runtime et erreur contrôlée

La validation devra distinguer la représentation transport non fiable de la représentation interne validée.

Pour chaque match mappé :

- `season` doit être un objet ;
- `season.id` doit être soit un nombre entier fini, soit une chaîne non vide après contrôle ;
- `null`, `undefined`, booléens, objets, tableaux, symboles, bigints, nombres non finis et toute autre forme sont rejetés ;
- l'identité normalisée vaut exactement `String(raw.season.id)` ;
- aucun fallback depuis `utcDate`, une année de requête ou l'horloge n'est autorisé.

Pour chaque saison catalogue consommée :

- l'ID suit les mêmes règles ;
- `startDate` est obligatoire et doit être une date ISO civile valide `YYYY-MM-DD` ;
- `startYear` est extrait de cette date validée, en sémantique UTC ;
- `endDate`, lorsqu'elle est présente et consommée, doit suivre la même discipline de validation.

Le type d'erreur existant sélectionné pour une métadonnée saison ou un catalogue invalide est :

```text
EXACT_PROVIDER_ERROR_TYPE_SELECTED=ProviderUnavailableError
INVALID_SEASON_METADATA_ERROR=ProviderUnavailableError
CURRENT_SEASON_CATALOG_MISMATCH_ERROR=ProviderUnavailableError
MISSING_CATALOG_SEASON_ID_ERROR=ProviderUnavailableError
INVALID_CATALOG_PAYLOAD_ERROR=ProviderUnavailableError
```

Ce choix conserve la taxonomie exécutable actuelle de l'adapter pour les JSON, payloads et mappings incompatibles, ainsi que leur traduction HTTP publique en `503 / PROVIDER_UNAVAILABLE`. `ProviderRequestRejectedError` reste réservé à un rejet HTTP 400 explicite de l'upstream.

`ProviderDataMappingError` n'est pas activé par ce correctif : malgré son nom, il n'est actuellement utilisé ni par l'adapter ni par les routes. L'introduire dans ce chemin élargirait la portée et risquerait une traduction HTTP incohérente. Aucun nouveau type d'erreur n'est créé.

Les messages devront être statiques et contrôlés. Ils ne devront contenir ni JSON brut, ni corps de réponse, ni token, ni header sensible.

```text
INVALID_SEASON_METADATA_POLICY=CONTROLLED_PROVIDER_FAILURE
CURRENT_SEASON_CATALOG_MISMATCH=CONTROLLED_PROVIDER_FAILURE
MISSING_CATALOG_SEASON_ID_POLICY=CONTROLLED_PROVIDER_FAILURE
PARTIAL_RESULT_ON_PROVIDER_METADATA_ERROR=NO
```

## 12. Lot B — Mapping de l'identité domaine

Après validation runtime, le mapping normatif est :

```typescript
Match.seasonId = String(raw.season.id);
```

Une saison sportive traversant décembre et janvier conserve ainsi une identité unique. Deux saisons différentes comportant des matchs dans la même année civile restent distinctes.

Sont interdits :

- `matchDate.getUTCFullYear()` comme source d'identité ;
- `season-${year}` ou tout autre préfixe fabriqué ;
- l'année de début de saison comme `Match.seasonId` ;
- le paramètre `?season=YYYY` comme identité domaine ;
- un fallback sur l'année courante.

```text
DOMAIN_SEASON_ID_SOURCE=RAW_SEASON_ID
DOMAIN_SEASON_ID_STRING_MAPPING=String(raw.season.id)
UTC_DATE_FALLBACK=FORBIDDEN
QUERY_YEAR_AS_DOMAIN_ID=FORBIDDEN
```

## 13. Lot B — Résolveur catalogue

Le catalogue de la compétition devient le mécanisme nominal de résolution des requêtes historiques football-data.org.

Le résolveur privé devra :

1. charger exactement une fois le catalogue de la compétition pour un appel historique ;
2. valider l'enveloppe, `currentSeason` et `seasons[]` ;
3. normaliser chaque ID par `String(season.id)` ;
4. produire un `ValidatedCatalogSeason` pour chaque entrée consommée, avec `startDate` et `startYear` obligatoires ;
5. construire un index d'identité sans confondre ID et année ;
6. exiger une correspondance unique entre `currentSeason.id` et une entrée de `seasons[]` ;
7. retourner des saisons internes validées ou échouer avant tout résultat partiel.

Une identité dupliquée ou une ancre absente est un catalogue incompatible et provoque `ProviderUnavailableError`.

Pour l'ordre chronologique, les saisons sont triées par `startDate` décroissante. Un tie-break déterministe sur l'identité normalisée garantit un résultat stable ; deux entrées de même identité restent néanmoins invalides.

L'année injectée dans `?season=YYYY` vient exclusivement de la `startDate` validée de la saison résolue.

```text
CATALOG_HTTP_PER_HISTORY_INVOCATION=1
CURRENT_SEASON_ANCHOR=CATALOG_CURRENT_SEASON_ID
PROVIDER_QUERY_YEAR_SOURCE=CATALOG_SEASON_START_DATE
PROVIDER_SEASON_START_YEAR_SOURCE=RESOLVED_CATALOG_SEASON_START_DATE
DOMAIN_ID_QUERY_YEAR_CONFLATION=FORBIDDEN
```

## 14. Lot B — Algorithme `seasonCount`

Pour `HistoryFilter.seasonCount = K`, avec `K >= 1`, l'algorithme est :

1. résoudre le catalogue nominal sans effectuer d'abord une requête de matchs current-season ;
2. ordonner les saisons réelles par `startDate` décroissante ;
3. localiser l'ancre dont l'ID égale `currentSeason.id` ;
4. sélectionner l'ancre puis au plus `K - 1` saisons réellement plus anciennes ;
5. ignorer d'éventuelles entrées futures placées avant l'ancre ;
6. extraire l'année de début de chacune des saisons sélectionnées ;
7. appeler une fois `?season=YYYY` pour chaque saison sélectionnée, dans l'ordre N, N-1, etc. ;
8. mapper chaque match à partir de son propre `raw.season.id` ;
9. concaténer les résultats sans retour partiel en cas d'échec.

La sélection est conceptuellement équivalente à :

```typescript
orderedSeasons.slice(currentSeasonIndex, currentSeasonIndex + K);
```

Elle ne soustrait jamais `1` à une année. Les saisons non contiguës sont donc traitées correctement.

Si moins de `K` saisons réelles existent à partir de l'ancre, seules les saisons disponibles sont demandées et retournées. Cette règle n'autorise ni fabrication de saison ni récupération partielle après erreur : elle concerne uniquement un catalogue valide contenant moins de saisons.

```text
SEASON_COUNT_SELECTION_ALGORITHM=CATALOG_REAL_SEASONS_FROM_CURRENT_ID_ORDERED_BY_STARTDATE
FEWER_THAN_REQUESTED_SEASONS=RETURN_AVAILABLE_REAL_SEASONS_UP_TO_LIMIT
ARITHMETIC_YEAR_SUBTRACTION=NO
INITIAL_NATIVE_CURRENT_SEASON_MATCH_FETCH=NO
```

## 15. Lot B — Algorithme `seasonIds`

`HistoryFilter.seasonIds` reste provider-neutral et opaque. L'adapter ne doit jamais parser ces identifiants comme des années.

Pour une liste non vide, l'algorithme est :

1. charger et valider une fois le catalogue ;
2. construire l'index `String(catalogSeason.id) -> ValidatedCatalogSeason` ;
3. pré-résoudre la séquence demandée entière avant tout fetch saisonnier ;
4. échouer avec `ProviderUnavailableError` si une seule occurrence est absente ;
5. obtenir l'année de requête depuis `catalogSeason.startDate` ;
6. appeler les saisons dans l'ordre demandé ;
7. concaténer les matchs dans ce même ordre ;
8. reproduire les occurrences dupliquées dans le résultat observable de l'adapter football-data.org.

Une déduplication physique des téléchargements est optionnelle en v1. Si elle est retenue, elle doit réinsérer le corpus à chaque occurrence pour préserver strictement le résultat observable. L'absence d'optimisation est conforme.

Lorsque `seasonIds` non vide et `seasonCount` coexistent, `seasonIds` garde la priorité actuelle. Un tableau vide ne déclenche pas ce chemin et laisse `seasonCount` s'appliquer s'il est valide.

Cette garantie d'ordre et de doublons porte sur le résolveur football-data.org. Elle ne prétend pas modifier rétroactivement le résultat observable de tous les providers du repository. Le cache, lui, préserve toujours les arguments et leur forme exacte.

```text
SEASON_IDS_PROVIDER_NEUTRAL=YES
SEASON_IDS_PARSE_AS_YEAR_ALLOWED=NO
SEASON_IDS_RESOLUTION=CATALOG_ID_TO_START_DATE_TO_QUERY_YEAR
SEASON_IDS_ORDER_POLICY=PRESERVE
SEASON_IDS_DUPLICATE_POLICY=PRESERVE
SEASON_IDS_LENGTH_CAP=NONE
DUPLICATE_DOWNLOAD_OPTIMIZATION=OPTIONAL_V1
CURRENT_APPLICATION_SEASON_IDS_CALLERS=0
FUTURE_APPLICATION_SEASON_IDS_USAGE_REQUIRES_BUDGET_GATE=YES
```

## 16. Budget réseau et fail-fast

Pour le flux Application actuel avec `{ seasonCount: 3 }`, le budget nominal corrigé est :

```text
APPLICATION_PROVIDER_INVOCATIONS_MAX=2
HISTORY_PROVIDER_INVOCATIONS=1

SCHEDULED_HTTP_MAX=1
CATALOG_HTTP_MAX=1
HISTORY_SEASON_HTTP_MAX=3
HTTP_HARD_MAX_CURRENT_APPLICATION_FLOW=5

PER_TEAM_NETWORK=NO
PER_TARGET_MATCH_NETWORK=NO
N_PLUS_ONE=NO
RETRY_CHANGE_REQUIRED=NO
```

Le premier appel Application récupère le scheduled corpus en une requête HTTP maximum. Le second est un unique appel logique historique, résolu en un catalogue puis au plus trois requêtes de saison.

Les erreurs réseau, timeout, authentification, rate-limit, HTTP upstream, JSON invalide ou métadonnées invalides restent fail-fast selon leur taxonomie existante. Aucun retry, fallback ou résultat partiel n'est ajouté.

Le hard max de cinq concerne exclusivement le caller Application actuel et son `seasonCount: 3`. Un futur caller utilisant une liste `seasonIds` arbitraire devra passer un Gate budget dédié avant autorisation.

La stratégie catalogue nominale remplace, pour le futur chemin corrigé, l'ancien modèle « normal 4 / fallback catalogue 5 ». Les décisions historiques restent intactes comme trace de leur contexte.

## 17. Consommateurs domaine et absence de régression

Les identifiants stabilisés restent des chaînes opaques pour le domaine.

### H2H

H2H compare et compte des identités distinctes sans parser leur contenu. Trois vraies saisons restent donc représentables, y compris lorsqu'une saison traverse janvier.

```text
H2H_CODE_CHANGE_REQUIRED=NO
H2H_OPAQUE_SEASON_IDS_COMPATIBLE=YES
H2H_THREE_REAL_SEASONS_PRESERVABLE=YES
```

### Schedule Load

Schedule Load compare les identités exactement et résout localement N-1 depuis les dates des matchs. Il ne dépend ni d'un suffixe d'année ni d'une arithmétique sur `seasonId`. Son carryover de 28 jours reste inchangé.

```text
SCHEDULE_LOAD_CODE_CHANGE_REQUIRED=NO
SCHEDULE_LOAD_SEASON_ID_YEAR_PARSE=NO
SCHEDULE_LOAD_N1_CARRYOVER_PRESERVABLE=YES
```

### Calculators `TARGET_SEASON_ONLY`

Form 5, Season Strength, Momentum, Opponent Context et les autres consommateurs qui filtrent par identité bénéficient directement d'une saison stable cross-year. Aucun changement d'algorithme métier n'est requis.

```text
DOMAIN_CALCULATOR_CHANGE_REQUIRED=NO
TARGET_SEASON_ONLY_SEMANTICS=PRESERVED_AND_REPAIRED_UPSTREAM
```

## 18. Lot B — Plan de tests futur

### 18.1 Mapping et validation de match

Les tests adapter devront prouver :

- `raw.season.id = 742` produit exactement `seasonId = "742"` ;
- deux matchs de décembre et janvier avec le même ID gardent le même `seasonId` ;
- deux IDs différents dans une même année civile restent distincts ;
- `season` absent, `null` ou non objet échoue avec `ProviderUnavailableError` ;
- `season.id` absent, vide ou invalide échoue avec le même type ;
- un `utcDate` valide ne sauve jamais une saison invalide ;
- aucune valeur `season-${year}` n'est produite ;
- les messages contrôlés n'exposent aucun payload brut.

Tous les mocks de matchs non vides devront fournir une saison valide lors de l'implémentation. Cet ajustement de fixtures n'est pas un changement métier.

### 18.2 Catalogue et `seasonCount`

Les tests devront couvrir :

- catalogue désordonné et ordre N, N-1, N-2 par `startDate` ;
- ancrage exact par `currentSeason.id` ;
- entrée future avant l'ancre ;
- années de départ non contiguës ;
- `seasonCount` égal à 1, 2 et 3 ;
- moins de K saisons disponibles ;
- `currentSeason` absent, ambigu ou introuvable ;
- `seasons` absent ou non-array ;
- ID ou `startDate` invalide ;
- zéro requête saisonnière lorsque la validation catalogue échoue ;
- mapping de chaque match par son propre `raw.season.id` ;
- ordre des URLs `?season=YYYY` dérivé des dates validées.

### 18.3 `seasonIds`

Les tests devront prouver :

- des IDs opaques tels que `"742"` et `"733"` sont résolus par catalogue, jamais utilisés directement comme années ;
- un ID absent fait échouer la pré-résolution avant tout fetch saisonnier ;
- l'ordre inversé des IDs inverse l'ordre des appels et de l'agrégation ;
- un doublon est conservé dans le résultat ;
- une éventuelle optimisation de téléchargement ne change pas ce résultat ;
- la coexistence de `seasonIds` non vide et `seasonCount` applique la priorité définie ;
- aucun résultat partiel n'est retourné.

### 18.4 Budget et domaine

Les tests devront compter exactement :

```text
scheduled 1 + catalog 1 + season requests 3 = HTTP 5
```

Ils conserveront également les non-régressions H2H avec trois IDs opaques, Schedule Load avec N et N-1 opaques et les filtres `TARGET_SEASON_ONLY` sur une saison cross-year.

Les fichiers probables du Lot B sont :

```text
src/infrastructure/providers/football-data-org/football-data-org-adapter.ts
tests/unit/football-data-org-adapter.test.ts
tests/unit/football-data-org-adapter-history-filter.test.ts
tests/unit/<optional-season-identity-regression>.test.ts
```

```text
LOT_B_EXPECTED_FILE_COUNT_RANGE=3_TO_4
```

Cette estimation reste non contractuelle.

## 19. Validation finale composée et critères de sortie

Après fusion et audit post-fusion des deux lots, une validation locale composée devra couvrir ensemble :

```text
Application
-> InMemoryCache
-> controlled / recording provider
```

Elle prouvera :

- la séparation effective scheduled/history ;
- la propagation complète du filtre et de ses valeurs ;
- la propagation de `seasonCount` et, dans un cas contrôlé dédié, de `seasonIds` jusqu'au leaf ;
- les deux appels Application maximum ;
- l'absence de N+1 ;
- l'absence de collision entre namespaces ;
- le comportement cache chaud après un premier passage.

Les tests de l'adapter contrôleront séparément les réponses football-data.org simulées, le catalogue, le mapping des IDs et les saisons cross-year. Aucun test ne devra appeler un provider réel.

La baseline complète exigée après chaque implémentation autorisée reste :

```text
npm run typecheck
npx tsc -p tsconfig.client.json --noEmit
npm test
npm run build
```

Il faudra également rechercher `.skip(`, `.only(`, `xit(` et `xdescribe(`.

L'ordre final obligatoire est :

1. audit post-fusion du Lot B terminé ;
2. validation composée locale ;
3. baseline complète ;
4. réexécution depuis zéro du Gate A Phase 3.8 League Context.

League Context ne reprendra que si ce nouveau Gate est vert.

## 20. Périmètre structurel inchangé

DEC-040 n'autorise aucun des changements suivants :

```text
SPORTS_DATA_PROVIDER_CHANGE_REQUIRED=NO
HISTORY_FILTER_CHANGE_REQUIRED=NO
DOMAIN_CHANGE_REQUIRED=NO
NEW_ENDPOINT_REQUIRED=NO
FRONTEND_CHANGE_REQUIRED=NO
NEW_DEPENDENCY_REQUIRED=NO
PACKAGE_JSON_CHANGE_REQUIRED=NO
PACKAGE_LOCK_CHANGE_REQUIRED=NO
SQLITE_REQUIRED=NO
PERSISTENCE_REQUIRED=NO
GLOBAL_CACHE_REQUIRED=NO
SPORTMONKS_IMPLEMENTATION_REQUIRED=NO
```

Elle n'autorise pas non plus :

- la création ou la reprise de `LeagueContextCalculator` ;
- un score composite, une prédiction, un Power Rating ou une interprétation bookmaker ;
- une correction anticipée du cache ou de `seasonId` dans cette PR documentaire ;
- une modification d'`AGENTS.md` ;
- la fusion automatique de la PR DEC-040.

## 21. Gouvernance et prochaine étape

La présente PR doit contenir exclusivement ce document et l'entrée DEC-040 du Decision Log.

```text
DEC_040_IMPLEMENTATION_AUTHORIZATION=NO
LOT_A_IMPLEMENTATION_AUTHORIZATION=NO
LOT_B_IMPLEMENTATION_AUTHORIZATION=NO
LEAGUE_CONTEXT_IMPLEMENTATION_AUTHORIZATION=NO
```

Après ouverture de la PR documentaire DEC-040, la prochaine étape autorisée est exclusivement :

```text
AUDIT_PRÉ_FUSION_DEC_040
```

Si cet audit est vert, la fusion restera une action manuelle GitHub avec `Create a merge commit`, sans suppression de la branche source. L'audit post-fusion restera obligatoire. Seulement après ces étapes, une autorisation explicite distincte pourra ouvrir l'implémentation du Lot A.

```text
HISTORICAL_DECISIONS_REWRITTEN=NO
LEAGUE_CONTEXT_GATE_A_RERUN_REQUIRED=YES
NEXT_EXCLUSIVE_STEP=AUDIT_PRE_MERGE_DEC_040
```
