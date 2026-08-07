/**
 * Entité normalisée — Équipe.
 * Couche Domain — aucune dépendance externe.
 */

import { ProviderMetadata } from '../value-objects/provider-metadata.js';

export interface Team {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly tla: string;
  readonly crestUrl: string | null;
  readonly providerMetadata: ProviderMetadata;
}
