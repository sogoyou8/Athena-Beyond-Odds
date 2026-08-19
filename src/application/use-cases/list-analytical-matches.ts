/**
 * Cas d'usage — Lister les matchs analytiques avec Form 5.
 * Couche Application — dépend uniquement du domaine et du port.
 *
 * Fournit pour chaque match programmé de la compétition :
 * - Les informations du match ;
 * - La Form 5 de l'équipe domicile ;
 * - La Form 5 de l'équipe extérieure.
 *
 * Stratégie anti N+1 (DEC-019.9) :
 * 1. Récupération principale : `provider.getMatches(competitionCode)` pour obtenir les matchs programmés.
 * 2. Récupération historique : 1 SEULE requête mutualisée `provider.getMatches(competitionCode, seasonStartDate, maxTargetDate)`
 *    déterminée dynamiquement à partir des bornes réelles de la saison courante contenue dans les matchs programmés.
 *    Aucune récupération par équipe ou par carte n'est effectuée (0 N+1).
 *
 * Dégradation gracieuse (DEC-019.8 / M-002) :
 * Si la récupération historique échoue (ex: exception provider), la récupération principale est conservée.
 * Chaque Form d'équipe est marquée `UNAVAILABLE` avec un tableau `results: []`.
 * Le Match Center reste disponible et retourne HTTP 200 avec les matchs programmés.
 *
 * Référence : DEC-018 / DEC-019 — Phase 3.2 Form 5
 */

import { SportsDataProvider } from '../ports/sports-data-provider.js';
import { Match } from '../../domain/entities/match.js';
import { TeamForm } from '../../domain/value-objects/form-result.js';
import { FormCalculator } from '../../domain/services/form-calculator.js';
import { CompetitionNotAvailableError } from './list-scheduled-matches.js';

// ---------------------------------------------------------------------------
// Types de résultat
// ---------------------------------------------------------------------------

export interface AnalyticalMatchEntry {
  match: Match;
  form: {
    home: TeamForm;
    away: TeamForm;
  };
}

export interface AnalyticalMatchesResult {
  competitionCode: string;
  matches: AnalyticalMatchEntry[];
}

// ---------------------------------------------------------------------------
// Cas d'usage
// ---------------------------------------------------------------------------

export class ListAnalyticalMatchesUseCase {
  private readonly calculator = new FormCalculator();

  constructor(private readonly provider: SportsDataProvider) {}

  /**
   * Retourne les matchs SCHEDULED enrichis de Form 5 pour la compétition demandée.
   *
   * @param competitionCode Code de compétition normalisé (seul "FL1" est accepté)
   * @throws CompetitionNotAvailableError si le code n'est pas "FL1"
   */
  async execute(competitionCode: string): Promise<AnalyticalMatchesResult> {
    if (competitionCode !== 'FL1') {
      throw new CompetitionNotAvailableError(competitionCode);
    }

    // -----------------------------------------------------------------------
    // Étape 1 : Récupération principale (matchs à afficher)
    // -----------------------------------------------------------------------
    const primaryMatches = await this.provider.getMatches(competitionCode);
    const scheduledMatches = primaryMatches.filter((m) => m.status === 'SCHEDULED');

    if (scheduledMatches.length === 0) {
      return { competitionCode, matches: [] };
    }

    // -----------------------------------------------------------------------
    // Étape 2 : Déterminer dynamiquement les bornes de saison à partir des matchs
    // - seasonStart: 1er juillet UTC de l'année de début de la saison courante (ex: 2099-07-01 pour 2099-2100)
    // - maxTargetDate: date max du match cible le plus éloigné
    // -----------------------------------------------------------------------
    let historicalMatches: Match[] | null = null;

    try {
      // Trouver la date minimale / maximale des matchs et déterminer l'année de saison
      const earliestScheduledDate = new Date(
        Math.min(...scheduledMatches.map((m) => m.utcDate.getTime()))
      );
      const latestScheduledDate = new Date(
        Math.max(...scheduledMatches.map((m) => m.utcDate.getTime()))
      );

      // Année de départ de saison : si le match est en juillet ou après -> même année, sinon année précédente
      const year = earliestScheduledDate.getUTCMonth() >= 6
        ? earliestScheduledDate.getUTCFullYear()
        : earliestScheduledDate.getUTCFullYear() - 1;

      const seasonStartDate = new Date(Date.UTC(year, 6, 1, 0, 0, 0, 0)); // 1er juillet UTC

      // Récupération historique MUTUALISÉE (1 seul appel provider) avec bornes explicites (M-001)
      historicalMatches = await this.provider.getMatches(
        competitionCode,
        seasonStartDate,
        latestScheduledDate
      );
    } catch {
      // M-002: Isolement dégradation gracieuse. Si l'appel historique échoue, historicalMatches reste null.
      historicalMatches = null;
    }

    // -----------------------------------------------------------------------
    // Étape 3 : Calculer Form 5 pour chaque match SCHEDULED
    // Si l'historique est indisponible (historicalMatches === null), statut = UNAVAILABLE.
    // -----------------------------------------------------------------------
    const entries: AnalyticalMatchEntry[] = scheduledMatches.map((match) => {
      let homeForm: TeamForm;
      let awayForm: TeamForm;

      if (historicalMatches !== null) {
        homeForm = this.calculator.calculate(
          match.homeTeam.id,
          match.utcDate,
          match.competitionId,
          match.seasonId,
          historicalMatches
        );
        awayForm = this.calculator.calculate(
          match.awayTeam.id,
          match.utcDate,
          match.competitionId,
          match.seasonId,
          historicalMatches
        );
      } else {
        // M-002 : Dégradation gracieuse si échec historique
        homeForm = {
          teamId: match.homeTeam.id,
          availability: 'UNAVAILABLE',
          results: [],
        };
        awayForm = {
          teamId: match.awayTeam.id,
          availability: 'UNAVAILABLE',
          results: [],
        };
      }

      return { match, form: { home: homeForm, away: awayForm } };
    });

    return { competitionCode, matches: entries };
  }
}
