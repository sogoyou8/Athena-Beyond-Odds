/**
 * Service domaine pur — HeadToHeadCalculator.
 * Couche Domain — aucune dépendance externe (ni réseau, ni provider, ni cache, ni Date.now()).
 *
 * Calcule l'historique des confrontations directes (Head-to-Head / H2H) entre les deux équipes d'un match cible.
 *
 * Règles DEC-027 :
 * 1. Même compétition (competitionId).
 * 2. Les deux équipes du match cible doivent participer (homeTeam et awayTeam).
 * 3. Identifiants métier stables (homeTeam.id, awayTeam.id), jamais de matching par nom.
 * 4. Statut FINISHED uniquement.
 * 5. Score fullTime complet (home ET away non-nulls).
 * 6. utcDate < targetMatch.utcDate (strictement antérieur, anti look-ahead).
 * 7. Borné à maximum 3 saisons distinctes (saison cible, N-1, N-2).
 * 8. Segment overall : toutes les confrontations directes éligibles (max 5, tri utcDate DESC puis Match.id DESC).
 * 9. Segment contextual SAME_VENUE : confrontations où target.homeTeam était HOME et target.awayTeam était AWAY (max 5, tri utcDate DESC puis Match.id DESC).
 * 10. Perspectives symétriques (home vs away).
 * 11. sampleSize >= 1 => AVAILABLE (latestMeetingDate, oldestMeetingDate, seasonsCovered >= 1).
 * 12. sampleSize = 0 => INSUFFICIENT_DATA (sampleSize = 0, homeTeam = null, awayTeam = null, dates = null, seasonsCovered = 0).
 * 13. Aucun effet de bord, aucune mutation du tableau d'entrée.
 *
 * Référence : DEC-026 / DEC-027 — Phase 3.4 H2H Contextualisé
 */

import { Match } from '../entities/match.js';
import {
  HeadToHeadPerspective,
  HeadToHeadProfile,
  HeadToHeadSegment,
} from '../value-objects/head-to-head-profile.js';

const MAX_MEETINGS = 5;
const MAX_SEASONS = 3;

export class HeadToHeadCalculator {
  /**
   * Calcule le profil Head-to-Head contextualisé pour un match cible.
   *
   * @param targetMatch       Match cible faisant l'objet de l'analyse.
   * @param historicalMatches Ensemble des matchs historiques fournis par le provider.
   * @returns                 HeadToHeadProfile avec overall et contextual segments.
   */
  calculate(targetMatch: Match, historicalMatches: Match[]): HeadToHeadProfile {
    const targetHomeId = targetMatch.homeTeam.id;
    const targetAwayId = targetMatch.awayTeam.id;
    const targetCompId = targetMatch.competitionId;
    const targetDate = targetMatch.utcDate;

    // 1. Filtrer les matchs éligibles H2H de base (tous critères sauf limitation aux 3 saisons)
    const baseEligible = historicalMatches.filter((m) => {
      // Même compétition uniquement
      if (m.competitionId !== targetCompId) return false;
      // Statut FINISHED uniquement
      if (m.status !== 'FINISHED') return false;
      // Score fullTime complet
      if (m.score.fullTime.home === null || m.score.fullTime.away === null) return false;
      // Strictement antérieur au match cible (anti look-ahead et exclusion du match cible)
      if (m.utcDate >= targetDate) return false;

      // Les deux équipes doivent participer
      const isHomeVsAway = m.homeTeam.id === targetHomeId && m.awayTeam.id === targetAwayId;
      const isAwayVsHome = m.homeTeam.id === targetAwayId && m.awayTeam.id === targetHomeId;
      return isHomeVsAway || isAwayVsHome;
    });

    // 2. Identifier les saisons historiques autorisées (maximum 3 saisons distinctes les plus récentes avant/incluant la saison cible)
    // On trie les matchs éligibles par utcDate DESC pour identifier les saisons dans l'ordre chronologique inverse
    const sortedEligible = [...baseEligible].sort((a, b) => {
      const timeDiff = b.utcDate.getTime() - a.utcDate.getTime();
      if (timeDiff !== 0) return timeDiff;
      return b.id.localeCompare(a.id);
    });

    // Collecter jusqu'à 3 saisons distinctes (en incluant potentiellement la saison cible si présente dans l'historique)
    const allowedSeasonIds = new Set<string>();
    for (const m of sortedEligible) {
      if (allowedSeasonIds.size < MAX_SEASONS) {
        allowedSeasonIds.add(m.seasonId);
      } else if (!allowedSeasonIds.has(m.seasonId)) {
        // Cette saison dépasse le quota des 3 saisons les plus récentes
        break;
      }
    }

    // Filtrer pour ne garder que les matchs appartenant aux 3 saisons autorisées
    const eligibleWithin3Seasons = sortedEligible.filter((m) => allowedSeasonIds.has(m.seasonId));

    // 3. Calcul du segment OVERALL (max 5 confrontations)
    const overallMatches = eligibleWithin3Seasons.slice(0, MAX_MEETINGS);
    const overallSegment = this.buildSegment(targetHomeId, targetAwayId, overallMatches);

    // 4. Calcul du segment CONTEXTUAL SAME_VENUE (max 5 confrontations dans la même configuration de lieu)
    const sameVenueEligible = eligibleWithin3Seasons.filter(
      (m) => m.homeTeam.id === targetHomeId && m.awayTeam.id === targetAwayId
    );
    const sameVenueMatches = sameVenueEligible.slice(0, MAX_MEETINGS);
    const contextualSegment = this.buildSegment(targetHomeId, targetAwayId, sameVenueMatches);

    return {
      overall: overallSegment,
      contextual: {
        venue: 'SAME_VENUE',
        segment: contextualSegment,
      },
    };
  }

  /**
   * Construit un HeadToHeadSegment à partir d'une liste ordonnée de matchs retenus.
   */
  private buildSegment(
    targetHomeId: string,
    targetAwayId: string,
    matches: Match[]
  ): HeadToHeadSegment {
    if (matches.length === 0) {
      return {
        availability: 'INSUFFICIENT_DATA',
        sampleSize: 0,
        homeTeam: null,
        awayTeam: null,
        latestMeetingDate: null,
        oldestMeetingDate: null,
        seasonsCovered: 0,
      };
    }

    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;
    let homeGoals = 0;
    let awayGoals = 0;

    const seasons = new Set<string>();

    for (const m of matches) {
      seasons.add(m.seasonId);

      const isTargetHomeTeamHost = m.homeTeam.id === targetHomeId;
      const hostGoals = m.score.fullTime.home!;
      const guestGoals = m.score.fullTime.away!;

      const targetHomeGoals = isTargetHomeTeamHost ? hostGoals : guestGoals;
      const targetAwayGoals = isTargetHomeTeamHost ? guestGoals : hostGoals;

      homeGoals += targetHomeGoals;
      awayGoals += targetAwayGoals;

      if (targetHomeGoals > targetAwayGoals) {
        homeWins++;
      } else if (targetAwayGoals > targetHomeGoals) {
        awayWins++;
      } else {
        draws++;
      }
    }

    const homeTeamPerspective: HeadToHeadPerspective = {
      teamId: targetHomeId,
      wins: homeWins,
      draws,
      losses: awayWins,
      goalsFor: homeGoals,
      goalsAgainst: awayGoals,
      goalDifference: homeGoals - awayGoals,
    };

    const awayTeamPerspective: HeadToHeadPerspective = {
      teamId: targetAwayId,
      wins: awayWins,
      draws,
      losses: homeWins,
      goalsFor: awayGoals,
      goalsAgainst: homeGoals,
      goalDifference: awayGoals - homeGoals,
    };

    // Puisque matches est trié par utcDate DESC :
    // Le premier élément est le plus récent, le dernier élément est le plus ancien
    const latestMeetingDate = matches[0]!.utcDate;
    const oldestMeetingDate = matches[matches.length - 1]!.utcDate;

    return {
      availability: 'AVAILABLE',
      sampleSize: matches.length,
      homeTeam: homeTeamPerspective,
      awayTeam: awayTeamPerspective,
      latestMeetingDate,
      oldestMeetingDate,
      seasonsCovered: seasons.size,
    };
  }
}
