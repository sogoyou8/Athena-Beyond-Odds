import { describe, it, expect } from 'vitest';
import { formatUtcDate, addUtcDays } from '../../src/shared/date-utils.js';

describe('shared/date-utils', () => {
  describe('formatUtcDate()', () => {
    it('1. formatUtcDate produit YYYY-MM-DD', () => {
      const d = new Date(Date.UTC(2026, 7, 6, 12, 0, 0));
      expect(formatUtcDate(d)).toBe('2026-08-06');
    });

    it('2. ajout des zéros pour mois et jour à un chiffre', () => {
      const d = new Date(Date.UTC(2026, 0, 5, 8, 30, 0));
      expect(formatUtcDate(d)).toBe('2026-01-05');
    });

    it('3. le résultat utilise UTC et non le fuseau local', () => {
      const d = new Date('2026-08-06T23:59:59.999Z');
      expect(formatUtcDate(d)).toBe('2026-08-06');
    });

    it('4. date proche d\'un changement de jour local (23:30:00Z)', () => {
      const d = new Date('2026-12-31T23:30:00.000Z');
      expect(formatUtcDate(d)).toBe('2026-12-31');
    });

    it('5. changement de mois (dernier jour du mois)', () => {
      const d = new Date(Date.UTC(2026, 1, 28, 15, 0, 0));
      expect(formatUtcDate(d)).toBe('2026-02-28');
    });

    it('6. changement d\'année (1er janvier)', () => {
      const d = new Date(Date.UTC(2027, 0, 1, 0, 0, 0));
      expect(formatUtcDate(d)).toBe('2027-01-01');
    });

    it('7. année bissextile (29 février 2028)', () => {
      const d = new Date(Date.UTC(2028, 1, 29, 10, 0, 0));
      expect(formatUtcDate(d)).toBe('2028-02-29');
    });

    it('8. formatUtcDate ne modifie pas son argument', () => {
      const d = new Date(Date.UTC(2026, 7, 6, 12, 0, 0));
      const originalTime = d.getTime();
      formatUtcDate(d);
      expect(d.getTime()).toBe(originalTime);
    });
  });

  describe('addUtcDays()', () => {
    it('9. addUtcDays ajoute sept jours', () => {
      const d = new Date(Date.UTC(2026, 7, 6, 12, 0, 0));
      const result = addUtcDays(d, 7);
      expect(formatUtcDate(result)).toBe('2026-08-13');
    });

    it('10. addUtcDays gère un changement de mois (31 août -> 7 septembre)', () => {
      const d = new Date(Date.UTC(2026, 7, 31, 10, 0, 0));
      const result = addUtcDays(d, 7);
      expect(formatUtcDate(result)).toBe('2026-09-07');
    });

    it('11. addUtcDays gère un changement d\'année (28 décembre -> 4 janvier)', () => {
      const d = new Date(Date.UTC(2026, 11, 28, 18, 0, 0));
      const result = addUtcDays(d, 7);
      expect(formatUtcDate(result)).toBe('2027-01-04');
    });

    it('12. addUtcDays gère une année bissextile (25 février 2028 -> 3 mars 2028)', () => {
      const d = new Date(Date.UTC(2028, 1, 25, 12, 0, 0));
      const result = addUtcDays(d, 7);
      expect(formatUtcDate(result)).toBe('2028-03-03');
    });

    it('13. addUtcDays accepte zéro', () => {
      const d = new Date(Date.UTC(2026, 7, 6, 12, 0, 0));
      const result = addUtcDays(d, 0);
      expect(result.getTime()).toBe(d.getTime());
    });

    it('14. addUtcDays accepte une valeur négative (-7 jours)', () => {
      const d = new Date(Date.UTC(2026, 7, 6, 12, 0, 0));
      const result = addUtcDays(d, -7);
      expect(formatUtcDate(result)).toBe('2026-07-30');
    });

    it('15. addUtcDays retourne une nouvelle instance', () => {
      const d = new Date(Date.UTC(2026, 7, 6, 12, 0, 0));
      const result = addUtcDays(d, 7);
      expect(result).not.toBe(d);
    });

    it('16. addUtcDays ne modifie pas son argument', () => {
      const d = new Date(Date.UTC(2026, 7, 6, 12, 0, 0));
      const originalTime = d.getTime();
      addUtcDays(d, 7);
      expect(d.getTime()).toBe(originalTime);
    });

    it('17. aucune lecture de l\'heure système (déterministe par argument)', () => {
      const fixedDate = new Date(Date.UTC(2030, 5, 15, 0, 0, 0));
      const res = addUtcDays(fixedDate, 14);
      expect(formatUtcDate(res)).toBe('2030-06-29');
    });

    it('18. aucun délai réel (exécution instantanée synchronisée)', () => {
      const start = Date.now();
      for (let i = 0; i < 100; i++) {
        addUtcDays(new Date(), i);
      }
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(500);
    });
  });
});
