import React, { useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ReactApexChart from "react-apexcharts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SocialChart({ data, selectedMonthSocial }) {
  const {primaryColor} = useStateContext();
  const labels = data?.map((elem) => elem?.leadSource);
  console.log("social chart : ", data);
  const { currentMode } = useStateContext();

  // const formatted_data = ;

  const chartData = {
    options: {
      chart: {
        type: "bar", // Use "bar" type for column chart
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: currentMode === "dark" ? ["#ffffff"] : [primaryColor], // Set text color based on the current mode
        },
      },
      xaxis: {
        categories: labels,
      },
      yaxis: {
        title: {
          // text: "Total",
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
    },
    series: [
      {
        name: "All",
        // data: data?.map((elem) => elem?.total),
        data: data?.map(elem => ({
          x: elem?.leadSource,
          y: elem.total,
          fillColor: primaryColor,
        })),
      },
    ],
  };

  useEffect(() => {
    //re-render
  }, [selectedMonthSocial]);

  // return <Bar options={options} data={graphData} />;

  return (
    <div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={400}
      />
    </div>
  );
}

export default SocialChart;
