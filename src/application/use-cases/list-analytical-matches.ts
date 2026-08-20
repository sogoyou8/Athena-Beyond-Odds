/**
 * Cas d'usage — Lister les matchs analytiques avec Form 5, Season Strength et H2H contextualisé.
 * Couche Application — dépend uniquement du domaine et du port.
 *
 * Fournit pour chaque match programmé de la compétition :
 * - Les informations du match ;
 * - La Form 5 de l'équipe domicile et de l'équipe extérieure ;
 * - Le profil de force saisonnier (Season Strength) de l'équipe domicile et de l'équipe extérieure.
 * - Le profil Head-to-Head (H2H) contextualisé (DEC-027 Phase 3.4).
 *
 * Stratégie anti N+1 (DEC-019.9 / DEC-020 / DEC-024 / DEC-027) :
 * 1. Récupération principale : `provider.getMatches(competitionCode, now, now+7j)` pour obtenir les matchs programmés avec fenêtre explicite.
 * 2. Récupération historique : 1 SEULE requête mutualisée `provider.getMatches(competitionCode)` sans dates
 *    pour récupérer les matchs de la saison courante selon la sémantique DEC-020.
 *    Ce flux historique unique est partagé par FormCalculator ET SeasonStrengthCalculator.
 *    Aucune récupération par équipe ou par carte n'est effectuée (0 N+1, maximum 2 appels provider).
 * 3. Récupération H2H : 1 SEUL appel mutualisé `provider.getMatches(competitionCode, undefined, undefined, { seasonCount: 3 })`
 *    pour récupérer le corpus multi-saison (DEC-027 Option 3B).
 *    Ce flux est utilisé exclusivement par HeadToHeadCalculator (aucun impact sur Form/SeasonStrength).
 *    Le total d'invocations logiques reste ≤2 : l'appel H2H remplace l'appel historique mutualisé
 *    quand seasonCount > 1 (le corpus multi-saison inclut la saison courante).
 *
 * Dégradation gracieuse (DEC-019.8 / M-002 étendu / DEC-024 / DEC-027) :
 * Si la récupération historique échoue (ex: exception provider), la récupération principale est conservée.
 * Chaque Form d'équipe est marquée `UNAVAILABLE` avec un tableau `results: []`.
 * Chaque SeasonStrengthProfile d'équipe est marqué `UNAVAILABLE` sur overall et contextual avec `metrics: null, sampleSize: null`.
 * Le profil H2H est marqué `UNAVAILABLE` sur overall et contextual si le corpus échoue.
 * Le Match Center reste disponible et retourne HTTP 200 avec les matchs programmés.
 *
 * Référence : DEC-018 / DEC-019 / DEC-020 / DEC-023 / DEC-024 / DEC-026 / DEC-027 — Phase 3.4 H2H
 */

import { SportsDataProvider } from '../ports/sports-data-provider.js';
import { Match } from '../../domain/entities/match.js';
import { TeamForm } from '../../domain/value-objects/form-result.js';
import { SeasonStrengthProfile } from '../../domain/value-objects/season-strength-profile.js';
import { HeadToHeadProfile } from '../../domain/value-objects/head-to-head-profile.js';
import { FormCalculator } from '../../domain/services/form-calculator.js';
import { SeasonStrengthCalculator } from '../../domain/services/season-strength-calculator.js';
import { HeadToHeadCalculator } from '../../domain/services/head-to-head-calculator.js';
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
  private readonly clockFn: () => Date;

  constructor(
    private readonly provider: SportsDataProvider,
    clockFn?: () => Date
  ) {
    this.clockFn = clockFn ?? (() => new Date());
  }

  /**
   * Retourne les matchs SCHEDULED enrichis de Form 5, Season Strength et H2H pour la compétition demandée.
   *
   * Conformément à DEC-020, DEC-024 et DEC-027 :
   * 1. Appel principal : `provider.getMatches(code, now, now+7j)` avec fenêtre explicite.
   * 2. Appel mutualisé : 1 SEUL `provider.getMatches(code, undefined, undefined, { seasonCount: 3 })`
   *    => corpus multi-saison (DEC-027 Option 3B) : partagé par Form5, SeasonStrength ET H2H.
   *    - Form5 et SeasonStrength filtrent en interne à la saison cible (comportement inchangé).
   *    - HeadToHeadCalculator consomme les 3 saisons (DEC-027 bornes max 5 matchs, max 3 saisons).
   * 3. Dégradation M-002 étendu : si l'appel mutualisé échoue, Form/SeasonStrength/H2H = UNAVAILABLE.
   *
   * Budget d'invocations logiques : ≤2 (application level) — DEC-027.
   * Budget de requêtes HTTP amont : ≤5 sur cold path (1 SCHEDULED + 1 courante + 2 historiques) — DEC-027.
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
    // Étape 2 : Récupération historique MUTUALISÉE (DEC-020.7 / DEC-024 / DEC-027 / M-001)
    // Invocation logique #2 — avec historyFilter pour couvrir jusqu'à 3 saisons.
    // Ce même flux est partagé entre FormCalculator, SeasonStrengthCalculator ET HeadToHeadCalculator.
    // Form5 et SeasonStrength filtrent la saison cible en interne (comportement inchangé, DEC-027).
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
    // Étape 3 : Calculer Form 5, Season Strength et H2H pour chaque match SCHEDULED
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

    const entries: AnalyticalMatchEntry[] = scheduledMatches.map((match) => {
      let homeForm: TeamForm;
      let awayForm: TeamForm;
      let homeSeasonStrength: SeasonStrengthProfile;
      let awaySeasonStrength: SeasonStrengthProfile;
      let headToHead: HeadToHeadProfile;

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
      }

      return {
        match,
        form: { home: homeForm, away: awayForm },
        seasonStrength: { home: homeSeasonStrength, away: awaySeasonStrength },
        headToHead,
      };
    });

    return { competitionCode, matches: entries };
  }
}
