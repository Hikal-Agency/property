import React, { useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useStateContext } from "../../context/ContextProvider";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const ReportProjectBar = () => {
  const { currentMode } = useStateContext();

  const data = {
    labels: ["Riviera", "Crescent", "Tiger"],
    datasets: [
      {
        label: 'Closed Projects',
        data: [4, 3, 3],
        backgroundColor: ["rgba(218, 31, 38, 1)"],
      },
    ],
  };
  return (
    <span>
      {currentMode === "dark" ? (
        <Bar
          data={data}
          options={{
            color: "#ffffff",
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#ffffff",
                    },
                    grid: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#ffffff",
                    },
                    grid: {
                        color: "#424242",
                    }
                }
            }
          }}
        />
      ) : (
        <Bar
          data={data}
          options={{
            color: "#000000",
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#000000",
                    },
                    grid: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#000000",
                    },
                    grid: {
                        display: false,
                    }
                }
            }
          }}
        />
      )}
    </span>
  );
};

export default ReportProjectBar;
