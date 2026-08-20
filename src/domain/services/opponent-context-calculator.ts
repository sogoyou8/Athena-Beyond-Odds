/**
 * Service de domaine pur — OpponentContextCalculator (DEC-035 / DEC-036 Phase 3.7).
 * Couche Domain — pure, synchrone, déterministe, sans I/O ni dépendance réseau.
 *
 * Calcule le profil d'adversité (Opponent Context) des $\le 5$ matchs récents d'une équipe cible.
 *
 * Principes et règles contractuelles (DEC-036) :
 * 1. Sélection $\le 5$ matchs récents de l'équipe cible : même compétition, même saison cible, FINISHED,
 *    score fullTime complet, utcDate < targetMatch.utcDate, tri utcDate DESC puis Match.id DESC sur copie.
 * 2. Dérivation de l'adversaire et de son rôle (opponentVenue HOME/AWAY) par comparaison stricte d'identifiants.
 * 3. Une entry par rencontre récente ($\le 5$ entries, doublons conservés en entries et pondérés à part égale dans les agrégats).
 * 4. Profils overall et contextuel de chaque adversaire évalués à la date du targetMatch (utcDate < targetMatch.utcDate).
 *    La rencontre récente elle-même est incluse dans le profil de l'adversaire.
 * 5. Seuil de disponibilité : minimum 3 adversaires DISTINCTS évaluables (evaluatedOpponentSampleSize >= 3).
 *    Si < 3 distincts : INSUFFICIENT_DATA (sample sizes numériques, 4 agrégats à null).
 * 6. Zéro arrondi interne dans le domaine (nombres flottants exacts).
 * 7. Zéro mutation des structures d'entrée.
 */

import { Match } from '../entities/match.js';
import {
  OpponentContextEntry,
  OpponentContextMetrics,
  OpponentContextProfile,
  OpponentVenue,
} from '../value-objects/opponent-context-profile.js';

export interface OpponentContextCalculationInput {
  readonly targetMatch: Match;
  readonly targetTeamId: string;
  readonly historyByTeam: ReadonlyMap<string, readonly Match[]>;
}

export class OpponentContextCalculator {
  /**
   * Calcule le profil Opponent Context pour une équipe cible et un match cible donnés.
   */
  public calculate(input: OpponentContextCalculationInput): OpponentContextProfile {
    const { targetMatch, targetTeamId, historyByTeam } = input;
    const targetCompId = targetMatch.competitionId;
    const targetSeasonId = targetMatch.seasonId;
    const targetCutoffMs = targetMatch.utcDate.getTime();

    // 1. Récupérer l'historique de l'équipe cible et filtrer les matchs récents éligibles
    const targetHistory = historyByTeam.get(targetTeamId) ?? [];
    const eligibleRecentMatches: Match[] = [];

    for (const m of targetHistory) {
      if (m.competitionId !== targetCompId) continue;
      if (m.seasonId !== targetSeasonId) continue;
      if (m.status !== 'FINISHED') continue;
      if (
        m.score.fullTime.home === null ||
        m.score.fullTime.away === null ||
        typeof m.score.fullTime.home !== 'number' ||
        typeof m.score.fullTime.away !== 'number'
      ) {
        continue;
      }
      if (m.utcDate.getTime() >= targetCutoffMs) continue;
      if (m.homeTeam.id !== targetTeamId && m.awayTeam.id !== targetTeamId) continue;

      eligibleRecentMatches.push(m);
    }

    // Si aucun match récent éligible -> INSUFFICIENT_DATA
    if (eligibleRecentMatches.length === 0) {
      return {
        availability: 'INSUFFICIENT_DATA',
        recentMatchSampleSize: 0,
        evaluatedOpponentSampleSize: 0,
        contextualSampleSize: 0,
        averageOpponentPointsPerMatch: null,
        averageOpponentGoalDifferencePerMatch: null,
        averageContextualOpponentPointsPerMatch: null,
        averageContextualOpponentGoalDifferencePerMatch: null,
        opponents: [],
      };
    }

    // 2. Tri déterministe sur copie : utcDate DESC puis Match.id DESC
    eligibleRecentMatches.sort((a, b) => {
      const timeDiff = b.utcDate.getTime() - a.utcDate.getTime();
      if (timeDiff !== 0) return timeDiff;
      return b.id.localeCompare(a.id);
    });

    // Conserver au maximum 5 rencontres récentes
    const topRecentMatches = eligibleRecentMatches.slice(0, 5);
    const recentMatchSampleSize = topRecentMatches.length;

    // 3. Construire les entries individuelles d'adversaires
    const entries: OpponentContextEntry[] = [];
    const distinctOpponentTeamIds = new Set<string>();

    for (const recentMatch of topRecentMatches) {
      const isTargetHome = recentMatch.homeTeam.id === targetTeamId;
      const opponentTeam = isTargetHome ? recentMatch.awayTeam : recentMatch.homeTeam;
      const opponentVenue: OpponentVenue = isTargetHome ? 'AWAY' : 'HOME';

      // Récupérer tous les matchs de l'adversaire avant le cutoff du targetMatch
      const opponentHistory = historyByTeam.get(opponentTeam.id) ?? [];
      const opponentEligibleMatches: Match[] = [];

      for (const om of opponentHistory) {
        if (om.competitionId !== targetCompId) continue;
        if (om.seasonId !== targetSeasonId) continue;
        if (om.status !== 'FINISHED') continue;
        if (
          om.score.fullTime.home === null ||
          om.score.fullTime.away === null ||
          typeof om.score.fullTime.home !== 'number' ||
          typeof om.score.fullTime.away !== 'number'
        ) {
          continue;
        }
        if (om.utcDate.getTime() >= targetCutoffMs) continue;
        if (om.homeTeam.id !== opponentTeam.id && om.awayTeam.id !== opponentTeam.id) continue;

        opponentEligibleMatches.push(om);
      }

      // Calcul du profil Overall de l'adversaire
      const overall = this.computeMetrics(opponentTeam.id, opponentEligibleMatches);

      // Calcul du profil Contextuel de l'adversaire (selon opponentVenue dans la rencontre)
      const contextualMatches = opponentEligibleMatches.filter((om) => {
        if (opponentVenue === 'HOME') {
          return om.homeTeam.id === opponentTeam.id;
        } else {
          return om.awayTeam.id === opponentTeam.id;
        }
      });
      const contextual = this.computeMetrics(opponentTeam.id, contextualMatches);

      if (overall.sampleSize >= 1) {
        distinctOpponentTeamIds.add(opponentTeam.id);
      }

      entries.push({
        recentMatchId: recentMatch.id,
        opponentTeamId: opponentTeam.id,
        opponentTeamName: opponentTeam.name,
        matchDate: recentMatch.utcDate.toISOString(),
        opponentVenue,
        overall,
        contextual,
      });
    }

    const evaluatedOpponentSampleSize = distinctOpponentTeamIds.size;
    const contextualSampleSize = entries.length;

    // 4. Seuil de disponibilité : minimum 3 adversaires DISTINCTS évaluables
    if (evaluatedOpponentSampleSize < 3) {
      return {
        availability: 'INSUFFICIENT_DATA',
        recentMatchSampleSize,
        evaluatedOpponentSampleSize,
        contextualSampleSize,
        averageOpponentPointsPerMatch: null,
        averageOpponentGoalDifferencePerMatch: null,
        averageContextualOpponentPointsPerMatch: null,
        averageContextualOpponentGoalDifferencePerMatch: null,
        opponents: entries,
      };
    }

    // 5. Calcul des agrégats avec pondération par match-entry (MATCH_ENTRY_WEIGHTING)
    let sumOverallPpm = 0;
    let sumOverallGdm = 0;
    let sumContextualPpm = 0;
    let sumContextualGdm = 0;

    for (const entry of entries) {
      sumOverallPpm += entry.overall.pointsPerMatch;
      sumOverallGdm += entry.overall.goalDifferencePerMatch;
      sumContextualPpm += entry.contextual.pointsPerMatch;
      sumContextualGdm += entry.contextual.goalDifferencePerMatch;
    }

    const count = entries.length;
    const averageOpponentPointsPerMatch = sumOverallPpm / count;
    const averageOpponentGoalDifferencePerMatch = sumOverallGdm / count;
    const averageContextualOpponentPointsPerMatch = sumContextualPpm / count;
    const averageContextualOpponentGoalDifferencePerMatch = sumContextualGdm / count;

    return {
      availability: 'AVAILABLE',
      recentMatchSampleSize,
      evaluatedOpponentSampleSize,
      contextualSampleSize,
      averageOpponentPointsPerMatch,
      averageOpponentGoalDifferencePerMatch,
      averageContextualOpponentPointsPerMatch,
      averageContextualOpponentGoalDifferencePerMatch,
      opponents: entries,
    };
  }

  /**
   * Calcule les métriques synthétiques (sampleSize, pointsPerMatch, goalDifferencePerMatch)
   * du point de vue d'une équipe pour une liste de matchs donnés.
   */
  private computeMetrics(teamId: string, matches: readonly Match[]): OpponentContextMetrics {
    const sampleSize = matches.length;
    if (sampleSize === 0) {
      return {
        sampleSize: 0,
        pointsPerMatch: 0,
        goalDifferencePerMatch: 0,
      };
    }

    let totalPoints = 0;
    let totalGoalsFor = 0;
    let totalGoalsAgainst = 0;

    for (const m of matches) {
      const isHome = m.homeTeam.id === teamId;
      const goalsFor = isHome
        ? (m.score.fullTime.home as number)
        : (m.score.fullTime.away as number);
      const goalsAgainst = isHome
        ? (m.score.fullTime.away as number)
        : (m.score.fullTime.home as number);

      totalGoalsFor += goalsFor;
      totalGoalsAgainst += goalsAgainst;

      if (goalsFor > goalsAgainst) {
        totalPoints += 3;
      } else if (goalsFor === goalsAgainst) {
        totalPoints += 1;
      }
      // défaite => 0 point
    }

    const pointsPerMatch = totalPoints / sampleSize;
    const goalDifferencePerMatch = (totalGoalsFor - totalGoalsAgainst) / sampleSize;

    return {
      sampleSize,
      pointsPerMatch,
      goalDifferencePerMatch,
    };
  }
}
