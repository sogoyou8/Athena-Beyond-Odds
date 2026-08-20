/**
 * Value Object — Profil Head-to-Head (H2H) contextualisé.
 * Couche Domain — aucune dépendance externe.
 *
 * Représente l'historique des confrontations directes entre deux équipes.
 * Articulé en segment overall (Global) et segment contextual (SAME_VENUE).
 *
 * Référence : DEC-026 / DEC-027 — Phase 3.4 H2H Contextualisé
 */

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
