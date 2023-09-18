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
import ReactApexChart from "react-apexcharts";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const SaleBubbleChart = ({ selectedMonthSales }) => {
  const { currentMode, Sales_chart_data } = useStateContext();
  console.log("sales chart: ", Sales_chart_data);
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [],
  });

  const chartData = [
    {
      data: Sales_chart_data?.map((data) => ({
        x: data.userName,
        y: data.total_ammount_sum_amount.toString(), // Convert to a string to prevent rounding
        z: data.total_ammount_sum_amount * 1000,
      })),
    },
  ];

  const chartOptions = {
    chart: {
      height: 400,
      type: "bubble",
      background: "transparent",
      toolbar: {
        show: false,
      },
    },

    fill: {
      type: "gradient",
    },
    xaxis: {
      // title: {
      //   text: "Sales in AED",
      // },
      labels: {
        style: {
          colors: currentMode === "dark" ? "#ffffff" : "#000000",
        },
        rotateAlways: true, // Tilt the X-axis labels
        className: "x-axis-labels",
      },
    },
    yaxis: {
      // title: {
      //   text: "Y-Axis",
      // },
      labels: {
        style: {
          colors: currentMode === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
    markers: {
      size: 6,
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      // text: "3D Bubble Chart",
    },
    theme: {
      // mode: currentMode,
      palette: "palette2",
    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        // Customize the tooltip text here
        const data = w.config.series[seriesIndex].data[dataPointIndex];
        return `
        <div class="custom-tooltip">
            <h1>Name: ${data.x}</h1><hr/>
            <span class="custom-data">
            <span>Sales in AED: ${data.y}</span><br>
            </span>
          </div>
        `;
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type="bubble"
        height={350}
      />
    </div>
  );
};

export default SaleBubbleChart;
