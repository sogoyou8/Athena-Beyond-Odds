import { describe, it, expect } from 'vitest';
import {
  ListScheduledMatchesUseCase,
  CompetitionNotAvailableError,
} from '../../src/application/use-cases/list-scheduled-matches.js';
import {
  InMemorySportsDataProvider,
  IN_MEMORY_REFERENCE_NOW,
} from '../../src/infrastructure/providers/in-memory/in-memory-sports-data-provider.js';

describe('ListScheduledMatchesUseCase', () => {
  const provider = new InMemorySportsDataProvider();
  const useCase = new ListScheduledMatchesUseCase(provider, () => IN_MEMORY_REFERENCE_NOW);

  describe('execute("FL1")', () => {
    it('returns an object with competitionCode equal to "FL1"', async () => {
      const result = await useCase.execute('FL1');
      expect(result.competitionCode).toBe('FL1');
    });

    it('returns exactly 3 matches', async () => {
      const result = await useCase.execute('FL1');
      expect(result.matches).toHaveLength(3);
    });

    it('all returned matches have status SCHEDULED', async () => {
      const result = await useCase.execute('FL1');
      for (const match of result.matches) {
        expect(match.status).toBe('SCHEDULED');
      }
    });

    it('wraps result in the approved envelope shape', async () => {
      const result = await useCase.execute('FL1');
      expect(result).toHaveProperty('competitionCode');
      expect(result).toHaveProperty('matches');
      expect(Array.isArray(result.matches)).toBe(true);
    });

    it('transmet explicitement la fenêtre [now, now+7j) au provider et filtre SCHEDULED (DEC-020)', async () => {
      const fixedNow = new Date('2099-08-10T12:00:00.000Z');
      let capturedFrom: Date | undefined;
      let capturedTo: Date | undefined;

      const spyProvider = {
        getCompetitions: () => provider.getCompetitions(),
        getMatches: async (code: string, fromDate?: Date, toDate?: Date) => {
          capturedFrom = fromDate;
          capturedTo = toDate;
          return provider.getMatches(code, fromDate, toDate);
        },
        getMatchDetails: (id: string) => provider.getMatchDetails(id),
      };

      const customUseCase = new ListScheduledMatchesUseCase(
        spyProvider,
        () => fixedNow
      );

      const result = await customUseCase.execute('FL1');

      expect(capturedFrom).toEqual(fixedNow);
      expect(capturedTo).toEqual(new Date('2099-08-17T12:00:00.000Z'));
      expect(result.matches).toHaveLength(3);
      for (const m of result.matches) {
        expect(m.status).toBe('SCHEDULED');
      }
    });
  });

  describe('execute() for unknown competition', () => {
    it('throws CompetitionNotAvailableError for "PL"', async () => {
      await expect(useCase.execute('PL')).rejects.toBeInstanceOf(
        CompetitionNotAvailableError
      );
    });

    it('thrown error has code COMPETITION_NOT_AVAILABLE', async () => {
      try {
        await useCase.execute('CL');
        expect.fail('Expected CompetitionNotAvailableError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CompetitionNotAvailableError);
        expect((error as CompetitionNotAvailableError).code).toBe(
          'COMPETITION_NOT_AVAILABLE'
        );
      }
    });

    it('thrown error name is CompetitionNotAvailableError', async () => {
      try {
        await useCase.execute('FL2');
        expect.fail('Expected CompetitionNotAvailableError to be thrown');
      } catch (error) {
        expect((error as Error).name).toBe('CompetitionNotAvailableError');
      }
    });
  });
});
