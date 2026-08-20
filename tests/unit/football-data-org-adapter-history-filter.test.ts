/**
 * Tests unitaires — FootballDataOrgAdapter — DEC-027 HistoryFilter multi-saison.
 * Budget HTTP : UPSTREAM_HTTP_REQUESTS_COLD_MAX <= 5 (Target <= 4).
 *
 * Tous les tests s'exécutent en mémoire sans aucun appel réseau réel.
 */

import { describe, it, expect, vi } from 'vitest';
import { FootballDataOrgAdapter } from '../../src/infrastructure/providers/football-data-org/football-data-org-adapter.js';
import {
  ProviderRateLimitError,
  ProviderUnavailableError,
} from '../../src/application/errors/index.js';

describe('FootballDataOrgAdapter — DEC-027 HistoryFilter multi-saison', () => {
  /** Helper : réponse JSON valide pour une saison donnée */
  function makeSeasonResponse(seasonYear: number, matchCount = 2): Response {
    const matches = Array.from({ length: matchCount }, (_, i) => ({
      id: seasonYear * 100 + i + 1,
      utcDate: `${seasonYear}-10-0${i + 1}T20:00:00Z`,
      status: 'FINISHED',
      homeTeam: { id: 1, name: 'Alpha FC', shortName: 'AFC', tla: 'AFC' },
      awayTeam: { id: 2, name: 'Beta SC', shortName: 'BSC', tla: 'BSC' },
      score: { fullTime: { home: 1, away: 0 }, halfTime: { home: 0, away: 0 } },
    }));
    return new Response(JSON.stringify({ matches }), { status: 200 });
  }

  it('historyFilter absent => 1 seul fetch (comportement inchangé DEC-020)', async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeSeasonResponse(2025, 3));
    const adapter = new FootballDataOrgAdapter({
      apiKey: 'key',
      fetchFn: mockFetch,
      clockFn: () => new Date('2026-01-01T00:00:00Z'),
    });

    await adapter.getMatches('FL1');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.football-data.org/v4/competitions/FL1/matches');
    expect(url).not.toContain('season=');
  });

  it('historyFilter { seasonCount: 1 } => 1 seul fetch (saison courante uniquement)', async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeSeasonResponse(2025, 2));
    const adapter = new FootballDataOrgAdapter({
      apiKey: 'key',
      fetchFn: mockFetch,
      clockFn: () => new Date('2026-01-01T00:00:00Z'),
    });

    await adapter.getMatches('FL1', undefined, undefined, { seasonCount: 1 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('historyFilter { seasonCount: 3 } => 3 fetches séquentiels (courante + N-1 + N-2)', async () => {
    const currentMatches = Array.from({ length: 5 }, (_, i) => ({
      id: 2025100 + i,
      utcDate: `2025-10-0${i + 1}T20:00:00Z`,
      status: 'FINISHED',
      homeTeam: { id: 1, name: 'Alpha FC', shortName: 'AFC', tla: 'AFC' },
      awayTeam: { id: 2, name: 'Beta SC', shortName: 'BSC', tla: 'BSC' },
      score: { fullTime: { home: 1, away: 0 }, halfTime: { home: 0, away: 0 } },
    }));

    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ matches: currentMatches }), { status: 200 }))
      .mockResolvedValueOnce(makeSeasonResponse(2024, 3))
      .mockResolvedValueOnce(makeSeasonResponse(2023, 2));

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'key',
      fetchFn: mockFetch,
      clockFn: () => new Date('2026-01-01T00:00:00Z'),
    });

    const matches = await adapter.getMatches('FL1', undefined, undefined, { seasonCount: 3 });

    // UPSTREAM_HTTP_REQUESTS = 3 (Target <= 4 ✓, Hard max <= 5 ✓)
    expect(mockFetch).toHaveBeenCalledTimes(3);

    // Call 0 : saison courante (sans ?season=)
    const [url0] = mockFetch.mock.calls[0];
    expect(url0).toBe('https://api.football-data.org/v4/competitions/FL1/matches');
    expect(url0 as string).not.toContain('season=');

    // Call 1 : N-1 (2024)
    const [url1] = mockFetch.mock.calls[1];
    expect(url1 as string).toContain('season=2024');

    // Call 2 : N-2 (2023)
    const [url2] = mockFetch.mock.calls[2];
    expect(url2 as string).toContain('season=2023');

    // Agrégation totale : 5 + 3 + 2 = 10 matchs
    expect(matches).toHaveLength(10);
  });

  it('cold path budget <= 5 HTTP — 1 SCHEDULED + 3 historiques = 4 requêtes (Target atteint)', async () => {
    const scheduledMatches = [{
      id: 99999,
      utcDate: '2026-08-14T18:00:00Z',
      status: 'SCHEDULED',
      homeTeam: { id: 1, name: 'Alpha', shortName: 'A', tla: 'ALF' },
      awayTeam: { id: 2, name: 'Beta', shortName: 'B', tla: 'BTU' },
      score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
    }];
    const currentMatches = Array.from({ length: 3 }, (_, i) => ({
      id: 202500 + i,
      utcDate: `2025-09-0${i + 1}T20:00:00Z`,
      status: 'FINISHED',
      homeTeam: { id: 1, name: 'Alpha', shortName: 'A', tla: 'ALF' },
      awayTeam: { id: 2, name: 'Beta', shortName: 'B', tla: 'BTU' },
      score: { fullTime: { home: 1, away: 0 }, halfTime: { home: 0, away: 0 } },
    }));

    let totalHttpCalls = 0;
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      totalHttpCalls++;
      if (url.includes('dateFrom=') || url.includes('dateTo=')) {
        return Promise.resolve(new Response(JSON.stringify({ matches: scheduledMatches }), { status: 200 }));
      }
      if (url.includes('season=2024')) {
        return Promise.resolve(new Response(JSON.stringify({ matches: [] }), { status: 200 }));
      }
      if (url.includes('season=2023')) {
        return Promise.resolve(new Response(JSON.stringify({ matches: [] }), { status: 200 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ matches: currentMatches }), { status: 200 }));
    });

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'key',
      fetchFn: mockFetch,
      clockFn: () => new Date('2026-01-01T00:00:00Z'),
    });

    // Call logique 1 (Application) : SCHEDULED avec fenêtre dates
    const now = new Date('2026-08-13T00:00:00Z');
    const weekLater = new Date('2026-08-20T00:00:00Z');
    await adapter.getMatches('FL1', now, weekLater);

    // Call logique 2 (Application) : corpus historique mutualisé seasonCount=3
    await adapter.getMatches('FL1', undefined, undefined, { seasonCount: 3 });

    // UPSTREAM_HTTP_REQUESTS = 1 (SCHEDULED) + 3 (historiques) = 4 <= 5 (Target atteint)
    expect(totalHttpCalls).toBeLessThanOrEqual(5);
    expect(totalHttpCalls).toBe(4);
  });

  it('erreur partielle sur N-2 (5xx) => ProviderUnavailableError, aucun retry automatique', async () => {
    const currentMatches = Array.from({ length: 3 }, (_, i) => ({
      id: 202500 + i,
      utcDate: `2025-10-0${i + 1}T20:00:00Z`,
      status: 'FINISHED',
      homeTeam: { id: 1, name: 'Alpha', shortName: 'A', tla: 'ALF' },
      awayTeam: { id: 2, name: 'Beta', shortName: 'B', tla: 'BTU' },
      score: { fullTime: { home: 1, away: 0 }, halfTime: { home: 0, away: 0 } },
    }));

    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ matches: currentMatches }), { status: 200 }))
      .mockResolvedValueOnce(makeSeasonResponse(2024, 2)) // N-1 OK
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'server error' }), { status: 500 })); // N-2 FAIL

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'key',
      fetchFn: mockFetch,
      clockFn: () => new Date('2026-01-01T00:00:00Z'),
    });

    await expect(
      adapter.getMatches('FL1', undefined, undefined, { seasonCount: 3 })
    ).rejects.toThrow(ProviderUnavailableError);

    // Fail-fast : aucun 4e fetch (pas de retry)
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('429 sur requête historique N-1 lève ProviderRateLimitError, aucun retry', async () => {
    const currentMatches = Array.from({ length: 2 }, (_, i) => ({
      id: 202500 + i,
      utcDate: `2025-10-0${i + 1}T20:00:00Z`,
      status: 'FINISHED',
      homeTeam: { id: 1, name: 'Alpha', shortName: 'A', tla: 'ALF' },
      awayTeam: { id: 2, name: 'Beta', shortName: 'B', tla: 'BTU' },
      score: { fullTime: { home: 1, away: 0 }, halfTime: { home: 0, away: 0 } },
    }));

    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ matches: currentMatches }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'Rate limit' }), { status: 429 }));

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'key',
      fetchFn: mockFetch,
      clockFn: () => new Date('2026-01-01T00:00:00Z'),
    });

    await expect(
      adapter.getMatches('FL1', undefined, undefined, { seasonCount: 2 })
    ).rejects.toThrow(ProviderRateLimitError);

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('MAJOR-001: saison courante vide => interroge le catalogue /competitions/{id} pour découvrir startYear et récupère N-1/N-2 (total 4 fetches, budget <= 5)', async () => {
    // Fetch 1: saison courante (0 match)
    // Fetch 2: catalogue /competitions/FL1 => currentSeason.startDate: "2025-08-01"
    // Fetch 3: N-1 (2024) => 2 matchs
    // Fetch 4: N-2 (2023) => 1 match
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith('/competitions/FL1')) {
        return Promise.resolve(new Response(JSON.stringify({
          currentSeason: { startDate: '2025-08-01' }
        }), { status: 200 }));
      }
      if (url.includes('season=2024')) {
        return Promise.resolve(makeSeasonResponse(2024, 2));
      }
      if (url.includes('season=2023')) {
        return Promise.resolve(makeSeasonResponse(2023, 1));
      }
      // Saison courante vide
      return Promise.resolve(new Response(JSON.stringify({ matches: [] }), { status: 200 }));
    });

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'key',
      fetchFn: mockFetch,
      clockFn: () => new Date('2026-01-01T00:00:00Z'),
    });

    const matches = await adapter.getMatches('FL1', undefined, undefined, { seasonCount: 3 });

    // Total fetches = 1 (courante vide) + 1 (catalogue) + 1 (2024) + 1 (2023) = 4 <= 5
    expect(mockFetch).toHaveBeenCalledTimes(4);
    // N-1 (2) + N-2 (1) = 3 matchs récupérés malgré la saison courante vide
    expect(matches).toHaveLength(3);
  });

  it('MAJOR-001 (erreur catalogue) : saison courante vide + catalogue 500 => ProviderUnavailableError', async () => {
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith('/competitions/FL1')) {
        return Promise.resolve(new Response(JSON.stringify({ error: 'catalogue down' }), { status: 500 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ matches: [] }), { status: 200 }));
    });

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'key',
      fetchFn: mockFetch,
      clockFn: () => new Date('2026-01-01T00:00:00Z'),
    });

    await expect(
      adapter.getMatches('FL1', undefined, undefined, { seasonCount: 3 })
    ).rejects.toThrow(ProviderUnavailableError);

    // Arrêt après catalogue : 1 courante + 1 catalogue = 2 fetches
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('MAJOR-002: historyFilter { seasonIds: [...] } => fetch uniquement les saisons demandées', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(makeSeasonResponse(2023, 2))
      .mockResolvedValueOnce(makeSeasonResponse(2024, 3));

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'key',
      fetchFn: mockFetch,
      clockFn: () => new Date('2026-01-01T00:00:00Z'),
    });

    const matches = await adapter.getMatches('FL1', undefined, undefined, {
      seasonIds: ['season-2023', 'season-2024'],
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    const [url0] = mockFetch.mock.calls[0];
    const [url1] = mockFetch.mock.calls[1];
    expect(url0 as string).toContain('season=2023');
    expect(url1 as string).toContain('season=2024');
    expect(matches).toHaveLength(5);
  });
});

