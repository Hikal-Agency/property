import { Button } from "@material-tailwind/react";
import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import { GeneralInfo as GeneralInfoTab } from "../../Components/profile/GeneralInfo.jsx";
import { PersonalInfo as PersonalInfoTab } from "../../Components/profile/PersonalInfo";
import { ChangePassword as ChangePasswordTab } from "../../Components/profile/ChangePassword";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReportProjectBar from "../../Components/charts/ReportProjectBar";
import ReportMeetingsClosed from "../../Components/charts/ReportMeetingsClosed";
import DoughnutChart from "../../Components/charts/DoughnutChart";
import SalesAmountChartAdmin from "../../Components/charts/SalesAmountChartAdmin";
import ReportClosedMeetingDoughnut from "../../Components/charts/ReportClosedMeetingDoughnut";

const Reports = () => {
  const [loading, setloading] = useState(true);
  const {
    User,
    setUser,
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
    DashboardData,
    Sales_chart_data,
  } = useStateContext();

  return (
    <>
    {/* <ToastContainer/> */}
      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="flex">
            <Sidebarmui />
            <div className={`w-full `}>
              <div className="px-5">
                <Navbar />
                <div className="my-5 mb-10">
                  <div className="grid grid-cols-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3">
                    
                    <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} rounded-md p-2`}>
                      <h6 className="mb-2 p-2">
                        <span className="font-semibold">Sales</span>
                        <span className="float-right">
                          <select 
                            className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} text-xs rounded-md p-1`}>
                            <option value="alltime">All-Time</option>
                            <option value="lastmonth">Last Month</option>
                            <option value="thismonth">This Month</option>
                          </select>
                        </span>
                      </h6>
                      <div className="justify-between items-center">
                        <SalesAmountChartAdmin Sales_chart_data={Sales_chart_data} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} rounded-md p-2`}>
                        <div className="justify-between items-center">
                          <h6 className="mb-2 p-2">
                            <span className="font-semibold">Target</span>
                          </h6>
                          <DoughnutChart
                            target={DashboardData?.user?.target}
                            target_reached={DashboardData?.target_reached}
                            target_remaining={DashboardData?.target_remaining}
                          />
                        </div>
                      </div>
                      <div className={`${currentMode === "dark" ? "text-white" : "text-black"} rounded-md p-2`}>
                        <div className="justify-between items-center mb-3">
                          <ReportClosedMeetingDoughnut />
                        </div>
                        <h6 className="text-xs text-center mt-3 italic">Number of total deals closed in comparison to attended meetings.</h6>
                      </div>
                    </div>
                    <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} col-span-2 rounded-md p-2`}>
                      <h6 className="mb-2 p-2">
                        <span className="font-semibold">Performance</span>
                        <span className="float-right">
                          <select 
                            className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} text-xs rounded-md p-1`}>
                            <option value="alltime">All-Time</option>
                            <option value="lastmonth">Last Month</option>
                            <option value="thismonth">This Month</option>
                          </select>
                        </span>
                      </h6>
                      <div className="justify-between items-center">
                        <ReportMeetingsClosed />
                      </div>
                    </div>

                    <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} rounded-md p-3`}>
                      <h6 className="mb-2 p-2">
                        <span className="font-semibold">Project</span>
                        <span className="float-right">
                          <select 
                            className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} text-xs rounded-md p-1`}>
                            <option value="alltime">All-Time</option>
                            <option value="lastmonth">Last Month</option>
                            <option value="thismonth">This Month</option>
                          </select>
                        </span>
                      </h6>
                      <div className="justify-between items-center">
                        <ReportProjectBar
                          total_projects={DashboardData?.total_projects}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Reports;
