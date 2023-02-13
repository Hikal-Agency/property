import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import { useStateContext } from "../../context/ContextProvider";

const BarChart = () => {
  const { currentMode } = useStateContext();
  const data = [
    {
      name: "Ameer Ali Faesal",
      AED: 1160000,
    },
    {
      name: "Omar Fakhry",
      AED: 580000,
    },
    {
      name: "Najah Fahas",
      AED: 5493085,
    },
    {
      name: "Zainab Ezzaldien",
      AED: 13879000,
    },
    {
      name: "Victor Nicolas Gomis",
      AED: 500160,
    },
    {
      name: "Abdulrehman Makkawi",
      AED: 1711000,
    },
    {
      name: "Ahmad Alian",
      AED: 1684382,
    },
    {
      name: "Alaa Sliman",
      AED: 914000,
    },
    {
      name: "Hassan Lodhi",
      AED: 758000,
    },
    {
      name: "Hala Hikal",
      AED: 896140,
    },
  ];

  // eslint-disable-next-line
  const [UserData2, setUserData2] = useState({
    labels: data.map((data) => data.name),
    datasets: [
      {
        label: "Revenue",
        data: data.map((data) => data["AED"]),
        backgroundColor: ["#da1f26", "#000000"],
        indexAxis: "x",
      },
    ],
  });
  // eslint-disable-next-line
  const [UserData3, setUserData3] = useState({
    labels: data.map((data) => data.name),
    datasets: [
      {
        label: "Revenue",
        data: data.map((data) => data["AED"]),
        backgroundColor: ["#da1f26", "#ffffff"],
        indexAxis: "x",
      },
    ],
  });
  useEffect(() => {
    // ChartJs.defaults.color = "#ffffff";
    // eslint-disable-next-line
  }, []);

  return (
    <span>
      {currentMode === "dark" ? (
        <Bar
          data={UserData3}
          options={{
            color: "#ffffff",
            backgroundColor: ["#da1f26", "#ffffff"],
            scales: {
              y: { ticks: { color: "#ffffff" } },
              x: { ticks: { color: "#ffffff" } },
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
            color: "#000000",
            backgroundColor: ["#da1f26", "#000000"],
            scales: {
              y: { ticks: { color: "#000000" } },
              x: { ticks: { color: "#000000" } },
            },
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
          }}
        />
      )}
    </span>
  );
};

export default BarChart;
