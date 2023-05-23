import React from "react";
import { Bar } from "react-chartjs-2";

const HorizontalBarChart = ({ barCharData }) => {
  console.log("HorizaontalBarChart: ", barCharData);
  const chartData = {
    labels: ["Dataset 1", "Dataset 2", "Dataset 3", "Dataset 4", "Dataset 5"],
    datasets: [
      {
        label: "Category 1",
        data: [50, 30, 70, 40, 60],
        backgroundColor: "#FF6384",
      },
      {
        label: "Category 2",
        data: [80, 50, 30, 70, 90],
        backgroundColor: "#36A2EB",
      },
      {
        label: "Category 3",
        data: [40, 60, 50, 80, 30],
        backgroundColor: "#FFCE56",
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y", // Set the axis to y for horizontal bars
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default HorizontalBarChart;
