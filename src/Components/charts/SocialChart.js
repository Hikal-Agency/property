import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Social Campaigns',
    },
  },
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

function SocialChart({data}) {
const labels = data?.map((elem) => elem?.leadSource);

const graphData = {
  labels,
   datasets: [
        {
          label: "All",
          data: data?.map((elem) => elem?.total),
          backgroundColor: ["rgba(218, 31, 38, 1)"],
        },
      ],
};

  return <Bar options={options} data={graphData} />;
}

export default SocialChart;
