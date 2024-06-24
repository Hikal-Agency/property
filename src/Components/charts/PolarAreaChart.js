import React, { useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { useStateContext } from "../../context/ContextProvider";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PolarAreaChart = ({ total_projects }) => {
  const { currentMode } = useStateContext();
  const [totail_projects2] = useState(
      total_projects ? total_projects : []
  );

  const data = {
    datasets: [
      {
        // label: [
        //     totail_projects2.map((project, index) => {
        //         project?.project
        //     })
        // ],
        // data: [
        //     totail_projects2.map((project, index) => {
        //         project?.project_count
        //     })
        // ],
        label: totail_projects2.map((data) => data.project), //["Riviera", "Crescent", "Tiger"],
                data: totail_projects2.map((data) => data.project_count), //[4, 3, 3],
        backgroundColor: ["rgba(218, 31, 38, 1)"],
      },
    ],
  };
  return (
    <span>
      {currentMode === "dark" ? (
        <PolarArea
          data={data}
          options={{
            color: "#ffffff",
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            borderColor: "#000000",
          }}
        />
      ) : (
        <PolarArea
          data={data}
          options={{
            color: "#000000",
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            borderColor: "#ffffff",
          }}
        />
      )}
    </span>
  );
};

export default PolarAreaChart;
