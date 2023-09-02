// import React from "react";
// import { Line } from "react-chartjs-2";
// import { useStateContext } from "../../../context/ContextProvider";
// import { useState } from "react";

// const AreaChart = () => {
//   const { currentMode } = useStateContext();

//   const [chartData] = useState({
//     labels: ["January", "February", "March", "April", "May", "June"],
//     datasets: [
//       {
//         label: "Data 1",
//         data: [50, 60, 70, 80, 90, 100],
//         backgroundColor: "rgba(218, 31, 38, 0.5)",
//         borderColor: "rgba(218, 31, 38, 1)",
//         borderWidth: 1,
//         fill: "start",
//       },
//       {
//         label: "Data 2",
//         data: [70, 75, 80, 85, 90, 95],
//         backgroundColor: "rgba(31, 218, 208, 0.5)",
//         borderColor: "rgba(31, 218, 208, 1)",
//         borderWidth: 1,
//         fill: "start",
//       },
//     ],
//   });

//   return (
//     <span>
//       <Line
//         data={chartData}
//         options={{
//           responsive: true,
//           plugins: {
//             legend: {
//               display: true,
//               labels: {
//                 color: currentMode === "dark" ? "#ffffff" : "#000000",
//               },
//             },
//           },
//           elements: {
//             point: {
//               radius: 0,
//             },
//           },
//           scales: {
//             x: {
//               ticks: {
//                 color: currentMode === "dark" ? "#ffffff" : "#000000",
//               },
//               grid: {
//                 display: true,
//                 color: currentMode === "dark" ? "#424242" : "#dddddd",
//                 lineWidth: 0.5,
//               },
//             },
//             y: {
//               ticks: {
//                 color: currentMode === "dark" ? "#ffffff" : "#000000",
//               },
//               grid: {
//                 display: true,
//                 color: currentMode === "dark" ? "#424242" : "#dddddd",
//                 lineWidth: 0.5,
//               },
//             },
//           },
//         }}
//       />
//     </span>
//   );
// };

// export default AreaChart;

import React from "react";
import { Line } from "react-chartjs-2";
import { useStateContext } from "../../../context/ContextProvider";

const AreaChart = () => {
  const { currentMode } = useStateContext();

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Dataset 2",
        data: [50, 60, 70, 80, 90, 100, 95],
        borderColor: currentMode === "dark" ? "#35a2eb" : "#35a2eb",
        backgroundColor:
          currentMode === "dark"
            ? "rgba(53, 162, 235, 0.5)"
            : "rgba(53, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: currentMode === "dark" ? "#ffffff" : "#000000",
            },
          },
          title: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              color: currentMode === "dark" ? "#ffffff" : "#000000",
            },
            grid: {
              display: true,
              color: currentMode === "dark" ? "#424242" : "#dddddd",
              lineWidth: 0.5,
            },
          },
          y: {
            ticks: {
              color: currentMode === "dark" ? "#ffffff" : "#000000",
            },
            grid: {
              display: true,
              color: currentMode === "dark" ? "#424242" : "#dddddd",
              lineWidth: 0.5,
            },
          },
        },
      }}
    />
  );
};

export default AreaChart;
