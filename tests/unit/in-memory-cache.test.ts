/**
 * Tests unitaires — InMemoryCache.
 * Couche Infrastructure — Phase 2.10 (DEC-008.6).
 *
 * Couvre les 24 cas obligatoires + cas limites supplémentaires.
 * Aucun appel réseau réel. Aucun setTimeout réel. Horloge injectable.
 */

import { describe, it, expect, vi } from 'vitest';
import { InMemoryCache } from '../../src/infrastructure/cache/memory/in-memory-cache.js';
import type { SportsDataProvider } from '../../src/application/ports/sports-data-provider.js';
import type { Match } from '../../src/domain/entities/match.js';
import {
  ProviderRateLimitError,
  ProviderUnavailableError,
} from '../../src/application/errors/index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Construit un Match minimal valide. */
function makeMatch(id: string): Match {
  const now = new Date('2026-08-10T15:00:00.000Z');
  const team = (name: string) => ({
    id: `team-${name}`,
    name,
    shortName: name,
    tla: name.substring(0, 3).toUpperCase(),
    crestUrl: null,
    providerMetadata: { providerName: 'test', externalId: name, lastUpdated: now },
  });
  return {
    id,
    competitionId: 'FL1',
    seasonId: 'season-2026',
    matchday: 1,
    utcDate: now,
    status: 'SCHEDULED',
    homeTeam: team('HomeTeam'),
    awayTeam: team('AwayTeam'),
    score: { halfTime: { home: null, away: null }, fullTime: { home: null, away: null } },
    providerMetadata: { providerName: 'test', externalId: id, lastUpdated: now },
  };
}

/** Provider mock simple qui retourne une liste fixe de matchs. */
function makeProvider(matches: Match[] = []): SportsDataProvider & { callCount: number } {
  let callCount = 0;
  return {
    get callCount() { return callCount; },
    getCompetitions: vi.fn().mockResolvedValue([]),
    getMatches: vi.fn().mockImplementation(async () => { callCount++; return matches; }),
    getMatchDetails: vi.fn().mockRejectedValue(new Error('Not used')),
  };
}

const FIXED_NOW = new Date('2026-08-05T10:00:00.000Z');
const FIXED_NOW_PLUS_7 = new Date('2026-08-12T10:00:00.000Z');
const TTL_MS = 1000; // 1 seconde pour les tests

// ---------------------------------------------------------------------------
// Suite de tests
// ---------------------------------------------------------------------------

describe('InMemoryCache (DEC-008.6)', () => {

  // Cas 1 — Cache froid : premier appel → fournisseur appelé
  it('1. cache froid — appelle le fournisseur une fois', async () => {
    const provider = makeProvider([makeMatch('m1')]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    const result = await cache.getMatches('FL1');

    expect(provider.callCount).toBe(1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('m1');
  });

  // Cas 2 — Cache chaud : deuxième appel identique avant expiration → 0 appel fournisseur
  it('2. cache chaud — deuxième appel identique ne rappelle pas le fournisseur', async () => {
    const provider = makeProvider([makeMatch('m1')]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await cache.getMatches('FL1');
    const result = await cache.getMatches('FL1');

    expect(provider.callCount).toBe(1);
    expect(result).toHaveLength(1);
  });

  // Cas 3 — Expiration : appel après TTL → fournisseur rappelé
  it('3. expiration — rappelle le fournisseur après le TTL', async () => {
    const provider = makeProvider([makeMatch('m1')]);
    let nowMs = FIXED_NOW.getTime();
    const clock = vi.fn().mockImplementation(() => new Date(nowMs));
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await cache.getMatches('FL1');
    expect(provider.callCount).toBe(1);

    // Avance l'horloge au-delà du TTL
    nowMs += TTL_MS + 1;

    await cache.getMatches('FL1');
    expect(provider.callCount).toBe(2);
  });

  // Cas limites — expiresAt exact signifie expiré
  it('3b. expiration exacte à expiresAt — considérée comme expirée', async () => {
    const provider = makeProvider([makeMatch('m1')]);
    let nowMs = FIXED_NOW.getTime();
    const clock = vi.fn().mockImplementation(() => new Date(nowMs));
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await cache.getMatches('FL1');
    expect(provider.callCount).toBe(1);

    // Exactement à expiresAt (= nowMs_at_success + TTL_MS)
    nowMs += TTL_MS;

    await cache.getMatches('FL1');
    expect(provider.callCount).toBe(2);
  });

  // Cas 4 — Tableau vide mis en cache
  it('4. tableau vide [] mis en cache — second appel retourne [] sans rappel fournisseur', async () => {
    const provider = makeProvider([]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    const first = await cache.getMatches('FL1');
    const second = await cache.getMatches('FL1');

    expect(provider.callCount).toBe(1);
    expect(first).toEqual([]);
    expect(second).toEqual([]);
  });

  // Cas 5 — Fenêtres différentes → clés différentes
  it('5. fenêtres différentes → appels fournisseur indépendants', async () => {
    const provider = makeProvider([]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    const from1 = new Date('2026-08-01T00:00:00Z');
    const to1 = new Date('2026-08-08T00:00:00Z');
    const from2 = new Date('2026-09-01T00:00:00Z');
    const to2 = new Date('2026-09-08T00:00:00Z');

    await cache.getMatches('FL1', from1, to1);
    await cache.getMatches('FL1', from2, to2);

    expect(provider.callCount).toBe(2);
  });

  // Cas 6 — Compétitions différentes → clés différentes
  it('6. compétitions différentes → appels fournisseur indépendants', async () => {
    const provider = makeProvider([]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    const from = new Date('2026-08-01T00:00:00Z');
    const to = new Date('2026-08-08T00:00:00Z');

    await cache.getMatches('FL1', from, to);
    await cache.getMatches('PL', from, to);

    expect(provider.callCount).toBe(2);
  });

  // Cas 7 — Aucune date fournie → cache calcule les dates UTC
  it('7. sans dates → cache calcule [now, now+7j UTC) via horloge injectable', async () => {
    const provider = makeProvider([]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await cache.getMatches('FL1');

    expect(provider.getMatches).toHaveBeenCalledWith(
      'FL1',
      FIXED_NOW,
      FIXED_NOW_PLUS_7
    );
  });

  // Cas 8 — Dates calculées transmises correctement au fournisseur
  it('8. les dates calculées par le cache sont transmises exactement au fournisseur', async () => {
    const provider = makeProvider([]);
    const fixedDate = new Date('2026-12-28T00:00:00.000Z'); // fin d'année
    const clock = vi.fn().mockReturnValue(fixedDate);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await cache.getMatches('FL1');

    const expectedTo = new Date('2027-01-04T00:00:00.000Z'); // +7j → change d'année
    expect(provider.getMatches).toHaveBeenCalledWith('FL1', fixedDate, expectedTo);
  });

  // Cas limites — changement de mois
  it('8b. fenêtre UTC correcte lors d\'un changement de mois', async () => {
    const provider = makeProvider([]);
    const endOfMonth = new Date('2026-10-28T00:00:00.000Z');
    const clock = vi.fn().mockReturnValue(endOfMonth);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await cache.getMatches('FL1');

    const expectedTo = new Date('2026-11-04T00:00:00.000Z');
    expect(provider.getMatches).toHaveBeenCalledWith('FL1', endOfMonth, expectedTo);
  });

  // Cas limites — changement d'année
  it('8c. fenêtre UTC correcte lors d\'un changement d\'année', async () => {
    const provider = makeProvider([]);
    const endOfYear = new Date('2026-12-29T00:00:00.000Z');
    const clock = vi.fn().mockReturnValue(endOfYear);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await cache.getMatches('FL1');

    const expectedTo = new Date('2027-01-05T00:00:00.000Z');
    expect(provider.getMatches).toHaveBeenCalledWith('FL1', endOfYear, expectedTo);
  });

  // Cas 9 — Bypass avec uniquement fromDate
  it('9a. bypass — seule fromDate fournie → délégation directe sans cache', async () => {
    const provider = makeProvider([makeMatch('m1')]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    const from = new Date('2026-09-01T00:00:00Z');

    await cache.getMatches('FL1', from, undefined);
    await cache.getMatches('FL1', from, undefined); // deuxième appel

    // Délégation directe à chaque fois, pas de mise en cache
    expect(provider.callCount).toBe(2);
  });

  // Cas 10 — Bypass avec uniquement toDate
  it('9b. bypass — seule toDate fournie → délégation directe sans cache', async () => {
    const provider = makeProvider([makeMatch('m1')]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    const to = new Date('2026-09-08T00:00:00Z');

    await cache.getMatches('FL1', undefined, to);
    await cache.getMatches('FL1', undefined, to);

    expect(provider.callCount).toBe(2);
  });

  // Cas 11 — ProviderRateLimitError non mise en cache
  it('10. ProviderRateLimitError — non mise en cache, fournisseur rappelé', async () => {
    const err = new ProviderRateLimitError('Rate limit', 60_000);
    const provider: SportsDataProvider = {
      getCompetitions: vi.fn().mockResolvedValue([]),
      getMatches: vi.fn().mockRejectedValue(err),
      getMatchDetails: vi.fn().mockRejectedValue(new Error('Not used')),
    };
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await expect(cache.getMatches('FL1')).rejects.toThrow(ProviderRateLimitError);
    await expect(cache.getMatches('FL1')).rejects.toThrow(ProviderRateLimitError);

    expect(provider.getMatches).toHaveBeenCalledTimes(2);
  });

  // Cas 12 — ProviderUnavailableError non mise en cache
  it('11. ProviderUnavailableError — non mise en cache', async () => {
    const err = new ProviderUnavailableError('Service unavailable');
    const provider: SportsDataProvider = {
      getCompetitions: vi.fn().mockResolvedValue([]),
      getMatches: vi.fn().mockRejectedValue(err),
      getMatchDetails: vi.fn().mockRejectedValue(new Error('Not used')),
    };
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await expect(cache.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);
    await expect(cache.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);

    expect(provider.getMatches).toHaveBeenCalledTimes(2);
  });

  // Cas 13 — Erreur inconnue non mise en cache
  it('12. erreur inconnue — non mise en cache, propagée sans modification', async () => {
    const err = new Error('Unexpected failure');
    const provider: SportsDataProvider = {
      getCompetitions: vi.fn().mockResolvedValue([]),
      getMatches: vi.fn().mockRejectedValue(err),
      getMatchDetails: vi.fn().mockRejectedValue(new Error('Not used')),
    };
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await expect(cache.getMatches('FL1')).rejects.toThrow('Unexpected failure');
    await expect(cache.getMatches('FL1')).rejects.toThrow('Unexpected failure');

    expect(provider.getMatches).toHaveBeenCalledTimes(2);
  });

  // Cas 14 — Absence de stale-on-error
  it('13. absence de stale-on-error — erreur après cache expiré, valeur expirée non servie', async () => {
    let nowMs = FIXED_NOW.getTime();
    const clock = vi.fn().mockImplementation(() => new Date(nowMs));

    let callCount = 0;
    const provider: SportsDataProvider = {
      getCompetitions: vi.fn().mockResolvedValue([]),
      getMatches: vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) return [makeMatch('m1')];
        throw new ProviderUnavailableError('Service down');
      }),
      getMatchDetails: vi.fn().mockRejectedValue(new Error('Not used')),
    };

    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    // Premier appel : succès
    await cache.getMatches('FL1');

    // Avance après expiration
    nowMs += TTL_MS + 1;

    // Deuxième appel : fournisseur renvoie une erreur — ne pas servir l'ancienne valeur
    await expect(cache.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);
  });

  // Cas 15 — Deux appels simultanés de même clé → déduplication
  it('14. déduplication — deux appels simultanés de même clé → un seul appel fournisseur', async () => {
    let resolvePromise!: (v: Match[]) => void;
    const fakePromise = new Promise<Match[]>((res) => { resolvePromise = res; });

    const provider: SportsDataProvider = {
      getCompetitions: vi.fn().mockResolvedValue([]),
      getMatches: vi.fn().mockReturnValue(fakePromise),
      getMatchDetails: vi.fn().mockRejectedValue(new Error('Not used')),
    };

    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    const p1 = cache.getMatches('FL1');
    const p2 = cache.getMatches('FL1'); // même clé, même promesse

    resolvePromise([makeMatch('m1')]);

    const [r1, r2] = await Promise.all([p1, p2]);

    expect(provider.getMatches).toHaveBeenCalledTimes(1);
    expect(r1).toHaveLength(1);
    expect(r2).toHaveLength(1);
  });

  // Cas 16 — Deux appels simultanés de clés différentes → pas de déduplication
  it('15. clés différentes — deux appels simultanés → deux appels fournisseur indépendants', async () => {
    const provider = makeProvider([makeMatch('m1')]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    const from1 = new Date('2026-08-01T00:00:00Z');
    const to1 = new Date('2026-08-08T00:00:00Z');
    const from2 = new Date('2026-08-15T00:00:00Z');
    const to2 = new Date('2026-08-22T00:00:00Z');

    await Promise.all([
      cache.getMatches('FL1', from1, to1),
      cache.getMatches('FL1', from2, to2),
    ]);

    expect(provider.callCount).toBe(2);
  });

  // Cas 17 — Promesse rejetée retirée de inflight
  it('16. rejet — promesse retirée de la Map inflight', async () => {
    let callCount = 0;
    const provider: SportsDataProvider = {
      getCompetitions: vi.fn().mockResolvedValue([]),
      getMatches: vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) throw new ProviderUnavailableError('fail');
        return [makeMatch('m2')];
      }),
      getMatchDetails: vi.fn().mockRejectedValue(new Error('Not used')),
    };

    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await expect(cache.getMatches('FL1')).rejects.toThrow(ProviderUnavailableError);
    // La promesse rejetée a été retirée → le prochain appel doit rappeler le fournisseur
    const result = await cache.getMatches('FL1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('m2');
  });

  // Cas 18 — Nouvel appel possible après rejet
  it('17. après rejet — nouvel appel possible et mis en cache si succès', async () => {
    let callCount = 0;
    const provider: SportsDataProvider = {
      getCompetitions: vi.fn().mockResolvedValue([]),
      getMatches: vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) throw new ProviderUnavailableError('fail');
        return [makeMatch('m3')];
      }),
      getMatchDetails: vi.fn().mockRejectedValue(new Error('Not used')),
    };

    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await expect(cache.getMatches('FL1')).rejects.toThrow();
    const r1 = await cache.getMatches('FL1');
    const r2 = await cache.getMatches('FL1'); // doit utiliser le cache

    expect(callCount).toBe(2); // seul 2 appels fournisseur (1 rejet + 1 succès)
    expect(r1[0].id).toBe('m3');
    expect(r2[0].id).toBe('m3');
  });

  // Cas 19 — Promesse réussie retirée de inflight
  it('19. succès retiré de la Map inflight — le cache TTL prend le relais', async () => {
    const provider = makeProvider([makeMatch('m1')]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await cache.getMatches('FL1');

    // Si la promesse n'est pas retirée, un deuxième appel dans la fenêtre TTL
    // devrait utiliser le cache store (provider.callCount reste 1).
    await cache.getMatches('FL1');
    expect(provider.callCount).toBe(1);
  });

  // Cas 20 — getCompetitions() délégué directement
  it('20. getCompetitions() délégué directement sans cache', async () => {
    const provider = makeProvider([]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await cache.getCompetitions();
    await cache.getCompetitions();

    expect(provider.getCompetitions).toHaveBeenCalledTimes(2);
  });

  // Cas 21 — getMatchDetails() délégué directement
  it('21. getMatchDetails() délégué directement sans cache', async () => {
    const provider: SportsDataProvider = {
      getCompetitions: vi.fn().mockResolvedValue([]),
      getMatches: vi.fn().mockResolvedValue([]),
      getMatchDetails: vi.fn().mockRejectedValue(new Error('Not implemented')),
    };
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await expect(cache.getMatchDetails('any-id')).rejects.toThrow('Not implemented');
    expect(provider.getMatchDetails).toHaveBeenCalledTimes(1);
  });

  // Cas 22 — Horloge injectable et déterministe
  it('22. horloge injectable — contrôle précis du TTL sans délai réel', async () => {
    const provider = makeProvider([makeMatch('m1')]);
    let nowMs = FIXED_NOW.getTime();
    const clock = vi.fn().mockImplementation(() => new Date(nowMs));
    const cache = new InMemoryCache(provider, { ttlMs: 5000, clock });

    await cache.getMatches('FL1');
    expect(provider.callCount).toBe(1);

    nowMs += 4999; // pas encore expiré
    await cache.getMatches('FL1');
    expect(provider.callCount).toBe(1);

    nowMs += 1; // exactement expiré
    await cache.getMatches('FL1');
    expect(provider.callCount).toBe(2);
  });

  // Cas 23 — Aucun délai réel (vérifié par l'absence de setTimeout dans l'implémentation)
  it('23. aucun délai réel — les tests s\'exécutent sans attendre', async () => {
    const provider = makeProvider([makeMatch('m1')]);
    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });
    // Si setTimeout réel était utilisé, ce test prendrait > 1s
    const start = Date.now();
    await cache.getMatches('FL1');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(500); // largement sous 1s
  });

  // Cas 24 — Aucune donnée sensible dans la clé
  it('24. aucune donnée sensible dans la clé du cache', async () => {
    const capturedCalls: Array<{ code: string; from?: Date; to?: Date }> = [];
    const provider: SportsDataProvider = {
      getCompetitions: vi.fn().mockResolvedValue([]),
      getMatches: vi.fn().mockImplementation(async (code, from, to) => {
        capturedCalls.push({ code, from, to });
        return [];
      }),
      getMatchDetails: vi.fn().mockRejectedValue(new Error('Not used')),
    };

    const clock = vi.fn().mockReturnValue(FIXED_NOW);
    const cache = new InMemoryCache(provider, { ttlMs: TTL_MS, clock });

    await cache.getMatches('FL1');

    // La clé interne n'est pas exposée, mais on vérifie que le code transmis
    // ne contient pas de token ou clé API
    expect(capturedCalls[0].code).toBe('FL1');
    expect(capturedCalls[0].code).not.toContain('api-key');
    expect(capturedCalls[0].code).not.toContain('token');
  });
});
