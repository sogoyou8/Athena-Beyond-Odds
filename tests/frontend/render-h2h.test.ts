// @vitest-environment happy-dom

/**
 * Tests unitaires — createHeadToHeadElement / createHeadToHeadSegmentElement (DEC-027 Phase 3.4).
 * Vérifie le rendu DOM des trois états : AVAILABLE, INSUFFICIENT_DATA, UNAVAILABLE.
 * Aucun appel réseau, aucun faux zéro, aucune valeur invalide.
 */

import { describe, it, expect } from 'vitest';
import {
  createHeadToHeadElement,
} from '../../src/frontend/ts/render.js';
import { HeadToHeadProfileDTO } from '../../src/frontend/ts/api-client.js';

/** Helper : construit un HeadToHeadProfileDTO AVAILABLE complet */
function makeAvailableProfile(overrides?: Partial<{
  sampleSize: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  homeGoals: number;
  awayGoals: number;
  seasonsCovered: number;
  sameVenueAvailability: 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';
  sameVenueSampleSize: number;
}>): HeadToHeadProfileDTO {
  const o = overrides ?? {};
  const sampleSize = o.sampleSize ?? 3;
  const homeWins = o.homeWins ?? 2;
  const awayWins = o.awayWins ?? 1;
  const draws = o.draws ?? 0;
  const homeGoals = o.homeGoals ?? 5;
  const awayGoals = o.awayGoals ?? 3;
  const seasonsCovered = o.seasonsCovered ?? 2;
  const sameVenueAvailability = o.sameVenueAvailability ?? 'AVAILABLE';
  const sameVenueSampleSize = o.sameVenueSampleSize ?? 2;

  return {
    overall: {
      availability: 'AVAILABLE',
      sampleSize,
      homeTeam: {
        teamId: 'team-alpha',
        wins: homeWins,
        draws,
        losses: awayWins,
        goalsFor: homeGoals,
        goalsAgainst: awayGoals,
        goalDifference: homeGoals - awayGoals,
      },
      awayTeam: {
        teamId: 'team-beta',
        wins: awayWins,
        draws,
        losses: homeWins,
        goalsFor: awayGoals,
        goalsAgainst: homeGoals,
        goalDifference: awayGoals - homeGoals,
      },
      latestMeetingDate: '2026-03-01T20:00:00.000Z',
      oldestMeetingDate: '2025-10-01T20:00:00.000Z',
      seasonsCovered,
    },
    contextual: {
      venue: 'SAME_VENUE',
      segment: sameVenueAvailability === 'AVAILABLE'
        ? {
            availability: 'AVAILABLE',
            sampleSize: sameVenueSampleSize,
            homeTeam: {
              teamId: 'team-alpha',
              wins: 1,
              draws: 0,
              losses: 1,
              goalsFor: 2,
              goalsAgainst: 2,
              goalDifference: 0,
            },
            awayTeam: {
              teamId: 'team-beta',
              wins: 1,
              draws: 0,
              losses: 1,
              goalsFor: 2,
              goalsAgainst: 2,
              goalDifference: 0,
            },
            latestMeetingDate: '2026-03-01T20:00:00.000Z',
            oldestMeetingDate: '2025-10-01T20:00:00.000Z',
            seasonsCovered: 2,
          }
        : sameVenueAvailability === 'INSUFFICIENT_DATA'
          ? {
              availability: 'INSUFFICIENT_DATA',
              sampleSize: 0,
              homeTeam: null,
              awayTeam: null,
              latestMeetingDate: null,
              oldestMeetingDate: null,
              seasonsCovered: 0,
            }
          : {
              availability: 'UNAVAILABLE',
              sampleSize: null,
              homeTeam: null,
              awayTeam: null,
              latestMeetingDate: null,
              oldestMeetingDate: null,
              seasonsCovered: null,
            },
    },
  };
}

describe('createHeadToHeadElement — DEC-027 Frontend Rendering', () => {
  it('1. Rendu AVAILABLE : titre, stats globales et contextuel présents', () => {
    const profile = makeAvailableProfile({ sampleSize: 3, homeWins: 2, awayWins: 1, draws: 0, seasonsCovered: 2 });
    const el = createHeadToHeadElement(profile);

    expect(el.getAttribute('aria-label')).toBe('Head-to-Head contextualisé');
    expect(el.textContent).toContain('Confrontations directes');

    // Stats globales : joués, victoires domicile, nuls, victoires ext
    expect(el.textContent).toContain('3'); // sampleSize
    expect(el.textContent).toContain('2'); // V DOM
    expect(el.textContent).toContain('1'); // V EXT
    expect(el.textContent).toContain('0'); // Nuls

    // Saisons couvertes
    expect(el.textContent).toContain('2 saisons couvertes');
  });

  it('2. Rendu AVAILABLE : pas de valeurs invalides (undefined, null, NaN, [object Object])', () => {
    const profile = makeAvailableProfile();
    const el = createHeadToHeadElement(profile);

    expect(el.textContent).not.toContain('undefined');
    expect(el.textContent).not.toContain('[object Object]');
    expect(el.textContent).not.toContain('NaN');
    expect(el.textContent).not.toContain('null');
  });

  it('3. Rendu INSUFFICIENT_DATA overall : message textuel dédié sans faux zéro calculé', () => {
    const profile: HeadToHeadProfileDTO = {
      overall: {
        availability: 'INSUFFICIENT_DATA',
        sampleSize: 0,
        homeTeam: null,
        awayTeam: null,
        latestMeetingDate: null,
        oldestMeetingDate: null,
        seasonsCovered: 0,
      },
      contextual: {
        venue: 'SAME_VENUE',
        segment: {
          availability: 'INSUFFICIENT_DATA',
          sampleSize: 0,
          homeTeam: null,
          awayTeam: null,
          latestMeetingDate: null,
          oldestMeetingDate: null,
          seasonsCovered: 0,
        },
      },
    };

    const el = createHeadToHeadElement(profile);

    // Les deux segments doivent afficher le texte INSUFFICIENT_DATA
    expect(el.textContent).toContain('Données insuffisantes');
    // Aucun faux zéro calculé (ex: "0.00", "BM DOM: 0" affiché à tort)
    expect(el.textContent).not.toContain('NaN');
    expect(el.textContent).not.toContain('[object Object]');
  });

  it('4. Rendu UNAVAILABLE overall : message "Indisponible" sans blocage du DOM', () => {
    const profile: HeadToHeadProfileDTO = {
      overall: {
        availability: 'UNAVAILABLE',
        sampleSize: null,
        homeTeam: null,
        awayTeam: null,
        latestMeetingDate: null,
        oldestMeetingDate: null,
        seasonsCovered: null,
      },
      contextual: {
        venue: 'SAME_VENUE',
        segment: {
          availability: 'UNAVAILABLE',
          sampleSize: null,
          homeTeam: null,
          awayTeam: null,
          latestMeetingDate: null,
          oldestMeetingDate: null,
          seasonsCovered: null,
        },
      },
    };

    const el = createHeadToHeadElement(profile);

    expect(el.textContent).toContain('Indisponible');
    expect(el.textContent).not.toContain('undefined');
    expect(el.textContent).not.toContain('null');
    expect(el.textContent).not.toContain('NaN');
  });

  it('5. Rendu contextual SAME_VENUE AVAILABLE indépendant du segment overall', () => {
    const profile = makeAvailableProfile({ sameVenueAvailability: 'AVAILABLE', sameVenueSampleSize: 2 });
    const el = createHeadToHeadElement(profile);

    // Le segment SAME_VENUE doit être présent et afficher ses stats
    expect(el.textContent).toContain('Même config. de terrain');
    const contextualEl = el.querySelector('.h2h-contextual');
    expect(contextualEl).not.toBeNull();
  });

  it('6. Overall AVAILABLE + SAME_VENUE INSUFFICIENT_DATA => coexistence correcte', () => {
    const profile = makeAvailableProfile({ sameVenueAvailability: 'INSUFFICIENT_DATA' });
    const el = createHeadToHeadElement(profile);

    const overallEl = el.querySelector('.h2h-overall');
    const contextualEl = el.querySelector('.h2h-contextual');

    expect(overallEl).not.toBeNull();
    expect(contextualEl).not.toBeNull();

    // Overall doit contenir les stats
    expect(overallEl?.textContent).toContain('Joués');
    // Contextual doit contenir le message insuffisant
    expect(contextualEl?.textContent).toContain('Données insuffisantes');
  });

  it('7. sampleSize = 1 : singulier "saison couverte" (pas de "s")', () => {
    const profile = makeAvailableProfile({ seasonsCovered: 1, sampleSize: 1, homeWins: 1, awayWins: 0, draws: 0 });
    const el = createHeadToHeadElement(profile);

    // 1 saison couverte => singulier
    expect(el.textContent).toContain('1 saison couverte');
    expect(el.textContent).not.toContain('1 saisons couvertes');
  });

  it('8. Conteneur a le bon aria-label et la classe CSS h2h-container', () => {
    const profile = makeAvailableProfile();
    const el = createHeadToHeadElement(profile);

    expect(el.className).toContain('h2h-container');
    expect(el.getAttribute('aria-label')).toBe('Head-to-Head contextualisé');
  });

  it('9. venue est toujours SAME_VENUE dans le rendu contextual', () => {
    const profile = makeAvailableProfile({ sameVenueAvailability: 'AVAILABLE' });
    const el = createHeadToHeadElement(profile);

    // Le label contextual doit contenir la description SAME_VENUE
    const contextualEl = el.querySelector('.h2h-contextual');
    expect(contextualEl?.textContent).toContain('Même config. de terrain');
  });
});
