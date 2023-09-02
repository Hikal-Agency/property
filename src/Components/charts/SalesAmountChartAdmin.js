import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useStateContext } from "../../context/ContextProvider";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const SalesAmountChartAdmin = ({ selectedMonthSales }) => {
  const { currentMode, Sales_chart_data } = useStateContext();
  console.log("sales chart: ", Sales_chart_data);
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [],
  });

  // const [salesChartData2, setSalesChartData2] = useState(Sales_chart_data);

  useEffect(() => {
    setSalesData({
      labels: Sales_chart_data?.map((data) => data.userName), //["Riviera", "Crescent", "Tiger"],
      datasets: [
        {
          label: "Sales in AED",
          data: Sales_chart_data.map((data) => data.total_ammount_sum_amount), //[4, 3, 3],
          backgroundColor: ["rgba(218, 31, 38, 1)"],
        },
      ],
    });
  }, [Sales_chart_data]);

  return (
    <span>
      {currentMode === "dark" ? (
        <Bar
          data={salesData}
          options={{
            indexAxis: "y",
            elements: {
              bar: {
                borderWidth: 0,
              },
            },
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
            },
            color: "#AAAAAA",
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1000000,
                  color: "#AAAAAA",
                },
                grid: {
                  display: true,
                  color: "#424242",
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  color: "#AAAAAA",
                },
                grid: {
                  display: false,
                },
              },
            },
          }}
        />
      ) : (
        <Bar
          data={salesData}
          options={{
            indexAxis: "y",
            elements: {
              bar: {
                borderWidth: 0,
              },
            },
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
            },
            color: "#333333",
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1000000,
                  color: "#333333",
                },
                grid: {
                  display: true,
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  color: "#333333",
                },
                grid: {
                  display: false,
                },
              },
            },
          }}
        />
      )}
    </span>
  );
};

export default SalesAmountChartAdmin;
