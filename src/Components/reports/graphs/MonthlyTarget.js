import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({data}) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Actual',
        data: [
          {
            x: '2011',
            y: 1292,
            goals: [
              {
                name: 'Expected',
                value: 1400,
                strokeHeight: 5,
                strokeColor: '#775DD0'
              }
            ]
          },
          {
            x: '2012',
            y: 4432,
            goals: [
              {
                name: 'Expected',
                value: 5400,
                strokeHeight: 5,
                strokeColor: '#775DD0'
              }
            ]
          },
          // Add other data points as needed
        ]
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'bar'
      },
      plotOptions: {
        bar: {
          columnWidth: '60%'
        }
      },
      colors: ['#00E396'],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ['Actual', 'Expected'],
        markers: {
          fillColors: ['#00E396', '#775DD0']
        }
      }
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default ApexChart;
