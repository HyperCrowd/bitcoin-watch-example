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

export interface TickerObject {
  a: [string, string, string]; // Ask [<price>, <whole lot volume>, <lot volume>]
  b: [string, string, string]; // Bid [<price>, <whole lot volume>, <lot volume>]
  c: [string, string]; // Last trade closed [<price>, <lot volume>]
  h: [string, string]; // High [<today>, <last 24 hours>]
  l: [string, string]; // Low [<today>, <last 24 hours>]
  o: string; // Today's opening price
  p: [string, string]; // Volume weighted average price [<today>, <last 24 hours>]
  t: [number, number]; // Number of trades [<today>, <last 24 hours>]
  v: [string, string]; // Volume [<today>, <last 24 hours>]
}

export interface Price {
  ticker: TickerObject;
  date: Date;
}
