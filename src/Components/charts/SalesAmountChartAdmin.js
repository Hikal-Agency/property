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

const SalesAmountChartAdmin = () => {
  const { currentMode, Sales_chart_data } = useStateContext();
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    setSalesData({
    labels: Sales_chart_data?.map((data) => data.userName), //["Riviera", "Crescent", "Tiger"],
    datasets: [
      {
        label: 'Sales in AED',
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
            indexAxis: 'y',
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
            color: "#ffffff",
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1000000,
                        color: "#ffffff",
                    },
                    grid: {
                        display: true,
                        color: "#424242",
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#ffffff",
                    },
                    grid: {
                        display: false,
                    }
                }
            }
          }}
        />
      ) : (
        <Bar
            data={salesData}
            options={{
                indexAxis: 'y',
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
                color: "#000000",
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1000000,
                            color: "#000000",
                        },
                        grid: {
                            display: true,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: "#000000",
                        },
                        grid: {
                            display: false,
                        }
                    }
                }
            }}
        />
      )}
    </span>
  );
};

export default SalesAmountChartAdmin;


