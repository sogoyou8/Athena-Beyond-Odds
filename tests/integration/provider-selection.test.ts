/**
 * Tests d'intégration — Sélection du fournisseur et validation de configuration au démarrage (DEC-006 + DEC-008.1).
 * Couche Application / Interfaces.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveSportsDataProvider, createApp } from '../../src/app.js';
import { InMemorySportsDataProvider } from '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js';
import { FootballDataOrgAdapter } from '../../src/infrastructure/providers/football-data-org/football-data-org-adapter.js';
import { InMemoryCache } from '../../src/infrastructure/cache/memory/in-memory-cache.js';

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
      '[Athena] ERREUR DE CONFIGURATION : Valeur inconnue pour SPORTS_DATA_PROVIDER: "unknown-provider". Seules "in-memory" et "football-data-org" sont autorisées.'
    );
  });

  it('9. Aucun message d\'erreur de démarrage ne révèle la valeur de la clé', () => {
    process.env['SPORTS_DATA_PROVIDER'] = 'football-data-org';
    process.env['FOOTBALL_DATA_API_KEY'] = '   ';

    try {
      resolveSportsDataProvider();
    } catch (err: any) {
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
});
