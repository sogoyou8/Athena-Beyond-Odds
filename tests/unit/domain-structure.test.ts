import { describe, it, expect } from 'vitest';
import type { Team } from '../../src/domain/entities/team.js';
import type { Season } from '../../src/domain/entities/season.js';
import type { Competition } from '../../src/domain/entities/competition.js';
import type { Match } from '../../src/domain/entities/match.js';
import type { MatchStatus } from '../../src/domain/value-objects/match-status.js';
import type { Score } from '../../src/domain/value-objects/score.js';
import type { ProviderMetadata } from '../../src/domain/value-objects/provider-metadata.js';

describe('Domain structural validation', () => {
  it('should define value objects types', () => {
    const status: MatchStatus = 'SCHEDULED';
    const score: Score = {
      halfTime: { home: null, away: null },
      fullTime: { home: null, away: null }
    };
    const metadata: ProviderMetadata = {
      providerName: 'mock',
      externalId: 'ext-1',
      lastUpdated: new Date()
    };
    expect(status).toBe('SCHEDULED');
    expect(score.halfTime.home).toBeNull();
    expect(metadata.providerName).toBe('mock');
  });

  it('should define entities types', () => {
    const team: Team = {
      id: 'team-1',
      name: 'PSG',
      shortName: 'PSG',
      tla: 'PSG',
      crestUrl: null,
      providerMetadata: {
        providerName: 'mock',
        externalId: 'ext-t1',
        lastUpdated: new Date()
      }
    };

    const season: Season = {
      id: 'season-1',
      startYear: 2026,
      endYear: 2027,
      currentMatchday: 1,
      providerMetadata: {
        providerName: 'mock',
        externalId: 'ext-s1',
        lastUpdated: new Date()
      }
    };

    const competition: Competition = {
      id: 'comp-1',
      name: 'Ligue 1',
      code: 'FL1',
      areaName: 'France',
      currentSeason: season,
      providerMetadata: {
        providerName: 'mock',
        externalId: 'ext-c1',
        lastUpdated: new Date()
      }
    };

    const match: Match = {
      id: 'match-1',
      competitionId: 'comp-1',
      seasonId: 'season-1',
      matchday: 1,
      utcDate: new Date(),
      status: 'SCHEDULED',
      homeTeam: team,
      awayTeam: team,
      score: {
        halfTime: { home: null, away: null },
        fullTime: { home: null, away: null }
      },
      providerMetadata: {
        providerName: 'mock',
        externalId: 'ext-m1',
        lastUpdated: new Date()
      }
    };

    expect(match.id).toBe('match-1');
    expect(competition.name).toBe('Ligue 1');
  });
});
