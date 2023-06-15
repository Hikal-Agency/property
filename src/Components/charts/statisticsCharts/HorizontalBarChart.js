// import React from "react";
// import { Bar } from "react-chartjs-2";

// const HorizontalBarChart = ({ barCharData }) => {
//   console.log("ageGender chart: ", barCharData);
//   const chartData = {
//     labels: ["Dataset 1", "Dataset 2", "Dataset 3", "Dataset 4", "Dataset 5"],
//     datasets: [
//       {
//         label: "Category 1",
//         data: [50, 30, 70, 40, 60],
//         backgroundColor: "#FF6384",
//       },
//       {
//         label: "Category 2",
//         data: [80, 50, 30, 70, 90],
//         backgroundColor: "#36A2EB",
//       },
//       {
//         label: "Category 3",
//         data: [40, 60, 50, 80, 30],
//         backgroundColor: "#FFCE56",
//       },
//     ],
//   };

//   const chartOptions = {
//     indexAxis: "y", // Set the axis to y for horizontal bars
//     responsive: true,
//     scales: {
//       x: {
//         beginAtZero: true,
//       },
//       y: {
//         grid: {
//           display: false,
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         position: "bottom",
//       },
//     },
//   };

//   return <Bar data={chartData} options={chartOptions} />;
// };

// export default HorizontalBarChart;

// import React from "react";
// import { Bar } from "react-chartjs-2";

// const HorizontalBarChart = ({ barCharData }) => {
//   console.log("ageGender chart: ", barCharData);

//   // Extract age and gender data from barCharData
//   const ageData = barCharData.map((item) => item.age);
//   const genderData = barCharData.map((item) => item.gender);

//   const chartData = {
//     labels: ageData,
//     datasets: [
//       {
//         label: "Gender",
//         data: genderData,
//         backgroundColor: "#FF6384",
//       },
//     ],
//   };

//   const chartOptions = {
//     indexAxis: "y", // Set the axis to y for horizontal bars
//     responsive: true,
//     scales: {
//       x: {
//         beginAtZero: true,
//       },
//       y: {
//         grid: {
//           display: false,
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         position: "bottom",
//       },
//     },
//   };

//   return <Bar data={chartData} options={chartOptions} />;
// };

// export default HorizontalBarChart;

import React from "react";
import { Bar } from "react-chartjs-2";

const HorizontalBarChart = ({ barCharData }) => {
  console.log("ageGender chart: ", barCharData);

  // Prepare labels and datasets
  const labels = [...new Set(barCharData[0])];
  const gender = barCharData[1];

  const femaleData = labels.map((label, index) => {
    return gender[index] === "female" ? 1 : 0;
  });

  const maleData = labels.map((label, index) => {
    return gender[index] === "male" ? 0.8 : 0;
  });

  const unknownData = labels.map((label, index) => {
    return gender[index] === "unknown" ? 0.6 : 0;
  });

  console.log("female,male,unknown:::: ", femaleData, maleData, unknownData);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Female",
        data: femaleData,
        backgroundColor: "#FF6384",
      },
      {
        label: "Male",
        data: maleData,
        backgroundColor: "#36A2EB",
      },
      {
        label: "Unknown",
        data: unknownData,
        backgroundColor: "#FFCE56",
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y", // Set the axis to y for horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default HorizontalBarChart;
