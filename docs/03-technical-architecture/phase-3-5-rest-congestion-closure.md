# Phase 3.5 — Clôture officielle « Repos & Congestion » (DEC-031)

Date : 2026-08-20
Responsable : Fondateur ABYSS
Statut : APPROUVÉE
Prédécesseurs : DEC-029 (Cadrage), DEC-030 (Conception technique), PR #40 (Implémentation)
Merge SHA d'implémentation : `d3967a6d37781eea48d2efe4c956840f0c9e80b1`

---

## 1. Contexte & Objectif de la Phase 3.5

La Phase 3.5 introduit dans Athena Beyond Odds la brique analytique descriptive **« Repos & Congestion »** (*Schedule Load*), intégrée dans le Match Center pour chaque rencontre programmée.

### Objectif fondamental
Fournir aux analystes une lecture factuelle, déterministe et explicable du rythme calendaire récent des deux équipes en compétition, afin de contextualiser la fraîcheur théorique et la charge de matchs sans jamais émettre de jugement physiologique ni de prédiction sportive.

### Ce que « Repos & Congestion » N'EST PAS
- Pas un score de fatigue synthétique (`fatigueScore`, `congestionScore`, `readinessScore` = strictement interdits).
- Pas un diagnostic physiologique (« fatigué », « épuisé », « frais », « en forme », « risque de blessure » = strictement interdits).
- Pas un modèle prédictif (« favori », « probabilité », « confiance », « avantage » = strictement interdits).
- Pas un moteur de décision (aucun lien avec Value, EV, Kelly, etc.).

---

## 2. Périmètre livré & Validé

### 2.1 Couche Domaine
- **Value-Object** : `ScheduleLoadProfile` (`src/domain/value-objects/schedule-load-profile.ts`)
  - `availability` : `'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE'`
  - `daysSinceLastMatch` : `number | null` (périodes complètes de 24h UTC écoulées)
  - `matchesLast7Days` : `number | null` (matchs joués dans $[targetDate - 7j, targetDate[$)
  - `matchesLast14Days` : `number | null` (matchs joués dans $[targetDate - 14j, targetDate[$)
  - `matchesLast28Days` : `number | null` (matchs joués dans $[targetDate - 28j, targetDate[$)
  - `minimumRestDaysInLast14Days` : `number | null` (repos minimal consécutif pour les matchs de $J-14$)
  - `shortRest` : `boolean | null` (`true` si `daysSinceLastMatch <= 3`, `false` si `> 3`, `null` si `daysSinceLastMatch === null`)
- **Service pur** : `ScheduleLoadCalculator` (`src/domain/services/schedule-load-calculator.ts`)
  - Pur, déterministe, indépendant de tout I/O, sans `Date.now()`, sans dépendance réseau ou provider.
  - Résolution locale $N-1$ provider-neutral (chronologie des matchs).
  - Politique de frontière de saison : `TARGET_SEASON_PLUS_N_MINUS_1_WITHIN_28_DAYS` ($N$ + carryover $N-1 \le 28$ jours ; $N-2$ strictement exclu ; aucun fallback provider $N-1$).
  - Tolérance de score : les matchs `FINISHED` sans score `fullTime` sont comptabilisés pour la charge calendaire.

### 2.2 Couche Application
- **Use Case** : `ListAnalyticalMatchesUseCase` (`src/application/use-cases/list-analytical-matches.ts`)
  - Enrichissement du DTO `/analysis` avec le champ `scheduleLoad: { home: ScheduleLoadProfile, away: ScheduleLoadProfile }`.
  - Indexation locale request-scoped `Map<TeamId, Match[]>` construite en $O(M)$ à partir du corpus historique mutualisé.
  - **Zero extra HTTP call** : 0 requête réseau dédiée pour Schedule Load ($O(1)$ réseau, aucun N+1).
  - Préservation stricte des budgets : maximum 2 invocations provider Application (1 scheduled + 1 mutualisée 3 saisons), maximum 5 requêtes HTTP amont (hard max).
  - `SportsDataProvider` et `HistoryFilter` strictement INCHANGÉS.

### 2.3 Couche Frontend
- **Types & Client** : `ScheduleLoadProfileDTO` dans `src/frontend/ts/api-client.ts`.
- **Rendu DOM** : `createScheduleLoadElement` et `createScheduleLoadTeamElement` dans `src/frontend/ts/render.ts`.
  - Bloc intitulé « Repos & congestion » avec sous-titre explicatif contractuel « Charge dans cette compétition ».
  - Affichage des profils Domicile / Extérieur.
  - Conservation des vrais zéros factuels (`0` match en 7j affiché `0`, non masqué).
  - Absence totale de faux zéros sur les profils `INSUFFICIENT_DATA` (rendu explicite « Données insuffisantes »).
  - Badge « Repos court » affiché uniquement si `shortRest === true` (aucun badge parasite si `false` ou `null`).
  - Zéro terminologie physiologique dans le DOM.
- **Styles** : Intégration CSS harmonieuse dark/light dans `src/frontend/styles/main.css`.
- **Architecture d'état** : Conservation stricte des 9 états globaux existants (aucun nouvel état global ajouté).

---

## 3. Validation Automatisée & Non-Régressions

| Contrôle | Résultat |
|---|---|
| Fichiers de tests | 26 fichiers |
| Tests automatisés passants | **314/314 tests PASS** (0 failed) |
| Tests désactivés (`.skip`, `.only`, `xit`, `xdescribe`) | **0** |
| Typecheck Serveur (`tsc --noEmit`) | PASS (EXIT=0) |
| Typecheck Client (`tsc -p tsconfig.client.json`) | PASS (EXIT=0) |
| Build de production (`npm run build`) | PASS (clean, server, client, assets) |
| Nouvelles dépendances (`package.json`) | **0** |
| Appels réseau réels (real-calls) | **0** |
| Non-régression Form 5 | PASS |
| Non-régression Season Strength | PASS |
| Non-régression Head-to-Head (H2H) | PASS |
| Route `/matches` | Strictement inchangée |

---

## 4. Validation Chromium Humaine (Preuves Complètes)

La validation Chromium humaine a été menée sur l'environnement local (`http://localhost:3005`, provider InMemory, API key absente) et a validé l'ensemble des exigences de fidélité et de robustesse :

1. **Rendu Visuel & Layout** :
   - Desktop dark & light : 3 cartes complètes, Form 5, Season Strength, H2H et Repos & Congestion parfaitement intégrés et lisibles.
   - Mobile 390 × 635 px : Responsive impeccable, aucun overflow horizontal critique.
   - Mention contractuelle « Charge dans cette compétition » visible sur toutes les cartes.
   - Badge « Repos court » absent conformément aux données (`shortRest === false` pour les équipes testées).
2. **Fidélité des Données (Golden API)** :
   - Match 1 (Alpha FC vs Beta United) : Home 4j (2/4/7, min 2j), Away 5j (1/4/7, min 1j) — PASS.
   - Match 2 (Gamma City vs Delta Athletic) : Home 5j (2/3/6, min 1j), Away 7j (0/4/8, min 1j, vrai zéro 7j affiché) — PASS.
   - Match 3 (Epsilon SC vs Zeta Rovers) : Home 8j (0/3/4, min 2j, vrai zéro 7j affiché), Away « Données insuffisantes » sans faux zéro — PASS.
3. **Absence de Terminologie Interdite** :
   - 0 occurrence de mots physiologiques ou de scoring prédictif.
4. **Console DevTools** :
   - 0 erreur JS fatale, 0 exception non gérée, 0 warning significatif (`FATAL_JS=0`, `UNHANDLED_EXCEPTION=0`).
5. **Réseau, Polling & Résilience** :
   - 0 requête vers `football-data.org` ou provider externe (100% local-only).
   - Test de silence 30 secondes sans interaction : 1 seul `/analysis`, 1 seul `/health` — **POLLING=NO**.
   - Test de blocage réseau 30 secondes sur `/analysis` : 1 seule tentative, aucune boucle — **AUTOMATIC_RETRY=NO**.
   - Bouton de retry manuel présent et fonctionnel — **MANUAL_RETRY_AVAILABLE=YES**.
   - Restauration après déblocage : recharge propre, 3 cartes et 4 briques analytiques restaurées — **RESTORATION_AFTER_BLOCK=PASS**.

---

## 5. Traçabilité de la Fusion d'Implémentation

- **Pull Request** : PR #40 (`feat(analytics): implement phase 3.5 rest and congestion`)
- **Méthode de fusion** : `Create a merge commit`
- **Merge SHA** : `d3967a6d37781eea48d2efe4c956840f0c9e80b1`
- **Parents du Merge** :
  - Parent 1 : `836d9969894aab2d73f42456fadb107ea45a82d6` (DEC-030 Conception technique)
  - Parent 2 : `2b7322f31cac8d5da863df8ae78d43152469f3a1` (Commit 3 Frontend implementation)
- **Branche source** : `implementation/phase-3-5-rest-congestion` (préservée sur remote).

---

## 6. Conclusion & Statut du Projet

### Statut Phase 3.5
**`PHASE 3.5 = CLOSED`**

La brique « Repos & Congestion » est officiellement intégrée et clôturée. Elle enrichit l'arsenal descriptif du Match Center d'Athena Beyond Odds sans compromettre la pureté architecturale, la mutualisation des données, ni les budgets de requêtes.

### Avertissement Fondateur sur le Decision Engine
Athena Beyond Odds demeure à ce stade une plateforme d'analyse descriptive et factuelle. Aucune inférence décisionnelle (probabilités, value, EV, Kelly, ranking prédictif) n'est implémentée ni activée.

### Transition vers les phases suivantes
La clôture de la Phase 3.5 n'engage aucun choix automatique pour la Phase 3.6. L'arbitrage de la prochaine brique analytique fera l'objet d'un processus de cadrage et de décision indépendant (Gate / Cadrage produit).
