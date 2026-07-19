/**
 * Routes HTTP — Interfaces de l'application.
 * Couche Interfaces — adapte les requêtes HTTP vers la couche Application.
 *
 * PHASE 2.6 — Route /health uniquement.
 * Aucun endpoint métier dans ce squelette.
 */

import { Router, Request, Response } from 'express';

export function createRouter(): Router {
  const router = Router();

  /**
   * GET /health
   * Vérifie l'état du service. Retourne toujours 200 dans ce squelette.
   */
  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'athena-beyond-odds',
      phase: '2.6',
    });
  });

  return router;
}
