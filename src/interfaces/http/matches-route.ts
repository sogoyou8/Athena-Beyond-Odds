/**
 * Route HTTP — GET /competitions/:competitionCode/matches
 * Couche Interfaces — adaptateur primaire HTTP.
 *
 * Phase 2.7 — Première tranche fonctionnelle.
 * Seul endpoint métier autorisé dans cette tranche.
 *
 * Référence : phase-2-7-functional-slice-validation-pack.md (DEC-005)
 */

import { Router, Request, Response, NextFunction } from 'express';
import { SportsDataProvider } from '../../application/ports/sports-data-provider.js';
import {
  ListScheduledMatchesUseCase,
  CompetitionNotAvailableError,
} from '../../application/use-cases/list-scheduled-matches.js';

export function createMatchesRouter(provider: SportsDataProvider): Router {
  const router = Router();

  router.get(
    '/competitions/:competitionCode/matches',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { competitionCode } = req.params;

      try {
        const useCase = new ListScheduledMatchesUseCase(provider);
        const result = await useCase.execute(competitionCode as string);

        res.status(200).json(result);
      } catch (error) {
        if (error instanceof CompetitionNotAvailableError) {
          res.status(404).json({ error: 'COMPETITION_NOT_AVAILABLE' });
          return;
        }
        next(error);
      }
    }
  );

  return router;
}
