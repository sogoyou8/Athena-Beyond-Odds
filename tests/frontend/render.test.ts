// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  renderUI,
  ClientState,
  createFormBadges,
  createSeasonStrengthElement,
} from '../../src/frontend/ts/render.js';
import { MatchDTO, AnalyticalMatchEntryDTO, SeasonStrengthProfileDTO } from '../../src/frontend/ts/api-client.js';

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

  describe('Form 5 Rendering Unit Tests (M-003)', () => {
    it('renders WIN, DRAW, LOSS as V, N, D with accessibility labels and CSS classes', () => {
      const formEl = createFormBadges({
        teamId: 't1',
        availability: 'AVAILABLE',
        results: ['WIN', 'DRAW', 'LOSS'],
      });

      const list = formEl.querySelector('.form-list');
      expect(list).not.toBeNull();
      expect(list?.getAttribute('aria-label')).toBe('Forme récente');

      const badges = formEl.querySelectorAll('.form-badge');
      expect(badges).toHaveLength(3);

      expect(badges[0].textContent).toBe('V');
      expect(badges[0].getAttribute('aria-label')).toBe('Victoire');
      expect(badges[0].className).toContain('form-badge-win');

      expect(badges[1].textContent).toBe('N');
      expect(badges[1].getAttribute('aria-label')).toBe('Nul');
      expect(badges[1].className).toContain('form-badge-draw');

      expect(badges[2].textContent).toBe('D');
      expect(badges[2].getAttribute('aria-label')).toBe('Défaite');
      expect(badges[2].className).toContain('form-badge-loss');
    });

    it('renders INSUFFICIENT_DATA with exact mandated French text', () => {
      const formEl = createFormBadges({
        teamId: 't1',
        availability: 'INSUFFICIENT_DATA',
        results: [],
      });

      expect(formEl.querySelector('.form-insufficient')?.textContent).toBe('Données de forme indisponibles');
    });

    it('renders UNAVAILABLE state with neutral French text', () => {
      const formEl = createFormBadges({
        teamId: 't1',
        availability: 'UNAVAILABLE',
        results: [],
      });

      expect(formEl.querySelector('.form-unavailable')?.textContent).toBe('Forme temporairement indisponible');
    });
  });

  describe('Season Strength Rendering Unit Tests (DEC-024)', () => {
    const availableProfile: SeasonStrengthProfileDTO = {
      teamId: 'team-alpha-001',
      overall: {
        availability: 'AVAILABLE',
        sampleSize: 6,
        metrics: {
          played: 6,
          wins: 4,
          draws: 1,
          losses: 1,
          points: 13,
          pointsPerMatch: 2.166666,
          goalsFor: 12,
          goalsAgainst: 5,
          goalDifference: 7,
          goalsForPerMatch: 2.0,
          goalsAgainstPerMatch: 0.833333,
        },
      },
      contextual: {
        venue: 'HOME',
        segment: {
          availability: 'AVAILABLE',
          sampleSize: 3,
          metrics: {
            played: 3,
            wins: 3,
            draws: 0,
            losses: 0,
            points: 9,
            pointsPerMatch: 3.0,
            goalsFor: 8,
            goalsAgainst: 2,
            goalDifference: 6,
            goalsForPerMatch: 2.666666,
            goalsAgainstPerMatch: 0.666666,
          },
        },
      },
    };

    it('renders AVAILABLE Season Strength with overall and contextual segments and 2-decimal formatted ratios', () => {
      const el = createSeasonStrengthElement(availableProfile);

      expect(el.getAttribute('aria-label')).toBe('Profil de force saisonnier');
      expect(el.textContent).toContain('Profil saison');
      expect(el.textContent).toContain('Global');
      expect(el.textContent).toContain('Domicile');

      // Check 2-decimal formatting (DEC-024)
      expect(el.textContent).toContain('2.17'); // pointsPerMatch
      expect(el.textContent).toContain('2.00'); // goalsForPerMatch
      expect(el.textContent).toContain('0.83'); // goalsAgainstPerMatch
      expect(el.textContent).toContain('+7');   // goalDifference
      expect(el.textContent).toContain('3.00'); // contextual pointsPerMatch
    });

    it('renders INSUFFICIENT_DATA and UNAVAILABLE without false 0.00 metrics', () => {
      const insufficientProfile: SeasonStrengthProfileDTO = {
        teamId: 'team-zeta-006',
        overall: {
          availability: 'INSUFFICIENT_DATA',
          sampleSize: 0,
          metrics: null,
        },
        contextual: {
          venue: 'AWAY',
          segment: {
            availability: 'INSUFFICIENT_DATA',
            sampleSize: 0,
            metrics: null,
          },
        },
      };

      const el = createSeasonStrengthElement(insufficientProfile);
      expect(el.textContent).toContain('Données saisonnières insuffisantes');
      expect(el.textContent).not.toContain('0.00');
      expect(el.textContent).not.toContain('NaN');
      expect(el.textContent).not.toContain('null');
      expect(el.textContent).not.toContain('undefined');
    });

    it('renders full analytical matches card including Form 5 and Season Strength without errors', () => {
      const analyticalMatches: AnalyticalMatchEntryDTO[] = [
        {
          match: {
            id: 'm1',
            competitionId: 'FL1',
            seasonId: '2025',
            matchday: 1,
            utcDate: '2026-08-15T20:00:00Z',
            status: 'SCHEDULED',
            homeTeam: { id: 't1', name: 'Alpha', shortName: 'Alpha', tla: 'ALF', crestUrl: null },
            awayTeam: { id: 't2', name: 'Beta', shortName: 'Beta', tla: 'BTU', crestUrl: null },
            score: { halfTime: { home: null, away: null }, fullTime: { home: null, away: null } },
          },
          form: {
            home: { teamId: 't1', availability: 'AVAILABLE', results: ['WIN', 'WIN'] },
            away: { teamId: 't2', availability: 'INSUFFICIENT_DATA', results: [] },
          },
          seasonStrength: {
            home: availableProfile,
            away: {
              teamId: 't2',
              overall: { availability: 'UNAVAILABLE', sampleSize: null, metrics: null },
              contextual: { venue: 'AWAY', segment: { availability: 'UNAVAILABLE', sampleSize: null, metrics: null } },
            },
          },
          headToHead: {
            overall: { availability: 'UNAVAILABLE', sampleSize: null, homeTeam: null, awayTeam: null, latestMeetingDate: null, oldestMeetingDate: null, seasonsCovered: null },
            contextual: { venue: 'SAME_VENUE', segment: { availability: 'UNAVAILABLE', sampleSize: null, homeTeam: null, awayTeam: null, latestMeetingDate: null, oldestMeetingDate: null, seasonsCovered: null } },
          },
        },
      ];

      renderUI(container, announcer, { status: 'matches', data: analyticalMatches });

      expect(container.textContent).not.toContain('undefined');
      expect(container.textContent).not.toContain('[object Object]');
      expect(container.textContent).not.toContain('NaN');
      expect(container.textContent).toContain('Alpha');
      expect(container.textContent).toContain('Beta');
      expect(container.textContent).toContain('Profil saison');
      expect(container.textContent).toContain('Profil saisonnier indisponible');
    });
  });
});
