> **Statut :** Mis à jour
> **Version :** 2.7

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

La prochaine décision pourra porter sur l'ouverture d'une première tranche d'implémentation frontend minimale. Cette future autorisation devra préciser explicitement les fichiers créables, les fichiers modifiables, les scripts, la configuration TypeScript client, les dépendances de développement éventuellement requises pour les tests DOM et les critères de réception. Aucun code n'est autorisé automatiquement par `DEC-014`.

---

## DEC-015 — Autorisation d'implémentation de la première tranche frontend Phase 3.1

- **Date :** 2026-08-07
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** `2069e9a4acb4f5a32e888172f8450227d7e95712`

### DEC-015.1 — Autorisation officielle

La réalisation de la première tranche d'implémentation frontend minimale pour Athena: Beyond Odds est officiellement autorisée aux conditions strictes définies ci-après. Cette autorisation constitue un mandat d'implémentation exclusif pour les seuls 11 nouveaux fichiers à créer et 4 fichiers existants à modifier listés dans `DEC-015.2` et `DEC-015.3`.

### DEC-015.2 — Fichiers nouveaux autorisés à la création (11 fichiers)

Seuls les 11 fichiers suivants sont autorisés à la création dans le dépôt Git :

1. `src/frontend/public/index.html` (Squelette HTML5 sémantique)
2. `src/frontend/styles/main.css` (Styles CSS natifs et variables tokens)
3. `src/frontend/ts/main.ts` (Point d'entrée TypeScript client)
4. `src/frontend/ts/api-client.ts` (Client Fetch Same-Origin `/health` et `/competitions/FL1/matches`)
5. `src/frontend/ts/render.ts` (Fonctions de rendu DOM textuel sécurisé via `textContent`)
6. `tsconfig.client.json` (Configuration TypeScript client dédiée)
7. `scripts/copy-assets.js` (Script Node.js natif de nettoyage et de copie des assets)
8. `tests/frontend/api-client.test.ts` (Tests unitaires du client Fetch avec mocks)
9. `tests/frontend/render.test.ts` (Tests unitaires DOM de `render.ts` avec `@vitest-environment happy-dom`)
10. `tests/frontend/main.test.ts` (Tests d'orchestration client avec `@vitest-environment happy-dom`)
11. `tests/integration/static-serving.test.ts` (Tests d'intégration Express du service statique via Supertest et fixture temporaire)

### DEC-015.3 — Fichiers existants autorisés à la modification (4 fichiers)

Seuls les 4 fichiers existants suivants sont autorisés à la modification :

1. `src/app.ts` (Ajout de `CreateAppOptions` et montage de `express.static(publicPath)` après les routeurs API `/health` et `/competitions/:code/matches`)
2. `tsconfig.json` (Ajout de `"src/frontend/**/*"` dans le tableau `exclude` du backend)
3. `package.json` (Ajout des scripts de build client et de `"happy-dom": "16.0.0"` dans `devDependencies`)
4. `package-lock.json` (Mise à jour automatique suite à `npm install --save-dev --save-exact happy-dom@16.0.0`)

### DEC-015.4 — Autorisation explicite de devDependency

La seule nouvelle dépendance npm autorisée dans le projet est :

- **Package :** `happy-dom`
- **Clef :** `devDependencies` uniquement
- **Version exacte figée :** `16.0.0`
- **Commande exacte autorisée :** `npm install --save-dev --save-exact happy-dom@16.0.0`
- **Restriction :** Utilisation exclusive sous l'entête `// @vitest-environment happy-dom` dans les fichiers de test client. Aucun import de `happy-dom` n'est autorisé sous `src/`.

### DEC-015.5 — Séquence et scripts de build autorisés

Les scripts npm suivants sont approuvés pour intégration dans `package.json` :

- `"build:clean": "node scripts/copy-assets.js clean"`
- `"build:server": "tsc"`
- `"build:client": "tsc -p tsconfig.client.json"`
- `"build:assets": "node scripts/copy-assets.js copy"`
- `"build": "npm run build:clean && npm run build:server && npm run build:client && npm run build:assets"`

Le script `scripts/copy-assets.js` devra utiliser exclusivement les modules Node.js natifs (`node:fs`, `node:path`, `node:url`) et déduire la racine du projet à partir d' `import.meta.url` de manière indépendante du répertoire de travail (`process.cwd()`).

### DEC-015.6 — Configuration TypeScript client autorisée (`tsconfig.client.json`)

La configuration client dédiée devra spécifier exactement :

- `module`: `"NodeNext"`
- `moduleResolution`: `"NodeNext"`
- `target`: `"ES2022"`
- `lib`: `["DOM", "ES2022"]`
- `types`: `[]`
- `rootDir`: `"./src/frontend/ts"`
- `outDir`: `"./dist/public/js"`
- `strict`: `true`
- `noEmitOnError`: `true`
- `declaration`: `false`
- `sourceMap`: `false`
- `include`: `["src/frontend/ts/**/*"]`

Toutes les importations relatives inter-modules dans `src/frontend/ts/` utiliseront obligatoirement l'extension `.js` (ex: `import { fetchScheduledMatches } from './api-client.js';`).

### DEC-015.7 — Service Same-Origin Express et Ordre des Middlewares

La fonction `createApp` dans `src/app.ts` sera étendue de manière 100% rétrocompatible :

```typescript
export interface CreateAppOptions {
  publicPath?: string;
}

export function createApp(
  customProvider?: SportsDataProvider,
  options: CreateAppOptions = {}
): Express
```

L'ordre des middlewares dans `createApp` est strictement imposé comme suit :

1. `app.use(express.json())`
2. `app.use('/', createHealthRouter())`
3. `app.use('/', createMatchesRouter(provider))`
4. `app.use(express.static(publicPath))`

La résolution de `publicPath` par défaut utilisera `fileURLToPath(import.meta.url)` pour remonter à la racine du dépôt et cibler `<repo>/dist/public` de manière 100% indépendante du répertoire de travail (`process.cwd()`).

### DEC-015.8 — Stratégie des tests d'intégration statique

Le fichier `tests/integration/static-serving.test.ts` utilisera des répertoires temporaires isolés (`fs.mkdtempSync`) injectés via `createApp(undefined, { publicPath: tempDir })` et testés par Supertest (`supertest`). Aucun test ne dépendra d'un build préalable résiduel ni ne lancera de sous-processus `execSync`.

### DEC-015.9 — Thème, Apparence et Valeurs CSS

L'apparence s'adaptera initialement à la préférence système (`prefers-color-scheme`) avec option de bascule manuelle en session. Le CSS natif utilisera exclusivement des variables tokens neutres techniques provisoires (ex: `--color-surface-base`, `--font-family-base`). La palette hexadécimale de marque finale, les typographies commerciales dédiées, le logo officiel et les icônes propriétaires restent strictly non décidés et interdits.

### DEC-015.10 — Interdictions strictes de la première tranche

Sont strictement interdits lors de la réalisation de la tranche :

- Tout framework JS (React, Vue, Svelte, Angular, Next.js)
- Toute bibliothèque UI (Tailwind, Bootstrap, Material UI)
- Tout routeur client ou gestionnaire d'état global
- Tout bundler supplémentaire (Vite, Webpack, Rollup, Parcel)
- Tout moteur de templates serveur additionnel
- Tout appel réseau direct vers `football-data.org` depuis le navigateur
- Toute exposition de clé API ou secret dans le code client
- Tout polling automatique ou retry automatique
- Toute modification des contrats d'API backend existants
- Toute résolution arbitraire des questions ouvertes `OQ-001` à `OQ-006`

### DEC-015.11 — Prochaine étape

La réalisation de la première tranche frontend d'Athena s'effectuera dans une Pull Request dédiée basée sur `architecture/phase-2-technical-design`. À l'issue de l'implémentation, la totalité des 146 tests backend existants ainsi que les nouveaux tests frontend (unitaires et d'intégration statique) devront réussir sans aucune désactivation de test. Aucune seconde tranche frontend ne pourra être entamée sans une nouvelle décision documentaire.

---

## DEC-016 — Clôture Phase 3.1 — Fondations UX/UI et première tranche frontend

- **Date :** 2026-08-08
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** `32007fc96f14487949d81626dc57b8cc1b56d1d4`

### DEC-016.1 — Décision officielle

La Phase 3.1 consacrée aux fondations UX/UI et à la première tranche frontend read-only FL1 est officiellement clôturée. Le document de clôture détaillé est disponible dans [`docs/05-design/phase-3-1-closure-report.md`](../05-design/phase-3-1-closure-report.md).

### DEC-016.2 — État technique final

- Branche officielle : `architecture/phase-2-technical-design`
- HEAD final : `32007fc96f14487949d81626dc57b8cc1b56d1d4`
- Première tranche : fusionnée via PR #20 (merge `7adb380652c43a8777ad0eefbc74fb8bac38622c`)
- Correctif A-003 : fusionné via PR #21 (merge `32007fc96f14487949d81626dc57b8cc1b56d1d4`)
- `typecheck` global : 0 erreur
- `typecheck` client : 0 erreur
- Tests : 18 fichiers / 173 réussis / 0 désactivé
- Build : succès
- Git status : CLEAN

### DEC-016.3 — Anomalies

- **A-003** : CORRIGÉE ET FERMÉE — score affichait `undefined` au lieu de `"-"` pour les matchs non joués ; corrigé par réalignement du `ScoreDTO` et du renderer sur `score.fullTime.*` ; validé par tests de régression et Chromium réel avant fusion.
- **A-001** : MINEURE — OUVERTE — NON BLOQUANTE — `healthUnavailable` rendu dans `#main-content` plutôt que dans `#service-status` du header.
- **A-002** : MINEURE — OUVERTE — NON BLOQUANTE — trailing whitespace historique dans plusieurs fichiers.

### DEC-016.4 — Validation UX/UI et limitation de preuve

La validation UX/UI a été conduite dans un navigateur Chromium réel sur le provider in-memory. Elle a permis de détecter A-003, puis de confirmer sa correction avant fusion de la PR corrective.

Validation Chromium post-merge non réexécutée en raison d'une indisponibilité temporaire de l'outil navigateur ; clôture acceptée par décision du Fondateur sur la base de la validation Chromium réelle du correctif avant fusion et de l'audit d'identité post-fusion.

### DEC-016.5 — Questions ouvertes

Les questions ouvertes OQ-001 à OQ-006 conservent exactement leurs statuts antérieurs. Aucune n'est résolue implicitement par Phase 3.1.

Les décisions graphiques suivantes restent volontairement ouvertes : palette hexadécimale finale, typographie finale, logo, ombres, rayons, icônes.

### DEC-016.6 — Autorisation de suite

Phase 3.2 peut faire l'objet d'un **cadrage documentaire séparé**.

- Cadrage documentaire Phase 3.2 : **AUTORISÉ**
- Implémentation Phase 3.2 : **NON AUTORISÉE** par la présente décision — requiert une nouvelle DEC dédiée
- Phase 2.9 Niveau 2 : non autorisée avant le 2026-08-15
- Correction A-001 : non imposée en Phase 3.1
- Correction A-002 : non imposée en Phase 3.1

---

## DEC-017 — Cadrage Phase 3.2 — Match Center analytique initial

- **Date :** 2026-08-08
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** `4305e0e01517dc8e68f892fd2e128322b1607564`

### DEC-017.1 — Orientation et objectif de la Phase 3.2

La Phase 3.2 marque la première étape documentaire de la roadmap **Phase 3 — Features**. Elle vise à faire évoluer la vue initiale read-only d'Athena vers un **Match Center analytique initial**. Son objectif est de reconnecter le produit à sa vision d'intelligence sportive en fournissant les premières informations analytiques exploitables sans transformer la plateforme en simple outil promotionnel de paris.

### DEC-017.2 — Limite avec la Phase 4 (Decision Engine)

La Phase 3.2 **ne constitue pas** la livraison du Decision Engine complet ni d'un moteur de conseil en paris.
Sont **strictement proscrits** de la Phase 3.2 :
- Toute recommandation automatique de pari ou ordre de parier.
- Tout score de confiance décisionnel ou calcul de mise de Kelly.
- Tout moteur de Value Betting, d'arbitrage bookmaker ou de prédiction probabiliste complet.
- Tout modèle de Machine Learning ou d'apprentissage automatique.

### DEC-017.3 — Inventaire des features et règle de sélection progressif

Les features analytiques candidates issues du PRD (Ranking, Forme, H2H, Fatigue, Travel, Momentum, CLV, Expected Value, etc.) ne seront **pas** implémentées simultanément. Le cadrage documentaire de la Phase 3.2 devra déterminer la plus petite tranche fonctionnelle cohérente (ex: Forme récente et confrontations H2H basiques) basée uniquement sur la disponibilité réelle des données.

### DEC-017.4 — Différé de l'identité visuelle finale

L'identité graphique et visuelle définitive d'Athena (charte, hex exacts, typographies dédiées, logo, ombres et rayons exacts) demeure **volontairement différée** et ne bloque pas le cadrage analytique de la Phase 3.2. La direction artistique conservera comme repère le professionnalisme, la sobriété, la lisibilité et l'univers conceptuel Athena (cosmos/sanctuaire) sans copier les plateformes de jeux d'argent.

### DEC-017.5 — Phase 2.9 Niveau 2 non bloquante

Le rejeu de la validation Phase 2.9 Niveau 2 (test avec clé API réelle football-data.org) demeure **non bloquant** pour l'avancement documentaire de la Phase 3.2. Il ne sera exécuté qu'après le 15 août 2026 lorsqu'une tranche d'implémentation nécessitera de valider le comportement avec le provider réel.

### DEC-017.6 — Anomalies et Questions Ouvertes

- **Anomalies A-001 et A-002 :** Conservées dans le backlog technique sous statut `MINEURE — OUVERTE — NON BLOQUANTE`. Elles ne sont pas incluses dans le périmètre fonctionnel de la Phase 3.2.
- **Anomalie A-003 :** Confirmée `CORRIGÉE ET FERMÉE`.
- **Questions Ouvertes (OQ-001 à OQ-006) :** Leurs statuts restent strictement inchangés. Aucune résolution n'est sous-entendue par ce cadrage.

### DEC-017.7 — Autorisation documentaire exclusive

La présente décision autorise le **cadrage documentaire** de la Phase 3.2 et la rédaction de sa spécification fonctionnelle d'analyse.
Elle **N'AUTORISE AUCUNE IMPLÉMENTATION DE CODE** (ni frontend, ni backend, ni endpoint, ni provider, ni dépendance). Toute écriture de code nécessitera une décision dédiée ultérieure.

---

## DEC-018 — Phase 3.2 — Première tranche analytique Form 5

- **Date :** 2026-08-08
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** `79715c79b98b3c42d493eec5179d1f3798778000`

### DEC-018.1 — Sélection officielle de la tranche Form 5

Le Fondateur ABYSS approuve officiellement **Form 5 (Forme récente minimale des équipes)** comme première tranche analytique officielle du Match Center de la Phase 3.2. Le document de spécification détaillé est disponible dans [`docs/02-product-management/phase-3-2-form-5-first-slice.md`](../02-product-management/phase-3-2-form-5-first-slice.md).

### DEC-018.2 — Règles conceptuelles de Form 5

Form 5 représente les résultats des matchs terminés (`status === 'FINISHED'`) les plus récents d'une équipe, sous la forme d'une séquence de symboles V/N/D (Victoire/Nul/Défaite) ordonnée du plus récent au plus ancien, dans la limite maximale de 5 matchs joués. La séquence s'applique uniformément que l'équipe ait joué à domicile ou à l'extérieur. Si moins de 5 matchs joués sont disponibles (1 à 4), seuls les matchs réels sont affichés. Si 0 match terminé n'est disponible, l'état neutre `Données de forme indisponibles` est affiché sans inventer de données fictives.

### DEC-018.3 — Nature descriptive et non prédictive

Form 5 est une fonctionnalité strictement descriptive d'événements passés. Elle ne constitue en aucun cas une prédiction de résultat, une estimation probabiliste, un calcul d'espérance de gain (EV), une mise de Kelly, ni une recommandation de pari.

### DEC-018.4 — Adéquation du Domaine et besoin technique d'accès aux matchs FINISHED

Les entités fondamentales du Domaine Athena (`Match`, `Team`, `Score`, `MatchStatus`) permettent déjà de représenter les matchs terminés. En revanche, le Use Case et les adaptateurs d'infrastructure actuels filtrent exclusivement les matchs `SCHEDULED`. La mise à disposition d'un accès aux matchs passés `FINISHED` constitue une précondition technique qui devra faire l'objet d'un cadrage technique détaillé.

### DEC-018.5 — Absence de nouveau contrat ou endpoint

Aucun nouveau port d'interface (`SportsDataProvider` réutilise la signature `getMatches(code, fromDate, toDate)` existante), aucun nouvel endpoint HTTP, aucune nouvelle dépendance et aucune persistance longue durée ne sont introduits ni autorisés par la présente décision.

### DEC-018.6 — Frontières strictes et interdictions

Sont strictly proscrits de la tranche Form 5 : toute donnée de cotes bookmakers, toute comparaison de marché, tout calcul probabiliste ou de mise (Kelly), toute recommandation de pari, tout composant du Decision Engine (réservé Phase 4+) et tout modèle de Machine Learning.

### DEC-018.7 — Phase 2.9 Niveau 2 non bloquante

Le rejeu de la validation Phase 2.9 Niveau 2 (test avec clé API réelle `football-data.org`) demeure non bloquant pour le cadrage et le développement local déterministe de Form 5 avec l'InMemoryProvider. Il ne sera requis que plus tard, avant une validation réseau réelle, et jamais avant le 15 août 2026.

### DEC-018.8 — Anomalies et Questions Ouvertes

- Anomalies A-001 et A-002 conservées au backlog technique sous statut `MINEURE — OUVERTE — NON BLOQUANTE`.
- Anomalie A-003 confirmée `CORRIGÉE ET FERMÉE`.
- Questions Ouvertes OQ-001 à OQ-006 conservent strictement leurs statuts antérieurs sans aucune résolution sous-entendue.

### DEC-018.9 — Autorisation exclusive et interdiction d'implémentation

La présente décision autorise la définition documentaire de Form 5 et la préparation du cadrage technique détaillé de son implémentation.
**Elle n'autorise aucune implémentation de code (0 ligne dans src/, 0 ligne dans tests/, 0 modification de provider, 0 modification de frontend/backend).** Toute écriture de code nécessitera une décision dédiée ultérieure.

---

## DEC-019 — Phase 3.2 — Cadrage technique et autorisation d'implémentation Form 5

- **Date :** 2026-08-19
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** `c2a18dcb211432df8844917cd12329ebfbc8c810`
- **Document technique :** [`docs/03-technical-architecture/phase-3-2-form-5-technical-design.md`](../03-technical-architecture/phase-3-2-form-5-technical-design.md)

### DEC-019.1 — Architecture Form 5 approuvée

L'architecture technique détaillée de Form 5, telle que définie dans `docs/03-technical-architecture/phase-3-2-form-5-technical-design.md`, est officiellement approuvée par le Fondateur ABYSS. Les 7 arbitrages fondateurs sont verrouillés définitivement.

### DEC-019.2 — Endpoint analytique agrégé

Form 5 sera exposée via un endpoint agrégé unique :

```
GET /competitions/:competitionCode/matches/analysis
```

Ce endpoint fournit en une seule réponse les données analytiques (matchs programmés + Form 5 domicile/extérieur) nécessaires au Match Center. Aucun endpoint Form 5 par match ou par équipe n'est autorisé. Le contrat existant `GET /competitions/:competitionCode/matches` reste inchangé.

### DEC-019.3 — Historique de récupération : saison courante jusqu'à la date cible

Form 5 utilise uniquement les matchs `FINISHED` de la **même compétition** et de la **saison courante**, dont la date (`utcDate`) est **strictement antérieure** à celle du match analysé. Cette règle garantit :

- la protection contre le **look-ahead bias** et toute fuite temporelle ;
- la compatibilité avec de futurs backtests chronologiques ;
- l'absence de toute fenêtre glissante arbitraire (30/60/90 jours).

Les 5 matchs exploitables les plus récents sont ensuite retenus (maximum).

### DEC-019.4 — Pas d'inter-saison dans la première tranche

Form 5 initiale est strictement limitée à la **saison courante**. Si une équipe a joué 1 à 4 matchs dans la saison en cours, seules ces données sont affichées. La saison précédente ne complète jamais artificiellement la séquence. Cette règle est conforme à DEC-018.

### DEC-019.5 — Responsabilité du Provider

Le provider (`SportsDataProvider`) est responsable de la **récupération et de la normalisation** des matchs sur la compétition/période demandée. Il ne doit plus appliquer de filtrage métier inconditionnel `status === 'SCHEDULED'`. La signature `getMatches(competitionCode, fromDate?, toDate?)` reste **inchangée**.

### DEC-019.6 — Non-régression SCHEDULED portée par ListScheduledMatchesUseCase

`ListScheduledMatchesUseCase` conserve son filtre applicatif `match.status === 'SCHEDULED'`. La non-régression du comportement de `GET /competitions/:code/matches` est prouvée par les tests unitaires de ce use-case et non par un filtre dans l'adaptateur provider.

### DEC-019.7 — Représentation interne neutre / UI française

La représentation technique interne (DTO, service domaine) utilise :

```
WIN | DRAW | LOSS
```

Le mappage vers l'interface utilisateur française (`V` | `N` | `D`) est effectué exclusivement au niveau de la couche de rendu frontend (`render.ts`). OQ-004 reste ouverte.

### DEC-019.8 — Dégradation gracieuse : statuts de disponibilité Form 5

Le DTO distingue trois états pour chaque équipe :

- `AVAILABLE` : au moins 1 match FINISHED exploitable dans la saison courante.
- `INSUFFICIENT_DATA` : aucun match FINISHED exploitable (0 résultat valide).
- `UNAVAILABLE` : erreur technique ou provider lors de la récupération historique.

Une erreur Form 5 ne fait pas disparaître les matchs programmés. Aucun nouvel état global frontend n'est introduit.

### DEC-019.9 — Anti N+1 : récupération historique mutualisée

L'historique Form 5 est récupéré une seule fois par compétition/saison pour calculer la forme de l'ensemble des équipes affichées. Le cache existant (`InMemoryCache`) est réutilisé si pertinent. Aucune nouvelle technologie de cache n'est introduite.

### DEC-019.10 — SQLite non requis

Form 5 ne nécessite aucune persistance longue durée. SQLite n'est pas requis.

### DEC-019.11 — Phase 2.9 Niveau 2

Phase 2.9 Niveau 2 est **non requise avant l'implémentation locale**. Elle sera exécutée après l'implémentation locale, les tests déterministes et l'audit de la PR technique, avant la validation réelle finale avec `football-data.org`. La date historique du 15 août 2026 étant désormais passée, aucun blocage temporel n'existe.

### DEC-019.12 — Autorisation conditionnelle d'implémentation

La présente décision autorise l'ouverture de la future branche d'implémentation :

```
implementation/phase-3-2-form-5
```

**Cette autorisation ne prendra effet qu'après la fusion conforme de la PR documentaire DEC-019 et la confirmation du verdict d'audit post-fusion.** Aucun code ne doit être écrit avant cette validation.

### DEC-019.13 — Périmètre strict

DEC-019 autorise uniquement l'implémentation de Form 5 dans son périmètre défini (FL1, saison courante, FINISHED, maximum 5 résultats, WIN/DRAW/LOSS). Aucune autre feature analytique, aucun ML, Decision Engine, cote, nouveau provider ou SQLite n'est autorisé dans cette tranche.

---

## DEC-020 — Phase 3.2 — Sémantique temporelle SportsDataProvider pour Form 5

- **Date :** 2026-08-19
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Document de référence :** `docs/03-technical-architecture/phase-3-2-form-5-provider-temporal-semantics.md`

### Résumé des arbitrages DEC-020

1. **DEC-020.1 — Port inchangé :** La signature `SportsDataProvider.getMatches(competitionCode, fromDate?, toDate?)` reste strictement inchangée. Aucune nouvelle méthode provider.
2. **DEC-020.2 — Sémantique sans bornes :** `getMatches(competitionCode)` sans dates signifie contractuellement la récupération des matchs disponibles de la saison courante de cette compétition.
3. **DEC-020.3 — Interdiction des fenêtres implicites :** Un provider ne doit pas remplacer silencieusement un appel sans dates par une fenêtre arbitraire ou implicite (`[now, now+7j)`, 30/60/90j, etc.).
4. **DEC-020.4 — Échec explicite si capacité absente :** Si un provider ne peut pas satisfaire la sémantique "saison courante", il doit échouer explicitement via les mécanismes d'erreur existants.
5. **DEC-020.5 — Fenêtre programmée déplacée dans Application :** La fenêtre `[now, now+7j)` pour les matchs programmés devient une politique explicite de la couche Application, préservant `GET /competitions/:competitionCode/matches`.
6. **DEC-020.6 — Appel principal `/analysis` :** Appel explicite `getMatches(competitionCode, now, now+7j)` pour les matchs programmés à afficher.
7. **DEC-020.7 — Appel historique Form 5 :** Appel séparé `getMatches(competitionCode)` sans dates pour la saison courante.
8. **DEC-020.8 — FormCalculator inchangé :** Conserve tous les filtres métiers (même compétition, même `seasonId`, `FINISHED`, score exploitable, `utcDate < targetDate`, tri déterministe, max 5).
9. **DEC-020.9 — Anti N+1 :** Architecture O(1) avec 1 appel principal + 1 appel historique mutualisé pour N cartes analytiques.
10. **DEC-020.10 — M-002 préservée :** Récupération principale réussie + historique échoué = HTTP 200, matchs conservés, Form 5 `UNAVAILABLE`.
11. **DEC-020.11 — M-003 préservée :** Rendu et couverture de tests frontend Form 5 intégralement conservés (`WIN -> V`, `DRAW -> N`, `LOSS -> D`, ARIA, etc.).
12. **DEC-020.12 — Domaine inchangé :** Aucun changement de structure sur `Match`, `Season`, `Score` ou `SportsDataProvider`.
13. **DEC-020.13 — Hors périmètre :** Aucun SQLite, nouveau provider, ML, Decision Engine, cote, EV ou Kelly.
14. **DEC-020.14 — Autorisation conditionnelle du correctif M-001 :** Le troisième commit correctif M-001 sur PR `#26` est autorisé **UNIQUEMENT APRÈS** la fusion conforme de DEC-020 et son audit post-fusion positif.
15. **DEC-020.15 — Phase 2.9 :** Aucun appel réseau réel pendant la phase documentaire. Validation réelle éligible après audit de la PR `#26` finale.

---

## DEC-021 — Phase 3.2 — Classification et observabilité des erreurs football-data.org

- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Document de référence :** `docs/03-technical-architecture/phase-3-2-provider-error-classification-observability.md`

### Résumé des arbitrages DEC-021

1. **DEC-021.1 — Portée :** Concerne exclusivement la classification et l'observabilité sécurisée des erreurs provenant de `football-data.org` dans le cadre de Form 5 / Phase 3.2. Aucun élargissement fonctionnel.
2. **DEC-021.2 — Classification HTTP 400 :** Un statut HTTP 400 (Bad Request) ne doit plus être confondu avec une indisponibilité réseau ou serveur (`ProviderUnavailableError`). La classe d'erreur `ProviderRequestRejectedError` est créée.
3. **DEC-021.3 — Diagnostic d'erreur sécurisé :** Lors d'un HTTP 400, l'adaptateur lit une fois le corps JSON d'erreur pour en extraire le message textuel d'explication. Le corps brut n'est jamais stocké ni persisté.
4. **DEC-021.4 — Whitelist de champs :** Seuls les champs textuels non sensibles de premier niveau (`message`, `error`, `errorCode`, `code`) sont inspectés.
5. **DEC-021.5 — Sanitisation et bornage :** Le message extrait est converti en chaîne primitive, nettoyé des caractères de contrôle et tronqué à 256 caractères maximum.
6. **DEC-021.6 — Confidentialité des secrets :** Interdiction absolue d'exposer ou de journaliser les clés API (`FOOTBALL_DATA_API_KEY`), les en-têtes d'authentification (`X-Auth-Token`) ou les variables d'environnement.
7. **DEC-021.7 — Frontend inchangé :** Aucun nouvel état global client. Les 9 états Phase 3.1 restent inchangés. Aucun message technique brut n'est affiché à l'utilisateur final.
8. **DEC-021.8 — Contrat HTTP public préservé :** `analysis-route.ts` et `matches-route.ts` continuent de mapper l'erreur vers `HTTP 503` (avec `{ error: 'PROVIDER_UNAVAILABLE' }`) pour préserver le contrat public existant.
9. **DEC-021.9 — Matrice de statuts :**
   - HTTP 400 -> `ProviderRequestRejectedError` (HTTP 503 local)
   - HTTP 401/403 -> `ProviderUnavailableError` (HTTP 503 local)
   - HTTP 429 -> `ProviderRateLimitError` (HTTP 429 local)
   - HTTP 5xx / Network / Timeout -> `ProviderUnavailableError` (HTTP 503 local)
10. **DEC-021.10 — Pas de retry automatique :** Tout HTTP 400 est déterministe et échoue immédiatement sans retry automatique.
11. **DEC-021.11 — DEC-020 préservée :** La sémantique temporelle, la signature du port `SportsDataProvider`, le calcul `FormCalculator` et la dégradation gracieuse M-002 restent intégralement préservés.
12. **DEC-021.12 — Cause du 400 enregistrée comme inconnue :** La cause précise du HTTP 400 observé lors de la validation Phase 2.9 du 2026-08-20 reste officiellement enregistrée comme inconnue hors-réseau.
13. **DEC-021.13 — Gel de PR #26 :** La PR `#26` reste gelée sur son commit `bd32012e09ee8338c2ba80d2445dc0e9180b1c1b` tant que DEC-021 n'est pas fusionnée et auditée.
14. **DEC-021.14 — Autorisation conditionnelle du correctif technique :** LE CORRECTIF TECHNIQUE DEC-021 SUR PR #26 EST AUTORISÉ UNIQUEMENT APRÈS FUSION CONFORME DE DEC-021 ET AUDIT POST-FUSION POSITIF.
15. **DEC-021.15 — Condition de nouvelle validation réseau :** Une nouvelle tentative réseau Phase 2.9 Niveau 2 ne sera autorisée par le Fondateur qu'après fusion de DEC-021, implémentation du cinquième commit sur PR #26, audit technique positif et validation des tests déterministes.

---

## DEC-022 — Phase 3.2 — Clôture du Match Center analytique initial / Form 5

- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Document de référence :** `docs/03-technical-architecture/phase-3-2-match-center-form-5-closure.md`

### Résumé des arbitrages et constats DEC-022

1. **DEC-022.1 — Clôture officielle de la Phase 3.2 :** La Phase 3.2 (Match Center analytique initial / Form 5) est officiellement déclarée clôturée. Form 5 est entièrement implémentée, testée, documentée, fusionnée et auditée.
2. **DEC-022.2 — Fusion conforme de la PR #26 :** La PR technique `#26` est fusionnée sur `architecture/phase-2-technical-design` via merge commit `c3986c6e25f567ce6bf7b4c6882f25db270f5190` avec 2 parents réels. La branche source `implementation/phase-3-2-form-5` est conservée pour traçabilité.
3. **DEC-022.3 — Validation technique automatisée :** La base post-fusion valide l'ensemble des 239 tests Vitest (20 fichiers, 0 échec, 0 désactivé), le typecheck serveur/client et le build de production `dist/`.
4. **DEC-022.4 — Validation manuelle Chromium :** Le rendu Form 5 (pastilles V/N/D, libellés d'indisponibilité, accessibilité ARIA, responsive desktop/mobile, thèmes) est validé sur dataset déterministe.
5. **DEC-022.5 — Respect des décisions DEC-020 et DEC-021 :** La sémantique temporelle du port provider, l'architecture anti N+1 ($O(1)$ appels), la dégradation gracieuse M-002, la classification d'erreur HTTP 400 et la sanitisation/redaction anti-fuite des diagnostics sont opérationnelles et conformes.
6. **DEC-022.6 — Connectivité réelle provider validée :** L'accès réseau réel `football-data.org` est validé (`PROVIDER_REAL_ACCESS=PASS`, `FL1_REQUEST_ACCEPTED=PASS`) avec la réception d'un statut upstream `HTTP 200` sur la requête observée `GET /v4/competitions/FL1/matches?dateFrom=2026-08-20&dateTo=2026-08-27` (1 fetch unique, 0 retry, 0 erreur réseau).
7. **DEC-022.7 — Réserve de preuve E2E :** En raison de la non-conservation de la valeur locale `ANALYSIS_HTTP` lors de la tentative réelle 200, la limitation méthodologique `LOCAL_E2E_EVIDENCE=INCOMPLETE_NON_BLOCKING` est formellement consignée. Aucune affirmation `ANALYSIS_LOCAL_HTTP_200=PASS` n'est formulée sans preuve archivée. Cette limitation ne bloque pas la clôture.
8. **DEC-022.8 — Cause du HTTP 400 historique :** La cause de l'erreur 400 observée lors de la tentative initiale reste enregistrée comme `UNKNOWN`. Le succès ultérieur en HTTP 200 sur la même URL confirme l'absence de défaut structurel de requête dans Athena.
9. **DEC-022.9 — Aucun nouvel appel réseau requis :** Aucun appel réel supplémentaire n'est autorisé ni nécessaire.
10. **DEC-022.10 — Prochaine brique analytique :** Le choix de la brique analytique suivante (Phase 3.3+) fera l'objet d'un arbitrage distinct par le Fondateur.

---

## DEC-023 — Phase 3.3 — Cadrage du profil de force saisonnier des équipes

- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Document de référence :** `docs/03-technical-architecture/phase-3-3-season-strength-framing.md`

### Résumé des arbitrages et cadrages DEC-023

1. **DEC-023.1 — Ouverture de la Phase 3.3 en cadrage uniquement :** La Phase 3.3 (Profil de force saisonnier des équipes) est officiellement ouverte pour cadrage produit et architectural. L'implémentation logicielle n'est pas autorisée à ce stade.
2. **DEC-023.2 — Nature du profil saisonnier :** Couche analytique purement factuelle, descriptive et déterministe situant la performance structurelle de chaque équipe sur l'ensemble de la saison courante.
3. **DEC-023.3 — Distinction stricte avec Form 5 :** Form 5 représente le momentum récent (court terme, max 5 matchs), tandis que le profil saisonnier représente le niveau de fond sur la saison complète. Interdiction de métriques récentes redondantes (*Last 3*, *Last 5 bis*).
4. **DEC-023.4 — Métriques Core candidates :** Matchs joués (`played`), bilan (`wins`/`draws`/`losses`), points cumulés, points par match (`pointsPerMatch`), buts marqués/encaissés (`goalsFor`/`goalsAgainst`), différence de buts (`goalDifference`), moyennes de buts par match.
5. **DEC-023.5 — Splits Domicile / Extérieur :** Prise en compte de la pertinence des déclinaisons Domicile (`homeSplit`) et Extérieur (`awaySplit`) contextualisées au match cible.
6. **DEC-023.6 — Interdiction des scores synthétiques et prédictions :** Aucun score synthétique composite (ex. *Power Rating*, score 0-100), aucun modèle probabiliste, aucun Machine Learning, aucune cote (*odds*), aucune recommandation de mise.
7. **DEC-023.7 — Contrainte d'architecture Anti N+1 ($O(1)$ provider) :** Réutilisation prioritaire du dataset historique de la saison courante déjà mutualisé pour Form 5 sans générer d'appels API supplémentaires par équipe ou par carte.
8. **DEC-023.8 — Disponibilité et zéro match :** Gestion normalisée des états `AVAILABLE`, `INSUFFICIENT_DATA` et `UNAVAILABLE`. Interdiction de fabriquer des faux zéros statistiques (0.00 PPG) en cas de 0 match terminé. Dégradation gracieuse préservée.
9. **DEC-023.9 — Questions Ouvertes (OQ-007 à OQ-015) :** Cadrage formel des questions ouvertes relatives au classement éventuel (`seasonRank`), au seuil de représentativité statistique ($N$), aux arrondis UI, au format des DTOs et à la sélection des métriques sans bruit.
10. **DEC-023.10 — Séquence de validation obligatoire :** Validation du cadrage produit (DEC-023) -> Arbitrage du Fondateur sur OQ-007..OQ-015 -> Conception technique détaillée (DEC-024) -> Implémentation autorisable ultérieurement.

---

## DEC-024 — Phase 3.3 — Conception technique du profil de force saisonnier

- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Document de référence :** `docs/03-technical-architecture/phase-3-3-season-strength-technical-design.md`

### Résumé des arbitrages et spécifications DEC-024

1. **DEC-024.1 — Conception technique détaillée arrêtée :** La conception technique du profil de force saisonnier (Phase 3.3) est formellement définie et verrouillée. L'implémentation demeure non autorisée avant fusion et audit de cette décision.
2. **DEC-024.2 — Résolution formelle des questions ouvertes (OQ-007 à OQ-015) :**
   - *OQ-007 / OQ-008 / OQ-009 :* Aucun `seasonRank` ni règle de départage (*tie-break*) en v1 (différé avec le module de classement).
   - *OQ-010 :* 0 match terminé = `INSUFFICIENT_DATA` ; $\ge 1$ match terminé = calculable (`AVAILABLE`). Aucun seuil arbitraire de masquage ; la taille d'échantillon réelle (`sampleSize`) est explicitement exposée.
   - *OQ-011 :* Calculs internes exacts sans arrondi ; formatage à 2 décimales pour les ratios (`pointsPerMatch`, `goalsForPerMatch`, `goalsAgainstPerMatch`) uniquement dans la couche de présentation.
   - *OQ-012 :* Profil global (`overall`) + split contextualisé au match (`contextual`: `HOME` pour l'équipe recevante, `AWAY` pour la visiteuse).
   - *OQ-013 :* Noyau métrique strict de 11 champs sans ajouts superflus (*clean sheets*, BTTS, $xG$, etc.).
   - *OQ-014 :* Réutilisation obligatoire du dataset historique mutualisé de la saison courante ; maximum structurel de 2 appels provider par exécution de `/analysis` ($O(1)$ provider, zéro N+1).
   - *OQ-015 :* DTO explicite `SeasonStrengthProfile` structuré en deux segments (`overall` et `contextual`) avec disponibilités indépendantes et `metrics: null` en cas d'indisponibilité.
3. **DEC-024.3 — Composant pur `SeasonStrengthCalculator` :** Service de domaine déterministe et sans effet de bord, calculant les métriques à partir d'un simple tableau de matchs historiques sans accès réseau, cache ou base de données.
4. **DEC-024.4 — Filtrage temporel strict :** Même compétition, même saison, matchs `FINISHED` avec score `fullTime` complet, et antériorité temporelle stricte (`match.utcDate < targetMatch.utcDate`, match cible strictement exclu).
5. **DEC-024.5 — Port provider inchangé :** La signature et le contrat de `SportsDataProvider.getMatches(competitionCode, fromDate?, toDate?)` demeurent strictement inchangés (DEC-020).
6. **DEC-024.6 — Dégradation gracieuse et robustesse (M-002 étendu) :** En cas d'échec du flux historique, l'endpoint `/analysis` répond `HTTP 200` avec les matchs programmés intacts, Form 5 `UNAVAILABLE` et Season Strength `UNAVAILABLE`. Aucun nouvel état global frontend.

---

## DEC-025 — Phase 3.3 — Clôture du profil de force saisonnier / Season Strength

- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Document de référence :** `docs/03-technical-architecture/phase-3-3-season-strength-closure.md`

### Résumé des arbitrages et constats DEC-025

1. **DEC-025.1 — Clôture officielle de la Phase 3.3 :** La Phase 3.3 (Profil de force saisonnier / Season Strength) est officiellement déclarée clôturée. L'ensemble des exigences DEC-023 et DEC-024 est implémenté, testé, validé sous Chromium, fusionné et audité post-fusion.
2. **DEC-025.2 — Fusion conforme de la PR #32 :** La PR technique `#32` (`implementation/phase-3-3-season-strength`) est fusionnée sur `architecture/phase-2-technical-design` via merge commit `0cfcb82b6d795538b42ea25ea5e4e5010be3306b` (Parent 1 : `a7eea27...`, Parent 2 : `8558dea...`). La branche source est conservée pour traçabilité.
3. **DEC-025.3 — Composant pur `SeasonStrengthCalculator` et contrat :** Service de domaine déterministe calculant 11 métriques exactes (`played`, `wins`, `draws`, `losses`, `points`, `pointsPerMatch`, `goalsFor`, `goalsAgainst`, `goalDifference`, `goalsForPerMatch`, `goalsAgainstPerMatch`) avec coupure stricte `utcDate < targetDate` et filtres stricts (current season, same competition, `FINISHED` only).
4. **DEC-025.4 — Segments Global et Contextualisés :** Profil articulé en segment `overall` (Global) et segment `contextual` (`Domicile` pour l'équipe recevante, `Extérieur` pour l'équipe visiteuse). Ratios présentés à exactement 2 décimales côté interface utilisateur (`.toFixed(2)`).
5. **DEC-025.5 — Données de référence et fallbacks validés :** Golden Data Alpha FC validées (Overall : MJ=8, V-N-D=3-2-3, Pts=11, GD=-2, PPG=1.38, GF/M=1.13, GA/M=1.38 ; Domicile : MJ=4, V-N-D=2-1-1, Pts=7, GD=+1, PPG=1.75, GF/M=1.25, GA/M=1.00). Cas Zeta Rovers `INSUFFICIENT_DATA` validé sans aucun faux zéro.
6. **DEC-025.6 — Architecture Provider, Anti-N+1 et M-002 étendu :** Maximum de 2 appels provider par exécution de `/analysis` ($O(1)$ constant, aucun N+1, aucun 3e appel). Mutualisation du flux historique avec Form 5. Dégradation gracieuse en cas d'échec historique (2 tentatives, 1 succès, statut `UNAVAILABLE` local).
7. **DEC-025.7 — Non-régression Form 5 et stabilité d'infrastructure :** `SportsDataProvider` et l'adaptateur `football-data.org` sont strictement inchangés (0 ligne modifiée). Form 5 reste intacte. Route `/matches` préservée. Maintien strict de 9 états globaux frontend (Season Strength 100% local à la carte).
8. **DEC-025.8 — Validation Chromium humaine conforme :** Validation humaine documentée sous Google Chrome 151.0.7922.140 (desktop, mobile ~390px, thèmes clair et sombre, 0 erreur JS fatale, 0 appel `football-data.org`, aucun polling, aucun retry automatique, footer actualisé à `Prototype Phase 3.3`).
9. **DEC-025.9 — Validation technique automatisée :** La suite complète post-fusion valide 255/255 tests Vitest (21 fichiers, 0 échec, 0 désactivé), typechecks serveur et client PASS, build PASS et diff-check PASS.
10. **DEC-025.10 — Clôture et suites :** Phase 3.3 officiellement terminée. La prochaine phase analytique (Phase 3.4+) n'est pas autorisée automatiquement et fera l'objet d'un arbitrage formel ultérieur par le Fondateur.

---

## DEC-026 — Phase 3.4 — Cadrage du H2H contextualisé

- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Document de référence :** `docs/03-technical-architecture/phase-3-4-h2h-framing.md`

### Résumé des arbitrages et cadrages DEC-026

1. **DEC-026.1 — Ouverture de la Phase 3.4 en cadrage produit uniquement :** La Phase 3.4 (H2H contextualisé) est officiellement ouverte au stade du cadrage. L'implémentation logicielle, les modifications de code et les requêtes réseau sont interdites.
2. **DEC-026.2 — Rôle du H2H dans la chaîne analytique :** Troisième brique du Match Center, distincte de Form 5 (forme récente court terme de chaque équipe) et de Season Strength (niveau de fond de la saison). Le H2H se concentre sur l'historique spécifique des confrontations directes entre les deux équipes du match cible.
3. **DEC-026.3 — Approche contextualisée vs H2H naïf :** Rejet des bilans bruts surinterprétés (ex: « Équipe A a gagné 6 des 10 H2H donc elle est favorite »). Le H2H doit être contextualisé par la taille d'échantillon, l'ancienneté, les saisons couvertes, l'ordre chronologique, le lieu (domicile/extérieur) et les compétitions.
4. **DEC-026.4 — Nature factuelle et interdiction prédictive :** Calcul déterministe et explicable. Interdiction formelle de scores de force synthétiques (`h2hStrengthScore`, `dominanceScore`), de scores de confiance (`h2hConfidence`), de probabilités de victoire (`winProbability`), de cotes (*odds*), de Value/EV/Kelly, de ML ou de Decision Engine.
5. **DEC-026.5 — Double perspective obligatoire :** Toute statistique H2H doit pouvoir être restituée depuis la perspective explicite de chacune des deux équipes.
6. **DEC-026.6 — Enjeu architectural de la profondeur historique :** Le contrat provider actuel (`SportsDataProvider.getMatches(competitionCode)` sans dates) est cadré par DEC-020 comme retournant la saison courante (souvent 0 ou 1 confrontation). Athena ne prétend pas disposer d'un historique multi-saison tant que sa faisabilité et son coût provider n'ont pas été formellement arbitrés.
7. **DEC-026.7 — Pas de pondération temporelle arbitraire :** Pas de formule de pondération non calibrée ($0.8/0.2$). L'ancienneté de chaque confrontation doit être rendue visible et transparente sans manipulation algorithmique.
8. **DEC-026.8 — Filtres stricts et gestion des cas limites :** Matchs `FINISHED` uniquement avec score complet, coupure temporelle stricte `utcDate < targetDate`. En cas de 0 confrontation, statut `INSUFFICIENT_DATA` sans faux zéros. En cas d'échec provider, dégradation locale `UNAVAILABLE` sans nouvel état global de page.
9. **DEC-026.9 — Intégrité de l'infrastructure et coût :** Maintien du port `SportsDataProvider` inchangé. Interdiction absolue des requêtes N+1 ($O(N)$ proscrit). Aucune supposition sur les capacités de `football-data.org` sans audit hors production.
10. **DEC-026.10 — Questions Ouvertes (OQ-016 à OQ-028) et séquence :** 13 questions ouvertes formellement ouvertes relatives à l'horizon temporel (saison courante vs multi-saison), la profondeur maximale, les segments Domicile/Extérieur, les coupes/amicaux, les DTOs et le budget provider. Séquence : DEC-026 -> Arbitrages OQ-016..OQ-028 -> DEC-027 (Conception technique) -> Implémentation ultérieure.

---

## DEC-027 — Phase 3.4 — Conception technique du H2H contextualisé

- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Document de référence :** `docs/03-technical-architecture/phase-3-4-h2h-technical-design.md`

### Résumé des arbitrages et spécifications DEC-027

1. **DEC-027.1 — Conception technique détaillée verrouillée :** La conception technique du H2H contextualisé (Phase 3.4) est formellement définie. L'implémentation logicielle, les modifications de code et les requêtes réseau sont interdites avant fusion et audit de cette décision.
2. **DEC-027.2 — Résolution formelle des Questions Ouvertes (OQ-016 à OQ-028) :**
   - *OQ-016 & OQ-017 :* H2H multi-saison borné à maximum 5 confrontations exploitables et 3 saisons distinctes (saison cible, N-1, N-2).
   - *OQ-018 :* Exposition explicite de `sampleSize`, `latestMeetingDate`, `oldestMeetingDate` et `seasonsCovered` sans aucune pondération de récence.
   - *OQ-019 :* Deux segments indépendants : segment global (`overall`) et segment contextualisé au lieu (`contextual` avec `venue: 'SAME_VENUE'`).
   - *OQ-020, OQ-021 & OQ-022 :* Même compétition uniquement (`competitionId`), coupes incluses uniquement si le match cible est de coupe, amicaux exclus.
   - *OQ-023 & OQ-024 :* Contrat de disponibilité à union discriminée (`AVAILABLE`, `INSUFFICIENT_DATA` avec `metrics: null`, `UNAVAILABLE` local).
   - *OQ-025 :* DTO explicite `HeadToHeadProfile` avec perspectives d'équipe symétriques (`HeadToHeadPerspective`).
   - *OQ-026 :* Évolution générique autorisée du port `SportsDataProvider` avec `HistoryFilter` neutre (Option 3B). Aucune méthode spécifique H2H.
   - *OQ-027 :* Double budget dur : $\le 2$ invocations logiques Application, $\le 5$ requêtes HTTP amont (Target $\le 4$), complexité réseau $O(1)$ sans N+1.
   - *OQ-028 :* Mutualisation obligatoire du flux historique entre `FormCalculator`, `SeasonStrengthCalculator` et `HeadToHeadCalculator`.
3. **DEC-027.3 — Composant pur `HeadToHeadCalculator` :** Service de domaine déterministe et pur, sans I/O ni Date.now(), calculant les confrontations à partir du corpus historique mutualisé.
4. **DEC-027.4 — Invariants de symétrie et sécurité :** Invariants mathématiques stricts (`wins` = `losses` adverses, etc.), filtrage par identifiants métier stables `Team.id` (matching par nom interdit), coupure temporelle stricte `utcDate < targetDate`.
5. **DEC-027.5 — Non-régression et stabilité :** Form 5 et Season Strength restent strictement étanches et limitées à la saison courante. Maintien strict de 9 états globaux frontend. Route `/matches` inchangée. Aucun appel réseau réel requis.

---

## DEC-028 — Phase 3.4 — Clôture du H2H contextualisé

- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Document de référence :** `docs/03-technical-architecture/phase-3-4-h2h-closure.md`

### Résumé des validations et arbitrages de clôture DEC-028

1. **DEC-028.1 — Clôture officielle de la Phase 3.4 :** La Phase 3.4 (Head-to-Head contextualisé) est formellement et définitivement déclarée clôturée. L'ensemble des exigences fonctionnelles, architecturales et techniques de DEC-026 et DEC-027 sont satisfaites.
2. **DEC-028.2 — Périmètre livré et composant de domaine :** `HeadToHeadCalculator` implémenté comme service de domaine pur ($O(1)$ allocations, sans I/O, déterministe). Historique borné à maximum 5 confrontations et 3 saisons distinctes (saison cible, N-1, N-2). Double segment (`overall` et `contextual SAME_VENUE`) avec perspectives d'équipes symétriques et gestion stricte des statuts `AVAILABLE`, `INSUFFICIENT_DATA` (sans faux zéros) et `UNAVAILABLE`.
3. **DEC-028.3 — Évolution neutre du provider et budgets respectés :** `SportsDataProvider` étendu via l'interface générique `HistoryFilter` (`seasonCount`, `seasonIds`) sans méthode spécifique H2H. Respect strict du double budget : $\le 2$ invocations logiques Application, $\le 5$ requêtes HTTP amont sur cold path (Normal = 4, Fallback catalogue = 5), complexité $O(1)$ sans N+1.
4. **DEC-028.4 — Mutualisation et non-régression :** Flux historique mutualisé alimentant `FormCalculator`, `SeasonStrengthCalculator` et `HeadToHeadCalculator`. Non-régression totale sur Form 5 (10/10 tests) et Season Strength (12/12 tests). Route `/matches` strictement préservée.
5. **DEC-028.5 — Intégration frontend et conformité UI :** Bloc visuel « Confrontations directes » intégré au Match Center avec périodes historiques formatées (`JJ/MM/AAAA → JJ/MM/AAAA` ou date unique), saisons couvertes et copies d'indisponibilité. Footer actualisé à `Prototype Phase 3.4`. 9 états globaux préservés.
6. **DEC-028.6 — Validation Chromium humaine conforme :** Validation humaine sur Google Chrome 151.0.7922.140 (Desktop sombre et clair, Mobile ~390px sans overflow critique, 0 erreur console fatale, 0 appel externe, polling = NO, retry automatique = NO, restauration après blocage = PASS).
7. **DEC-028.7 — Validation technique automatisée :** La suite complète valide 293/293 tests Vitest (25 fichiers, 0 échec, 0 désactivé), typechecks serveur et client PASS, build PASS, diff-check PASS, 0 nouvelle dépendance, 0 appel réel (`TOKEN_PRESENT=False`).
8. **DEC-028.8 — Fusion et traçabilité Git :** PR d'implémentation #36 fusionnée par `Create a merge commit` (`ba43b6de03d037425c5ec0c3369de565b7f7330a`), branche source `implementation/phase-3-4-contextual-h2h` conservée sur le remote.
9. **DEC-028.9 — Absence de pouvoir prédictif :** La brique H2H reste un composant purement descriptif et contextuel. Elle ne produit aucune cote, probabilité, EV, Kelly ou score synthétique et ne constitue pas un Decision Engine.
10. **DEC-028.10 — Suites et prochaine étape :** Aucune phase analytique ultérieure (Phase 3.5+) n'est ouverte automatiquement. La prochaine brique fera l'objet d'un cadrage et d'un arbitrage formel séparé par le Fondateur.