/**
 * Tests d'intégration — Sélection du fournisseur et validation de configuration au démarrage (DEC-006 + DEC-008.1).
 * Couche Application / Interfaces.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveSportsDataProvider, createApp } from '../../src/app.js';
import { InMemorySportsDataProvider } from '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js';
import { FootballDataOrgAdapter } from '../../src/infrastructure/providers/football-data-org/football-data-org-adapter.js';
import { InMemoryCache } from '../../src/infrastructure/cache/memory/in-memory-cache.js';
import { resolveTelemetryObserver } from '../../src/shared/observability/telemetry.js';

describe('Provider Selection & Startup Validation (DEC-006)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('1. SPORTS_DATA_PROVIDER absent sélectionne InMemorySportsDataProvider par défaut', () => {
    delete process.env['SPORTS_DATA_PROVIDER'];
    delete process.env['FOOTBALL_DATA_API_KEY'];

    const provider = resolveSportsDataProvider();
    expect(provider).toBeInstanceOf(InMemorySportsDataProvider);
  });

  it('2. SPORTS_DATA_PROVIDER=in-memory sélectionne InMemorySportsDataProvider sans clé', () => {
    process.env['SPORTS_DATA_PROVIDER'] = 'in-memory';
    delete process.env['FOOTBALL_DATA_API_KEY'];

    const provider = resolveSportsDataProvider();
    expect(provider).toBeInstanceOf(InMemorySportsDataProvider);
  });

  it('3. SPORTS_DATA_PROVIDER=football-data-org avec une clé valide sélectionne InMemoryCache(FootballDataOrgAdapter) (DEC-008.1)', () => {
    process.env['SPORTS_DATA_PROVIDER'] = 'football-data-org';
    process.env['FOOTBALL_DATA_API_KEY'] = 'TEST_KEY_NEVER_SENT';

    const provider = resolveSportsDataProvider();
    // Phase 2.10 : InMemoryCache enveloppe FootballDataOrgAdapter
    expect(provider).toBeInstanceOf(InMemoryCache);
    // FootballDataOrgAdapter seul n'est plus retourné directement
    expect(provider).not.toBeInstanceOf(FootballDataOrgAdapter);
  });

  it('4. La création de l\'application en mode réel n\'effectue aucun appel réseau', () => {
    process.env['SPORTS_DATA_PROVIDER'] = 'football-data-org';
    process.env['FOOTBALL_DATA_API_KEY'] = 'TEST_KEY_NEVER_SENT';

    const mockFetch = vi.fn();
    const customAdapter = new FootballDataOrgAdapter({
      apiKey: 'TEST_KEY_NEVER_SENT',
      fetchFn: mockFetch,
    });

    const app = createApp(customAdapter);
    expect(app).toBeDefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('5. SPORTS_DATA_PROVIDER=football-data-org sans FOOTBALL_DATA_API_KEY échoue immédiatement au démarrage', () => {
    process.env['SPORTS_DATA_PROVIDER'] = 'football-data-org';
    delete process.env['FOOTBALL_DATA_API_KEY'];

    expect(() => resolveSportsDataProvider()).toThrow(
      '[Athena] ERREUR DE CONFIGURATION : FOOTBALL_DATA_API_KEY est requise lorsque SPORTS_DATA_PROVIDER=football-data-org.'
    );
  });

  it('6. SPORTS_DATA_PROVIDER=football-data-org avec FOOTBALL_DATA_API_KEY vide échoue immédiatement au démarrage', () => {
    process.env['SPORTS_DATA_PROVIDER'] = 'football-data-org';
    process.env['FOOTBALL_DATA_API_KEY'] = '';

    expect(() => resolveSportsDataProvider()).toThrow(
      '[Athena] ERREUR DE CONFIGURATION : FOOTBALL_DATA_API_KEY est requise lorsque SPORTS_DATA_PROVIDER=football-data-org.'
    );
  });

  it('7. SPORTS_DATA_PROVIDER=football-data-org avec FOOTBALL_DATA_API_KEY composée uniquement d\'espaces échoue immédiatement au démarrage', () => {
    process.env['SPORTS_DATA_PROVIDER'] = 'football-data-org';
    process.env['FOOTBALL_DATA_API_KEY'] = '   ';

    expect(() => resolveSportsDataProvider()).toThrow(
      '[Athena] ERREUR DE CONFIGURATION : FOOTBALL_DATA_API_KEY est requise lorsque SPORTS_DATA_PROVIDER=football-data-org.'
    );
  });

  it('8. SPORTS_DATA_PROVIDER avec une valeur inconnue échoue immédiatement au démarrage', () => {
    process.env['SPORTS_DATA_PROVIDER'] = 'unknown-provider';

    expect(() => resolveSportsDataProvider()).toThrow(
      '[Athena] Invalid SPORTS_DATA_PROVIDER value. Expected "in-memory" or "football-data-org".'
    );
  });

  it('9. Aucun message d\'erreur de démarrage ne révèle la valeur de la clé', () => {
    process.env['SPORTS_DATA_PROVIDER'] = 'football-data-org';
    process.env['FOOTBALL_DATA_API_KEY'] = '   ';

    try {
      resolveSportsDataProvider();
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(Error);
      if (!(err instanceof Error)) {
        throw new Error('Expected an Error instance.');
      }
      expect(err.message).not.toContain('TEST_KEY_NEVER_SENT');
      expect(err.message).toContain('FOOTBALL_DATA_API_KEY est requise');
    }
  });

  it('10. SPORTS_DATA_PROVIDER=football-data-org — deux appels identiques n\'effectuent qu\'un seul appel réseau (DEC-008.5)', async () => {
    process.env['SPORTS_DATA_PROVIDER'] = 'football-data-org';
    process.env['FOOTBALL_DATA_API_KEY'] = 'TEST_KEY_NEVER_SENT';

    let fetchCallCount = 0;
    const mockFetch = vi.fn().mockImplementation(async () => {
      fetchCallCount++;
      return new Response(JSON.stringify({ matches: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const customAdapter = new FootballDataOrgAdapter({
      apiKey: 'TEST_KEY_NEVER_SENT',
      fetchFn: mockFetch,
    });
    const cachedProvider = new InMemoryCache(customAdapter, { ttlMs: 600_000 });

    const app = createApp(cachedProvider);
    expect(app).toBeDefined();
    expect(fetchCallCount).toBe(0); // aucun appel à la construction

    // Premier appel via le fournisseur caché
    await cachedProvider.getMatches('FL1');
    expect(fetchCallCount).toBe(1);

    // Deuxième appel identique — doit utiliser le cache
    await cachedProvider.getMatches('FL1');
    expect(fetchCallCount).toBe(1); // toujours 1 seul appel réseau
  });

  describe('Phase 2.11 — Integration ATHENA_TELEMETRY (DEC-009.3)', () => {
    it('11. ATHENA_TELEMETRY absente ou "off" — aucun événement produit sur la console', async () => {
      delete process.env['ATHENA_TELEMETRY'];
      process.env['SPORTS_DATA_PROVIDER'] = 'football-data-org';
      process.env['FOOTBALL_DATA_API_KEY'] = 'test-key';

      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const spyError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const provider = resolveSportsDataProvider();
      expect(provider).toBeDefined();

      expect(spyLog).not.toHaveBeenCalled();
      expect(spyError).not.toHaveBeenCalled();
      spyLog.mockRestore();
      spyError.mockRestore();
    });

    it('12. ATHENA_TELEMETRY=console — produit du JSON structuré avec scope athena.telemetry', async () => {
      process.env['ATHENA_TELEMETRY'] = 'console';
      process.env['SPORTS_DATA_PROVIDER'] = 'football-data-org';
      process.env['FOOTBALL_DATA_API_KEY'] = 'test-key';

      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const spyError = vi.spyOn(console, 'error').mockImplementation(() => {});

      // On reconstruit un adaptateur/cache instrumenté comme app.ts
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ matches: [] }), { status: 200 })
      );

      const observer = resolveTelemetryObserver('console');
      const adapter = new FootballDataOrgAdapter({ apiKey: 'test-key', fetchFn: mockFetch, observer });
      const cache = new InMemoryCache(adapter, { observer });

      await cache.getMatches('FL1');

      expect(spyLog).toHaveBeenCalled();
      const logs = spyLog.mock.calls.map((c) => JSON.parse(c[0]));
      expect(logs.some((l) => l.scope === 'athena.telemetry' && l.type === 'provider_request_started')).toBe(true);

      spyLog.mockRestore();
      spyError.mockRestore();
    });

    it('13. ATHENA_TELEMETRY avec une valeur inconnue — échec immédiat au démarrage', () => {
      process.env['ATHENA_TELEMETRY'] = 'invalid_telemetry_mode';
      process.env['SPORTS_DATA_PROVIDER'] = 'in-memory';

      expect(() => resolveSportsDataProvider()).toThrow(
        '[Athena] Invalid ATHENA_TELEMETRY value. Expected "off" or "console".'
      );
    });

    it('14. SPORTS_DATA_PROVIDER avec valeur sentinelle — la sentinelle n\'apparaît dans aucun log ou message', () => {
      const sentinel = 'secret-provider-value-that-must-not-appear';
      process.env['SPORTS_DATA_PROVIDER'] = sentinel;

      const spyLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const spyError = vi.spyOn(console, 'error').mockImplementation(() => {});

      try {
        resolveSportsDataProvider();
        expect.unreachable('Devrait lever une erreur');
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(Error);
        const msg = (err as Error).message;
        expect(msg).toBe('[Athena] Invalid SPORTS_DATA_PROVIDER value. Expected "in-memory" or "football-data-org".');
        expect(msg).not.toContain(sentinel);
        expect(spyLog).not.toHaveBeenCalled();
        expect(spyError).not.toHaveBeenCalled();
      } finally {
        spyLog.mockRestore();
        spyError.mockRestore();
      }
    });
  });
});

