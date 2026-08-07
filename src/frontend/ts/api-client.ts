/**
 * Client API Same-Origin — Athena Frontend Phase 3.1
 */

export interface TeamDTO {
  id: string;
  name: string;
  shortName: string;
  tla: string;
  crestUrl: string | null;
}

export interface ScoreDTO {
  home: number | null;
  away: number | null;
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
