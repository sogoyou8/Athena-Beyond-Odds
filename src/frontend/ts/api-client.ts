/**
 * Client API Same-Origin — Athena Frontend Phase 3.1, Phase 3.3 & Phase 3.4
 */

export interface TeamDTO {
  id: string;
  name: string;
  shortName: string;
  tla: string;
  crestUrl: string | null;
}

export interface ScorePeriodDTO {
  home: number | null;
  away: number | null;
}

export interface ScoreDTO {
  halfTime: ScorePeriodDTO;
  fullTime: ScorePeriodDTO;
  extraTime?: ScorePeriodDTO;
  penalties?: ScorePeriodDTO;
}

export interface MatchDTO {
  id: string;
  competitionId: string;
  seasonId: string;
  matchday: number;
  utcDate: string;
  status: string;
  homeTeam: TeamDTO;
  awayTeam: TeamDTO;
  score: ScoreDTO;
}

export type MatchesFetchResult =
  | { type: 'success'; data: MatchDTO[] }
  | { type: 'competitionUnavailable' }
  | { type: 'rateLimited' }
  | { type: 'providerUnavailable' }
  | { type: 'networkError' }
  | { type: 'unexpectedError' };

export type FormResultDTO = 'WIN' | 'DRAW' | 'LOSS';
export type FormAvailabilityDTO = 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';

export interface TeamFormDTO {
  teamId: string;
  availability: FormAvailabilityDTO;
  results: FormResultDTO[];
}

export type SeasonStrengthAvailabilityDTO = 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';

export interface SeasonStrengthMetricsDTO {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  pointsPerMatch: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  goalsForPerMatch: number;
  goalsAgainstPerMatch: number;
}

export type SeasonStrengthSegmentDTO =
  | {
      availability: 'AVAILABLE';
      sampleSize: number;
      metrics: SeasonStrengthMetricsDTO;
    }
  | {
      availability: 'INSUFFICIENT_DATA';
      sampleSize: 0;
      metrics: null;
    }
  | {
      availability: 'UNAVAILABLE';
      sampleSize: null;
      metrics: null;
    };

export interface ContextualSeasonStrengthDTO {
  venue: 'HOME' | 'AWAY';
  segment: SeasonStrengthSegmentDTO;
}

export interface SeasonStrengthProfileDTO {
  teamId: string;
  overall: SeasonStrengthSegmentDTO;
  contextual: ContextualSeasonStrengthDTO;
}

export type HeadToHeadAvailabilityDTO = 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';

export interface HeadToHeadPerspectiveDTO {
  teamId: string;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface HeadToHeadSegmentDTO {
  availability: HeadToHeadAvailabilityDTO;
  sampleSize: number | null;
  homeTeam: HeadToHeadPerspectiveDTO | null;
  awayTeam: HeadToHeadPerspectiveDTO | null;
  latestMeetingDate: string | null;
  oldestMeetingDate: string | null;
  seasonsCovered: number | null;
}

export interface HeadToHeadProfileDTO {
  overall: HeadToHeadSegmentDTO;
  contextual: {
    venue: 'SAME_VENUE';
    segment: HeadToHeadSegmentDTO;
  };
}

export type ScheduleLoadAvailabilityDTO = 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';

export interface ScheduleLoadProfileDTO {
  availability: ScheduleLoadAvailabilityDTO;
  daysSinceLastMatch: number | null;
  matchesLast7Days: number | null;
  matchesLast14Days: number | null;
  matchesLast28Days: number | null;
  minimumRestDaysInLast14Days: number | null;
  shortRest: boolean | null;
}

export type MomentumAvailabilityDTO = 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';

export interface MomentumWindowDTO {
  sampleSize: number;
  pointsPerMatch: number;
  goalsForPerMatch: number;
  goalsAgainstPerMatch: number;
  goalDifferencePerMatch: number;
}

export interface MomentumProfileDTO {
  availability: MomentumAvailabilityDTO;
  windowSize: number | null;
  recent: MomentumWindowDTO | null;
  previous: MomentumWindowDTO | null;
  pointsPerMatchDelta: number | null;
  goalDifferencePerMatchDelta: number | null;
}

export type OpponentContextAvailabilityDTO = 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';
export type OpponentVenueDTO = 'HOME' | 'AWAY';

export interface OpponentContextMetricsDTO {
  sampleSize: number;
  pointsPerMatch: number;
  goalDifferencePerMatch: number;
}

export interface OpponentContextEntryDTO {
  recentMatchId: string;
  opponentTeamId: string;
  opponentTeamName: string;
  matchDate: string;
  opponentVenue: OpponentVenueDTO;
  overall: OpponentContextMetricsDTO;
  contextual: OpponentContextMetricsDTO;
}

export interface OpponentContextProfileDTO {
  availability: OpponentContextAvailabilityDTO;
  recentMatchSampleSize: number | null;
  evaluatedOpponentSampleSize: number | null;
  contextualSampleSize: number | null;
  averageOpponentPointsPerMatch: number | null;
  averageOpponentGoalDifferencePerMatch: number | null;
  averageContextualOpponentPointsPerMatch: number | null;
  averageContextualOpponentGoalDifferencePerMatch: number | null;
  opponents: OpponentContextEntryDTO[];
}

export interface AnalyticalMatchEntryDTO {
  match: MatchDTO;
  form: {
    home: TeamFormDTO;
    away: TeamFormDTO;
  };
  seasonStrength?: {
    home: SeasonStrengthProfileDTO;
    away: SeasonStrengthProfileDTO;
  };
  headToHead?: HeadToHeadProfileDTO;
  scheduleLoad?: {
    home: ScheduleLoadProfileDTO;
    away: ScheduleLoadProfileDTO;
  };
  momentum?: {
    home: MomentumProfileDTO;
    away: MomentumProfileDTO;
  };
  opponentContext?: {
    home: OpponentContextProfileDTO;
    away: OpponentContextProfileDTO;
  };
}

export type AnalyticalMatchesFetchResult =
  | { type: 'success'; data: AnalyticalMatchEntryDTO[] }
  | { type: 'competitionUnavailable' }
  | { type: 'rateLimited' }
  | { type: 'providerUnavailable' }
  | { type: 'networkError' }
  | { type: 'unexpectedError' };

export async function checkHealth(fetchImpl: typeof fetch = globalThis.fetch): Promise<boolean> {
  try {
    const response = await fetchImpl('/health');
    return response.ok;
  } catch {
    return false;
  }
}

export async function fetchScheduledMatches(
  competitionCode: string = 'FL1',
  fetchImpl: typeof fetch = globalThis.fetch
): Promise<MatchesFetchResult> {
  try {
    const response = await fetchImpl(`/competitions/${encodeURIComponent(competitionCode)}/matches`);

    if (response.status === 200) {
      const json = (await response.json()) as { matches?: MatchDTO[] } | MatchDTO[];
      const data = Array.isArray(json) ? json : json.matches ?? [];
      return { type: 'success', data };
    }

    if (response.status === 404) {
      return { type: 'competitionUnavailable' };
    }

    if (response.status === 429) {
      return { type: 'rateLimited' };
    }

    if (response.status === 503) {
      return { type: 'providerUnavailable' };
    }

    return { type: 'unexpectedError' };
  } catch {
    return { type: 'networkError' };
  }
}

export async function fetchAnalyticalMatches(
  competitionCode: string = 'FL1',
  fetchImpl: typeof fetch = globalThis.fetch
): Promise<AnalyticalMatchesFetchResult> {
  try {
    const response = await fetchImpl(`/competitions/${encodeURIComponent(competitionCode)}/matches/analysis`);

    if (response.status === 200) {
      const json = (await response.json()) as { matches?: AnalyticalMatchEntryDTO[] } | AnalyticalMatchEntryDTO[];
      const data = Array.isArray(json) ? json : json.matches ?? [];
      return { type: 'success', data };
    }

    if (response.status === 404) {
      return { type: 'competitionUnavailable' };
    }

    if (response.status === 429) {
      return { type: 'rateLimited' };
    }

    if (response.status === 503) {
      return { type: 'providerUnavailable' };
    }

    return { type: 'unexpectedError' };
  } catch {
    return { type: 'networkError' };
  }
}
