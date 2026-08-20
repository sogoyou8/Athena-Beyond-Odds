/**
 * Service de domaine — Calculateur de Momentum / Dynamique récente (DEC-032 / DEC-033 Phase 3.6).
 * Couche Domaine — pur, synchrone, déterministe, sans I/O ni dépendance réseau.
 *
 * Principes et règles contractuelles :
 * - Compare deux fenêtres consécutives de taille strictement égale (RECENT vs PREVIOUS).
 * - Fenêtres adaptatives : 3v3 (6-7 matchs), 4v4 (8-9 matchs), 5v5 (>= 10 matchs).
 * - Moins de 6 matchs éligibles => INSUFFICIENT_DATA (champs à null, 0 faux zéro).
 * - Étanchéité de saison : TARGET_SEASON_ONLY (aucun carryover N-1, N-1 et N-2 exclus).
 * - Matchs FINISHED uniquement, avec score fullTime complet obligatoire (pas de score synthétisé).
 * - Coupure temporelle stricte : match.utcDate < targetMatch.utcDate (même timestamp exclu).
 * - Tri déterministe : utcDate DESC puis Match.id DESC sur copie (aucune mutation du tableau d'entrée).
 * - Zéro score composite (pas de momentumScore), zéro classification qualitative arbitraire (pas de UP/DOWN).
 */

import { Match } from '../entities/match.js';
import { MatchStatus } from '../value-objects/match-status.js';
import {
  MomentumProfile,
  MomentumWindow,
} from '../value-objects/momentum-profile.js';

export class MomentumCalculator {
  /**
   * Calcule le profil de dynamique récente (Momentum) pour une équipe donnée sur un match cible.
   *
   * @param teamId Identifiant de l'équipe cible
   * @param targetMatch Match cible définissant la compétition, la saison cible et la coupure temporelle
   * @param historicalMatches Ensemble des matchs historiques de la compétition
   */
  calculate(
    teamId: string,
    targetMatch: Match,
    historicalMatches: readonly Match[]
  ): MomentumProfile {
    // 1. Filtrage d'éligibilité locale stricte
    const eligibleMatches: Match[] = [];

    for (const m of historicalMatches) {
      // a) Saison cible uniquement (TARGET_SEASON_ONLY)
      if (m.seasonId !== targetMatch.seasonId) {
        continue;
      }

      // b) Statut terminé obligatoire
      if (m.status !== 'FINISHED') {
        continue;
      }

      // c) Coupure temporelle stricte (antérieur strict au targetMatch)
      if (m.utcDate.getTime() >= targetMatch.utcDate.getTime()) {
        continue;
      }

      // d) Concerne l'équipe cible
      if (m.homeTeam.id !== teamId && m.awayTeam.id !== teamId) {
        continue;
      }

      // e) Score fullTime complet obligatoire
      if (
        m.score.fullTime.home === null ||
        m.score.fullTime.away === null ||
        typeof m.score.fullTime.home !== 'number' ||
        typeof m.score.fullTime.away !== 'number'
      ) {
        continue;
      }

      eligibleMatches.push(m);
    }

    // 2. Vérification du seuil minimal (minimum 6 matchs éligibles pour 3v3)
    const eligibleCount = eligibleMatches.length;
    if (eligibleCount < 6) {
      return {
        availability: 'INSUFFICIENT_DATA',
        windowSize: null,
        recent: null,
        previous: null,
        pointsPerMatchDelta: null,
        goalDifferencePerMatchDelta: null,
      };
    }

    // 3. Tri déterministe sur copie : utcDate DESC puis Match.id DESC
    eligibleMatches.sort((a, b) => {
      const timeDiff = b.utcDate.getTime() - a.utcDate.getTime();
      if (timeDiff !== 0) {
        return timeDiff;
      }
      return b.id.localeCompare(a.id);
    });

    // 4. Calcul de la taille de fenêtre adaptative : min(5, floor(eligibleCount / 2))
    const windowSize = Math.min(5, Math.floor(eligibleCount / 2));

    // 5. Découpage en deux fenêtres adjacentes d'égale taille sans chevauchement
    const recentMatches = eligibleMatches.slice(0, windowSize);
    const previousMatches = eligibleMatches.slice(windowSize, windowSize * 2);

    // 6. Calcul des métriques par fenêtre
    const recent = this.calculateWindowMetrics(teamId, recentMatches, windowSize);
    const previous = this.calculateWindowMetrics(
      teamId,
      previousMatches,
      windowSize
    );

    // 7. Calcul des deltas descriptifs (recent - previous)
    const pointsPerMatchDelta = recent.pointsPerMatch - previous.pointsPerMatch;
    const goalDifferencePerMatchDelta =
      recent.goalDifferencePerMatch - previous.goalDifferencePerMatch;

    return {
      availability: 'AVAILABLE',
      windowSize,
      recent,
      previous,
      pointsPerMatchDelta,
      goalDifferencePerMatchDelta,
    };
  }

  /**
   * Calcule les moyennes de points, buts pour, buts contre et différence de buts sur une fenêtre.
   */
  private calculateWindowMetrics(
    teamId: string,
    matches: readonly Match[],
    sampleSize: number
  ): MomentumWindow {
    let totalPoints = 0;
    let totalGoalsFor = 0;
    let totalGoalsAgainst = 0;

    for (const m of matches) {
      const isHome = m.homeTeam.id === teamId;
      const goalsFor = isHome
        ? m.score.fullTime.home!
        : m.score.fullTime.away!;
      const goalsAgainst = isHome
        ? m.score.fullTime.away!
        : m.score.fullTime.home!;

      totalGoalsFor += goalsFor;
      totalGoalsAgainst += goalsAgainst;

      if (goalsFor > goalsAgainst) {
        totalPoints += 3;
      } else if (goalsFor === goalsAgainst) {
        totalPoints += 1;
      }
      // loss => 0 points
    }

    const pointsPerMatch = totalPoints / sampleSize;
    const goalsForPerMatch = totalGoalsFor / sampleSize;
    const goalsAgainstPerMatch = totalGoalsAgainst / sampleSize;
    const goalDifferencePerMatch =
      (totalGoalsFor - totalGoalsAgainst) / sampleSize;

    return {
      sampleSize,
      pointsPerMatch,
      goalsForPerMatch,
      goalsAgainstPerMatch,
      goalDifferencePerMatch,
    };
  }
}
