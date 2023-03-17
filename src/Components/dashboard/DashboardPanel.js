import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { FaHandshake } from "react-icons/fa";
import { ImUser } from "react-icons/im";
import { MdLeaderboard, MdSupportAgent } from "react-icons/md";
import { AiOutlineFire } from "react-icons/ai";
import { GiThermometerCold } from "react-icons/gi";
import { FiUsers } from "react-icons/fi";
import BarChart from "../../Components/charts/BarChart";
import SalesAmountChartAdmin from "../../Components/charts/SalesAmountChartAdmin";
import CombinationChart from "../../Components/charts/CombinationChart";
import DoughnutChart from "../../Components/charts/DoughnutChart";
import BarChartProject from "../../Components/charts/BarChartProject";
import BarChartProjectAdmin from "../../Components/charts/BarChartProjectAdmin";
import Task from "../../Components/Tasks/Task";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UpcomingMeeting from "../meetings/UpcomingMeeting";
import UpcomingMeetingAgent from "../meetings/UpcomingMeetingAgent";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const DashboardPanel = () => {
  const {
    DashboardData,
    currentMode,
    setopenBackDrop,
    User,
    Sales_chart_data,
    setSales_chart_data,
    BACKEND_URL,
    setDashboardData,
  } = useStateContext();

  const [saleschart_loading, setsaleschart_loading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

   const FetchProfile = async (token) => {
    await axios
      .get(`${BACKEND_URL}/dashboard?page=1`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setDashboardData(result.data);
      })
      .catch((err) => {
        // console.log(err);
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
        });
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    axios
      .get(`${BACKEND_URL}/memberdeals`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("sales chart data is");
        console.log(result?.data?.members_deal);
        setSales_chart_data(result?.data?.members_deal);
        setsaleschart_loading(false);
      })
      .catch((err) => {
        console.log(err);
      });

      FetchProfile(token);
    //eslint-disable-next-line
  }, []);

  // COUNTER DATA
  const HeadData = [
    {
      icon: <FaHandshake />,
      amount: DashboardData?.lead_status?.closed,
      title: "Closed deal",
    },
    {
      icon: <ImUser />,
      amount: DashboardData?.isAdmin?.managers,
      title: "Sales managers",
    },
    {
      icon: <MdSupportAgent />,
      amount: DashboardData?.isAdmin?.total_agents,
      percentage: "+38%",
      title: "Sales agents",
    },
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.isAdmin?.hot_leads,
      percentage: "-12%",
      title: "Hot leads",
    },
    {
      icon: <GiThermometerCold />,
      amount: DashboardData?.isAdmin?.verified_cold_leads,
      percentage: "-12%",
      title: "Verified cold leads",
    },
    {
      icon: <FiUsers />,
      amount: DashboardData?.isAdmin?.personal_leads,
      percentage: "-12%",
      title: "Personal leads",
    },
    {
      icon: <MdLeaderboard />,
      amount: DashboardData?.isAdmin?.thirdparty,
      percentage: "-12%",
      title: "Third party leads",
    },
  ];

  const ManagerData = [
    {
      amount: DashboardData?.lead_status?.closed,
      title: "Closed deal",
    },
    {
      amount: DashboardData?.lead_status?.meeting,
      title: "Meeting",
    },
    {
      amount: DashboardData?.lead_status?.followup,
      title: "Follow up",
    },
    {
      amount: DashboardData?.lead_status?.new,
      title: "New lead",
    },
    {
      amount: DashboardData?.isAdmin?.total_agents,
      title: "Sales agent",
    },
    // {
    //   amount: 20,
    //   title: "Potential lead",
    // },
  ];

  const AgentData = [
    {
      icon: <FaHandshake />,
      amount: DashboardData?.lead_status?.closed,
      title: "Closed deal",
      link: "/closedeals",
    },
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.lead_status?.meeting,
      title: "Meeting",
      link: "/meetings",
    },
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.lead_status?.followup,
      percentage: "-12%",
      title: "Follow up",
      link: "/hotleads/follow up",
    },
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.lead_status?.new,
      title: "New lead",
      link: "/hotleads/new",
    },
  ];

  return (
    <div className="mt-5 md:mt-2">
      <h1
        className={`font-semibold ${
          currentMode === "dark" ? "text-white" : "text-red-600"
        } text-xl ml-2 mb-3`}
      >
        Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-3 text-center">
          {/* {DashboardData?.designation === "Head" && ( */}
          <Link
            to={"/hotleads/all"}
            className={`${
              currentMode === "dark"
                ? "bg-gray-900 text-white "
                : "bg-gray-200 text-main-dark-bg"
            }  h-auto dark:bg-secondary-dark-bg w-full p-5 rounded-md cursor-pointer hover:shadow-sm grid content-center`}
            onClick={() => setopenBackDrop(true)}
          >
            <div>
              {User?.role === 3 && (
                <p className="text-2xl font-bold pb-3 text-red-600">
                  {DashboardData?.lead_status?.hot}
                </p>
              )}
              {User?.role === 7 && (
                <p className="text-2xl font-bold pb-3 text-red-600">
                  {DashboardData?.lead_status?.hot}
                </p>
              )}
              {User?.role === 1 && (
                <p className="text-2xl font-bold pb-3 text-red-600">
                  {DashboardData?.lead_status?.hot}
                </p>
              )}
              <p
                className={`text-sm ${
                  currentMode === "dark"
                    ? "text-white"
                    : "text-main-dark-bg-2 font-semibold"
                }   `}
              >
                Fresh leads
              </p>
            </div>
          </Link>
          {/* )} */}

          {DashboardData?.designation === "Head" ? (
            HeadData.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    currentMode === "dark"
                      ? "bg-gray-900 text-white "
                      : "bg-gray-200 text-main-dark-bg"
                  }  h-auto dark:bg-secondary-dark-bg w-full p-5 rounded-md cursor-pointer hover:shadow-sm grid content-center`}
                >
                  <p className="text-2xl font-bold pb-3 text-red-600">
                    {item.amount}
                  </p>
                  <p
                    className={`text-sm ${
                      currentMode === "dark"
                        ? "text-white"
                        : "text-main-dark-bg-2 font-semibold"
                    }   `}
                  >
                    {item?.title}
                  </p>
                </div>
              );
            })
          ) : DashboardData?.designation === "Manager" ? (
            <>
              {ManagerData.map((item, index) => {
                return (
                  <div
                    to={item.link}
                    key={index}
                    className={`${
                      currentMode === "dark"
                        ? "bg-gray-900 text-white "
                        : "bg-gray-200 text-main-dark-bg"
                    }  h-auto dark:bg-secondary-dark-bg w-full p-5 rounded-md cursor-pointer hover:shadow-sm grid content-center`}
                    onClick={() => setopenBackDrop(true)}
                  >
                    <div>
                      <p className="text-2xl font-bold pb-3 text-red-600">
                        {item.amount}
                      </p>
                      <p
                        className={`text-sm ${
                          currentMode === "dark"
                            ? "text-white"
                            : "text-main-dark-bg-2 font-semibold"
                        }`}
                      >
                        {item?.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {AgentData.map((item, index) => {
                return (
                  <Link
                    to={item.link}
                    key={index}
                    className={`${
                      currentMode === "dark"
                        ? "bg-gray-900 text-white "
                        : "bg-gray-200 text-main-dark-bg"
                    }  h-auto dark:bg-secondary-dark-bg w-full p-5 rounded-md cursor-pointer hover:shadow-sm grid content-center`}
                    onClick={() => setopenBackDrop(true)}
                  >
                    <div>
                      <p className="text-2xl font-bold pb-3 text-red-600">
                        {item.amount}
                      </p>
                      <p
                        className={`text-sm ${
                          currentMode === "dark"
                            ? "text-white"
                            : "text-main-dark-bg-2 font-semibold"
                        }`}
                      >
                        {item?.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </div>

        {/* CHART  */}
        <>
          {DashboardData?.designation === "Head" ? (
            <>
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white "
                    : "bg-gray-200"
                } h-full w-full rounded-md p-5 cursor-pointer`}
              >
                <div className="justify-between items-center">
                  <h6 className="font-semibold">Performance</h6>
                  <CombinationChart />
                </div>
              </div>
            </>
          ) : DashboardData?.designation === "Manager" ? (
            <>
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white "
                    : "bg-gray-200"
                } h-full w-full rounded-md p-5 cursor-pointer`}
              >
                <div className="justify-between items-center">
                  <h6 className="font-semibold">Performance</h6>
                  <CombinationChart />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3">
                <div
                  className={`${
                    currentMode === "dark"
                      ? "bg-gray-900 text-white "
                      : "bg-gray-200"
                  } h-full w-full rounded-md p-5 cursor-pointer`}
                >
                  <div className="justify-between items-center">
                    <h6 className="font-semibold">Target</h6>
                    <DoughnutChart
                      target_reached={DashboardData?.target_reached}
                      target_remaining={DashboardData?.target_remaining}
                    />
                  </div>
                </div>
                <div
                  className={`${
                    currentMode === "dark"
                      ? "bg-gray-900 text-white "
                      : "bg-gray-200"
                  } h-full w-full rounded-md p-5 cursor-pointer`}
                >
                  <div className="justify-between items-center">
                    <h6 className="font-semibold">Project</h6>
                    <BarChartProject
                      total_projects={DashboardData?.total_projects}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      </div>

      {/* 2ND ROW [CHARTS FOR ADMIN ONLY] */}
      {DashboardData?.designation === "Head" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3">
            <div
              className={`${
                currentMode === "dark"
                  ? "bg-gray-900 text-white "
                  : "bg-gray-200"
              } col-span-1 h-full w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold pb-3">Sales</h6>
                <SalesAmountChartAdmin/>
              </div>
            </div>

            <div
              className={`${
                currentMode === "dark"
                  ? "bg-gray-900 text-white "
                  : "bg-gray-200"
              } col-span-1 h-full w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold pb-3">Closed Projects</h6>
                <BarChartProjectAdmin
                  total_projects={DashboardData?.total_projects}
                />
              </div>
            </div>
          </div>
          {/* MANAGER TAGET PROGRESS BAR  */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3">

          </div>
        </>
      ) : DashboardData?.designation === "Manager" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-3 pb-3">
            <div
              className={`${
                currentMode === "dark"
                  ? "bg-gray-900 text-white "
                  : "bg-gray-200"
              } col-span-1 h-full w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold pb-3">Sales</h6>
                {saleschart_loading ? (
                  <div className="flex items-center space-x-2">
                    <CircularProgress size={20} /> <span>Loading</span>
                  </div>
                ) : (
                  <BarChart Sales_chart_data={Sales_chart_data} />
                )}
              </div>
            </div>
            <div
              className={`${
                currentMode === "dark"
                  ? "bg-gray-900 text-white "
                  : "bg-gray-200"
              } col-span-1 h-full w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold pb-3">Monthly Target</h6>
                <DoughnutChart
                  target={DashboardData?.user?.target}
                  target_reached={DashboardData?.target_reached}
                  target_remaining={DashboardData?.target_remaining}
                />
              </div>
            </div>

            <div
              className={`${
                currentMode === "dark"
                  ? "bg-gray-900 text-white "
                  : "bg-gray-200"
              } col-span-1 h-full w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold pb-3">Project Chart</h6>
                <BarChartProject
                  total_projects={DashboardData?.total_projects}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {/* 2ND ROW END [CHARTS FOR ADMIN ONLY] */}

      {/* 3RD ROW [REVENUE, TOTAL SALES] */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 pb-3">
        <div
          className={`${
            currentMode === "dark" ? "bg-red-600" : "bg-gray-200"
          } h-auto w-full justify-between items-center rounded-md px-10 py-7 text-center`}
        >
          <div>
            <p
              className={`text-sm font-semibold ${
                currentMode === "dark" ? "text-white" : "text-gray-900"
              } `}
            >
              Deal drawn in the month
            </p>
            <p
              className={`text-4xl font-bold mt-2 ${
                currentMode === "dark" ? "text-white" : "text-red-600"
              } `}
            >
              AED {DashboardData?.target_reached}
            </p>
          </div>
        </div>

        <div
          className={`${
            currentMode === "dark" ? "bg-red-600" : "bg-gray-200"
          } h-auto w-full justify-between items-center rounded-md px-10 py-7 text-center`}
        >
          <div>
            <p
              className={`text-sm font-semibold ${
                currentMode === "dark" ? "text-white" : "text-gray-900"
              } `}
            >
              All time revenue
            </p>
            <p
              className={`text-4xl font-bold mt-2 ${
                currentMode === "dark" ? "text-white" : "text-red-600"
              } `}
            >
              AED {DashboardData?.total_closed}
            </p>
          </div>
        </div>
      </div>
      {/* 3RD ROW END [REVENUE, TOTAL SALES] */}

      {/* 4TH ROW [UPCOMING MEETING] */}
      <div className="grid grid-cols-1 pb-3">
        <div
          className={`${
            currentMode === "dark" ? "bg-gray-900 text-white " : "bg-gray-200"
          } col-span-1 h-fit rounded-md p-5 cursor-pointer hover:shadow-sm`}
        >
          {/* {console.log("User is")}
          {console.log(User)} */}
          <h4 className="font-semibold pb-5">Upcoming meetings</h4>
          {User?.role === 1 && (
            <UpcomingMeeting
              upcoming_meetings={DashboardData?.upcoming_meetings}
            />
          )}
          {User?.role === 3 && (
            <UpcomingMeeting
              upcoming_meetings={DashboardData?.upcoming_meetings}
            />
          )}
          {User?.role === 7 && (
            <UpcomingMeetingAgent
              upcoming_meetings={DashboardData?.upcoming_meetings}
            />
          )}
          {/* <UserLocation /> */}
        </div>
      </div>
      {/* 4TH ROW END [UPCOMING MEETING] */}

      {/* 5TH ROW [TODO + SHORTCUTS] */}
      <div className="grid grid-cols-1 pb-3">
        <Task/>
      </div>
      {/* 5TH ROW END [TODO + SHORTCUTS] */}
    </div>
  );
};

export default DashboardPanel;
