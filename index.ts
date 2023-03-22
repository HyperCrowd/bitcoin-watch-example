// Import stylesheets
import './style.css';
import { render } from 'preact';
import { html } from 'htm/preact';
import { calculateStatistics, fetchTickerData, getPrices } from './src/main';
import { getChart } from './src/report';
import { Statistics } from './src/statistics';
import dayjs from 'dayjs';

let stats: Statistics[] = [];

async function update() {
  const ticker = await fetchTickerData();
  const prices = getPrices();

  if (ticker === false) {
    return;
  }

  const stat = calculateStatistics(0.3);
  stats.push(stat);

  const body = html`
  <div>
    <h1>Averages</h1>
      <div class="aChart">
      <h2>
        <span class="first">High</span>/
        <span class="second">Low</span>/
        <span class="third">Ask</span>/
        <span class="fourth">Bid</span>
      </h2>
      <div class="averages-highlow" />
    </div>
    <div class="aChart">
      <h2>
        <span class="first">Last Trade</span>/
        <span class="second">Volume Weight Averages</span>
      </h2>
      <div class="averages-tradevol" />
    </div>
  </div>
`;
  render(body, document.body);

  const dateRange = stats.map((stat) =>
    dayjs(stat.startDate).format('H:mm:ss')
  );

  getChart('.averages-highlow', dateRange, [
    stats.map((stat) => stat.averages.high),
    stats.map((stat) => stat.averages.low),
    stats.map((stat) => stat.averages.ask),
    stats.map((stat) => stat.averages.bid),
  ]);
  getChart('.averages-tradevol', dateRange, [
    stats.map((stat) => stat.averages.lastTradeClose),
    stats.map((stat) => stat.averages.volumeWeightedAveragePrice),
  ]);
}

/**
 *
 */
async function main() {
  setInterval(await update, 10000);
  await update();
}

main();
