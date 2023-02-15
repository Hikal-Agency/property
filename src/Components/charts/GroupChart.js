import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useStateContext } from "../../context/ContextProvider";

const GroupChart = () => {
  const [weeklydata, setweeklydata] = useState([]);
  // useEffect(() => {
  //   axios.get("http://staging.hikalcrm.com/api/callLogs/?period=daily").then((result)=>{
  //     setweeklydata(result.data?.)
  //   })
  // }, [])

  const { currentMode } = useStateContext();
  const data = {
    labels: [
      "Outgoing",
      "Answered",
      "Not answered",
      "Incoming calls",
      "Recieved",
      "Missed",
    ],
    datasets: [
      {
        label: "Weekly Report",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: "Monthly Report",
        backgroundColor: "rgba(155,231,91,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [45, 79, 10, 41, 16, 85, 20],
      },
    ],
  };
  const options = {
    responsive: true,
    legend: {
      display: false,
    },
    type: "bar",
  };
  return (
    <div>
      <Bar data={data} width={null} height={null} options={options} />
    </div>
  );
};

export default GroupChart;
