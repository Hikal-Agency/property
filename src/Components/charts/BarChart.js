import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

import { useStateContext } from "../../context/ContextProvider";

const BarChart = ({ Sales_chart_data }) => {
  const { currentMode } = useStateContext();
  // eslint-disable-next-line
  const [UserData2, setUserData2] = useState({
    labels: Sales_chart_data.map((data) => data?.userName),
    datasets: [
      {
        label: "Revenue",
        data: Sales_chart_data.map((data) => data?.total_ammount_sum_amount),
        backgroundColor: ["#da1f26", "#000000"],
        indexAxis: "x",
      },
    ],
  });
  // eslint-disable-next-line
  const [UserData3, setUserData3] = useState({
    labels: Sales_chart_data.map((data) => data?.userName),
    datasets: [
      {
        label: "Revenue",
        data: Sales_chart_data.map((data) => data?.total_ammount_sum_amount),
        backgroundColor: ["#da1f26", "#CCCCCC"],
        indexAxis: "x",
      },
    ],
  });

  // eslint-disable-next-line

  return (
    <>
      {currentMode === "dark" ? (
        <Bar
          data={UserData3}
          options={{
            color: "#AAAAAA",
            backgroundColor: ["#da1f26", "#CCCCCC"],
            scales: {
              y: { ticks: { color: "#AAAAAA" } },
              x: { ticks: { color: "#AAAAAA" } },
            },
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
          }}
        />
      ) : (
        <Bar
          data={UserData2}
          options={{
            color: "#333333",
            backgroundColor: ["#da1f26", "#000000"],
            scales: {
              y: { ticks: { color: "#333333" } },
              x: { ticks: { color: "#333333" } },
            },
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
          }}
        />
      )}

      <span></span>
    </>
  );
};

export default BarChart;
