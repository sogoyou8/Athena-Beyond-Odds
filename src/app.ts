/**
 * Configuration de l'application Express — Athena Beyond Odds.
 *
 * Configure le serveur HTTP et monte les routes.
 * Ce module est importable (et testable) sans démarrer le serveur.
 *
 * PHASE 2.6 — Squelette technique minimal.
 */

import express, { Express } from 'express';
import { createHealthRouter } from './interfaces/http/health-route.js';

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/', createHealthRouter());
  return app;
}
