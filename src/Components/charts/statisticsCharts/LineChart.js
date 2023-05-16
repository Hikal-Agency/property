import React from "react";
import { Line } from "react-chartjs-2";
import { useStateContext } from "../../../context/ContextProvider";

const LineChart = () => {
  const { currentMode } = useStateContext();

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales",
        data: [50, 70, 60, 80, 75, 90],
        fill: false,
        borderColor: currentMode === "dark" ? "#db2828" : "#2185d0",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: currentMode === "dark" ? "#db2828" : "#2185d0",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
      {
        label: "Revenue",
        data: [80, 60, 70, 50, 65, 55],
        fill: false,
        borderColor: currentMode === "dark" ? "#f2711c" : "#f2711c",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: currentMode === "dark" ? "#f2711c" : "#f2711c",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: currentMode === "dark" ? "#ffffff" : "#000000",
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: currentMode === "dark" ? "#424242" : "#eeeeee",
              lineWidth: 0.5,
            },
            ticks: {
              color: currentMode === "dark" ? "#ffffff" : "#000000",
            },
          },
          y: {
            grid: {
              color: currentMode === "dark" ? "#424242" : "#eeeeee",
              lineWidth: 0.5,
            },
            ticks: {
              color: currentMode === "dark" ? "#ffffff" : "#000000",
            },
          },
        },
      }}
    />
  );
};

export default LineChart;
