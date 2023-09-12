import React from "react";
import { Bar } from "react-chartjs-2";

const GroupChart = () => {
  const data = {
    labels: [
      "Outgoing",
      "Answered",
      "Not answered",
      "Incoming calls",
      "Received",
      "Missed",
    ],
    datasets: [
      {
        label: "Weekly Report",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: "Monthly Report",
        backgroundColor: "rgba(155,231,91,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [45, 79, 10, 41, 16, 85, 20],
      },
    ],
  };
  const options = {
    responsive: true,
    legend: {
      display: false,
    },
    type: "bar",
  };
  return (
    <div>
      <Bar data={data} width={null} height={null} options={options} />
    </div>
  );
};

export default GroupChart;
