> **Statut :** Mis ├á jour
> **Version :** 1.4

# Decision Log

## DEC-001 ÔÇö Arbitrage conditionnel sur les donn├®es sportives et le p├®rim├¿tre des comp├®titions MVP

- **Date :** 2026-07-17
- **Responsable :** Fondateur ABYSS
- **Statut :** D├®cision conditionnelle
- **Contexte :** Les questions ouvertes OQ-003 (Fournisseurs de donn├®es) et OQ-006 (Comp├®titions du MVP) bloquaient le passage ├á la Phase 2 (Architecture technique).
- **D├®cision :**
  - Approbation de l'orientation pour OQ-003 et OQ-006 sous forme d'une option interm├®diaire resserr├®e de 2 ├á 3 comp├®titions maximum.
  - Le passage ├á la Phase 2 est autoris├® sous conditions.
- **Conditions de validation factuelle :**
  - Confirmer une source de donn├®es acceptable (couverture, qualit├®, continuit├®, co├╗t soutenable).
  - Confirmer la liste exacte des comp├®titions s├®lectionn├®es.
  - V├®rifier les droits d'usage et d'affichage des donn├®es.
- **Cons├®quences :**
  - La pr├®paration de la Phase 2 (Architecture technique) peut d├®marrer.
  - Aucun d├®veloppement d├®pendant d'une source ou d'une comp├®tition pr├®cise ne doit ├¬tre consid├®r├® comme d├®finitivement valid├® avant confirmation.
  - Le p├®rim├¿tre pilote pourra ├¬tre r├®duit ou adapt├® si les conditions ci-dessus ne sont pas satisfaites.

## DEC-002 ÔÇö Passage conditionnel en Phase 2 et arbitrage du fournisseur de donn├®es de prototype

- **Date :** 2026-07-18
- **Responsable :** Fondateur ABYSS
- **Statut :** D├®cision valid├®e (Sous conditions de prototype)
- **Contexte :** ├Ç la suite de la d├®couverte des acc├¿s r├®els (Phase 1.20), il est ├®tabli que le plan d'essai Sportmonks ne couvre pas la Ligue 1, la Premier League ni l'UEFA Champions League. football-data.org donne acc├¿s ├á ces comp├®titions mais les saisons retourn├®es ne d├®montrent pas encore de saison commune. Le test complet des 18 rencontres est donc suspendu.
- **D├®cision :**
  - **Option A + B + C autoris├®e :** Poursuite du d├®veloppement du prototype de Phase 2 avec *football-data.org* de mani├¿re provisoire.
  - Engagement de d├®marches parall├¿les aupr├¿s de *Sportmonks* pour demander un acc├¿s d'├®valuation temporaire et un devis ├®crit.
  - Autorisation d'├®valuer un troisi├¿me fournisseur uniquement si Sportmonks refuse l'acc├¿s d'├®valuation.
  - **OQ-003 (Source de donn├®es) :** football-data.org valid├®e provisoirement pour le prototype.
  - **OQ-006 (Comp├®titions MVP) :** P├®rim├¿tre valid├® (Ligue 1, Premier League, UEFA Champions League).
- **Conditions, garde-fous et budget :**
  - **Budget et d├®penses :**
    - Budget maximal autoris├® : 0 Ôé¼
    - D├®pense imm├®diate autoris├®e : aucune
    - Actions autoris├®es : demandes de devis et dÔÇÖacc├¿s dÔÇÖ├®valuation uniquement
    - Souscription payante : non autoris├®e
    - Engagement financier : non autoris├®
  - **Garde-fous d'int├®gration :**
    - L'int├®gration de *football-data.org* doit ├¬tre trait├®e comme un prototype temporaire, et non comme un choix d├®finitif.
    - L'architecture de la Phase 2 doit impl├®menter une couche de normalisation et d'abstraction des donn├®es ind├®pendante du fournisseur afin de pr├®server la possibilit├® de remplacer le fournisseur.
    - API utilis├®es en lecture seule.
    - Maximum trois comp├®titions (Ligue 1, Premier League, UEFA Champions League).
    - Aucune redistribution de donn├®es brutes.
    - Aucune publication commerciale avant validation ├®crite des droits.
    - Aucune conservation longue dur├®e des donn├®es avant validation juridique.
    - Aucune cl├® d'API ni donn├®e sensible journalis├®e.
    - Suivi des quotas autoris├® sans journalisation des secrets.
    - Aucune d├®pendance irr├®versible au sch├®ma de donn├®es du fournisseur.
    - Aucun abonnement ni verrouillage contractuel sans nouvelle d├®cision du Fondateur.
    - La Pull Request de Phase 1 doit ├¬tre maintenue en mode brouillon (draft) tant que l'├®valuation comparative finale n'est pas arbitr├®e.
- **Cons├®quences :**
  - D├®marrage effectif de la Phase 2 sous r├®serve du respect strict de la couche d'abstraction de donn├®es et des garde-fous ci-dessus.
  - Pr├®paration des courriels dÔÇÖ├®valuation et demandes commerciales aupr├¿s de Sportmonks.

## DEC-003 ÔÇö Approbation de lÔÇÖarchitecture technique de Phase 2

- **Date :** 2026-07-18
- **Responsable :** Fondateur ABYSS
- **Statut :** D├®cision valid├®e
- **Contexte :** ├Ç lÔÇÖissue de la Phase 2.1 (d├®finition de lÔÇÖarchitecture), de la Phase 2.2 (ADR initiaux) et de la Phase 2.3 (dossier de validation), lÔÇÖarchitecture du prototype Athena a ├®t├® soumise ├á lÔÇÖapprobation formelle du Fondateur.
- **D├®cision :**
  - **Architecture globale approuv├®e** pour la conception d├®taill├®e.
  - **ADR-001 (Monolithe modulaire) :** Accept├®.
  - **ADR-002 (Abstraction des fournisseurs) :** Accept├®.
  - **ADR-003 (Mod├¿le de domaine normalis├®) :** Accept├®.
  - Actions autoris├®es : d├®finition de la structure initiale, pr├®paration des contrats de domaine, conception de lÔÇÖadaptateur football-data.org, r├®daction de nouveaux ADR technologiques.
  - **├ëcriture de code applicatif non encore autoris├®e.**
  - D├®cisions technologiques cl├®s diff├®r├®es (langage, framework, base de donn├®es, cache, h├®bergement, authentification, moteur de probabilit├®s, XAI) : ├®tude dans de nouveaux ADR autoris├®e.
- **Contraintes maintenus :**
  - Budget maximal : 0 Ôé¼, aucune d├®pense imm├®diate.
  - football-data.org reste provisoire ; Sportmonks reste non impl├®ment├® ; aucun fournisseur d├®finitif s├®lectionn├®.
  - Maximum trois comp├®titions, lecture seule, aucune redistribution ni conservation longue dur├®e des donn├®es.
  - Pull Request de Phase 1 maintenue en brouillon.
- **Justification :**
  - Choix dÔÇÖarchitecture pragmatiques respectant le budget nul et le d├®coupage modulaire, garantissant lÔÇÖind├®pendance vis-├á-vis du fournisseur de donn├®es.
- **Corrections demand├®es :** Aucune.

## DEC-004 ÔÇö Approbation des choix technologiques de la Phase 2.4

- **Date :** 2026-07-18
- **Responsable :** Fondateur ABYSS
- **Statut :** D├®cision valid├®e
- **Contexte :** Suite ├á la validation de l'architecture globale (DEC-003) et ├á la pr├®sentation des ADR-004 ├á ADR-007, le Fondateur a arbitr├® les quatre choix technologiques initiaux du prototype Athena.
- **D├®cisions :**
  - **ADR-004 ÔÇö Langage :** TypeScript / Node.js retenu.
  - **ADR-005 ÔÇö Framework :** Express avec structure modulaire explicite retenu (conditionnel ├á ADR-004 TypeScript).
  - **ADR-006 ÔÇö Persistance :** SQLite locale, minimale et d├®sactivable retenu. Option D (aucune persistance) reste utilisable si le cache seul suffit.
  - **ADR-007 ÔÇö Cache :** Cache m├®moire local dans le processus retenu. Migration vers Redis Upstash ├®valuable via un nouvel ADR si n├®cessaire.
- **Autorisations accord├®es :**
  - Pr├®paration de la structure d├®taill├®e du projet.
  - Pr├®paration des contrats de domaine.
  - Conception d├®taill├®e de l'adaptateur football-data.org.
  - **├ëcriture de code applicatif non encore autoris├®e** ÔÇö conditionn├®e ├á la finalisation des contrats de domaine.
- **Contraintes maintenues :**
  - Budget maximal : 0 Ôé¼, aucune d├®pense imm├®diate.
  - football-data.org reste provisoire ; Sportmonks reste non impl├®ment├®.
  - Maximum trois comp├®titions, lecture seule, aucune redistribution ni conservation longue dur├®e des donn├®es.
  - SQLite doit pouvoir ├¬tre d├®sactiv├®e ou supprim├®e ; aucune donn├®e brute fournisseur ne doit ├¬tre persist├®e.
  - Le cache doit avoir une dur├®e de vie courte et ├¬tre d├®sactivable ; aucune donn├®e brute fournisseur ne doit ├¬tre m├®moris├®e.
  - Aucun service cloud n'est obligatoire pour d├®marrer.
  - Pull Request de Phase 1 maintenue en brouillon.
- **Justification :**
  - Choix simples, gratuits et r├®versibles, coh├®rents avec le monolithe modulaire (ADR-001), l'architecture par ports et adaptateurs (ADR-002) et la contrainte de budget nul.
- **Corrections demand├®es :** Aucune.

## DEC-005 ÔÇö Approbation du cadrage fonctionnel de la Phase 2.7

- **Date :** 2026-07-29
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuv├®e par le Fondateur
- **Contexte :**
  - La Phase 2.6 a livr├® et fusionn├® le squelette technique approuv├®.
  - La Phase 2.7 pr├®pare la premi├¿re tranche fonctionnelle observable.
  - Cette tranche doit rester locale, fictive, d├®terministe et en lecture seule.
  - Aucun fournisseur r├®el, appel r├®seau ou stockage r├®el ne doit ├¬tre activ├®.
  - Huit d├®cisions fondatrices ont ├®t├® explicitement approuv├®es avant toute impl├®mentation.
- **D├®cision :**
  1. La seule comp├®tition disponible est `FL1`, avec des ├®quipes, matchs, identifiants et m├®tadonn├®es enti├¿rement fictifs.
  2. Le fournisseur factice retourne exactement trois matchs.
  3. La r├®ponse nominale utilise lÔÇÖenveloppe `{ "competitionCode": "FL1", "matches": [] }`.
  4. Toute autre comp├®tition retourne HTTP `404` avec `{ "error": "COMPETITION_NOT_AVAILABLE" }`.
  5. Le fournisseur factice est pr├®vu sous `src/infrastructure/providers/in-memory/in-memory-sports-data-provider.ts`.
  6. Le fournisseur est c├óbl├® directement et inconditionnellement dans la composition de lÔÇÖapplication, sans variable dÔÇÖenvironnement, factory, registre ou s├®lection dynamique.
  7. Le cas dÔÇÖusage porte le nom exact `ListScheduledMatchesUseCase` et est pr├®vu sous `src/application/use-cases/list-scheduled-matches.ts`.
  8. Les dates fixes sont `2099-08-14T18:00:00.000Z`, `2099-08-15T20:00:00.000Z` et `2099-08-16T19:30:00.000Z`.
- **Cons├®quences :**
  - Le cadrage fonctionnel de la Phase 2.7 est fig├®.
  - Le budget reste limit├® ├á `0 Ôé¼`.
  - La tranche reste en lecture seule et limit├®e ├á `FL1`.
  - Aucun appel r├®seau nÔÇÖest autoris├®.
  - Aucune persistance r├®elle nÔÇÖest autoris├®e.
  - Aucune d├®pendance npm suppl├®mentaire nÔÇÖest autoris├®e.
  - `InMemoryCache` reste inchang├® et inactif pour cette tranche.
  - `SqlitePersistence` reste inchang├®, logique et inutilis├®.
  - football-data.org reste provisoire et non activ├®.
  - Sportmonks reste non impl├®ment├®.
  - Aucun fournisseur r├®el ou d├®finitif nÔÇÖest s├®lectionn├®.
  - Cette d├®cision documentaire nÔÇÖautorise pas encore lÔÇÖimpl├®mentation.
  - Une autorisation s├®par├®e est requise avant toute cr├®ation de branche dÔÇÖimpl├®mentation ou ├®criture de code.
  - Toute d├®viation par rapport aux huit d├®cisions n├®cessite une nouvelle d├®cision.
- **R├®f├®rence :** [Pack de validation Phase 2.7](../03-technical-architecture/phase-2-7-functional-slice-validation-pack.md)

## DEC-006 ÔÇö Approbation du cadrage de connexion au fournisseur r├®el

- **Date :** 2026-07-30
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuv├®e par le Fondateur
- **Contexte :**
  - La Phase 2.7 a livr├® et fusionn├® la premi├¿re tranche fonctionnelle avec un fournisseur fictif (`InMemorySportsDataProvider`).
  - `FootballDataOrgAdapter` existe dans le squelette mais l├¿ve `NotImplementedError` sur toutes ses m├®thodes.
  - La Phase 2.8 pr├®pare la premi├¿re connexion observable ├á un fournisseur de donn├®es sportives r├®el.
  - Un cadrage initial proposant de remplacer `FL1` par `PL` a ├®t├® rejet├® par le Fondateur : la Ligue 1 figure dans la couverture officielle gratuite de football-data.org au 2026-07-30, avec le code API `FL1`.
- **D├®cision :**
  1. La cl├® API est lue exclusivement depuis la variable d'environnement `FOOTBALL_DATA_API_KEY` ÔÇö aucune valeur de cl├® ne doit figurer dans Git, les documents, les tests ou les logs ; l'absence de cl├® avec le fournisseur r├®el s├®lectionn├® provoque un ├®chec explicite au d├®marrage.
  2. La comp├®tition r├®elle retenue est `FL1` (Ligue 1) ÔÇö continuit├® avec la Phase 2.7, pr├®sence dans la couverture gratuite officielle au 2026-07-30 ; si un test r├®el retourne HTTP `403` pour `FL1`, l'impl├®mentation est arr├¬t├®e sans substitution automatique.
  3. L'activation du fournisseur est contr├┤l├®e par `SPORTS_DATA_PROVIDER` (`in-memory` par d├®faut, `football-data-org` pour le r├®el) ÔÇö aucun fallback automatique, aucun registre dynamique, s├®lection confin├®e ├á la composition de l'application ; cette d├®cision remplace l'interdiction de s├®lection dynamique de `DEC-005 ┬º6` pour la seule Phase 2.8.
  4. Le client HTTP utilis├® est `fetch` natif (`globalThis.fetch`) ÔÇö aucune d├®pendance npm suppl├®mentaire, transport injectable et typ├®, authentification via en-t├¬te `X-Auth-Token`, d├®lai maximal de 8 secondes via `AbortController`, aucun token dans les logs.
  5. La fen├¬tre temporelle est de 7 jours calendaires UTC : `[dateFrom, dateFrom + 7 jours)` ÔÇö `dateFrom` est la date UTC courante, l'horloge est injectable, aucun `Date.now()` non encapsul├® dans la logique test├®e.
  6. Les erreurs du fournisseur produisent HTTP `429` avec `{ "error": "PROVIDER_RATE_LIMIT" }` pour une limite de d├®bit, et HTTP `503` avec `{ "error": "PROVIDER_UNAVAILABLE" }` pour toute indisponibilit├® (erreur r├®seau, timeout, HTTP `401`, `403`, `5xx`, JSON invalide) ÔÇö aucun fallback vers `InMemorySportsDataProvider`, aucun token dans les r├®ponses.
- **R├®solution des questions ouvertes :**
  - Tests automatis├®s : aucun appel r├®seau r├®el dans `npm test`, transport `fetch` inject├® et simul├®.
  - Codes de comp├®tition : `FL1` uniquement, tout autre code d├®clenche `CompetitionNotAvailableError` avant tout appel r├®seau.
  - Chargement de la cl├® : variable d'environnement uniquement, aucun fichier `.env`, aucune d├®pendance suppl├®mentaire.
- **Cons├®quences :**
  - Le cadrage de la Phase 2.8 est fig├®.
  - Budget maintenu ├á `0 Ôé¼`.
  - D├®veloppement local uniquement ÔÇö aucun d├®ploiement public, aucun utilisateur tiers, aucune redistribution.
  - football-data.org reste provisoire et rempla├ºable.
  - Sportmonks reste non impl├®ment├®.
  - `InMemoryCache` et `SqlitePersistence` restent inchang├®s et inactifs.
  - Cette d├®cision documentaire n'autorise pas encore l'impl├®mentation.
  - Une autorisation s├®par├®e est requise avant toute cr├®ation de branche d'impl├®mentation ou ├®criture de code.
- **R├®f├®rence :** [Pack de validation Phase 2.8](../03-technical-architecture/phase-2-8-real-provider-validation-pack.md)

---

## DEC-007 ÔÇö Validation manuelle contr├┤l├®e du fournisseur r├®el

- **Date :** 2026-07-30
- **Statut :** Approuv├®e partiellement ÔÇö Niveau 1 valid├®
- **Responsable :** Fondateur ABYSS
- **R├®f├®rence :** Commit `86117f5c40db30d8c53b9edf528d777093fb7bae`
- **Branche :** `architecture/phase-2-technical-design`

### Contexte

Suite ├á l'impl├®mentation de la Phase 2.8 (`DEC-006`), la connexion r├®elle au fournisseur `football-data.org` a ├®t├® c├óbl├®e mais n'avait jamais ├®t├® ex├®cut├®e avec une cl├® authentifi├®e. La Phase 2.9 avait pour but d'effectuer une validation manuelle contr├┤l├®e en local sans modifier le code source.

### D├®cisions arr├¬t├®es

1. **DEC-007.1 (P├®rim├¿tre) :** Option A uniquement ÔÇö validation manuelle contr├┤l├®e du fournisseur r├®el sans modification du code ni ajout de d├®pendances.
2. **DEC-007.2 (V├®rification FL1) :** La couverture publique de `FL1` doit ├¬tre confirm├®e sur `football-data.org/coverage` (Free Tier) avant chaque test authentifi├® r├®el. V├®rification confirm├®e le `2026-07-30`.
3. **DEC-007.3 (Extension des comp├®titions) :** Non applicable et non autoris├®e en Phase 2.9. Seul `FL1` reste autoris├®.
4. **DEC-007.4 (Cache et Rate Limit) :** Non applicable en Phase 2.9 (`InMemoryCache` inactif, pas de retry ni de backoff).
5. **DEC-007.5 (Observabilit├®) :** Non applicable en Phase 2.9 (aucun logger npm ni changement de journalisation).

### R├®sultats et Statut

- **Niveau 1 (Connexion & Contrat HTTP) :** Valid├® avec succ├¿s le `2026-07-30`. Exactement 1 appel authentifi├® effectu├® vers `GET /competitions/FL1/matches`. Statut HTTP 200 re├ºu avec une enveloppe JSON normalis├®e et valide (`competitionCode: "FL1"`). S├®curit├® des logs confirm├®e (0 fuite).
- **Niveau 2 (Validation du mapping non vide) :** ├Ç rejouer ├á partir du **15 ao├╗t 2026** (reprise du championnat de Ligue 1), le tableau des matchs ├®tant vide (`matchCount: 0`) lors de la tr├¬ve estivale du 30 juillet 2026.

### Verdict canonique

`PHASE 2.9 VALIDATION PARTIELLE ÔÇö ACC├êS R├ëEL FL1 CONFIRME, TEST NON VIDE ├Ç REJOUER ├Ç PARTIR DU 15 AO├øT 2026`

---

## DEC-008 ÔÇö Activation contr├┤l├®e du cache m├®moire

- **Date :** 2026-07-30
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuv├®e par le Fondateur
- **R├®f├®rence :** Commit `76e1fd611145b6812bc6e747820397cda6e85553`
- **Branche :** `architecture/phase-2-technical-design`
- **Document de r├®f├®rence :** [phase-2-10-cache-activation-pack.md](../03-technical-architecture/phase-2-10-cache-activation-pack.md)

### Contexte

Suite ├á la validation de la Phase 2.9 (DEC-007), le fournisseur r├®el `football-data-org` est actif mais chaque appel ├á `GET /competitions/FL1/matches` d├®clenche un appel HTTP authentifi├® sans protection. La Phase 2.10 active `InMemoryCache` ÔÇö d├®corateur d├®j├á pr├®sent mais inactif ÔÇö pour r├®duire les appels identiques, limiter le risque de d├®passement de la limite de d├®bit du plan gratuit et r├®duire la latence.

### DEC-008.1 ÔÇö Activation du Cache

**D├®cision :** Cache actif uniquement avec `football-data-org`.

| `SPORTS_DATA_PROVIDER` | R├®solution |
|---|---|
| Absent | `InMemorySportsDataProvider` sans cache |
| `in-memory` | `InMemorySportsDataProvider` sans cache |
| `football-data-org` | `InMemoryCache` enveloppant `FootballDataOrgAdapter` |

Aucune nouvelle variable d'environnement. Aucun `CACHE_ENABLED`. Port `SportsDataProvider` inchang├®.

### DEC-008.2 ÔÇö TTL

**D├®cision :** TTL fixe de **10 minutes** (`600 000 ms`). Configurable par constructeur dans les tests. Contr├┤l├® par horloge injectable. Aucun d├®lai r├®el dans les tests.

### DEC-008.3 ÔÇö Cl├® du Cache et Fen├¬tre Temporelle

**D├®cision :** `{competitionCode}:{dateFrom}:{dateTo}` (exemple : `FL1:2026-07-30:2026-08-06`)

- **Deux dates fournies :** utiliser et transmettre exactement ces dates.
- **Aucune date :** cache calcule `dateFrom = maintenant UTC`, `dateTo = dateFrom + 7j UTC`, puis transmet ces dates explicitement au fournisseur d├®cor├®. Une seule fen├¬tre calcul├®e par requ├¬te.
- **Une seule borne :** d├®l├®gation sans mise en cache (bypass).
- La cl├® ne contient aucune donn├®e sensible (`FOOTBALL_DATA_API_KEY` et `X-Auth-Token` interdits).

### DEC-008.4 ÔÇö Comportement sur les Erreurs

- R├®ponse r├®ussie mise en cache, y compris `[]`.
- Non mis en cache : `ProviderRateLimitError`, `ProviderUnavailableError`, `CompetitionNotAvailableError`, `NotImplementedError`, toute erreur inconnue, toute promesse rejet├®e.
- Erreurs propag├®es sans modification.
- **Stale-on-error : INTERDIT.**
- **Retry : INTERDIT.**
- Valeur expir├®e non servie apr├¿s expiration.

### DEC-008.5 ÔÇö Concurrence

**D├®cision :** Option B ÔÇö in-flight deduplication via `Map<string, Promise<Match[]>>`.

- Premier appel sur cl├® froide : appel fournisseur, promesse stock├®e temporairement.
- Appel simultan├® sur m├¬me cl├® : r├®utilisation de la promesse en cours.
- Promesse termin├®e (succ├¿s ou ├®chec) retir├®e de la Map dans un bloc `finally`.

### DEC-008.6 ÔÇö Tests

Suite de 24 cas minimum sans appel r├®seau r├®el ni `setTimeout` r├®el, avec horloge injectable (voir pack de validation pour d├®tail complet).

### Condition d'Arr├¬t Architecturale

Avant l'impl├®mentation, v├®rifier que `FootballDataOrgAdapter.getMatches()` respecte les param├¿tres `fromDate`/`toDate` explicites. Observation actuelle : l'adaptateur ignore ces param├¿tres (pr├®fix├®s `_`) et recalcule en interne. Si la correction de ce contrat n'est pas autoris├®e, arr├¬ter avec :

```text
PHASE 2.10 BLOQU├ëE ÔÇö CONTRAT DES FEN├èTRES DE DATES ├Ç ARBITRER
```

---

## DEC-009 ÔÇö Observabilit├® minimale et s├╗re

- **Date :** 2026-08-05
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuv├®e par le Fondateur
- **R├®f├®rence :** Commit `fcd3d80d20157baec4c407c9fe7d653384aa1e33`
- **Branche :** `architecture/phase-2-technical-design`
- **Document de r├®f├®rence :** [phase-2-11-minimal-observability-pack.md](../03-technical-architecture/phase-2-11-minimal-observability-pack.md)

### DEC-009.1 ÔÇö ├ëv├®nements Observables

├ëv├®nements cache approuv├®s : `cache_hit`, `cache_miss`, `cache_expired`, `cache_bypass`, `cache_in_flight_join`.
├ëv├®nements fournisseur approuv├®s : `provider_request_started`, `provider_request_succeeded`, `provider_rate_limited`, `provider_unavailable`.
Champ de dur├®e : `durationMs` (num├®rique >= 0) pr├®sent sur `provider_request_succeeded`, `provider_rate_limited` et `provider_unavailable`.
Aucun ├®v├®nement s├®par├® `provider_request_duration`. Aucun ├®v├®nement ajout├® dans `matches-route.ts`, `ListScheduledMatchesUseCase`, `SportsDataProvider` ou le domaine.

### DEC-009.2 ÔÇö Observer Typ├® Injectable

Option A retenue : `TelemetryObserver = (event: TelemetryEvent) => void` injectable dans `InMemoryCache` et `FootballDataOrgAdapter`.
Observer par d├®faut : no-op `() => {}`. Domaine et port `SportsDataProvider` inchang├®s.
Isolation obligatoire : Une exception de l'observer est captur├®e et n'alt├¿re jamais la r├®ponse m├®tier, le cache ou le nettoyage `in-flight`.

### DEC-009.3 ÔÇö Activation par Variable d'Environnement

Variable optionnelle `ATHENA_TELEMETRY=off|console` (d├®faut : `off`).
`off` ou absente : observabilit├® d├®sactiv├®e (observer no-op). `console` : observer console activ├®. Valeur inconnue : ├®chec au d├®marrage.
Aucun fichier `.env`, aucun `dotenv`, aucune d├®pendance npm. Silent par d├®faut dans les tests (`npm test`).

### DEC-009.4 ÔÇö Donn├®es Autoris├®es et S├®curit├® des Secrets

Champs autoris├®s : `type`, `competitionCode`, `dateFrom` (YYYY-MM-DD), `dateTo` (YYYY-MM-DD), `matchCount`, `durationMs`, `providedBound`, `failureKind`.
Donn├®es interdites : `FOOTBALL_DATA_API_KEY`, en-t├¬te `X-Auth-Token`, headers complets, URL compl├¿te, query string brute, corps fournisseur, objets `Request`/`Response`/`Error`, messages d'erreur bruts, stack traces, chemins locaux.
Cat├®gories d'erreur contr├┤l├®es (`failureKind`) : `timeout`, `network`, `unauthorized`, `forbidden`, `upstream_5xx`, `invalid_response`, `unknown`.

### DEC-009.5 ÔÇö Destination et Format Console

Lorsque `ATHENA_TELEMETRY=console`, format NDJSON (une ligne JSON valide par ├®v├®nement) contenant `"scope": "athena.telemetry"`.
Canaux : `stdout` (`console.log`) pour ├®v├®nements normaux, `stderr` (`console.error`) pour `provider_rate_limited` et `provider_unavailable`.
Aucune r├®tention (pas de fichier log, pas de SQLite, pas de Redis, pas de SaaS, pas d'OpenTelemetry).

### DEC-009.6 ÔÇö Tests Obligatoires

Suite de 45 cas minimum (cache, fournisseur, mesure du temps, composition) sans aucun appel r├®seau r├®el, sans `setTimeout` r├®el et d├®terministe.

---

## DEC-010 — Stabilisation et hardening minimal des contrats existants

- **Date :** 2026-08-06
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** 9b39ab52aab68531a976da86a6a92df889b47689
- **Branche :** rchitecture/phase-2-technical-design
- **Document de référence :** [phase-2-12-minimal-hardening-pack.md](../03-technical-architecture/phase-2-12-minimal-hardening-pack.md)

### DEC-010.1 — Nature de la phase

La Phase 2.12 est une phase de hardening interne. Elle ne doit ajouter aucune fonctionnalité métier, aucun endpoint, aucune compétition, aucun fournisseur, aucune persistance, aucune rétention, aucune dépendance et aucun changement de contrat HTTP public.

Objectifs : réduire des duplications prouvées, corriger un mapping dormant incorrect, harmoniser la sécurité d'une erreur de configuration, renforcer le typage d'un test et verrouiller les comportements par des tests déterministes.

### DEC-010.2 — Helpers UTC partagés

L'implémentation future pourra créer exactement src/shared/date-utils.ts exposant ormatUtcDate(date: Date): string et ddUtcDays(date: Date, days: number): Date.
Contrats : ormatUtcDate produit YYYY-MM-DD en UTC sans modifier la Date reçue ni lire l'heure système. ddUtcDays retourne une nouvelle instance Date ajustée en jours UTC sans modifier l'argument.
Utilisation future limitée à in-memory-cache.ts et ootball-data-org-adapter.ts. L'extraction doit préserver strictly la fenêtre de 7 jours UTC [dateFrom, dateTo), les bornes explicites, les clés de cache et la déduplication in-flight.

### DEC-010.3 — Correction de competitionId

Dans le mapping futur de FootballDataOrgAdapter, competitionId: 'FL1' devra être remplacé par competitionId: competitionCode.
Contraintes : le fournisseur réel reste limité à FL1, aucune nouvelle compétition n'est activée, aucune substitution n'est autorisée, une compétition inconnue reste rejetée avant tout appel réseau.

### DEC-010.4 — Sécurité de SPORTS_DATA_PROVIDER

Pour une valeur invalide de SPORTS_DATA_PROVIDER, le comportement fail-fast existant doit être conservé. Le message futur doit être exactement :
[Athena] Invalid SPORTS_DATA_PROVIDER value. Expected "in-memory" or "football-data-org".
La valeur reçue ne doit pas apparaître dans le message, les propriétés d'erreur, la console ou la télémétrie. Le test futur doit utiliser une sentinelle (secret-provider-value-that-must-not-appear) et vérifier son absence complète.

### DEC-010.5 — Typage strict du test d'intégration

L'unique occurrence catch (err: any) dans 	ests/integration/provider-selection.test.ts devra être remplacée par catch (err: unknown) avec un rétrécissement de type explicite et sûr.

### DEC-010.6 — Éléments différés et intouchables

ProviderQuotaExceededError, ProviderAuthError, ProviderDataMappingError, ProviderRateLimitError.resetTimeMs, ainsi que les méthodes getCompetitions() et getMatchDetails() avec NotImplementedError restent strictement inchangées pendant la Phase 2.12. Aucune suppression, renommage ou dépréciation n'est autorisée.

### DEC-010.7 — Tests futurs

L'implémentation future devra conserver les 125 tests existants et ajouter au minimum 22 cas déterministes portant le total strictly au-dessus de 125 tests. Tous les tests doivent être déterministes, sans réseau réel, sans clé réelle et sans pollution console.

### DEC-010.8 — Fichiers futurs autorisés

Limitation stricte à 8 fichiers : src/shared/date-utils.ts, src/infrastructure/cache/memory/in-memory-cache.ts, src/infrastructure/providers/football-data-org/football-data-org-adapter.ts, src/app.ts, 	ests/unit/date-utils.test.ts, 	ests/unit/in-memory-cache.test.ts, 	ests/unit/football-data-org-adapter.test.ts, 	ests/integration/provider-selection.test.ts.

### DEC-010.9 — Fichiers protégés

Le domaine, les use cases, les ports, les interfaces, la télémétrie et les fichiers de configuration restent protégés.

### DEC-010.10 — Hors périmètre

SQLite, persistance, retry, backoff, fallback, réseau réel, .env et dépendances restent totalement proscrits.

---

## DEC-011 — Clôture de la Phase 2 et ouverture du cadrage de la Phase 3

- **Date :** 2026-08-06
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** `3ce6e204fc6acffb1ffde03cda78bcf8875e02fa`

### DEC-011.1 — Clôture de la Phase 2

La Phase 2 (Architecture technique du prototype Athena) est officiellement clôturée. Son commit final de référence est `3ce6e204fc6acffb1ffde03cda78bcf8875e02fa`. Aucune Phase 2.13 n'est requise, l'ensemble des objectifs d'architecture, d'isolation du domaine, d'observabilité et de hardening minimal ayant été atteints.

### DEC-011.2 — Validation Phase 2.9 Niveau 2

La validation Phase 2.9 Niveau 1 reste validée et archivée. Le rejeu du Niveau 2 (match réel FL1 normalisé avec clé API) reste planifié à partir du 15 août 2026. Il constitue un contrôle différé non bloquant pour la clôture officielle de la Phase 2. Son résultat sera documenté séparément lors de son exécution. Aucun appel réseau réel n'est effectué dans cette PR.

### DEC-011.3 — Ouverture de la Phase 3

La Phase 3 porte sur le Design UX/UI et l'Interface Utilisateur de la plateforme Athena. La Phase 3.1 porte spécifiquement sur les fondations UX/UI et la spécification du Design System. Elle s'appuie sur les documents produit et design existants et ne doit inventer aucune nouvelle fonctionnalité métier.

### DEC-011.4 — Questions ouvertes OQ-001 à OQ-006

Les questions ouvertes `OQ-001` à `OQ-006` doivent être analysées sur la base de leur formulation officielle exacte. Aucune question ne peut être résolue sans preuve documentaire ou arbitrage explicite du Fondateur consignée dans le Decision Log.

### DEC-011.5 — Interdiction d'implémentation

Cette décision n'autorise aucun code frontend, aucun choix de framework (React, Vue, Svelte, etc.), aucune bibliothèque de composants, aucun composant exécutable, aucune connexion d'interface à l'API, aucune modification du backend Express, aucune nouvelle route, aucune nouvelle compétition, aucune authentification, ni aucun système de paiement, cote ou pari.

### DEC-011.6 — Prochaine autorisation

La prochaine autorisation éventuelle du Fondateur portera uniquement sur la production documentaire détaillée des spécifications de la Phase 3.1 après audit et fusion de la présente PR.


Sont strictement exclus : SQLite, MatchRepository, ATHENA_PERSISTENCE, persistance, rétention, historisation, Sportmonks, nouveaux fournisseurs, compétitions, endpoints, authentification, UI, cotes, retry, backoff, cloud, SaaS, OpenTelemetry, suppression des erreurs applicatives orphelines, implémentation de getCompetitions/getMatchDetails, et validation Phase 2.9 Niveau 2.

---

## DEC-012 — Production documentaire détaillée de la Phase 3.1

- **Date :** 2026-08-06
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** `d39757f5bb6aeb74d8dea58fd7633a5c5e49544e`

### DEC-012.1 — Autorisation

Le cadrage documentaire de la Phase 3.1 (fusionné via PR #14, commit `d39757f5bb6aeb74d8dea58fd7633a5c5e49544e`) est approuvé par le Fondateur. La production documentaire détaillée des spécifications UX/UI est autorisée. Aucune implémentation frontend n'est autorisée. Aucun choix de framework ou de bibliothèque UI n'est autorisé.

### DEC-012.2 — Périmètre de l'expérience

L'expérience du prototype est limitée à la consultation en lecture seule. Elle couvre l'état de santé de l'application (`GET /health`) et la liste des matchs programmés (`GET /competitions/:code/matches`). La seule compétition réelle actuellement prise en charge est `FL1` (Ligue 1). Il n'y a aucun détail de match, aucun compte utilisateur, aucune offre commerciale, aucune prédiction, aucune cote et aucune fonctionnalité de pari dans le périmètre du prototype.

### DEC-012.3 — États d'interface

L'interface doit représenter exactement les états suivants, sans en inventer d'autres :

```text
HTTP 200 avec matchs
HTTP 200 avec tableau vide
HTTP 404 — COMPETITION_NOT_AVAILABLE
HTTP 429 — PROVIDER_RATE_LIMIT
HTTP 503 — PROVIDER_UNAVAILABLE
Réseau local indisponible
Service de santé indisponible
```

### DEC-012.4 — Accessibilité et responsive

L'objectif d'accessibilité documentaire minimal est WCAG 2.1 niveau AA. La conception est mobile-first. Les références de travail responsive sont 360, 768 et 1280 px. La navigation clavier future et le focus visible sont requis. La taille de cible tactile minimale est de 44 × 44 px. Tout contenu transmis par couleur est doublé par un texte ou une forme. La réduction du mouvement (`prefers-reduced-motion`) sera respectée à l'implémentation.

### DEC-012.5 — Design System

La taxonomie de tokens documentaire est autorisée (couleurs sémantiques, typographie, espacement, rayons, élévation, mouvement). L'anatomie documentaire des composants est autorisée. Les valeurs de marque ne sont pas finalisées. Aucune police, palette, bibliothèque ou technologie n'est choisie. Les décisions visuelles finales sont soumises à arbitrage futur du Fondateur.

### DEC-012.6 — Questions ouvertes

Les questions `OQ-001`, `OQ-002`, `OQ-004` et `OQ-005` restent ouvertes. `OQ-003` reste partiellement résolue (DEC-002/DEC-006). `OQ-006` reste une décision conditionnelle (DEC-001/DEC-005). L'emploi du français dans les wireframes ne résout pas `OQ-004`. Aucune question ne peut être résolue arbitrairement.

### DEC-012.7 — Wireframes

Seuls les wireframes basse fidélité sont autorisés. Les formats autorisés sont Markdown, Mermaid et ASCII. Aucune image binaire, maquette haute fidélité, export graphique ou prototype exécutable n'est produit. Aucune fonction non supportée par l'API actuelle ne peut être représentée. Aucune page de détail de match n'est autorisée.

### DEC-012.8 — Interdictions

Sont interdits dans le cadre de la Phase 3.1 : tout code frontend, tout projet frontend, tout framework (React, Vue, Svelte, Angular, etc.), toute bibliothèque UI (Tailwind, Bootstrap, Material UI, Shadcn, etc.), toute connexion UI/API, toute modification backend, toute dépendance supplémentaire, toute authentification, tout compte, tout paiement, toute prédiction, toute cote, tout pari, tout déploiement, tout analytics, toute collecte de données personnelles.

### DEC-012.9 — Prochaine décision

La prochaine décision éventuelle devra porter sur la validation des spécifications Phase 3.1, l'arbitrage des choix visuels encore ouverts (direction visuelle, palette, typographie, iconographie) et l'éventuel cadrage technologique frontend. Elle ne portera pas sur une implémentation automatique.

---

## DEC-013 — Arbitrages visuels et sélection technologique frontend

- **Date :** 2026-08-07
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** `5723698f82dcd9298a1f9e12ba00ddd208de7610`

### DEC-013.1 — Direction visuelle

La direction visuelle « Tableau de Bord Moderne » (`Option 2`) est approuvée par le Fondateur. Elle privilégie une sobriété professionnelle, des surfaces structurées avec surélévation subtile (`surface.elevated`), une hiérarchie typographique nette et une priorité absolue à la lisibilité et à l'accessibilité mobile (Mobile-First). Sont proscrits : toute esthétique casino ou de pari, toute décoration gratuite et toute surcharge visuelle.

### DEC-013.2 — Arbitrages visuels complémentaires

Les arbitrages visuels autonomes suivants sont arrêtés :
- **Apparence :** Support du mode clair et du mode sombre, initialisé sur la préférence système (`prefers-color-scheme`) avec option de bascule manuelle.
- **Densité :** Équilibrée (`Option B`), optimisée pour les références compactes de 360 px et fluides jusqu'à 1280 px.
- **Forme :** Légèrement arrondie (`Option B` — `radius.medium`).
- **Iconographie :** Fonctionnelle standard (`Option B` — icônes discrètes et informatives).
- **Ton rédactionnel :** Clair, humain et transparent (`Option B` — messages factuels sans jargon HTTP).

### DEC-013.3 — Valeurs graphiques restant ouvertes

Les valeurs graphiques et de marque suivantes restent non décidées et soumises à intégration visuelle ultérieure : palette de couleurs exacte et valeurs hexadécimales, famille typographique (`font-family`), poids et tailles exacts, valeurs CSS graphiques en pixels (`border-radius`, `box-shadow`), source vectorielle d'icônes, logo officiel et charte graphique détaillée.

### DEC-013.4 — Technologie frontend retenue

La sélection technologique frontend est arrêtée sur : HTML sémantique + CSS natif + TypeScript client minimal servi par Express (`Option 1`). L'architecture privilégie l'intégration Same-Origin avec l'application serveur Express Phase 2 pour éliminer les surcoûts d'infrastructure, le CORS et la complexité de déploiement.

### DEC-013.5 — Absence de framework et d'outils complexes

Aucun framework frontend (React, Vue, Angular, Svelte), meta-framework SSR (Next.js, Nuxt), bibliothèque de composants UI (Tailwind, Bootstrap, Material UI, Shadcn), routeur client, gestionnaire d'état global, bundler frontend supplémentaire ni moteur de templates serveur additionnel n'est requis ni approuvé pour l'implémentation initiale du prototype.

### DEC-013.6 — Préservation de l'architecture backend

Cette décision ne modifie aucune API HTTP existante (`GET /health`, `GET /competitions/:code/matches`), aucun endpoint, aucun domaine ni aucun port. Elle n'autorise pas encore le serveur Express à servir des assets statiques frontend. Toute modification d'Express nécessaire au service d'assets devra apparaître explicitement dans un cadrage d'implémentation ultérieur.

### DEC-013.7 — Preservations des questions ouvertes

Les questions ouvertes `OQ-001`, `OQ-002`, `OQ-004` et `OQ-005` restent ouvertes. `OQ-003` reste partiellement résolue et `OQ-006` reste une décision conditionnelle. Le ton rédactionnel clair et l'emploi du français dans les spécifications ne résolvent pas `OQ-004` (*Langue(s) initiale(s) du MVP*).

### DEC-013.8 — Interdiction d'implémentation

Cette décision n'autorise aucune écriture de code frontend (aucun fichier HTML/CSS/TS client exécutable), aucune modification du serveur Express, aucune installation de dépendances (`npm install`), aucun framework, aucun déploiement, aucun appel réseau réel et aucune nouvelle fonctionnalité métier.

### DEC-013.9 — Prochaine autorisation

La prochaine décision pourra porter uniquement sur le cadrage d'implémentation frontend (structure exacte des fichiers, stratégie de compilation TypeScript client, service d'assets par Express, harnais de tests d'interface et critères d'acceptation). Elle ne constitue pas une autorisation automatique de coder.

---

## DEC-014 — Cadrage de l'implémentation frontend Phase 3.1

- **Date :** 2026-08-07
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** `88184110dbff27d695728900c0c2635bd8c7d956`

### DEC-014.1 — Autorisation

Le cadrage documentaire de l'implémentation frontend (PR #17) est autorisé et approuvé par le Fondateur. Il s'agit d'une spécification exclusivement documentaire. Aucun code frontend, aucune modification d'Express et aucune installation de dépendances ne sont autorisés par cette décision.

### DEC-014.2 — Périmètre de la première tranche d'implémentation

La première tranche d'implémentation frontend couvrira une vue principale unique en lecture seule consommant les deux endpoints existants (`GET /health` et `GET /competitions/:code/matches`) pour la compétition Ligue 1 (`FL1`). Sont exclus : détail de match, compte utilisateur, authentification, plans commerciaux, paiement, MFA, prédictions, cotes, paris, classements, historique, favoris et notifications.

### DEC-014.3 — Structure de fichiers future approuvée

La structure future proposée (`src/frontend/public/index.html`, `src/frontend/styles/main.css`, `src/frontend/ts/`, `scripts/copy-assets.js`, `dist/public/`) est approuvée pour une future autorisation d'implémentation. *Mention obligatoire : STRUCTURE APPROUVÉE POUR FUTURE IMPLÉMENTATION — FICHIERS NON CRÉÉS PAR CETTE PR.*

### DEC-014.4 — Stratégie de build et d'assets

La stratégie de compilation TypeScript client via une configuration dédiée (`tsconfig.client.json` réutilisant `tsc` déjà installé) et la copie des assets via un script Node.js natif (`scripts/copy-assets.js`) est approuvée. Elle garantit 0 nouvelle dépendance npm et un build 100% reproductible sans bundler supplémentaire.

### DEC-014.5 — Service Same-Origin avec Express

La stratégie de service same-origin via l'ajout d'un middleware statique Express (`express.static('dist/public')`) dans `src/app.ts` est approuvée. Aucun asset n'est servi par cette PR documentaire et aucun CORS n'est requis pour le fonctionnement nominal.

### DEC-014.6 — Modèle d'état client

Le modèle d'état client explicite (union `initial`, `loading`, `matches`, `empty`, `competitionUnavailable`, `rateLimited`, `providerUnavailable`, `networkUnavailable`, `healthUnavailable`) est approuvé sans nécessiter de framework ni de gestionnaire d'état global.

### DEC-014.7 — Sécurité et requêtes réseau

Toutes les requêtes client utiliseront des URLs relatives Same-Origin (`/health`, `/competitions/FL1/matches`). Aucun secret, aucune clé API (`FOOTBALL_DATA_API_KEY`) et aucun header d'authentification ne seront exposés dans le client. Aucun polling automatique ni retry automatique ne sera mis en place.

### DEC-014.8 — Thème et apparence

L'apparence s'adaptera initialement à la préférence système (`prefers-color-scheme`) avec option de bascule manuelle en session. Aucune persistance entre sessions (localStorage, cookie, serveur) n'est décidée.

### DEC-014.9 — Plan de tests

L'implémentation future devra inclure des tests unitaires/DOM pour le client et des tests d'intégration Express pour le service des assets statiques. La totalité des 146 tests backend existants devra continuer de réussir sans aucune désactivation de test.

**Nuance sur les dépendances de test :**

- Les tests d'intégration Express pour le service des assets statiques sont réalisables sans nouvelle dépendance (`supertest` est déjà présent). ✅
- Les tests DOM automatisés du client nécessiteront un environnement DOM. L'environnement Vitest actuel est configuré en `environment: 'node'`. Les librairies `jsdom`, `happy-dom` et `@vitest/browser` sont **absentes** du projet. Une `devDependency` de test DOM devra faire l'objet d'un arbitrage explicite lors de la prochaine autorisation d'implémentation. La déclaration "0 nouvelle dépendance npm" vaut uniquement pour le **runtime** et le **service statique**.

### DEC-014.10 — Valeurs visuelles conservées ouvertes

Les valeurs graphiques détaillées (palette hexadécimale, fontes exactes, tailles/poids, pixels de bordures et ombres, logo) restent non décidées et seront définies sous forme de variables CSS lors de l'intégration visuelle.

### DEC-014.11 — Interdictions strictes

Sont strictement interdits : tout code frontend exécutable, toute modification backend, toute nouvelle dépendance npm, tout framework (React, Vue, Svelte, Next.js), toute bibliothèque UI, tout routeur client, tout state manager, tout bundler supplémentaire et tout moteur de templates serveur additionnel.

### DEC-014.12 — Prochaine autorisation

La prochaine décision pourra porter sur l'ouverture d'une première tranche d'implémentation frontend minimale. Cette future autorisation devra préciser explicitement les fichiers créables, les fichiers modifiables, les scripts, la configuration TypeScript client et les critères de réception. Aucun code n'est autorisé automatiquement par `DEC-014`.