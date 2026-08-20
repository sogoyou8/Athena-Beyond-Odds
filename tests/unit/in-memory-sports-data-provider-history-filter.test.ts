/**
 * Tests unitaires — InMemorySportsDataProvider — DEC-027 HistoryFilter.
 *
 * Vérifie le comportement contractuel du provider InMemory vis-à-vis de HistoryFilter :
 * - Sans historyFilter : comportement inchangé (DEC-020)
 * - Avec historyFilter et sans dates : retourne tout l'historique disponible
 *   (conforme à DEC-027 : le filtrage par saison est délégué au HeadToHeadCalculator)
 * - Avec dates et historyFilter : les dates prévalent (DEC-020 strict)
 */

import { describe, it, expect } from 'vitest';
import { InMemorySportsDataProvider } from '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js';

describe('InMemorySportsDataProvider — DEC-027 HistoryFilter', () => {
  const provider = new InMemorySportsDataProvider();

  it('sans historyFilter et sans dates : retourne les 20 matchs (comportement inchangé DEC-020)', async () => {
    const matches = await provider.getMatches('FL1');
    expect(matches).toHaveLength(20);
  });

  it('avec historyFilter { seasonCount: 3 } sans dates : retourne tout l\'historique disponible', async () => {
    const withFilter = await provider.getMatches('FL1', undefined, undefined, { seasonCount: 3 });
    const withoutFilter = await provider.getMatches('FL1');

    // Le InMemory ne possède qu'une seule saison de données.
    // Avec historyFilter sans dates, il retourne tout ce qu'il a (pas moins).
    // Le filtrage saisonnier est délégué au HeadToHeadCalculator (DEC-027 §7.1).
    expect(withFilter).toHaveLength(withoutFilter.length);
    expect(withFilter.map(m => m.id)).toEqual(withoutFilter.map(m => m.id));
  });

  it('avec historyFilter { seasonCount: 1 } sans dates : retourne le même corpus que sans filtre', async () => {
    const withFilter = await provider.getMatches('FL1', undefined, undefined, { seasonCount: 1 });
    const withoutFilter = await provider.getMatches('FL1');

    expect(withFilter).toHaveLength(withoutFilter.length);
  });

  it('avec historyFilter ET dates : les dates prévalent (DEC-020 strict)', async () => {
    const from = new Date('2100-01-01T00:00:00.000Z');
    const withFilterAndDates = await provider.getMatches('FL1', from, undefined, { seasonCount: 3 });

    // Les dates excluent tout => []
    expect(withFilterAndDates).toHaveLength(0);
  });

  it('avec historyFilter et toDate passée : retourne [] (strict temporal)', async () => {
    const to = new Date('2026-12-31T23:59:59.999Z');
    const result = await provider.getMatches('FL1', undefined, to, { seasonCount: 3 });

    expect(result).toHaveLength(0);
  });

  it('HistoryFilter ne doit pas provoquer d\'appels réseau réels (provider purement in-memory)', async () => {
    // Ce test vérifie que le provider InMemory reste synchrone / in-memory
    // même avec historyFilter activé. Aucune exception, aucun délai anormal.
    const start = Date.now();
    const result = await provider.getMatches('FL1', undefined, undefined, { seasonCount: 3 });
    const elapsed = Date.now() - start;

    expect(result.length).toBeGreaterThan(0);
    // < 100ms garantit qu'aucun réseau n'est impliqué
    expect(elapsed).toBeLessThan(100);
  });

  it('avec historyFilter { seasonIds: [...] } : filtre strictement par seasonIds demandés', async () => {
    // Le corpus FL1 actuel a seasonId = 'season-fl1-2099'
    const matchingResult = await provider.getMatches('FL1', undefined, undefined, { seasonIds: ['season-fl1-2099'] });
    expect(matchingResult).toHaveLength(20);

    const nonMatchingResult = await provider.getMatches('FL1', undefined, undefined, { seasonIds: ['season-2024', 'season-2025'] });
    expect(nonMatchingResult).toHaveLength(0);
  });
});


