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

import axios from "../../axoisConfig";

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
  const { currentMode, BACKEND_URL, primaryColor, withOpacity, t } = useStateContext();
  const [performanceChartData, setPerformanceChartData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    axios
      .get(`${BACKEND_URL}/performance`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        const {
          data: { members_deal },
        } = result;

        const filteredMembers = members_deal.filter(
          (member) => member.total_meetings !== 0 || member.total_sales !== 0
        );

        setPerformanceChartData(filteredMembers);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <span>
      {currentMode === "dark" ? (
        <Chart
          key="dark-chart"
          type="bar"
          data={{
            labels: performanceChartData.map((member) => member.userName),
            datasets: [
              {
                type: "line",
                label: t("menu_closed_deals"),
                data: performanceChartData.map((member) => member.total_sales),
                fill: true,
                backgroundColor: withOpacity(primaryColor, 0.4),
                borderColor: primaryColor,
              },
              {
                type: "line",
                label: t("meetings"),
                data: performanceChartData.map(
                  (member) => member.total_meetings
                ),
                fill: false,
                backgroundColor: "rgba(0,0,0,0.2)",
                borderColor: "#CCCCCC",
              },
            ],
          }}
          options={{
            color: "#AAAAAA",
            backgroundColor: ["rgba(225,0,0,0.3)", "rgba(0,0,0,0.2)"],
            borderColor: [primaryColor, "#AAAAAA"],
            scales: {
              y: { ticks: { color: "#AAAAAA" }, grid: { color: "#424242" } },
              x: { ticks: { color: "#AAAAAA" }, grid: { color: "#424242" } },
            },
            responsive: true,
            width: "100%",
          }}
          style={{
            height: "100%",
            width: "100%",
          }}
        />
      ) : (
        <Chart
          key="light-chart"
          type="bar"
          data={{
            labels: performanceChartData.map((member) => member.userName),
            datasets: [
              {
                type: "line",
                label: t("menu_closed_deals"),
                data: performanceChartData.map((member) => member.total_sales),
                fill: true,
                backgroundColor: withOpacity(primaryColor, 0.4),
                borderColor: primaryColor,
              },
              {
                type: "line",
                label: t("meetings"),
                data: performanceChartData.map(
                  (member) => member.total_meetings
                ),
                // borderWidth: 1,
                fill: false,
                backgroundColor: "rgba(0,0,0,0.2)",
                borderColor: "#020202",
              },
            ],
          }}
          options={{
            color: "#333333",
            backgroundColor: ["rgba(225,0,0,0.3)", "rgba(0,0,0,0.2)"],
            borderColor: [primaryColor, "#020202"],
            scales: {
              y: { ticks: { color: "#333333" } },
              x: { ticks: { color: "#333333" } },
            },
            responsive: true,
            width: "100%",
          }}
          style={{
            height: "100%",
            width: "100%",
          }}
        />
      )}
    </span>
  );
};

export default CombinationChart;
