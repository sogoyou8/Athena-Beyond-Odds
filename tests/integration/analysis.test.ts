/**
 * Tests d'intégration / contrat — GET /competitions/:code/matches/analysis (Form 5 + Season Strength DEC-024).
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { SportsDataProvider } from '../../src/application/ports/sports-data-provider.js';
import { Match } from '../../src/domain/entities/match.js';
import { Competition } from '../../src/domain/entities/competition.js';
import { InMemorySportsDataProvider, IN_MEMORY_REFERENCE_NOW } from '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js';

describe('GET /competitions/FL1/matches/analysis (Form 5 & Season Strength DEC-024)', () => {
  const app = createApp();

  it('returns HTTP 200 with competitionCode and matches array', async () => {
    const res = await request(app)
      .get('/competitions/FL1/matches/analysis')
      .expect(200);

    expect(res.body).toHaveProperty('competitionCode', 'FL1');
    expect(res.body).toHaveProperty('matches');
    expect(Array.isArray(res.body.matches)).toBe(true);
    expect(res.body.matches).toHaveLength(3);
  });

  it('returns Form 5 structure for home and away teams on each match', async () => {
    const res = await request(app)
      .get('/competitions/FL1/matches/analysis')
      .expect(200);

    const first = res.body.matches[0];
    expect(first).toHaveProperty('match');
    expect(first).toHaveProperty('form');
    expect(first.form).toHaveProperty('home');
    expect(first.form).toHaveProperty('away');

    // Home: Alpha (6 historical FINISHED -> 5 retained, AVAILABLE)
    expect(first.form.home.availability).toBe('AVAILABLE');
    expect(first.form.home.results).toHaveLength(5);
    expect(first.form.home.results).toEqual(['WIN', 'WIN', 'LOSS', 'DRAW', 'LOSS']);

    // Away: Beta (5 historical FINISHED -> 5 retained, AVAILABLE)
    expect(first.form.away.availability).toBe('AVAILABLE');
    expect(first.form.away.results).toHaveLength(5);
  });

  it('DEC-024: returns Season Strength structure with overall and contextual segments for home and away teams', async () => {
    const res = await request(app)
      .get('/competitions/FL1/matches/analysis')
      .expect(200);

    const first = res.body.matches[0];
    expect(first).toHaveProperty('seasonStrength');
    expect(first.seasonStrength).toHaveProperty('home');
    expect(first.seasonStrength).toHaveProperty('away');

    // Home team: Alpha — tous les matchs FINISHED avant la date du match (2099-08-14T18:00:00Z)
    // hist-101 (2099-08-10 WIN), hist-102 (2099-08-07 WIN), hist-103 (2099-08-03 D),
    // hist-104 (2099-07-28 L), hist-105 (2099-07-21 L), hist-106 (2099-07-14 W),
    // hist-201 (2099-08-05 Beta home vs Alpha: Alpha LOSS), hist-403 (2099-07-28T14 Delta vs Alpha: DRAW)
    // = 8 matchs éligibles
    const homeStrength = first.seasonStrength.home;
    expect(homeStrength.teamId).toBe('team-alpha-001');
    expect(homeStrength.overall.availability).toBe('AVAILABLE');
    expect(homeStrength.overall.sampleSize).toBe(8);
    expect(homeStrength.overall.metrics).not.toBeNull();
    expect(homeStrength.overall.metrics.played).toBe(8);
    // W=3 (hist-101,102,106), D=2 (hist-103,hist-403), L=3 (hist-104,hist-105,hist-201)
    expect(homeStrength.overall.metrics.wins).toBe(3);
    expect(homeStrength.overall.metrics.draws).toBe(2);
    expect(homeStrength.overall.metrics.losses).toBe(3);
    expect(homeStrength.overall.metrics.points).toBe(11); // 3*3 + 2*1 = 11
    expect(homeStrength.overall.metrics.pointsPerMatch).toBeCloseTo(11 / 8, 6);

    // Contextual for Alpha: venue is HOME (seuls matchs où Alpha est domicile)
    // hist-101 (home W), hist-103 (home D), hist-104 (home L), hist-106 (home W) = 4 matchs HOME
    expect(homeStrength.contextual.venue).toBe('HOME');
    expect(homeStrength.contextual.segment.availability).toBe('AVAILABLE');
    expect(homeStrength.contextual.segment.sampleSize).toBe(4);

    // Away team: Beta — matchs FINISHED avant 2099-08-14T18:00:00Z
    // Beta participe à : hist-104 (Beta away vs Alpha), hist-105 (Beta home vs Alpha),
    //   hist-201 (Beta home vs Alpha), hist-202 (Epsilon home vs Beta),
    //   hist-301 (Gamma home vs Beta), hist-302 (Beta home vs Gamma), hist-402 (Beta home vs Delta)
    // = 7 matchs, contextual AWAY = hist-104 (Beta away), hist-202 (Beta away), hist-301 (Beta away) = 3 matchs
    const awayStrength = first.seasonStrength.away;
    expect(awayStrength.teamId).toBe('team-beta-002');
    expect(awayStrength.overall.availability).toBe('AVAILABLE');
    expect(awayStrength.overall.sampleSize).toBe(7);
    expect(awayStrength.contextual.venue).toBe('AWAY');
    expect(awayStrength.contextual.segment.availability).toBe('AVAILABLE');
  });

  it('DEC-024: returns INSUFFICIENT_DATA for Season Strength when team has 0 FINISHED matches (Zeta Rovers)', async () => {
    const res = await request(app)
      .get('/competitions/FL1/matches/analysis')
      .expect(200);

    // Match 3: Epsilon vs Zeta
    const match3 = res.body.matches[2];
    expect(match3.seasonStrength.away.teamId).toBe('team-zeta-006');
    expect(match3.seasonStrength.away.overall.availability).toBe('INSUFFICIENT_DATA');
    expect(match3.seasonStrength.away.overall.sampleSize).toBe(0);
    expect(match3.seasonStrength.away.overall.metrics).toBeNull();
    expect(match3.seasonStrength.away.contextual.venue).toBe('AWAY');
    expect(match3.seasonStrength.away.contextual.segment.availability).toBe('INSUFFICIENT_DATA');
    expect(match3.seasonStrength.away.contextual.segment.sampleSize).toBe(0);
    expect(match3.seasonStrength.away.contextual.segment.metrics).toBeNull();
  });

  it('returns HTTP 404 for unknown competition code', async () => {
    await request(app)
      .get('/competitions/UNKNOWN/matches/analysis')
      .expect(404);
  });

  it('anti N+1 proof: calling analysis execute performs at most 2 getMatches calls to provider (1 primary + 1 mutualized historical) per DEC-020 & DEC-024', async () => {
    let callsCount = 0;
    const recordedCalls: { code: string; fromDate?: Date; toDate?: Date }[] = [];
    const innerProvider = new InMemorySportsDataProvider();

    const spyProvider: SportsDataProvider = {
      getCompetitions(): Promise<Competition[]> {
        return innerProvider.getCompetitions();
      },
      getMatches(code: string, fromDate?: Date, toDate?: Date): Promise<Match[]> {
        callsCount++;
        recordedCalls.push({ code, fromDate, toDate });
        return innerProvider.getMatches(code, fromDate, toDate);
      },
      getMatchDetails(id: string): Promise<Match> {
        return innerProvider.getMatchDetails(id);
      },
    };

    const testApp = createApp(spyProvider, {
      clockFn: () => IN_MEMORY_REFERENCE_NOW,
    });

    await request(testApp)
      .get('/competitions/FL1/matches/analysis')
      .expect(200);

    // 3 scheduled matches analyzed, Form 5 AND Season Strength computed, but EXACTLY 2 getMatches provider calls made
    expect(callsCount).toBe(2);

    // Call 1: primary call with explicit date window (DEC-020.6)
    expect(recordedCalls[0].code).toBe('FL1');
    expect(recordedCalls[0].fromDate).toBeInstanceOf(Date);
    expect(recordedCalls[0].toDate).toBeInstanceOf(Date);

    // Call 2: historical mutualized call without date bounds (DEC-020.7 / DEC-024 / M-001)
    expect(recordedCalls[1].code).toBe('FL1');
    expect(recordedCalls[1].fromDate).toBeUndefined();
    expect(recordedCalls[1].toDate).toBeUndefined();
  });

  it('M-002 extended graceful degradation: returns HTTP 200 with UNAVAILABLE form AND SeasonStrength when historical provider call fails', async () => {
    const innerProvider = new InMemorySportsDataProvider();
    let callIndex = 0;

    const failingHistoricalProvider: SportsDataProvider = {
      getCompetitions(): Promise<Competition[]> {
        return innerProvider.getCompetitions();
      },
      async getMatches(code: string, fromDate?: Date, toDate?: Date): Promise<Match[]> {
        callIndex++;
        if (callIndex === 1) {
          // Primary call succeeds
          return innerProvider.getMatches(code, fromDate, toDate);
        }
        // Historical call fails
        throw new Error('Historical provider network failure');
      },
      getMatchDetails(id: string): Promise<Match> {
        return innerProvider.getMatchDetails(id);
      },
    };

    const testApp = createApp(failingHistoricalProvider, {
      clockFn: () => IN_MEMORY_REFERENCE_NOW,
    });

    const res = await request(testApp)
      .get('/competitions/FL1/matches/analysis')
      .expect(200);

    expect(res.body.matches).toHaveLength(3);
    for (const entry of res.body.matches) {
      // Form UNAVAILABLE
      expect(entry.form.home.availability).toBe('UNAVAILABLE');
      expect(entry.form.home.results).toEqual([]);
      expect(entry.form.away.availability).toBe('UNAVAILABLE');
      expect(entry.form.away.results).toEqual([]);

      // Season Strength UNAVAILABLE (DEC-024)
      expect(entry.seasonStrength.home.overall.availability).toBe('UNAVAILABLE');
      expect(entry.seasonStrength.home.overall.sampleSize).toBeNull();
      expect(entry.seasonStrength.home.overall.metrics).toBeNull();
      expect(entry.seasonStrength.home.contextual.segment.availability).toBe('UNAVAILABLE');
      expect(entry.seasonStrength.home.contextual.segment.sampleSize).toBeNull();
      expect(entry.seasonStrength.home.contextual.segment.metrics).toBeNull();

      expect(entry.seasonStrength.away.overall.availability).toBe('UNAVAILABLE');
      expect(entry.seasonStrength.away.overall.sampleSize).toBeNull();
      expect(entry.seasonStrength.away.overall.metrics).toBeNull();
      expect(entry.seasonStrength.away.contextual.segment.availability).toBe('UNAVAILABLE');
      expect(entry.seasonStrength.away.contextual.segment.sampleSize).toBeNull();
      expect(entry.seasonStrength.away.contextual.segment.metrics).toBeNull();
    }
  });

  it('non-regression: GET /competitions/FL1/matches still returns only SCHEDULED matches without analysis payload', async () => {
    const res = await request(app)
      .get('/competitions/FL1/matches')
      .expect(200);

    expect(res.body.matches).toHaveLength(3);
    for (const m of res.body.matches) {
      expect(m.status).toBe('SCHEDULED');
      expect(m).not.toHaveProperty('form');
      expect(m).not.toHaveProperty('seasonStrength');
    }
  });

  // ================================================================
  // DEC-021 — ProviderRequestRejectedError (HTTP 400) route tests
  // ================================================================

  it('DEC-021: primary ProviderRequestRejectedError returns HTTP 503 PROVIDER_UNAVAILABLE without upstream diagnostic in body', async () => {
    const { ProviderRequestRejectedError } = await import('../../src/application/errors/index.js');
    const innerProvider = new InMemorySportsDataProvider();
    let callIndex = 0;

    const rejectingPrimaryProvider: SportsDataProvider = {
      getCompetitions(): Promise<Competition[]> {
        return innerProvider.getCompetitions();
      },
      async getMatches(code: string, fromDate?: Date, toDate?: Date): Promise<Match[]> {
        callIndex++;
        if (callIndex === 1) {
          // Primary call: simulate HTTP 400 rejection
          throw new ProviderRequestRejectedError(
            'Requête rejetée par football-data.org (HTTP 400)',
            { upstreamStatus: 400, providerMessage: 'date filter not supported', providerCode: 'ERR_DATE' }
          );
        }
        return innerProvider.getMatches(code, fromDate, toDate);
      },
      getMatchDetails(id: string): Promise<Match> {
        return innerProvider.getMatchDetails(id);
      },
    };

    const testApp = createApp(rejectingPrimaryProvider, {
      clockFn: () => IN_MEMORY_REFERENCE_NOW,
    });

    const res = await request(testApp)
      .get('/competitions/FL1/matches/analysis')
      .expect(503);

    // Contrat public inchangé — aucun diagnostic upstream exposé
    expect(res.body).toEqual({ error: 'PROVIDER_UNAVAILABLE' });
    expect(JSON.stringify(res.body)).not.toContain('date filter not supported');
    expect(JSON.stringify(res.body)).not.toContain('ERR_DATE');
    expect(JSON.stringify(res.body)).not.toContain('400');
    expect(JSON.stringify(res.body)).not.toContain('providerMessage');
    expect(JSON.stringify(res.body)).not.toContain('providerCode');
  });

  it('DEC-021 + M-002: historical ProviderRequestRejectedError produces HTTP 200 with UNAVAILABLE form and SeasonStrength (graceful degradation)', async () => {
    const { ProviderRequestRejectedError } = await import('../../src/application/errors/index.js');
    const innerProvider = new InMemorySportsDataProvider();
    let callIndex = 0;

    const rejectingHistoricalProvider: SportsDataProvider = {
      getCompetitions(): Promise<Competition[]> {
        return innerProvider.getCompetitions();
      },
      async getMatches(code: string, fromDate?: Date, toDate?: Date): Promise<Match[]> {
        callIndex++;
        if (callIndex === 1) {
          // Primary call succeeds
          return innerProvider.getMatches(code, fromDate, toDate);
        }
        // Historical call: simulate HTTP 400 rejection (DEC-021 + M-002)
        throw new ProviderRequestRejectedError(
          'Requête rejetée par football-data.org (HTTP 400)',
          { upstreamStatus: 400, providerMessage: 'season boundary exceeded' }
        );
      },
      getMatchDetails(id: string): Promise<Match> {
        return innerProvider.getMatchDetails(id);
      },
    };

    const testApp = createApp(rejectingHistoricalProvider, {
      clockFn: () => IN_MEMORY_REFERENCE_NOW,
    });

    const res = await request(testApp)
      .get('/competitions/FL1/matches/analysis')
      .expect(200);

    // M-002: matches conservés, form et seasonStrength UNAVAILABLE
    expect(res.body.matches).toHaveLength(3);
    for (const entry of res.body.matches) {
      expect(entry.form.home.availability).toBe('UNAVAILABLE');
      expect(entry.form.away.availability).toBe('UNAVAILABLE');
      expect(entry.seasonStrength.home.overall.availability).toBe('UNAVAILABLE');
      expect(entry.seasonStrength.away.overall.availability).toBe('UNAVAILABLE');
    }
    // Aucun diagnostic upstream exposé dans la réponse
    expect(JSON.stringify(res.body)).not.toContain('season boundary exceeded');
    expect(JSON.stringify(res.body)).not.toContain('providerMessage');
  });
});
