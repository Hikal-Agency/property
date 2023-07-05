import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { FaHandshake } from "react-icons/fa";
import { ImUser } from "react-icons/im";
import { MdLeaderboard, MdSupportAgent } from "react-icons/md";
import { AiOutlineFire } from "react-icons/ai";
import { GiThermometerCold } from "react-icons/gi";
import { FiUsers } from "react-icons/fi";
import CountUp from "react-countup";
import BarChart from "../../Components/charts/BarChart";
import SalesAmountChartAdmin from "../../Components/charts/SalesAmountChartAdmin";
import CombinationChart from "../../Components/charts/CombinationChart";
import DoughnutChart from "../../Components/charts/DoughnutChart";
import BarChartProject from "../../Components/charts/BarChartProject";
import BarChartProjectAdmin from "../../Components/charts/BarChartProjectAdmin";
import Task from "../../Components/Tasks/Task";
import { Link } from "react-router-dom";
import UpcomingMeeting from "../meetings/UpcomingMeeting";
import UpcomingMeetingAgent from "../meetings/UpcomingMeetingAgent";
// import axios from "axios";
import axios from "../../axoisConfig";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import Reminder from "../reminder/Reminder";

const DashboardPanel = ({ setloading }) => {
  const {
    DashboardData,
    currentMode,
    setopenBackDrop,
    User,
    Sales_chart_data,
    setSales_chart_data,
    BACKEND_URL,
  } = useStateContext();

  const [saleschart_loading, setsaleschart_loading] = useState(true);
  const [reminder, setReminder] = useState([]);
  const [visible, setVisible] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const urls = [`${BACKEND_URL}/memberdeals`];
      const responses = await Promise.all(
        urls.map((url) => {
          return axios.get(url, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          });
        })
      );
      setSales_chart_data(responses[0].data?.members_deal);
      setsaleschart_loading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // COUNTER DATA
  const HeadData = [
    {
      icon: <FaHandshake />,
      amount: DashboardData?.lead_status?.closed,
      title: "Closed deal",
      link: "/closedeals",
    },
    {
      icon: <ImUser />,
      amount: DashboardData?.isAdmin?.managers,
      title: "Sales managers ",
    },
    {
      icon: <MdSupportAgent />,
      amount: DashboardData?.isAdmin?.total_agents,
      percentage: "+38%",
      title: "Sales agents",
    },
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.newLeads,
      percentage: "-12%",
      title: "All New Leads",
      // link: "/freshleads/all",
    },
    {
      icon: <GiThermometerCold />,
      amount: DashboardData?.isAdmin?.verified_cold_leads,
      percentage: "-12%",
      title: "Verified cold leads",
      link: "/coldleads/coldLeadsVerified",
    },
    {
      icon: <FiUsers />,
      amount: DashboardData?.isAdmin?.personal_leads,
      percentage: "-12%",
      title: "Personal leads",
      link: "/personalleads/all",
    },
    {
      icon: <MdLeaderboard />,
      amount: DashboardData?.isAdmin?.thirdparty,
      percentage: "-12%",
      title: "Third party leads",
      link: "/thirdpartyleads/all",
    },
  ];

  const ManagerData = [
    {
      amount: DashboardData?.lead_status?.closed,
      title: "Closed deal",
      link: "/closedeals",
    },
    {
      amount: DashboardData?.lead_status?.meeting,
      title: "Meeting",
      link: "/meetings",
    },
    {
      amount: DashboardData?.lead_status?.followup,
      title: "Follow up",
      link: "/freshleads/follow up",
    },
    {
      amount: DashboardData?.lead_status?.new,
      title: "New lead",
      // link: "/freshleads/all",
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
      link: "/freshleads/follow up",
    },
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.lead_status?.new,
      title: "New lead",
      // link: "/freshleads/new",
    },
  ];

  function formatNumber(number) {
    if (number >= 1000000) {
      const formattedNumber = (number / 1000000).toFixed(2);
      return formattedNumber.replace(".00", "") + "M";
    } else if (number >= 1000) {
      const formattedNumber = (number / 1000).toFixed(2);
      return formattedNumber.replace(".00", "") + "K";
    } else {
      return number.toString();
    }
  }
  return (
    <div className="mt-5 md:mt-2">
      <ToastContainer />
      <h1
        className={`font-semibold ${
          currentMode === "dark" ? "text-white" : "text-red-600"
        } text-xl ml-2 mb-3`}
      >
        Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3">
        <motion.div
          transition={{ duration: 0.6 }}
          initial={{ y: -120 }}
          animate={{ y: [20, 30, 0] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-3 text-center"
        >
          {/* {DashboardData?.designation === "Head" && ( */}
          <Link
            to={"/freshleads/all"}
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
                  <CountUp end={DashboardData?.lead_status?.hot} duration={3} />
                </p>
              )}
              {User?.role === 7 && (
                <p className="text-2xl font-bold pb-3 text-red-600">
                  <CountUp end={DashboardData?.lead_status?.hot} duration={3} />
                </p>
              )}
              {(User?.role === 1 || User?.role === 2) && (
                <p className="text-2xl font-bold pb-3 text-red-600">
                  <CountUp end={DashboardData?.lead_status?.hot} duration={3} />
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
                // <div
                //   key={index}
                //   className={`${
                //     currentMode === "dark"
                //       ? "bg-gray-900 text-white "
                //       : "bg-gray-200 text-main-dark-bg"
                //   }  h-auto dark:bg-secondary-dark-bg w-full p-5 rounded-md cursor-pointer hover:shadow-sm grid content-center`}
                // >
                //   <p className="text-2xl font-bold pb-3 text-red-600">
                //     {item.amount}
                //   </p>
                //   <p
                //     className={`text-sm ${
                //       currentMode === "dark"
                //         ? "text-white"
                //         : "text-main-dark-bg-2 font-semibold"
                //     }   `}
                //   >
                //     {item?.title}
                //   </p>
                // </div>
                <Link
                  key={index}
                  to={item?.link}
                  className={`${
                    currentMode === "dark"
                      ? "bg-gray-900 text-white "
                      : "bg-gray-200 text-main-dark-bg"
                  } h-auto dark:bg-secondary-dark-bg w-full p-5 rounded-md cursor-pointer hover:shadow-sm grid content-center`}
                >
                  <p className="text-2xl font-bold pb-3 text-red-600">
                    <CountUp end={item.amount} duration={3} />
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
                </Link>
              );
            })
          ) : DashboardData?.designation === "Manager" ? (
            <>
              {ManagerData.map((item, index) => {
                return (
                  <Link
                    to={item?.link}
                    key={index}
                    className={`${
                      currentMode === "dark"
                        ? "bg-gray-900 text-white "
                        : "bg-gray-200 text-main-dark-bg"
                    } h-auto dark:bg-secondary-dark-bg w-full p-5 rounded-md cursor-pointer hover:shadow-sm grid content-center`}
                    onClick={() => setopenBackDrop(true)}
                  >
                    <div>
                      <p className="text-2xl font-bold pb-3 text-red-600">
                        <CountUp end={item.amount} duration={3} />
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
                        <CountUp end={item.amount} duration={3} />
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
        </motion.div>

        {/* CHART  */}
        <>
          {DashboardData?.designation === "Head" ? (
            <>
              <motion.div
                initial={{ x: 120 }}
                transition={{ duration: 0.7 }}
                animate={{ x: [-20, 30, 0] }}
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white "
                    : "bg-gray-200"
                } h-full rounded-md p-5 cursor-pointer w-full`}
              >
                <div className="justify-between items-center w-full">
                  <h6 className="font-semibold">Performance</h6>
                  <CombinationChart />
                </div>
              </motion.div>
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
                <SalesAmountChartAdmin />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3"></div>
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
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-70px" }}
          className={`
           bg-red-600 h-auto w-full justify-between items-center rounded-md px-10 py-7 text-center`}
        >
          <div>
            <p className={`text-sm font-semibold text-white `}>
              Deal drawn in the month
            </p>
            <p className={`text-4xl font-bold mt-2 text-white`}>
              AED {formatNumber(Number(DashboardData?.target_reached))}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-70px" }}
          className={`bg-red-600 h-auto w-full justify-between items-center rounded-md px-10 py-7 text-center`}
        >
          <div>
            <p className={`text-sm font-semibold text-white`}>
              All time revenue
            </p>
            <p className={`text-4xl font-bold mt-2 text-white`}>
              AED {formatNumber(Number(DashboardData?.total_closed))}
            </p>
          </div>
        </motion.div>
      </div>
      {/* 3RD ROW END [REVENUE, TOTAL SALES] */}

      {/* 4TH ROW [UPCOMING MEETING] */}
      <div className="grid grid-cols-1 pb-3">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-70px" }}
          className={`${
            currentMode === "dark" ? "bg-gray-900 text-white " : "bg-gray-200"
          } col-span-1 h-fit rounded-md p-5 cursor-pointer hover:shadow-sm`}
        >
          {/* {console.log("User is")}
          {console.log(User)} */}
          <h4
            className="font-semibold pb-5"
            style={{ textTransform: "capitalize" }}
          >
            Upcoming meetings
          </h4>
          {User?.role === 1 || User?.role === 2 ? (
            <UpcomingMeeting
              upcoming_meetings={DashboardData?.upcoming_meetings}
            />
          ) : null}
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
        </motion.div>
      </div>
      {/* 4TH ROW END [UPCOMING MEETING] */}

      {/* 5TH ROW [REMINDER] */}

      {visible === true && (
        <div className="grid grid-cols-1 pb-3">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-70px" }}
            className={`${
              currentMode === "dark" ? "bg-gray-900 text-white " : "bg-gray-200"
            } col-span-1 h-fit rounded-md p-5  hover:shadow-sm`}
          >
            {/* <h4
            className="font-semibold pb-5"
            style={{ textTransform: "capitalize" }}
          >
            Reminders
          </h4> */}

            <Reminder
              reminder={reminder}
              setReminder={setReminder}
              visible={visible}
              setVisible={setVisible}
            />
          </motion.div>
        </div>
      )}

      {/* 5TH ROW END [REMINDER] */}

      {/* 5TH ROW [TODO + SHORTCUTS] */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ margin: "-70px" }}
        className="grid grid-cols-1 pb-3"
      >
        <Task />
      </motion.div>
      {/* 5TH ROW END [TODO + SHORTCUTS] */}
    </div>
  );
};

export default DashboardPanel;
