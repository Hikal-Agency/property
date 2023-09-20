import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useStateContext } from "../../context/ContextProvider";

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportClosedMeetingDoughnut = ({ target_reached, target_remaining }) => {
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
            labels: ["Closed Deal", "Meeting"],
            datasets: [
              {
                label: "AED",
                // data: [`${DashboardData?.lead_status?.target_reached}`, `${DashboardData?.lead_status?.target_remaining}`],
                data: [25, 81],
                borderWidth: 1,
                backgroundColor: ["#da1f26", "#777777"],
              },
            ],
          }}
          options={{
            color: "#ffffff",
            backgroundColor: ["#da1f26", "#ffffff"],
            borderColor: ["#da1f26", "#ffffff"],
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
          }}
        />
      ) : (
        <Doughnut
          data={{
            labels: ["Closed Deal", "Meeting"],
            datasets: [
              {
                label: "AED",
                // data: [`${DashboardData?.lead_status?.target_reached}`, `${DashboardData?.lead_status?.target_remaining}`],
                data: [25, 81],
                borderWidth: 1,
                backgroundColor: ["#da1f26", "#000000"],
              },
            ],
          }}
          options={{
            color: "#000000",
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

export default ReportClosedMeetingDoughnut;
