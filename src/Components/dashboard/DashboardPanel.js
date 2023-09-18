import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { CircularProgress } from "@mui/material";

import { useStateContext } from "../../context/ContextProvider";
import BarChart from "../../Components/charts/BarChart";
import SalesAmountChartAdmin from "../../Components/charts/SalesAmountChartAdmin";
import CombinationChart from "../../Components/charts/CombinationChart";
import DoughnutChart from "../../Components/charts/DoughnutChart";
import BarChartProject from "../../Components/charts/BarChartProject";
import BarChartProjectAdmin from "../../Components/charts/BarChartProjectAdmin";
import Task from "../../Components/Tasks/Task";
import UpcomingMeeting from "../meetings/UpcomingMeeting";
import axios from "../../axoisConfig";
import Reminder from "../reminder/Reminder";
import usePermission from "../../utils/usePermission";

import { FaHandshake } from "react-icons/fa";
import { ImUser } from "react-icons/im";
import { MdLeaderboard, MdSupportAgent } from "react-icons/md";
import { AiOutlineFire } from "react-icons/ai";
import { GiThermometerCold } from "react-icons/gi";
import { FiUsers } from "react-icons/fi";
import "../../styles/animation.css";

const DashboardPanel = ({ setloading }) => {
  const {
    DashboardData,
    currentMode,
    setopenBackDrop,
    User,
    Sales_chart_data,
    setSales_chart_data,
    BACKEND_URL,
    primaryColor,
    withOpacity
  } = useStateContext();

  const [saleschart_loading, setsaleschart_loading] = useState(true);
  const [reminder, setReminder] = useState([]);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

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
      <h1
        style={{
          color: currentMode === "dark" ? "white" : primaryColor,
        }}
        className={`font-semibold text-lg ml-2 mb-5 mt-8`}
      >
        OVERVIEW
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-2">
        <motion.div
          transition={{ duration: 0.6 }}
          initial={{ y: -120 }}
          animate={{ y: [20, 30, 0] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-3 text-center"
        >
          {/* {DashboardData?.designation === "Head" && ( */}
          <Link
            to={"/freshleads/all"}
            className={`card-hover backdrop-blur ${
              currentMode === "dark"
                ? "bg-[#1c1c1c] text-white "
                : "bg-[#d8d8d845] text-main-dark-bg"
            }  h-auto w-full p-5 rounded-xl cursor-pointer grid content-center`}
            onClick={() => setopenBackDrop(true)}
          >
            <div>
              {User?.role === 3 && (
                <p
                  className={`text-2xl font-bold pb-3`}
                  style={{
                    color: primaryColor,
                  }}
                >
                  <CountUp end={DashboardData?.lead_status?.hot} duration={3} />
                </p>
              )}
              {User?.role === 7 && (
                <p
                  className={`text-2xl font-bold pb-3`}
                  style={{
                    color: primaryColor,
                  }}
                >
                  <CountUp end={DashboardData?.lead_status?.hot} duration={3} />
                </p>
              )}
              {(User?.role === 1 || User?.role === 2 || User?.role === 8) && (
                <p
                  className={`text-2xl font-bold pb-3`}
                  style={{
                    color: primaryColor,
                  }}
                >
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

          {User?.role === 1 || User?.role === 2 || User?.role === 8 ? (
            HeadData.map((item, index) => {
              return (
                <Link
                  key={index}
                  to={item?.link}
                  className={`card-hover backdrop-blur ${
                    currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white "
                      : "bg-[#d8d8d845] text-main-dark-bg"
                  } h-auto w-full p-5 rounded-xl grid content-center`}
                >
                  <p
                    className={`text-2xl font-bold pb-3`}
                    style={{
                      color: primaryColor,
                    }}
                  >
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
          ) : User?.role === 3 ? (
            <>
              {ManagerData.map((item, index) => {
                return (
                  <Link
                    to={item?.link}
                    key={index}
                    className={`card-hover backdrop-blur ${
                      currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white "
                        : "bg-[#d8d8d845] text-main-dark-bg"
                    } h-auto w-full p-5 rounded-xl cursor-pointer grid content-center`}
                    onClick={() => setopenBackDrop(true)}
                  >
                    <div>
                      <p
                        className={`text-2xl font-bold pb-3`}
                        style={{
                          color: primaryColor,
                        }}
                      >
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
                    className={`card-hover backdrop-blur ${
                      currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white "
                        : "bg-[#d8d8d845] text-main-dark-bg"
                    }  h-auto w-full p-5 rounded-xl cursor-pointer grid content-center`}
                    onClick={() => setopenBackDrop(true)}
                  >
                    <div>
                      <p
                        className={`text-2xl font-bold pb-3`}
                        style={{
                          color: primaryColor,
                        }}
                      >
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
          {User?.role === 1 || User?.role === 2 || User?.role === 8 ? (
            <>
              <motion.div
                initial={{ x: 120 }}
                transition={{ duration: 0.7 }}
                animate={{ x: [-20, 30, 0] }}
                className={`card-hover backdrop-blur ${
                  currentMode === "dark"
                    ? "bg-[#1c1c1c] text-white "
                    : "bg-[#d8d8d845]"
                } h-full rounded-xl p-5 cursor-pointer w-full`}
              >
                <div className="justify-between items-center w-full">
                  <h6 className="font-semibold">Performance</h6>
                  <CombinationChart />
                </div>
              </motion.div>
            </>
          ) : User?.role === 3 ? (
            <>
              <div
                className={`card-hover backdrop-blur ${
                  currentMode === "dark"
                    ? "bg-[#1c1c1c] text-white "
                    : "bg-[#d8d8d845]"
                } h-full w-full rounded-xl p-5 cursor-pointer`}
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
                  className={`card-hover backdrop-blur ${
                    currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white "
                      : "bg-[#d8d8d845]"
                  } h-full w-full rounded-xl p-5 cursor-pointer`}
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
                  className={`card-hover backdrop-blur ${
                    currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white "
                      : "bg-[#d8d8d845]"
                  } h-full w-full rounded-xl p-5 cursor-pointer`}
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
      {User?.role === 1 || User?.role === 2 || User?.role === 8 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-1">
            <div
              className={`card-hover backdrop-blur ${
                currentMode === "dark"
                  ? "bg-[#1c1c1c] text-white "
                  : "bg-[#d8d8d845]"
              } col-span-1 h-full w-full rounded-xl p-5 cursor-pointer`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold pb-3">Sales</h6>
                <SalesAmountChartAdmin />
              </div>
            </div>

            <div
              className={`card-hover backdrop-blur ${
                currentMode === "dark"
                  ? "bg-[#1c1c1c] text-white "
                  : "bg-[#d8d8d845]"
              } col-span-1 h-full w-full rounded-xl p-5 cursor-pointer `}
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
      ) : User?.role === 3 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-3 pb-1">
            <div
              className={`card-hover backdrop-blur ${
                currentMode === "dark"
                  ? "bg-[#1c1c1c] text-white "
                  : "bg-[#d8d8d845]"
              } col-span-1 h-full w-full rounded-xl p-5 cursor-pointer`}
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
              className={`card-hover backdrop-blur ${
                currentMode === "dark"
                  ? "bg-[#1c1c1c] text-white "
                  : "bg-[#d8d8d845]"
              } col-span-1 h-full w-full rounded-xl p-5 cursor-pointer`}
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
              className={`card-hover backdrop-blur ${
                currentMode === "dark"
                  ? "bg-[#1c1c1c] text-white "
                  : "bg-[#d8d8d845]"
              } col-span-1 h-full w-full rounded-xl p-5 cursor-pointer`}
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
          style={{
            background: withOpacity(primaryColor, 0.9),
          }}
          className={`
          card-hover backdrop-blur h-auto w-full justify-between items-center rounded-xl px-10 py-7 text-center`}
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
          style={{
            background: withOpacity(primaryColor, 0.9),
          }}
          className={`card-hover backdrop-blur h-auto w-full justify-between items-center rounded-xl px-10 py-7 text-center`}
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

      {/* UPCOMING MEETINGS  */}
      {hasPermission("upcoming_meetings") && (
        <div className="grid grid-cols-1 pb-3">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-70px" }}
            className={`${
              currentMode === "dark" ? "text-white" : "text-black"
            } col-span-1 h-fit py-2`}
          >
            <h4 className="font-semibold p-3">UPCOMING MEETINGS</h4>
            <UpcomingMeeting
              upcoming_meetings={DashboardData?.upcoming_meetings}
            />
          </motion.div>
        </div>
      )}

      {/* REMINDERS  */}
      {visible === true && (
        <div className="grid grid-cols-1 pb-3">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-70px" }}
            className={`${
              currentMode === "dark" ? "text-white " : "text-black"
            } col-span-1 h-fit`}
          >
            <h4 id="reminders" className="font-semibold p-3">
              REMINDERS
            </h4>
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
        className={`${
          currentMode === "dark" ? "border-[#1C1C1C]" : "border-[#d8d8d845]"
        } grid grid-cols-1 pb-3 my-3 border-4 rounded-xl`}
      >
        <Task />
      </motion.div>
      {/* 5TH ROW END [TODO + SHORTCUTS] */}
    </div>
  );
};

export default DashboardPanel;
