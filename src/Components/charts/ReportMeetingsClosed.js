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

const ReportMeetingsClosed = ({ selectedMonth }) => {
  const { currentMode, BACKEND_URL, primaryColor } = useStateContext();
  const [performanceChartData, setPerformanceChartData] = useState([]);
  const token = localStorage.getItem("auth-token");

  const fetchPerformance = () => {
    let params = {};

    if (selectedMonth) {
      if (selectedMonth === "lastmonth") {
        const lastMonthStartDate = moment()
          .subtract(1, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        const lastMonthEndDate = moment()
          .subtract(2, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        params.date_range = `${lastMonthStartDate},${lastMonthEndDate}`;
      } else if (selectedMonth === "thismonth") {
        const thisMonthStartDate = moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        const thisMonthEndDate = moment().add(1, "months").startOf("month").format("YYYY-MM-DD");
        params.date_range = `${thisMonthStartDate},${thisMonthEndDate}`;
      }
    }

    axios
      .get(`${BACKEND_URL}/performance`, {
        params,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        const {
          data: { members_deal },
        } = result;
        setPerformanceChartData(members_deal);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  useEffect(() => {
    fetchPerformance();
  }, [selectedMonth]);

  // return (
  //   <span>
  //     {currentMode === "dark" ? (
  //       <Chart
  //         type="bar"
  //         data={{
  //           labels: performanceChartData.map((member) => member.userName),
  //           datasets: [
  //             {
  //               type: "line",
  //               label: "Closed deals",
  //               data: performanceChartData.map((member) => member.total_sales),
  //               fill: true,
  //               backgroundColor: "rgba(225,0,0,0.4)",
  //               borderColor: primaryColor,
  //             },
  //             {
  //               type: "line",
  //               label: "Meetings",
  //               data: performanceChartData.map(
  //                 (member) => member.total_meetings
  //               ),
  //               fill: false,
  //               backgroundColor: "rgba(0,0,0,0.2)",
  //               borderColor: "#ffffff",
  //             },
  //           ],
  //         }}
  //         options={{
  //           color: "#ffffff",
  //           backgroundColor: ["rgba(225,0,0,0.3)", "rgba(0,0,0,0.2)"],
  //           borderColor: [primaryColor, "#ffffff"],
  //           scales: {
  //             y: { ticks: { color: "#ffffff" }, grid: { color: "#424242" } },
  //             x: { ticks: { color: "#ffffff" }, grid: { color: "#424242" } },
  //           },
  //           responsive: true,
  //           aspectRatio: 4,
  //         }}
  //       />
  //     ) : (
  //       <Chart
  //         type="bar"
  //         data={{
  //           labels: performanceChartData.map((member) => member.userName),
  //           datasets: [
  //             {
  //               type: "line",
  //               label: "Closed deals",
  //               data: performanceChartData.map((member) => member.total_sales),
  //               fill: true,
  //               backgroundColor: "rgba(225,0,0,0.4)",
  //               borderColor: primaryColor,
  //             },
  //             {
  //               type: "line",
  //               label: "Meetings",
  //               data: performanceChartData.map(
  //                 (member) => member.total_meetings
  //               ),
  //               // borderWidth: 1,
  //               fill: false,
  //               backgroundColor: "rgba(0,0,0,0.2)",
  //               borderColor: "#020202",
  //             },
  //           ],
  //         }}
  //         options={{
  //           color: "#000000",
  //           backgroundColor: ["rgba(225,0,0,0.3)", "rgba(0,0,0,0.2)"],
  //           borderColor: [primaryColor, "#020202"],
  //           scales: {
  //             y: { ticks: { color: "#000000" } },
  //             x: { ticks: { color: "#000000" } },
  //           },
  //           responsive: true,
  //           aspectRatio: 4,
  //         }}
  //       />
  //     )}
  //   </span>
  // );

  const chartData = {
    options: {
      chart: {
        stacked: false,
        zoom: {
          enabled: false,
        },
      },
      colors:
        currentMode === "dark"
          ? [primaryColor, "#ffffff"]
          : [primaryColor, "#000000"],
      stroke: {
        width: [5, 1],
      },
      dataLabels: {
        enabled: false,
      },
      labels: performanceChartData.map((member) => member.userName),
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
          seriesName: "Closed deals",
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
            text: "Closed deals",
            style: {
              color: primaryColor,
            },
          },
        },
        {
          seriesName: "Meetings",
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
            text: "Meetings",
            style: {
              color: "#020202",
            },
          },
        },
      ],
    },
    series: [
      {
        name: "Closed deals",
        type: "line",
        data: performanceChartData.map((member) => member.total_sales),
      },
      {
        name: "Meetings",
        type: "column",
        data: performanceChartData.map((member) => member.total_meetings),
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

export default ReportMeetingsClosed;
