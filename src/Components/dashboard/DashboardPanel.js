import React from "react";

import { useStateContext } from "../../context/ContextProvider";
import { FaHandshake } from "react-icons/fa";
import { ImUser } from "react-icons/im";
import { MdLeaderboard, MdSupportAgent } from "react-icons/md";
import { AiOutlineFire } from "react-icons/ai";
import { GiThermometerCold } from "react-icons/gi";
import { FiUsers } from "react-icons/fi";
import BarChart from "../../Components/charts/BarChart";
import CombinationChart from "../../Components/charts/CombinationChart";
import DoughnutChart from "../../Components/charts/DoughnutChart";
import BubbleChart from "../../Components/charts/BubbleChart";
import Task from "../../Components/Tasks/Task";
import { Link } from "react-router-dom";
import UpcomingMeeting from "../meetings/UpcomingMeeting";
import UpcomingMeetingAgent from "../meetings/UpcomingMeetingAgent";

const DashboardPanel = () => {
  const { DashboardData, currentMode, setopenBackDrop, User } =
    useStateContext();

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
      amount: DashboardData?.thirdparty_leads,
      percentage: "-12%",
      title: "Third party leads",
    },
  ];

  const ManagerData = [
    {
      icon: <FaHandshake />,
      amount: DashboardData?.lead_status?.closed,
      title: "Closed deal",
    },
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.meeting,
      percentage: "-12%",
      title: "Hot leads",
    },
    {
      icon: <GiThermometerCold />,
      amount: DashboardData?.followup,
      percentage: "-12%",
      title: "Verified cold leads",
    },
    {
      icon: <FiUsers />,
      amount: DashboardData?.new,
      title: "Personal leads",
    },
    {
      icon: <ImUser />,
      amount: DashboardData?.agents,
      title: "Sales agents",
      iconColor: "rgb(228, 106, 118)",
      iconBg: "rgb(255, 244, 229)",
      pcColor: "green-600",
    },
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
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.lead_status?.noanswer,
      title: "No Answer",
      link: "/hotleads/no answer",
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-3 text-center">
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
                  {DashboardData?.lead_status?.new +
                    DashboardData?.lead_status?.meeting +
                    DashboardData?.lead_status?.followup +
                    DashboardData?.lead_status?.noanswer +
                    DashboardData?.lead_status?.closed +
                    DashboardData?.lead_status?.unreachable +
                    DashboardData?.lead_status?.low +
                    DashboardData?.lead_status?.notinterested}
                </p>
              )}
              {User?.role === 7 && (
                <p className="text-2xl font-bold pb-3 text-red-600">
                  {DashboardData?.lead_status?.new +
                    DashboardData?.lead_status?.meeting +
                    DashboardData?.lead_status?.followup +
                    DashboardData?.lead_status?.closed}
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
                    <BubbleChart
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-3 pb-3">
            <div
              className={`${
                currentMode === "dark"
                  ? "bg-gray-900 text-white "
                  : "bg-gray-200"
              } col-span-1 h-full w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold pb-3">Monthly Sales</h6>
                <BarChart />
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
                  target={DashboardData?.target}
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
                <BubbleChart total_projects={DashboardData?.total_projects} />
              </div>
            </div>
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
                <h6 className="font-semibold pb-3">Monthly Sales</h6>
                <BarChart />
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
                <BubbleChart total_projects={DashboardData?.total_projects} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {/* 2ND ROW END [CHARTS FOR ADMIN ONLY] */}

      {/* 3RD ROW [REVENUE, TOTAL SALES] */}
      <div className="grid grid-cols-2 gap-3 pb-3">
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
              Deal drawn in [Current Month]
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
          <h4 className="font-semibold pb-5">Upcoming meetings</h4>
          {DashboardData?.designation === "Head" ? (
            <UpcomingMeeting
              upcoming_meetings={DashboardData?.upcoming_meetings}
            />
          ) : DashboardData?.designation === "Manager" ? (
            <UpcomingMeeting
              upcoming_meetings={DashboardData?.upcoming_meetings}
            />
          ) : (
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
        <Task call_logs={DashboardData?.call_logs} />
      </div>
      {/* 5TH ROW END [TODO + SHORTCUTS] */}
    </div>
  );
};

export default DashboardPanel;
