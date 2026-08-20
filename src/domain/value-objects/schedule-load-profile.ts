/**
 * Objet de valeur — Profil de Repos & Congestion (Schedule Load).
 * Couche Domain — aucune dépendance externe.
 *
 * Référence : DEC-029 / DEC-030 — Phase 3.5 Repos & Congestion
 */

export interface ScheduleLoadProfile {
  readonly availability: 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';
  readonly daysSinceLastMatch: number | null;
  readonly matchesLast7Days: number | null;
  readonly matchesLast14Days: number | null;
  readonly matchesLast28Days: number | null;
  readonly minimumRestDaysInLast14Days: number | null;
  readonly shortRest: boolean | null;
}
