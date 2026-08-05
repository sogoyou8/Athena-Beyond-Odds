/**
 * Tests unitaires — Module de télémétrie (telemetry.ts).
 *
 * PHASE 2.11 — Observabilité minimale et sûre.
 *
 * Décisions de référence : DEC-009.1 à DEC-009.6.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  NOOP_TELEMETRY_OBSERVER,
  safeObserve,
  createConsoleTelemetryObserver,
  resolveTelemetryObserver,
  TelemetryEvent,
} from '../../src/shared/observability/telemetry.js';

describe('Telemetry Module (telemetry.ts)', () => {
  describe('NOOP_TELEMETRY_OBSERVER', () => {
    it('est une fonction sans effet de bord', () => {
      expect(() => {
        NOOP_TELEMETRY_OBSERVER({
          type: 'cache_miss',
          competitionCode: 'FL1',
          dateFrom: '2026-08-05',
          dateTo: '2026-08-12',
        });
      }).not.toThrow();
    });
  });

  describe('safeObserve', () => {
    it("ne fait rien si l'observer est undefined", () => {
      expect(() => {
        safeObserve(undefined, {
          type: 'cache_miss',
          competitionCode: 'FL1',
          dateFrom: '2026-08-05',
          dateTo: '2026-08-12',
        });
      }).not.toThrow();
    });

    it("transmet l'événement à un observer valide", () => {
      const observer = vi.fn();
      const event: TelemetryEvent = {
        type: 'cache_hit',
        competitionCode: 'FL1',
        dateFrom: '2026-08-05',
        dateTo: '2026-08-12',
        matchCount: 3,
      };

      safeObserve(observer, event);

      expect(observer).toHaveBeenCalledTimes(1);
      expect(observer).toHaveBeenCalledWith(event);
    });

    it("absorbe toute exception synchrone levée par l'observer sans la repager", () => {
      const faultyObserver = () => {
        throw new Error('Crash dans observer');
      };

      expect(() => {
        safeObserve(faultyObserver, {
          type: 'cache_expired',
          competitionCode: 'FL1',
          dateFrom: '2026-08-05',
          dateTo: '2026-08-12',
        });
      }).not.toThrow();
    });
  });

  describe('createConsoleTelemetryObserver', () => {
    let mockConsole: { log: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      mockConsole = {
        log: vi.fn(),
        error: vi.fn(),
      };
    });

    it('émet les événements normaux sur console.log au format NDJSON', () => {
      const observer = createConsoleTelemetryObserver(mockConsole);
      const event: TelemetryEvent = {
        type: 'cache_hit',
        competitionCode: 'FL1',
        dateFrom: '2026-08-05',
        dateTo: '2026-08-12',
        matchCount: 5,
      };

      observer(event);

      expect(mockConsole.log).toHaveBeenCalledTimes(1);
      expect(mockConsole.error).not.toHaveBeenCalled();

      const output = mockConsole.log.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed).toEqual({
        scope: 'athena.telemetry',
        type: 'cache_hit',
        competitionCode: 'FL1',
        dateFrom: '2026-08-05',
        dateTo: '2026-08-12',
        matchCount: 5,
      });
    });

    it('émet provider_rate_limited sur console.error', () => {
      const observer = createConsoleTelemetryObserver(mockConsole);
      const event: TelemetryEvent = {
        type: 'provider_rate_limited',
        competitionCode: 'FL1',
        durationMs: 120,
      };

      observer(event);

      expect(mockConsole.error).toHaveBeenCalledTimes(1);
      expect(mockConsole.log).not.toHaveBeenCalled();

      const parsed = JSON.parse(mockConsole.error.mock.calls[0][0]);
      expect(parsed).toEqual({
        scope: 'athena.telemetry',
        type: 'provider_rate_limited',
        competitionCode: 'FL1',
        durationMs: 120,
      });
    });

    it('émet provider_unavailable sur console.error', () => {
      const observer = createConsoleTelemetryObserver(mockConsole);
      const event: TelemetryEvent = {
        type: 'provider_unavailable',
        competitionCode: 'FL1',
        durationMs: 80,
        failureKind: 'timeout',
      };

      observer(event);

      expect(mockConsole.error).toHaveBeenCalledTimes(1);
      expect(mockConsole.log).not.toHaveBeenCalled();

      const parsed = JSON.parse(mockConsole.error.mock.calls[0][0]);
      expect(parsed.failureKind).toBe('timeout');
      expect(parsed.scope).toBe('athena.telemetry');
    });

    it('émet tous les événements de cache et provider request started/succeeded sur console.log', () => {
      const observer = createConsoleTelemetryObserver(mockConsole);

      const events: TelemetryEvent[] = [
        { type: 'cache_miss', competitionCode: 'FL1', dateFrom: '2026-08-05', dateTo: '2026-08-12' },
        { type: 'cache_expired', competitionCode: 'FL1', dateFrom: '2026-08-05', dateTo: '2026-08-12' },
        { type: 'cache_bypass', competitionCode: 'FL1', providedBound: 'from-only' },
        { type: 'cache_in_flight_join', competitionCode: 'FL1', dateFrom: '2026-08-05', dateTo: '2026-08-12' },
        { type: 'provider_request_started', competitionCode: 'FL1', dateFrom: '2026-08-05', dateTo: '2026-08-12' },
        { type: 'provider_request_succeeded', competitionCode: 'FL1', dateFrom: '2026-08-05', dateTo: '2026-08-12', durationMs: 45, matchCount: 10 },
      ];

      events.forEach((ev) => observer(ev));

      expect(mockConsole.log).toHaveBeenCalledTimes(6);
      expect(mockConsole.error).not.toHaveBeenCalled();
    });
  });

  describe('resolveTelemetryObserver', () => {
    it('retourne NOOP_TELEMETRY_OBSERVER si rawMode est undefined, vide ou "off"', () => {
      expect(resolveTelemetryObserver(undefined)).toBe(NOOP_TELEMETRY_OBSERVER);
      expect(resolveTelemetryObserver('')).toBe(NOOP_TELEMETRY_OBSERVER);
      expect(resolveTelemetryObserver('off')).toBe(NOOP_TELEMETRY_OBSERVER);
    });

    it('retourne un observer console actif si rawMode est "console"', () => {
      const mockConsole = { log: vi.fn(), error: vi.fn() };
      const obs = resolveTelemetryObserver('console', mockConsole);

      obs({
        type: 'cache_miss',
        competitionCode: 'FL1',
        dateFrom: '2026-08-05',
        dateTo: '2026-08-12',
      });

      expect(mockConsole.log).toHaveBeenCalledTimes(1);
    });

    it('lève une erreur de configuration non sensible si la valeur est inconnue', () => {
      expect(() => resolveTelemetryObserver('invalid_value')).toThrow(
        '[Athena] ERREUR DE CONFIGURATION : Valeur inconnue pour ATHENA_TELEMETRY: "invalid_value". Seules "off" et "console" sont autorisées.'
      );
    });
  });
});
