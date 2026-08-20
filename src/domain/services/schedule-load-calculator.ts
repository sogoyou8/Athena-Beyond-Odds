/**
 * Service domaine pur — ScheduleLoadCalculator.
 * Couche Domain — aucune dépendance externe (ni I/O, ni réseau, ni provider, ni cache, ni Date.now()).
 *
 * Calcule les métriques de repos et de congestion calendaire pour une équipe par rapport à un match cible.
 *
 * Règles DEC-029 / DEC-030 :
 * 1. Même compétition (competitionId).
 * 2. Équipe concernée (homeTeam.id ou awayTeam.id).
 * 3. Statut FINISHED uniquement (score fullTime incomplet/null accepté).
 * 4. utcDate < targetMatch.utcDate (strictement antérieur, anti look-ahead).
 * 5. Politique de frontière de saison (SEASON_BOUNDARY_WITH_28_DAY_CARRYOVER) :
 *    - Saison cible (m.seasonId === targetMatch.seasonId) : toujours éligible sans limite 28j.
 *    - Saison précédente immédiate (m.seasonId === PREVIOUS_SEASON_ID) : éligible si targetMatch.utcDate - m.utcDate <= 28j.
 *    - Résolution de PREVIOUS_SEASON_ID : provider-neutral (saison distincte dont le match le plus récent précède immédiatement targetMatch).
 *    - Saisons antérieures (N-2+) : strictement exclues.
 * 6. Sémantique temporelle : périodes complètes de 24h écoulées en UTC pur (floor(diffMs / 86_400_000)).
 * 7. Fenêtres de congestion : [targetDate - N*24h, targetDate[ (borne basse incluse, targetDate exclue) pour N in {7, 14, 28}.
 * 8. minimumRestDaysInLast14Days : minimum des intervalles consécutifs dont le match le plus récent tombe dans J-14.
 * 9. shortRest : boolean si daysSinceLastMatch <= 3, sinon null si daysSinceLastMatch est null.
 * 10. Tri déterministe : utcDate DESC, tie-break Match.id DESC.
 * 11. Zéro mutation d'entrée.
 *
 * Référence : DEC-029 / DEC-030 — Phase 3.5 Repos & Congestion
 */

import { Match } from '../entities/match.js';
import { ScheduleLoadProfile } from '../value-objects/schedule-load-profile.js';

const DAY_MS = 86_400_000;
const WINDOW_7_MS = 7 * DAY_MS;
const WINDOW_14_MS = 14 * DAY_MS;
const WINDOW_28_MS = 28 * DAY_MS;
const CARRYOVER_28_MS = 28 * DAY_MS;
const SHORT_REST_THRESHOLD_DAYS = 3;

export class ScheduleLoadCalculator {
  /**
   * Calcule le profil de repos et congestion pour une équipe par rapport à un match cible.
   *
   * @param teamId            Identifiant stable de l'équipe (ex: 'team-alpha-001')
   * @param targetMatch       Match cible (SCHEDULED) servant de point de repère temporel
   * @param historicalMatches Ensemble des matchs historiques fournis par le provider
   * @returns                 ScheduleLoadProfile
   */
  calculate(
    teamId: string,
    targetMatch: Match,
    historicalMatches: Match[]
  ): ScheduleLoadProfile {
    const targetCompId = targetMatch.competitionId;
    const targetSeasonId = targetMatch.seasonId;
    const targetMs = targetMatch.utcDate.getTime();

    // 1. Filtrer les matchs préliminaires de l'équipe dans la compétition, FINISHED et strictement antérieurs
    const rawTeamMatches = historicalMatches.filter((m) => {
      if (m.competitionId !== targetCompId) return false;
      if (m.status !== 'FINISHED') return false;
      if (m.homeTeam.id !== teamId && m.awayTeam.id !== teamId) return false;
      if (m.utcDate.getTime() >= targetMs) return false;
      return true;
    });

    if (rawTeamMatches.length === 0) {
      return this.buildInsufficientDataProfile();
    }

    // 2. Résolution provider-neutral de PREVIOUS_SEASON_ID
    // On identifie les saisons distinctes du corpus historique (antérieures au targetMatch)
    const previousSeasonId = this.resolvePreviousSeasonId(
      targetCompId,
      targetSeasonId,
      targetMs,
      historicalMatches
    );

    // 3. Filtrage selon la politique de frontière de saison (DEC-029 / DEC-030)
    const eligibleMatches = rawTeamMatches.filter((m) => {
      const matchMs = m.utcDate.getTime();
      // Cas A : même saison que le match cible
      if (m.seasonId === targetSeasonId) {
        return true;
      }
      // Cas B : saison précédente immédiate (N-1) avec carryover <= 28 jours
      if (previousSeasonId !== null && m.seasonId === previousSeasonId) {
        return targetMs - matchMs <= CARRYOVER_28_MS;
      }
      // Cas C : N-2 ou saison antérieure inconnue -> exclu
      return false;
    });

    if (eligibleMatches.length === 0) {
      return this.buildInsufficientDataProfile();
    }

    // 4. Tri déterministe : utcDate DESC, tie-break Match.id DESC
    const sortedDesc = [...eligibleMatches].sort((a, b) => {
      const timeDiff = b.utcDate.getTime() - a.utcDate.getTime();
      if (timeDiff !== 0) return timeDiff;
      return b.id.localeCompare(a.id);
    });

    // 5. Calcul de daysSinceLastMatch (sur le match éligible le plus récent)
    const latestMatch = sortedDesc[0]!;
    const daysSinceLastMatch = Math.floor(
      (targetMs - latestMatch.utcDate.getTime()) / DAY_MS
    );

    // 6. Calcul des fenêtres de congestion (7 / 14 / 28 jours)
    const lowerBound7 = targetMs - WINDOW_7_MS;
    const lowerBound14 = targetMs - WINDOW_14_MS;
    const lowerBound28 = targetMs - WINDOW_28_MS;

    let matchesLast7Days = 0;
    let matchesLast14Days = 0;
    let matchesLast28Days = 0;

    for (const m of sortedDesc) {
      const matchMs = m.utcDate.getTime();
      if (matchMs >= lowerBound7) {
        matchesLast7Days++;
      }
      if (matchMs >= lowerBound14) {
        matchesLast14Days++;
      }
      if (matchMs >= lowerBound28) {
        matchesLast28Days++;
      }
    }

    // 7. Calcul de minimumRestDaysInLast14Days (MINOR-002)
    // On trie les matchs par ordre chronologique ASC
    const sortedAsc = [...sortedDesc].reverse();
    let minRest14: number | null = null;

    for (let i = 1; i < sortedAsc.length; i++) {
      const earlierMatch = sortedAsc[i - 1]!;
      const laterMatch = sortedAsc[i]!;
      const laterMs = laterMatch.utcDate.getTime();

      // Condition MINOR-002 : le match LE PLUS RÉCENT de la paire doit être dans [targetMs - 14j, targetMs[
      if (laterMs >= lowerBound14 && laterMs < targetMs) {
        const diffDays = Math.floor(
          (laterMs - earlierMatch.utcDate.getTime()) / DAY_MS
        );
        if (minRest14 === null || diffDays < minRest14) {
          minRest14 = diffDays;
        }
      }
    }

    // 8. Calcul de shortRest (MINOR-003)
    const shortRest = daysSinceLastMatch <= SHORT_REST_THRESHOLD_DAYS;

    return {
      availability: 'AVAILABLE',
      daysSinceLastMatch,
      matchesLast7Days,
      matchesLast14Days,
      matchesLast28Days,
      minimumRestDaysInLast14Days: minRest14,
      shortRest,
    };
  }

  /**
   * Résout provider-neutre l'identifiant de la saison précédente immédiate (N-1)
   * à partir du corpus historique disponible avant le targetMatch.
   */
  private resolvePreviousSeasonId(
    targetCompId: string,
    targetSeasonId: string,
    targetMs: number,
    historicalMatches: Match[]
  ): string | null {
    // Identifier toutes les saisons distinctes du corpus (autre que targetSeasonId) avant targetMs
    const seasonLatestDateMap = new Map<string, number>();

    for (const m of historicalMatches) {
      if (m.competitionId !== targetCompId) continue;
      if (m.seasonId === targetSeasonId) continue;
      const matchMs = m.utcDate.getTime();
      if (matchMs >= targetMs) continue;

      const currentMax = seasonLatestDateMap.get(m.seasonId) ?? 0;
      if (matchMs > currentMax) {
        seasonLatestDateMap.set(m.seasonId, matchMs);
      }
    }

    if (seasonLatestDateMap.size === 0) {
      return null;
    }

    // La saison précédente immédiate est celle dont le match le plus récent est le plus proche de targetMs
    let previousSeasonId: string | null = null;
    let closestLatestMs = -1;

    for (const [seasonId, latestMs] of seasonLatestDateMap) {
      if (latestMs > closestLatestMs) {
        closestLatestMs = latestMs;
        previousSeasonId = seasonId;
      }
    }

    return previousSeasonId;
  }

  private buildInsufficientDataProfile(): ScheduleLoadProfile {
    return {
      availability: 'INSUFFICIENT_DATA',
      daysSinceLastMatch: null,
      matchesLast7Days: null,
      matchesLast14Days: null,
      matchesLast28Days: null,
      minimumRestDaysInLast14Days: null,
      shortRest: null,
    };
  }
}
