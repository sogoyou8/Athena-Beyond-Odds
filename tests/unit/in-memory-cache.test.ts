import { describe, it, expect } from 'vitest';
import { InMemoryCache } from '../../src/infrastructure/cache/memory/in-memory-cache.js';
import type { SportsDataProvider } from '../../src/application/ports/sports-data-provider.js';

describe('InMemoryCache boundary decoration', () => {
  it('should delegate calls transparently', async () => {
    const dummyProvider: SportsDataProvider = {
      getCompetitions: async () => [],
      getMatches: async () => [],
      getMatchDetails: async () => { throw new Error('Not used'); }
    };
    const cache = new InMemoryCache(dummyProvider);
    const result = await cache.getCompetitions();
    expect(result).toEqual([]);
  });
});
