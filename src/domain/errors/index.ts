/**
 * Erreurs du domaine.
 * Couche Domain — aucune dépendance externe.
 *
 * Ces erreurs représentent des violations des règles métier normalisées.
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityType: string, id: string) {
    super(`${entityType} introuvable : ${id}`);
  }
}

export class InvalidEntityError extends DomainError {
  constructor(entityType: string, reason: string) {
    super(`${entityType} invalide : ${reason}`);
  }
}
