// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderUI, ClientState } from '../../src/frontend/ts/render.js';
import { MatchDTO } from '../../src/frontend/ts/api-client.js';

describe('Render DOM Unit Tests (happy-dom)', () => {
  let container: HTMLElement;
  let announcer: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    announcer = document.createElement('div');
  });

  it('doit rendre l état loading et notifier l announcer', () => {
    renderUI(container, announcer, { status: 'loading' });

    expect(announcer.textContent).toContain('Chargement');
    expect(container.querySelector('.state-title')?.textContent).toBe('Chargement en cours');
  });

  it('doit rendre l état empty avec le message exact obligatoire', () => {
    const expectedMsg = 'Aucun match programmé sur la période disponible.';
    renderUI(container, announcer, { status: 'empty' });

    expect(announcer.textContent).toBe(expectedMsg);
    expect(container.querySelector('.state-message')?.textContent).toBe(expectedMsg);
  });

  it('doit rendre une liste de matchs (matches) avec textContent sécurisé', () => {
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
        score: {
          halfTime: { home: null, away: null },
          fullTime: { home: null, away: null },
        },
      },
    ];

    renderUI(container, announcer, { status: 'matches', data: mockMatches });

    expect(announcer.textContent).toContain('1 matchs disponibles.');
    expect(container.querySelector('.match-grid')).not.toBeNull();
    expect(container.querySelector('.match-card')).not.toBeNull();
    expect(container.textContent).toContain('PSG');
    expect(container.textContent).toContain('OM');
  });

  it('doit rendre correctement les scores non joués (-) et joués sans jamais afficher undefined', () => {
    const realContractMatches: MatchDTO[] = [
      {
        id: 'm-unplayed',
        competitionId: 'FL1',
        seasonId: '2025',
        matchday: 1,
        utcDate: '2026-08-15T20:00:00Z',
        status: 'SCHEDULED',
        homeTeam: { id: 't1', name: 'Lyon', shortName: 'Lyon', tla: 'OL', crestUrl: null },
        awayTeam: { id: 't2', name: 'Lille', shortName: 'Lille', tla: 'LOSC', crestUrl: null },
        score: {
          halfTime: { home: null, away: null },
          fullTime: { home: null, away: null },
        },
      },
      {
        id: 'm-played',
        competitionId: 'FL1',
        seasonId: '2025',
        matchday: 1,
        utcDate: '2026-08-15T18:00:00Z',
        status: 'FINISHED',
        homeTeam: { id: 't3', name: 'Monaco', shortName: 'Monaco', tla: 'ASM', crestUrl: null },
        awayTeam: { id: 't4', name: 'Rennes', shortName: 'Rennes', tla: 'SRFC', crestUrl: null },
        score: {
          halfTime: { home: 1, away: 0 },
          fullTime: { home: 2, away: 1 },
        },
      },
    ];

    renderUI(container, announcer, { status: 'matches', data: realContractMatches });

    expect(container.textContent).not.toContain('undefined');
    expect(container.textContent).not.toContain('[object Object]');
    expect(container.textContent).toContain('Monaco');
    expect(container.textContent).toContain('2');
    expect(container.textContent).toContain('1');
  });

  it('doit neutraliser les attaques XSS et insérer les données uniquement via textContent', () => {
    const maliciousMatch: MatchDTO = {
      id: 'm2',
      competitionId: 'FL1',
      seasonId: '2025',
      matchday: 2,
      utcDate: '2026-08-20T20:00:00Z',
      status: 'SCHEDULED',
      homeTeam: { id: 't3', name: '<img src=x onerror=alert(1)>', shortName: 'MALICIOUS', tla: 'XSS', crestUrl: null },
      awayTeam: { id: 't4', name: 'Nice', shortName: 'Nice', tla: 'OGC', crestUrl: null },
      score: {
        halfTime: { home: null, away: null },
        fullTime: { home: null, away: null },
      },
    };

    renderUI(container, announcer, { status: 'matches', data: [maliciousMatch] });

    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('doit afficher un bouton Réessayer sur les états récupérables et déclencher le callback', () => {
    const onRetry = vi.fn();
    renderUI(container, announcer, { status: 'providerUnavailable' }, { onRetry });

    const btn = container.querySelector('.retry-btn') as HTMLButtonElement | null;
    expect(btn).not.toBeNull();
    expect(btn?.textContent).toBe('Réessayer');

    btn?.click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('ne doit pas afficher de bouton Réessayer pour competitionUnavailable', () => {
    renderUI(container, announcer, { status: 'competitionUnavailable' });

    expect(container.querySelector('.retry-btn')).toBeNull();
    expect(container.textContent).toContain('Seule la Ligue 1 (FL1) est disponible');
  });
});
