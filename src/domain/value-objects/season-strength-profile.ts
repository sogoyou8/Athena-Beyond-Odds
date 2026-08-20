/**
 * Objet de valeur — Profil de force saisonnier (Season Strength).
 * Couche Domain — aucune dépendance externe.
 *
 * Contrat DEC-024 :
 * - Métriques factuelles et déterministes sur la saison courante (matchs FINISHED).
 * - Segments overall (global) et contextual (HOME ou AWAY selon le match cible).
 * - Exactement 11 métriques numériques non arrondies dans le Calculator.
 * - Disponibilités indépendantes par segment (AVAILABLE, INSUFFICIENT_DATA, UNAVAILABLE).
 * - Aucun ranking, aucun score synthétique, aucune prédiction, aucune cote.
 *
 * Référence : DEC-023 / DEC-024 — Phase 3.3 Season Strength
 */

/**
 * Statut de disponibilité d'un segment de force saisonnière.
 */
export type SeasonStrengthAvailability = 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';

/**
 * Métriques factuelles du profil de force saisonnier (exactement 11 champs).
 */
export interface SeasonStrengthMetrics {
  readonly played: number;
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly points: number;
  readonly pointsPerMatch: number;
  readonly goalsFor: number;
  readonly goalsAgainst: number;
  readonly goalDifference: number;
  readonly goalsForPerMatch: number;
  readonly goalsAgainstPerMatch: number;
}

/**
 * Segment de force saisonnière (union discriminée sur availability).
 */
export type SeasonStrengthSegment =
  | {
      readonly availability: 'AVAILABLE';
      readonly sampleSize: number; // >= 1, égal à metrics.played
      readonly metrics: SeasonStrengthMetrics;
    }
  | {
      readonly availability: 'INSUFFICIENT_DATA';
      readonly sampleSize: 0;
      readonly metrics: null;
    }
  | {
      readonly availability: 'UNAVAILABLE';
      readonly sampleSize: null;
      readonly metrics: null;
    };

/**
 * Segment contextualisé selon le rôle dans la rencontre cible (HOME ou AWAY).
 */
export interface ContextualSeasonStrength {
  readonly venue: 'HOME' | 'AWAY';
  readonly segment: SeasonStrengthSegment;
}

/**
 * Profil de force saisonnier complet d'une équipe pour un match cible.
 */
export interface SeasonStrengthProfile {
  readonly teamId: string;
  readonly overall: SeasonStrengthSegment;
  readonly contextual: ContextualSeasonStrength;
}
