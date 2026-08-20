/**
 * Service domaine pur — FormCalculator.
 * Couche Domain — aucune dépendance externe (ni réseau, ni provider, ni cache).
 *
 * Calcule la forme récente (Form 5) d'une équipe à partir d'un historique de matchs.
 *
 * Règles DEC-019 :
 * 1. Même équipe (homeTeam.id ou awayTeam.id).
 * 2. Même compétition (competitionId).
 * 3. Même saison (seasonId).
 * 4. Statut FINISHED uniquement.
 * 5. Score fullTime home ET away tous les deux non-null.
 * 6. utcDate < targetDate (strictement antérieur — protection look-ahead).
 * 7. Tri utcDate DESC ; tie-break id DESC (stable et déterministe).
 * 8. Maximum 5 résultats retenus.
 * 9. Résultat calculé du point de vue de l'équipe cible (domicile ou extérieur).
 * 10. Représentation interne : WIN / DRAW / LOSS.
 *
 * Référence : DEC-018 / DEC-019 — Phase 3.2 Form 5
 */

import { Match } from '../entities/match.js';
import { FormResult, TeamForm } from '../value-objects/form-result.js';

export class FormCalculator {
  /**
   * Calcule la forme récente d'une équipe.
   *
   * @param teamId        Identifiant de l'équipe cible.
   * @param targetDate    Date du match cible (as-of date). Seuls les matchs
   *                      dont utcDate < targetDate sont pris en compte.
   * @param competitionId Identifiant de la compétition.
   * @param seasonId      Identifiant de la saison courante.
   * @param history       Ensemble des matchs historiques normalisés fournis par
   *                      le provider (tous statuts confondus).
   * @returns             TeamForm avec 0 à 5 résultats triés du plus récent au plus ancien.
   */
  calculate(
    teamId: string,
    targetDate: Date,
    competitionId: string,
    seasonId: string,
    history: Match[]
  ): TeamForm {
    // 1. Filtrer les matchs éligibles
    const eligible = history.filter((m) => {
      // Même compétition
      if (m.competitionId !== competitionId) return false;
      // Même saison
      if (m.seasonId !== seasonId) return false;
      // Statut FINISHED
      if (m.status !== 'FINISHED') return false;
      // Score fullTime complet
      if (m.score.fullTime.home === null || m.score.fullTime.away === null) return false;
      // L'équipe cible doit être domicile ou extérieur
      if (m.homeTeam.id !== teamId && m.awayTeam.id !== teamId) return false;
      // utcDate strictement antérieure à targetDate (anti look-ahead)
      if (m.utcDate >= targetDate) return false;
      return true;
    });

    // 2. Tri utcDate DESC ; tie-break id DESC (déterministe)
    eligible.sort((a, b) => {
      const timeDiff = b.utcDate.getTime() - a.utcDate.getTime();
      if (timeDiff !== 0) return timeDiff;
      // Tie-break : id DESC (string comparison suffisante car format homogène)
      return b.id > a.id ? 1 : b.id < a.id ? -1 : 0;
    });

    // 3. Prendre au maximum 5
    const top5 = eligible.slice(0, 5);

    // 4. Calculer le résultat du point de vue de l'équipe cible
    const results: FormResult[] = top5.map((m) => {
      const homeGoals = m.score.fullTime.home as number;
      const awayGoals = m.score.fullTime.away as number;
      const isHome = m.homeTeam.id === teamId;
      const teamGoals = isHome ? homeGoals : awayGoals;
      const opponentGoals = isHome ? awayGoals : homeGoals;

      if (teamGoals > opponentGoals) return 'WIN';
      if (teamGoals < opponentGoals) return 'LOSS';
      return 'DRAW';
    });

    return {
      teamId,
      availability: results.length > 0 ? 'AVAILABLE' : 'INSUFFICIENT_DATA',
      results,
    };
  }
}
