import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
// import faker from 'faker';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const CombinationChart = () => {
  const { currentMode } = useStateContext();
  const labels = [
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
  ];
  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       type: "line",
  //       label: "Closed deals",
  //       data: [0, 3, 9, 5, 10, 0],
  //       fill: true,
  //       backgroundColor: "rgba(225,0,0,0.3)",
  //       borderColor: "#da1f26",
  //     },
  //     {
  //       type: "line",
  //       label: "Meetings",
  //       data: [10, 30, 20, 20, 40, 2],
  //       // borderWidth: 1,
  //       fill: false,
  //       backgroundColor: "rgba(0,0,0,0.2)",
  //       borderColor: "#020202",
  //     },
  //   ],
  // };
  

  return (
    <span>
      {currentMode === "dark" ? (
        <Chart
          type="bar"
          data={{
            labels,
            datasets: [
              {
                type: "line",
                label: "Closed deals",
                data: [0, 3, 9, 5, 10, 0],
                fill: true,
                backgroundColor: "rgba(225,225,225,0.3)",
                borderColor: "#da1f26",
              },
              {
                type: "line",
                label: "Meetings",
                data: [10, 30, 20, 20, 40, 2],
                // borderWidth: 1,
                fill: false,
                backgroundColor: "rgba(0,0,0,0.2)",
                borderColor: "#ffffff",
              },
            ],
          }}
          options={{
            color: "#ffffff",
            backgroundColor: ["rgba(225,0,0,0.3)", "rgba(0,0,0,0.2)"],
            borderColor: ["#da1f26", "#ffffff"],
            scales: {
              y: { ticks: { color: "#ffffff" } },
              x: { ticks: { color: "#ffffff" } },
            },
          }}
        />
      ) : (
        <Chart
          type="bar"
          data={{
            labels,
            datasets: [
              {
                type: "line",
                label: "Closed deals",
                data: [0, 3, 9, 5, 10, 0],
                fill: true,
                backgroundColor: "rgba(225,0,0,0.3)",
                borderColor: "#da1f26",
              },
              {
                type: "line",
                label: "Meetings",
                data: [10, 30, 20, 20, 40, 2],
                // borderWidth: 1,
                fill: false,
                backgroundColor: "rgba(0,0,0,0.2)",
                borderColor: "#020202",
              },
            ],
          }}
          options={{
            color: "#000000",
            backgroundColor: ["rgba(225,0,0,0.3)", "rgba(0,0,0,0.2)"],
            borderColor: ["#da1f26", "#020202"],
            scales: {
              y: { ticks: { color: "#000000" } },
              x: { ticks: { color: "#000000" } },
            },
          }}
        />
      )}
    </span>
  );
};

export default CombinationChart;
