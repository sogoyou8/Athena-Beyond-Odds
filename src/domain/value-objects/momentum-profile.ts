/**
 * Value-Object — Profil de Momentum / Dynamique récente (DEC-032 / DEC-033 Phase 3.6).
 * Couche Domaine — pur, sans dépendance externe.
 */

export type MomentumAvailability =
  | 'AVAILABLE'
  | 'INSUFFICIENT_DATA'
  | 'UNAVAILABLE';

export interface MomentumWindow {
  readonly sampleSize: number;
  readonly pointsPerMatch: number;
  readonly goalsForPerMatch: number;
  readonly goalsAgainstPerMatch: number;
  readonly goalDifferencePerMatch: number;
}

export interface MomentumProfile {
  readonly availability: MomentumAvailability;
  readonly windowSize: number | null;
  readonly recent: MomentumWindow | null;
  readonly previous: MomentumWindow | null;
  readonly pointsPerMatchDelta: number | null;
  readonly goalDifferencePerMatchDelta: number | null;
}
