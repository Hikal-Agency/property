import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const CallsGraph = ({ outgoing }) => {
  const { currentMode, primaryColor } = useStateContext();
  
  return (
    <span>
      {currentMode === "dark" ? (
        <Chart
          type="bar"
          data={{
            datasets: [
              {
                type: "line",
                label: "Outgoing calls",
                data: outgoing,
                fill: true,
                backgroundColor: "rgba(225,0,0,0.4)",
                borderColor: primaryColor,
              },
              //   {
              //     type: "line",
              //     label: "Meetings",
              //     data: performanceChartData.map(
              //       (member) => member.total_meetings
              //     ),
              //     fill: false,
              //     backgroundColor: "rgba(0,0,0,0.2)",
              //     borderColor: "#ffffff",
              //   },
            ],
          }}
          options={{
            color: "#ffffff",
            backgroundColor: ["rgba(225,0,0,0.3)", "rgba(0,0,0,0.2)"],
            borderColor: [primaryColor, "#ffffff"],
            scales: {
              y: { ticks: { color: "#ffffff" }, grid: { color: "#424242" } },
              x: { ticks: { color: "#ffffff" }, grid: { color: "#424242" } },
            },
            responsive: true,
            width: "100%",
          }}
          style={{
            height: "100%",
            width: "100%",
          }}
        />
      ) : (
        <Chart
          type="bar"
          data={{
            // labels: performanceChartData.map((member) => member.userName),
            datasets: [
              {
                type: "line",
                label: "Outgoing calls",
                data: outgoing,
                fill: true,
                backgroundColor: "rgba(225,0,0,0.4)",
                borderColor: primaryColor,
              },
              //   {
              //     type: "line",
              //     label: "Meetings",
              //     data: performanceChartData.map(
              //       (member) => member.total_meetings
              //     ),
              //     // borderWidth: 1,
              //     fill: false,
              //     backgroundColor: "rgba(0,0,0,0.2)",
              //     borderColor: "#020202",
              //   },
            ],
          }}
          options={{
            color: "#000000",
            backgroundColor: ["rgba(225,0,0,0.3)", "rgba(0,0,0,0.2)"],
            borderColor: [primaryColor, "#020202"],
            scales: {
              y: { ticks: { color: "#000000" } },
              x: { ticks: { color: "#000000" } },
            },
            responsive: true,
          }}
        />
      )}
    </span>
  );
};

export default CallsGraph;
