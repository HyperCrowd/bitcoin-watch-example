import type {
  Series,
  SeriesObject,
  SeriesPrimitiveValue,
} from 'chartist/dist/core/types';
import { LineChart } from 'chartist';

export function getChart(
  target: string,
  labels: string[],
  series: (Series<SeriesPrimitiveValue> | SeriesObject<SeriesPrimitiveValue>)[]
) {
  var data = {
    labels,
    series,
  };

  // As options we currently only set a static size of 300x200 px
  var options = {
    fullWidth: true,
    //    width: '300px',
    //  height: '200px',
  };

  // In the global name space Chartist we call the Line function to initialize a line chart. As a first parameter we pass in a selector where we would like to get our chart created. Second parameter is the actual data object and as a third parameter we pass in our options
  new LineChart(target, data, options);
}
