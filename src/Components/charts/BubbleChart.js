import React, { useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bubble } from "react-chartjs-2";
import { useStateContext } from "../../context/ContextProvider";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const BubbleChart = ({ total_projects }) => {
  const { currentMode } = useStateContext();
  // eslint-disable-next-line
  const [totail_projects2, settotal_projects2] = useState(
    total_projects ? total_projects : []
  );
  const data = {
    datasets: totail_projects2.map((project, index) => {
      return {
        label: project?.project,
        data: [
          {
            x: Math.floor(Math.random() * (10 - 1) + 1),
            y: Math.floor(Math.random() * (10 - 1) + 1),
            r: project?.project_count * 10,
          },
        ],
        backgroundColor: "rgba(218, 31, 38, 1)",
      };
    }),
  };

  return (
    <span>
      {currentMode === "dark" ? (
        <Bubble
          options={{
            color: "#ffffff",
            scales: {
              y: {
                ticks: { color: "#ffffff" },
                grid: { color: "#eeeeee", lineWidth: "0.25" },
              },
              x: {
                ticks: { color: "#ffffff" },
                grid: { color: "#eeeeee", lineWidth: "0.25" },
              },
            },
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
          }}
          data={data}
        />
      ) : (
        <Bubble
          options={{
            onHover: (e) => {},
            color: "#000000",
            scales: {
              y: { ticks: { color: "#000000" }, grid: { lineWidth: "0.25" } },
              x: { ticks: { color: "#000000" }, grid: { lineWidth: "0.25" } },
            },
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
          }}
          data={data}
        />
      )}
    </span>
  );
};

export default BubbleChart;
