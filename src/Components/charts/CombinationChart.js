import React, { useEffect, useState } from "react";
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
  const [performanceChartData, setPerformanceChartData] = useState([]);

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
        const {data: {members_deal}} = result;
        setPerformanceChartData(members_deal);
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
            labels: performanceChartData.map((member) => member.userName),
            datasets: [
              {
                type: "line",
                label: "Closed deals",
                data: performanceChartData.map((member) => member.total_sales),
                fill: true,
                backgroundColor: "rgba(225,0,0,0.4)",
                borderColor: "#da1f26",
              },
              {
                type: "line",
                label: "Meetings",
                data: performanceChartData.map((member) => member.total_meetings),
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
            labels: performanceChartData.map((member) => member.userName),
            datasets: [
              {
                type: "line",
                label: "Closed deals",
                data: performanceChartData.map((member) => member.total_sales),
                fill: true,
                backgroundColor: "rgba(225,0,0,0.4)",
                borderColor: "#da1f26",
              },
              {
                type: "line",
                label: "Meetings",
                data: performanceChartData.map((member) => member.total_meetings),
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
