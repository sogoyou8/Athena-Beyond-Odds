# Phase 3.4 — Conception technique du H2H contextualisé

## 1. Décision

- **Décision :** DEC-027 — Phase 3.4 — Conception technique du H2H contextualisé
- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Arbitrage fondateur débloquant :** Option 3B contrôlée (évolution générique et bornée du port `SportsDataProvider` pour supporter un corpus multi-saison sans méthode spécifique H2H).
- **Conclusion :** La conception technique du H2H contextualisé est formellement définie et verrouillée. L'implémentation logicielle, toute modification de code dans `src/` ou `tests/`, et tout appel réseau restent strictement non autorisés avant la fusion et l'audit de cette décision.

---

## 2. Résolution formelle des Questions Ouvertes (OQ-016 à OQ-028)

Conformément aux arbitrages officiels du Fondateur, l'ensemble des questions ouvertes issues du cadrage DEC-026 est résolu :

| Réf. | Question Ouverte | Résolution officielle DEC-027 | Statut |
|---|---|---|---|
| **OQ-016** | Horizon temporel | **Multi-saison borné** (Option 3B). Le H2H exploite un historique multi-saison pour fournir un échantillon représentatif sans se limiter à la seule saison courante. | **RESOLVED** |
| **OQ-017** | Profondeur maximale | **Maximum 5 confrontations exploitables** ET **maximum 3 saisons** distinctes (saison cible courante, saison N-1, saison N-2). | **RESOLVED** |
| **OQ-018** | Exposition temporelle | Exposition explicite des métadonnées : `sampleSize`, `latestMeetingDate`, `oldestMeetingDate`, `seasonsCovered`. **Aucune pondération de récence arbitraire** ($0.8/0.2$ interdit). | **RESOLVED** |
| **OQ-019** | Segments Domicile / Extérieur | Deux segments indépendants : segment global (**`overall`**) et segment contextualisé à la configuration du match cible (**`contextual` avec `venue: 'SAME_VENUE'`**). | **RESOLVED** |
| **OQ-020** | Périmètre compétitif | **Même compétition uniquement** (`m.competitionId === targetMatch.competitionId`). Aucun mélange silencieux de championnats ou coupes. | **RESOLVED** |
| **OQ-021** | Matchs de coupe | Les confrontations de coupe ne sont éligibles que si le match cible appartient lui-même à cette même compétition de coupe. | **RESOLVED** |
| **OQ-022** | Matchs amicaux | **Amicaux formellement exclus** en v1. | **RESOLVED** |
| **OQ-023** | Comportement petit échantillon | $\ge 1$ confrontation = **`AVAILABLE`** (métriques calculées sur l'échantillon observé) ; 0 confrontation = **`INSUFFICIENT_DATA`** (`metrics: null`). Aucun seuil subjectif de masquage. | **RESOLVED** |
| **OQ-024** | Contrat de disponibilité | Union discriminée stricte : **`AVAILABLE`**, **`INSUFFICIENT_DATA`**, **`UNAVAILABLE`** (analogue à Season Strength). | **RESOLVED** |
| **OQ-025** | Structure des DTOs | DTO explicite `HeadToHeadProfile` structuré en `overall` et `contextual`, avec perspectives symétriques d'équipe (`HeadToHeadPerspective`). | **RESOLVED** |
| **OQ-026** | Capacité du Port Provider | Le port actuel est insuffisant pour demander explicitement 3 saisons. **Conception autorisée d'une évolution minimale générique** (Option 3B) sans méthode spécifique H2H. Modification de code différée post-fusion. | **RESOLVED** |
| **OQ-027** | Double Budget Provider | **Plafond dur Application :** $\le 2$ invocations logiques par exécution de `/analysis`. **Plafond dur Réseau (football-data.org cold path) :** $\le 5$ requêtes HTTP amont (Target $\le 4$). Complexité réseau $O(1)$ sans aucun N+1. | **RESOLVED** |
| **OQ-028** | Mutualisation des flux | **Mutualisation obligatoire** : l'invocation historique logique unique alimente simultanément `FormCalculator`, `SeasonStrengthCalculator` et `HeadToHeadCalculator`. | **RESOLVED** |

---

## 3. Évolution générique du Port `SportsDataProvider` (Option 3B)

### 3.1. Interdiction d'une méthode spécifique H2H
Il est formellement interdit d'introduire dans le port des méthodes dépendantes de la fonctionnalité H2H telles que `getHeadToHead(...)`, `getMeetings(...)` ou `getH2HForTeams(...)`. Le port doit demeurer une abstraction générique de fourniture de données sportives.

### 3.2. Conception du contrat générique
Pour permettre à la couche Application de demander un historique borné sur plusieurs saisons tout en conservant une abstraction neutre, le port `SportsDataProvider` évoluera lors de la phase d'implémentation selon une signature générique structurée :

```typescript
export interface HistoryFilter {
  /** Nombre maximum de saisons historiques consécutives demandées (ex: 3) */
  readonly seasonCount?: number;
  /** Identifiants explicites de saisons demandées si connus */
  readonly seasonIds?: readonly string[];
}

export interface SportsDataProvider {
  getCompetitions(): Promise<Competition[]>;

  /**
   * Récupère les matchs d'une compétition avec support de filtre temporel ou historique multi-saison.
   *
   * @param competitionCode Code normalisé de la compétition (ex: "FL1")
   * @param fromDate        Date de début UTC (optionnel)
   * @param toDate          Date de fin UTC (optionnel)
   * @param historyFilter   Filtre d'historique multi-saison optionnel (ex: { seasonCount: 3 })
   */
  getMatches(
    competitionCode: string,
    fromDate?: Date,
    toDate?: Date,
    historyFilter?: HistoryFilter
  ): Promise<Match[]>;

  getMatchDetails(externalMatchId: string): Promise<Match>;
}
```

### 3.3. Justification de la conception
- **Provider-neutral :** Aucun concept propre à un fournisseur amont (`?season=YYYY`, IDs externes).
- **Rétrocompatibilité :** L'appel sans dates et sans `historyFilter` conserve la sémantique de saison courante (`DEC-020`).
- **Généricité :** Permet à l'application de demander 1, 2 ou 3 saisons de façon explicite et bornée.

---

## 4. Double Métrique de Budget Provider et Maîtrise du Réseau

Pour lever toute ambiguïté entre les appels logiques TypeScript et les requêtes HTTP physiques, Athena consigne deux métriques strictes :

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. APPLICATION_PROVIDER_INVOCATIONS (Couche Application)                │
│    Maximum strict : 2 invocations logiques par exécution de /analysis   │
│    - Invocation 1 : Matches programmés (Match Center, fenêtre 7 jours)  │
│    - Invocation 2 : Corpus historique mutualisé (jusqu'à 3 saisons)     │
├─────────────────────────────────────────────────────────────────────────┤
│ 2. UPSTREAM_HTTP_REQUESTS (Couche Infrastructure / football-data.org)   │
│    Hard Max : 5 requêtes HTTP amont (Cold path)                         │
│    Target   : <= 4 requêtes HTTP amont                                  │
│    Décomposition :                                                      │
│    - 1 HTTP : Match Center principal (SCHEDULED)                        │
│    - 1 HTTP (optionnelle) : Catalogue des saisons (si nécessaire)       │
│    - jusqu'à 3 HTTP : Matchs des 3 saisons (courante, N-1, N-2)         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Règle Anti-N+1 et Indépendance du Volume
- Pour 1 match programmé : $\le 2$ invocations logiques, $\le 5$ requêtes HTTP amont.
- Pour 3 matchs programmés : $\le 2$ invocations logiques, $\le 5$ requêtes HTTP amont.
- Pour 10 matchs programmés : $\le 2$ invocations logiques, $\le 5$ requêtes HTTP amont.
- **Complexité réseau :** Strictement $O(1)$ par rapport au nombre de cartes du Match Center.

---

## 5. Service de Domaine pur `HeadToHeadCalculator`

Le calcul des métriques H2H est confié à un service de domaine pur, sans effet de bord, sans I/O et sans dépendance temporelle système :

### 5.1. Entrées et Sorties conceptuelles
- **Entrées :** `targetMatch: Match`, `historicalMatches: Match[]`
- **Sorties :** `HeadToHeadProfile`

### 5.2. Critères stricts d'éligibilité d'une rencontre H2H
Une rencontre `m` issue de `historicalMatches` est éligible pour le match cible `targetMatch` si et seulement si :
1. **Compétition identique :** `m.competitionId === targetMatch.competitionId` (les matchs d'autres ligues ou coupes sont exclus) ;
2. **Participation des deux équipes :** `{m.homeTeam.id, m.awayTeam.id} === {targetMatch.homeTeam.id, targetMatch.awayTeam.id}` (identifiants métier stables `Team.id`, matching par nom strictement interdit) ;
3. **Statut terminé :** `m.status === 'FINISHED'` ;
4. **Score complet :** `m.score.fullTime.home !== null && m.score.fullTime.away !== null` ;
5. **Coupure temporelle stricte :** `m.utcDate < targetMatch.utcDate` (match cible et matchs futurs strictement exclus, anti look-ahead) ;
6. **Périmètre saisonnier borné :** la saison de `m` appartient aux 3 saisons autorisées (saison cible, N-1, N-2).

### 5.3. Algorithme de sélection des segments
- **Segment `overall` :**
  1. Filtrer les rencontres éligibles selon les critères 5.2.
  2. Trier par `utcDate DESC` puis départage déterministe par `id DESC`.
  3. Conserver au maximum les **5 premières rencontres**.
- **Segment `contextual` (`SAME_VENUE`) :**
  1. Filtrer les rencontres éligibles respectant en outre l'orientation de lieu : `m.homeTeam.id === targetMatch.homeTeam.id && m.awayTeam.id === targetMatch.awayTeam.id`.
  2. Trier par `utcDate DESC` puis départage déterministe par `id DESC`.
  3. Conserver au maximum les **5 premières rencontres**.
  4. Le segment contextual est calculé de façon totalement indépendante (il peut contenir 0, 1, 2... matchs indépendamment du segment overall).

---

## 6. Structure des DTOs et Invariants de Symétrie

### 6.1. Types et Structures de Données

```typescript
export type HeadToHeadAvailability = 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';

export interface HeadToHeadPerspective {
  readonly teamId: string;
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly goalsFor: number;
  readonly goalsAgainst: number;
  readonly goalDifference: number;
}

export interface HeadToHeadSegment {
  readonly availability: HeadToHeadAvailability;
  readonly sampleSize: number | null;
  readonly homeTeam: HeadToHeadPerspective | null;
  readonly awayTeam: HeadToHeadPerspective | null;
  readonly latestMeetingDate: Date | null;
  readonly oldestMeetingDate: Date | null;
  readonly seasonsCovered: number | null;
}

export interface HeadToHeadProfile {
  readonly overall: HeadToHeadSegment;
  readonly contextual: {
    readonly venue: 'SAME_VENUE';
    readonly segment: HeadToHeadSegment;
  };
}
```

### 6.2. Invariants de Symétrie (pour tout segment `AVAILABLE`)
- `homeTeam.wins === awayTeam.losses`
- `homeTeam.losses === awayTeam.wins`
- `homeTeam.draws === awayTeam.draws`
- `homeTeam.goalsFor === awayTeam.goalsAgainst`
- `homeTeam.goalsAgainst === awayTeam.goalsFor`
- `homeTeam.goalDifference === -awayTeam.goalDifference`
- `homeTeam.wins + homeTeam.draws + homeTeam.losses === sampleSize`

### 6.3. États de disponibilité et métadonnées
- **`AVAILABLE` (`sampleSize >= 1`) :** `homeTeam` et `awayTeam` non-nulls, `latestMeetingDate` (date de la rencontre la plus récente retenue), `oldestMeetingDate` (date de la rencontre la plus ancienne retenue), `seasonsCovered` (nombre de `seasonId` distincts parmi les matchs retenus).
- **`INSUFFICIENT_DATA` (`sampleSize === 0`) :** `homeTeam: null`, `awayTeam: null`, `latestMeetingDate: null`, `oldestMeetingDate: null`, `seasonsCovered: 0`. Aucun faux zéro calculé.
- **`UNAVAILABLE` (`sampleSize === null`) :** dégradation lors de l'échec de récupération historique amont. Tous les champs de métadonnées sont à `null`.

---

## 7. Orchestration Application et Gestion des Échecs

### 7.1. Flux d'exécution dans `ListAnalyticalMatchesUseCase`
1. **Appel 1 (SCHEDULED) :** `provider.getMatches(code, now, now+7d)`
2. **Appel 2 (Historique mutualisé) :** `provider.getMatches(code, undefined, undefined, { seasonCount: 3 })`
3. **Distribution aux Calculators :**
   - `FormCalculator` : filtre `seasonId === target.seasonId` (saison courante uniquement) ;
   - `SeasonStrengthCalculator` : filtre `seasonId === target.seasonId` (saison courante uniquement) ;
   - `HeadToHeadCalculator` : filtre sur les 3 saisons historiques.

### 7.2. Gestion de l'échec partiel ou total
Si l'invocation historique échoue (ou si une saison amont requise renvoie une erreur fatale 4xx/5xx) :
- L'endpoint `/analysis` répond `HTTP 200` avec la liste des matchs programmés intacts.
- `form`, `seasonStrength` et `headToHead` sont simultanément dégradés en statut local **`UNAVAILABLE`**.
- Aucun troisième appel provider ni retry automatique.

---

## 8. Non-Régression des Briques Existantes

1. **Form 5 (Phase 3.2) :** Conservation intégrale des règles (max 5, current season, tri DESC, format V/N/D, dégradation isolée).
2. **Season Strength (Phase 3.3) :** Conservation intégrale des 11 métriques, de la coupure temporelle et du calcul unrounded avec affichage à 2 décimales.
3. **Isolation des Calculators :** Le corpus historique élargi (3 saisons) est filtré de manière étanche par chaque service de domaine. Form 5 et Season Strength ignorent strictement les matchs des saisons N-1 et N-2.
4. **Endpoints HTTP :** `/competitions/:code/matches` reste strictement inchangé. Seul `/analysis` intègre le champ `headToHead`.
5. **Frontend :** Maintien absolu des **9 états globaux**. Le composant H2H applique une dégradation locale.

---

## 9. Stratégie et Plan de Tests Détaillé

### 9.1. Tests Unitaires (`tests/unit/head-to-head-calculator.test.ts`)
- `0 meeting` $\rightarrow$ `INSUFFICIENT_DATA` (sampleSize: 0, metrics: null, seasonsCovered: 0) ;
- `1 meeting` $\rightarrow$ `AVAILABLE` (sampleSize: 1, latestMeetingDate === oldestMeetingDate, seasonsCovered: 1) ;
- `2 meetings` $\rightarrow$ `AVAILABLE` avec dates distinctes ;
- `5 meetings` $\rightarrow$ rétention complète ;
- `>5 meetings` $\rightarrow$ rétention exacte des 5 plus récents ;
- Tri strict par `utcDate DESC` et départage par `id DESC` ;
- Exclusion des matchs postérieurs (`utcDate >= targetDate`) et du match cible ;
- Exclusion des statuts non-`FINISHED` (`SCHEDULED`, `POSTPONED`, `CANCELLED`) ;
- Exclusion des scores incomplets (`fullTime.home === null` ou `fullTime.away === null`) ;
- Exclusion des matchs d'une autre compétition (`competitionId` différent) ;
- Exclusion des matchs n'opposant pas les deux équipes du match cible ;
- Exclusion des matchs au-delà des 3 saisons autorisées (saison N-3 et antérieures) ;
- Calcul exact et indépendant du segment `SAME_VENUE` ;
- Respect strict de tous les invariants de symétrie entre `homeTeam` et `awayTeam` ;
- Immutabilité : absence totale de mutation du tableau `historicalMatches` passé en entrée.

### 9.2. Tests d'Intégration (`tests/integration/analysis.test.ts`)
- Présence du champ `headToHead` conforme au contrat DTO dans chaque entrée de `/analysis` ;
- Vérification du plafond dur : $\le 2$ invocations logiques provider pour 1 ou plusieurs matchs programmés ($O(1)$) ;
- Vérification de la non-régression Form 5 et Season Strength sur corpus multi-saison ;
- Simulation d'échec du flux historique $\rightarrow$ réponse HTTP 200 avec `headToHead`, `form` et `seasonStrength` à `UNAVAILABLE` ;
- Vérification que la route `/competitions/:code/matches` ne contient aucun champ `headToHead`.

### 9.3. Tests Frontend (`tests/frontend/render.test.ts`)
- Rendu DOM de l'état `AVAILABLE` (bilans des équipes, buts, dates extrêmes, segment SAME_VENUE) ;
- Rendu DOM de l'état `INSUFFICIENT_DATA` (message textuel dédié sans faux tableau à zéro) ;
- Rendu DOM de l'état `UNAVAILABLE` (message local sans blocage de l'interface) ;
- Absence totale de valeurs invalides visibles (`undefined`, `null`, `NaN`, `[object Object]`).

---

## 10. Conclusion et Prochaines Étapes

La conception technique DEC-027 établit une solution robuste, déterministe et respectueuse des contraintes budgétaires et architecturales du projet.

**L'implémentation logicielle de la Phase 3.4 débutera uniquement après validation formelle, fusion et audit de la Pull Request associée à DEC-027.**
