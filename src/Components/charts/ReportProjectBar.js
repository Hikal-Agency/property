import React, { useEffect, useState } from "react";
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

const ReportProjectBar = ({ total_projects, selectedMonthProject }) => {
  const { currentMode, primaryColor } = useStateContext();
  const [totail_projects2] = useState(total_projects ? total_projects : []);

  console.log("projects: ", totail_projects2);

  const data = {
    labels: totail_projects2.map((data) => data.project), //["Riviera", "Crescent", "Tiger"],
    datasets: [
      {
        label: "Closed Projects",
        data: totail_projects2.map((data) => data.project_count), //[4, 3, 3],
        backgroundColor: [primaryColor],
      },
    ],
  };

  useEffect(() => {
    // rerender
  }, [selectedMonthProject]);
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
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  color: "#ffffff",
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
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  color: "#000000",
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

export default ReportProjectBar;


