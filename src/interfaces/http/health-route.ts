/**
 * Route HTTP pour la vérification de l'état de l'application.
 * Couche Interfaces — adaptateur primaire minimal.
 *
 * PHASE 2.6 — GET /health uniquement.
 */

import { Router, Request, Response } from 'express';

export function createHealthRouter(): Router {
  const router = Router();

  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
    });
  });

  return router;
}
