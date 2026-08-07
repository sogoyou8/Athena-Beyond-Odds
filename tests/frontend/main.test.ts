// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AthenaApp } from '../../src/frontend/ts/main.js';
import { MatchDTO, MatchesFetchResult } from '../../src/frontend/ts/api-client.js';

describe('AthenaApp Main Orchestration Unit Tests (happy-dom)', () => {
  let container: HTMLElement;
  let announcer: HTMLElement;
  let themeToggleBtn: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement('div');
    announcer = document.createElement('div');
    themeToggleBtn = document.createElement('button');
    document.documentElement.removeAttribute('data-theme');
  });

  it('doit basculer le thème clair/sombre sans persistance', () => {
    const app = new AthenaApp(container, announcer, themeToggleBtn, {
      checkHealthImpl: async () => true,
      fetchMatchesImpl: async () => ({ type: 'success', data: [] }),
    });

    app.initTheme();

    const initialTheme = document.documentElement.getAttribute('data-theme');
    expect(initialTheme).toMatch(/light|dark/);

    themeToggleBtn.click();
    const toggledTheme = document.documentElement.getAttribute('data-theme');
    expect(toggledTheme).not.toBe(initialTheme);

    themeToggleBtn.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe(initialTheme);
  });

  it('doit passer en healthUnavailable si checkHealth échoue', async () => {
    const mockHealth = vi.fn().mockResolvedValue(false);
    const mockFetchMatches = vi.fn();

    const app = new AthenaApp(container, announcer, themeToggleBtn, {
      checkHealthImpl: mockHealth,
      fetchMatchesImpl: mockFetchMatches,
    });

    await app.loadData();

    expect(mockHealth).toHaveBeenCalledTimes(1);
    expect(mockFetchMatches).not.toHaveBeenCalled();
    expect(app.getState()).toEqual({ status: 'healthUnavailable' });
    expect(container.textContent).toContain('Maintenance');
  });

  it('doit charger les matchs et passer en état matches si health réussit', async () => {
    const mockMatches: MatchDTO[] = [
      {
        id: 'm1',
        competitionId: 'FL1',
        seasonId: '2025',
        matchday: 1,
        utcDate: '2026-08-15T20:00:00Z',
        status: 'SCHEDULED',
        homeTeam: { id: 't1', name: 'PSG', shortName: 'PSG', tla: 'PSG', crestUrl: null },
        awayTeam: { id: 't2', name: 'OM', shortName: 'OM', tla: 'OM', crestUrl: null },
        score: { home: null, away: null },
      },
    ];

    const app = new AthenaApp(container, announcer, themeToggleBtn, {
      checkHealthImpl: async () => true,
      fetchMatchesImpl: async () => ({ type: 'success', data: mockMatches }),
    });

    await app.loadData();

    expect(app.getState()).toEqual({ status: 'matches', data: mockMatches });
    expect(container.textContent).toContain('PSG');
  });

  it('doit passer en état empty si les matchs retournent un tableau vide', async () => {
    const app = new AthenaApp(container, announcer, themeToggleBtn, {
      checkHealthImpl: async () => true,
      fetchMatchesImpl: async () => ({ type: 'success', data: [] }),
    });

    await app.loadData();

    expect(app.getState()).toEqual({ status: 'empty' });
    expect(container.textContent).toContain('Aucun match programmé sur la période disponible.');
  });

  it('doit relancer le chargement sur clic Réessayer', async () => {
    let callCount = 0;
    const mockFetchMatches = vi.fn().mockImplementation(async (): Promise<MatchesFetchResult> => {
      callCount++;
      if (callCount === 1) {
        return { type: 'networkError' };
      }
      return { type: 'success', data: [] };
    });

    const app = new AthenaApp(container, announcer, themeToggleBtn, {
      checkHealthImpl: async () => true,
      fetchMatchesImpl: mockFetchMatches,
    });

    await app.loadData();
    expect(app.getState()).toEqual({ status: 'networkUnavailable' });

    const retryBtn = container.querySelector('.retry-btn') as HTMLButtonElement | null;
    expect(retryBtn).not.toBeNull();

    retryBtn?.click();
    // Attendre la résolution asynchrone
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(mockFetchMatches).toHaveBeenCalledTimes(2);
    expect(app.getState()).toEqual({ status: 'empty' });
  });
});
