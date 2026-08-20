/**
 * Objet de valeur — Profil Opponent Context / Contexte d'adversité (DEC-035 / DEC-036 Phase 3.7).
 * Couche Domain — pure, aucune dépendance externe.
 *
 * Décrit le niveau saisonnier des adversaires rencontrés lors des matchs récents (max 5)
 * pour une équipe cible et un match cible donnés.
 *
 * Invariants contractuels (DEC-036) :
 * 1. AVAILABLE si et seulement si evaluatedOpponentSampleSize >= 3 (minimum 3 adversaires DISTINCTS évaluables).
 * 2. INSUFFICIENT_DATA si evaluatedOpponentSampleSize < 3 : sample sizes numériques, tous les agrégats sont à null.
 * 3. UNAVAILABLE si échec du flux historique : sample sizes à null, agrégats à null, opponents = [].
 * 4. Agrégats pondérés par rencontre récente (MATCH_ENTRY_WEIGHTING) : si Beta apparaît 2 fois, il contribue 2 fois.
 * 5. Aucune classification qualitative, aucun score composite de difficulté, aucun badge subjectif.
 */

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
  readonly matchDate: string; // ISO 8601 UTC
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
