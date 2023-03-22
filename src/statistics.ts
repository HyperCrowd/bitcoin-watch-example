import type { FullTickerNumbers, TickerNumbers } from './types';

export class Statistics {
  movingAverages: {
    ask: number[];
    bid: number[];
    lastTradeClose: number[];
    high: number[];
    low: number[];
    opening: number[];
    volumeWeightedAveragePrice: number[];
    trades: number[];
    volume: number[];
  };
  averages: FullTickerNumbers;
  sums: FullTickerNumbers;
  smoothness: FullTickerNumbers;
  percentageHigher: FullTickerNumbers;
  increaseTheshold: FullTickerNumbers;
  entries: number;
  startDate: Date;
  endDate: Date;

  constructor(entries: number, startDate: Date, endDate: Date) {
    this.movingAverages = {
      ask: [],
      bid: [],
      lastTradeClose: [],
      high: [],
      low: [],
      opening: [],
      volumeWeightedAveragePrice: [],
      trades: [],
      volume: [],
    };

    this.averages = this.getTickerNumbers();
    this.sums = this.getTickerNumbers();
    this.smoothness = this.getTickerNumbers();
    this.percentageHigher = this.getTickerNumbers();
    this.increaseTheshold = this.getTickerNumbers();
    this.entries = entries;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  private getTickerNumbers(): FullTickerNumbers {
    return {
      ask: 0,
      bid: 0,
      lastTradeClose: 0,
      high: 0,
      low: 0,
      opening: 0,
      volumeWeightedAveragePrice: 0,
      trades: 0,
      volume: 0,
    };
  }

  /**
   *
   */
  getMovingAverage(data: number[], period: number): number[] {
    if (data.length < period && this.entries <= 1) {
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
   * zero (i.e. the two numbers are the same), the rating is set to 1 to indicate maximum
   * smoothness. Otherwise, the rating is set to 1 divided by the difference, which gives a
   * higher rating for smaller differences and a lower rating for larger differences.
   */
  getSmoothnessRating(numbers: number[]): number {
    if (this.entries <= 1) {
      return -1;
    }

    let total: number = 0;

    for (let i = 0; i < numbers.length - 1; i++) {
      const percentChange = ((numbers[i + 1] - numbers[i]) / numbers[i]) * 100;
      total += percentChange;
    }

    return total / numbers.length;
  }

  /**
   * the function calculates the percentage of numbers that were higher than their previous
   * number by dividing the counter by the number of comparisons made (which is one less than
   * the length of the array) and multiplying by 100 to convert to a percentage.
   */
  getPercentageHigher(numbers: number[]): number {
    if (this.entries <= 1) {
      return -1;
    }

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
  getIncreaseThreshold(numbers: number[], withinThreshold: number): number {
    if (this.entries <= 1) {
      return -1;
    }

    let total: number = 0;

    for (let i = 0; i < numbers.length - 1; i++) {
      const percentChange = ((numbers[i + 1] - numbers[i]) / numbers[i]) * 100;

      total +=
        percentChange < withinThreshold ? percentChange / withinThreshold : 0;
    }

    return total / numbers.length;
  }
}
