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
  const { currentMode, primaryColor } = useStateContext();
  const [total_projects2] = useState(total_projects ? total_projects : []);
  const data = {
    labels: total_projects2?.map((data) => data.project), //["Riviera", "Crescent", "Tiger"],
    datasets: [
      {
        label: "Closed Projects",
        data: total_projects2?.map((data) => data.project_count), //[4, 3, 3],
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
            indexAxis: "y",
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
            color: "#AAAAAA",
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  color: "#AAAAAA",
                },
                grid: {
                  display: true,
                  color: "#424242",
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  color: "#AAAAAA",
                },
                grid: {
                  display: false,
                },
              },
            },
          }}
        />
      ) : (
        <Bar
          data={data}
          options={{
            indexAxis: "y",
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
            color: "#333333",
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  color: "#333333",
                },
                grid: {
                  display: true,
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  color: "#333333",
                },
                grid: {
                  display: false,
                },
              },
            },
          }}
        />
      )}
    </span>
  );
};

export default BarChartProjectAdmin;
