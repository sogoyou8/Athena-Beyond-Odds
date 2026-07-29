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

  it('retourne HTTP 503 avec { "error": "PROVIDER_UNAVAILABLE" } si la clé API est manquante', async () => {
    const provider = new FootballDataOrgAdapter({
      apiKey: '',
      clockFn: mockClock,
    });

    const app = createApp(provider);

    const response = await request(app).get('/competitions/FL1/matches');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ error: 'PROVIDER_UNAVAILABLE' });
  });
});
