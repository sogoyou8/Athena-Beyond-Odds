import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkHealth, fetchScheduledMatches } from '../../src/frontend/ts/api-client.js';

describe('API Client Frontend Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('checkHealth', () => {
    it('doit effectuer une requête relative vers /health et retourner true si status 200', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
      });

      const result = await checkHealth(mockFetch as unknown as typeof fetch);

      expect(mockFetch).toHaveBeenCalledWith('/health');
      expect(result).toBe(true);
    });

    it('doit retourner false si la réponse /health est non-ok (500)', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      const result = await checkHealth(mockFetch as unknown as typeof fetch);

      expect(mockFetch).toHaveBeenCalledWith('/health');
      expect(result).toBe(false);
    });

    it('doit retourner false en cas de rejet réseau de fetch', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network failure'));

      const result = await checkHealth(mockFetch as unknown as typeof fetch);

      expect(mockFetch).toHaveBeenCalledWith('/health');
      expect(result).toBe(false);
    });
  });

  describe('fetchScheduledMatches', () => {
    it('doit effectuer une requête relative vers /competitions/FL1/matches par défaut', async () => {
      const mockMatches = [
        {
          id: 'm1',
          competitionId: 'FL1',
          seasonId: '2025',
          matchday: 1,
          utcDate: '2026-08-15T20:00:00Z',
          status: 'SCHEDULED',
          homeTeam: { id: 't1', name: 'PSG', shortName: 'PSG', tla: 'PSG', crestUrl: null },
          awayTeam: { id: 't2', name: 'OM', shortName: 'OM', tla: 'OM', crestUrl: null },
          score: { home: null, away: null },
        },
      ];

      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        json: async () => mockMatches,
      });

      const result = await fetchScheduledMatches('FL1', mockFetch as unknown as typeof fetch);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('/competitions/FL1/matches');
      expect(result).toEqual({ type: 'success', data: mockMatches });
    });

    it('doit mapper un statut HTTP 404 vers competitionUnavailable', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 404,
      });

      const result = await fetchScheduledMatches('PL', mockFetch as unknown as typeof fetch);

      expect(mockFetch).toHaveBeenCalledWith('/competitions/PL/matches');
      expect(result).toEqual({ type: 'competitionUnavailable' });
    });

    it('doit mapper un statut HTTP 429 vers rateLimited', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 429,
      });

      const result = await fetchScheduledMatches('FL1', mockFetch as unknown as typeof fetch);

      expect(result).toEqual({ type: 'rateLimited' });
    });

    it('doit mapper un statut HTTP 503 vers providerUnavailable', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 503,
      });

      const result = await fetchScheduledMatches('FL1', mockFetch as unknown as typeof fetch);

      expect(result).toEqual({ type: 'providerUnavailable' });
    });

    it('doit mapper une erreur rejetée par fetch vers networkError sans retry automatique', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

      const result = await fetchScheduledMatches('FL1', mockFetch as unknown as typeof fetch);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ type: 'networkError' });
    });

    it('doit mapper un statut HTTP inattendu (500) vers unexpectedError', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 500,
      });

      const result = await fetchScheduledMatches('FL1', mockFetch as unknown as typeof fetch);

      expect(result).toEqual({ type: 'unexpectedError' });
    });
  });
});
