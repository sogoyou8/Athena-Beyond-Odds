/**
 * Erreurs de la couche Application.
 * Couche Application — dépend uniquement du domaine.
 *
 * Ces erreurs encapsulent les exceptions de la couche infrastructure
 * en les normalisant pour la couche application.
 *
 * Référence : sports-data-provider-contract.md §3 (Phase 2.5)
 */

export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/** Levée quand l'API distante renvoie HTTP 429. */
export class ProviderRateLimitError extends ApplicationError {
  constructor(
    message: string,
    public readonly resetTimeMs: number
  ) {
    super(message);
  }
}

/** Levée quand le quota du plan gratuit est épuisé. */
export class ProviderQuotaExceededError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

/** Levée quand la clé API est manquante, expirée ou invalide. */
export class ProviderAuthError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

/** Levée quand l'API distante est indisponible (5xx). */
export class ProviderUnavailableError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

/** Levée quand le payload du fournisseur ne correspond pas au contrat normalisé. */
export class ProviderDataMappingError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

/** Levée quand une opération n'est pas encore implémentée (frontière technique). */
export class NotImplementedError extends ApplicationError {
  constructor(methodName: string) {
    super(`Non implémenté — Phase suivante : ${methodName}`);
  }
}
