import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import supertest from 'supertest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../../src/app.js';
import { InMemorySportsDataProvider } from '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js';

describe('Express Static Serving Integration Tests', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'athena-static-test-'));
    mkdirSync(join(tempDir, 'js'), { recursive: true });

    writeFileSync(join(tempDir, 'index.html'), '<!DOCTYPE html><html><body>Index Test</body></html>', 'utf8');
    writeFileSync(join(tempDir, 'main.css'), 'body { background: red; }', 'utf8');
    writeFileSync(join(tempDir, 'js', 'main.js'), 'console.log("main");', 'utf8');
    writeFileSync(join(tempDir, 'health'), 'STATIC_HEALTH_SENTINEL', 'utf8');
  });

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('doit servir index.html sur GET /', async () => {
    const app = createApp(new InMemorySportsDataProvider(), { publicPath: tempDir });
    const response = await supertest(app).get('/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('Index Test');
  });

  it('doit servir main.css sur GET /main.css', async () => {
    const app = createApp(new InMemorySportsDataProvider(), { publicPath: tempDir });
    const response = await supertest(app).get('/main.css');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/css');
    expect(response.text).toContain('background: red');
  });

  it('doit servir js/main.js sur GET /js/main.js', async () => {
    const app = createApp(new InMemorySportsDataProvider(), { publicPath: tempDir });
    const response = await supertest(app).get('/js/main.js');

    expect(response.status).toBe(200);
    expect(response.text).toContain('console.log("main")');
  });

  it('doit retourner 404 pour un asset inexistant', async () => {
    const app = createApp(new InMemorySportsDataProvider(), { publicPath: tempDir });
    const response = await supertest(app).get('/unknown-asset.png');

    expect(response.status).toBe(404);
  });

  it('doit prioriser la route API GET /health sur le fichier statique health sentinelle', async () => {
    const app = createApp(new InMemorySportsDataProvider(), { publicPath: tempDir });
    const response = await supertest(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toEqual({ status: 'ok' });
    expect(response.text).not.toContain('STATIC_HEALTH_SENTINEL');
  });

  it('doit prioriser la route API GET /competitions/FL1/matches sur le serveur statique', async () => {
    const app = createApp(new InMemorySportsDataProvider(), { publicPath: tempDir });
    const response = await supertest(app).get('/competitions/FL1/matches');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toHaveProperty('competitionCode', 'FL1');
    expect(Array.isArray(response.body.matches)).toBe(true);
  });
});
