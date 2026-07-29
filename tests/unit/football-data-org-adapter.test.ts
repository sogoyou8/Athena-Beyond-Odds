/**
 * Tests unitaires — FootballDataOrgAdapter.
 * Couche Infrastructure.
 *
 * Tous les tests s'exécutent en mémoire sans aucun appel réseau réel.
 * Conforme à DEC-006.
 */

import { describe, it, expect, vi } from 'vitest';
import { FootballDataOrgAdapter } from '../../src/infrastructure/providers/football-data-org/football-data-org-adapter.js';
import {
  ProviderAuthError,
  ProviderRateLimitError,
  ProviderUnavailableError,
  ProviderDataMappingError,
} from '../../src/application/errors/index.js';

describe('FootballDataOrgAdapter (Unit Tests)', () => {
  const fixedNow = new Date('2026-07-30T12:00:00.000Z');
  const mockClock = () => fixedNow;

  it('lève ProviderAuthError si la clé API est absente ou vide', async () => {
    const adapter = new FootballDataOrgAdapter({ apiKey: '', clockFn: mockClock });
    await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderAuthError);
  });

  it('effectue un appel HTTP valide vers l\'URL et avec l\'en-tête X-Auth-Token corrects', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          matches: [
            {
              id: 101,
              utcDate: '2026-07-31T20:00:00Z',
              status: 'SCHEDULED',
              homeTeam: { id: 1, name: 'Paris Saint-Germain', shortName: 'PSG', tla: 'PSG' },
              awayTeam: { id: 2, name: 'Olympique de Marseille', shortName: 'OM', tla: 'OM' },
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'test-api-key-123',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    const matches = await adapter.getMatches('FL1');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [callUrl, callInit] = mockFetch.mock.calls[0];
    expect(callUrl).toContain('https://api.football-data.org/v4/competitions/FL1/matches');
    expect(callUrl).toContain('dateFrom=2026-07-30');
    expect(callUrl).toContain('dateTo=2026-08-06');
    expect(callInit?.headers).toEqual({
      'X-Auth-Token': 'test-api-key-123',
      Accept: 'application/json',
    });

    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe('match-101');
    expect(matches[0].competitionId).toBe('FL1');
    expect(matches[0].status).toBe('SCHEDULED');
    expect(matches[0].homeTeam.name).toBe('Paris Saint-Germain');
    expect(matches[0].awayTeam.name).toBe('Olympique de Marseille');
  });

  it('lève ProviderRateLimitError si l\'API renvoie HTTP 429', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Rate limit' }), { status: 429 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'valid-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderRateLimitError);
  });

  it('lève ProviderUnavailableError si l\'API renvoie HTTP 401 ou 403', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'invalid-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);
  });

  it('lève ProviderUnavailableError si l\'API renvoie HTTP 500', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'valid-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);
  });

  it('lève ProviderUnavailableError en cas d\'erreur réseau', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new TypeError('Network request failed'));

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'valid-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);
  });

  it('lève ProviderUnavailableError en cas de timeout (AbortError)', async () => {
    const abortErr = new Error('The operation was aborted');
    abortErr.name = 'AbortError';
    const mockFetch = vi.fn().mockRejectedValue(abortErr);

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'valid-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);
  });

  it('lève ProviderUnavailableError si le JSON est invalide', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response('invalid-json-content', { status: 200 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'valid-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);
  });

  it('lève ProviderDataMappingError si payload.matches n\'est pas un tableau', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ notMatches: [] }), { status: 200 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'valid-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderDataMappingError);
  });

  it('filtre et conserve uniquement les matchs au statut SCHEDULED', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          matches: [
            {
              id: 1,
              utcDate: '2026-07-31T20:00:00Z',
              status: 'SCHEDULED',
              homeTeam: { id: 1, name: 'Team A' },
              awayTeam: { id: 2, name: 'Team B' },
            },
            {
              id: 2,
              utcDate: '2026-07-30T20:00:00Z',
              status: 'FINISHED',
              homeTeam: { id: 3, name: 'Team C' },
              awayTeam: { id: 4, name: 'Team D' },
            },
            {
              id: 3,
              utcDate: '2026-08-01T20:00:00Z',
              status: 'TIMED',
              homeTeam: { id: 5, name: 'Team E' },
              awayTeam: { id: 6, name: 'Team F' },
            },
          ],
        }),
        { status: 200 }
      )
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'valid-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    const matches = await adapter.getMatches('FL1');

    expect(matches).toHaveLength(2);
    expect(matches.map((m) => m.id)).toEqual(['match-1', 'match-3']);
  });
});
