> **Statut :** Mis à jour
> **Version :** 1.4

# Decision Log

## DEC-001 — Arbitrage conditionnel sur les données sportives et le périmètre des compétitions MVP

- **Date :** 2026-07-17
- **Responsable :** Fondateur ABYSS
- **Statut :** Décision conditionnelle
- **Contexte :** Les questions ouvertes OQ-003 (Fournisseurs de données) et OQ-006 (Compétitions du MVP) bloquaient le passage à la Phase 2 (Architecture technique).
- **Décision :**
  - Approbation de l'orientation pour OQ-003 et OQ-006 sous forme d'une option intermédiaire resserrée de 2 à 3 compétitions maximum.
  - Le passage à la Phase 2 est autorisé sous conditions.
- **Conditions de validation factuelle :**
  - Confirmer une source de données acceptable (couverture, qualité, continuité, coût soutenable).
  - Confirmer la liste exacte des compétitions sélectionnées.
  - Vérifier les droits d'usage et d'affichage des données.
- **Conséquences :**
  - La préparation de la Phase 2 (Architecture technique) peut démarrer.
  - Aucun développement dépendant d'une source ou d'une compétition précise ne doit être considéré comme définitivement validé avant confirmation.
  - Le périmètre pilote pourra être réduit ou adapté si les conditions ci-dessus ne sont pas satisfaites.

## DEC-002 — Passage conditionnel en Phase 2 et arbitrage du fournisseur de données de prototype

- **Date :** 2026-07-18
- **Responsable :** Fondateur ABYSS
- **Statut :** Décision validée (Sous conditions de prototype)
- **Contexte :** À la suite de la découverte des accès réels (Phase 1.20), il est établi que le plan d'essai Sportmonks ne couvre pas la Ligue 1, la Premier League ni l'UEFA Champions League. football-data.org donne accès à ces compétitions mais les saisons retournées ne démontrent pas encore de saison commune. Le test complet des 18 rencontres est donc suspendu.
- **Décision :**
  - **Option A + B + C autorisée :** Poursuite du développement du prototype de Phase 2 avec *football-data.org* de manière provisoire.
  - Engagement de démarches parallèles auprès de *Sportmonks* pour demander un accès d'évaluation temporaire et un devis écrit.
  - Autorisation d'évaluer un troisième fournisseur uniquement si Sportmonks refuse l'accès d'évaluation.
  - **OQ-003 (Source de données) :** football-data.org validée provisoirement pour le prototype.
  - **OQ-006 (Compétitions MVP) :** Périmètre validé (Ligue 1, Premier League, UEFA Champions League).
- **Conditions, garde-fous et budget :**
  - **Budget et dépenses :**
    - Budget maximal autorisé : 0 €
    - Dépense immédiate autorisée : aucune
    - Actions autorisées : demandes de devis et d’accès d’évaluation uniquement
    - Souscription payante : non autorisée
    - Engagement financier : non autorisé
  - **Garde-fous d'intégration :**
    - L'intégration de *football-data.org* doit être traitée comme un prototype temporaire, et non comme un choix définitif.
    - L'architecture de la Phase 2 doit implémenter une couche de normalisation et d'abstraction des données indépendante du fournisseur afin de préserver la possibilité de remplacer le fournisseur.
    - API utilisées en lecture seule.
    - Maximum trois compétitions (Ligue 1, Premier League, UEFA Champions League).
    - Aucune redistribution de données brutes.
    - Aucune publication commerciale avant validation écrite des droits.
    - Aucune conservation longue durée des données avant validation juridique.
    - Aucune clé d'API ni donnée sensible journalisée.
    - Suivi des quotas autorisé sans journalisation des secrets.
    - Aucune dépendance irréversible au schéma de données du fournisseur.
    - Aucun abonnement ni verrouillage contractuel sans nouvelle décision du Fondateur.
    - La Pull Request de Phase 1 doit être maintenue en mode brouillon (draft) tant que l'évaluation comparative finale n'est pas arbitrée.
- **Conséquences :**
  - Démarrage effectif de la Phase 2 sous réserve du respect strict de la couche d'abstraction de données et des garde-fous ci-dessus.
  - Préparation des courriels d’évaluation et demandes commerciales auprès de Sportmonks.

## DEC-003 — Approbation de l’architecture technique de Phase 2

- **Date :** 2026-07-18
- **Responsable :** Fondateur ABYSS
- **Statut :** Décision validée
- **Contexte :** À l’issue de la Phase 2.1 (définition de l’architecture), de la Phase 2.2 (ADR initiaux) et de la Phase 2.3 (dossier de validation), l’architecture du prototype Athena a été soumise à l’approbation formelle du Fondateur.
- **Décision :**
  - **Architecture globale approuvée** pour la conception détaillée.
  - **ADR-001 (Monolithe modulaire) :** Accepté.
  - **ADR-002 (Abstraction des fournisseurs) :** Accepté.
  - **ADR-003 (Modèle de domaine normalisé) :** Accepté.
  - Actions autorisées : définition de la structure initiale, préparation des contrats de domaine, conception de l’adaptateur football-data.org, rédaction de nouveaux ADR technologiques.
  - **Écriture de code applicatif non encore autorisée.**
  - Décisions technologiques clés différées (langage, framework, base de données, cache, hébergement, authentification, moteur de probabilités, XAI) : étude dans de nouveaux ADR autorisée.
- **Contraintes maintenus :**
  - Budget maximal : 0 €, aucune dépense immédiate.
  - football-data.org reste provisoire ; Sportmonks reste non implémenté ; aucun fournisseur définitif sélectionné.
  - Maximum trois compétitions, lecture seule, aucune redistribution ni conservation longue durée des données.
  - Pull Request de Phase 1 maintenue en brouillon.
- **Justification :**
  - Choix d’architecture pragmatiques respectant le budget nul et le découpage modulaire, garantissant l’indépendance vis-à-vis du fournisseur de données.
- **Corrections demandées :** Aucune.

## DEC-004 — Approbation des choix technologiques de la Phase 2.4

- **Date :** 2026-07-18
- **Responsable :** Fondateur ABYSS
- **Statut :** Décision validée
- **Contexte :** Suite à la validation de l'architecture globale (DEC-003) et à la présentation des ADR-004 à ADR-007, le Fondateur a arbitré les quatre choix technologiques initiaux du prototype Athena.
- **Décisions :**
  - **ADR-004 — Langage :** TypeScript / Node.js retenu.
  - **ADR-005 — Framework :** Express avec structure modulaire explicite retenu (conditionnel à ADR-004 TypeScript).
  - **ADR-006 — Persistance :** SQLite locale, minimale et désactivable retenu. Option D (aucune persistance) reste utilisable si le cache seul suffit.
  - **ADR-007 — Cache :** Cache mémoire local dans le processus retenu. Migration vers Redis Upstash évaluable via un nouvel ADR si nécessaire.
- **Autorisations accordées :**
  - Préparation de la structure détaillée du projet.
  - Préparation des contrats de domaine.
  - Conception détaillée de l'adaptateur football-data.org.
  - **Écriture de code applicatif non encore autorisée** — conditionnée à la finalisation des contrats de domaine.
- **Contraintes maintenues :**
  - Budget maximal : 0 €, aucune dépense immédiate.
  - football-data.org reste provisoire ; Sportmonks reste non implémenté.
  - Maximum trois compétitions, lecture seule, aucune redistribution ni conservation longue durée des données.
  - SQLite doit pouvoir être désactivée ou supprimée ; aucune donnée brute fournisseur ne doit être persistée.
  - Le cache doit avoir une durée de vie courte et être désactivable ; aucune donnée brute fournisseur ne doit être mémorisée.
  - Aucun service cloud n'est obligatoire pour démarrer.
  - Pull Request de Phase 1 maintenue en brouillon.
- **Justification :**
  - Choix simples, gratuits et réversibles, cohérents avec le monolithe modulaire (ADR-001), l'architecture par ports et adaptateurs (ADR-002) et la contrainte de budget nul.
- **Corrections demandées :** Aucune.

## DEC-005 — Approbation du cadrage fonctionnel de la Phase 2.7

- **Date :** 2026-07-29
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Contexte :**
  - La Phase 2.6 a livré et fusionné le squelette technique approuvé.
  - La Phase 2.7 prépare la première tranche fonctionnelle observable.
  - Cette tranche doit rester locale, fictive, déterministe et en lecture seule.
  - Aucun fournisseur réel, appel réseau ou stockage réel ne doit être activé.
  - Huit décisions fondatrices ont été explicitement approuvées avant toute implémentation.
- **Décision :**
  1. La seule compétition disponible est `FL1`, avec des équipes, matchs, identifiants et métadonnées entièrement fictifs.
  2. Le fournisseur factice retourne exactement trois matchs.
  3. La réponse nominale utilise l’enveloppe `{ "competitionCode": "FL1", "matches": [] }`.
  4. Toute autre compétition retourne HTTP `404` avec `{ "error": "COMPETITION_NOT_AVAILABLE" }`.
  5. Le fournisseur factice est prévu sous `src/infrastructure/providers/in-memory/in-memory-sports-data-provider.ts`.
  6. Le fournisseur est câblé directement et inconditionnellement dans la composition de l’application, sans variable d’environnement, factory, registre ou sélection dynamique.
  7. Le cas d’usage porte le nom exact `ListScheduledMatchesUseCase` et est prévu sous `src/application/use-cases/list-scheduled-matches.ts`.
  8. Les dates fixes sont `2099-08-14T18:00:00.000Z`, `2099-08-15T20:00:00.000Z` et `2099-08-16T19:30:00.000Z`.
- **Conséquences :**
  - Le cadrage fonctionnel de la Phase 2.7 est figé.
  - Le budget reste limité à `0 €`.
  - La tranche reste en lecture seule et limitée à `FL1`.
  - Aucun appel réseau n’est autorisé.
  - Aucune persistance réelle n’est autorisée.
  - Aucune dépendance npm supplémentaire n’est autorisée.
  - `InMemoryCache` reste inchangé et inactif pour cette tranche.
  - `SqlitePersistence` reste inchangé, logique et inutilisé.
  - football-data.org reste provisoire et non activé.
  - Sportmonks reste non implémenté.
  - Aucun fournisseur réel ou définitif n’est sélectionné.
  - Cette décision documentaire n’autorise pas encore l’implémentation.
  - Une autorisation séparée est requise avant toute création de branche d’implémentation ou écriture de code.
  - Toute déviation par rapport aux huit décisions nécessite une nouvelle décision.
- **Référence :** [Pack de validation Phase 2.7](../03-technical-architecture/phase-2-7-functional-slice-validation-pack.md)

## DEC-006 — Approbation du cadrage de connexion au fournisseur réel

- **Date :** 2026-07-30
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Contexte :**
  - La Phase 2.7 a livré et fusionné la première tranche fonctionnelle avec un fournisseur fictif (`InMemorySportsDataProvider`).
  - `FootballDataOrgAdapter` existe dans le squelette mais lève `NotImplementedError` sur toutes ses méthodes.
  - La Phase 2.8 prépare la première connexion observable à un fournisseur de données sportives réel.
  - Un cadrage initial proposant de remplacer `FL1` par `PL` a été rejeté par le Fondateur : la Ligue 1 figure dans la couverture officielle gratuite de football-data.org au 2026-07-30, avec le code API `FL1`.
- **Décision :**
  1. La clé API est lue exclusivement depuis la variable d'environnement `FOOTBALL_DATA_API_KEY` — aucune valeur de clé ne doit figurer dans Git, les documents, les tests ou les logs ; l'absence de clé avec le fournisseur réel sélectionné provoque un échec explicite au démarrage.
  2. La compétition réelle retenue est `FL1` (Ligue 1) — continuité avec la Phase 2.7, présence dans la couverture gratuite officielle au 2026-07-30 ; si un test réel retourne HTTP `403` pour `FL1`, l'implémentation est arrêtée sans substitution automatique.
  3. L'activation du fournisseur est contrôlée par `SPORTS_DATA_PROVIDER` (`in-memory` par défaut, `football-data-org` pour le réel) — aucun fallback automatique, aucun registre dynamique, sélection confinée à la composition de l'application ; cette décision remplace l'interdiction de sélection dynamique de `DEC-005 §6` pour la seule Phase 2.8.
  4. Le client HTTP utilisé est `fetch` natif (`globalThis.fetch`) — aucune dépendance npm supplémentaire, transport injectable et typé, authentification via en-tête `X-Auth-Token`, délai maximal de 8 secondes via `AbortController`, aucun token dans les logs.
  5. La fenêtre temporelle est de 7 jours calendaires UTC : `[dateFrom, dateFrom + 7 jours)` — `dateFrom` est la date UTC courante, l'horloge est injectable, aucun `Date.now()` non encapsulé dans la logique testée.
  6. Les erreurs du fournisseur produisent HTTP `429` avec `{ "error": "PROVIDER_RATE_LIMIT" }` pour une limite de débit, et HTTP `503` avec `{ "error": "PROVIDER_UNAVAILABLE" }` pour toute indisponibilité (erreur réseau, timeout, HTTP `401`, `403`, `5xx`, JSON invalide) — aucun fallback vers `InMemorySportsDataProvider`, aucun token dans les réponses.
- **Résolution des questions ouvertes :**
  - Tests automatisés : aucun appel réseau réel dans `npm test`, transport `fetch` injecté et simulé.
  - Codes de compétition : `FL1` uniquement, tout autre code déclenche `CompetitionNotAvailableError` avant tout appel réseau.
  - Chargement de la clé : variable d'environnement uniquement, aucun fichier `.env`, aucune dépendance supplémentaire.
- **Conséquences :**
  - Le cadrage de la Phase 2.8 est figé.
  - Budget maintenu à `0 €`.
  - Développement local uniquement — aucun déploiement public, aucun utilisateur tiers, aucune redistribution.
  - football-data.org reste provisoire et remplaçable.
  - Sportmonks reste non implémenté.
  - `InMemoryCache` et `SqlitePersistence` restent inchangés et inactifs.
  - Cette décision documentaire n'autorise pas encore l'implémentation.
  - Une autorisation séparée est requise avant toute création de branche d'implémentation ou écriture de code.
- **Référence :** [Pack de validation Phase 2.8](../03-technical-architecture/phase-2-8-real-provider-validation-pack.md)

---

## DEC-007 — Validation manuelle contrôlée du fournisseur réel

- **Date :** 2026-07-30
- **Statut :** Approuvée partiellement — Niveau 1 validé
- **Responsable :** Fondateur ABYSS
- **Référence :** Commit `86117f5c40db30d8c53b9edf528d777093fb7bae`
- **Branche :** `architecture/phase-2-technical-design`

### Contexte

Suite à l'implémentation de la Phase 2.8 (`DEC-006`), la connexion réelle au fournisseur `football-data.org` a été câblée mais n'avait jamais été exécutée avec une clé authentifiée. La Phase 2.9 avait pour but d'effectuer une validation manuelle contrôlée en local sans modifier le code source.

### Décisions arrêtées

1. **DEC-007.1 (Périmètre) :** Option A uniquement — validation manuelle contrôlée du fournisseur réel sans modification du code ni ajout de dépendances.
2. **DEC-007.2 (Vérification FL1) :** La couverture publique de `FL1` doit être confirmée sur `football-data.org/coverage` (Free Tier) avant chaque test authentifié réel. Vérification confirmée le `2026-07-30`.
3. **DEC-007.3 (Extension des compétitions) :** Non applicable et non autorisée en Phase 2.9. Seul `FL1` reste autorisé.
4. **DEC-007.4 (Cache et Rate Limit) :** Non applicable en Phase 2.9 (`InMemoryCache` inactif, pas de retry ni de backoff).
5. **DEC-007.5 (Observabilité) :** Non applicable en Phase 2.9 (aucun logger npm ni changement de journalisation).

### Résultats et Statut

- **Niveau 1 (Connexion & Contrat HTTP) :** Validé avec succès le `2026-07-30`. Exactement 1 appel authentifié effectué vers `GET /competitions/FL1/matches`. Statut HTTP 200 reçu avec une enveloppe JSON normalisée et valide (`competitionCode: "FL1"`). Sécurité des logs confirmée (0 fuite).
- **Niveau 2 (Validation du mapping non vide) :** À rejouer à partir du **15 août 2026** (reprise du championnat de Ligue 1), le tableau des matchs étant vide (`matchCount: 0`) lors de la trêve estivale du 30 juillet 2026.

### Verdict canonique

`PHASE 2.9 VALIDATION PARTIELLE — ACCÈS RÉEL FL1 CONFIRME, TEST NON VIDE À REJOUER À PARTIR DU 15 AOÛT 2026`

---

## DEC-008 — Activation contrôlée du cache mémoire

- **Date :** 2026-07-30
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** Commit `76e1fd611145b6812bc6e747820397cda6e85553`
- **Branche :** `architecture/phase-2-technical-design`
- **Document de référence :** [phase-2-10-cache-activation-pack.md](../03-technical-architecture/phase-2-10-cache-activation-pack.md)

### Contexte

Suite à la validation de la Phase 2.9 (DEC-007), le fournisseur réel `football-data-org` est actif mais chaque appel à `GET /competitions/FL1/matches` déclenche un appel HTTP authentifié sans protection. La Phase 2.10 active `InMemoryCache` — décorateur déjà présent mais inactif — pour réduire les appels identiques, limiter le risque de dépassement de la limite de débit du plan gratuit et réduire la latence.

### DEC-008.1 — Activation du Cache

**Décision :** Cache actif uniquement avec `football-data-org`.

| `SPORTS_DATA_PROVIDER` | Résolution |
|---|---|
| Absent | `InMemorySportsDataProvider` sans cache |
| `in-memory` | `InMemorySportsDataProvider` sans cache |
| `football-data-org` | `InMemoryCache` enveloppant `FootballDataOrgAdapter` |

Aucune nouvelle variable d'environnement. Aucun `CACHE_ENABLED`. Port `SportsDataProvider` inchangé.

### DEC-008.2 — TTL

**Décision :** TTL fixe de **10 minutes** (`600 000 ms`). Configurable par constructeur dans les tests. Contrôlé par horloge injectable. Aucun délai réel dans les tests.

### DEC-008.3 — Clé du Cache et Fenêtre Temporelle

**Décision :** `{competitionCode}:{dateFrom}:{dateTo}` (exemple : `FL1:2026-07-30:2026-08-06`)

- **Deux dates fournies :** utiliser et transmettre exactement ces dates.
- **Aucune date :** cache calcule `dateFrom = maintenant UTC`, `dateTo = dateFrom + 7j UTC`, puis transmet ces dates explicitement au fournisseur décoré. Une seule fenêtre calculée par requête.
- **Une seule borne :** délégation sans mise en cache (bypass).
- La clé ne contient aucune donnée sensible (`FOOTBALL_DATA_API_KEY` et `X-Auth-Token` interdits).

### DEC-008.4 — Comportement sur les Erreurs

- Réponse réussie mise en cache, y compris `[]`.
- Non mis en cache : `ProviderRateLimitError`, `ProviderUnavailableError`, `CompetitionNotAvailableError`, `NotImplementedError`, toute erreur inconnue, toute promesse rejetée.
- Erreurs propagées sans modification.
- **Stale-on-error : INTERDIT.**
- **Retry : INTERDIT.**
- Valeur expirée non servie après expiration.

### DEC-008.5 — Concurrence

**Décision :** Option B — in-flight deduplication via `Map<string, Promise<Match[]>>`.

- Premier appel sur clé froide : appel fournisseur, promesse stockée temporairement.
- Appel simultané sur même clé : réutilisation de la promesse en cours.
- Promesse terminée (succès ou échec) retirée de la Map dans un bloc `finally`.

### DEC-008.6 — Tests

Suite de 24 cas minimum sans appel réseau réel ni `setTimeout` réel, avec horloge injectable (voir pack de validation pour détail complet).

### Condition d'Arrêt Architecturale

Avant l'implémentation, vérifier que `FootballDataOrgAdapter.getMatches()` respecte les paramètres `fromDate`/`toDate` explicites. Observation actuelle : l'adaptateur ignore ces paramètres (préfixés `_`) et recalcule en interne. Si la correction de ce contrat n'est pas autorisée, arrêter avec :

```text
PHASE 2.10 BLOQUÉE — CONTRAT DES FENÊTRES DE DATES À ARBITRER
```

---

## DEC-009 — Observabilité minimale et sûre

- **Date :** 2026-08-05
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Référence :** Commit `fcd3d80d20157baec4c407c9fe7d653384aa1e33`
- **Branche :** `architecture/phase-2-technical-design`
- **Document de référence :** [phase-2-11-minimal-observability-pack.md](../03-technical-architecture/phase-2-11-minimal-observability-pack.md)

### DEC-009.1 — Événements Observables

Événements cache approuvés : `cache_hit`, `cache_miss`, `cache_expired`, `cache_bypass`, `cache_in_flight_join`.
Événements fournisseur approuvés : `provider_request_started`, `provider_request_succeeded`, `provider_rate_limited`, `provider_unavailable`.
Champ de durée : `durationMs` (numérique >= 0) présent sur `provider_request_succeeded`, `provider_rate_limited` et `provider_unavailable`.
Aucun événement séparé `provider_request_duration`. Aucun événement ajouté dans `matches-route.ts`, `ListScheduledMatchesUseCase`, `SportsDataProvider` ou le domaine.

### DEC-009.2 — Observer Typé Injectable

Option A retenue : `TelemetryObserver = (event: TelemetryEvent) => void` injectable dans `InMemoryCache` et `FootballDataOrgAdapter`.
Observer par défaut : no-op `() => {}`. Domaine et port `SportsDataProvider` inchangés.
Isolation obligatoire : Une exception de l'observer est capturée et n'altère jamais la réponse métier, le cache ou le nettoyage `in-flight`.

### DEC-009.3 — Activation par Variable d'Environnement

Variable optionnelle `ATHENA_TELEMETRY=off|console` (défaut : `off`).
`off` ou absente : observabilité désactivée (observer no-op). `console` : observer console activé. Valeur inconnue : échec au démarrage.
Aucun fichier `.env`, aucun `dotenv`, aucune dépendance npm. Silent par défaut dans les tests (`npm test`).

### DEC-009.4 — Données Autorisées et Sécurité des Secrets

Champs autorisés : `type`, `competitionCode`, `dateFrom` (YYYY-MM-DD), `dateTo` (YYYY-MM-DD), `matchCount`, `durationMs`, `providedBound`, `failureKind`.
Données interdites : `FOOTBALL_DATA_API_KEY`, en-tête `X-Auth-Token`, headers complets, URL complète, query string brute, corps fournisseur, objets `Request`/`Response`/`Error`, messages d'erreur bruts, stack traces, chemins locaux.
Catégories d'erreur contrôlées (`failureKind`) : `timeout`, `network`, `unauthorized`, `forbidden`, `upstream_5xx`, `invalid_response`, `unknown`.

### DEC-009.5 — Destination et Format Console

Lorsque `ATHENA_TELEMETRY=console`, format NDJSON (une ligne JSON valide par événement) contenant `"scope": "athena.telemetry"`.
Canaux : `stdout` (`console.log`) pour événements normaux, `stderr` (`console.error`) pour `provider_rate_limited` et `provider_unavailable`.
Aucune rétention (pas de fichier log, pas de SQLite, pas de Redis, pas de SaaS, pas d'OpenTelemetry).

### DEC-009.6 — Tests Obligatoires

Suite de 45 cas minimum (cache, fournisseur, mesure du temps, composition) sans aucun appel réseau réel, sans `setTimeout` réel et déterministe.
