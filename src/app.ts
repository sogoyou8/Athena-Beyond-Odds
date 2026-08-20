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
import { createAnalysisRouter } from './interfaces/http/analysis-route.js';
import { SportsDataProvider } from './application/ports/sports-data-provider.js';
import {
  InMemorySportsDataProvider,
  IN_MEMORY_REFERENCE_NOW,
} from './infrastructure/providers/in-memory/in-memory-sports-data-provider.js';
import { FootballDataOrgAdapter } from './infrastructure/providers/football-data-org/football-data-org-adapter.js';
import { InMemoryCache } from './infrastructure/cache/memory/in-memory-cache.js';
import { resolveTelemetryObserver } from './shared/observability/telemetry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const defaultPublicPath = resolve(__dirname, '..', 'dist', 'public');

export interface CreateAppOptions {
  publicPath?: string;
  /**
   * Horloge optionnelle à injecter dans les use cases.
   * Utilisé uniquement lorsque createApp reçoit un customProvider (mode test).
   * Si absent, c'est resolveSportsDataProvider() qui fournit la clockFn.
   */
  clockFn?: () => Date;
}

export interface ProviderResult {
  provider: SportsDataProvider;
  /**
   * Horloge déterministe injectée dans les use cases.
   * Vaut () => IN_MEMORY_REFERENCE_NOW en mode in-memory (dataset 2099).
   * Vaut undefined en mode football-data-org (horloge système réelle).
   */
  clockFn?: () => Date;
}

export function resolveSportsDataProvider(): ProviderResult {
  const telemetryObserver = resolveTelemetryObserver(process.env['ATHENA_TELEMETRY']);
  const providerType = process.env['SPORTS_DATA_PROVIDER'] ?? 'in-memory';

  if (providerType === 'in-memory') {
    return {
      provider: new InMemorySportsDataProvider(),
      // Horloge déterministe cohérente avec le dataset InMemory (2099).
      // Sans cette injection, la fenêtre [now, now+7j] en 2026 ne contiendrait
      // aucune fixture 2099 et les endpoints retourneraient [].
      clockFn: () => new Date(IN_MEMORY_REFERENCE_NOW),
    };
  }

  if (providerType === 'football-data-org') {
    const apiKey = process.env['FOOTBALL_DATA_API_KEY']?.trim();
    if (!apiKey) {
      throw new Error(
        '[Athena] ERREUR DE CONFIGURATION : FOOTBALL_DATA_API_KEY est requise lorsque SPORTS_DATA_PROVIDER=football-data-org.'
      );
    }
    const adapter = new FootballDataOrgAdapter({ apiKey, observer: telemetryObserver });
    return {
      provider: new InMemoryCache(adapter, { ttlMs: 600_000, observer: telemetryObserver }),
      // Horloge réelle : undefined => les use cases utilisent new Date().
      clockFn: undefined,
    };
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

  let provider: SportsDataProvider;
  let clockFn: (() => Date) | undefined;

  if (customProvider !== undefined) {
    // Injection directe (tests) : horloge configurable via options.clockFn (ou undefined pour heure réelle).
    provider = customProvider;
    clockFn = options.clockFn;
  } else {
    const resolved = resolveSportsDataProvider();
    provider = resolved.provider;
    clockFn = resolved.clockFn;
  }

  app.use('/', createHealthRouter());
  app.use('/', createMatchesRouter(provider, clockFn));
  app.use('/', createAnalysisRouter(provider, clockFn));

  const publicPath = options.publicPath ?? defaultPublicPath;
  app.use(express.static(publicPath));

  return app;
}

