import React, { useEffect } from "react";
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
import axios from "axios";
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
  const labels = ["Agent 1", "Agent 2", "Agent 3", "Agent 4"];

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    axios
      .get("https://staging.hikalcrm.com/api/performance", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("performance chart data is");
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
                data: [0, 3, 9, 5],
                fill: true,
                backgroundColor: "rgba(225,0,0,0.4)",
                borderColor: "#da1f26",
              },
              {
                type: "line",
                label: "Meetings",
                data: [10, 30, 20, 20],
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
              y: { ticks: { color: "#ffffff" }, grid: { color: "#424242" } },
              x: { ticks: { color: "#ffffff" }, grid: { color: "#424242" } },
            },
            responsive: true,
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
                data: [0, 3, 9, 5],
                fill: true,
                backgroundColor: "rgba(225,0,0,0.4)",
                borderColor: "#da1f26",
              },
              {
                type: "line",
                label: "Meetings",
                data: [10, 30, 20, 20],
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
            responsive: true,
          }}
        />
      )}
    </span>
  );
};

export default CombinationChart;
