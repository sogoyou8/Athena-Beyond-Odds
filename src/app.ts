/**
 * Configuration de l'application Express — Athena Beyond Odds.
 *
 * Configure le serveur HTTP et monte les routes.
 * Ce module est importable (et testable) sans démarrer le serveur.
 *
 * PHASE 2.7 — Première tranche fonctionnelle : GET /competitions/:code/matches
 */

import express, { Express } from 'express';
import { createHealthRouter } from './interfaces/http/health-route.js';
import { createMatchesRouter } from './interfaces/http/matches-route.js';
import { InMemorySportsDataProvider } from './infrastructure/providers/in-memory/in-memory-sports-data-provider.js';

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  const provider = new InMemorySportsDataProvider();

  app.use('/', createHealthRouter());
  app.use('/', createMatchesRouter(provider));

  return app;
}

