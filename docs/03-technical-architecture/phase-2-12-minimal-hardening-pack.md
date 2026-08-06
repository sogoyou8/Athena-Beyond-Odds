# Dossier de validation â€” Phase 2.12 : stabilisation et hardening minimal

* **Projet :** Athena Beyond Odds
* **Phase :** 2.12
* **Date :** 2026-08-06
* **Commit de rÃ©fÃ©rence :** `9b39ab52aab68531a976da86a6a92df889b47689`
* **Branche de base :** `architecture/phase-2-technical-design`
* **Responsable :** Fondateur ABYSS
* **Statut :** ApprouvÃ© â€” implÃ©mentation encore non autorisÃ©e

---

## 1. Contexte et Objectifs aprÃ¨s la Phase 2.11

Ã€ l'issue de la Phase 2.11, la plateforme d'observabilitÃ© minimale a Ã©tÃ© livrÃ©e et fusionnÃ©e dans le commit `9b39ab52aab68531a976da86a6a92df889b47689` (PR #11). L'application dispose d'un cache mÃ©moire opÃ©rationnel (`InMemoryCache`), d'un adaptateur de donnÃ©es sportives rÃ©el (`FootballDataOrgAdapter`), et d'un observer de tÃ©lÃ©mÃ©trie NDJSON sÃ©curisÃ© (`safeObserve`).

La Phase 2.12 est une phase de **stabilisation et hardening minimal des contrats existants**. Elle ne comporte aucune nouvelle fonctionnalitÃ© mÃ©tier, aucune persistance sur disque, aucun nouvel endpoint HTTP, aucun nouveau fournisseur ni aucune nouvelle dÃ©pendance.

---

## 2. Preuves des Constats et Distinctions Techniques

L'audit en lecture seule du dÃ©pÃ´t a rÃ©vÃ©lÃ© cinq Ã©lÃ©ments techniques rÃ©els nÃ©cessitant un hardening :

### A. Duplication des utilitaires de dates UTC (Dette technique)
- **Preuve :** `formatUtcDate` est dupliquÃ©e Ã  l'identique dans `src/infrastructure/cache/memory/in-memory-cache.ts` (lignes 58-63) et dans `src/infrastructure/providers/football-data-org/football-data-org-adapter.ts` (lignes 324-329). De mÃªme, le calcul de la fenÃªtre rolling de 7 jours UTC utilise `addDays` dans le cache et une rÃ©Ã©criture inline (`endDate.setUTCDate(endDate.getUTCDate() + 7)`) dans l'adaptateur.
- **RÃ©solution approuvÃ©e :** Extraction dans `src/shared/date-utils.ts` sans modifier aucun comportement ni aucun contrat temporel.

### B. Couplage en dur du `competitionId` (Bug dormant)
- **Preuve :** `FootballDataOrgAdapter` affecte la valeur littÃ©rale `'FL1'` Ã  `match.competitionId` lors du mapping (ligne 401), au lieu d'utiliser le paramÃ¨tre `competitionCode` effectivement demandÃ©.
- **RÃ©solution approuvÃ©e :** Remplacement par `competitionId: competitionCode`. Le pÃ©rimÃ¨tre actif demeure exclusivement `FL1`.

### C. AsymÃ©trie du message d'erreur de configuration `SPORTS_DATA_PROVIDER` (SÃ©curitÃ© des erreurs)
- **Preuve :** En cas de valeur invalide, `src/app.ts` (ligne 42) rÃ©injecte la valeur reÃ§ue dans le message d'erreur (`Valeur inconnue pour SPORTS_DATA_PROVIDER: "${providerType}"`).
- **RÃ©solution approuvÃ©e :** Harmonisation avec la politique stricte de la Phase 2.11 (`ATHENA_TELEMETRY`). Utilisation d'un message gÃ©nÃ©rique exact : `[Athena] Invalid SPORTS_DATA_PROVIDER value. Expected "in-memory" or "football-data-org".` avec test sentinelle pour garantir l'absence de rÃ©injection.

### D. Typage du bloc catch d'intÃ©gration (QualitÃ© de code)
- **Preuve :** `tests/integration/provider-selection.test.ts` (ligne 108) utilise `catch (err: any)`.
- **RÃ©solution approuvÃ©e :** Remplacement par `catch (err: unknown)` avec rÃ©trÃ©cissement de type explicite.

### E. Classes d'erreurs applicatives orphelines et mÃ©thodes non implÃ©mentÃ©es (Ã‰lÃ©ments diffÃ©rÃ©s)
- **Preuve :** `ProviderQuotaExceededError`, `ProviderAuthError`, `ProviderDataMappingError` et `resetTimeMs` dans `src/application/errors/index.ts` ne sont pas consommÃ©s. `getCompetitions()` et `getMatchDetails()` restent non implÃ©mentÃ©s avec `NotImplementedError`.
- **RÃ©solution approuvÃ©e :** **ConservÃ©s strictement intacts** (aucun retrait, aucun renommage, aucune dÃ©prÃ©ciation).

---

## 3. DÃ©cision d'Architecture DEC-010

Le dossier intÃ¨gre l'ensemble des dispositions approuvÃ©es par `DEC-010` (publiÃ©e dans `docs/06-operations/decision-log.md`) :

- **DEC-010.1 (Nature) :** Phase de hardening interne pure, sans modification du domaine, du port `SportsDataProvider` ou des rÃ©ponses HTTP publiques.
- **DEC-010.2 (Helpers UTC) :** DÃ©finition future de `formatUtcDate(date: Date): string` et `addUtcDays(date: Date, days: number): Date` sous `src/shared/date-utils.ts`.
- **DEC-010.3 (competitionId) :** Mapping dynamique `competitionId: competitionCode`.
- **DEC-010.4 (SÃ©curitÃ© `SPORTS_DATA_PROVIDER`) :** Message gÃ©nÃ©rique exact `[Athena] Invalid SPORTS_DATA_PROVIDER value. Expected "in-memory" or "football-data-org".` sans fuite de la valeur reÃ§ue.
- **DEC-010.5 (Typage strict) :** Passage Ã  `catch (err: unknown)` dans le test d'intÃ©gration.
- **DEC-010.6 (Ã‰lÃ©ments diffÃ©rÃ©s) :** Conservation stricte de toutes les classes d'erreurs applicatives et des mÃ©thodes `NotImplementedError`.
- **DEC-010.7 (Tests futurs) :** DÃ©finition de 22 exigences de tests dÃ©terministes (portant le total Ã  plus de 125 tests).
- **DEC-010.8 (Fichiers autorisÃ©s) :** Confinement strict Ã  8 fichiers au total (dont 2 nouveaux : `src/shared/date-utils.ts` et `tests/unit/date-utils.test.ts`).
- **DEC-010.9 (Fichiers protÃ©gÃ©s) :** Conservation totale du domaine, des use cases, des ports, des interfaces, de la tÃ©lÃ©mÃ©trie et des configs.
- **DEC-010.10 (Hors pÃ©rimÃ¨tre) :** Exclusion explicite de SQLite, persistance, `MatchRepository`, Sportmonks, auth, cloud et retry/backoff.

---

## 4. StratÃ©gie de Validation et SÃ©curitÃ©

- Aucun appel rÃ©seau rÃ©el vers `football-data.org`.
- Aucune manipulation de clÃ© d'API rÃ©elle ou de fichier `.env`.
- Interdiction stricte de modifier le code applicatif ou de crÃ©er des fichiers dans `src/` ou `tests/` dans cette phase documentaire.
- Validation Phase 2.9 Niveau 2 toujours gelÃ©e jusqu'au 15 aoÃ»t 2026.

---

## 5. Verdict Canonique

```text
CADRAGE PHASE 2.12 APPROUVÃ‰ â€” IMPLÃ‰MENTATION ENCORE NON AUTORISÃ‰E
```

---

> Made in Abyss : Spark by the King


> Made in Abyss : Spark by the King
