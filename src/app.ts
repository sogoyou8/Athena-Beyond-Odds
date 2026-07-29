/**
 * Configuration de l'application Express — Athena Beyond Odds.
 *
 * Configure le serveur HTTP et monte les routes.
 * Ce module est importable (et testable) sans démarrer le serveur.
 *
 * PHASE 2.8 — Connexion au fournisseur réel : GET /competitions/:code/matches
 * Sélection du fournisseur via SPORTS_DATA_PROVIDER = in-memory | football-data-org
 * (in-memory par défaut).
 *
 * Référence : DEC-006 / phase-2-8-real-provider-validation-pack.md
 */

import express, { Express } from 'express';
import { createHealthRouter } from './interfaces/http/health-route.js';
import { createMatchesRouter } from './interfaces/http/matches-route.js';
import { SportsDataProvider } from './application/ports/sports-data-provider.js';
import { InMemorySportsDataProvider } from './infrastructure/providers/in-memory/in-memory-sports-data-provider.js';
import { FootballDataOrgAdapter } from './infrastructure/providers/football-data-org/football-data-org-adapter.js';

export function resolveSportsDataProvider(): SportsDataProvider {
  const providerType = process.env['SPORTS_DATA_PROVIDER'] ?? 'in-memory';

  if (providerType === 'in-memory') {
    return new InMemorySportsDataProvider();
  }

  if (providerType === 'football-data-org') {
    return new FootballDataOrgAdapter();
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
