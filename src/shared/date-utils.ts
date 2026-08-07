/**
 * Utilitaires de dates UTC partagés — Athena Beyond Odds.
 *
 * PHASE 2.12 — Hardening minimal (DEC-010.2).
 *
 * Fonctions pures pour le formatage et le calcul de plages temporelles UTC.
 * Aucune mutation des objets Date reçus. Aucune lecture de l'heure système.
 */

/**
 * Produit une chaîne au format "YYYY-MM-DD" en utilisant uniquement les composantes UTC.
 *
 * @param date Objet Date d'entrée (non muté)
 * @returns Chaîne "YYYY-MM-DD" en UTC
 */
export function formatUtcDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retourne une nouvelle instance de Date ajustée d'un nombre de jours calendaires UTC.
 *
 * @param date Objet Date d'origine (non muté)
 * @param days Nombre de jours à ajouter (peut être négatif ou nul)
 * @returns Nouvelle instance de Date
 */
export function addUtcDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}
