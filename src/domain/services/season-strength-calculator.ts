/**
 * Service domaine pur — SeasonStrengthCalculator.
 * Couche Domain — aucune dépendance externe (ni réseau, ni provider, ni cache, ni process.env).
 *
 * Calcule le profil de force saisonnier (Season Strength) d'une équipe pour un match cible.
 *
 * Règles DEC-024 :
 * 1. Même équipe (homeTeam.id ou awayTeam.id).
 * 2. Même compétition (competitionId).
 * 3. Même saison (seasonId).
 * 4. Statut FINISHED uniquement.
 * 5. Score fullTime home ET away non-null.
 * 6. utcDate < targetDate (strictement antérieur — match cible strictement exclu, anti look-ahead).
 * 7. Segment overall : tous les matchs éligibles (domicile + extérieur).
 * 8. Segment contextual : uniquement les matchs éligibles correspondant au venue du match cible (HOME ou AWAY).
 * 9. Exactement 11 métriques calculées : played, wins, draws, losses, points, pointsPerMatch, goalsFor, goalsAgainst, goalDifference, goalsForPerMatch, goalsAgainstPerMatch.
 * 10. Barème football classique : Victoire = 3, Nul = 1, Défaite = 0.
 * 11. Aucun arrondi interne (calculs exacts en nombres à virgule flottante).
 * 12. Disponibilités indépendantes : 0 match = INSUFFICIENT_DATA (sampleSize = 0, metrics = null), >= 1 match = AVAILABLE (sampleSize = played, metrics = {...}).
 * 13. Déterministe et insensible à l'ordre du tableau d'entrée.
 *
 * Référence : DEC-023 / DEC-024 — Phase 3.3 Season Strength
 */

import { Match } from '../entities/match.js';
import {
  SeasonStrengthMetrics,
  SeasonStrengthProfile,
  SeasonStrengthSegment,
} from '../value-objects/season-strength-profile.js';

export class SeasonStrengthCalculator {
  /**
   * Calcule le profil de force saisonnier complet d'une équipe.
   *
   * @param teamId        Identifiant de l'équipe cible.
   * @param targetDate    Date UTC du match cible. Seuls les matchs dont utcDate < targetDate sont pris en compte.
   * @param venue         Rôle de l'équipe dans le match cible ('HOME' ou 'AWAY').
   * @param competitionId Identifiant de la compétition.
   * @param seasonId      Identifiant de la saison courante.
   * @param history       Ensemble des matchs historiques fournis par le provider (tous statuts confondus).
   * @returns             SeasonStrengthProfile avec overall et contextual segments.
   */
  calculate(
    teamId: string,
    targetDate: Date,
    venue: 'HOME' | 'AWAY',
    competitionId: string,
    seasonId: string,
    history: Match[]
  ): SeasonStrengthProfile {
    // 1. Filtrer l'ensemble des matchs éligibles pour l'équipe sur la saison avant targetDate
    const eligibleMatches = history.filter((m) => {
      // Même compétition
      if (m.competitionId !== competitionId) return false;
      // Même saison
      if (m.seasonId !== seasonId) return false;
      // Statut FINISHED uniquement
      if (m.status !== 'FINISHED') return false;
      // Score fullTime complet
      if (m.score.fullTime.home === null || m.score.fullTime.away === null) return false;
      // L'équipe cible doit participer au match
      if (m.homeTeam.id !== teamId && m.awayTeam.id !== teamId) return false;
      // Strictement antérieur à targetDate (match cible exclu, anti look-ahead)
      if (m.utcDate >= targetDate) return false;
      return true;
    });

    // 2. Calculer le segment overall (tous les matchs éligibles)
    const overall = this.computeSegment(teamId, eligibleMatches);

    // 3. Filtrer pour le segment contextualisé (HOME ou AWAY selon le match cible)
    const contextualMatches = eligibleMatches.filter((m) => {
      if (venue === 'HOME') {
        return m.homeTeam.id === teamId;
      } else {
        return m.awayTeam.id === teamId;
      }
    });

    // 4. Calculer le segment contextual
    const contextualSegment = this.computeSegment(teamId, contextualMatches);

    return {
      teamId,
      overall,
      contextual: {
        venue,
        segment: contextualSegment,
      },
    };
  }

  /**
   * Calcule un segment de métriques à partir d'une liste de matchs éligibles.
   */
  private computeSegment(teamId: string, matches: Match[]): SeasonStrengthSegment {
    if (matches.length === 0) {
      return {
        availability: 'INSUFFICIENT_DATA',
        sampleSize: 0,
        metrics: null,
      };
    }

    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    for (const m of matches) {
      const homeGoals = m.score.fullTime.home as number;
      const awayGoals = m.score.fullTime.away as number;
      const isHome = m.homeTeam.id === teamId;

      const teamGoals = isHome ? homeGoals : awayGoals;
      const opponentGoals = isHome ? awayGoals : homeGoals;

      goalsFor += teamGoals;
      goalsAgainst += opponentGoals;

      if (teamGoals > opponentGoals) {
        wins++;
      } else if (teamGoals < opponentGoals) {
        losses++;
      } else {
        draws++;
      }
    }

    const played = wins + draws + losses;
    const points = wins * 3 + draws;
    const pointsPerMatch = points / played;
    const goalDifference = goalsFor - goalsAgainst;
    const goalsForPerMatch = goalsFor / played;
    const goalsAgainstPerMatch = goalsAgainst / played;

    const metrics: SeasonStrengthMetrics = {
      played,
      wins,
      draws,
      losses,
      points,
      pointsPerMatch,
      goalsFor,
      goalsAgainst,
      goalDifference,
      goalsForPerMatch,
      goalsAgainstPerMatch,
    };

    return {
      availability: 'AVAILABLE',
      sampleSize: played,
      metrics,
    };
  }
}
