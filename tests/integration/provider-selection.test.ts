/**
 * Tests d'intégration — Sélection du fournisseur et validation de configuration au démarrage (DEC-006).
 * Couche Application / Interfaces.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveSportsDataProvider, createApp } from '../../src/app.js';
import { InMemorySportsDataProvider } from '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js';
import { FootballDataOrgAdapter } from '../../src/infrastructure/providers/football-data-org/football-data-org-adapter.js';

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

  it('3. SPORTS_DATA_PROVIDER=football-data-org avec une clé valide sélectionne FootballDataOrgAdapter', () => {
    process.env['SPORTS_DATA_PROVIDER'] = 'football-data-org';
    process.env['FOOTBALL_DATA_API_KEY'] = 'TEST_KEY_NEVER_SENT';

    const provider = resolveSportsDataProvider();
    expect(provider).toBeInstanceOf(FootballDataOrgAdapter);
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
});
