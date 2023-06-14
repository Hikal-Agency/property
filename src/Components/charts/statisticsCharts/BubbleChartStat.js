import React from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { useState } from "react";
import { Bubble, Pie, PolarArea } from "react-chartjs-2";

// const BubbleChartStat = ({ bubbleChartData }) => {
//   console.log("Bubble chart: ", bubbleChartData);
//   const { currentMode } = useStateContext();
//   const chartData = {
//     labels: ["Red", "Blue", "Yellow", "Orange", "Purple"],
//     datasets: [
//       {
//         // data: [12, 19, 3, 5, 2],
//         data: [1, 19, 3, 5, 2],
//         backgroundColor: [
//           currentMode === "dark" ? "#db2828" : "#2185d0",
//           currentMode === "dark" ? "#2185d0" : "#f2711c",
//           currentMode === "dark" ? "#fbbd08" : "#21ba45",
//           currentMode === "dark" ? "#21ba45" : "#a333c8",
//           currentMode === "dark" ? "#a333c8" : "#6435c9",
//         ],
//         borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <PolarArea
//       data={chartData}
//       options={{
//         responsive: true,
//         plugins: {
//           legend: {
//             display: false,
//           },
//         },
//         scales: {
//           r: {
//             grid: {
//               color: currentMode === "dark" ? "#424242" : "#eeeeee",
//               lineWidth: 0.5,
//             },
//             ticks: {
//               color: currentMode === "dark" ? "#ffffff" : "#000000",
//             },
//           },
//         },
//       }}
//     />
//   );
// };

const BubbleChartStat = ({ bubbleChartData }) => {
  const { currentMode } = useStateContext();

  // Prepare labels and data from fetched data
  const labels =
    bubbleChartData?.length > 0 &&
    bubbleChartData?.map((item) => item.campaignName);
  const reachData =
    bubbleChartData?.length > 0 && bubbleChartData?.map((item) => item.reach);
  const frequencyData =
    bubbleChartData?.length > 0 &&
    bubbleChartData?.map((item) => item.frequency);

  // Prepare backgroundColors and borderColors for each item
  const backgroundColors = [
    "#db2828",
    "#2185d0",
    "#fbbd08",
    "#21ba45",
    "#a333c8",
    "#6435c9",
  ];
  const borderColors = ["#ffffff", "#000000"];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Reach",
        data: reachData,
        backgroundColor: backgroundColors.slice(0, reachData.length),
        borderColor: borderColors.slice(0, reachData.length),
        borderWidth: 1,
      },
      {
        label: "Frequency",
        data: frequencyData,
        backgroundColor: backgroundColors.slice(0, frequencyData.length),
        borderColor: borderColors.slice(0, frequencyData.length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: "330px", width: "400px" }}>
      <PolarArea
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true, // Display legend to differentiate between Reach and Frequency
            },
          },
          scales: {
            r: {
              grid: {
                color: currentMode === "dark" ? "#424242" : "#eeeeee",
                lineWidth: 0.5,
              },
              ticks: {
                color: currentMode === "dark" ? "#ffffff" : "#000000",
                zIndex: 5000,
                margin: "200px !important",
              },
            },
          },
          layout: {
            padding: {
              top: 20,
              left: 20,
              right: 20,
              bottom: 20,
            },
          },
        }}
      />
    </div>
  );
};

export default BubbleChartStat;
