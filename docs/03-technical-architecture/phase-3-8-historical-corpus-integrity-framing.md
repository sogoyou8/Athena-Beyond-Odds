# Phase 3.8 corrective prerequisite — Historical Corpus Integrity / Intégrité du corpus historique — Cadrage (DEC-039)

> **Statut :** APPROUVÉE
> **Version :** 1.0
> **Nature :** `CORRECTIVE_FRAMING`
> **Date :** 2026-08-21
> **Responsable :** Fondateur ABYSS
> **Branche de base :** `architecture/phase-2-technical-design` (`24716f0b0166fdce88ce72f0726b80d71cfb980a`)
> **Décision associée :** DEC-039
> **Arbitrages Fondateur :** CR-001 à CR-012 approuvés formellement
> **Statut Phase 3.8 League Context :** `FROZEN_PENDING_CORRECTION`

---

## 1. Contexte et objet de la décision

La Phase 3.7 « Opponent Context / Contexte d'adversité » est clôturée.

DEC-038, qui cadre la Phase 3.8 « League Context / Contexte championnat », est fusionnée et auditée. Le premier Gate A Phase 3.8 avait initialement été déclaré conforme. Un audit correctif read-only ultérieur a cependant invalidé une hypothèse structurante de ce Gate : le corpus historique réellement transmis sur le chemin composé avec football-data.org ne respecte pas le contrat attendu.

Deux anomalies indépendantes et bloquantes ont été confirmées :

1. `HistoryFilter` est perdu dans la composition `Application -> InMemoryCache -> FootballDataOrgAdapter`.
2. `FootballDataOrgAdapter` dérive actuellement `Match.seasonId` de l'année civile de `utcDate`, ce qui ne représente pas de manière fiable une saison sportive traversant deux années civiles.

Ces anomalies compromettent les garanties nécessaires à `COMPETITION_WIDE`, au multi-saison et à `TARGET_SEASON_ONLY`.

DEC-039 crée donc un prérequis correctif transversal intitulé **Historical Corpus Integrity / Intégrité du corpus historique**.

Cette décision est exclusivement un cadrage. Elle ne constitue ni une conception technique corrective ni une autorisation d'implémentation.

---

## 2. Gel de League Context et attribution de DEC-039

La Phase 3.8 League Context reste gelée.

Tant que le chantier correctif n'est pas terminé, fusionné et audité, et tant que le Gate A Phase 3.8 n'a pas été rejoué depuis zéro, il est interdit de :

- concevoir techniquement `LeagueContextCalculator` ;
- implémenter `LeagueContextCalculator` ;
- modifier le frontend pour League Context ;
- poursuivre toute conception technique League Context ;
- considérer le premier Gate A Phase 3.8 comme une preuve suffisante.

```text
PHASE_38_STATUS=FROZEN_PENDING_CORRECTION
LEAGUE_CONTEXT_GATE_A_RERUN_REQUIRED=YES
```

L'ancienne DEC-039 annoncée comme future conception technique League Context n'a jamais été créée. Le numéro DEC-039 reste donc disponible et est attribué au présent cadrage correctif.

La future conception technique League Context recevra un nouveau numéro DEC, attribué uniquement lorsque sa reprise sera autorisée.

Les références prospectives présentes dans DEC-038 et son document de cadrage qui associaient la conception technique League Context, ou l'arbitrage de la formule du percentile, à « DEC-039 » sont conservées comme traces historiques. Leur intention produit reste valide, mais leur attribution numérique et leur séquencement sont supersédés par CR-002. Elles désignent désormais une future DEC League Context dont le numéro reste à attribuer.

Aucune décision historique n'est effacée ou réécrite.

```text
HISTORICAL_DECISIONS_REWRITTEN=NO
```

---

## 3. Faits établis par l'audit correctif

### 3.1 Anomalie A — Perte de `HistoryFilter`

L'Application demande explicitement un corpus historique mutualisé avec :

```typescript
getMatches(
  competitionCode,
  undefined,
  undefined,
  { seasonCount: 3 }
)
```

Le port `SportsDataProvider` prévoit conceptuellement `competitionCode`, `fromDate`, `toDate` et `HistoryFilter`. Cependant, sur le chemin réellement composé avec football-data.org, `InMemoryCache` ne déclare ni ne consomme `HistoryFilter`.

Le cache :

- ne propage pas `HistoryFilter` au provider décoré ;
- transforme l'absence de dates en une fenêtre calculée `now -> now + 7 jours` ;
- utilise une clé fondée sur `competitionCode`, `dateFrom` et `dateTo` ;
- ne représente ni `seasonCount` ni `seasonIds` dans cette clé ;
- ne distingue donc pas correctement un appel planifié d'un appel historique.

Le résultat effectif de l'appel historique composé n'est pas `COMPETITION_WIDE_3_SEASONS`. Une collision entre l'entrée de cache planifiée et l'appel historique est possible et confirmée architecturalement.

```text
ANOMALY_A_CONFIRMED=YES
ANOMALY_A_SEVERITY=BLOCKING
CACHE_HISTORY_FILTER_PROPAGATION_CURRENT=NO
CACHE_KEY_HISTORY_FILTER_AWARE_CURRENT=NO
SCHEDULED_HISTORY_COLLISION_RISK=CONFIRMED
```

### 3.2 Anomalie B — Identité de saison dérivée de l'année civile

Le mapping actuel de `FootballDataOrgAdapter` produit conceptuellement :

```typescript
seasonId = `season-${matchDate.getUTCFullYear()}`
```

Ainsi :

```text
2025-12-20 -> season-2025
2026-01-10 -> season-2026
```

Ces deux rencontres peuvent pourtant appartenir à la même saison sportive 2025/2026.

Cette dérivation peut :

- couper une saison sportive unique en deux identités domaine ;
- fusionner sous une même année civile des portions de saisons sportives adjacentes ;
- invalider un filtrage `TARGET_SEASON_ONLY` ;
- fausser un comptage de saisons H2H ;
- perturber le carryover N-1 de Schedule Load ;
- compromettre les populations saisonnières nécessaires à League Context.

Le modèle domaine possède déjà une notion d'identité de saison stable. Aucun changement domaine n'est actuellement démontré nécessaire.

```text
ANOMALY_B_CONFIRMED=YES
ANOMALY_B_SEVERITY=BLOCKING
STABLE_SPORTS_SEASON_ID_REQUIRED=YES
CALENDAR_YEAR_DERIVATION_FOR_SEASON_ID_FORBIDDEN=YES
```

---

## 4. Impact historique et portée des constats

La découverte de ces anomalies invalide une hypothèse précédemment utilisée lors de certains Gates et audits : la présence d'un contrat au niveau du port, ou d'un comportement correct dans un adapter isolé, ne prouve pas que tous les paramètres traversent correctement les décorateurs de la composition réelle.

```text
PREVIOUS_ASSUMPTION_INVALIDATED=YES
CORRECTIVE_AUDIT_REQUIRED=YES
```

Les Phases 3.2 à 3.7 sont classées `POTENTIALLY_AFFECTED` sur le chemin football-data.org réel. Cette classification ne signifie pas que tous les résultats historiques produits par ATHENA étaient faux.

Les validations locales InMemory utilisaient un chemin différent et ne suffisent pas à prouver la conformité du chemin composé football-data.org. Les contrats produit historiques restent néanmoins la cible fonctionnelle à préserver.

```text
HISTORICAL_PRODUCT_CONTRACTS=PRESERVED
REAL_PROVIDER_PATH_CONFORMANCE=CORRECTIVE_ACTION_REQUIRED
HISTORICAL_DECISIONS_NEED_REWRITE=NO
```

Les Phases 3.2 à 3.7 ne sont ni rouvertes ni réécrites automatiquement. La correction porte sur l'intégrité du chemin provider réel et sur les preuves E2E manquantes.

La Phase 3.8 est directement bloquée, car League Context exige simultanément un corpus de compétition réellement disponible, une étanchéité fiable de la saison cible et une population cohérente au cutoff temporel du match cible.

---

## 5. Structure du chantier correctif et arbitrages CR-001 à CR-012

Le chantier correctif est unique et transversal, avec deux lots atomiques :

| Lot | Nom | Objectif |
| :--- | :--- | :--- |
| A | `Cache History Transparency` | Rendre le décorateur cache sémantiquement transparent vis-à-vis de `SportsDataProvider` |
| B | `Sports Season Identity` | Garantir que `Match.seasonId` représente une identité stable de saison sportive |

Les deux lots appartiennent au même chantier, mais restent séparables, testables, auditables et traçables. Leurs implémentations doivent être portées par deux PR distinctes.

```text
CORRECTIVE_STRUCTURE=ONE_TRANSVERSAL_CORRECTIVE_WORKSTREAM_TWO_ATOMIC_LOTS
LOT_A_IMPLEMENTATION_PR_SEPARATE=YES
LOT_B_IMPLEMENTATION_PR_SEPARATE=YES
```

| Arbitrage | Décision |
| :--- | :--- |
| **CR-001** | Phase 3.8 reste gelée jusqu'à correction, fusion, audits et réexécution depuis zéro du Gate A Phase 3.8. |
| **CR-002** | DEC-039 est attribuée au cadrage correctif Historical Corpus Integrity. La future conception technique League Context recevra un nouveau numéro DEC. |
| **CR-003** | Un chantier correctif transversal est créé avec deux lots atomiques : Lot A Cache History Transparency et Lot B Sports Season Identity. |
| **CR-004** | Pour le Lot A, l'option privilégiée est un `InMemoryCache` réellement transparent vis-à-vis de `SportsDataProvider`, sans verrouiller encore la signature technique finale. |
| **CR-005** | Le cache ne doit inventer aucune sémantique métier. Il ne doit plus transformer implicitement un appel sans dates en `now -> now+7 jours`. |
| **CR-006** | Les espaces conceptuels `range`, `current-season` et `history` doivent être distinguables. La clé historique doit être sensible à `seasonCount` et `seasonIds`, sans figer sa représentation technique. |
| **CR-007** | DEC-008.3 est conservée historiquement, mais sa règle « sans dates -> now/+7j » est supersédée pour le décorateur provider par la sémantique postérieure à DEC-020. |
| **CR-008** | `Match.seasonId` doit représenter une identité stable de saison sportive. Toute dérivation depuis l'année civile du match est interdite. |
| **CR-009** | La source upstream exacte de la future identité de saison reste ouverte jusqu'au Gate A correctif. `raw.season.id` est une candidate, pas une solution verrouillée. |
| **CR-010** | `DOMAIN_SEASON_ID` et `PROVIDER_SEASON_START_YEAR` sont deux concepts distincts. Aucun parsing arbitraire de l'un depuis l'autre sans contrat prouvé. |
| **CR-011** | La séquence documentaire, Gate A, conception, implémentations séparées, audits, test E2E, baseline et nouveau Gate A Phase 3.8 est obligatoire. |
| **CR-012** | `REAL_CALLS=0`. Aucun changement de port, domaine, `HistoryFilter` ou budget HTTP sans nécessité démontrée par le Gate A correctif. |

```text
CR_001_TO_012=APPROVED
```

---

## 6. Lot A — Cache History Transparency

### 6.1 Objectif architectural

Le Lot A doit rendre le décorateur cache sémantiquement transparent vis-à-vis de `SportsDataProvider`.

Le décorateur devra conceptuellement :

- accepter l'ensemble des informations portées par l'appel provider ;
- préserver `competitionCode` ;
- préserver `fromDate` ;
- préserver `toDate` ;
- préserver `HistoryFilter` ;
- transmettre l'intention de l'appel sans la remplacer par une autre intention métier ;
- ne pas confondre deux appels de sémantiques différentes.

L'option privilégiée est l'évolution transparente du décorateur existant. DEC-039 ne verrouille cependant ni une signature de code finale, ni une structure interne, ni une sérialisation précise des clés.

```text
CACHE_TRANSPARENCY_REQUIRED=YES
```

### 6.2 Interdiction d'inventer une sémantique métier

Un appel `no dates + no HistoryFilter` doit rester conceptuellement un appel sans dates.

Un appel `no dates + HistoryFilter` doit rester conceptuellement un appel historique.

Un appel avec des bornes explicites doit conserver exactement l'intention de plage temporelle fournie.

Le cache ne doit pas transformer silencieusement l'un de ces modes en un autre et ne doit plus fabriquer une fenêtre `now -> now+7 jours` pour définir la sémantique métier du provider.

```text
CACHE_MUST_NOT_INVENT_BUSINESS_SEMANTICS=YES
```

### 6.3 Séparation conceptuelle des modes de cache

Le mécanisme de cache devra pouvoir distinguer au minimum les espaces conceptuels suivants :

1. `range` ;
2. `current-season` ;
3. `history`.

La représentation technique exacte reste ouverte jusqu'à la conception technique corrective.

Pour le mode `history`, la clé devra pouvoir représenter canoniquement `seasonCount` et `seasonIds`. Deux filtres historiques sémantiquement différents ne doivent pas partager une même entrée. Un appel planifié, un appel saison courante et un appel historique ne doivent pas entrer en collision.

```text
CACHE_KEY_MUST_BE_HISTORY_FILTER_AWARE=YES
CACHE_MODE_COLLISION_FORBIDDEN=YES
```

### 6.4 Préservation des propriétés existantes

Le Lot A doit préserver, sauf preuve contraire du Gate A correctif :

- le TTL existant ;
- la déduplication des appels in-flight ;
- le comportement des plages planifiées explicites ;
- le plafond des appels Application ;
- l'absence de N+1 ;
- l'absence de nouvel appel provider par équipe ;
- l'absence de nouvel endpoint ;
- l'absence de cache global ou persistant.

### 6.5 Supersession de DEC-008.3

DEC-008.3 reste présente dans l'historique documentaire. Elle n'est ni supprimée ni réécrite.

Sa règle historique `sans dates -> now/+7 jours` est explicitement supersédée, pour le décorateur de `SportsDataProvider`, par la sémantique provider plus récente introduite à compter de DEC-020 et par DEC-039.

Cette supersession ne décide pas de la forme technique future de la clé ou de la méthode. Elle interdit uniquement au décorateur cache d'altérer silencieusement l'intention de l'appel. Le comportement des plages explicitement bornées, le TTL, la gestion des erreurs et la déduplication restent des contraintes de non-régression.

```text
HISTORICAL_DECISIONS_REWRITTEN=NO
DEC_008_3_SUPERSEDED_FOR_PROVIDER_DECORATOR=YES
```

### 6.6 Questions laissées ouvertes

Le Gate A correctif et la future conception technique devront encore déterminer notamment :

- la forme exacte de la signature d'implémentation du cache ;
- la représentation canonique des différents modes ;
- la sérialisation exacte de `seasonCount` et `seasonIds` ;
- les règles de normalisation d'ordre ou de doublons éventuels dans `seasonIds` ;
- l'incidence sur la télémétrie du cache ;
- les éventuels cas de bypass ;
- l'étendue exacte des adaptations de tests.

DEC-039 ne tranche aucune de ces questions techniques.

---

## 7. Lot B — Sports Season Identity

### 7.1 Objectif architectural

Le Lot B doit garantir que `Match.seasonId` représente une identité stable de saison sportive.

Une saison sportive traversant le mois de janvier doit conserver la même identité domaine sur ses deux années civiles. Deux saisons sportives adjacentes doivent conserver des identités distinctes.

Il est interdit de construire cette identité depuis l'année civile de `Match.utcDate`.

```text
STABLE_SPORTS_SEASON_ID_REQUIRED=YES
CALENDAR_YEAR_MATCH_DATE_FALLBACK_FOR_SEASON_ID=FORBIDDEN
```

### 7.2 Source upstream exacte laissée ouverte

L'audit correctif a établi que le mapping actuel est incorrect. Il n'a pas établi, depuis les types exécutables actuels, quelle donnée upstream constituera nécessairement la source finale.

```text
EXACT_UPSTREAM_SEASON_ID_SOURCE=OPEN_UNTIL_CORRECTIVE_GATE_A
```

`raw.season.id` constitue une candidate à vérifier. Elle n'est pas verrouillée par DEC-039.

Le Gate A correctif devra examiner les données déjà disponibles ou modélisées afin d'établir si une identité stable, `season.id`, `season.startDate`, `season.endDate` ou une autre donnée locale fournit un contrat fiable et si les données existantes suffisent sans nouvel appel HTTP.

Aucun fallback silencieux vers l'année civile de `utcDate` n'est autorisé.

### 7.3 Séparation entre identité domaine et année de requête provider

`DOMAIN_SEASON_ID` désigne l'identité stable d'une saison sportive dans le domaine ATHENA.

`PROVIDER_SEASON_START_YEAR` désigne la valeur éventuellement nécessaire pour construire une requête provider telle que `?season=YYYY`.

Le fait qu'une API utilise une année de début pour une requête ne permet pas de conclure que cette année constitue l'identité domaine de la saison. Inversement, un identifiant domaine stable ne doit pas être parsé arbitrairement pour fabriquer une année de requête provider sans contrat démontré.

```text
SEASON_ID_AND_PROVIDER_START_YEAR=DISTINCT_CONCEPTS
```

### 7.4 Contraintes et questions ouvertes du Lot B

La future solution devra respecter les contraintes suivantes :

- aucune dérivation de `seasonId` par l'année civile du match ;
- même saison sportive à cheval sur janvier = même `Match.seasonId` ;
- saisons sportives adjacentes = identifiants distincts ;
- séparation explicite entre identité de saison et année de requête provider ;
- aucun fallback silencieux `utcDate -> seasonId` ;
- utilisation prioritaire des données upstream déjà disponibles si elles sont suffisantes ;
- aucun nouvel appel HTTP sauf nécessité démontrée ;
- aucun changement du domaine sauf nécessité démontrée ;
- aucun changement de `SportsDataProvider` sauf nécessité démontrée ;
- aucun changement de `HistoryFilter` sauf nécessité démontrée.

DEC-039 ne tranche pas la source upstream exacte, le format final de l'identifiant domaine, la source exacte du `PROVIDER_SEASON_START_YEAR`, la nécessité éventuelle d'un appel catalogue, d'un changement de port ou de domaine, ni la stratégie de validation d'une métadonnée absente ou invalide.

Ces points appartiennent au Gate A correctif puis à la future conception technique corrective.

---

## 8. Gate A correctif obligatoire

Après fusion documentaire de DEC-039 avec `Create a merge commit` et audit post-fusion conforme, un Gate A correctif 100 % read-only est obligatoire. Il ne constitue pas une autorisation d'implémentation.

### 8.1 Vérifications obligatoires — Lot A

1. Signature exacte du cache.
2. Propagation complète de `competitionCode`, `fromDate`, `toDate` et `HistoryFilter`.
3. Comportement réel sans dates.
4. Sémantique du mode `current-season`.
5. Sémantique du mode `history`.
6. Propagation de `seasonCount`.
7. Propagation de `seasonIds`.
8. Forme et propriétés nécessaires d'une clé de cache canonique.
9. Absence de collision entre `scheduled`, `current-season` et `history`.
10. Préservation du TTL.
11. Préservation de la déduplication.
12. Budget Application.
13. Budget HTTP.
14. Absence de N+1.
15. Faisabilité d'un test composé `Application -> Cache -> Adapter fake`.

### 8.2 Vérifications obligatoires — Lot B

16. Structure réelle des payloads upstream déjà modélisés localement.
17. Présence ou absence d'une identité stable de saison.
18. Présence éventuelle de `season.id`.
19. Présence éventuelle de `season.startDate`.
20. Présence éventuelle de `season.endDate`.
21. Source exacte proposée pour le futur `Match.seasonId`.
22. Source exacte proposée pour le futur `PROVIDER_SEASON_START_YEAR`.
23. Découplage entre identité domaine et année de requête.
24. Comportement sur une saison traversant janvier.
25. Comportement sur deux saisons sportives adjacentes.
26. Comptage de trois saisons sportives pour H2H.
27. Fiabilité de `TARGET_SEASON_ONLY`.
28. Préservation du carryover N-1 de Schedule Load.
29. Besoin réel ou non d'un appel HTTP supplémentaire.
30. Besoin réel ou non d'un changement de port.
31. Besoin réel ou non d'un changement domaine.

Si une preuve statique ou locale est insuffisante pour trancher un point, le Gate doit signaler explicitement l'incertitude. Il ne doit ni inventer une propriété upstream ni déclencher un real-call.

---

## 9. Critères de résultat vert du Gate correctif

Le Gate A correctif est vert uniquement si les quatre conditions suivantes sont satisfaites :

1. Une correction du cache peut rendre la composition sémantiquement transparente sans régression critique.
2. Une source stable de saison sportive peut être obtenue avec une architecture compatible.
3. Aucun blocker architectural ou sémantique ne reste ouvert.
4. Les budgets provider et HTTP restent maîtrisés, ou tout changement nécessaire est soumis à un nouvel arbitrage explicite avant conception ou implémentation.

Un Gate partiellement démontré, fondé sur une hypothèse upstream non vérifiée ou laissant subsister une collision de modes n'est pas vert.

---

## 10. Plans minimaux de tests futurs

### 10.1 Lot A

La future conception technique du Lot A devra prévoir au minimum :

- propagation de `HistoryFilter` ;
- propagation de `seasonCount` ;
- propagation de `seasonIds` ;
- propagation de `fromDate` ;
- propagation de `toDate` ;
- préservation de la sémantique `scheduled` ;
- préservation de la sémantique `current-season` ;
- préservation de la sémantique `history` ;
- séparation des modes de cache ;
- clés sensibles à `HistoryFilter` ;
- clés différentes pour des valeurs différentes de `seasonCount` ;
- clés différentes pour des valeurs différentes de `seasonIds` ;
- non-régression du TTL ;
- non-régression de la déduplication ;
- intégration `Application -> Cache -> fake Adapter` ;
- reproduction déterministe de la collision `scheduled/history` actuelle ;
- preuve déterministe que cette collision est corrigée ;
- maintien du nombre cible d'appels provider ;
- absence de N+1.

La forme exacte des tests, fakes et assertions sera arrêtée dans la conception technique corrective.

### 10.2 Lot B

La future conception technique du Lot B devra prévoir au minimum :

- deux matchs appartenant à la même saison sportive mais placés de part et d'autre du 1er janvier produisent le même `Match.seasonId` ;
- deux saisons sportives adjacentes conservent des identifiants distincts, y compris lorsqu'elles ont des matchs dans une même année civile ;
- `TARGET_SEASON_ONLY` inclut les deux moitiés calendaires d'une même saison sportive ;
- H2H compte des saisons sportives et non des années civiles ;
- le carryover N-1 de Schedule Load est préservé ;
- l'année de début utilisée pour une requête provider est distincte de l'identifiant domaine ;
- aucun fallback fondé sur l'année de `utcDate` ;
- fixtures InMemory inchangées sauf décision explicite ultérieure ;
- aucun appel HTTP supplémentaire sauf justification démontrée et arbitrée.

---

## 11. Test composé final obligatoire

Après les deux lots, une preuve E2E locale contrôlée est obligatoire sur la composition :

```text
Application
-> InMemoryCache
-> fake / controlled Adapter
```

Cette preuve doit démontrer simultanément que :

- l'appel planifié reste planifié ;
- l'appel historique reste historique ;
- `HistoryFilter` atteint le provider feuille ;
- `seasonCount` atteint le provider feuille ;
- `seasonIds` atteint le provider feuille ;
- le corpus historique n'est pas remplacé par une entrée de cache planifiée ;
- les modes ne partagent pas une clé ambiguë ;
- sur des données multi-années, une même saison sportive conserve le même `seasonId`.

Ce test ne doit effectuer aucun appel réseau réel.

---

## 12. Budgets provider, réseau et protections

Les valeurs suivantes restent des cibles à reprouver, et non des preuves héritées du premier Gate A Phase 3.8 :

```text
APPLICATION_PROVIDER_INVOCATIONS_MAX_TARGET=2
HISTORY_PROVIDER_INVOCATIONS_TARGET=1
N_PLUS_ONE_TARGET=NO
HTTP_HARD_MAX_TARGET=5
REAL_CALLS=0
```

Le chantier correctif ne doit introduire aucun appel provider par équipe, nouvel endpoint, N+1, cache global ou persistant, ni nouvel appel HTTP sans nécessité démontrée.

Aucun changement de `SportsDataProvider`, du domaine, de `HistoryFilter` ou des budgets HTTP n'est autorisé sans que le Gate A correctif le démontre nécessaire et qu'un arbitrage Fondateur ultérieur l'autorise explicitement.

Aucun appel réel à football-data.org ou Sportmonks n'est nécessaire ni autorisé tant qu'une preuve statique ou locale suffit. Le Gate doit privilégier les types exécutables, tests, fixtures, contrats, payloads déjà modélisés et transports simulés. Une incertitude upstream non résolue doit être rapportée comme telle ; elle ne constitue pas une autorisation implicite de real-call.

Aucun token ne doit être exposé.

---

## 13. Séquence de gouvernance obligatoire

La séquence approuvée est la suivante :

1. DEC-039 — cadrage correctif.
2. Audit pré-fusion documentaire DEC-039.
3. Fusion documentaire manuelle avec `Create a merge commit`.
4. Audit post-fusion DEC-039.
5. Gate A correctif 100 % read-only.
6. Conception technique corrective dans une nouvelle DEC.
7. Audit pré-fusion, fusion manuelle et audit post-fusion de cette conception.
8. Implémentation du Lot A.
9. Audit pré-fusion du Lot A.
10. Fusion manuelle du Lot A.
11. Audit post-fusion du Lot A.
12. Implémentation du Lot B.
13. Audit pré-fusion du Lot B.
14. Fusion manuelle du Lot B.
15. Audit post-fusion du Lot B.
16. Test et audit E2E composé local `Application -> Cache -> Adapter factice`.
17. Baseline complète.
18. Réexécution depuis zéro du Gate A Phase 3.8 League Context.
19. Reprise de League Context uniquement si ce Gate est vert.

Les étapes 8 et 12 restent conditionnées à une autorisation explicite du Fondateur après fusion et audit post-fusion de la conception corrective ; cette séquence ne vaut pas autorisation d'implémenter.

Les implémentations du Lot A et du Lot B doivent être portées par deux PR distinctes. Chaque PR devra néanmoins embarquer ses propres tests nécessaires à son audit ; le test composé final ne diffère pas les preuves propres à chaque lot.

Aucune étape ne peut être sautée.

---

## 14. Périmètre exclu de DEC-039

DEC-039 n'autorise aucune des actions suivantes :

- modifier le code ;
- corriger `InMemoryCache` ;
- corriger `FootballDataOrgAdapter` ;
- modifier `SportsDataProvider` ;
- modifier `HistoryFilter` ;
- modifier le domaine ;
- ajouter une dépendance ;
- modifier `package.json` ou `package-lock.json` ;
- créer un nouvel endpoint ;
- modifier les fixtures ;
- commencer `LeagueContextCalculator` ;
- créer la conception technique League Context ;
- effectuer un real-call ;
- fusionner automatiquement une PR.

La source exacte de l'identité de saison, la signature finale du cache et la forme finale des clés restent hors du périmètre de ce cadrage.

---

## 15. Récapitulatif formel de DEC-039

| Propriété | Décision |
| :--- | :--- |
| `CR_001_TO_012` | `APPROVED` |
| `DECISION_TYPE` | `CORRECTIVE_FRAMING` |
| `PHASE_38_STATUS` | `FROZEN_PENDING_CORRECTION` |
| `ANOMALY_A_CONFIRMED` | `YES` |
| `ANOMALY_A_SEVERITY` | `BLOCKING` |
| `ANOMALY_B_CONFIRMED` | `YES` |
| `ANOMALY_B_SEVERITY` | `BLOCKING` |
| `PREVIOUS_ASSUMPTION_INVALIDATED` | `YES` |
| `HISTORICAL_PRODUCT_CONTRACTS` | `PRESERVED` |
| `REAL_PROVIDER_PATH_CONFORMANCE` | `CORRECTIVE_ACTION_REQUIRED` |
| `HISTORICAL_DECISIONS_REWRITTEN` | `NO` |
| `DEC_008_3_SUPERSEDED_FOR_PROVIDER_DECORATOR` | `YES` |
| `CORRECTIVE_STRUCTURE` | `ONE_TRANSVERSAL_CORRECTIVE_WORKSTREAM_TWO_ATOMIC_LOTS` |
| `LOT_A` | `CACHE_HISTORY_TRANSPARENCY` |
| `LOT_B` | `SPORTS_SEASON_IDENTITY` |
| `CACHE_TRANSPARENCY_REQUIRED` | `YES` |
| `CACHE_MUST_NOT_INVENT_BUSINESS_SEMANTICS` | `YES` |
| `CACHE_KEY_MUST_BE_HISTORY_FILTER_AWARE` | `YES` |
| `CACHE_MODE_COLLISION_FORBIDDEN` | `YES` |
| `STABLE_SPORTS_SEASON_ID_REQUIRED` | `YES` |
| `EXACT_UPSTREAM_SEASON_ID_SOURCE` | `OPEN_UNTIL_CORRECTIVE_GATE_A` |
| `SEASON_ID_AND_PROVIDER_START_YEAR` | `DISTINCT_CONCEPTS` |
| `CORRECTIVE_GATE_A_REQUIRED` | `YES` |
| `LOT_A_IMPLEMENTATION_PR_SEPARATE` | `YES` |
| `LOT_B_IMPLEMENTATION_PR_SEPARATE` | `YES` |
| `LEAGUE_CONTEXT_GATE_A_RERUN_REQUIRED` | `YES` |
| `APPLICATION_PROVIDER_INVOCATIONS_MAX_TARGET` | `2` |
| `HISTORY_PROVIDER_INVOCATIONS_TARGET` | `1` |
| `HTTP_HARD_MAX_TARGET` | `5` |
| `N_PLUS_ONE_TARGET` | `NO` |
| `REAL_CALLS` | `0` |

---

## 16. Prochaine étape autorisée

Après création de DEC-039, la seule étape autorisée est :

> **Audit pré-fusion documentaire de DEC-039.**

Ne pas fusionner.

Ne pas créer la conception technique corrective.

Ne corriger ni le cache ni `seasonId`.

Ne pas commencer League Context.

Made in Abyss : Spark by the King
