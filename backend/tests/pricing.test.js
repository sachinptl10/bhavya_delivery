const { calculatePrice, ZONE_MULTIPLIERS, deriveZone } = require('../src/utils/pricing');
const Pincode = require('../src/models/Pincode');

describe('calculatePrice', () => {
  // Price = (50 base + weight * 20) * zone multiplier
  it('calculates local price', () => {
    expect(calculatePrice(1, 'local')).toBe(70);
  });

  it('calculates regional price', () => {
    expect(calculatePrice(1, 'regional')).toBe(105);
  });

  it('calculates national price', () => {
    expect(calculatePrice(2.5, 'national')).toBe(250);
  });

  it('rounds to 2 decimal places', () => {
    const price = calculatePrice(0.33, 'regional');
    expect(price).toBe(Math.round((50 + 0.33 * 20) * 1.5 * 100) / 100);
  });

  it('has multipliers for all three zones', () => {
    expect(ZONE_MULTIPLIERS).toEqual({ local: 1, regional: 1.5, national: 2.5 });
  });
});

describe('deriveZone', () => {
  it('returns local for identical pincodes', async () => {
    expect(await deriveZone('110001', '110001')).toBe('local');
  });

  it('returns regional for same state (from Pincode DB)', async () => {
    await Pincode.create([
      { pincode: '110001', city: 'New Delhi', state: 'Delhi', zone: 'local' },
      { pincode: '110020', city: 'New Delhi', state: 'Delhi', zone: 'local' }
    ]);
    expect(await deriveZone('110001', '110020')).toBe('regional');
  });

  it('returns national for different states (from Pincode DB)', async () => {
    await Pincode.create([
      { pincode: '110001', city: 'New Delhi', state: 'Delhi', zone: 'local' },
      { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', zone: 'national' }
    ]);
    expect(await deriveZone('110001', '400001')).toBe('national');
  });

  it('falls back to PIN prefix when pincodes are unknown', async () => {
    expect(await deriveZone('110001', '110099')).toBe('regional'); // same 2-digit prefix
    expect(await deriveZone('110001', '560001')).toBe('national'); // different prefix
  });
});
