import React, { useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SocialChart({ data, selectedMonthSocial }) {
  const {primaryColor} = useStateContext();
  const labels = data?.map((elem) => elem?.leadSource);
  console.log("social chart : ", data);

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Social Campaigns",
      },
    },
    responsive: true,
    interaction: {
      mode: "index",
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

  const graphData = {
    labels,
    datasets: [
      {
        label: "All",
        data: data?.map((elem) => elem?.total),
        backgroundColor: [primaryColor],
      },
    ],
  };

  return <Bar options={options} data={graphData} />;
}

export default SocialChart;
