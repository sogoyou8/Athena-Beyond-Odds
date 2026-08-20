import { describe, it, expect } from 'vitest';
import { ScheduleLoadCalculator } from '../../src/domain/services/schedule-load-calculator.js';
import { Match } from '../../src/domain/entities/match.js';
import { Team } from '../../src/domain/entities/team.js';
import { MatchStatus } from '../../src/domain/value-objects/match-status.js';

const TEAM_ALPHA: Team = {
  id: 'team-alpha-001',
  name: 'Alpha FC',
  shortName: 'Alpha',
  tla: 'ALF',
  crestUrl: null,
  providerMetadata: {
    providerName: 'in-memory',
    externalId: 'team-001',
    lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
  },
};

const TEAM_BETA: Team = {
  id: 'team-beta-002',
  name: 'Beta United',
  shortName: 'Beta',
  tla: 'BTU',
  crestUrl: null,
  providerMetadata: {
    providerName: 'in-memory',
    externalId: 'team-002',
    lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
  },
};

const TEAM_GAMMA: Team = {
  id: 'team-gamma-003',
  name: 'Gamma City',
  shortName: 'Gamma',
  tla: 'GCC',
  crestUrl: null,
  providerMetadata: {
    providerName: 'in-memory',
    externalId: 'team-003',
    lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
  },
};

function createMatch(
  id: string,
  utcDateStr: string,
  homeTeam: Team,
  awayTeam: Team,
  options: {
    competitionId?: string;
    seasonId?: string;
    status?: MatchStatus;
    scoreHome?: number | null;
    scoreAway?: number | null;
  } = {}
): Match {
  return {
    id,
    competitionId: options.competitionId ?? 'FL1',
    seasonId: options.seasonId ?? 'season-current',
    matchday: 1,
    utcDate: new Date(utcDateStr),
    status: options.status ?? 'FINISHED',
    homeTeam,
    awayTeam,
    score: {
      halfTime: { home: null, away: null },
      fullTime: {
        home: options.scoreHome !== undefined ? options.scoreHome : 1,
        away: options.scoreAway !== undefined ? options.scoreAway : 0,
      },
    },
    providerMetadata: {
      providerName: 'test',
      externalId: id,
      lastUpdated: new Date(utcDateStr),
    },
  };
}

describe('ScheduleLoadCalculator (Domain Service Unit Tests)', () => {
  const calculator = new ScheduleLoadCalculator();

  const targetMatch = createMatch(
    'target-001',
    '2099-08-20T20:00:00.000Z',
    TEAM_ALPHA,
    TEAM_BETA,
    { status: 'SCHEDULED', seasonId: 'season-current' }
  );

  // 1. Pureté et immutabilité
  it('1. doit être un service de domaine pur, sans effet de bord ni mutation du tableau d\'entrée', () => {
    const history = [
      createMatch('hist-1', '2099-08-15T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
    ];
    const snapshot = JSON.stringify(history);

    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.availability).toBe('AVAILABLE');
    expect(JSON.stringify(history)).toBe(snapshot);
  });

  // 2. Cas Golden A : J-5 même saison -> 5 jours, shortRest = false
  it('2. Cas Golden A: dernier match même saison il y a 5 jours -> days=5, shortRest=false', () => {
    const history = [
      createMatch('hist-1', '2099-08-15T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA), // 5 jours avant
    ];
    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result).toEqual({
      availability: 'AVAILABLE',
      daysSinceLastMatch: 5,
      matchesLast7Days: 1,
      matchesLast14Days: 1,
      matchesLast28Days: 1,
      minimumRestDaysInLast14Days: null,
      shortRest: false,
    });
  });

  // 3. Cas Golden B : J-35 même saison -> 35 jours, shortRest = false
  it('3. Cas Golden B: dernier match même saison il y a 35 jours -> days=35, shortRest=false, fenêtres 7/14/28 = 0', () => {
    const history = [
      createMatch('hist-1', '2099-07-16T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA), // 35 jours avant
    ];
    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result).toEqual({
      availability: 'AVAILABLE',
      daysSinceLastMatch: 35,
      matchesLast7Days: 0,
      matchesLast14Days: 0,
      matchesLast28Days: 0,
      minimumRestDaysInLast14Days: null,
      shortRest: false,
    });
  });

  // 4. Cas Golden C : N-1 à J-16 (carryover <= 28j) -> 16 jours, shortRest = false
  it('4. Cas Golden C: premier match saison N, dernier match N-1 à J-16 -> days=16, shortRest=false', () => {
    const history = [
      createMatch('hist-n1', '2099-08-04T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA, {
        seasonId: 'season-previous',
      }),
    ];
    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result).toEqual({
      availability: 'AVAILABLE',
      daysSinceLastMatch: 16,
      matchesLast7Days: 0,
      matchesLast14Days: 0,
      matchesLast28Days: 1,
      minimumRestDaysInLast14Days: null,
      shortRest: false,
    });
  });

  // 5. Cas Golden D : N-1 à J-82 (carryover > 28j) -> exclu, INSUFFICIENT_DATA
  it('5. Cas Golden D: premier match saison N, dernier match N-1 à J-82 -> exclu -> INSUFFICIENT_DATA', () => {
    const history = [
      createMatch('hist-n1', '2099-05-30T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA, {
        seasonId: 'season-previous',
      }),
    ];
    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result).toEqual({
      availability: 'INSUFFICIENT_DATA',
      daysSinceLastMatch: null,
      matchesLast7Days: null,
      matchesLast14Days: null,
      matchesLast28Days: null,
      minimumRestDaysInLast14Days: null,
      shortRest: null,
    });
  });

  // 6. Cas Golden E : N-2 systématiquement exclu
  it('6. Cas Golden E: match N-2 même à J-10 est exclu -> INSUFFICIENT_DATA', () => {
    const history = [
      // N-1 (pour Beta/Gamma, plus récent, ex: 1er août)
      createMatch('hist-n1', '2099-08-01T20:00:00.000Z', TEAM_BETA, TEAM_GAMMA, {
        seasonId: 'season-n-minus-1',
      }),
      // N-2 (pour Alpha, plus ancien, ex: 1er mai)
      createMatch('hist-n2', '2099-05-01T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA, {
        seasonId: 'season-n-minus-2',
      }),
    ];
    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.availability).toBe('INSUFFICIENT_DATA');
  });

  // 7. Strict target cutoff : match à la même date ou heure postérieure exclu
  it('7. strict target cutoff: match le jour même à la même heure ou plus tard est exclu', () => {
    const history = [
      createMatch('hist-same-time', '2099-08-20T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
      createMatch('hist-future', '2099-08-21T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
    ];
    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.availability).toBe('INSUFFICIENT_DATA');
  });

  // 8. Matchs FINISHED uniquement
  it('8. ignore les matchs avec statut autre que FINISHED (ex: SCHEDULED, LIVE, POSTPONED)', () => {
    const history = [
      createMatch('hist-live', '2099-08-18T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA, {
        status: 'LIVE',
      }),
      createMatch('hist-postponed', '2099-08-17T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA, {
        status: 'POSTPONED',
      }),
    ];
    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.availability).toBe('INSUFFICIENT_DATA');
  });

  // 9. Score fullTime null/incomplet accepté pour FINISHED
  it('9. accepte et comptabilise un match FINISHED même si le score fullTime est null', () => {
    const history = [
      createMatch('hist-noscore', '2099-08-18T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA, {
        status: 'FINISHED',
        scoreHome: null,
        scoreAway: null,
      }),
    ];
    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.availability).toBe('AVAILABLE');
    expect(result.daysSinceLastMatch).toBe(2);
    expect(result.shortRest).toBe(true);
  });

  // 10. Mauvaise compétition exclue
  it('10. exclut les matchs d\'une autre compétition', () => {
    const history = [
      createMatch('hist-other-comp', '2099-08-18T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA, {
        competitionId: 'PL',
      }),
    ];
    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.availability).toBe('INSUFFICIENT_DATA');
  });

  // 11. Mauvaise équipe exclue
  it('11. exclut les matchs auxquels l\'équipe ne participe pas', () => {
    const history = [
      createMatch('hist-other-teams', '2099-08-18T20:00:00.000Z', TEAM_BETA, TEAM_GAMMA),
    ];
    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.availability).toBe('INSUFFICIENT_DATA');
  });

  // 12. Fenêtres de congestion : J-7, J-14, J-28 avec bornes exactes
  it('12. fenêtres 7/14/28 avec borne basse incluse et targetDate exclue', () => {
    const history = [
      // Exactement à J-7 (2099-08-13T20:00:00.000Z) -> compté dans 7, 14, 28
      createMatch('m-7', '2099-08-13T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
      // À J-8 (2099-08-12T20:00:00.000Z) -> compté dans 14, 28 (pas 7)
      createMatch('m-8', '2099-08-12T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
      // Exactement à J-14 (2099-08-06T20:00:00.000Z) -> compté dans 14, 28
      createMatch('m-14', '2099-08-06T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
      // À J-15 (2099-08-05T20:00:00.000Z) -> compté dans 28
      createMatch('m-15', '2099-08-05T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
      // Exactement à J-28 (2099-07-23T20:00:00.000Z) -> compté dans 28
      createMatch('m-28', '2099-07-23T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
      // À J-29 (2099-07-22T20:00:00.000Z) -> hors des fenêtres
      createMatch('m-29', '2099-07-22T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
    ];

    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.daysSinceLastMatch).toBe(7);
    expect(result.matchesLast7Days).toBe(1);
    expect(result.matchesLast14Days).toBe(3);
    expect(result.matchesLast28Days).toBe(5);
  });

  // 13. shortRest : 0, 1, 2, 3 -> true ; 4, 5 -> false
  it('13. shortRest seuils exacts : 0..3 -> true, 4.. -> false', () => {
    // Écart 71h (2j complets) -> shortRest = true
    const h1 = [createMatch('m-1', '2099-08-17T21:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA)];
    expect(calculator.calculate(TEAM_ALPHA.id, targetMatch, h1).shortRest).toBe(true);

    // Écart 72h (3j complets) -> shortRest = true
    const h2 = [createMatch('m-2', '2099-08-17T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA)];
    expect(calculator.calculate(TEAM_ALPHA.id, targetMatch, h2).shortRest).toBe(true);

    // Écart 96h (4j complets) -> shortRest = false
    const h3 = [createMatch('m-3', '2099-08-16T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA)];
    expect(calculator.calculate(TEAM_ALPHA.id, targetMatch, h3).shortRest).toBe(false);
  });

  // 14. minimumRestDaysInLast14Days avec deux matchs dans la fenêtre J-14
  it('14. minimumRestDaysInLast14Days : calcule le minimum des écarts entre matchs consécutifs dans J-14', () => {
    const history = [
      createMatch('m-1', '2099-08-17T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA), // J-3
      createMatch('m-2', '2099-08-14T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA), // J-6 (écart m2->m1 = 3j)
      createMatch('m-3', '2099-08-09T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA), // J-11 (écart m3->m2 = 5j)
    ];

    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.minimumRestDaysInLast14Days).toBe(3);
  });

  // 15. minimumRestDaysInLast14Days avec prédécesseur hors J-14
  it('15. minimumRestDaysInLast14Days (MINOR-002) : inclut la paire dont le match récent est dans J-14 et prédécesseur hors J-14', () => {
    const history = [
      createMatch('m-1', '2099-08-10T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA), // J-10 (dans J-14)
      createMatch('m-0', '2099-08-04T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA), // J-16 (hors J-14, mais prédécesseur de m-1 -> écart 6j)
    ];

    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.minimumRestDaysInLast14Days).toBe(6);
  });

  // 16. minimumRestDaysInLast14Days = null si 1 seul match sans intervalle éligible
  it('16. minimumRestDaysInLast14Days : retourne null si 1 seul match dans l\'historique', () => {
    const history = [
      createMatch('m-1', '2099-08-10T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
    ];

    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.minimumRestDaysInLast14Days).toBeNull();
  });

  // 17. Déterminisme du tie-break Match.id
  it('17. tie-break déterministe Match.id en cas d\'égalité de timestamp', () => {
    const history = [
      createMatch('match-bbb', '2099-08-15T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
      createMatch('match-aaa', '2099-08-15T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA),
    ];

    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.availability).toBe('AVAILABLE');
    expect(result.daysSinceLastMatch).toBe(5);
  });

  // 18. Résolution provider-neutral de N-1 sans parsing textuel
  it('18. résolution provider-neutral de PREVIOUS_SEASON_ID sans parsing de chaînes', () => {
    const history = [
      // Saison alpha-custom (N-1)
      createMatch('m-prev', '2099-08-01T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA, {
        seasonId: 'arbitrary-uuid-season-previous',
      }),
      // Saison ancienne (N-2)
      createMatch('m-old', '2098-05-01T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA, {
        seasonId: 'arbitrary-uuid-season-old',
      }),
    ];

    const result = calculator.calculate(TEAM_ALPHA.id, targetMatch, history);
    expect(result.availability).toBe('AVAILABLE');
    expect(result.daysSinceLastMatch).toBe(19);
  });
});
