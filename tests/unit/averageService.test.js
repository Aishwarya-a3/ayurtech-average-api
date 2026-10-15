/**
 * @fileoverview Unit tests for AverageService.
 */

const { AverageService } = require('../../src/services/averageService');

describe('AverageService (Unit Tests)', () => {
  let service;

  beforeEach(() => {
    service = new AverageService();
  });

  test('should initialize with default zero values', () => {
    expect(service.getAverage()).toBe(0);
    expect(service.getCount()).toBe(0);
    expect(service.getSum()).toBe(0);
    expect(service.getHistory()).toEqual([]);
  });

  test('should calculate average for a single submitted number', () => {
    const result = service.addNumber(10);
    expect(result).toEqual({
      average: 10,
      count: 1,
      sum: 10,
      received: 10
    });
    expect(service.getAverage()).toBe(10);
    expect(service.getCount()).toBe(1);
    expect(service.getSum()).toBe(10);
    expect(service.getHistory()).toEqual([10]);
  });

  test('should compute correct running average for multiple numbers', () => {
    service.addNumber(10);
    const result2 = service.addNumber(20);
    expect(result2.average).toBe(15);
    expect(result2.count).toBe(2);
    expect(result2.sum).toBe(30);

    const result3 = service.addNumber(30);
    expect(result3.average).toBe(20);
    expect(result3.count).toBe(3);
    expect(result3.sum).toBe(60);

    expect(service.getHistory()).toEqual([10, 20, 30]);
  });

  test('should handle negative numbers correctly', () => {
    service.addNumber(10);
    const result = service.addNumber(-10);
    expect(result.average).toBe(0);
    expect(result.sum).toBe(0);
    expect(result.count).toBe(2);
  });

  test('should handle decimal / floating-point numbers accurately', () => {
    service.addNumber(1.5);
    const result = service.addNumber(2.5);
    expect(result.average).toBe(2);
    expect(result.sum).toBe(4);
    expect(result.count).toBe(2);
  });

  test('should handle zero correctly', () => {
    service.addNumber(0);
    expect(service.getAverage()).toBe(0);
    expect(service.getCount()).toBe(1);
    expect(service.getSum()).toBe(0);

    service.addNumber(10);
    expect(service.getAverage()).toBe(5);
    expect(service.getCount()).toBe(2);
  });

  test('should reset state properly', () => {
    service.addNumber(50);
    service.addNumber(100);
    expect(service.getCount()).toBe(2);

    service.reset();
    expect(service.getAverage()).toBe(0);
    expect(service.getCount()).toBe(0);
    expect(service.getSum()).toBe(0);
    expect(service.getHistory()).toEqual([]);
  });

  test('should throw TypeError when adding non-numeric or non-finite values', () => {
    expect(() => service.addNumber('10')).toThrow(TypeError);
    expect(() => service.addNumber(null)).toThrow(TypeError);
    expect(() => service.addNumber(undefined)).toThrow(TypeError);
    expect(() => service.addNumber(NaN)).toThrow(TypeError);
    expect(() => service.addNumber(Infinity)).toThrow(TypeError);
    expect(() => service.addNumber(-Infinity)).toThrow(TypeError);
    expect(() => service.addNumber({})).toThrow(TypeError);
  });
});
