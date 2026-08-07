import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('GET /competitions/:competitionCode/matches — unknown competition', () => {
  const app = createApp();

  it('returns HTTP 404 for "PL"', async () => {
    await request(app)
      .get('/competitions/PL/matches')
      .expect(404);
  });

  it('returns body strictly equal to { "error": "COMPETITION_NOT_AVAILABLE" } for "PL"', async () => {
    const response = await request(app)
      .get('/competitions/PL/matches')
      .expect(404);
    expect(response.body).toEqual({ error: 'COMPETITION_NOT_AVAILABLE' });
  });

  it('returns HTTP 404 for "CL"', async () => {
    await request(app)
      .get('/competitions/CL/matches')
      .expect(404);
  });

  it('returns body strictly equal to { "error": "COMPETITION_NOT_AVAILABLE" } for "CL"', async () => {
    const response = await request(app)
      .get('/competitions/CL/matches')
      .expect(404);
    expect(response.body).toEqual({ error: 'COMPETITION_NOT_AVAILABLE' });
  });

  it('returns HTTP 404 for "FL2"', async () => {
    await request(app)
      .get('/competitions/FL2/matches')
      .expect(404);
  });

  it('returns no extra fields in the error body', async () => {
    const response = await request(app)
      .get('/competitions/UNKNOWN/matches')
      .expect(404);
    const keys = Object.keys(response.body);
    expect(keys).toEqual(['error']);
    expect(response.body.error).toBe('COMPETITION_NOT_AVAILABLE');
  });
});
