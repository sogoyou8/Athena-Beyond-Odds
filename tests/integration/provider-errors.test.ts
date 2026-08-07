/**
 * Tests d'intégration — Gestion des erreurs du fournisseur réel (football-data.org).
 * Couche Interfaces / Application / Infrastructure.
 *
 * Simule les comportements 429 et 503 HTTP sans aucun appel réseau réel.
 * Conforme à DEC-006.
 */

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { FootballDataOrgAdapter } from '../../src/infrastructure/providers/football-data-org/football-data-org-adapter.js';

describe('Integration — Provider Error Handling (DEC-006)', () => {
  const fixedNow = new Date('2026-07-30T12:00:00.000Z');
  const mockClock = () => fixedNow;

  it('retourne HTTP 429 avec { "error": "PROVIDER_RATE_LIMIT" } si le fournisseur renvoie 429', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Rate limit' }), { status: 429 })
    );

    const provider = new FootballDataOrgAdapter({
      apiKey: 'valid-api-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    const app = createApp(provider);

    const response = await request(app).get('/competitions/FL1/matches');

    expect(response.status).toBe(429);
    expect(response.body).toEqual({ error: 'PROVIDER_RATE_LIMIT' });
  });

  it('retourne HTTP 503 avec { "error": "PROVIDER_UNAVAILABLE" } si le fournisseur est indisponible (ex: 503)', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Service unavailable' }), { status: 503 })
    );

    const provider = new FootballDataOrgAdapter({
      apiKey: 'valid-api-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    const app = createApp(provider);

    const response = await request(app).get('/competitions/FL1/matches');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ error: 'PROVIDER_UNAVAILABLE' });
  });

  it('transmet les erreurs inconnues au gestionnaire d\'erreur Express', async () => {
    const customError = new Error('Custom unknown internal error');
    const mockFetch = vi.fn().mockRejectedValue(customError);

    // FootballDataOrgAdapter convertit les erreurs d'appel fetch en ProviderUnavailableError (503).
    // Pour simuler une erreur non capturée et transmise à next(error), nous créons un mock provider personnalisé.
    const customProvider = {
      getCompetitions: vi.fn(),
      getMatches: vi.fn().mockRejectedValue(customError),
      getMatchDetails: vi.fn(),
    };

    const app = createApp(customProvider);

    const response = await request(app).get('/competitions/FL1/matches');

    expect(response.status).toBe(500);
  });
});
