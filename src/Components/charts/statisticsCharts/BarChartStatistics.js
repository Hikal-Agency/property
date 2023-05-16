import React from "react";
import { Bar } from "react-chartjs-2";
import { useStateContext } from "../../../context/ContextProvider";
import { useState } from "react";

const BarChartStatistics = () => {
  const { currentMode } = useStateContext();

  const [total_projects] = useState([
    { project: "Riviera", project_count: 4 },
    { project: "Crescent", project_count: 3 },
    { project: "Tiger", project_count: 3 },
  ]);

  const data = {
    labels: total_projects.map((data) => data.project),
    datasets: [
      {
        label: "Closed Projects",
        data: total_projects.map((data) => data.project_count),
        backgroundColor: [
          "rgba(218, 31, 38, 0.7)",
          "rgba(79, 129, 189, 0.7)",
          "rgba(155, 187, 89, 0.7)",
        ],
        borderColor: [
          "rgba(218, 31, 38, 1)",
          "rgba(79, 129, 189, 1)",
          "rgba(155, 187, 89, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <span>
      <Bar
        data={data}
        options={{
          indexAxis: "",
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
          },
          animation: {
            duration: 2000,
            easing: "easeInOutQuart",
          },
          color: currentMode === "dark" ? "#ffffff" : "#000000",
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                color: currentMode === "dark" ? "#ffffff" : "#000000",
              },
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: currentMode === "dark" ? "#ffffff" : "#000000",
              },
              grid: {
                display: true,
                color: currentMode === "dark" ? "#424242" : "#dddddd",
                lineWidth: 0.5,
              },
            },
          },
          barThickness: 30, // Adjust the width of the bars
          categoryPercentage: 0.7, // Adjust the width of the bars relative to the available space
        }}
      />
    </span>
  );
};

export default BarChartStatistics;
