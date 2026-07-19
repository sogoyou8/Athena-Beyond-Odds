import { describe, it, expect } from 'vitest';
import { FootballDataOrgAdapter } from '../../src/infrastructure/providers/football-data-org/football-data-org-adapter.js';
import { InMemoryCache } from '../../src/infrastructure/cache/memory/in-memory-cache.js';
import { NotImplementedError } from '../../src/application/errors/index.js';
import type { SportsDataProvider } from '../../src/application/ports/sports-data-provider.js';

describe('Contracts and Boundaries verification', () => {
  it('FootballDataOrgAdapter should implement SportsDataProvider and throw NotImplementedError', async () => {
    const adapter = new FootballDataOrgAdapter();
    expect(() => adapter.getCompetitions()).toThrow(NotImplementedError);
    await expect(async () => adapter.getMatches('FL1')).rejects.toThrow(NotImplementedError);
    await expect(async () => adapter.getMatchDetails('123')).rejects.toThrow(NotImplementedError);
  });

  it('InMemoryCache should act as a simple transparent boundary delegation', async () => {
    const dummyProvider: SportsDataProvider = {
      getCompetitions: async () => [],
      getMatches: async () => [],
      getMatchDetails: async () => { throw new Error('Not used'); }
    };
    const cache = new InMemoryCache(dummyProvider);
    const comps = await cache.getCompetitions();
    expect(comps).toEqual([]);
  });
});
