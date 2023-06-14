import React from "react";
import { Bar, Line } from "react-chartjs-2";
import "./styling.css";
import { useStateContext } from "../../../context/ContextProvider";

// const CombineChart = ({ combineData }) => {
//   console.log("CombineData: ", combineData);
//   const chartData = {
//     labels: ["January", "February", "March", "April", "May", "June"],
//     datasets: [
//       {
//         type: "line",
//         label: "Line Dataset 1",
//         data: combineData?.conversions,
//         fill: false,
//         borderColor: "#2185d0",
//         backgroundColor: "#2185d0",
//         pointRadius: 4,
//         pointBackgroundColor: "#ffffff",
//         pointBorderColor: "#2185d0",
//         pointBorderWidth: 2,
//         tension: 0.4,
//       },
//       // {
//       //   type: "line",
//       //   label: "Line Dataset 2",
//       //   data: [70, 80, 65, 85, 90, 70],
//       //   fill: false,
//       //   borderColor: "#db2828",
//       //   backgroundColor: "#db2828",
//       //   pointRadius: 4,
//       //   pointBackgroundColor: "#ffffff",
//       //   pointBorderColor: "#db2828",
//       //   pointBorderWidth: 2,
//       //   tension: 0.4,
//       // },
//       {
//         type: "bar",
//         label: "Bar Dataset 1",
//         data: combineData?.spend,
//         backgroundColor: "#f2711c",
//         barPercentage: 0.4,
//       },
//       // {
//       //   type: "bar",
//       //   label: "Bar Dataset 2",
//       //   data: [65, 75, 60, 45, 70, 50],
//       //   backgroundColor: "#21ba45",
//       //   barPercentage: 0.4,
//       // },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           color: "#000000",
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: "#000000",
//         },
//       },
//       y: {
//         grid: {
//           color: "#eeeeee",
//           lineWidth: 0.5,
//         },
//         ticks: {
//           color: "#000000",
//         },
//       },
//     },
//   };

//   return (
//     <div className="barChartDiv" style={{ height: "300px", width: "100%" }}>
//       {" "}
//       <Bar data={chartData} options={chartOptions} />
//     </div>
//   );
// };

// const CombineChart = ({ combineData }) => {
//   console.log("CombineData: ", combineData);

//   const chartData = {
//     labels: ["January", "February", "March", "April", "May", "June"],
//     datasets: [
//       {
//         type: "line",
//         label: "Conversions",
//         data: combineData?.conversions,
//         fill: false,
//         borderColor: "#2185d0",
//         backgroundColor: "#2185d0",
//         pointRadius: 0,
//         tension: 0.4,
//       },
//       {
//         type: "line",
//         label: "Spend",
//         data: combineData?.spend,
//         fill: false,
//         borderColor: "#f2711c",
//         backgroundColor: "#f2711c",
//         pointRadius: 0,
//         tension: 0.4,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           color: "#000000",
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: "#000000",
//         },
//       },
//       y: {
//         grid: {
//           color: "#eeeeee",
//           lineWidth: 0.5,
//         },
//         ticks: {
//           color: "#000000",
//         },
//       },
//     },
//   };

//   return (
//     <div className="lineChartDiv" style={{ height: "300px", width: "100%" }}>
//       <Line data={chartData} options={chartOptions} />
//     </div>
//   );
// };

// const CombineChart = ({ combineData }) => {
//   const { currentMode } = useStateContext();
//   console.log("CombineData: ", combineData);

//   // Check if there's no conversion or spend data
//   if (!combineData?.conversions?.length || !combineData?.spend?.length) {
//     return <div>No data to display.</div>;
//   }

//   const chartData = {
//     labels: [...combineData?.conversions, ...combineData?.spend],
//     datasets: [
//       {
//         type: "line",
//         label: "Conversions",
//         data: combineData?.conversions,
//         fill: false,
//         borderColor: "#2185d0",
//         backgroundColor: "#2185d0",
//         pointRadius: 0,
//         tension: 0.4,
//       },
//       {
//         type: "line",
//         label: "Spend",
//         data: combineData?.spend,
//         fill: false,
//         borderColor: "#f2711c",
//         backgroundColor: "#f2711c",
//         pointRadius: 0,
//         tension: 0.4,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           color: currentMode === "dark" ? "#ffffff" : "#000000",
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: currentMode === "dark" ? "#ffffff" : "#000000",
//         },
//       },
//       y: {
//         grid: {
//           color: currentMode === "dark" ? "#ffffff" : "#000000",
//           lineWidth: 0.5,
//         },
//         ticks: {
//           color: currentMode === "dark" ? "#ffffff" : "#000000",
//         },
//       },
//     },
//   };

//   return (
//     <div className="lineChartDiv" style={{ height: "300px", width: "100%" }}>
//       <Line data={chartData} options={chartOptions} />
//     </div>
//   );
// };

const CombineChart = ({ combineData }) => {
  const { currentMode } = useStateContext();
  console.log("CombineData: ", combineData);

  // Check if there's no spend data
  if (!combineData?.spend?.length) {
    return <div>No data to display.</div>;
  }

  // Create an array of datasets, including the conversions dataset if it exists
  const datasets = [
    {
      type: "line",
      label: "Spend",
      data: combineData?.spend,
      fill: false,
      borderColor: "#f2711c",
      backgroundColor: "#f2711c",
      pointRadius: 0,
      tension: 0.4,
    },
  ];

  if (combineData?.conversions?.length) {
    datasets.unshift({
      type: "line",
      label: "Conversions",
      data: combineData?.conversions,
      fill: false,
      borderColor: "#2185d0",
      backgroundColor: "#2185d0",
      pointRadius: 0,
      tension: 0.4,
    });
  }

  const chartData = {
    labels: combineData?.conversions?.length
      ? [...combineData?.conversions, ...combineData?.spend]
      : [...combineData?.spend],
    datasets,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: currentMode === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: currentMode === "dark" ? "#ffffff" : "#000000",
        },
      },
      y: {
        grid: {
          color: currentMode === "dark" ? "#ffffff" : "#000000",
          lineWidth: 0.5,
        },
        ticks: {
          color: currentMode === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
  };

  return (
    <div className="lineChartDiv" style={{ height: "300px", width: "100%" }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default CombineChart;
