/**
 * Frontière technique — Cache mémoire local avec TTL.
 * Couche Infrastructure — implémente le port SportsDataProvider (décorateur).
 *
 * PHASE 2.10 — Activation contrôlée du cache mémoire (DEC-008).
 *
 * Principes (DEC-008) :
 * 1. TTL de production fixe à 600 000 ms (10 min), injectable pour les tests.
 * 2. Horloge injectable pour les tests déterministes — aucun setTimeout réel.
 * 3. Clé : {competitionCode}:{dateFrom}:{dateTo} — aucune donnée sensible.
 * 4. Sans dates → le cache calcule [now, now+7j UTC) et les transmet au fournisseur.
 * 5. Deux bornes → utilisées et transmises telles quelles.
 * 6. Une seule borne → bypass complet du cache, délégation directe.
 * 7. Réponses réussies mises en cache (y compris []).
 * 8. Erreurs jamais mises en cache — propagées sans modification.
 * 9. Valeur expirée jamais servie (stale-on-error interdit).
 * 10. Déduplication des appels simultanés via Map<string, Promise<Match[]>>.
 * 11. Promesses terminées (succès ou rejet) retirées dans un finally.
 * 12. getCompetitions() et getMatchDetails() délégués directement, sans cache.
 *
 * Référence : phase-2-10-cache-activation-pack.md (DEC-008)
 */

import { SportsDataProvider } from '../../../application/ports/sports-data-provider.js';
import { Competition } from '../../../domain/entities/competition.js';
import { Match } from '../../../domain/entities/match.js';
import {
  TelemetryObserver,
  NOOP_TELEMETRY_OBSERVER,
  safeObserve,
} from '../../../shared/observability/telemetry.js';

// ---------------------------------------------------------------------------
// Types internes
// ---------------------------------------------------------------------------

export type CacheClock = () => Date;

export interface InMemoryCacheOptions {
  /** TTL en millisecondes. Défaut : 600 000 ms (10 min). */
  ttlMs?: number;
  /** Horloge injectable pour les tests. Défaut : () => new Date(). */
  clock?: CacheClock;
  /** Observer de télémétrie injectable. Défaut : NOOP_TELEMETRY_OBSERVER. */
  observer?: TelemetryObserver;
}

interface CacheEntry {
  value: Match[];
  /** Timestamp d'expiration (ms depuis époque Unix). */
  expiresAt: number;
}

// ---------------------------------------------------------------------------
// Helpers UTC
// ---------------------------------------------------------------------------

function formatUtcDate(d: Date): string {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

// ---------------------------------------------------------------------------
// InMemoryCache
// ---------------------------------------------------------------------------

export class InMemoryCache implements SportsDataProvider {
  private readonly next: SportsDataProvider;
  private readonly ttlMs: number;
  private readonly clock: CacheClock;
  private readonly observer: TelemetryObserver;

  /** Entrées mises en cache, indexées par clé. */
  private readonly store = new Map<string, CacheEntry>();

  /** Promesses d'appels fournisseur en cours, pour la déduplication. */
  private readonly inflight = new Map<string, Promise<Match[]>>();

  constructor(next: SportsDataProvider, options: InMemoryCacheOptions = {}) {
    this.next = next;
    this.ttlMs = options.ttlMs ?? 600_000;
    this.clock = options.clock ?? (() => new Date());
    this.observer = options.observer ?? NOOP_TELEMETRY_OBSERVER;
  }

  // -------------------------------------------------------------------------
  // SportsDataProvider — délégation directe (sans cache)
  // -------------------------------------------------------------------------

  getCompetitions(): Promise<Competition[]> {
    return this.next.getCompetitions();
  }

  getMatchDetails(externalMatchId: string): Promise<Match> {
    return this.next.getMatchDetails(externalMatchId);
  }

  // -------------------------------------------------------------------------
  // getMatches — avec cache et télémétrie
  // -------------------------------------------------------------------------

  getMatches(
    competitionCode: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Match[]> {
    // Cas 1 : une seule borne fournie → bypass complet du cache.
    const hasBoth = fromDate !== undefined && toDate !== undefined;
    const hasNone = fromDate === undefined && toDate === undefined;

    if (!hasBoth && !hasNone) {
      const providedBound = fromDate !== undefined ? 'from-only' : 'to-only';
      safeObserve(this.observer, {
        type: 'cache_bypass',
        competitionCode,
        providedBound,
      });
      // Exactement une seule borne : délégation directe sans cache.
      return this.next.getMatches(competitionCode, fromDate, toDate);
    }

    // Cas 2 : aucune borne → calculer la fenêtre UTC maintenant (une seule fois).
    let effectiveFrom: Date;
    let effectiveTo: Date;

    if (hasNone) {
      const now = this.clock();
      effectiveFrom = now;
      effectiveTo = addDays(now, 7);
    } else {
      // hasBoth : utiliser exactement les bornes fournies.
      effectiveFrom = fromDate as Date;
      effectiveTo = toDate as Date;
    }

    const dateFromStr = formatUtcDate(effectiveFrom);
    const dateToStr = formatUtcDate(effectiveTo);
    const key = `${competitionCode}:${dateFromStr}:${dateToStr}`;
    const nowMs = this.clock().getTime();

    // Cas 3 : cache chaud et non expiré.
    const cached = this.store.get(key);
    if (cached !== undefined && nowMs < cached.expiresAt) {
      safeObserve(this.observer, {
        type: 'cache_hit',
        competitionCode,
        dateFrom: dateFromStr,
        dateTo: dateToStr,
        matchCount: cached.value.length,
      });
      return Promise.resolve(cached.value);
    }

    // Cas 4 : suppression de l'entrée expirée
    if (cached !== undefined) {
      this.store.delete(key);
      safeObserve(this.observer, {
        type: 'cache_expired',
        competitionCode,
        dateFrom: dateFromStr,
        dateTo: dateToStr,
      });
    }

    // Cas 5 : déduplication — un appel pour cette clé est déjà en cours.
    const existing = this.inflight.get(key);
    if (existing !== undefined) {
      safeObserve(this.observer, {
        type: 'cache_in_flight_join',
        competitionCode,
        dateFrom: dateFromStr,
        dateTo: dateToStr,
      });
      return existing;
    }

    // Cas 6 : pas de promesse en cours -> cache_miss et déclenchement de l'appel fournisseur.
    safeObserve(this.observer, {
      type: 'cache_miss',
      competitionCode,
      dateFrom: dateFromStr,
      dateTo: dateToStr,
    });

    // Cas 6 : appel fournisseur (cache froid).
    const promise = this.next
      .getMatches(competitionCode, effectiveFrom, effectiveTo)
      .then((value) => {
        // Succès : mise en cache avec timestamp d'expiration.
        const expiresAt = this.clock().getTime() + this.ttlMs;
        this.store.set(key, { value, expiresAt });
        return value;
      })
      .finally(() => {
        // Nettoyage obligatoire de la promesse en cours (succès ou rejet).
        this.inflight.delete(key);
      });

    this.inflight.set(key, promise);
    return promise;
  }
}
