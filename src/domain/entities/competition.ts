/**
 * Entité normalisée — Compétition (ex : Ligue 1, Premier League).
 * Couche Domain — aucune dépendance externe.
 */

import { Season } from './season.js';
import { ProviderMetadata } from '../value-objects/provider-metadata.js';

export interface Competition {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly areaName: string;
  readonly currentSeason: Season;
  readonly providerMetadata: ProviderMetadata;
}
