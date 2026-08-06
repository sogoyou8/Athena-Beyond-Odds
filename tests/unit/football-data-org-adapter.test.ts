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
  ProviderRateLimitError,
  ProviderUnavailableError,
} from '../../src/application/errors/index.js';

describe('FootballDataOrgAdapter (Unit Tests)', () => {
  const fixedNow = new Date('2026-07-30T12:00:00.000Z');
  const mockClock = () => fixedNow;

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

  it('lève ProviderUnavailableError si payload.matches est absent ou null', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ notMatches: [] }), { status: 200 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'valid-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);
  });

  it('lève ProviderUnavailableError si un match est incomplet ou son statut inconnu', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          matches: [
            {
              id: 1,
              utcDate: '2026-07-31T20:00:00Z',
              status: 'UNKNOWN_STATUS_XYZ',
              homeTeam: { id: 1, name: 'Team A' },
              awayTeam: { id: 2, name: 'Team B' },
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

    await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);
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

  it('utilise les bornes explicites fromDate et toDate quand les deux sont fournies (DEC-008.3 Option A)', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ matches: [] }), { status: 200 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'test-key',
      fetchFn: mockFetch,
      clockFn: mockClock, // horloge non consultée dans ce cas
    });

    const explicitFrom = new Date('2026-09-01T00:00:00.000Z');
    const explicitTo = new Date('2026-09-08T00:00:00.000Z');

    await adapter.getMatches('FL1', explicitFrom, explicitTo);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [callUrl] = mockFetch.mock.calls[0];
    expect(callUrl).toContain('dateFrom=2026-09-01');
    expect(callUrl).toContain('dateTo=2026-09-08');
    // La fenêtre par défaut (now=2026-07-30) ne doit pas apparaître
    expect(callUrl).not.toContain('dateFrom=2026-07-30');
    expect(callUrl).not.toContain('dateTo=2026-08-06');
  });

  it('utilise la fenêtre par défaut [now, now+7j) quand aucune borne n\'est fournie', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ matches: [] }), { status: 200 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'test-key',
      fetchFn: mockFetch,
      clockFn: mockClock, // maintenant 2026-07-30
    });

    await adapter.getMatches('FL1');

    const [callUrl] = mockFetch.mock.calls[0];
    expect(callUrl).toContain('dateFrom=2026-07-30');
    expect(callUrl).toContain('dateTo=2026-08-06');
  });

  it('utilise la fenêtre par défaut [now, now+7j) quand seule fromDate est fournie', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ matches: [] }), { status: 200 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'test-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    // Une seule borne → comportement par défaut
    await adapter.getMatches('FL1', new Date('2026-09-01T00:00:00Z'), undefined);

    const [callUrl] = mockFetch.mock.calls[0];
    expect(callUrl).toContain('dateFrom=2026-07-30');
    expect(callUrl).toContain('dateTo=2026-08-06');
  });

  it('utilise la fenêtre par défaut [now, now+7j) quand seule toDate est fournie', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ matches: [] }), { status: 200 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'test-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    // Une seule borne → comportement par défaut
    await adapter.getMatches('FL1', undefined, new Date('2026-09-08T00:00:00Z'));

    const [callUrl] = mockFetch.mock.calls[0];
    expect(callUrl).toContain('dateFrom=2026-07-30');
    expect(callUrl).toContain('dateTo=2026-08-06');
  });

  describe('Phase 2.11 — Observabilité de l\'Adaptateur Fournisseur (DEC-009)', () => {
    it('émet provider_request_started et provider_request_succeeded lors d\'une requête réussie', async () => {
      const observer = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ matches: [] }), { status: 200 })
      );

      let timeCall = 0;
      const durationClock = () => {
        timeCall += 50;
        return timeCall;
      };

      const adapter = new FootballDataOrgAdapter({
        apiKey: 'test-key',
        fetchFn: mockFetch,
        clockFn: mockClock,
        durationClock,
        observer,
      });

      await adapter.getMatches('FL1');

      expect(observer).toHaveBeenCalledTimes(2);

      expect(observer).toHaveBeenNthCalledWith(1, {
        type: 'provider_request_started',
        competitionCode: 'FL1',
        dateFrom: '2026-07-30',
        dateTo: '2026-08-06',
      });

      expect(observer).toHaveBeenNthCalledWith(2, {
        type: 'provider_request_succeeded',
        competitionCode: 'FL1',
        dateFrom: '2026-07-30',
        dateTo: '2026-08-06',
        durationMs: 50,
        matchCount: 0,
      });
    });

    it('émet provider_rate_limited lors d\'une réponse HTTP 429', async () => {
      const observer = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('Rate limit', { status: 429 })
      );

      let timeCall = 100;
      const durationClock = () => (timeCall += 30);

      const adapter = new FootballDataOrgAdapter({
        apiKey: 'test-key',
        fetchFn: mockFetch,
        clockFn: mockClock,
        durationClock,
        observer,
      });

      await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderRateLimitError);

      expect(observer).toHaveBeenCalledWith({
        type: 'provider_rate_limited',
        competitionCode: 'FL1',
        durationMs: 30,
      });
    });

    it('émet provider_unavailable avec failureKind unauthorized (401) et forbidden (403)', async () => {
      const observer = vi.fn();
      const mockFetch401 = vi.fn().mockResolvedValue(new Response('Unauthorized', { status: 401 }));

      const adapter401 = new FootballDataOrgAdapter({
        apiKey: 'invalid-key',
        fetchFn: mockFetch401,
        clockFn: mockClock,
        observer,
      });

      await expect(adapter401.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);

      expect(observer).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'provider_unavailable',
          competitionCode: 'FL1',
          failureKind: 'unauthorized',
        })
      );

      observer.mockClear();
      const mockFetch403 = vi.fn().mockResolvedValue(new Response('Forbidden', { status: 403 }));
      const adapter403 = new FootballDataOrgAdapter({
        apiKey: 'forbidden-key',
        fetchFn: mockFetch403,
        clockFn: mockClock,
        observer,
      });

      await expect(adapter403.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);

      expect(observer).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'provider_unavailable',
          competitionCode: 'FL1',
          failureKind: 'forbidden',
        })
      );
    });

    it('émet provider_unavailable avec failureKind upstream_5xx sur HTTP 500', async () => {
      const observer = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('Server Error', { status: 500 }));

      const adapter = new FootballDataOrgAdapter({
        apiKey: 'test-key',
        fetchFn: mockFetch,
        clockFn: mockClock,
        observer,
      });

      await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);

      expect(observer).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'provider_unavailable',
          competitionCode: 'FL1',
          failureKind: 'upstream_5xx',
        })
      );
    });

    it('émet provider_unavailable avec failureKind network sur erreur réseau', async () => {
      const observer = vi.fn();
      const mockFetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

      const adapter = new FootballDataOrgAdapter({
        apiKey: 'test-key',
        fetchFn: mockFetch,
        clockFn: mockClock,
        observer,
      });

      await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);

      expect(observer).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'provider_unavailable',
          competitionCode: 'FL1',
          failureKind: 'network',
        })
      );
    });

    it('émet provider_unavailable avec failureKind timeout en cas de dépassement de délai', async () => {
      const observer = vi.fn();
      const abortErr = new Error('The operation was aborted');
      abortErr.name = 'AbortError';
      const mockFetch = vi.fn().mockRejectedValue(abortErr);

      const adapter = new FootballDataOrgAdapter({
        apiKey: 'test-key',
        fetchFn: mockFetch,
        clockFn: mockClock,
        observer,
      });

      await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);

      expect(observer).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'provider_unavailable',
          competitionCode: 'FL1',
          failureKind: 'timeout',
        })
      );
    });

    it('émet provider_unavailable avec failureKind invalid_response si le JSON est invalide ou corrompu', async () => {
      const observer = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('Corrupted JSON {', { status: 200 })
      );

      const adapter = new FootballDataOrgAdapter({
        apiKey: 'test-key',
        fetchFn: mockFetch,
        clockFn: mockClock,
        observer,
      });

      await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);

      expect(observer).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'provider_unavailable',
          competitionCode: 'FL1',
          failureKind: 'invalid_response',
        })
      );
    });

    it('normalise les durées négatives, NaN ou exceptions de durationClock à 0', async () => {
      const observer = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ matches: [] }), { status: 200 })
      );

      // durationClock retourne une valeur diminuante (diff négative)
      let time = 1000;
      const durationClock = () => (time -= 100);

      const adapter = new FootballDataOrgAdapter({
        apiKey: 'test-key',
        fetchFn: mockFetch,
        clockFn: mockClock,
        durationClock,
        observer,
      });

      await adapter.getMatches('FL1');

      const succeededEvent = observer.mock.calls[1][0];
      expect(succeededEvent.durationMs).toBe(0);
    });

    it("n'expose aucun secret (API Key, X-Auth-Token, URL complète, Error stack) dans les événements émis", async () => {
      const observer = vi.fn();
      const mockFetch = vi.fn().mockRejectedValue(new Error('Sensitive Stack Trace'));

      const adapter = new FootballDataOrgAdapter({
        apiKey: 'secret-api-key-12345',
        baseUrl: 'https://api.football-data.org/v4',
        fetchFn: mockFetch,
        clockFn: mockClock,
        observer,
      });

      await expect(adapter.getMatches('FL1')).rejects.toThrow();

      for (const call of observer.mock.calls) {
        const eventJson = JSON.stringify(call[0]);
        expect(eventJson).not.toContain('secret-api-key-12345');
        expect(eventJson).not.toContain('X-Auth-Token');
        expect(eventJson).not.toContain('https://api.football-data.org/v4');
        expect(eventJson).not.toContain('Sensitive Stack Trace');
      }
    });

    it("n'empêche pas la propagation des erreurs métier si l'observer lève une exception", async () => {
      const faultyObserver = vi.fn().mockImplementation(() => {
        throw new Error('Observer crash');
      });

      const mockFetch = vi.fn().mockResolvedValue(new Response('Rate limit', { status: 429 }));

      const adapter = new FootballDataOrgAdapter({
        apiKey: 'test-key',
        fetchFn: mockFetch,
        clockFn: mockClock,
        observer: faultyObserver,
      });

      await expect(adapter.getMatches('FL1')).rejects.toThrow(ProviderRateLimitError);
    });
  });

  describe('mapping dynamique de competitionId (DEC-010.3)', () => {
    it('affecte le competitionCode du paramètre au champ competitionId de chaque match mappé', async () => {
      const mockPayload = {
        matches: [
          {
            id: 9991,
            utcDate: '2026-08-15T20:00:00Z',
            status: 'SCHEDULED',
            homeTeam: { id: 101, name: 'Home Team', shortName: 'Home', tla: 'HOM' },
            awayTeam: { id: 102, name: 'Away Team', shortName: 'Away', tla: 'AWY' },
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockPayload), { status: 200 })
      );

      const adapter = new FootballDataOrgAdapter({
        apiKey: 'test-key',
        fetchFn: mockFetch,
        clockFn: mockClock,
      });

      const matches = await adapter.getMatches('FL1');
      expect(matches).toHaveLength(1);
      expect(matches[0].competitionId).toBe('FL1');
      expect(matches[0].competitionId).not.toBe('FIXED_FL1_LITERAL');
    });
  });
});

