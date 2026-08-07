/**
 * Objet de valeur — Statut d'un match.
 * Couche Domain — aucune dépendance externe.
 */

export type MatchStatus =
  | 'SCHEDULED'
  | 'LIVE'
  | 'FINISHED'
  | 'POSTPONED'
  | 'CANCELLED';
