/**
 * Objet de valeur — Score d'un match.
 * Couche Domain — aucune dépendance externe.
 */

export interface Score {
  readonly halfTime: {
    readonly home: number | null;
    readonly away: number | null;
  };
  readonly fullTime: {
    readonly home: number | null;
    readonly away: number | null;
  };
  readonly extraTime?: {
    readonly home: number | null;
    readonly away: number | null;
  };
  readonly penalties?: {
    readonly home: number | null;
    readonly away: number | null;
  };
}
