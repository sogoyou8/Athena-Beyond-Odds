import { describe, it, expect } from 'vitest';
import { FootballDataOrgAdapter } from '../../src/infrastructure/providers/football-data-org/football-data-org-adapter.js';
import { NotImplementedError } from '../../src/application/errors/index.js';

describe('SportsDataProvider Contract boundary', () => {
  it('FootballDataOrgAdapter should raise NotImplementedError', async () => {
    const adapter = new FootballDataOrgAdapter();
    expect(() => adapter.getCompetitions()).toThrow(NotImplementedError);
    await expect(async () => adapter.getMatches('FL1')).rejects.toThrow(NotImplementedError);
    await expect(async () => adapter.getMatchDetails('123')).rejects.toThrow(NotImplementedError);
  });
});
