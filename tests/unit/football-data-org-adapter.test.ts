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
  ProviderRequestRejectedError,
  ProviderUnavailableError,
} from '../../src/application/errors/index.js';
import {
  sanitizeProviderText,
} from '../../src/infrastructure/providers/football-data-org/football-data-org-adapter.js';

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
    expect(callUrl).toBe('https://api.football-data.org/v4/competitions/FL1/matches');
    expect(callUrl).not.toContain('dateFrom=');
    expect(callUrl).not.toContain('dateTo=');
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

  it('normalise tous les matchs quel que soit leur statut (DEC-019)', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          matches: [
            {
              id: 1,
              utcDate: '2026-07-28T20:00:00Z',
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

    expect(matches).toHaveLength(3);
    expect(matches.map((m) => m.id)).toEqual(['match-1', 'match-2', 'match-3']);
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

  it('demande les matchs de la saison courante sans query params quand aucune date n\'est fournie (DEC-020)', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ matches: [] }), { status: 200 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'test-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    await adapter.getMatches('FL1');

    const [callUrl] = mockFetch.mock.calls[0];
    expect(callUrl).toBe('https://api.football-data.org/v4/competitions/FL1/matches');
    expect(callUrl).not.toContain('dateFrom=');
    expect(callUrl).not.toContain('dateTo=');
  });

  it('transmet uniquement dateFrom quand seule fromDate est fournie', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ matches: [] }), { status: 200 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'test-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    await adapter.getMatches('FL1', new Date('2026-09-01T00:00:00Z'), undefined);

    const [callUrl] = mockFetch.mock.calls[0];
    expect(callUrl).toContain('dateFrom=2026-09-01');
    expect(callUrl).not.toContain('dateTo=');
  });

  it('transmet uniquement dateTo quand seule toDate est fournie', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ matches: [] }), { status: 200 })
    );

    const adapter = new FootballDataOrgAdapter({
      apiKey: 'test-key',
      fetchFn: mockFetch,
      clockFn: mockClock,
    });

    await adapter.getMatches('FL1', undefined, new Date('2026-09-08T00:00:00Z'));

    const [callUrl] = mockFetch.mock.calls[0];
    expect(callUrl).toContain('dateTo=2026-09-08');
    expect(callUrl).not.toContain('dateFrom=');
  });

  describe('Phase 2.11 — Observabilité de l\'Adaptateur Fournisseur (DEC-009)', () => {
    it('émet provider_request_started et provider_request_succeeded lors d\'une requête réussie avec dates explicites', async () => {
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

      const from = new Date('2026-07-30T12:00:00.000Z');
      const to = new Date('2026-08-06T12:00:00.000Z');
      await adapter.getMatches('FL1', from, to);

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

    it('émet provider_request_started et provider_request_succeeded sans dates lors d\'une requête sans bornes (DEC-020)', async () => {
      const observer = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ matches: [] }), { status: 200 })
      );

      let timeCall = 0;
      const durationClock = () => {
        timeCall += 40;
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
        dateFrom: '',
        dateTo: '',
      });

      expect(observer).toHaveBeenNthCalledWith(2, {
        type: 'provider_request_succeeded',
        competitionCode: 'FL1',
        dateFrom: '',
        dateTo: '',
        durationMs: 40,
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
  // ================================================================
  // DEC-021 — ProviderRequestRejectedError (HTTP 400)
  // Tous ces tests utilisent mockFetch — aucun appel réseau réel.
  // ================================================================
  describe('DEC-021 — ProviderRequestRejectedError (HTTP 400)', () => {

    const makeAdapter = (fetchFn: ReturnType<typeof vi.fn>) =>
      new FootballDataOrgAdapter({
        apiKey: 'test-key-never-exposed',
        fetchFn,
        clockFn: mockClock,
      });

    // A. Body JSON avec champ message
    it('A. l\'ve ProviderRequestRejectedError avec providerMessage extrait du champ message', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'invalid date range' }), { status: 400 })
      );
      const err = await makeAdapter(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      expect(err.upstreamStatus).toBe(400);
      expect(err.providerMessage).toBe('invalid date range');
    });

    // B. Caractères de contrôle / newline dans le message
    it('B. sanitise les caractères de contrôle et newlines du providerMessage', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'bad\nrequest\x00injected' }), { status: 400 })
      );
      const err = await makeAdapter(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      // Aucun \n ni \x00 dans le message sanitisé
      expect(err.providerMessage).not.toMatch(/\n|\r|\x00/);
    });

    // C. Message > 256 caractères -> tronqué
    it('C. tronque providerMessage à 256 caractères maximum', async () => {
      const longMsg = 'x'.repeat(300);
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: longMsg }), { status: 400 })
      );
      const err = await makeAdapter(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      expect(err.providerMessage!.length).toBeLessThanOrEqual(256);
    });

    // D. Champ error sans message -> fallback whitelist
    it('D. utilise le champ error comme fallback si message est absent', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: 'DATE_FILTER_UNSUPPORTED' }), { status: 400 })
      );
      const err = await makeAdapter(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      expect(err.providerMessage).toBe('DATE_FILTER_UNSUPPORTED');
    });

    // E. Champ errorCode -> providerCode extrait
    it('E. extrait providerCode depuis le champ errorCode', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'err', errorCode: 'ERR_DATES' }), { status: 400 })
      );
      const err = await makeAdapter(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      expect(err.providerCode).toBe('ERR_DATES');
    });

    // F. Aucun champ whitelist -> diagnostic générique
    it('F. l\'ve ProviderRequestRejectedError avec diagnostic générique si aucun champ whitelist', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ unrelated: 'data', deep: { obj: true } }), { status: 400 })
      );
      const err = await makeAdapter(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      expect(err.providerMessage).toBeUndefined();
      expect(err.providerCode).toBeUndefined();
    });

    // G. Body non JSON -> ProviderRequestRejectedError sans parsing secondaire
    it('G. body non-JSON -> ProviderRequestRejectedError sans erreur secondaire, aucun raw text', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('Plain text error not JSON', { status: 400 })
      );
      const err = await makeAdapter(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      expect(err.providerMessage).toBeUndefined();
      // Le message général ne contient pas le raw text
      expect(err.message).not.toContain('Plain text error not JSON');
    });

    // H. Objet/array dans un champ whitelist -> ignoré
    it('H. ignore les objets et tableaux dans les champs whitelist', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: { nested: 'object' }, error: ['array'] }),
          { status: 400 }
        )
      );
      const err = await makeAdapter(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      // Ni le JSON de l'objet ni celui du tableau ne doivent être dans le diagnostic
      expect(err.providerMessage).toBeUndefined();
    });

    // I. La clé API de test n'apparaît pas dans le diagnostic
    it('I. le diagnostic ne contient jamais la clé API', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'test-key-never-exposed is invalid' }), { status: 400 })
      );
      // On vérifie que la classe ne stoque pas la clé comme propriété interne
      const err = await makeAdapter(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      // Champs structurels (non exposés)
      expect(Object.keys(err)).not.toContain('apiKey');
      expect(Object.keys(err)).not.toContain('token');
      expect(Object.keys(err)).not.toContain('X-Auth-Token');
      // Valeur réelle du token absente de providerMessage (E-2 renforcement)
      expect(err.providerMessage).not.toContain('test-key-never-exposed');
      // Placeholder présent (redaction effective)
      expect(err.providerMessage).toContain('[REDACTED]');
      // JSON.stringify de l'erreur complète ne contient pas le token
      expect(JSON.stringify(err)).not.toContain('test-key-never-exposed');
    });

    // J. (renforcé) erreur sérialisée ne contient ni X-Auth-Token ni valeur apiKey
    it('J. (renforcé) erreur sérialisée ne contient ni X-Auth-Token ni valeur apiKey', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'rejected' }), { status: 400 })
      );
      const err = await makeAdapter(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      const errJson = JSON.stringify(err);
      expect(errJson).not.toContain('X-Auth-Token');
      expect(errJson).not.toContain('test-key-never-exposed');
    });

    // ================================================================
    // E-1 / E-2 — REDACTION DU TOKEN DANS LE DIAGNOSTIC (DEC-021.7)
    // Secret fictif : TEST_SECRET_ABC_987654
    // Aucun vrai token utilisé.
    // ================================================================

    const FAKE_SECRET = 'TEST_SECRET_ABC_987654';

    const makeAdapterWithSecret = (fetchFn: ReturnType<typeof vi.fn>, apiKey = FAKE_SECRET) =>
      new FootballDataOrgAdapter({
        apiKey,
        fetchFn,
        clockFn: mockClock,
      });

    // E-1-a. Token dans le champ message — doit être redacté dans providerMessage
    it('E-1-a. redacte le token dans providerMessage si le provider l\'écho dans message', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: `invalid token ${FAKE_SECRET} provided` }),
          { status: 400 }
        )
      );
      const err = await makeAdapterWithSecret(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      // Secret absent de providerMessage
      expect(err.providerMessage).not.toContain(FAKE_SECRET);
      // Placeholder présent
      expect(err.providerMessage).toContain('[REDACTED]');
      // Secret absent de JSON.stringify(error)
      expect(JSON.stringify(err)).not.toContain(FAKE_SECRET);
    });

    // E-1-b. Token dans le champ errorCode — doit être redacté dans providerCode
    it('E-1-b. redacte le token dans providerCode si présent dans errorCode', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: 'bad request', errorCode: `ERR_${FAKE_SECRET}` }),
          { status: 400 }
        )
      );
      const err = await makeAdapterWithSecret(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      expect(err.providerCode).not.toContain(FAKE_SECRET);
      expect(err.providerCode).toContain('[REDACTED]');
    });

    // E-1-c. Token dans le champ code — sous-chaîne
    it('E-1-c. redacte le token même en tant que sous-chaîne dans code', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ code: `PREFIX_${FAKE_SECRET}_SUFFIX` }),
          { status: 400 }
        )
      );
      const err = await makeAdapterWithSecret(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      expect(err.providerCode).not.toContain(FAKE_SECRET);
      expect(err.providerCode).toContain('[REDACTED]');
    });

    // E-1-d. Occurrences multiples du token dans le même message
    it('E-1-d. redacte TOUTES les occurrences multiples du token', async () => {
      const msgWithMultiple = `${FAKE_SECRET} x ${FAKE_SECRET}`;
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: msgWithMultiple }), { status: 400 })
      );
      const err = await makeAdapterWithSecret(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      expect(err.providerMessage).not.toContain(FAKE_SECRET);
      // Les deux occurrences doivent être remplacées
      expect(err.providerMessage?.includes(FAKE_SECRET)).toBe(false);
    });

    // E-1-e. Redaction AVANT troncature — frontière des 256 chars
    it('E-1-e. la redaction s\'applique avant la troncature (frontière 256)', async () => {
      // Construire un message dont le token se trouve pile à la frontière de troncature
      // préfixe de 240 chars + token de 22 chars = 262 chars total
      const prefix = 'a'.repeat(240);
      const msgWithSecret = `${prefix}${FAKE_SECRET}X`; // 263 chars
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: msgWithSecret }), { status: 400 })
      );
      const err = await makeAdapterWithSecret(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      // La longueur finale doit être <= 256
      expect(err.providerMessage!.length).toBeLessThanOrEqual(256);
      // Aucun fragment du token ne doit survivre (la valeur complète ou un fragment)
      expect(err.providerMessage).not.toContain(FAKE_SECRET);
    });

    // E-2-a. Telemetry anti-fuite — le secret ne doit pas apparaître dans l'event provider_request_rejected
    it('E-2-a. l\'event telemetry provider_request_rejected ne contient pas le token', async () => {
      const observedEvents: unknown[] = [];
      const fakeObserver = (event: unknown) => { observedEvents.push(event); };

      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: `provider echoed ${FAKE_SECRET}` }),
          { status: 400 }
        )
      );

      const adapter = new FootballDataOrgAdapter({
        apiKey: FAKE_SECRET,
        fetchFn: mockFetch,
        clockFn: mockClock,
        observer: fakeObserver as Parameters<typeof FootballDataOrgAdapter>[0]['observer'],
      });

      await adapter.getMatches('FL1').catch(() => {});

      // Exactement 1 event provider_request_rejected
      const rejectedEvents = observedEvents.filter(
        (e) => (e as { type: string }).type === 'provider_request_rejected'
      );
      expect(rejectedEvents).toHaveLength(1);

      // Aucun event provider_unavailable pour ce même 400
      const unavailableEvents = observedEvents.filter(
        (e) => (e as { type: string }).type === 'provider_unavailable'
      );
      expect(unavailableEvents).toHaveLength(0);

      // Le secret ne doit pas figurer dans l'event sérialisé
      const eventJson = JSON.stringify(rejectedEvents[0]);
      expect(eventJson).not.toContain(FAKE_SECRET);
      // Le placeholder peut être présent dans providerMessage
      expect(eventJson).toContain('[REDACTED]');
    });

    // E-2-b. Body non-JSON avec texte sensible fictif — aucun raw text dans erreur ni telemetry
    it('E-2-b. body non-JSON sensible -> diagnostic générique, secret absent erreur et telemetry', async () => {
      const observedEvents: unknown[] = [];
      const fakeObserver = (event: unknown) => { observedEvents.push(event); };

      const mockFetch = vi.fn().mockResolvedValue(
        new Response(`${FAKE_SECRET} RAW SENSITIVE TEXT`, { status: 400 })
      );

      const adapter = new FootballDataOrgAdapter({
        apiKey: FAKE_SECRET,
        fetchFn: mockFetch,
        clockFn: mockClock,
        observer: fakeObserver as Parameters<typeof FootballDataOrgAdapter>[0]['observer'],
      });

      const err = await adapter.getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      // Diagnostic générique
      expect(err.providerMessage).toBeUndefined();
      expect(err.providerCode).toBeUndefined();
      // Secret absent de l'erreur
      expect(JSON.stringify(err)).not.toContain(FAKE_SECRET);
      // Secret absent de la telemetry
      const eventJson = JSON.stringify(observedEvents);
      expect(eventJson).not.toContain(FAKE_SECRET);
    });

    // E-2-c. Objets/arrays avec secret imbriqué — ignorés, aucune sérialisation
    it('E-2-c. objets/arrays avec secret imbriqué -> ignorés, secret absent', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message: { secret: FAKE_SECRET },
            error: [FAKE_SECRET],
          }),
          { status: 400 }
        )
      );
      const err = await makeAdapterWithSecret(mockFetch).getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      expect(err.providerMessage).toBeUndefined();
      expect(JSON.stringify(err)).not.toContain(FAKE_SECRET);
    });

    // E-2-d. Token absent si apiKey est vide — protection contre remplacement de chaîne vide
    it('E-2-d. aucune redaction si apiKey est vide (protection contre remplacement vide)', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'normal date error' }), { status: 400 })
      );
      // Adaptateur sans apiKey (chaîne vide)
      const adapterNoKey = new FootballDataOrgAdapter({
        apiKey: '',
        fetchFn: mockFetch,
        clockFn: mockClock,
      });
      const err = await adapterNoKey.getMatches('FL1').catch((e) => e);
      expect(err).toBeInstanceOf(ProviderRequestRejectedError);
      // Le message doit rester intact (pas de remplacement de chaîne vide)
      expect(err.providerMessage).toBe('normal date error');
    });

    // K. 401 — non-régression
    it('K. HTTP 401 reste ProviderUnavailableError (non-régression)', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('Unauthorized', { status: 401 })
      );
      await expect(makeAdapter(mockFetch).getMatches('FL1')).rejects.toBeInstanceOf(ProviderUnavailableError);
    });

    // L. 403 — non-régression
    it('L. HTTP 403 reste ProviderUnavailableError (non-régression)', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('Forbidden', { status: 403 })
      );
      await expect(makeAdapter(mockFetch).getMatches('FL1')).rejects.toBeInstanceOf(ProviderUnavailableError);
    });

    // M. 429 — non-régression
    it('M. HTTP 429 reste ProviderRateLimitError (non-régression)', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('Rate limit', { status: 429 })
      );
      await expect(makeAdapter(mockFetch).getMatches('FL1')).rejects.toBeInstanceOf(ProviderRateLimitError);
    });

    // N. 500 — non-régression
    it('N. HTTP 500 reste ProviderUnavailableError (non-régression)', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('Server error', { status: 500 })
      );
      await expect(makeAdapter(mockFetch).getMatches('FL1')).rejects.toBeInstanceOf(ProviderUnavailableError);
    });

    // O. Erreur réseau — non-régression
    it('O. erreur réseau reste ProviderUnavailableError (non-régression)', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new TypeError('Network failure'));
      await expect(makeAdapter(mockFetch).getMatches('FL1')).rejects.toBeInstanceOf(ProviderUnavailableError);
    });

    // P. JSON invalide en succès — non-régression
    it('P. succès HTTP avec JSON invalide reste ProviderUnavailableError (non-régression)', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('not-valid-json', { status: 200 })
      );
      await expect(makeAdapter(mockFetch).getMatches('FL1')).rejects.toBeInstanceOf(ProviderUnavailableError);
    });

    // sanitizeProviderText unité — test la fonction pure directement
    it('sanitizeProviderText: retourne undefined pour objet, null, undefined, tableau', () => {
      expect(sanitizeProviderText({})).toBeUndefined();
      expect(sanitizeProviderText(null)).toBeUndefined();
      expect(sanitizeProviderText(undefined)).toBeUndefined();
      expect(sanitizeProviderText([])).toBeUndefined();
    });

    it('sanitizeProviderText: tronque correctement à la limite donnée', () => {
      expect(sanitizeProviderText('a'.repeat(300), 256)!.length).toBe(256);
      expect(sanitizeProviderText('a'.repeat(10), 256)!.length).toBe(10);
    });

    it('sanitizeProviderText: supprime les caractères de contrôle', () => {
      const result = sanitizeProviderText('line1\nline2\x00end');
      expect(result).not.toMatch(/[\x00-\x1F\x7F]/);
    });

    it('sanitizeProviderText: redacte le secret dans la sortie', () => {
      const result = sanitizeProviderText('invalid token TEST_SECRET_ABC_987654 here', 256, ['TEST_SECRET_ABC_987654']);
      expect(result).not.toContain('TEST_SECRET_ABC_987654');
      expect(result).toContain('[REDACTED]');
    });

    it('sanitizeProviderText: redacte toutes les occurrences du secret', () => {
      const result = sanitizeProviderText('TEST_SECRET_ABC_987654 x TEST_SECRET_ABC_987654', 256, ['TEST_SECRET_ABC_987654']);
      expect(result).not.toContain('TEST_SECRET_ABC_987654');
      // [REDACTED] doit apparaître deux fois
      expect(result?.split('[REDACTED]').length).toBe(3); // 2 remplacements = 3 fragments
    });

    it('sanitizeProviderText: ignore les secrets vides dans secretsToRedact', () => {
      const result = sanitizeProviderText('hello world', 256, ['', 'world']);
      // '' ne doit pas provoquer un remplacement de chaque char, 'world' redacté
      expect(result).not.toContain('world');
      expect(result).toContain('[REDACTED]');
      expect(result).toContain('hello');
    });

    it('sanitizeProviderText: la redaction précède la troncature (token à la frontière)', () => {
      // Préfixe de 240 + token de 22 = 262 chars (avant remplacement)
      const prefix = 'a'.repeat(240);
      const secret = 'TEST_SECRET_ABC_987654'; // 22 chars
      const input = `${prefix}${secret}X`; // 263 chars
      const result = sanitizeProviderText(input, 256, [secret]);
      expect(result!.length).toBeLessThanOrEqual(256);
      expect(result).not.toContain(secret);
    });
  });
});
