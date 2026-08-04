/**
 * Frontière technique — Adaptateur football-data.org.
 * Couche Infrastructure — implémente le port SportsDataProvider.
 *
 * Implémentation Phase 2.8 — Connexion réelle à l'API football-data.org v4.
 *
 * Principes et garde-fous (DEC-006) :
 * 1. Utilise globalThis.fetch natif sans dépendance npm. Transport HTTP injectable.
 * 2. Authentification via en-tête X-Auth-Token. Aucun token dans les logs ou les URL.
 * 3. Clé API transmise via le constructeur.
 * 4. Fenêtre temporelle [dateFrom, dateFrom + 7 jours) UTC (dateTo exclusive). Horloge injectable.
 * 5. Filtre final pour conserver uniquement les matchs au statut SCHEDULED.
 * 6. Délai maximal de 8 secondes par requête via AbortController.
 * 7. HTTP 429 -> ProviderRateLimitError (puis HTTP 429).
 * 8. Erreurs réseau, timeout, HTTP 401, 403, 5xx, JSON invalide, mapping incompatible -> ProviderUnavailableError (puis HTTP 503).
 *
 * Références : phase-2-8-real-provider-validation-pack.md (DEC-006)
 */

import { SportsDataProvider } from '../../../application/ports/sports-data-provider.js';
import {
  NotImplementedError,
  ProviderRateLimitError,
  ProviderUnavailableError,
} from '../../../application/errors/index.js';
import { Competition } from '../../../domain/entities/competition.js';
import { Match } from '../../../domain/entities/match.js';
import { MatchStatus } from '../../../domain/value-objects/match-status.js';
import { Team } from '../../../domain/entities/team.js';
import { Score } from '../../../domain/value-objects/score.js';

export type HttpFetchFn = (
  input: string | URL,
  init?: RequestInit
) => Promise<Response>;

export type ClockFn = () => Date;

export interface FootballDataOrgAdapterOptions {
  apiKey?: string;
  baseUrl?: string;
  fetchFn?: HttpFetchFn;
  clockFn?: ClockFn;
  timeoutMs?: number;
}

const DEFAULT_BASE_URL = 'https://api.football-data.org/v4';
const DEFAULT_TIMEOUT_MS = 8000;

interface FootballDataTeam {
  id?: number;
  name?: string;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
}

interface FootballDataMatch {
  id?: number;
  utcDate?: string;
  status?: string;
  matchday?: number | null;
  homeTeam?: FootballDataTeam;
  awayTeam?: FootballDataTeam;
  score?: {
    fullTime?: {
      home?: number | null;
      away?: number | null;
    };
    halfTime?: {
      home?: number | null;
      away?: number | null;
    };
  };
}

interface FootballDataMatchesResponse {
  matches?: FootballDataMatch[];
}

export class FootballDataOrgAdapter implements SportsDataProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchFn: HttpFetchFn;
  private readonly clockFn: ClockFn;
  private readonly timeoutMs: number;

  constructor(options: FootballDataOrgAdapterOptions = {}) {
    this.apiKey = options.apiKey ?? process.env['FOOTBALL_DATA_API_KEY']?.trim() ?? '';
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.fetchFn = options.fetchFn ?? globalThis.fetch;
    this.clockFn = options.clockFn ?? (() => new Date());
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    if (!this.fetchFn) {
      throw new ProviderUnavailableError(
        'Le client HTTP fetch natif n\'est pas disponible dans cet environnement.'
      );
    }
  }

  getCompetitions(): Promise<Competition[]> {
    throw new NotImplementedError('FootballDataOrgAdapter.getCompetitions');
  }

  async getMatches(
    competitionCode: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Match[]> {
    let dateFromStr: string;
    let dateToStr: string;

    if (fromDate !== undefined && toDate !== undefined) {
      // Both explicit bounds provided — use them as-is (DEC-008.3 / Option A).
      dateFromStr = this.formatUtcDate(fromDate);
      dateToStr = this.formatUtcDate(toDate);
    } else {
      // Default: rolling 7-day UTC window starting from now.
      const now = this.clockFn();
      dateFromStr = this.formatUtcDate(now);
      const endDate = new Date(now.getTime());
      endDate.setUTCDate(endDate.getUTCDate() + 7);
      dateToStr = this.formatUtcDate(endDate);
    }

    const url = `${this.baseUrl}/competitions/${encodeURIComponent(
      competitionCode
    )}/matches?dateFrom=${dateFromStr}&dateTo=${dateToStr}`;

    let response: Response;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      response = await this.fetchFn(url, {
        method: 'GET',
        headers: {
          'X-Auth-Token': this.apiKey,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ProviderUnavailableError(
          `Délai dépassé (${this.timeoutMs}ms) lors de l'appel à football-data.org`
        );
      }
      throw new ProviderUnavailableError(
        `Erreur réseau lors de l'accès à football-data.org: ${(err as Error)?.message ?? 'inconnue'}`
      );
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 429) {
      throw new ProviderRateLimitError(
        'Limite de débit dépassée (HTTP 429) sur l\'API football-data.org',
        60000
      );
    }

    if (response.status === 401 || response.status === 403) {
      throw new ProviderUnavailableError(
        `Authentification refusée par football-data.org (HTTP ${response.status})`
      );
    }

    if (!response.ok) {
      throw new ProviderUnavailableError(
        `L'API football-data.org a retourné un statut d'erreur: HTTP ${response.status}`
      );
    }

    let payload: FootballDataMatchesResponse;
    try {
      payload = (await response.json()) as FootballDataMatchesResponse;
    } catch {
      throw new ProviderUnavailableError(
        'Réponse invalide de football-data.org: impossible de parser le JSON'
      );
    }

    if (!payload || typeof payload !== 'object' || !Array.isArray(payload.matches)) {
      throw new ProviderUnavailableError(
        'Le payload retourné par football-data.org ne contient pas un tableau matches valide.'
      );
    }

    try {
      return this.mapMatchesPayload(payload.matches);
    } catch (err: unknown) {
      throw new ProviderUnavailableError(
        `Erreur lors du mapping des données football-data.org: ${(err as Error)?.message ?? 'inconnu'}`
      );
    }
  }

  getMatchDetails(_externalMatchId: string): Promise<Match> {
    throw new NotImplementedError('FootballDataOrgAdapter.getMatchDetails');
  }

  private formatUtcDate(d: Date): string {
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private mapMatchesPayload(rawMatches: FootballDataMatch[]): Match[] {
    const results: Match[] = [];

    for (const raw of rawMatches) {
      if (!raw || typeof raw !== 'object') {
        throw new ProviderUnavailableError('Élément de match invalide dans le payload');
      }

      const mappedStatus = this.mapStatus(raw.status);
      if (mappedStatus !== 'SCHEDULED') {
        continue;
      }

      if (
        !raw.id ||
        !raw.utcDate ||
        !raw.homeTeam ||
        !raw.homeTeam.id ||
        !raw.homeTeam.name ||
        !raw.awayTeam ||
        !raw.awayTeam.id ||
        !raw.awayTeam.name
      ) {
        throw new ProviderUnavailableError('Structure de match incomplète dans le payload');
      }

      const matchDate = new Date(raw.utcDate);
      if (isNaN(matchDate.getTime())) {
        throw new ProviderUnavailableError('Date de match invalide dans le payload');
      }

      const homeTeam: Team = {
        id: `team-${raw.homeTeam.id}`,
        name: raw.homeTeam.name,
        shortName: raw.homeTeam.shortName ?? raw.homeTeam.name,
        tla: raw.homeTeam.tla ?? 'N/A',
        crestUrl: raw.homeTeam.crest ?? null,
        providerMetadata: {
          providerName: 'football-data-org',
          externalId: String(raw.homeTeam.id),
          lastUpdated: matchDate,
        },
      };

      const awayTeam: Team = {
        id: `team-${raw.awayTeam.id}`,
        name: raw.awayTeam.name,
        shortName: raw.awayTeam.shortName ?? raw.awayTeam.name,
        tla: raw.awayTeam.tla ?? 'N/A',
        crestUrl: raw.awayTeam.crest ?? null,
        providerMetadata: {
          providerName: 'football-data-org',
          externalId: String(raw.awayTeam.id),
          lastUpdated: matchDate,
        },
      };

      const score: Score = {
        halfTime: {
          home: raw.score?.halfTime?.home ?? null,
          away: raw.score?.halfTime?.away ?? null,
        },
        fullTime: {
          home: raw.score?.fullTime?.home ?? null,
          away: raw.score?.fullTime?.away ?? null,
        },
      };

      results.push({
        id: `match-${raw.id}`,
        competitionId: 'FL1',
        seasonId: `season-${matchDate.getUTCFullYear()}`,
        matchday: raw.matchday ?? 1,
        utcDate: matchDate,
        status: 'SCHEDULED',
        homeTeam,
        awayTeam,
        score,
        providerMetadata: {
          providerName: 'football-data-org',
          externalId: String(raw.id),
          lastUpdated: matchDate,
        },
      });
    }

    return results;
  }

  private mapStatus(rawStatus?: string): MatchStatus {
    if (!rawStatus) {
      throw new ProviderUnavailableError('Statut de match absent');
    }

    switch (rawStatus) {
      case 'SCHEDULED':
      case 'TIMED':
        return 'SCHEDULED';
      case 'IN_PLAY':
      case 'PAUSED':
        return 'LIVE';
      case 'FINISHED':
        return 'FINISHED';
      case 'POSTPONED':
        return 'POSTPONED';
      case 'CANCELLED':
        return 'CANCELLED';
      default:
        throw new ProviderUnavailableError(`Statut amont inconnu: ${rawStatus}`);
    }
  }
}
