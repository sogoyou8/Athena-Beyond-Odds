# Phase 3.6 — Clôture et régularisation Momentum (DEC-034)

> **Statut :** Approuvée par le Fondateur
> **Date :** 2026-08-21
> **Branche de base :** `architecture/phase-2-technical-design` (`9fc1b03bfb64e536dc472c63cc99f79a23bc3aae`)
> **PR d'implémentation associée :** PR #44 (`e57246a2fc2ab72b3212d1a794e5790441476b3d`)
> **Décision associée :** DEC-034

---

## 1. Contexte & Objet de DEC-034

La Phase 3.6 a permis d'introduire le signal analytique descriptif de **Momentum / Dynamique récente** au sein d'ATHENA.

Cette décision (DEC-034) remplit deux fonctions indispensables :
1. **Clôturer officiellement la Phase 3.6** suite à l'implémentation complète (PR #44), à la validation automatisée (336/336 tests) et à la validation Chromium humaine.
2. **Régulariser la déclaration prématurée de clôture** introduite directement dans le `decision-log.md` (commit `9fc1b03`, version v2.13) sur la branche principale avant consignation formelle de la validation Chromium humaine, sans réécriture de l'historique Git.

---

## 2. Périmètre livré & Architecture

### 2.1 Composants Domaine & Application
- `MomentumProfile`, `MomentumWindow`, `MomentumAvailability` définis dans `src/domain/value-objects/momentum-profile.ts`.
- `MomentumCalculator` implémenté dans `src/domain/services/momentum-calculator.ts` en tant que service de domaine pur, synchrone et déterministe.
- Intégration dans `ListAnalyticalMatchesUseCase` (`src/application/use-cases/list-analytical-matches.ts`) réutilisant l'index mémoire request-scoped `historyByTeam: Map<string, Match[]>`.

### 2.2 Règles métier livrées
- **Fenêtres adaptatives** : 3v3 (6-7 matchs éligibles), 4v4 (8-9 matchs éligibles), 5v5 ($\ge 10$ matchs éligibles). Moins de 6 matchs $\implies$ `INSUFFICIENT_DATA`.
- **Fenêtres consécutives sans chevauchement** : `recent [0..W[` et `previous [W..2W[`.
- **Étanchéité stricte de saison** : `TARGET_SEASON_ONLY` (aucun carryover de saisons antérieures N-1 / N-2).
- **Éligibilité** : Matchs `FINISHED`, même compétition, même équipe, coupure stricte `utcDate < targetMatch.utcDate`, score `fullTime` non nul requis.
- **Tri déterministe** : `utcDate DESC`, tie-break `Match.id DESC`.
- **Métriques factuelles** : Points football (W=3, D=1, L=0), `pointsPerMatch`, `goalsForPerMatch`, `goalsAgainstPerMatch`, `goalDifferencePerMatch`, ainsi que leurs deltas `pointsPerMatchDelta` et `goalDifferencePerMatchDelta`.

### 2.3 Neutralité visuelle & Frontend
- Intégration dans `api-client.ts` et `render.ts` avec le bloc **« Dynamique récente »**.
- Formatage UI avec 2 décimales et normalisation anti-`-0.00`.
- **Neutralité absolue** : Aucun score composite (`momentumScore`), aucune classification qualitative (`UP`/`DOWN`, `bonne/mauvaise dynamique`), aucune colorisation sémantique vert/rouge sur les deltas.
- **Gestion des états dégradés** : `INSUFFICIENT_DATA` affiché sous forme textuelle (« Données insuffisantes »), `UNAVAILABLE` (« Indisponible »), aucun faux `0.00`.

### 2.4 Respect des budgets techniques
- `SportsDataProvider` et `HistoryFilter` inchangés (0 nouveau fichier provider, 0 nouveau endpoint).
- `MOMENTUM_EXTRA_APPLICATION_CALLS = 0`, `MOMENTUM_EXTRA_HTTP_REQUESTS = 0`.
- Budget HTTP amont respecté ($\le 5$ requêtes HTTP hard max), complexité $O(1)$ sans N+1.

---

## 3. Validation & Preuves

### 3.1 Tests automatisés
- **27 fichiers de tests**, **336 tests passants** (0 échec, 0 test désactivé).
- Baseline avant Momentum : 314 tests $\implies$ **+22 tests** ajoutés (13 unitaires `momentum-calculator.test.ts`, 4 intégration `analysis.test.ts`, 5 frontend `render.test.ts`).
- `TYPECHECK` serveur et client : 0 erreur.
- `BUILD` : 0 erreur.
- Aucun real-call réseau.

### 3.2 Validation Chromium humaine
- `CHROMIUM_HUMAN_VALIDATION = PASS`.
- **Desktop Dark & Light** : Rendu net des 5 briques, ratios arrondis à 2 décimales.
- **Mobile (390 × 635)** : Responsive validé sans overflow critique (`HORIZONTAL_OVERFLOW_CRITICAL = NO`).
- **Console DevTools** : `FATAL_JS = 0`, `UNHANDLED_EXCEPTION = 0`, `SIGNIFICANT_WARNING = 0`.
- **Réseau** : Local-only, 1 appel initial `/health` et 1 appel initial `/analysis`, `POLLING = NO`, 0 provider externe.
- **Résilience** : Simulation d'échec `/analysis` bloqué $\implies$ état d'erreur propre avec bouton *Réessayer*, `AUTOMATIC_RETRY = NO`, `MANUAL_RETRY_AVAILABLE = YES`, `RESTORATION_AFTER_BLOCK = PASS`.

### 3.3 Réserve non bloquante sur le 5v5
- `CHROMIUM_LIVE_5V5_EXPOSED = NO` en raison des fixtures InMemory locales actuelles qui couvrent 8 à 9 matchs éligibles max par équipe dans la saison cible 2099.
- `WINDOW_5V5_AUTOMATED_TESTS = PASS` (couvert exhaustivement par la suite de tests unitaires).
- Statut consigné : `CHROMIUM_5V5 = NOT_EXPOSED_NON_BLOCKING`.

---

## 4. Traçabilité de l'incident v2.13

Le commit direct `9fc1b03` sur `architecture/phase-2-technical-design` a introduit une mention prématurée de clôture dans le `decision-log.md` (v2.13).
DEC-034 régularise cette situation sans altérer l'historique Git et fait passer le Decision Log en **v2.14**.

---

## 5. Bilan du socle analytique ATHENA (5 briques descriptives)

À l'issue de la Phase 3.6, le Match Center dispose de 5 briques analytiques descriptives :
1. **Form 5** (Phase 3.1 / 3.2 — DEC-019)
2. **Season Strength** (Phase 3.3 — DEC-024)
3. **H2H contextualisé** (Phase 3.4 — DEC-027)
4. **Repos & Congestion** (Phase 3.5 — DEC-029 / DEC-030)
5. **Momentum descriptif** (Phase 3.6 — DEC-032 / DEC-033 / DEC-034)

Ces 5 signaux descriptifs ne constituent en aucun cas un modèle prédictif, un Power Rating, une cote estimée ou une recommandation de pari (zéro probabilité, zéro EV, zéro Kelly).

---

## 6. Décision sur la suite

La Phase 3.6 est officiellement **CLOSE**.
Aucune phase suivante (Phase 3.7 / Travel / Home-Away contextualisé avancé / Power Rating) n'est engagée sans un arbitrage Fondateur préalable séparé.
