/**
 * Tests d'intégration / contrat — GET /competitions/:code/matches/analysis & anti N+1 (DEC-019).
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { SportsDataProvider } from '../../src/application/ports/sports-data-provider.js';
import { Match } from '../../src/domain/entities/match.js';
import { Competition } from '../../src/domain/entities/competition.js';
import { InMemorySportsDataProvider } from '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js';

describe('GET /competitions/FL1/matches/analysis (Form 5)', () => {
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

  it('returns INSUFFICIENT_DATA when team has 0 FINISHED matches (Zeta Rovers)', async () => {
    const res = await request(app)
      .get('/competitions/FL1/matches/analysis')
      .expect(200);

    // Match 3: Epsilon vs Zeta (match 3 is Epsilon vs Zeta)
    const match3 = res.body.matches[2];
    expect(match3.form.away.teamId).toBe('team-zeta-006');
    expect(match3.form.away.availability).toBe('INSUFFICIENT_DATA');
    expect(match3.form.away.results).toEqual([]);
  });

  it('returns HTTP 404 for unknown competition code', async () => {
    await request(app)
      .get('/competitions/UNKNOWN/matches/analysis')
      .expect(404);
  });

  it('anti N+1 proof: calling analysis execute performs exactly 1 getMatches call to provider', async () => {
    let callsCount = 0;
    const innerProvider = new InMemorySportsDataProvider();

    const spyProvider: SportsDataProvider = {
      getCompetitions(): Promise<Competition[]> {
        return innerProvider.getCompetitions();
      },
      getMatches(code: string, fromDate?: Date, toDate?: Date): Promise<Match[]> {
        callsCount++;
        return innerProvider.getMatches(code, fromDate, toDate);
      },
      getMatchDetails(id: string): Promise<Match> {
        return innerProvider.getMatchDetails(id);
      },
    };

    const testApp = createApp(spyProvider);

    await request(testApp)
      .get('/competitions/FL1/matches/analysis')
      .expect(200);

    // 3 scheduled matches analyzed, but EXACTLY 1 getMatches provider call made (mutualized)
    expect(callsCount).toBe(1);
  });

  it('non-regression: GET /competitions/FL1/matches still returns only SCHEDULED matches', async () => {
    const res = await request(app)
      .get('/competitions/FL1/matches')
      .expect(200);

    expect(res.body.matches).toHaveLength(3);
    for (const m of res.body.matches) {
      expect(m.status).toBe('SCHEDULED');
    }
  });
});
