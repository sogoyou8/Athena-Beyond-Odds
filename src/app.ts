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
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createHealthRouter } from './interfaces/http/health-route.js';
import { createMatchesRouter } from './interfaces/http/matches-route.js';
import { SportsDataProvider } from './application/ports/sports-data-provider.js';
import { InMemorySportsDataProvider } from './infrastructure/providers/in-memory/in-memory-sports-data-provider.js';
import { FootballDataOrgAdapter } from './infrastructure/providers/football-data-org/football-data-org-adapter.js';
import { InMemoryCache } from './infrastructure/cache/memory/in-memory-cache.js';
import { resolveTelemetryObserver } from './shared/observability/telemetry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const defaultPublicPath = resolve(__dirname, '..', 'dist', 'public');

export interface CreateAppOptions {
  publicPath?: string;
}

export function resolveSportsDataProvider(): SportsDataProvider {
  const telemetryObserver = resolveTelemetryObserver(process.env['ATHENA_TELEMETRY']);
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
    const adapter = new FootballDataOrgAdapter({ apiKey, observer: telemetryObserver });
    return new InMemoryCache(adapter, { ttlMs: 600_000, observer: telemetryObserver });
  }

  throw new Error(
    '[Athena] Invalid SPORTS_DATA_PROVIDER value. Expected "in-memory" or "football-data-org".'
  );
}

export function createApp(
  customProvider?: SportsDataProvider,
  options: CreateAppOptions = {}
): Express {
  const app = express();
  app.use(express.json());

  const provider = customProvider ?? resolveSportsDataProvider();

  app.use('/', createHealthRouter());
  app.use('/', createMatchesRouter(provider));

  const publicPath = options.publicPath ?? defaultPublicPath;
  app.use(express.static(publicPath));

  return app;
}

