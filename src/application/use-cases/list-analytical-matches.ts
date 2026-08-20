/**
 * Cas d'usage — Lister les matchs analytiques avec Form 5, Season Strength, H2H contextualisé et Repos & Congestion.
 * Couche Application — dépend uniquement du domaine et du port.
 *
 * Fournit pour chaque match programmé de la compétition :
 * - Les informations du match ;
 * - La Form 5 de l'équipe domicile et de l'équipe extérieure ;
 * - Le profil de force saisonnier (Season Strength) de l'équipe domicile et de l'équipe extérieure.
 * - Le profil Head-to-Head (H2H) contextualisé (DEC-027 Phase 3.4).
 * - Le profil de Repos & Congestion (Schedule Load) de l'équipe domicile et de l'équipe extérieure (DEC-029 / DEC-030 Phase 3.5).
 *
 * Stratégie anti N+1 (DEC-019.9 / DEC-020 / DEC-024 / DEC-027 / DEC-030) :
 * 1. Récupération principale : `provider.getMatches(competitionCode, now, now+7j)` pour obtenir les matchs programmés avec fenêtre explicite.
 * 2. Récupération historique : 1 SEULE requête mutualisée `provider.getMatches(competitionCode, undefined, undefined, { seasonCount: 3 })`
 *    pour récupérer le corpus multi-saison (DEC-027 Option 3B / DEC-030).
 *    Ce flux historique unique est partagé par FormCalculator, SeasonStrengthCalculator, HeadToHeadCalculator ET ScheduleLoadCalculator.
 *    Aucune récupération par équipe ou par carte n'est effectuée (0 N+1, maximum 2 appels provider).
 *
 * Dégradation gracieuse (DEC-019.8 / M-002 étendu / DEC-024 / DEC-027 / DEC-030) :
 * Si la récupération historique échoue (ex: exception provider), la récupération principale est conservée.
 * Chaque Form d'équipe est marquée `UNAVAILABLE` avec un tableau `results: []`.
 * Chaque SeasonStrengthProfile d'équipe est marqué `UNAVAILABLE` sur overall et contextual avec `metrics: null, sampleSize: null`.
 * Le profil H2H est marqué `UNAVAILABLE` sur overall et contextual si le corpus échoue.
 * Chaque ScheduleLoadProfile d'équipe est marqué `UNAVAILABLE` avec toutes les métriques à null.
 * Le Match Center reste disponible et retourne HTTP 200 avec les matchs programmés.
 *
 * Référence : DEC-018 / DEC-019 / DEC-020 / DEC-023 / DEC-024 / DEC-026 / DEC-027 / DEC-029 / DEC-030 — Phase 3.5
 */

import { SportsDataProvider } from '../ports/sports-data-provider.js';
import { Match } from '../../domain/entities/match.js';
import { TeamForm } from '../../domain/value-objects/form-result.js';
import { SeasonStrengthProfile } from '../../domain/value-objects/season-strength-profile.js';
import { HeadToHeadProfile } from '../../domain/value-objects/head-to-head-profile.js';
import { ScheduleLoadProfile } from '../../domain/value-objects/schedule-load-profile.js';
import { FormCalculator } from '../../domain/services/form-calculator.js';
import { SeasonStrengthCalculator } from '../../domain/services/season-strength-calculator.js';
import { HeadToHeadCalculator } from '../../domain/services/head-to-head-calculator.js';
import { ScheduleLoadCalculator } from '../../domain/services/schedule-load-calculator.js';
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
  seasonStrength: {
    home: SeasonStrengthProfile;
    away: SeasonStrengthProfile;
  };
  headToHead: HeadToHeadProfile;
  scheduleLoad: {
    home: ScheduleLoadProfile;
    away: ScheduleLoadProfile;
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
  private readonly formCalculator = new FormCalculator();
  private readonly seasonStrengthCalculator = new SeasonStrengthCalculator();
  private readonly headToHeadCalculator = new HeadToHeadCalculator();
  private readonly scheduleLoadCalculator = new ScheduleLoadCalculator();
  private readonly clockFn: () => Date;

  constructor(
    private readonly provider: SportsDataProvider,
    clockFn?: () => Date
  ) {
    this.clockFn = clockFn ?? (() => new Date());
  }

  /**
   * Retourne les matchs SCHEDULED enrichis de Form 5, Season Strength, H2H et Repos & Congestion.
   *
   * Conformément à DEC-020, DEC-024, DEC-027 et DEC-030 :
   * 1. Appel principal : `provider.getMatches(code, now, now+7j)` avec fenêtre explicite.
   * 2. Appel mutualisé : 1 SEUL `provider.getMatches(code, undefined, undefined, { seasonCount: 3 })`
   *    => corpus multi-saison partagé par Form5, SeasonStrength, H2H ET ScheduleLoad.
   * 3. Dégradation M-002 étendu : si l'appel mutualisé échoue, Form/SeasonStrength/H2H/ScheduleLoad = UNAVAILABLE.
   *
   * Budget d'invocations logiques : ≤2 (application level).
   * Budget de requêtes HTTP amont : ≤5 sur cold path (1 SCHEDULED + 1 courante + 2 historiques).
   */
  async execute(competitionCode: string): Promise<AnalyticalMatchesResult> {
    if (competitionCode !== 'FL1') {
      throw new CompetitionNotAvailableError(competitionCode);
    }

    // -----------------------------------------------------------------------
    // Étape 1 : Récupération principale avec fenêtre explicite (DEC-020.6)
    // Invocation logique #1
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
    // Étape 2 : Récupération historique MUTUALISÉE (DEC-027 / DEC-030 / M-001)
    // Invocation logique #2 — avec historyFilter pour couvrir jusqu'à 3 saisons.
    // Ce même flux est partagé entre FormCalculator, SeasonStrengthCalculator, HeadToHeadCalculator ET ScheduleLoadCalculator.
    // -----------------------------------------------------------------------
    let historicalMatches: Match[] | null = null;

    try {
      historicalMatches = await this.provider.getMatches(
        competitionCode,
        undefined,
        undefined,
        { seasonCount: 3 }
      );
    } catch {
      // M-002 : Isolement dégradation gracieuse. Si l'appel historique échoue, historicalMatches reste null.
      historicalMatches = null;
    }

    // -----------------------------------------------------------------------
    // Étape 3 : Calculer Form 5, Season Strength, H2H et Schedule Load pour chaque match SCHEDULED
    // Si l'historique est indisponible (historicalMatches === null), statut = UNAVAILABLE.
    // -----------------------------------------------------------------------
    const unavailableH2H: HeadToHeadProfile = {
      overall: {
        availability: 'UNAVAILABLE',
        sampleSize: null,
        homeTeam: null,
        awayTeam: null,
        latestMeetingDate: null,
        oldestMeetingDate: null,
        seasonsCovered: null,
      },
      contextual: {
        venue: 'SAME_VENUE',
        segment: {
          availability: 'UNAVAILABLE',
          sampleSize: null,
          homeTeam: null,
          awayTeam: null,
          latestMeetingDate: null,
          oldestMeetingDate: null,
          seasonsCovered: null,
        },
      },
    };

    const unavailableScheduleLoad: ScheduleLoadProfile = {
      availability: 'UNAVAILABLE',
      daysSinceLastMatch: null,
      matchesLast7Days: null,
      matchesLast14Days: null,
      matchesLast28Days: null,
      minimumRestDaysInLast14Days: null,
      shortRest: null,
    };

    // Optimisation locale d'Application (DEC-030 §7 / §8) : Indexation request-scoped par équipe
    const historyByTeam = new Map<string, Match[]>();
    if (historicalMatches !== null) {
      for (const m of historicalMatches) {
        if (!historyByTeam.has(m.homeTeam.id)) historyByTeam.set(m.homeTeam.id, []);
        if (!historyByTeam.has(m.awayTeam.id)) historyByTeam.set(m.awayTeam.id, []);
        historyByTeam.get(m.homeTeam.id)!.push(m);
        historyByTeam.get(m.awayTeam.id)!.push(m);
      }
    }

    const entries: AnalyticalMatchEntry[] = scheduledMatches.map((match) => {
      let homeForm: TeamForm;
      let awayForm: TeamForm;
      let homeSeasonStrength: SeasonStrengthProfile;
      let awaySeasonStrength: SeasonStrengthProfile;
      let headToHead: HeadToHeadProfile;
      let homeScheduleLoad: ScheduleLoadProfile;
      let awayScheduleLoad: ScheduleLoadProfile;

      if (historicalMatches !== null) {
        // Calcul Form 5
        homeForm = this.formCalculator.calculate(
          match.homeTeam.id,
          match.utcDate,
          match.competitionId,
          match.seasonId,
          historicalMatches
        );
        awayForm = this.formCalculator.calculate(
          match.awayTeam.id,
          match.utcDate,
          match.competitionId,
          match.seasonId,
          historicalMatches
        );

        // Calcul Season Strength (DEC-024)
        homeSeasonStrength = this.seasonStrengthCalculator.calculate(
          match.homeTeam.id,
          match.utcDate,
          'HOME',
          match.competitionId,
          match.seasonId,
          historicalMatches
        );
        awaySeasonStrength = this.seasonStrengthCalculator.calculate(
          match.awayTeam.id,
          match.utcDate,
          'AWAY',
          match.competitionId,
          match.seasonId,
          historicalMatches
        );

        // Calcul H2H (DEC-027 Phase 3.4) — corpus multi-saison
        headToHead = this.headToHeadCalculator.calculate(match, historicalMatches);

        // Calcul Repos & Congestion (DEC-029 / DEC-030 Phase 3.5)
        const homeHistory = historyByTeam.get(match.homeTeam.id) ?? [];
        const awayHistory = historyByTeam.get(match.awayTeam.id) ?? [];

        homeScheduleLoad = this.scheduleLoadCalculator.calculate(
          match.homeTeam.id,
          match,
          homeHistory
        );
        awayScheduleLoad = this.scheduleLoadCalculator.calculate(
          match.awayTeam.id,
          match,
          awayHistory
        );
      } else {
        // M-002 étendu : Dégradation gracieuse si échec historique
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
        homeSeasonStrength = {
          teamId: match.homeTeam.id,
          overall: {
            availability: 'UNAVAILABLE',
            sampleSize: null,
            metrics: null,
          },
          contextual: {
            venue: 'HOME',
            segment: {
              availability: 'UNAVAILABLE',
              sampleSize: null,
              metrics: null,
            },
          },
        };
        awaySeasonStrength = {
          teamId: match.awayTeam.id,
          overall: {
            availability: 'UNAVAILABLE',
            sampleSize: null,
            metrics: null,
          },
          contextual: {
            venue: 'AWAY',
            segment: {
              availability: 'UNAVAILABLE',
              sampleSize: null,
              metrics: null,
            },
          },
        };
        headToHead = unavailableH2H;
        homeScheduleLoad = unavailableScheduleLoad;
        awayScheduleLoad = unavailableScheduleLoad;
      }

      return {
        match,
        form: { home: homeForm, away: awayForm },
        seasonStrength: { home: homeSeasonStrength, away: awaySeasonStrength },
        headToHead,
        scheduleLoad: { home: homeScheduleLoad, away: awayScheduleLoad },
      };
    });

    return { competitionCode, matches: entries };
  }
}
