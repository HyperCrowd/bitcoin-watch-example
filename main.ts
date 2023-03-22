import { Statistics } from './statistics';

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

const properties: (keyof TickerObject)[] = [
  'a',
  'b',
  'c',
  'h',
  'l',
  'o',
  'p',
  't',
  'v',
];

/**
 *
 */
const getToday = (
  ticker: TickerObject,
  property: keyof TickerObject
): number => {
  switch (property) {
    case 'a':
    case 'b':
    case 'c':
      return parseFloat(ticker[property][0]);
    case 'h':
    case 'l':
    case 'p':
    case 'v':
      return parseFloat(ticker[property][1]);
    case 't':
      return ticker[property][1];
    default:
    case 'o':
      return parseFloat(ticker[property]);
  }
};

/**
 *
 */
const getLot = (
  ticker: TickerObject,
  property: keyof TickerObject,
  useWhole: boolean
): Number => {
  switch (property) {
    case 'a':
    case 'b':
      if (useWhole) {
        return parseFloat(ticker[property][1]);
      } else {
        return parseFloat(ticker[property][2]);
      }
    case 'c':
      return parseFloat(ticker[property][1]);
    case 'v':
      return parseFloat(ticker[property][0]);
    default:
    case 't':
    case 'o':
      throw -1;
  }
};

// Initialize prices
const prices: Price[] =
  JSON.parse(localStorage.getItem('bitcoin_prices')) || [];

/**
 *
 */
export const fetchTickerData = async (
  pair: string = 'XBTCUSD'
): Promise<{
  [pair: string]: TickerObject;
}> => {
  const response = await fetch(
    `https://api.kraken.com/0/public/Ticker?pair=${pair}`
  );
  const data = await response.json();
  const ticker = data.result[pair];

  // Add the price
  prices.push({
    ticker,
    date: new Date(),
  });

  // Save the price array
  localStorage.setItem('bitcoin_prices', JSON.stringify(prices));

  return ticker;
};

/**
 *
 */
const calculateMovingAverage = (data: number[], period: number): number[] => {
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
};

/**
 *
 */
export const calculateStatistics = (
  prices: Price[],
  minutes: number = 20,
  since: Date = new Date()
): Statistics => {
  const timeAgo = new Date(since.getTime() - minutes * 60000);

  const priceRange = prices.filter(
    (price) => price.date >= timeAgo && price.date <= since
  );

  const result = new Statistics();

  for (const property of properties) {
    // Generate numbers
    const numbers: number[] = [];
    let sum = 0;

    for (const price of priceRange) {
      const value = getToday(price.ticker, property);
      numbers.push(value);
      sum += value;
    }

    result.movingAverages[property] = calculateMovingAverage(
      numbers,
      numbers.length
    );

    result.sums[property] = sum;
    result.averages[property] = sum / priceRange.length;
  }

  return result;
};
