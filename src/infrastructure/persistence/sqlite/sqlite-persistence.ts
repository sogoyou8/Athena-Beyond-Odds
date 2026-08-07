/**
 * Frontière technique — Persistance SQLite minimale.
 * Couche Infrastructure — pas d'accès réel à la base de données.
 *
 * PHASE 2.6 — Conforme aux exigences d'isolation.
 * Permet l'activation/désactivation, l'ouverture/fermeture logique,
 * et le contrôle d'état sans utiliser de pilote SQLite ni créer de fichier.
 */

export class SqlitePersistence {
  private active = false;
  private opened = false;

  constructor(private readonly enabled: boolean) {}

  /**
   * Active la persistance.
   */
  enable(): void {
    if (this.enabled) {
      this.active = true;
    }
  }

  /**
   * Désactive la persistance.
   */
  disable(): void {
    this.active = false;
    this.opened = false;
  }

  /**
   * Ouvre la connexion (logique).
   */
  async open(): Promise<void> {
    if (this.enabled && this.active) {
      this.opened = true;
    }
  }

  /**
   * Ferme la connexion (logique).
   */
  async close(): Promise<void> {
    this.opened = false;
  }

  /**
   * Indique si la persistance est disponible et ouverte.
   */
  isAvailable(): boolean {
    return this.enabled && this.active && this.opened;
  }
}
