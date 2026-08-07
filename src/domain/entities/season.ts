/**
 * Entité normalisée — Saison.
 * Couche Domain — aucune dépendance externe.
 */

import { ProviderMetadata } from '../value-objects/provider-metadata.js';

export interface Season {
  readonly id: string;
  readonly startYear: number;
  readonly endYear: number;
  readonly currentMatchday: number;
  readonly providerMetadata: ProviderMetadata;
}
