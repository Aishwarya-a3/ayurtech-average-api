/**
 * @fileoverview Service for managing and calculating running averages of submitted numbers.
 * @module services/averageService
 */

/**
 * Class representing an Average Calculator.
 * Maintains the running sum, count, and submission history in memory.
 */
class AverageService {
  /**
   * Initializes a new instance of AverageService with empty state.
   */
  constructor() {
    /**
     * Total cumulative sum of all submitted numbers.
     * @private
     * @type {number}
     */
    this._sum = 0;

    /**
     * Total count of submitted numbers.
     * @private
     * @type {number}
     */
    this._count = 0;

    /**
     * Historical list of numbers submitted.
     * @private
     * @type {number[]}
     */
    this._history = [];
  }

  /**
   * Adds a number to the accumulator and recalculates the average.
   *
   * @param {number} value - The number to submit to the average calculation.
   * @returns {{ average: number, count: number, sum: number, received: number }} Calculation result.
   * @throws {TypeError} If the provided value is not a finite number.
   *
   * @example
   * const service = new AverageService();
   * const result = service.addNumber(10);
   * // returns { average: 10, count: 1, sum: 10, received: 10 }
   */
  addNumber(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(`Expected a finite number, received: ${value}`);
    }

    this._sum += value;
    this._count += 1;
    this._history.push(value);

    return {
      average: this.getAverage(),
      count: this._count,
      sum: this.getSum(),
      received: value
    };
  }

  /**
   * Gets the current calculated average of all numbers submitted so far.
   *
   * @returns {number} The current average, or 0 if no numbers have been submitted yet.
   */
  getAverage() {
    if (this._count === 0) {
      return 0;
    }
    const rawAverage = this._sum / this._count;
    // Handle JavaScript floating-point precision artifacts gracefully
    return Number(Math.round(Number(rawAverage + 'e+10')) + 'e-10') || rawAverage;
  }

  /**
   * Gets the total count of numbers submitted so far.
   *
   * @returns {number} Count of numbers.
   */
  getCount() {
    return this._count;
  }

  /**
   * Gets the total sum of all numbers submitted so far.
   *
   * @returns {number} Sum of numbers.
   */
  getSum() {
    return Number(Math.round(Number(this._sum + 'e+10')) + 'e-10') || this._sum;
  }

  /**
   * Gets a copy of the list of all numbers submitted so far.
   *
   * @returns {number[]} Array of numbers.
   */
  getHistory() {
    return [...this._history];
  }

  /**
   * Resets the accumulator state back to zero.
   * Useful for testing and re-initialization.
   *
   * @returns {void}
   */
  reset() {
    this._sum = 0;
    this._count = 0;
    this._history = [];
  }
}

// Export a singleton instance by default, and class for isolated testing
const defaultInstance = new AverageService();

module.exports = defaultInstance;
module.exports.AverageService = AverageService;
