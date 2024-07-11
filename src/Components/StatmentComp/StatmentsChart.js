import React, { useEffect, useState } from "react";
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
import ReactApexChart from "react-apexcharts";

import axios from "../../axoisConfig";
import moment from "moment";
// import faker from 'faker';

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

const StatmentsCharts = ({ stats }) => {
  const { currentMode, BACKEND_URL, primaryColor } = useStateContext();
  const [performanceChartData, setPerformanceChartData] = useState([]);
  const token = localStorage.getItem("auth-token");

  console.log("stats chart: ", stats);
  const chart_data = stats?.chart_data;
  const categories = Object.keys(chart_data);

  // Prepare series data for income and expense lines
  const incomeData = categories?.map(
    (category) => chart_data[category]?.income
  );
  const expenseData = categories?.map(
    (category) => chart_data[category]?.expense
  );

  const chartData = {
    options: {
      chart: {
        stacked: false,
        zoom: {
          enabled: false,
        },
      },
      // colors:
      //   currentMode === "dark"
      //     ? [primaryColor, "#ffffff"]
      //     : [primaryColor, "#000000"],
      colors: ['#269144', '#DA1F26'],
      stroke: {
        width: [2, 2],
      },
      dataLabels: {
        enabled: false,
      },
      labels: categories,
      xaxis: {
        type: "category",
        labels: {
          style: {
            colors: currentMode === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      yaxis: [
        {
          seriesName: "Income",
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
          },
          labels: {
            style: {
              colors: primaryColor,
            },
          },
          title: {
            text: "Income",
            style: {
              color: "#269144",
            },
          },
        },
        {
          seriesName: "Expense",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
          },
          labels: {
            style: {
              colors: currentMode === "dark" ? "#ffffff" : "#000000",
            },
          },
          title: {
            text: "Expense",
            style: {
              color: "#DA1F26",
            },
          },
        },
      ],
    },
    series: [
      {
        name: "Income",
        type: "line",
        // data: performanceChartData.map((member) => member.total_sales),
        data: incomeData,
        markers: {
          size: 6, 
          colors: "#269144",
          strokeWidth: 0,
        },
      },
      {
        name: "Expense",
        type: "line",
        // data: performanceChartData.map((member) => member.total_meetings),
        data: expenseData,
        markers: {
          size: 6, 
          colors: "#DA1F26",
          strokeWidth: 0,
        },
      },
    ],
  };

  return (
    <div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={400}
      />
    </div>
  );
};

export default StatmentsCharts;
