import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('GET /competitions/FL1/matches', () => {
  const app = createApp();

  it('returns HTTP 200', async () => {
    await request(app)
      .get('/competitions/FL1/matches')
      .expect(200);
  });

  it('returns JSON content-type', async () => {
    const response = await request(app)
      .get('/competitions/FL1/matches')
      .expect(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  it('response body is wrapped with competitionCode and matches', async () => {
    const response = await request(app)
      .get('/competitions/FL1/matches')
      .expect(200);
    expect(response.body).toHaveProperty('competitionCode', 'FL1');
    expect(response.body).toHaveProperty('matches');
    expect(Array.isArray(response.body.matches)).toBe(true);
  });

  it('contains exactly 3 matches', async () => {
    const response = await request(app)
      .get('/competitions/FL1/matches')
      .expect(200);
    expect(response.body.matches).toHaveLength(3);
  });

  it('all 3 matches have status SCHEDULED', async () => {
    const response = await request(app)
      .get('/competitions/FL1/matches')
      .expect(200);
    for (const match of response.body.matches) {
      expect(match.status).toBe('SCHEDULED');
    }
  });

  it('contains the exact approved UTC timestamp 2099-08-14T18:00:00.000Z', async () => {
    const response = await request(app)
      .get('/competitions/FL1/matches')
      .expect(200);
    const dates: string[] = response.body.matches.map(
      (m: { utcDate: string }) => m.utcDate
    );
    expect(dates).toContain('2099-08-14T18:00:00.000Z');
  });

  it('contains the exact approved UTC timestamp 2099-08-15T20:00:00.000Z', async () => {
    const response = await request(app)
      .get('/competitions/FL1/matches')
      .expect(200);
    const dates: string[] = response.body.matches.map(
      (m: { utcDate: string }) => m.utcDate
    );
    expect(dates).toContain('2099-08-15T20:00:00.000Z');
  });

  it('contains the exact approved UTC timestamp 2099-08-16T19:30:00.000Z', async () => {
    const response = await request(app)
      .get('/competitions/FL1/matches')
      .expect(200);
    const dates: string[] = response.body.matches.map(
      (m: { utcDate: string }) => m.utcDate
    );
    expect(dates).toContain('2099-08-16T19:30:00.000Z');
  });
});
