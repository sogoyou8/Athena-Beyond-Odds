import { describe, it, expect } from 'vitest';
import { SqlitePersistence } from '../../src/infrastructure/persistence/sqlite/sqlite-persistence.js';

describe('SqlitePersistence boundary', () => {
  it('should support activation and status checks without throwing errors when disabled', async () => {
    const persistence = new SqlitePersistence(false);
    expect(persistence.isAvailable()).toBe(false);
    persistence.enable();
    await persistence.open();
    expect(persistence.isAvailable()).toBe(false);
  });

  it('should enable and open logically when supported', async () => {
    const persistence = new SqlitePersistence(true);
    persistence.enable();
    await persistence.open();
    expect(persistence.isAvailable()).toBe(true);
    await persistence.close();
    expect(persistence.isAvailable()).toBe(false);
  });
});
