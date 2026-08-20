# Phase 3.7 — Opponent Context / Contexte d'adversité — Cadrage Produit (DEC-035)

> **Statut :** Approuvé par le Fondateur
> **Date :** 2026-08-21
> **Branche de base :** `architecture/phase-2-technical-design` (`e13e75fd5e3d6ce9eb2324a2f0161c8110267bf6`)
> **Décision associée :** DEC-035
> **Arbitrages Fondateur :** OQ-082 à OQ-125 approuvés formellement

---

## 1. Vision Produit & Justification

ATHENA dispose actuellement de 5 signaux analytiques descriptifs opérationnels :
1. **Form 5** (résultats récents)
2. **Season Strength** (force intrinsèque de la saison en cours et segmentation domicile/extérieur)
3. **H2H contextualisé** (historique direct)
4. **Repos & Congestion** (charge et calendrier)
5. **Momentum descriptif** (dynamique comparée récent vs précédent)

La Phase 3.7 introduit une dimension analytique manquante et complémentaire : **le contexte d'adversité (Opponent Context)**.

### 1.1 Question métier centrale (OQ-083)
> *« Quel était le niveau saisonnier des adversaires rencontrés dans les matchs récents de cette équipe ? »*

Phase 3.7 ne répond **pas** à la question : *« L'équipe va-t-elle mieux performer parce qu'elle a affronté des adversaires forts ou faibles ? »*.

### 1.2 Nommage retenu (OQ-082, OQ-111, OQ-122)
- **Nom analytique :** `Opponent Context`
- **Nom documentaire français :** `Contexte d'adversité`
- **Nom UI :** `Adversaires récents`
- *(Le terme « Difficulté du calendrier » est explicitement écarté pour éviter toute interprétation qualitative ou prescriptive).*

---

## 2. Principes Fondateurs & Neutralité Absolue

### 2.1 Nature descriptive et non-prédictive (OQ-082, OQ-097, OQ-098)
- **Strictement descriptif, déterministe et explicable.**
- **Interdictions formelles :**
  - Aucun score de difficulté composite (`scheduleDifficultyScore`, `difficultyIndex`, `qualityScore`).
  - Aucune classification qualitative (`FORT`, `FAIBLE`, `DIFFICILE`, `FACILE`, `STRONG`, `WEAK`).
  - Aucun badge prédictif, aucune note sur 10, aucune étoile.
  - Aucune colorisation sémantique vert/rouge basée sur la force perçue de l'adversaire.

### 2.2 Complémentarité sans ajustement automatique (OQ-084, OQ-085, OQ-103, OQ-104)
- **Complète Form 5 sans le modifier** : Form 5 indique *quels résultats*, Opponent Context indique *face à qui*.
- **Aucun recalcul de Momentum** : Aucun *Adjusted Momentum*, aucun *Momentum Strength Score*.
- **Aucun Power Rating / Elo** : Les points par match (PPM) et différence de buts par match (GD/m) des adversaires sont des statistiques saisonnières descriptives, et non un classement/rating ATHENA.
- **Aucun ajustement de performance** (`NO_RESULT_ADJUSTMENT_V1`).

---

## 3. Contrat Métier & Règles de Calcul

### 3.1 Fenêtre des matchs récents de l'équipe cible (OQ-086)
- **Taille maximale :** 5 matchs récents (`RECENT_MATCH_WINDOW_MAX = 5`).
- **Critères d'éligibilité stricts :**
  - Même compétition (`competitionId`).
  - Même saison cible (`seasonId`).
  - Même équipe cible (`targetTeamId`).
  - Statut `FINISHED` exclusivement.
  - Coupure temporelle stricte : `historicalMatch.utcDate < targetMatch.utcDate`.
  - Score `fullTime` complet non nul.
- **Sélection :** Les 5 matchs les plus récents (tri `utcDate DESC`, tie-break `Match.id DESC`).

### 3.2 Seuil minimal d'évaluation (OQ-087, OQ-101)
- **Minimum 3 adversaires évaluables requis** :
  - Si $\text{evaluatedOpponentSampleSize} \ge 3 \implies \text{AVAILABLE}$.
  - Si $\text{evaluatedOpponentSampleSize} < 3 \implies \text{INSUFFICIENT\_DATA}$.
- Évite de produire une moyenne sur un échantillon trop restreint (1 ou 2 adversaires).

### 3.3 Étanchéité de saison & Snapshot temporel strict (OQ-088, OQ-089, OQ-090, OQ-121)
- **Étanchéité saisonnière** : `TARGET_SEASON_ONLY = YES` (aucun carryover N-1/N-2).
- **Snapshot à la date du match cible** (`OPPONENT_PROFILE_CUTOFF = TARGET_MATCH_DATE`) :
  - Pour un `targetMatch` à date $T$, le profil de chaque adversaire est calculé à partir de tous ses matchs de la saison cible strictement antérieurs à $T$ (`opponentMatch.utcDate < targetMatch.utcDate`).
  - **Absence totale de data leakage** : Aucune donnée $\ge T$ n'est utilisée.
  - Règle conforme et prête pour les futurs backtests chronologiques (`walk-forward`).

### 3.4 Métriques évaluées par adversaire (OQ-091, OQ-092, OQ-093, OQ-094)
Pour chaque adversaire récent de la fenêtre :
1. **Profil Overall** :
   - `overallPointsPerMatch` (Points/match : Victoire=3, Nul=1, Défaite=0).
   - `overallGoalDifferencePerMatch` (Différence de buts/match).
   - Disponible si l'adversaire a disputé au moins 1 match dans la saison cible avant $T$.
2. **Profil Contextuel (Venue)** :
   - Contextualisé selon le terrain où évoluait l'adversaire lors de la confrontation (ex: si l'équipe cible jouait HOME contre Lyon, Lyon était AWAY $\implies$ profil AWAY de Lyon).
   - `contextualPointsPerMatch`, `contextualGoalDifferencePerMatch`.
   - Disponible si l'adversaire a disputé au moins 1 match dans ce venue avant $T$.
3. **Indépendance des disponibilités** : Si le profil contextuel est indisponible mais le profil overall disponible, l'adversaire reste comptabilisé dans l'agrégat overall.

### 3.5 Agrégats descriptifs (OQ-095, OQ-096)
- **Moyenne arithmétique simple à poids égal** (`SIMPLE_EQUAL_WEIGHT_AVERAGE`) :
  - `averageOpponentPointsPerMatch` = moyenne des PPM overall des adversaires évaluables.
  - `averageOpponentGoalDifferencePerMatch` = moyenne des GD/m overall des adversaires évaluables.
  - Aucune pondération par la récence ou le score du match.
- **Agrégat contextuel séparé** (`SEPARATE_CONTEXTUAL_AGGREGATE`) :
  - `averageContextualOpponentPointsPerMatch`, `averageContextualOpponentGoalDifferencePerMatch`.
  - Calculé strictement sur le sous-ensemble d'adversaires disposant d'un profil contextuel valide.
  - Expose son propre `contextualSampleSize`.

### 3.6 Détail traçable et explicable (OQ-099, OQ-124, OQ-125)
Le DTO conserve jusqu'à 5 entrées détaillant les adversaires récents (`OpponentContextEntry`), permettant à l'utilisateur de vérifier l'origine exacte des moyennes sans exposer l'historique brut match par match.

---

## 4. Modèle Conceptuel & Contrats DTO (OQ-100, OQ-101, OQ-102)

```typescript
type OpponentContextAvailability = 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';
type OpponentVenue = 'HOME' | 'AWAY';

interface OpponentContextEntry {
  opponentTeamId: string;
  opponentTeamName: string;
  matchDate: string;
  opponentVenue: OpponentVenue;
  overallSampleSize: number;
  overallPointsPerMatch: number;
  overallGoalDifferencePerMatch: number;
  contextualSampleSize: number | null; // Choix 0 vs null formalisé en conception technique
  contextualPointsPerMatch: number | null;
  contextualGoalDifferencePerMatch: number | null;
}

interface OpponentContextProfile {
  availability: OpponentContextAvailability;
  recentMatchSampleSize: number;
  evaluatedOpponentSampleSize: number;
  contextualSampleSize: number;
  averageOpponentPointsPerMatch: number | null;
  averageOpponentGoalDifferencePerMatch: number | null;
  averageContextualOpponentPointsPerMatch: number | null;
  averageContextualOpponentGoalDifferencePerMatch: number | null;
  opponents: OpponentContextEntry[];
}
```

- **Sémantique des zéros** : En état `AVAILABLE`, `0.00` est une valeur mathématique valide (vrai zéro). En `INSUFFICIENT_DATA` ou `UNAVAILABLE`, tous les agrégats numériques sont `null` (aucun faux zéro).

---

## 5. Architecture Cible & Budgets Techniques (OQ-105 à OQ-110, OQ-123)

### 5.1 Intentions architecturales cibles
- **Service pur de domaine** (`OpponentContextCalculator`) : Synchrone, déterministe, zéro I/O, zéro dépendance temporelle, immuabilité des entrées.
- **Réutilisation du corpus partagé** : L'appel mutualisé 3 saisons existant alimente la brique sans modifier `SportsDataProvider` ni `HistoryFilter`.
- **Réutilisation de `historyByTeam: Map<string, Match[]>`** : Indexation mémoire locale dans `ListAnalyticalMatchesUseCase`.
- **Mémoïsation locale request-scoped autorisée** : Possibilité d'indexer les profils adversaires calculés durant la requête `/analysis` pour éviter des scans redondants, sous réserve d'une clé sensible au cutoff (`teamId + targetMatch.utcDate`).
- **Budgets réseau cibles** :
  - `APPLICATION_PROVIDER_INVOCATIONS_MAX = 2` (0 appel supplémentaire).
  - `UPSTREAM_HTTP_REQUESTS_NORMAL <= 4`, `FALLBACK_MAX <= 5` (`HTTP_HARD_MAX = 5`).
  - Aucun N+1 (`NETWORK_COMPLEXITY = O(1)`).

---

## 6. Frontend & Intégration Visuelle (OQ-111 à OQ-116)

- **Nom du bloc UI** : « Adversaires récents ».
- **Emplacement** : Positionné après le bloc « Dynamique récente » (Momentum).
- **Rendu synthétique & compact** :
  - Nombre d'adversaires évalués ($X / Y$).
  - Moyenne Pts/match et Diff. buts/match globales des adversaires.
  - Moyenne Pts/match et Diff. buts/match contextuelles (terrain).
  - Liste détaillée compacte ($\le 5$ lignes traçables).
- **Formatage** : Ratios présentés avec 2 décimales, normalisation anti-`-0.00`.
- **Résilience** : En cas de défaillance du flux historique, dégradation locale vers `UNAVAILABLE` sans bloquer le reste du Match Center.
- **Conservation des 9 états globaux** (`NEW_GLOBAL_FRONTEND_STATE = NO`).

---

## 7. Périmètres Exclus (OQ-117 à OQ-120)

Sont formellement exclus de la Phase 3.7 :
- **Travel / Déplacement géographique** (nécessite coordonnées, stades, distances $\implies$ étude dédiée ultérieure).
- **Power Rating / Modélisation prédictive** (Elo, cotes, probabilités, value, Kelly).
- **Marché des paris & bookmakers**.
- **Carryover multi-saisons / ajustement des résultats passés**.

---

## 8. Prochaine Étape

Conformément à la gouvernance ABYSS :
1. Fusion et audit post-fusion de **DEC-035**.
2. Réalisation du **Gate A de faisabilité technique Phase 3.7** (audit read-only pour prouver que le corpus mutualisé supporte le calcul des profils adversaires au cutoff sans requêtes amont supplémentaires et sans explosion CPU).
3. Conception technique détaillée (**DEC-036**).
