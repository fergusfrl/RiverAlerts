import { ReactElement } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { Reading } from '../types';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
  window.Highcharts = Highcharts;
}

type Props = {
  data: Reading[];
  units: string;
  gaugeSource?: string;
};

const TimeSeriesGraph = ({ data, units, gaugeSource }: Props): ReactElement => {
  const chartOptions = {
    chart: {
      type: 'line',
      height: '250px',
    },
    legend: {
      enabled: false,
    },
    yAxis: {
      title: {
        text: units,
      },
    },
    xAxis: {
      type: 'datetime',
    },
    series: [
      {
        color: '#E63B66',
        name: units,
        data: data.map((x) => [Date.parse(x.time), x.flow || x.stage_height]),
      },
    ],
    title: {
      text: units === 'cumecs' ? 'Flow (cumecs)' : 'Height (metres)',
      align: 'left',
    },
    subtitle: {
      text: `<b>${gaugeSource}</b>  ·  Last Updated: ${moment(new Date(data[0].time)).format(
        'MMMM Do YYYY, h:mma'
      )}`,
      align: 'right',
    },
    plotOptions: {
      series: {
        turboThreshold: 3000,
      },
    },
    tooltip: {
      xDateFormat: '%b %e, %l:%M%P',
    },
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default TimeSeriesGraph;
