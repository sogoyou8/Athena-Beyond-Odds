/**
 * Cas d'usage — Lister les matchs analytiques avec Form 5.
 * Couche Application — dépend uniquement du domaine et du port.
 *
 * Fournit pour chaque match programmé de la compétition :
 * - Les informations du match ;
 * - La Form 5 de l'équipe domicile ;
 * - La Form 5 de l'équipe extérieure.
 *
 * Stratégie anti N+1 (DEC-019.9 / DEC-020) :
 * 1. Récupération principale : `provider.getMatches(competitionCode, now, now+7j)` pour obtenir les matchs programmés avec fenêtre explicite.
 * 2. Récupération historique : 1 SEULE requête mutualisée `provider.getMatches(competitionCode)` sans dates
 *    pour récupérer les matchs de la saison courante selon la sémantique DEC-020.
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
import { addUtcDays } from '../../shared/date-utils.js';

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
  private readonly clockFn: () => Date;

  constructor(
    private readonly provider: SportsDataProvider,
    clockFn?: () => Date
  ) {
    this.clockFn = clockFn ?? (() => new Date());
  }

  /**
   * Retourne les matchs SCHEDULED enrichis de Form 5 pour la compétition demandée.
   *
   * Conformément à DEC-020 :
   * 1. Appel principal : `provider.getMatches(code, now, now+7j)` avec fenêtre explicite.
   * 2. Appel historique : 1 SEUL appel mutualisé `provider.getMatches(code)` sans dates pour la saison courante.
   * 3. Dégradation M-002 : si l'appel historique échoue, les matchs principaux sont conservés et les formes marquées UNAVAILABLE.
   *
   * @param competitionCode Code de compétition normalisé (seul "FL1" est accepté)
   * @throws CompetitionNotAvailableError si le code n'est pas "FL1"
   */
  async execute(competitionCode: string): Promise<AnalyticalMatchesResult> {
    if (competitionCode !== 'FL1') {
      throw new CompetitionNotAvailableError(competitionCode);
    }

    // -----------------------------------------------------------------------
    // Étape 1 : Récupération principale avec fenêtre explicite (DEC-020.6)
    // -----------------------------------------------------------------------
    const now = this.clockFn();
    const scheduledTo = addUtcDays(now, 7);

    const primaryMatches = await this.provider.getMatches(
      competitionCode,
      now,
      scheduledTo
    );
    const scheduledMatches = primaryMatches.filter((m) => m.status === 'SCHEDULED');

    if (scheduledMatches.length === 0) {
      return { competitionCode, matches: [] };
    }

    // -----------------------------------------------------------------------
    // Étape 2 : Récupération historique MUTUALISÉE sans dates (DEC-020.7 / M-001)
    // getMatches(competitionCode) sans dates demande contractuellement la saison courante.
    // -----------------------------------------------------------------------
    let historicalMatches: Match[] | null = null;

    try {
      historicalMatches = await this.provider.getMatches(competitionCode);
    } catch {
      // M-002 : Isolement dégradation gracieuse. Si l'appel historique échoue, historicalMatches reste null.
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
