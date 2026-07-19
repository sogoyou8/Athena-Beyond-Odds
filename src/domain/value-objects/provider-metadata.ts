/**
 * Objet de valeur — Métadonnées du fournisseur de données.
 * Couche Domain — aucune dépendance externe.
 *
 * Permet de tracer l'origine et la fraîcheur de chaque entité normalisée.
 */

export interface ProviderMetadata {
  readonly providerName: string;
  readonly externalId: string;
  readonly lastUpdated: Date;
}
