/**
 * Port — Fournisseur de données sportives.
 * Couche Application — dépend uniquement du domaine.
 *
 * Interface d'abstraction qui isole la logique métier des APIs externes
 * (football-data.org, Sportmonks, etc.).
 *
 * Référence : sports-data-provider-contract.md (Phase 2.5)
 */

import { Competition } from '../../domain/entities/competition.js';
import { Match } from '../../domain/entities/match.js';

export interface HistoryFilter {
  /** Nombre maximum de saisons historiques consécutives demandées (ex: 3) */
  readonly seasonCount?: number;
  /** Identifiants explicites de saisons demandées si connus */
  readonly seasonIds?: readonly string[];
}

export interface SportsDataProvider {
  /**
   * Récupère la liste des compétitions disponibles auprès du fournisseur actif.
   */
  getCompetitions(): Promise<Competition[]>;

  /**
   * Récupère les matchs d'une compétition sur une plage temporelle optionnelle ou un filtre historique multi-saison.
   *
   * @param competitionCode Code normalisé de la compétition (ex : "FL1")
   * @param fromDate        Date de début (optionnel)
   * @param toDate          Date de fin (optionnel)
   * @param historyFilter   Filtre d'historique multi-saison optionnel (ex: { seasonCount: 3 })
   */
  getMatches(
    competitionCode: string,
    fromDate?: Date,
    toDate?: Date,
    historyFilter?: HistoryFilter
  ): Promise<Match[]>;

  /**
   * Récupère le détail d'un match par son identifiant externe.
   *
   * @param externalMatchId Identifiant du match chez le fournisseur actif
   */
  getMatchDetails(externalMatchId: string): Promise<Match>;
}
