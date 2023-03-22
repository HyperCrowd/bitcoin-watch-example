import type { TickerNumbers } from './types';

export class Statistics {
  movingAverages: {
    a: number[];
    b: number[];
    c: number[];
    h: number[];
    l: number[];
    o: number[];
    p: number[];
    t: number[];
    v: number[];
  };
  averages: TickerNumbers;
  sums: TickerNumbers;
  smoothness: TickerNumbers;
  percentageHigher: TickerNumbers;
  increaseTheshold: TickerNumbers;

  constructor() {
    this.movingAverages = {
      a: [],
      b: [],
      c: [],
      h: [],
      l: [],
      o: [],
      p: [],
      t: [],
      v: [],
    };

    this.averages = this.getTickerNumbers();
    this.sums = this.getTickerNumbers();
    this.smoothness = this.getTickerNumbers();
    this.percentageHigher = this.getTickerNumbers();
    this.increaseTheshold = this.getTickerNumbers();
  }

  private getTickerNumbers(): TickerNumbers {
    return {
      a: 0,
      b: 0,
      c: 0,
      h: 0,
      l: 0,
      o: 0,
      p: 0,
      t: 0,
      v: 0,
    };
  }

  /**
   *
   */
  getMovingAverage(data: number[], period: number): number[] {
    if (data.length < period) {
      return [];
    }

    const movingAverages: number[] = [];
    let sum = 0;

    for (let i = 0; i < period; i++) {
      sum += data[i];
    }

    movingAverages.push(sum / period);

    for (let i = period; i < data.length; i++) {
      sum -= data[i - period];
      sum += data[i];
      movingAverages.push(sum / period);
    }

    return movingAverages;
  }

  /**
   * For each pair of adjacent numbers, it calculates the absolute difference between them,
   * and then calculates a smoothness rating based on that difference. If the difference is
   * zero (i.e. the two numbers are the same), the rating is set to 10 to indicate maximum
   * smoothness. Otherwise, the rating is set to 1 divided by the difference, which gives a
   * higher rating for smaller differences and a lower rating for larger differences.
   */
  getSmoothnessRating(numbers: number[]): number {
    const smoothnessRatings: number[] = [];
    let total: number = 0;

    for (let i = 0; i < numbers.length - 1; i++) {
      const diff = Math.abs(numbers[i] - numbers[i + 1]);
      const rating = diff === 0 ? 10 : 1 / diff;
      total += rating;
    }

    return total / numbers.length / 10;
  }

  /**
   * the function calculates the percentage of numbers that were higher than their previous
   * number by dividing the counter by the number of comparisons made (which is one less than
   * the length of the array) and multiplying by 100 to convert to a percentage.
   */
  getPercentageHigher(numbers: number[]): number {
    let count = 0;

    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] > numbers[i - 1]) {
        count++;
      }
    }

    return (count / (numbers.length - 1)) * 100;
  }

  /**
   * the function calculates the percentage of numbers that were higher than their previous
   * number by dividing the counter by the number of comparisons made (which is one less than
   * the length of the array) and multiplying by 100 to convert to a percentage.
   */
  getIncreaseThreshold(numbers: number[], threshold: number): number {
    let count = 0;
    threshold += 1;

    for (let i = 1; i < numbers.length; i++) {
      if (
        numbers[i] > numbers[i - 1] &&
        numbers[i] / numbers[i - 1] < threshold
      ) {
        count++;
      }
    }

    return (count / (numbers.length - 1)) * 100;
  }
}
