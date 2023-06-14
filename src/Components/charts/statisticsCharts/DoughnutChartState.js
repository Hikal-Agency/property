import React from "react";
import { Doughnut } from "react-chartjs-2";
import { useStateContext } from "../../../context/ContextProvider";

// const DoughnutChart = ({ doughnutChart }) => {
//   console.log("Dougnut: ", doughnutChart);
//   const { currentMode } = useStateContext();

//   const chartData = {
//     // labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
//     labels: doughnutChart?.adsetData,
//     datasets: [
//       {
//         // data: [12, 19, 3, 5, 2],
//         data: doughnutChart?.adsetclicks,
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.8)",
//           "rgba(54, 162, 235, 0.8)",
//           "rgba(255, 206, 86, 0.8)",
//           "rgba(75, 192, 192, 0.8)",
//           "rgba(153, 102, 255, 0.8)",
//         ],
//         borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div style={{ height: "400px", width: "400px" }}>
//       <Doughnut
//         data={chartData}
//         options={{
//           responsive: true,
//           plugins: {
//             legend: {
//               display: true,
//               position: "right",
//               labels: {
//                 usePointStyle: true,
//                 font: {
//                   family: "Arial",
//                   size: 14,
//                   color: currentMode === "dark" ? "#ffffff" : "#000000",
//                 },
//               },
//             },
//           },
//         }}
//       />
//     </div>
//   );
// };

const DoughnutChart = ({ doughnutChart }) => {
  console.log("dougnut: ", doughnutChart);
  const { currentMode } = useStateContext();

  const doughnutChartData = {
    devicePlatforms: doughnutChart?.map((data) => data.device_platform),
    impressions: doughnutChart?.map((data) => parseInt(data.impressions)),
  };

  const chartData = {
    labels: doughnutChartData.devicePlatforms,
    datasets: [
      {
        data: doughnutChartData.impressions,
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: "400px", width: "400px" }}>
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "right",
              labels: {
                usePointStyle: true,
                font: {
                  family: "Arial",
                  size: 14,
                  color: currentMode === "dark" ? "#ffffff" : "#000000",
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default DoughnutChart;
