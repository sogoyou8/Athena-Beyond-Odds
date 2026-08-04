/**
 * Configuration de l'application Express — Athena Beyond Odds.
 *
 * Configure le serveur HTTP et monte les routes.
 * Ce module est importable (et testable) sans démarrer le serveur.
 *
 * PHASE 2.10 — Activation du cache mémoire pour football-data-org (DEC-008.1).
 * Composition : InMemoryCache(FootballDataOrgAdapter) avec TTL de 600 000 ms.
 *
 * Référence : DEC-008 / phase-2-10-cache-activation-pack.md
 */

import express, { Express } from 'express';
import { createHealthRouter } from './interfaces/http/health-route.js';
import { createMatchesRouter } from './interfaces/http/matches-route.js';
import { SportsDataProvider } from './application/ports/sports-data-provider.js';
import { InMemorySportsDataProvider } from './infrastructure/providers/in-memory/in-memory-sports-data-provider.js';
import { FootballDataOrgAdapter } from './infrastructure/providers/football-data-org/football-data-org-adapter.js';
import { InMemoryCache } from './infrastructure/cache/memory/in-memory-cache.js';

export function resolveSportsDataProvider(): SportsDataProvider {
  const providerType = process.env['SPORTS_DATA_PROVIDER'] ?? 'in-memory';

  if (providerType === 'in-memory') {
    return new InMemorySportsDataProvider();
  }

  if (providerType === 'football-data-org') {
    const apiKey = process.env['FOOTBALL_DATA_API_KEY']?.trim();
    if (!apiKey) {
      throw new Error(
        '[Athena] ERREUR DE CONFIGURATION : FOOTBALL_DATA_API_KEY est requise lorsque SPORTS_DATA_PROVIDER=football-data-org.'
      );
    }
    const adapter = new FootballDataOrgAdapter({ apiKey });
    return new InMemoryCache(adapter, { ttlMs: 600_000 });
  }

  throw new Error(
    `[Athena] ERREUR DE CONFIGURATION : Valeur inconnue pour SPORTS_DATA_PROVIDER: "${providerType}". Seules "in-memory" et "football-data-org" sont autorisées.`
  );
}

export function createApp(customProvider?: SportsDataProvider): Express {
  const app = express();
  app.use(express.json());

  const provider = customProvider ?? resolveSportsDataProvider();

  app.use('/', createHealthRouter());
  app.use('/', createMatchesRouter(provider));

  return app;
}
