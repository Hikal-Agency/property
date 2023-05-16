import React from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { useState } from "react";
import { Bubble, Pie, PolarArea } from "react-chartjs-2";

const BubbleChartStat = () => {
  const { currentMode } = useStateContext();
  const chartData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
    datasets: [
      {
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          currentMode === "dark" ? "#db2828" : "#2185d0",
          currentMode === "dark" ? "#2185d0" : "#f2711c",
          currentMode === "dark" ? "#fbbd08" : "#21ba45",
          currentMode === "dark" ? "#21ba45" : "#a333c8",
          currentMode === "dark" ? "#a333c8" : "#6435c9",
        ],
        borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
        borderWidth: 1,
      },
    ],
  };

  return (
    <PolarArea
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          r: {
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

export default BubbleChartStat;
