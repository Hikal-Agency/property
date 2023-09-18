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

const BarChartProject = ({ total_projects }) => {
  const { currentMode, primaryColor } = useStateContext();
  const [totail_projects2] = useState(
      total_projects ? total_projects : []
  );

  const data = {
    labels: totail_projects2.map((data) => data.project), //["Riviera", "Crescent", "Tiger"],
    datasets: [
      {
        label: 'Closed Projects',
        data: totail_projects2.map((data) => data.project_count), //[4, 3, 3],
        backgroundColor: [primaryColor],
      },
    ],
  };
  return (
    <span>
      {currentMode === "dark" ? (
        <Bar
          data={data}
          options={{
            color: "#AAAAAA",
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#AAAAAA",
                    },
                    grid: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#AAAAAA",
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
            color: "#333333",
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#333333",
                    },
                    grid: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#333333",
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

export default BarChartProject;
