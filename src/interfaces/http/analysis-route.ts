/**
 * Route HTTP — GET /competitions/:competitionCode/matches/analysis
 * Couche Interfaces — adaptateur primaire HTTP.
 *
 * Phase 3.2 — Endpoint analytique agrégé pour Form 5.
 * Expose la liste des matchs programmés enrichis des formes d'équipes (Form 5).
 *
 * Référence : DEC-019 — Phase 3.2 Form 5
 */

import { Router, Request, Response, NextFunction } from 'express';
import { SportsDataProvider } from '../../application/ports/sports-data-provider.js';
import { ListAnalyticalMatchesUseCase } from '../../application/use-cases/list-analytical-matches.js';
import { CompetitionNotAvailableError } from '../../application/use-cases/list-scheduled-matches.js';
import {
  ProviderRateLimitError,
  ProviderUnavailableError,
} from '../../application/errors/index.js';

export function createAnalysisRouter(
  provider: SportsDataProvider,
  clockFn?: () => Date
): Router {
  const router = Router();

  router.get(
    '/competitions/:competitionCode/matches/analysis',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { competitionCode } = req.params;

      try {
        const useCase = new ListAnalyticalMatchesUseCase(provider, clockFn);
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
