import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useStateContext } from "../../context/ContextProvider";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ target_reached, target_remaining }) => {
  const { currentMode } = useStateContext();
  // const AgentData = [
  //   {
  //     target: DashboardData?.lead_status?.target,
  //     target_reached: DashboardData?.lead_status?.target_reached,
  //     target_remaining: DashboardData?.lead_status?.target_remaining,
  //   },
  // ];

  return (
    <span>
      {currentMode === "dark" ? (
        <Doughnut
          data={{
            labels: ["Achieved", "Remaining"],
            datasets: [
              {
                label: "AED",
                // data: [`${DashboardData?.lead_status?.target_reached}`, `${DashboardData?.lead_status?.target_remaining}`],
                data: [target_reached, target_remaining],
                borderWidth: 1,
                backgroundColor: ["#DA1F26", "#1C1C1C"],
              },
            ],
          }}
          options={{
            color: "#EEEEEE",
            backgroundColor: ["#da1f26", "#da1f26"],
            borderColor: ["#da1f26", "#424242"],
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
          }}
        />
      ) : (
        <Doughnut
          data={{
            labels: ["Achieved", "Remaining"],
            datasets: [
              {
                label: "AED",
                // data: [`${DashboardData?.lead_status?.target_reached}`, `${DashboardData?.lead_status?.target_remaining}`],
                data: [target_reached, target_remaining],
                borderWidth: 1,
                backgroundColor: ["#da1f26", "#000000"],
              },
            ],
          }}
          options={{
            color: "#333333",
            backgroundColor: ["rgb(218, 31, 38, 0.9)", "rgba(0, 0, 0, 0.9)"],
            borderColor: ["#da1f26", "#000000"],
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
          }}
        />
      )}
    </span>
  );
};

export default DoughnutChart;
