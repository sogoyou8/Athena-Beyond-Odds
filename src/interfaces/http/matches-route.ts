/**
 * Route HTTP — GET /competitions/:competitionCode/matches
 * Couche Interfaces — adaptateur primaire HTTP.
 *
 * Phase 2.8 — Connexion au fournisseur réel.
 * Mappe les erreurs du fournisseur vers les codes HTTP appropriés (DEC-006).
 *
 * Référence : phase-2-8-real-provider-validation-pack.md (DEC-006)
 */

import { Router, Request, Response, NextFunction } from 'express';
import { SportsDataProvider } from '../../application/ports/sports-data-provider.js';
import {
  ListScheduledMatchesUseCase,
  CompetitionNotAvailableError,
} from '../../application/use-cases/list-scheduled-matches.js';
import {
  ProviderRateLimitError,
  ProviderUnavailableError,
} from '../../application/errors/index.js';

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

        if (error instanceof ProviderRateLimitError) {
          res.status(429).json({ error: 'PROVIDER_RATE_LIMIT' });
          return;
        }

        if (error instanceof ProviderUnavailableError) {
          res.status(503).json({ error: 'PROVIDER_UNAVAILABLE' });
          return;
        }

        next(error);
      }
    }
  );

  return router;
}
