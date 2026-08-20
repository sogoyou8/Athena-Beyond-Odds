import { describe, it, expect } from 'vitest';
import { InMemorySportsDataProvider } from '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js';

describe('InMemorySportsDataProvider', () => {
  const provider = new InMemorySportsDataProvider();

  describe('getMatches("FL1")', () => {
    it('returns all 20 normalized matches (SCHEDULED + FINISHED) (DEC-019)', async () => {
      const matches = await provider.getMatches('FL1');
      expect(matches).toHaveLength(20);
    });

    it('contains both SCHEDULED and FINISHED statuses', async () => {
      const matches = await provider.getMatches('FL1');
      const statuses = new Set(matches.map((m) => m.status));
      expect(statuses).toContain('SCHEDULED');
      expect(statuses).toContain('FINISHED');
    });

    it('contains the exact approved UTC timestamps', async () => {
      const matches = await provider.getMatches('FL1');
      const isoTimes = matches.map((m) => m.utcDate.toISOString());
      expect(isoTimes).toContain('2099-08-14T18:00:00.000Z');
      expect(isoTimes).toContain('2099-08-15T20:00:00.000Z');
      expect(isoTimes).toContain('2099-08-16T19:30:00.000Z');
    });

    it('is deterministic between two consecutive calls', async () => {
      const first = await provider.getMatches('FL1');
      const second = await provider.getMatches('FL1');
      expect(first.map((m) => m.id)).toEqual(second.map((m) => m.id));
    });

    it('all team names are fictional (no real Ligue 1 clubs)', async () => {
      const matches = await provider.getMatches('FL1');
      const names = matches.flatMap((m) => [m.homeTeam.name, m.awayTeam.name]);
      const realClubs = ['PSG', 'Olympique', 'Monaco', 'Lens', 'Lyon', 'Lille'];
      for (const club of realClubs) {
        for (const name of names) {
          expect(name).not.toContain(club);
        }
      }
    });

    it('providerName is "in-memory" for all entities', async () => {
      const matches = await provider.getMatches('FL1');
      for (const match of matches) {
        expect(match.providerMetadata.providerName).toBe('in-memory');
        expect(match.homeTeam.providerMetadata.providerName).toBe('in-memory');
        expect(match.awayTeam.providerMetadata.providerName).toBe('in-memory');
      }
    });
  });

  describe('getMatches("FL1") — strict temporal bounds (DEC-020)', () => {
    it('returns [] when fromDate+toDate window is entirely before fixtures (e.g. 2026 window)', async () => {
      // Ce test garantit qu'aucun fallback n'existe : si la fenêtre ne contient aucune fixture,
      // le provider retourne strictement [] et NON les fixtures hors fenêtre.
      const from = new Date('2026-08-20T00:00:00.000Z');
      const to = new Date('2026-08-27T00:00:00.000Z');
      const matches = await provider.getMatches('FL1', from, to);
      expect(matches).toHaveLength(0);
    });

    it('returns [] when fromDate alone excludes all fixtures', async () => {
      const from = new Date('2100-01-01T00:00:00.000Z');
      const matches = await provider.getMatches('FL1', from);
      expect(matches).toHaveLength(0);
    });

    it('returns [] when toDate alone excludes all fixtures', async () => {
      const to = new Date('2026-12-31T23:59:59.999Z');
      const matches = await provider.getMatches('FL1', undefined, to);
      expect(matches).toHaveLength(0);
    });

    it('returns only fixtures within a 2099 window containing SCHEDULED matches', async () => {
      // Fenêtre [2099-08-11, 2099-08-17] : après le dernier match FINISHED (2099-08-10T18:00), contient les 3 SCHEDULED
      const from = new Date('2099-08-11T00:00:00.000Z');
      const to = new Date('2099-08-17T12:00:00.000Z');
      const matches = await provider.getMatches('FL1', from, to);
      const statuses = matches.map((m) => m.status);
      expect(statuses.every((s) => s === 'SCHEDULED')).toBe(true);
      expect(matches).toHaveLength(3);
    });

    it('returns only FINISHED matches when window covers historical range only', async () => {
      const from = new Date('2099-07-01T00:00:00.000Z');
      const to = new Date('2099-08-10T11:59:59.999Z');
      const matches = await provider.getMatches('FL1', from, to);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.every((m) => m.status === 'FINISHED')).toBe(true);
    });
  });

  describe('IN_MEMORY_REFERENCE_NOW', () => {
    it('is exported and is a valid Date', async () => {
      const { IN_MEMORY_REFERENCE_NOW } = await import(
        '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js'
      );
      expect(IN_MEMORY_REFERENCE_NOW).toBeInstanceOf(Date);
      expect(Number.isNaN(IN_MEMORY_REFERENCE_NOW.getTime())).toBe(false);
    });

    it('is before the first SCHEDULED fixture (2099-08-14)', async () => {
      const { IN_MEMORY_REFERENCE_NOW } = await import(
        '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js'
      );
      const firstScheduled = new Date('2099-08-14T18:00:00.000Z');
      expect(IN_MEMORY_REFERENCE_NOW < firstScheduled).toBe(true);
    });

    it('places all 3 SCHEDULED fixtures within the [now, now+7d] window', async () => {
      const { IN_MEMORY_REFERENCE_NOW } = await import(
        '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js'
      );
      const windowEnd = new Date(IN_MEMORY_REFERENCE_NOW.getTime() + 7 * 24 * 60 * 60 * 1000);
      const matches = await provider.getMatches('FL1', IN_MEMORY_REFERENCE_NOW, windowEnd);
      const scheduledInWindow = matches.filter((m) => m.status === 'SCHEDULED');
      expect(scheduledInWindow).toHaveLength(3);
    });
  });

  describe('getMatches() for another competition', () => {
    it('returns an empty array for "PL"', async () => {
      const matches = await provider.getMatches('PL');
      expect(matches).toEqual([]);
    });

    it('returns an empty array for "CL"', async () => {
      const matches = await provider.getMatches('CL');
      expect(matches).toEqual([]);
    });
  });

  describe('getCompetitions()', () => {
    it('throws NotImplementedError', () => {
      expect(() => provider.getCompetitions()).toThrow('Non implémenté');
    });
  });

  describe('getMatchDetails()', () => {
    it('throws NotImplementedError', async () => {
      await expect(
        async () => provider.getMatchDetails('any-id')
      ).rejects.toThrow('Non implémenté');
    });
  });
});
