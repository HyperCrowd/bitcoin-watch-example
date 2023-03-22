// Import stylesheets
import './style.css';
import { render } from 'preact';
import { html } from 'htm/preact';
import { calculateStatistics, fetchTickerData, getPrices } from './src/main';

async function update() {
  const ticker = await fetchTickerData();
  const prices = getPrices();
  const stats = calculateStatistics(0.3);

  console.log(stats);

  if (ticker === false) {
    return;
  }

  const body = html`
  <div>

  </div>
`;

  render(body, document.body);
}

async function main() {
  setInterval(await update, 10000);
  await update();
}

main();
