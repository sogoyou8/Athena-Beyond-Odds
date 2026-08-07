/**
 * Types et utilitaires de télémétrie et d'observabilité — Athena Beyond Odds.
 *
 * PHASE 2.11 — Observabilité minimale et sûre.
 *
 * Décisions de référence : DEC-009.1 à DEC-009.6.
 *
 * Responsabilités :
 * - Définition de l'union discriminée TelemetryEvent (événements cache & provider)
 * - Définition du type d'observer TelemetryObserver
 * - Injection d'un observer no-op par défaut (NOOP_TELEMETRY_OBSERVER)
 * - Fonction de sécurité safeObserve (isolation totale des exceptions d'observer)
 * - Implémentation d'un observer console structuré (NDJSON, scope "athena.telemetry")
 * - Résolution dynamique du mode via ATHENA_TELEMETRY (off | console)
 */

export type ProviderFailureKind =
  | 'timeout'
  | 'network'
  | 'unauthorized'
  | 'forbidden'
  | 'upstream_5xx'
  | 'invalid_response'
  | 'unknown';

export type TelemetryEvent =
  | {
      type: 'cache_hit';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
      matchCount: number;
    }
  | {
      type: 'cache_miss';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
    }
  | {
      type: 'cache_expired';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
    }
  | {
      type: 'cache_bypass';
      competitionCode: string;
      providedBound: 'from-only' | 'to-only';
    }
  | {
      type: 'cache_in_flight_join';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
    }
  | {
      type: 'provider_request_started';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
    }
  | {
      type: 'provider_request_succeeded';
      competitionCode: string;
      dateFrom: string;
      dateTo: string;
      durationMs: number;
      matchCount: number;
    }
  | {
      type: 'provider_rate_limited';
      competitionCode: string;
      durationMs: number;
    }
  | {
      type: 'provider_unavailable';
      competitionCode: string;
      durationMs: number;
      failureKind: ProviderFailureKind;
    };

export type TelemetryObserver = (event: TelemetryEvent) => void;

/**
 * Observer par défaut : fonction vide (no-op).
 */
export const NOOP_TELEMETRY_OBSERVER: TelemetryObserver = () => {};

/**
 * Exécute l'observer de télémétrie de manière strictement sécurisée.
 * Toute exception synchrone levée par l'observer est capturée et neutralisée.
 */
export function safeObserve(
  observer: TelemetryObserver | undefined,
  event: TelemetryEvent
): void {
  if (!observer) {
    return;
  }
  try {
    observer(event);
  } catch {
    // L'observabilité ne peut en aucun cas perturber le flux d'exécution métier.
  }
}

export type ConsoleLoggerTarget = Pick<Console, 'log' | 'error'>;

/**
 * Crée un observer structuré écrivant sur la console au format NDJSON.
 * Chaque ligne émise contient obligatoirement `"scope": "athena.telemetry"`.
 */
export function createConsoleTelemetryObserver(
  target: ConsoleLoggerTarget = console
): TelemetryObserver {
  return (event: TelemetryEvent) => {
    const payload = JSON.stringify({
      scope: 'athena.telemetry',
      ...event,
    });

    if (
      event.type === 'provider_rate_limited' ||
      event.type === 'provider_unavailable'
    ) {
      target.error(payload);
    } else {
      target.log(payload);
    }
  };
}

/**
 * Résout l'observer de télémétrie selon la variable d'environnement ATHENA_TELEMETRY.
 *
 * - undefined / '' / 'off' => NOOP_TELEMETRY_OBSERVER
 * - 'console' => createConsoleTelemetryObserver(target)
 * - Autre valeur => Lève une erreur de configuration non sensible
 */
export function resolveTelemetryObserver(
  rawMode: string | undefined,
  consoleTarget?: ConsoleLoggerTarget
): TelemetryObserver {
  const mode = rawMode?.trim();

  if (!mode || mode === 'off') {
    return NOOP_TELEMETRY_OBSERVER;
  }

  if (mode === 'console') {
    return createConsoleTelemetryObserver(consoleTarget);
  }

  throw new Error(
    '[Athena] Invalid ATHENA_TELEMETRY value. Expected "off" or "console".'
  );
}
