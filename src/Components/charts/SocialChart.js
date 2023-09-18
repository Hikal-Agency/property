import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { RiMessage2Line } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { FaSnapchat } from "react-icons/fa";
import { BsPersonCircle, BsSnow2 } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GiMagnifyingGlass } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";
import { useStateContext } from "../../context/ContextProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SocialChart({ data, selectedMonthSocial }) {
  const labels = data?.map((elem) => elem?.leadSource);
  console.log("social chart : ", data);
  const { currentMode } = useStateContext();

  const sourceIcons = {
    "campaign snapchat": () => <FaSnapchat size={22} color={"#f6d80a"} />,
    "bulk import": () => <FaSnapchat size={22} color={"#f6d80a"} />,
    "campaign facebook": () => <FaFacebook size={22} color={"#0e82e1"} />,
    "campaign tiktok": () => (
      <img
        src={"/assets/tiktok-app.svg"}
        alt=""
        style={{ margin: "0 auto" }}
        height={18}
        width={18}
        className="object-cover"
      />
    ),
    "campaign googleads": () => <FcGoogle size={22} />,
    campaign: () => <FcGoogle size={22} />,
    cold: () => <BsSnow2 size={22} color={"#0ec7ff"} />,
    personal: () => <BsPersonCircle size={22} color={"#14539a"} />,
    whatsapp: () => <FaWhatsapp size={22} color={"#29EC62"} />,
    message: () => <RiMessage2Line size={22} color={"#14539a"} />,
    comment: () => <FaComment size={22} color={"#14539a"} />,
    website: () => <FaGlobe size={22} color={"#14539a"} />,
    "property finder": () => <GiMagnifyingGlass size={22} color={"#14539a"} />,
    "propety finder": () => <GiMagnifyingGlass size={22} color={"#14539a"} />,
    self: () => <FaUser size={22} color={"#14539a"} />,
    "campaign youtube": () => <FaYoutube size={22} color={"#FF0000"} />,
    "campaign twitter": () => <FaTwitter size={22} color={"#14539a"} />,
  };

  // const options = {
  //   plugins: {
  //     title: {
  //       display: true,
  //       text: "Social Campaigns",
  //     },
  //   },
  //   responsive: true,
  //   interaction: {
  //     mode: "index",
  //     intersect: false,
  //   },
  //   scales: {
  //     x: {
  //       stacked: true,
  //     },
  //     y: {
  //       stacked: true,
  //     },
  //   },
  // };

  // const graphData = {
  //   labels,
  //   datasets: [
  //     {
  //       label: "All",
  //       data: data?.map((elem) => elem?.total),
  //       backgroundColor: ["rgba(218, 31, 38, 1)"],
  //     },
  //   ],
  // };

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
          colors: currentMode === "dark" ? ["#ffffff"] : ["#304758"], // Set text color based on the current mode
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
          // columnWidth: "50%",
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
    },
    series: [
      {
        name: "All",
        data: data?.map((elem) => elem?.total),
        color: "rgba(218, 31, 38, 1)",
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
