import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { useStateContext } from "../../context/ContextProvider";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PolarAreaChart = ({ total_projects }) => {
  const { currentMode } = useStateContext();
  // const [totail_projects2, settotail_projects2] = useState(
  //     total_projects ? total_projects : []
  // );

  const data = {
    datasets: [
      {
        // label: [
        //     totail_projects2.map((project, index) => {
        //         project?.project
        //     })
        // ],
        // data: [
        //     totail_projects2.map((project, index) => {
        //         project?.project_count
        //     })
        // ],
        label: ["Riviera", "Crescent", "Tiger"],
        data: [4, 3, 3],
        backgroundColor: ["rgba(218, 31, 38, 1)", "rgba(0, 0, 0, 1)"],
      },
    ],
  };
  //     };
  //   }),
  // datasets: [
  //     {
  //         label: 'AED',
  //         data: [3000000, 1000000, 2000000],
  //         backgroundColor: [
  //             'rgba(255, 99, 132, 0.5)',
  //             'rgba(255, 0, 0, 0.5)',
  //             'rgba(0, 0, 0, 0.5)',
  //         ],
  //         color: '#da1f26',
  //         borderWidth: 1,
  //     },
  // ],
  return (
    <span>
      {currentMode === "dark" ? (
        <PolarArea
          data={data}
          options={{
            color: "#ffffff",
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
          }}
        />
      ) : (
        <PolarArea
          data={data}
          options={{
            color: "#000000",
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
          }}
        />
      )}
    </span>
  );
};

export default PolarAreaChart;
