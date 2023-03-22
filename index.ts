// Import stylesheets
import './style.css';
import { render } from 'preact';
import { html } from 'htm/preact';
import { calculateStatistics, fetchTickerData, getPrices } from './src/main';
import { getChart } from './src/report';
import { Statistics } from './src/statistics';

const stats: Statistics[] = [];

async function update() {
  const ticker = await fetchTickerData();
  const prices = getPrices();

  if (ticker === false) {
    return;
  }

  const stat = calculateStatistics(0.3);
  stats.push(stat);
  console.log('stats', stats);

  const body = html`
  <div>
    <h1>Ask</h1>
    <h2>High/Low Averages</h2>
    <div class="ask-highlow-averages" />

    <h2>Ask/Bid Averages</h2>
    <div class="ask-askbid-averages" />

    <h2>Last Trade/Volume Weight Averages</h2>
    <div class="ask-tradevol-averages" />
    
    <h1>Bid</h1>
    <h2>Average</h2>
    <div class="bid-average" />

    <h2>Smoothness</h2>
    <div class="bid-smoothness" />

    <h2>Thresholds</h2>
    <div class="bid-thresholds" />

    <h1>Last Trade Close</h1>
    <h2>Average</h2>
    <div class="lastTradeClose-average" />

    <h2>Smoothness</h2>
    <div class="lastTradeClose-smoothness" />

    <h2>Thresholds</h2>
    <div class="lastTradeClose-thresholds" />

    <h1>High</h1>
    <h2>Average</h2>
    <div class="high-average" />

    <h2>Smoothness</h2>
    <div class="high-smoothness" />

    <h2>Thresholds</h2>
    <div class="high-thresholds" />

    <h1>Low</h1>
    <h2>Average</h2>
    <div class="low-average" />

    <h2>Smoothness</h2>
    <div class="low-smoothness" />

    <h2>Thresholds</h2>
    <div class="low-thresholds" />

    <h1>Opening</h1>
    <h2>Average</h2>
    <div class="opening-average" />

    <h2>Smoothness</h2>
    <div class="opening-smoothness" />

    <h2>Thresholds</h2>
    <div class="opening-thresholds" />

    <h1>Trades</h1>
    <h2>Average</h2>
    <div class="trades-average" />

    <h2>Smoothness</h2>
    <div class="trades-smoothness" />

    <h2>Thresholds</h2>
    <div class="trades-thresholds" />

    <h1>Volume</h1>
    <h2>Average</h2>
    <div class="volume-average" />

    <h2>Smoothness</h2>
    <div class="volume-smoothness" />

    <h2>Thresholds</h2>
    <div class="volume-thresholds" />

    <h1>Volume (Weighted Average Price)</h1>
    <h2>Average</h2>
    <div class="volumeWeightedAveragePrice-average" />

    <h2>Smoothness</h2>
    <div class="volumeWeightedAveragePrice-smoothness" />

    <h2>Thresholds</h2>
    <div class="volumeWeightedAveragePrice-thresholds" />
  </div>
`;
  render(body, document.body);

  getChart(
    '.ask-highlow-averages',
    [],
    [
      stats.map((stat) => stat.averages.high),
      stats.map((stat) => stat.averages.low),
    ]
  );
  getChart(
    '.ask-askbid-averages',
    [],
    [
      stats.map((stat) => stat.averages.ask),
      stats.map((stat) => stat.averages.bid),
    ]
  );
  getChart(
    '.ask-tradevol-averages',
    [],
    [
      stats.map((stat) => stat.averages.lastTradeClose),
      stats.map((stat) => stat.averages.volumeWeightedAveragePrice),
    ]
  );
  getChart('.bid-average', [], []);
  getChart('.bid-smoothness', [], [[]]);
  getChart('.bid-thresholds', [], [[]]);
  getChart('.lastTradeClose-average', [], [[]]);
  getChart('.lastTradeClose-smoothness', [], [[]]);
  getChart('.lastTradeClose-thresholds', [], [[]]);
  getChart('.high-average', [], [[]]);
  getChart('.high-smoothness', [], [[]]);
  getChart('.high-thresholds', [], [[]]);
  getChart('.low-average', [], [[]]);
  getChart('.low-smoothness', [], [[]]);
  getChart('.low-thresholds', [], [[]]);
  getChart('.opening-average', [], [[]]);
  getChart('.opening-smoothness', [], [[]]);
  getChart('.opening-thresholds', [], [[]]);
  getChart('.trades-average', [], [[]]);
  getChart('.trades-smoothness', [], [[]]);
  getChart('.trades-thresholds', [], [[]]);
  getChart('.volume-average', [], [[]]);
  getChart('.volume-smoothness', [], [[]]);
  getChart('.volume-thresholds', [], [[]]);
  getChart('.volumeWeightedAveragePrice-average', [], [[]]);
  getChart('.volumeWeightedAveragePrice-smoothness', [], [[]]);
  getChart('.volumeWeightedAveragePrice-thresholds', [], [[]]);
}

/**
 *
 */
async function main() {
  setInterval(await update, 10000);
  await update();
}

main();
