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

const BarChartProjectAdmin = ({ total_projects }) => {
  const { currentMode } = useStateContext();
  const [totail_projects2] = useState(
      total_projects ? total_projects : []
  );

  const data = {
    labels: totail_projects2.map((data) => data.project), //["Riviera", "Crescent", "Tiger"],
    datasets: [
      {
        label: 'Closed Projects',
        data: totail_projects2.map((data) => data.project_count), //[4, 3, 3],
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
            indexAxis: 'y',
            elements: {
                bar: {
                    borderWidth: 0,
                },
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
            },
            color: "#ffffff",
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#ffffff",
                    },
                    grid: {
                        display: true,
                        color: "#424242",
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#ffffff",
                    },
                    grid: {
                        display: false,
                    }
                }
            }
          }}
        />
      ) : (
        <Bar
            data={data}
            options={{
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 0,
                    },
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: false,
                    },
                },
                color: "#000000",
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: "#000000",
                        },
                        grid: {
                            display: true,
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

export default BarChartProjectAdmin;
