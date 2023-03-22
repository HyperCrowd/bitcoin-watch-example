export interface TickerNumbers {
  a: number;
  b: number;
  c: number;
  h: number;
  l: number;
  o: number;
  p: number;
  t: number;
  v: number;
}

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
}
