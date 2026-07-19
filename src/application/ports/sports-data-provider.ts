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

export interface SportsDataProvider {
  /**
   * Récupère la liste des compétitions disponibles auprès du fournisseur actif.
   */
  getCompetitions(): Promise<Competition[]>;

  /**
   * Récupère les matchs d'une compétition sur une plage temporelle optionnelle.
   *
   * @param competitionCode Code normalisé de la compétition (ex : "FL1")
   * @param fromDate        Date de début (optionnel)
   * @param toDate          Date de fin (optionnel)
   */
  getMatches(
    competitionCode: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Match[]>;

  /**
   * Récupère le détail d'un match par son identifiant externe.
   *
   * @param externalMatchId Identifiant du match chez le fournisseur actif
   */
  getMatchDetails(externalMatchId: string): Promise<Match>;
}
