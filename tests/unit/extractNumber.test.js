/**
 * @fileoverview Unit tests for extractNumberFromBody helper in averageController.
 */

const { extractNumberFromBody } = require('../../src/controllers/averageController');

describe('extractNumberFromBody (Unit Tests)', () => {
  test('returns number directly if body is a number', () => {
    expect(extractNumberFromBody(42)).toBe(42);
    expect(extractNumberFromBody(0)).toBe(0);
    expect(extractNumberFromBody(-15.5)).toBe(-15.5);
  });

  test('returns null for undefined, null, or empty inputs', () => {
    expect(extractNumberFromBody(undefined)).toBeNull();
    expect(extractNumberFromBody(null)).toBeNull();
    expect(extractNumberFromBody('')).toBeNull();
    expect(extractNumberFromBody('   ')).toBeNull();
  });

  test('extracts number from object with number or value key', () => {
    expect(extractNumberFromBody({ number: 99 })).toBe(99);
    expect(extractNumberFromBody({ number: '99' })).toBe(99);
    expect(extractNumberFromBody({ value: 123 })).toBe(123);
    expect(extractNumberFromBody({ value: '123' })).toBe(123);
  });

  test('extracts number from string', () => {
    expect(extractNumberFromBody('55')).toBe(55);
    expect(extractNumberFromBody('-3.14')).toBe(-3.14);
  });

  test('returns null for invalid object or unsupported types', () => {
    expect(extractNumberFromBody({})).toBeNull();
    expect(extractNumberFromBody({ foo: 'bar' })).toBeNull();
    expect(extractNumberFromBody({ number: 'invalid' })).toBeNull();
    expect(extractNumberFromBody({ value: 'invalid' })).toBeNull();
    expect(extractNumberFromBody(true)).toBeNull();
    expect(extractNumberFromBody(false)).toBeNull();
    expect(extractNumberFromBody(NaN)).toBeNull();
    expect(extractNumberFromBody(Infinity)).toBeNull();
  });
});
