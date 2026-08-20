# Phase 3.7 — Opponent Context / Contexte d'adversité — Conception Technique (DEC-036)

> **Statut :** Approuvée par le Fondateur
> **Date :** 2026-08-21
> **Branche de base :** `architecture/phase-2-technical-design` (`211b05be8db158083283a10921f79d0d29106df9`)
> **Décision associée :** DEC-036
> **Résultat Gate A :** CONFORME (Audit read-only validé)

---

## 1. Contexte & Enseignements du Gate A

La Phase 3.7 introduit le 6ème signal analytique descriptif d'ATHENA : **Opponent Context / Contexte d'adversité** (nom UI : « Adversaires récents »).

L'audit technique Gate A a démontré :
1. **Périmètre du corpus partagé (`COMPETITION_WIDE`)** : L'appel historique mutualisé unique `provider.getMatches(code, undefined, undefined, { seasonCount: 3 })` retourne l'intégralité des matchs de la compétition.
2. **Indexation `historyByTeam` exhaustive** : L'indexation request-scoped dans `ListAnalyticalMatchesUseCase` enregistre chaque match sous `homeTeam.id` ET `awayTeam.id`. Tous les adversaires rencontrés par l'équipe cible ont donc l'ensemble de leurs matchs de compétition immédiatement accessibles en mémoire.
3. **Zéro appel provider supplémentaire** : `APPLICATION_PROVIDER_INVOCATIONS_MAX = 2` et `HTTP_HARD_MAX = 5` restent strictement respectés.
4. **Calculabilité locale pure** : Profils overall et contextuels (HOME/AWAY) calculables localement sans I/O ni dépendance temporelle.
5. **Indépendance vis-à-vis de `SeasonStrengthCalculator`** : Le Gate A a confirmé qu'une réutilisation directe de `SeasonStrengthCalculator` créerait un couplage artificiel et trompeur. Un service dédié pur `OpponentContextCalculator` est requis.
6. **Propriété clé des observations contextuelles** : Puisque la rencontre récente fait partie de la saison cible, est `FINISHED` et antérieure au match cible, l'adversaire possède mathématiquement $\ge 1$ match overall et $\ge 1$ match dans le venue où il a évolué lors de cette confrontation.

---

## 2. Contrats du Domaine & Types

### 2.1 Types et Value Objects (`src/domain/value-objects/opponent-context-profile.ts`)

```typescript
export type OpponentContextAvailability =
  | 'AVAILABLE'
  | 'INSUFFICIENT_DATA'
  | 'UNAVAILABLE';

export type OpponentVenue = 'HOME' | 'AWAY';

export interface OpponentContextMetrics {
  readonly sampleSize: number;
  readonly pointsPerMatch: number;
  readonly goalDifferencePerMatch: number;
}

export interface OpponentContextEntry {
  readonly recentMatchId: string;
  readonly opponentTeamId: string;
  readonly opponentTeamName: string;
  readonly matchDate: string; // Format ISO UTC YYYY-MM-DDTHH:mm:ss.sssZ
  readonly opponentVenue: OpponentVenue;
  readonly overall: OpponentContextMetrics;
  readonly contextual: OpponentContextMetrics;
}

export interface OpponentContextProfile {
  readonly availability: OpponentContextAvailability;
  readonly recentMatchSampleSize: number | null;
  readonly evaluatedOpponentSampleSize: number | null;
  readonly contextualSampleSize: number | null;
  readonly averageOpponentPointsPerMatch: number | null;
  readonly averageOpponentGoalDifferencePerMatch: number | null;
  readonly averageContextualOpponentPointsPerMatch: number | null;
  readonly averageContextualOpponentGoalDifferencePerMatch: number | null;
  readonly opponents: readonly OpponentContextEntry[];
}
```

### 2.2 Invariants et Sémantique des États

| État | Condition | `recentMatchSampleSize` | `evaluatedOpponentSampleSize` | `contextualSampleSize` | Agrégats (`average*`) | `opponents` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`AVAILABLE`** | `evaluatedOpponentSampleSize >= 3` | `number` (3..5) | `number` (3..5) | `number` (3..5) | `number` finis (non-null) | 3..5 entries |
| **`INSUFFICIENT_DATA`** | `evaluatedOpponentSampleSize < 3` | `number` (0..5) | `number` (0..2) | `number` (0..5) | `null` | 0..5 entries conservées |
| **`UNAVAILABLE`** | Corpus historique `null` | `null` | `null` | `null` | `null` | `[]` (vide) |

---

## 3. Service Domaine : `OpponentContextCalculator`

### 3.1 Propriétés architecturales
- **Couche** : Domaine pur (`src/domain/services/opponent-context-calculator.ts`).
- **Nature** : Synchrone, déterministe, zéro I/O, zéro réseau, zéro `Date.now()`, zéro dépendance provider.
- **Immuabilité** : Copie défensive avant tout tri (`[...matches].sort()`), aucune mutation des structures d'entrée (`ReadonlyMap`, `readonly Match[]`).

### 3.2 Signature du Calculator

```typescript
export interface OpponentContextCalculationInput {
  readonly targetMatch: Match;
  readonly targetTeamId: string;
  readonly historyByTeam: ReadonlyMap<string, readonly Match[]>;
}

export class OpponentContextCalculator {
  public calculate(input: OpponentContextCalculationInput): OpponentContextProfile;
}
```

---

## 4. Algorithme de Calcul Détaillé

### Étape 1 : Sélection des matchs récents de l'équipe cible
1. Récupérer l'historique de l'équipe cible : `historyByTeam.get(targetTeamId) ?? []`.
2. Filtrer les matchs éligibles :
   - `m.competitionId === targetMatch.competitionId`
   - `m.seasonId === targetMatch.seasonId` (étanchéité stricte `TARGET_SEASON_ONLY`)
   - `m.status === 'FINISHED'`
   - `m.score.fullTime.home !== null && m.score.fullTime.away !== null`
   - `m.utcDate.getTime() < targetMatch.utcDate.getTime()` (cutoff strict, anti-look-ahead)
   - `m.homeTeam.id === targetTeamId || m.awayTeam.id === targetTeamId`
3. Trier sur copie : `utcDate DESC`, puis `Match.id DESC` (tie-break déterministe).
4. Conserver les $\le 5$ premiers matchs (`RECENT_MATCH_WINDOW_MAX = 5`).
5. Fixer `recentMatchSampleSize = recentMatches.length`.

### Étape 2 : Construction des entries individuelles (`OpponentContextEntry`)
Pour chaque `recentMatch` sélectionné :
1. **Identifier l'adversaire et son venue** :
   - Si `targetTeamId === recentMatch.homeTeam.id` : `opponentTeam = recentMatch.awayTeam`, `opponentVenue = 'AWAY'`.
   - Si `targetTeamId === recentMatch.awayTeam.id` : `opponentTeam = recentMatch.homeTeam`, `opponentVenue = 'HOME'`.
2. **Récupérer l'historique de l'adversaire** : `historyByTeam.get(opponentTeam.id) ?? []`.
3. **Filtrer les matchs de l'adversaire avant le cutoff du targetMatch** :
   - `m.competitionId === targetMatch.competitionId`
   - `m.seasonId === targetMatch.seasonId`
   - `m.status === 'FINISHED'`
   - `m.score.fullTime.home !== null && m.score.fullTime.away !== null`
   - `m.utcDate.getTime() < targetMatch.utcDate.getTime()` (la rencontre récente est incluse car elle satisfait ce cutoff)
   - `m.homeTeam.id === opponentTeam.id || m.awayTeam.id === opponentTeam.id`
4. **Calculer le profil Overall de l'adversaire** :
   - Pour chaque match, du point de vue de l'adversaire (`isHome = m.homeTeam.id === opponentTeam.id`) :
     - `teamGoals = isHome ? homeGoals : awayGoals`, `oppGoals = isHome ? awayGoals : homeGoals`
     - Points : Victoire = 3, Nul = 1, Défaite = 0.
   - `overallSampleSize = matches.length` ($\ge 1$)
   - `overallPointsPerMatch = totalPoints / overallSampleSize`
   - `overallGoalDifferencePerMatch = (totalGoalsFor - totalGoalsAgainst) / overallSampleSize`
5. **Calculer le profil Contextuel de l'adversaire** :
   - Filtrer les matchs où l'adversaire évoluait dans le `opponentVenue` :
     - Si `opponentVenue === 'HOME'` : `m.homeTeam.id === opponentTeam.id`
     - Si `opponentVenue === 'AWAY'` : `m.awayTeam.id === opponentTeam.id`
   - `contextualSampleSize = contextualMatches.length` ($\ge 1$)
   - Calculer `contextualPointsPerMatch` et `contextualGoalDifferencePerMatch` sur ce sous-ensemble.
6. Construire l'objet `OpponentContextEntry`.

### Étape 3 : Sémantique des doublons et seuil de disponibilité
- **Entries (1 rencontre = 1 entry)** : Aucune déduplication de la liste `opponents` ($\le 5$ entries).
- **Seuil de disponibilité (`evaluatedOpponentSampleSize`)** :
  - Calculé comme le nombre de `opponentTeamId` **DISTINCTS** parmi les entries disposant d'un profil overall valide ($\text{sampleSize} \ge 1$).
  - `evaluatedOpponentSampleSize = new Set(opponents.map(e => e.opponentTeamId)).size`.
  - Si `evaluatedOpponentSampleSize >= 3` $\implies$ `availability = 'AVAILABLE'`.
  - Si `evaluatedOpponentSampleSize < 3` $\implies$ `availability = 'INSUFFICIENT_DATA'`.
- **Agrégats (`MATCH_ENTRY_WEIGHTING`)** :
  - En état `AVAILABLE`, les moyennes globales et contextuelles sont calculées avec un poids égal par **rencontre récente** (et non par adversaire distinct) :
    - `averageOpponentPointsPerMatch = sum(entry.overall.pointsPerMatch) / opponents.length`
    - `averageOpponentGoalDifferencePerMatch = sum(entry.overall.goalDifferencePerMatch) / opponents.length`
    - `averageContextualOpponentPointsPerMatch = sum(entry.contextual.pointsPerMatch) / opponents.length`
    - `averageContextualOpponentGoalDifferencePerMatch = sum(entry.contextual.goalDifferencePerMatch) / opponents.length`
    - `contextualSampleSize = opponents.length`
  - En état `INSUFFICIENT_DATA`, tous les 4 agrégats `average*` sont `null`.

### Étape 4 : Absence d'arrondi dans le Domaine & Vrais Zéros
- Tous les calculs dans le domaine retournent des `number` flottants IEEE 754 exacts (aucun `Math.round`, aucun `toFixed`).
- `0.00` est une valeur mathématique valide (vrai zéro). Aucun faux zéro en cas de données manquantes (utilisation stricte de `null`).

---

## 5. Intégration Application & Budgets Techniques

### 5.1 Modifications de `ListAnalyticalMatchesUseCase`
- Instanciation d'un `private readonly opponentContextCalculator = new OpponentContextCalculator()`.
- Enrichissement de `AnalyticalMatchEntry` avec la structure :
  ```typescript
  opponentContext: {
    home: OpponentContextProfile;
    away: OpponentContextProfile;
  };
  ```
- Dans la boucle d'enrichissement :
  - Si `historicalMatches !== null` : appel du calculator avec `historyByTeam`.
  - Si `historicalMatches === null` (dégradation M-002) : assignation de `unavailableOpponentContext`.

### 5.2 Dégradation gracieuse (`unavailableOpponentContext`)
```typescript
const unavailableOpponentContext: OpponentContextProfile = {
  availability: 'UNAVAILABLE',
  recentMatchSampleSize: null,
  evaluatedOpponentSampleSize: null,
  contextualSampleSize: null,
  averageOpponentPointsPerMatch: null,
  averageOpponentGoalDifferencePerMatch: null,
  averageContextualOpponentPointsPerMatch: null,
  averageContextualOpponentGoalDifferencePerMatch: null,
  opponents: [],
};
```

### 5.3 Budgets & Complexité
- **Appels Application** : 2 maximum (`1 SCHEDULED + 1 History mutualisé`).
- **Appels Provider additionnels** : `0`.
- **Requêtes HTTP amont additionnelles** : `0` (`HTTP_HARD_MAX <= 5`).
- **Complexité Réseau** : $O(1)$.
- **Complexité CPU** : $O(H + 10 \cdot S \cdot K)$ où $H$ est le corpus, $S$ le nombre de target matches et $K$ l'historique par équipe (`BOUNDED_BY_SELECTED_SEASONS`).
- **Mémoïsation** : Non requise en v1 (`REQUEST_SCOPED_MEMOIZATION_REQUIRED = NO`). Si ajout ultérieur, obligation stricte qu'elle soit request-scoped et sensible au cutoff (`teamId + seasonId + cutoffMs + venueOrOverall`).

---

## 6. Frontend & Rendu Visuel

### 6.1 DTO Client (`src/frontend/ts/api-client.ts`)
Définition des interfaces miroirs `OpponentContextProfileDTO`, `OpponentContextEntryDTO`, `OpponentContextMetricsDTO` et enrichissement de `AnalyticalMatchEntryDTO`.

### 6.2 Intégration Visuelle (`src/frontend/ts/render.ts`)
- **Emplacement** : Bloc inséré immédiatement **après** « Dynamique récente » (Momentum).
- **Nom du bloc UI** : « Adversaires récents ».
- **Présentation Neutre & Factuelle** :
  - En `AVAILABLE` :
    - En-tête : `$X$ matchs récents ($Y$ adversaires distincts)`.
    - Ligne Global : `Moyenne adversaires : Pts/m : X.XX | Diff/m : ±X.XX`.
    - Ligne Contextuel : `Contexte terrain : Pts/m : X.XX | Diff/m : ±X.XX`.
    - Table/liste compacte ($\le 5$ lignes) : `Nom adversaire | Domicile/Extérieur | Global: X.XX (±X.XX) | Terrain: X.XX (±X.XX)`.
  - En `INSUFFICIENT_DATA` : Mention explicite `Données insuffisantes` (aucun agrégat affiché).
  - En `UNAVAILABLE` : Mention explicite `Indisponible` (dégradation locale sans masquer le Match Center).
- **Règles de formatage** :
  - Ratios présentés avec 2 décimales.
  - Différence de buts positive préfixée par `+` (ex: `+0.25`).
  - Normalisation anti-`-0.00`.
- **Interdictions formelles** :
  - Aucun label qualitatif (`fort`, `faible`, `facile`, `difficile`, `strong`, `weak`).
  - Aucun score de difficulté, aucune note sur 10, aucune étoile.
  - Aucune colorisation sémantique vert/rouge basée sur la force perçue.
- **Préservation des 9 états globaux** (`NEW_GLOBAL_FRONTEND_STATE = NO`).

---

## 7. Plan de Tests & Validation

### 7.1 Tests Unitaires (`tests/unit/opponent-context-calculator.test.ts`)
1. Exactement 5 matchs récents.
2. Moins de 5 matchs récents ($\ge 3$).
3. Tri `utcDate DESC` puis `Match.id DESC`.
4. Étanchéité stricte de la saison cible (`TARGET_SEASON_ONLY`).
5. Même compétition uniquement.
6. Cutoff temporel strict (`utcDate < targetMatch.utcDate`).
7. Exclusion des données postérieures au match cible.
8. Statut `FINISHED` uniquement et score `fullTime` non-null obligatoire.
9. Dérivation exacte de l'adversaire et de son rôle (`HOME`/`AWAY`).
10. Calculs exacts PPM et GD/m Overall.
11. Calculs exacts PPM et GD/m Contextuel.
12. Inclusion de la rencontre récente dans le profil de l'adversaire.
13. Doublons d'adversaires : conservation des 2 entries et pondération `MATCH_ENTRY_WEIGHTING`.
14. Seuil de disponibilité : `AVAILABLE` avec 3 adversaires distincts.
15. Seuil de disponibilité : `INSUFFICIENT_DATA` avec 5 matchs mais seulement 2 adversaires distincts.
16. 0 match récent $\implies$ `INSUFFICIENT_DATA`.
17. Vrais zéros : `PPM = 0.00` et `GD/m = 0.00`.
18. Immuabilité : aucune mutation des structures passées en entrée.
19. Absence d'arrondi interne dans le domaine.

### 7.2 Tests d'Intégration (`tests/integration/analysis.test.ts`)
1. Présence et complétude de `opponentContext` (home et away) dans `/competitions/:code/matches/analysis`.
2. Dégradation gracieuse vers `UNAVAILABLE` lors de l'échec de l'historique (HTTP 200 préservé).
3. Non-régression de l'endpoint `/competitions/:code/matches`.

### 7.3 Tests Frontend (`tests/frontend/render.test.ts`)
1. Rendu conforme du bloc « Adversaires récents ».
2. Affichage des états `AVAILABLE`, `INSUFFICIENT_DATA` et `UNAVAILABLE`.
3. Formatage à 2 décimales, gestion des vrais zéros, labels `Domicile`/`Extérieur`.
4. Absence totale de vocabulaire qualitatif et de badges de difficulté.

---

## 8. Budget Fichiers Prévisionnel (Implémentation)

| Rôle | Fichier | Action |
| :--- | :--- | :--- |
| **Domain Value Object** | `src/domain/value-objects/opponent-context-profile.ts` | `NEW` |
| **Domain Service** | `src/domain/services/opponent-context-calculator.ts` | `NEW` |
| **Application Use Case** | `src/application/use-cases/list-analytical-matches.ts` | `MODIFY` |
| **Frontend API Client** | `src/frontend/ts/api-client.ts` | `MODIFY` |
| **Frontend Render** | `src/frontend/ts/render.ts` | `MODIFY` |
| **Unit Test** | `tests/unit/opponent-context-calculator.test.ts` | `NEW` |
| **Integration Test** | `tests/integration/analysis.test.ts` | `MODIFY` |
| **Frontend Test** | `tests/frontend/render.test.ts` | `MODIFY` |

**Fichiers strictement interdits de modification lors de l'implémentation :**
- Ports et adapters providers (`sports-data-provider.ts`, `football-data-org-adapter.ts`, `in-memory-sports-data-provider.ts`).
- `package.json`, `package-lock.json`.

---

## 9. Validation Chromium Humaine Future

Après implémentation et fusion, une validation humaine en conditions réelles sous Chromium couvrira :
- Desktop Dark, Desktop Light, Mobile (390×635).
- Vérification visuelle des blocs `AVAILABLE` et `INSUFFICIENT_DATA`.
- Console propre (0 erreur, 0 avertissement).
- Réseau local sans polling ni retry automatique.
- Simulation de coupure `/analysis` et restauration complète validée.
