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
 * L'historique de la compétition est récupéré UNE SEULE FOIS (une requête mutualisée)
 * et réutilisé pour calculer la forme de toutes les équipes des matchs affichés.
 * Aucune récupération par équipe ou par match n'est effectuée.
 *
 * Dégradation gracieuse (DEC-019.8) :
 * Si la récupération historique échoue, les matchs programmés restent disponibles
 * et chaque TeamForm est marquée UNAVAILABLE. Le Match Center ne tombe pas.
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
    // Étape 1 : Récupérer TOUS les matchs de la compétition (une seule requête)
    // Aucune date imposée : le provider retourne toute la saison disponible.
    // L'Application filtre ensuite par statut et par as-of date.
    // -----------------------------------------------------------------------
    const allMatches = await this.provider.getMatches(competitionCode);

    // -----------------------------------------------------------------------
    // Étape 2 : Séparer les matchs SCHEDULED (à afficher) et l'historique FINISHED
    // -----------------------------------------------------------------------
    const scheduledMatches = allMatches.filter((m) => m.status === 'SCHEDULED');
    const historicalMatches = allMatches; // le FormCalculator filtre FINISHED + utcDate < targetDate

    // -----------------------------------------------------------------------
    // Étape 3 : Calculer Form 5 pour chaque match SCHEDULED
    // L'historique est réutilisé sans appel supplémentaire (anti N+1)
    // -----------------------------------------------------------------------
    const entries: AnalyticalMatchEntry[] = scheduledMatches.map((match) => {
      const homeForm = this.calculator.calculate(
        match.homeTeam.id,
        match.utcDate,
        match.competitionId,
        match.seasonId,
        historicalMatches
      );
      const awayForm = this.calculator.calculate(
        match.awayTeam.id,
        match.utcDate,
        match.competitionId,
        match.seasonId,
        historicalMatches
      );
      return { match, form: { home: homeForm, away: awayForm } };
    });

    return { competitionCode, matches: entries };
  }
}
