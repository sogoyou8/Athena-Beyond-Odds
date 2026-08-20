/**
 * Frontière technique — Adaptateur football-data.org.
 * Couche Infrastructure — implémente le port SportsDataProvider.
 *
 * Implémentation Phase 2.8 — Connexion réelle à l'API football-data.org v4.
 *
 * Principes et garde-fous (DEC-006 / DEC-019 / DEC-020) :
 * 1. Utilise globalThis.fetch natif sans dépendance npm. Transport HTTP injectable.
 * 2. Authentification via en-tête X-Auth-Token. Aucun token dans les logs ou les URL.
 * 3. Clé API transmise via le constructeur.
 * 4. Sémantique temporelle (DEC-020) :
 *    - Sans dates : demande la saison courante sans fabriquer de query params artificiels.
 *    - Avec dates : transmet les bornes UTC demandées.
 * 5. Le provider normalise TOUS les matchs retournés (SCHEDULED, FINISHED, LIVE, etc.).
 *    Le filtrage métier par statut est délégué à la couche Application (DEC-019.5).
 * 6. Délai maximal de 8 secondes par requête via AbortController.
 * 7. HTTP 429 -> ProviderRateLimitError (puis HTTP 429).
 * 8. Erreurs réseau, timeout, HTTP 401, 403, 5xx, JSON invalide, mapping incompatible -> ProviderUnavailableError (puis HTTP 503).
 *
 * Références : phase-2-8-real-provider-validation-pack.md (DEC-006) / DEC-019 / DEC-020
 */

import { SportsDataProvider } from '../../../application/ports/sports-data-provider.js';
import {
  NotImplementedError,
  ProviderRateLimitError,
  ProviderRequestRejectedError,
  ProviderUnavailableError,
} from '../../../application/errors/index.js';
import { Competition } from '../../../domain/entities/competition.js';
import { Match } from '../../../domain/entities/match.js';
import { MatchStatus } from '../../../domain/value-objects/match-status.js';
import { Team } from '../../../domain/entities/team.js';
import { Score } from '../../../domain/value-objects/score.js';
import {
  TelemetryObserver,
  NOOP_TELEMETRY_OBSERVER,
  ProviderFailureKind,
  safeObserve,
} from '../../../shared/observability/telemetry.js';
import {
  formatUtcDate,
  addUtcDays,
} from '../../../shared/date-utils.js';

export type HttpFetchFn = (
  input: string | URL,
  init?: RequestInit
) => Promise<Response>;

export type ClockFn = () => Date;
export type DurationClockFn = () => number;

/**
 * Sanitise un texte candidat issu d'un body d'erreur provider (DEC-021).
 *
 * - Accepte uniquement des primitives ; rejette les objets et tableaux.
 * - Redacte toute occurrence exacte des secrets fournis (AVANT troncature).
 * - Supprime les caractères de contrôle (0x00-0x1F, 0x7F) sauf espace (0x20).
 * - Tronque à `maxLength` caractères maximum.
 * - Retourne undefined si le résultat est vide.
 *
 * IMPORTANT : la redaction se produit AVANT la troncature pour éviter qu'un
 * fragment de secret ne soit conservé à la frontière des N caractères.
 *
 * Ne reçoit jamais de token, d'en-tête ou de variable d'environnement comme
 * donnée de sortie ; les secrets ne sont utilisés que comme motif de recherche.
 */
export function sanitizeProviderText(
  raw: unknown,
  maxLength: number = 256,
  secretsToRedact?: readonly string[]
): string | undefined {
  if (
    raw === null ||
    raw === undefined ||
    typeof raw === 'object' ||
    typeof raw === 'function'
  ) {
    return undefined;
  }
  let str = String(raw)
    // Supprime les caractères de contrôle (incl. \r\n\t) sauf espace
    .replace(/[\x00-\x1F\x7F]+/g, ' ')
    .trim();
  // Redaction des secrets AVANT la troncature (DEC-021.7)
  if (secretsToRedact) {
    for (const secret of secretsToRedact) {
      // Protéger contre une chaîne vide qui remplacerait chaque position
      if (!secret || secret.length === 0) {
        continue;
      }
      // Remplacer toutes les occurrences littérales exactes
      str = str.split(secret).join('[REDACTED]');
    }
  }
  if (str.length === 0) {
    return undefined;
  }
  return str.length > maxLength ? str.slice(0, maxLength) : str;
}

/**
 * Extrait un diagnostic sanitisé depuis le body JSON d'une réponse HTTP 400 (DEC-021).
 *
 * - Lit le body UNE seule fois.
 * - Inspecte uniquement les champs de la whitelist dans l'ordre : message > error > errorCode > code.
 * - Redacte toute occurrence de `apiKey` dans le diagnostic AVANT la troncature.
 * - Ne stocke pas le raw body.
 * - En cas d'échec de parsing JSON, retourne un diagnostic générique.
 * - N'injecte jamais token, headers ou variables d'environnement en sortie.
 */
export async function extractRejectionDiagnostic(
  response: Response,
  apiKey?: string
): Promise<{
  providerMessage: string | undefined;
  providerCode: string | undefined;
}> {
  // Construction de la liste de secrets à redacter (jamais exposée en sortie)
  const secrets: readonly string[] =
    apiKey && apiKey.length > 0 ? [apiKey] : [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = await response.json();
    // Whitelist strictément limitée (DEC-021.4) — redaction appliquée avant troncature
    const message = sanitizeProviderText(body?.message, 256, secrets);
    const error = sanitizeProviderText(body?.error, 256, secrets);
    const errorCode = sanitizeProviderText(body?.errorCode, 64, secrets);
    const code = sanitizeProviderText(body?.code, 64, secrets);
    // Le raw body est abandonné immédiatement après cette extraction
    return {
      providerMessage: message ?? error ?? undefined,
      providerCode: errorCode ?? code ?? undefined,
    };
  } catch {
    // Parsing échoué : diagnostic générique, aucun raw texte conservé
    return { providerMessage: undefined, providerCode: undefined };
  }
}

export interface FootballDataOrgAdapterOptions {
  apiKey?: string;
  baseUrl?: string;
  fetchFn?: HttpFetchFn;
  clockFn?: ClockFn;
  durationClock?: DurationClockFn;
  timeoutMs?: number;
  observer?: TelemetryObserver;
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
  private readonly durationClock: DurationClockFn;
  private readonly timeoutMs: number;
  private readonly observer: TelemetryObserver;

  constructor(options: FootballDataOrgAdapterOptions = {}) {
    this.apiKey = options.apiKey ?? process.env['FOOTBALL_DATA_API_KEY']?.trim() ?? '';
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.fetchFn = options.fetchFn ?? globalThis.fetch;
    this.clockFn = options.clockFn ?? (() => new Date());
    this.durationClock = options.durationClock ?? (() => Date.now());
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.observer = options.observer ?? NOOP_TELEMETRY_OBSERVER;

    if (!this.fetchFn) {
      throw new ProviderUnavailableError(
        'Le client HTTP fetch natif n\'est pas disponible dans cet environnement.'
      );
    }
  }

  getCompetitions(): Promise<Competition[]> {
    throw new NotImplementedError('FootballDataOrgAdapter.getCompetitions');
  }

  /**
   * Récupère les matchs d'une compétition.
   * Conforme à DEC-020 :
   * - Sans dates : récupère les matchs de la saison courante sans fabriquer de query params artificiels.
   * - Avec dates : transmet les bornes UTC demandées.
   * Conforme à DEC-027 (Option 3B) :
   * - historyFilter.seasonCount : déclenche des fetches pour chaque saison (courante, N-1, N-2).
   *   Le seasonId sur Match est basé sur la startYear du calendrier sportif (ex: 2025 pour 2025/26).
   *   Pour football-data.org : chaque saison fait l'objet d'un fetch distinct avec ?season=YYYY.
   */
  async getMatches(
    competitionCode: string,
    fromDate?: Date,
    toDate?: Date,
    historyFilter?: import('../../../application/ports/sports-data-provider.js').HistoryFilter
  ): Promise<Match[]> {
    // DEC-027 (Option 3B) : si historyFilter est fourni sans dates :
    // 1) Si seasonIds explicites : fetch chaque saison demandée (mappée depuis l'identifiant).
    // 2) Si seasonCount : fetch multi-saison (saison courante + antérieures, avec découverte catalogue si vide).
    if (historyFilter !== undefined && fromDate === undefined && toDate === undefined) {
      if (historyFilter.seasonIds && historyFilter.seasonIds.length > 0) {
        return this.fetchExplicitSeasonsMatches(competitionCode, historyFilter.seasonIds);
      }
      if (historyFilter.seasonCount && historyFilter.seasonCount > 1) {
        return this.fetchMultiSeasonMatches(competitionCode, historyFilter.seasonCount);
      }
    }

    let queryParams = '';
    let dateFromStr = '';
    let dateToStr = '';

    if (fromDate !== undefined && toDate !== undefined) {
      dateFromStr = formatUtcDate(fromDate);
      dateToStr = formatUtcDate(toDate);
      queryParams = `?dateFrom=${dateFromStr}&dateTo=${dateToStr}`;
    } else if (fromDate !== undefined) {
      dateFromStr = formatUtcDate(fromDate);
      queryParams = `?dateFrom=${dateFromStr}`;
    } else if (toDate !== undefined) {
      dateToStr = formatUtcDate(toDate);
      queryParams = `?dateTo=${dateToStr}`;
    }

    const url = `${this.baseUrl}/competitions/${encodeURIComponent(
      competitionCode
    )}/matches${queryParams}`;

    safeObserve(this.observer, {
      type: 'provider_request_started',
      competitionCode,
      dateFrom: dateFromStr,
      dateTo: dateToStr,
    });

    let startMs: number;
    try {
      startMs = this.durationClock();
      if (typeof startMs !== 'number' || isNaN(startMs) || !isFinite(startMs)) {
        startMs = 0;
      }
    } catch {
      startMs = 0;
    }

    const getDurationMs = (): number => {
      try {
        const endMs = this.durationClock();
        if (typeof endMs !== 'number' || isNaN(endMs) || !isFinite(endMs)) {
          return 0;
        }
        const diff = endMs - startMs;
        return isNaN(diff) || !isFinite(diff) || diff < 0 ? 0 : diff;
      } catch {
        return 0;
      }
    };

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
      const durationMs = getDurationMs();
      let failureKind: ProviderFailureKind = 'network';

      if (err instanceof Error && err.name === 'AbortError') {
        failureKind = 'timeout';
        safeObserve(this.observer, {
          type: 'provider_unavailable',
          competitionCode,
          durationMs,
          failureKind,
        });
        throw new ProviderUnavailableError(
          `Délai dépassé (${this.timeoutMs}ms) lors de l'appel à football-data.org`
        );
      }

      safeObserve(this.observer, {
        type: 'provider_unavailable',
        competitionCode,
        durationMs,
        failureKind,
      });

      throw new ProviderUnavailableError(
        `Erreur réseau lors de l'accès à football-data.org: ${(err as Error)?.message ?? 'inconnue'}`
      );
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 429) {
      const durationMs = getDurationMs();
      safeObserve(this.observer, {
        type: 'provider_rate_limited',
        competitionCode,
        durationMs,
      });
      throw new ProviderRateLimitError(
        'Limite de débit dépassée (HTTP 429) sur l\'API football-data.org',
        60000
      );
    }

    if (response.status === 401 || response.status === 403) {
      const durationMs = getDurationMs();
      const failureKind: ProviderFailureKind =
        response.status === 401 ? 'unauthorized' : 'forbidden';
      safeObserve(this.observer, {
        type: 'provider_unavailable',
        competitionCode,
        durationMs,
        failureKind,
      });
      throw new ProviderUnavailableError(
        `Authentification refusée par football-data.org (HTTP ${response.status})`
      );
    }

    if (response.status === 400) {
      const durationMs = getDurationMs();
      // Lecture unique du body d'erreur pour extraction diagnostique sécurisée (DEC-021)
      // this.apiKey est passé uniquement comme motif de redaction interne — jamais loggé/stocké
      const { providerMessage, providerCode } = await extractRejectionDiagnostic(response, this.apiKey);
      // Le raw body est abandonné ici ; seuls les champs sanitisés et redactés sont conservés.
      safeObserve(this.observer, {
        type: 'provider_request_rejected',
        competitionCode,
        durationMs,
        upstreamStatus: 400,
        providerCode,
        providerMessage,
      });
      throw new ProviderRequestRejectedError(
        'Requête rejetée par football-data.org (HTTP 400)',
        { upstreamStatus: 400, providerMessage, providerCode }
      );
    }

    if (!response.ok) {
      const durationMs = getDurationMs();
      const failureKind: ProviderFailureKind =
        response.status >= 500 && response.status < 600 ? 'upstream_5xx' : 'unknown';
      safeObserve(this.observer, {
        type: 'provider_unavailable',
        competitionCode,
        durationMs,
        failureKind,
      });
      throw new ProviderUnavailableError(
        `L'API football-data.org a retourné un statut d'erreur: HTTP ${response.status}`
      );
    }

    let payload: FootballDataMatchesResponse;
    try {
      payload = (await response.json()) as FootballDataMatchesResponse;
    } catch {
      const durationMs = getDurationMs();
      safeObserve(this.observer, {
        type: 'provider_unavailable',
        competitionCode,
        durationMs,
        failureKind: 'invalid_response',
      });
      throw new ProviderUnavailableError(
        'Réponse invalide de football-data.org: impossible de parser le JSON'
      );
    }

    if (!payload || typeof payload !== 'object' || !Array.isArray(payload.matches)) {
      const durationMs = getDurationMs();
      safeObserve(this.observer, {
        type: 'provider_unavailable',
        competitionCode,
        durationMs,
        failureKind: 'invalid_response',
      });
      throw new ProviderUnavailableError(
        'Le payload retourné par football-data.org ne contient pas un tableau matches valide.'
      );
    }

    let matches: Match[];
    try {
      matches = this.mapMatchesPayload(payload.matches, competitionCode);
    } catch (err: unknown) {
      const durationMs = getDurationMs();
      safeObserve(this.observer, {
        type: 'provider_unavailable',
        competitionCode,
        durationMs,
        failureKind: 'invalid_response',
      });
      throw new ProviderUnavailableError(
        `Erreur lors du mapping des données football-data.org: ${(err as Error)?.message ?? 'inconnu'}`
      );
    }

    const durationMs = getDurationMs();
    safeObserve(this.observer, {
      type: 'provider_request_succeeded',
      competitionCode,
      dateFrom: dateFromStr,
      dateTo: dateToStr,
      durationMs,
      matchCount: matches.length,
    });

    return matches;
  }

  /**
   * Récupère les matchs pour des identifiants explicites de saisons (DEC-027 Option 3B).
   * Mappe l'identifiant métier (ex: 'season-2024' ou '2024') en startYear pour le query param ?season=YYYY.
   */
  private async fetchExplicitSeasonsMatches(
    competitionCode: string,
    seasonIds: readonly string[]
  ): Promise<Match[]> {
    const allMatches: Match[] = [];
    for (const seasonId of seasonIds) {
      const parts = seasonId.split('-');
      const year = parseInt(parts[parts.length - 1]!, 10);
      const targetYear = !isNaN(year) && year > 1900 && year < 2200 ? year : undefined;
      const seasonMatches = await this.fetchSingleSeasonMatches(competitionCode, targetYear);
      allMatches.push(...seasonMatches);
    }
    return allMatches;
  }

  /**
   * Découvre la startYear de la saison courante via le catalogue /competitions/{id} (DEC-027 §4 / §7).
   * Requête HTTP amont #2/3 sur le cold path (budget max 5 HTTP amont).
   */
  private async discoverCurrentSeasonStartYear(competitionCode: string): Promise<number | null> {
    const url = `${this.baseUrl}/competitions/${encodeURIComponent(competitionCode)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
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
          `Délai dépassé (${this.timeoutMs}ms) lors de la découverte catalogue à football-data.org`
        );
      }
      throw new ProviderUnavailableError(
        `Erreur réseau lors de la découverte catalogue à football-data.org: ${(err as Error)?.message ?? 'inconnue'}`
      );
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 429) {
      throw new ProviderRateLimitError(
        'Limite de débit dépassée (HTTP 429) sur catalogue football-data.org',
        60000
      );
    }

    if (!response.ok) {
      throw new ProviderUnavailableError(
        `L'API football-data.org a retourné HTTP ${response.status} lors de la découverte catalogue`
      );
    }

    try {
      const payload = (await response.json()) as { currentSeason?: { startDate?: string } };
      if (payload?.currentSeason?.startDate) {
        const d = new Date(payload.currentSeason.startDate);
        const y = d.getUTCFullYear();
        if (!isNaN(y) && y > 1900 && y < 2200) {
          return y;
        }
      }
      return null;
    } catch {
      throw new ProviderUnavailableError(
        'Réponse invalide du catalogue football-data.org: impossible de parser le JSON'
      );
    }
  }

  /**
   * Effectue des fetches séquentiels pour la saison courante et les saisons antérieures.
   *
   * Implémentation DEC-027 Option 3B pour football-data.org :
   * - CALL 1 : saison courante (sans ?season=, laissée à l'API)
   * - Si saison courante vide : CALL CATALOGUE (HTTP 2) pour identifier la startYear de référence.
   * - CALL N : saisons N-1, N-2 avec ?season=YYYY.
   *
   * Budget strict : Hard Max <= 5 requêtes HTTP amont sur cold path (Target <= 4).
   * En cas d'échec d'une requête de saison antérieure ou du catalogue, on s'arrête (fail-fast, 0 retry).
   */
  private async fetchMultiSeasonMatches(
    competitionCode: string,
    seasonCount: number
  ): Promise<Match[]> {
    // FETCH 1 : saison courante (comportement inchangé DEC-020)
    const currentMatches = await this.fetchSingleSeasonMatches(competitionCode, undefined);
    const allMatches: Match[] = [...currentMatches];

    if (seasonCount <= 1) {
      return allMatches;
    }

    let currentStartYear: number | null = null;

    if (currentMatches.length > 0) {
      const yearCounts = new Map<number, number>();
      for (const m of currentMatches) {
        const parts = m.seasonId.split('-');
        const year = parseInt(parts[parts.length - 1]!, 10);
        if (!isNaN(year)) {
          yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
        }
      }

      let maxCount = 0;
      for (const [year, count] of yearCounts) {
        if (count > maxCount) {
          maxCount = count;
          currentStartYear = year;
        }
      }
    } else {
      // MAJOR-001 Résolution : si la saison courante retourne 0 match,
      // interroger le catalogue de la compétition (HTTP #2) pour découvrir la startYear de référence.
      currentStartYear = await this.discoverCurrentSeasonStartYear(competitionCode);
    }

    if (!currentStartYear) {
      // Impossible de déterminer la startYear même après catalogue
      return allMatches;
    }

    // FETCH 2..N (ou 3..N+1 si catalogue) : saisons antérieures (N-1, N-2...)
    for (let i = 1; i < seasonCount; i++) {
      const historicalYear = currentStartYear - i;
      const seasonMatches = await this.fetchSingleSeasonMatches(competitionCode, historicalYear);
      allMatches.push(...seasonMatches);
    }

    return allMatches;
  }

  /**
   * Effectue un seul fetch pour une saison spécifique ou pour la saison courante (year = undefined).
   * Logique HTTP identique à getMatches standard pour faciliter les mocks dans les tests.
   */
  private async fetchSingleSeasonMatches(
    competitionCode: string,
    year: number | undefined
  ): Promise<Match[]> {
    const queryParams = year !== undefined ? `?season=${year}` : '';
    const url = `${this.baseUrl}/competitions/${encodeURIComponent(competitionCode)}/matches${queryParams}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
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
          `Délai dépassé (${this.timeoutMs}ms) lors de l'appel historique à football-data.org`
        );
      }
      throw new ProviderUnavailableError(
        `Erreur réseau lors de l'accès historique à football-data.org: ${(err as Error)?.message ?? 'inconnue'}`
      );
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 429) {
      throw new ProviderRateLimitError(
        'Limite de débit dépassée (HTTP 429) sur l\'API football-data.org (historique)',
        60000
      );
    }

    if (!response.ok) {
      throw new ProviderUnavailableError(
        `L'API football-data.org a retourné une erreur HTTP ${response.status} pour la saison historique${year !== undefined ? ` ${year}` : ''}`
      );
    }

    let payload: FootballDataMatchesResponse;
    try {
      payload = (await response.json()) as FootballDataMatchesResponse;
    } catch {
      throw new ProviderUnavailableError(
        'Réponse invalide de football-data.org (historique): impossible de parser le JSON'
      );
    }

    if (!payload || !Array.isArray(payload.matches)) {
      throw new ProviderUnavailableError(
        'Le payload historique de football-data.org ne contient pas un tableau matches valide.'
      );
    }

    return this.mapMatchesPayload(payload.matches, competitionCode);
  }

  getMatchDetails(_externalMatchId: string): Promise<Match> {
    throw new NotImplementedError('FootballDataOrgAdapter.getMatchDetails');
  }

  private mapMatchesPayload(
    rawMatches: FootballDataMatch[],
    competitionCode: string
  ): Match[] {
    const results: Match[] = [];

    for (const raw of rawMatches) {
      if (!raw || typeof raw !== 'object') {
        throw new ProviderUnavailableError('Élément de match invalide dans le payload');
      }

      const mappedStatus = this.mapStatus(raw.status);

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
        competitionId: competitionCode,
        seasonId: `season-${matchDate.getUTCFullYear()}`,
        matchday: raw.matchday ?? 1,
        utcDate: matchDate,
        status: mappedStatus,
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
