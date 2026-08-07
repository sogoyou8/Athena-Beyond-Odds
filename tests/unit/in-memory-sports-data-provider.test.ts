import { describe, it, expect } from 'vitest';
import { InMemorySportsDataProvider } from '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js';

describe('InMemorySportsDataProvider', () => {
  const provider = new InMemorySportsDataProvider();

  describe('getMatches("FL1")', () => {
    it('returns exactly 3 matches', async () => {
      const matches = await provider.getMatches('FL1');
      expect(matches).toHaveLength(3);
    });

    it('all matches have status SCHEDULED', async () => {
      const matches = await provider.getMatches('FL1');
      for (const match of matches) {
        expect(match.status).toBe('SCHEDULED');
      }
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
