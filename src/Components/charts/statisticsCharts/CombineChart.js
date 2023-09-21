import React from "react";
import { Line } from "react-chartjs-2";
import "./styling.css";
import { useStateContext } from "../../../context/ContextProvider";


const CombineChart = ({ combineData }) => {
  const { currentMode, primaryColor } = useStateContext();
  console.log("CombineData: ", combineData);

  // Check if there's no spend data
  if (!combineData?.spend?.length) {
    return <div>No data to display.</div>;
  }

  // Create an array of datasets, including the conversions dataset if it exists
  const datasets = [
    {
      type: "line",
      label: "Spend",
      data: combineData?.spend,
      fill: false,
      backgroundColor: primaryColor,
      pointRadius: 0,
      tension: 0.4,
    },
  ];

  if (combineData?.conversions?.length) {
    datasets.unshift({
      type: "line",
      label: "Conversions",
      data: combineData?.conversions,
      fill: false,
      backgroundColor: primaryColor,
      pointRadius: 0,
      tension: 0.4,
    });
  }

  const chartData = {
    labels: combineData?.conversions?.length
      ? [...combineData?.conversions, ...combineData?.spend]
      : [...combineData?.spend],
    datasets,
  };

  const chartOptions = {
    responsive: true,
    width: "100%",
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: currentMode === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: currentMode === "dark" ? "#ffffff" : "#000000",
        },
      },
      y: {
        grid: {
          color: currentMode === "dark" ? "#ffffff" : "#000000",
          lineWidth: 0.5,
        },
        ticks: {
          color: currentMode === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
  };

  return (
    <div
      className="lineChartDiv flex items-center"
      style={{ height: "250px", width: "500px" }}
    >
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default CombineChart;
