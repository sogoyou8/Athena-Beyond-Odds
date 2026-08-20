/**
 * Objet de valeur — Résultat d'un match du point de vue d'une équipe.
 * Couche Domain — aucune dépendance externe.
 *
 * Représentation interne neutre (WIN/DRAW/LOSS).
 * Le mappage vers l'UI française (V/N/D) est effectué exclusivement
 * dans la couche de rendu frontend (render.ts).
 *
 * Référence : DEC-018 / DEC-019 — Phase 3.2 Form 5
 */

/**
 * Résultat d'un match du point de vue d'une équipe spécifique.
 * Interne uniquement — ne pas exposer directement dans l'UI.
 */
export type FormResult = 'WIN' | 'DRAW' | 'LOSS';

/**
 * Statut de disponibilité des données de forme d'une équipe.
 *
 * - AVAILABLE        : au moins 1 match FINISHED exploitable dans la saison courante.
 * - INSUFFICIENT_DATA: aucun match FINISHED exploitable (0 résultat valide).
 * - UNAVAILABLE      : erreur technique ou provider lors de la récupération historique.
 */
export type FormAvailability = 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';

/**
 * Forme récente d'une équipe.
 * results contient entre 0 et 5 résultats, triés du plus récent au plus ancien.
 */
export interface TeamForm {
  readonly teamId: string;
  readonly availability: FormAvailability;
  readonly results: readonly FormResult[];
}
