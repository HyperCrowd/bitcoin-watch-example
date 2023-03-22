import type { FullTickerNumbers, Price, TickerObject } from './types';
import { Statistics } from './statistics';

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

const propertyMap: Map<keyof TickerObject, keyof FullTickerNumbers> = new Map([
  ['a', 'ask'],
  ['b', 'bid'],
  ['c', 'lastTradeClose'],
  ['h', 'high'],
  ['l', 'low'],
  ['o', 'opening'],
  ['p', 'volumeWeightedAveragePrice'],
  ['t', 'trades'],
  ['v', 'volume'],
]);

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

// Initialize globals
const Prices: Price[] = JSON.parse(
  localStorage.getItem('bitcoin_prices') || '[]'
);
let lastTradeVolume: number = JSON.parse(
  localStorage.getItem('last_trade_volume' || '0')
);

/**
 *
 */
export function getPrices() {
  return Prices;
}

/**
 *
 */
export function getLastTradeVolume() {
  return lastTradeVolume;
}

/**
 *
 */
export const fetchTickerData = async (
  pair: string = 'XXBTZUSD'
): Promise<TickerObject | boolean> => {
  console.log('call', `https://api.kraken.com/0/public/Ticker?pair=${pair}`);
  const response = await fetch(
    `https://api.kraken.com/0/public/Ticker?pair=${pair}`
  );
  const data = await response.json();
  const ticker = data.result[pair];

  if (ticker.t[0] === lastTradeVolume) {
    // last volume hasn't changed, ignore this entry
    return false;
  }

  lastTradeVolume = ticker.t[0];
  console.log('last', ticker.t[0], lastTradeVolume);

  // Add the price
  Prices.push({
    ticker,
    date: new Date(),
  });

  // Save the price array
  localStorage.setItem('bitcoin_prices', JSON.stringify(Prices));
  localStorage.setItem('last_trade_volume', JSON.stringify(lastTradeVolume));

  return ticker;
};

/**
 *
 */
export const calculateStatistics = (
  threshold: number,
  prices: Price[] = Prices,
  minutes: number = 20,
  since: Date = new Date()
): Statistics => {
  const timeAgo = new Date(since.getTime() - minutes * 60000);

  const priceRange = prices.filter(
    (price) => price.date >= timeAgo && price.date <= since
  );

  const result = new Statistics(priceRange.length, timeAgo, since);

  for (const property of properties) {
    // Generate numbers
    const numbers: number[] = [];
    let sum = 0;
    const actualProperty = propertyMap.get(property);

    for (const price of priceRange) {
      const value = getToday(price.ticker, property);
      numbers.push(value);
      sum += value;
    }

    result.movingAverages[actualProperty] = result.getMovingAverage(
      numbers,
      numbers.length
    );

    result.sums[actualProperty] = sum;
    result.averages[actualProperty] = sum / priceRange.length;
    result.smoothness[actualProperty] = result.getSmoothnessRating(numbers);
    result.increaseTheshold[actualProperty] = result.getIncreaseThreshold(
      numbers,
      threshold
    );
    /*
    result.percentageHigher[actualProperty] = result.getPercentageHigher(numbers);
    
    */
  }

  return result;
};
