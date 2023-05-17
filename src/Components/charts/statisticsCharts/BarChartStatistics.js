import React from "react";
import { Bar } from "react-chartjs-2";
import { useStateContext } from "../../../context/ContextProvider";
import { useState } from "react";

const BarChartStatistics = () => {
  const { currentMode } = useStateContext();

  const [totail_projects2] = useState([
    { project: "Riviera", project_count: 4 },
    { project: "Crescent", project_count: 3 },
    { project: "Tiger", project_count: 3 },
  ]);

  const data = {
    labels: totail_projects2.map((data) => data.project),
    datasets: [
      {
        label: "Closed Projects",
        data: totail_projects2.map((data) => data.project_count),
        backgroundColor: ["rgba(218, 31, 38, 1)"],
      },
    ],
  };

  return (
    <span>
      <Bar
        data={data}
        options={{
          indexAxis: "",
          elements: {
            bar: {
              borderWidth: 0,
            },
          },
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
          },
          color: currentMode === "dark" ? "#ffffff" : "#000000",
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: currentMode === "dark" ? "#ffffff" : "#000000",
              },
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: currentMode === "dark" ? "#ffffff" : "#000000",
              },
              grid: {
                display: true,
                color: currentMode === "dark" ? "#424242" : "#dddddd",
                lineWidth: 0.5,
              },
            },
          },
          barThickness: 20, // Adjust the width of the bars
          categoryPercentage: 0.7, // Adjust the width of the bars relative to the available space
        }}
      />
    </span>
  );
};

export default BarChartStatistics;
