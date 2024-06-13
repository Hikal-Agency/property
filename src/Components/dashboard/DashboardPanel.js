import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
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
import HeadingTitle from "../_elements/HeadingTitle";

const DashboardPanel = ({ setloading }) => {
  const {
    DashboardData,
    currentMode,
    setopenBackDrop,
    User,
    Sales_chart_data,
    setSales_chart_data,
    BACKEND_URL,
    t,
    themeBgImg,
  } = useStateContext();

  const [saleschart_loading, setsaleschart_loading] = useState(true);
  const [reminder, setReminder] = useState([]);
  const [visible, setVisible] = useState(true);
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
      const data = responses[0].data?.members_deal;

      setSales_chart_data(data);
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
      title: `${t("closed")} ${t("deal")?.toLowerCase()}`,
      link: "/closedeals",
    },
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.newLeads,
      percentage: "-12%",
      title: t("all_new_leads"),
    },
    {
      icon: <GiThermometerCold />,
      amount: DashboardData?.isAdmin?.verified_cold_leads,
      percentage: "-12%",
      title: `${t("verified")} ${t("cold")?.toLowerCase()} ${t(
        "leads"
      )?.toLowerCase()}`,
      link: "/coldleads/coldLeadsVerified",
    },
    {
      icon: <FiUsers />,
      amount: DashboardData?.isAdmin?.personal_leads,
      percentage: "-12%",
      title: `${t("personal")} ${t("leads")?.toLowerCase()}`,
      link: "/personalleads/all",
    },
    {
      icon: <MdLeaderboard />,
      amount: DashboardData?.isAdmin?.thirdparty,
      percentage: "-12%",
      title: `${t("thirdparty")} ${t("leads")?.toLowerCase()}`,
      link: "/thirdpartyleads/all",
    },
    {
      icon: <ImUser />,
      amount: DashboardData?.isAdmin?.managers,
      title: t("sales_managers"),
    },
    {
      icon: <MdSupportAgent />,
      amount: DashboardData?.isAdmin?.total_agents,
      percentage: "+38%",
      title: t("sales_agents"),
    },
  ];

  const ManagerData = [
    {
      amount: DashboardData?.lead_status?.closed,
      title: `${t("closed")} ${t("deal")?.toLowerCase()}`,
      link: "/closedeals",
    },
    {
      amount: DashboardData?.lead_status?.meeting,
      title: t("meeting"),
      link: "/meetings",
    },
    {
      amount: DashboardData?.lead_status?.followup,
      title: t("feedback_follow_up"),
      link: "/freshleads/follow up",
    },
    {
      amount: DashboardData?.lead_status?.new,
      title: t("menu_new_leads"),
      // link: "/freshleads/all",
    },
    {
      amount: DashboardData?.isAdmin?.total_agents,
      title: t("sales_agents"),
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
      title: t("menu_closed_deals"),
      link: "/closedeals",
    },
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.lead_status?.meeting,
      title: t("meeting"),
      link: "/meetings",
    },
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.lead_status?.followup,
      percentage: "-12%",
      title: t("feedback_follow_up"),
      link: "/freshleads/follow up",
    },
    {
      icon: <AiOutlineFire />,
      amount: DashboardData?.lead_status?.new,
      title: t("menu_new_leads"),
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
    <div className={`${currentMode === "dark" ? "text-white" : "text-black"}`}>
      <HeadingTitle title={t("overview")} />

      {User?.role === 1 || User?.role === 2 || User?.role === 8 ? (
        <>
          {/* OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5 pb-5">
            {/* COUNTERS */}
            <motion.div
              transition={{ duration: 0.5 }}
              initial={{ y: -120 }}
              animate={{ y: [20, 30, 0] }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-8 2xl:col-span-3 gap-5 text-center pb-5"
            >
              {/* FRESH LEADS */}
              <Link
                to={"/freshleads/all"}
                className={`${themeBgImg
                  ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                  : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                  } p-5 w-full h-full cursor-pointer flex flex-col items-center justify-center gap-2`}
                onClick={() => setopenBackDrop(true)}
              >
                <p
                  className={`${!themeBgImg
                    ? "text-primary"
                    : currentMode === "dark"
                      ? "text-white"
                      : "text-black"
                    } text-[16px] break-words font-bold`}
                >
                  <CountUp end={DashboardData?.lead_status?.hot} duration={3} />
                </p>
                <p className={currentMode === "dark" ? "text-white" : "text-black"}>
                  {t("fresh")} {t("leads")}
                </p>
              </Link>
              {/* OTHER COUNTERS */}
              {HeadData.map((item, index) => {
                return (
                  <Link
                    key={index}
                    to={item?.link}
                    className={`${themeBgImg
                      ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                      : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                      } p-5 w-full h-full cursor-pointer flex flex-col items-center justify-center gap-2`}
                  >
                    <p
                      className={`${!themeBgImg
                        ? "text-primary"
                        : currentMode === "dark"
                          ? "text-white"
                          : "text-black"
                        } text-[16px] break-words font-bold`}
                    >
                      <CountUp end={item.amount} duration={3} />
                    </p>
                    <p
                      className={` ${currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                    >
                      {item?.title}
                    </p>
                  </Link>
                );
              })}
            </motion.div>
            {/* PERFORMANCE CHART  */}
            <motion.div
              initial={{ x: 120 }}
              transition={{ duration: 0.6 }}
              animate={{ x: [-20, 30, 0] }}
              className={`${themeBgImg
                ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                } p-5 w-full h-full cursor-pointer flex flex-col gap-2`}
            >
              <div className="justify-between items-center w-full">
                <h6 className="font-semibold uppercase pb-3">{t("performance")}</h6>
                <CombinationChart />
              </div>
            </motion.div>
            {/* SALES CHART */}
            <motion.div
              initial={{ y: -120 }}
              transition={{ duration: 0.7 }}
              animate={{ y: [20, 30, 0] }}
              className={`${themeBgImg
                ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                } p-5 w-full h-full cursor-pointer flex flex-col gap-2`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold uppercase pb-3">{t("sales")}</h6>
                <SalesAmountChartAdmin />
              </div>
            </motion.div>
            {/* CLOSED PROJECTS CHART */}
            <motion.div
              initial={{ y: -120 }}
              transition={{ duration: 0.8 }}
              animate={{ y: [20, 30, 0] }}
              className={`${themeBgImg
                ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                } p-5 w-full h-full cursor-pointer flex flex-col gap-2`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold uppercase pb-3">{`${t("closed")} ${t(
                  "projects"
                )}`}</h6>
                <BarChartProjectAdmin
                  total_projects={DashboardData?.total_projects}
                />
              </div>
            </motion.div>
          </div>
        </>
      ) : User?.role === 3 ? (
        <>
          {/* OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-1 gap-5 pb-5">
            {/* COUNTERS */}
            <motion.div
              transition={{ duration: 0.5 }}
              initial={{ y: -120 }}
              animate={{ y: [20, 30, 0] }}
              className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 md:col-span-2 lg:col-span-1 gap-5 text-center pb-5"
            >
              {/* FRESH LEADS */}
              <Link
                to={"/freshleads/all"}
                className={`${themeBgImg
                  ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                  : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                  } p-5 w-full h-full cursor-pointer flex flex-col items-center justify-center gap-2`}
                onClick={() => setopenBackDrop(true)}
              >
                <p
                  className={`${!themeBgImg
                    ? "text-primary"
                    : currentMode === "dark"
                      ? "text-white"
                      : "text-black"
                    } text-[16px] break-words font-bold`}
                >
                  <CountUp end={DashboardData?.lead_status?.hot} duration={3} />
                </p>
                <p className={` ${currentMode === "dark" ? "text-white" : "text-black"}`}>
                  {t("fresh")} {t("leads")}
                </p>
              </Link>
              {/* OTHER COUNTERS */}
              {ManagerData.map((item, index) => {
                return (
                  <Link
                    to={item?.link}
                    key={index}
                    className={`${themeBgImg
                      ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                      : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                      } p-5 w-full h-full cursor-pointer flex flex-col items-center justify-center gap-2`}
                    onClick={() => setopenBackDrop(true)}
                  >
                    <div>
                      <p
                        className={`${!themeBgImg
                          ? "text-primary"
                          : currentMode === "dark"
                            ? "text-white"
                            : "text-black"
                          } text-[16px] break-words font-bold`}
                      >
                        <CountUp end={item.amount} duration={3} />
                      </p>
                      <p>
                        {item?.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
            {/* PERFORMANCE CHART - HIDE IN 2XL */}
            <motion.div
              initial={{ y: -120 }}
              transition={{ duration: 0.6 }}
              animate={{ y: [20, 30, 0] }}
              className={`${themeBgImg
                ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                } p-5 w-full h-full cursor-pointer flex flex-col gap-2 md:hidden lg:flex 2xl:hidden`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold uppercase pb-3">{t("performance")}</h6>
                <CombinationChart />
              </div>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 pb-5">
            {/* PERFORMANCE CHART - SHOW IN 2XL */}
            <motion.div
              initial={{ y: -120 }}
              transition={{ duration: 0.6 }}
              animate={{ y: [20, 30, 0] }}
              className={`${themeBgImg
                ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                } p-5 w-full h-full cursor-pointer flex-col gap-2 hidden md:flex lg:hidden 2xl:flex`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold uppercase pb-3">{t("performance")}</h6>
                <CombinationChart />
              </div>
            </motion.div>
            {/* SALES CHART */}
            <motion.div
              initial={{ y: -120 }}
              transition={{ duration: 0.7 }}
              animate={{ y: [20, 30, 0] }}
              className={`${themeBgImg
                ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                } p-5 w-full h-full cursor-pointer flex flex-col gap-2`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold uppercase pb-3">{t("sales")}</h6>
                {saleschart_loading ? (
                  <div className="flex items-center space-x-2">
                    <CircularProgress size={20} /> <span>Loading</span>
                  </div>
                ) : (
                  <BarChart Sales_chart_data={Sales_chart_data} />
                )}
              </div>
            </motion.div>
            {/* TARGET */}
            <motion.div
              initial={{ y: -120 }}
              transition={{ duration: 0.7 }}
              animate={{ y: [20, 30, 0] }}
              className={`${themeBgImg
                ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                } p-5 w-full h-full cursor-pointer flex flex-col gap-2`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold uppercase pb-3">{t("monthly_target")}</h6>
                <DoughnutChart
                  target={DashboardData?.user?.target}
                  target_reached={DashboardData?.target_reached}
                  target_remaining={DashboardData?.target_remaining}
                />
              </div>
            </motion.div>
            {/* CLOSED PROJECT */}
            <motion.div
              initial={{ y: -120 }}
              transition={{ duration: 0.7 }}
              animate={{ y: [20, 30, 0] }}
              className={`${themeBgImg
                ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                } p-5 w-full h-full cursor-pointer flex flex-col gap-2`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold uppercase pb-3">{`${t("project")} ${t(
                  "chart"
                )}`}</h6>
                <BarChartProject
                  total_projects={DashboardData?.total_projects}
                />
              </div>
            </motion.div>
          </div>
        </>
      ) : User?.role === 7 ? (
        <>
          {/* OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5 pb-5">
            <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2 w-full flex flex-col">
              {/* COUNTERS */}
              <motion.div
                transition={{ duration: 0.5 }}
                initial={{ y: -120 }}
                animate={{ y: [20, 30, 0] }}
                className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5 text-center pb-5"
              >
                {/* FRESH LEADS */}
                <Link
                  to={"/freshleads/all"}
                  className={`${themeBgImg
                    ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                    : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                    } p-5 w-full h-full cursor-pointer flex flex-col items-center justify-center gap-2`}
                  onClick={() => setopenBackDrop(true)}
                >
                  <p
                    className={`${!themeBgImg
                      ? "text-primary"
                      : currentMode === "dark"
                        ? "text-white"
                        : "text-black"
                      } text-[16px] break-words font-bold`}
                  >
                    <CountUp end={DashboardData?.lead_status?.hot} duration={3} />
                  </p>
                  <p className={` ${currentMode === "dark" ? "text-white" : "text-black"}`}>
                    {t("fresh")} {t("leads")}
                  </p>
                </Link>
                {/* OTHER COUNTERS */}
                {AgentData.map((item, index) => {
                  return (
                    <Link
                      to={item.link}
                      key={index}
                      className={`${themeBgImg
                        ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                        : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                        } p-5 w-full h-full cursor-pointer flex flex-col items-center justify-center gap-2`}
                      onClick={() => setopenBackDrop(true)}
                    >
                      <div>
                        <p
                          className={`${!themeBgImg
                            ? "text-primary"
                            : currentMode === "dark"
                              ? "text-white"
                              : "text-black"
                            } text-[16px] break-words font-bold`}
                        >
                          <CountUp end={item.amount} duration={3} />
                        </p>
                        <p>
                          {item?.title}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </motion.div>
              {/* REVENUE */}
              <div className="hidden xl:flex w-full grid grid-cols-2 gap-5 pb-5">
                <motion.div
                  transition={{ duration: 0.6 }}
                  initial={{ y: -120 }}
                  animate={{ y: [20, 30, 0] }}
                  className={`${currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
                    } h-full w-full justify-between items-center px-10 py-7 text-center`}
                >
                  <div>
                    <p className={`text-sm font-semibold text-white `}>
                      {t("deal_drawn_in_the_month")}
                    </p>
                    <p className={`text-4xl font-bold mt-2 text-white`}>
                      AED {formatNumber(Number(DashboardData?.target_reached))}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  transition={{ duration: 0.7 }}
                  initial={{ y: -120 }}
                  animate={{ y: [20, 30, 0] }}
                  className={`${currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
                    } h-full w-full justify-between items-center px-10 py-7 text-center`}
                >
                  <div>
                    <p className={`text-sm font-semibold text-white`}>
                      {t("all_time_revenue")}
                    </p>
                    <p className={`text-4xl font-bold mt-2 text-white`}>
                      AED {formatNumber(Number(DashboardData?.total_closed))}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
            {/* TARGET */}
            <motion.div
              initial={{ y: -120 }}
              transition={{ duration: 0.6 }}
              animate={{ y: [20, 30, 0] }}
              className={`${themeBgImg
                ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                } p-5 w-full h-full cursor-pointer flex flex-col gap-2`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold uppercase pb-3">{t("label_target")}</h6>
                <DoughnutChart
                  className="p-2"
                  target_reached={DashboardData?.target_reached}
                  target_remaining={DashboardData?.target_remaining}
                />
              </div>
            </motion.div>
            {/* PROJECT */}
            <motion.div
              initial={{ y: -120 }}
              transition={{ duration: 0.7 }}
              animate={{ y: [20, 30, 0] }}
              className={`${themeBgImg
                ? (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
                : (currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu")
                } p-5 w-full h-full cursor-pointer flex flex-col gap-2`}
            >
              <div className="justify-between items-center">
                <h6 className="font-semibold uppercase pb-3">{t("project")}</h6>
                <BarChartProject
                  total_projects={DashboardData?.total_projects}
                />
              </div>
            </motion.div>
          </div>
        </>
      ) : (
        <></>
      )
      }

      {/* 3RD ROW [REVENUE, TOTAL SALES] */}
      <div className={`${User?.role === 7 && "xl:hidden"
        } flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5 pb-5`}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-70px" }}
          className={`${currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
            } h-full w-full justify-between items-center px-10 py-7 text-center`}
        >
          <div>
            <p className={`text-sm font-semibold text-white `}>
              {t("deal_drawn_in_the_month")}
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
          className={`${currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
            } h-full w-full justify-between items-center px-10 py-7 text-center`}
        >
          <div>
            <p className={`text-sm font-semibold text-white`}>
              {t("all_time_revenue")}
            </p>
            <p className={`text-4xl font-bold mt-2 text-white`}>
              AED {formatNumber(Number(DashboardData?.total_closed))}
            </p>
          </div>
        </motion.div>
      </div>

      {/* UPCOMING MEETINGS  */}
      {hasPermission("upcoming_meetings") && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-70px" }}
          className={`h-fit py-2 pb-5`}
        >
          <h4 className="font-semibold pt-3 uppercase">
            {`${t("upcoming")} ${t("meetings")}`}
          </h4>
          <UpcomingMeeting
            upcoming_meetings={DashboardData?.upcoming_meetings}
          />
        </motion.div>
      )}

      {/* REMINDERS  */}
      {visible === true && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-70px" }}
          className={`${currentMode === "dark" ? "text-white " : "text-black"
            } h-fit`}
        >
          <h4 id="reminders" className="font-semibold pt-3">
            {t("reminders")?.toUpperCase()}
          </h4>
          <Reminder
            reminder={reminder}
            setReminder={setReminder}
            visible={visible}
            setVisible={setVisible}
          />
        </motion.div>
      )}

      {/* 5TH ROW END [REMINDER] */}

      {/* 5TH ROW [TODO + SHORTCUTS] */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ margin: "-70px" }}
        className={`${!themeBgImg
          ? currentMode === "dark"
            ? "bg-black"
            : "bg-white"
          : currentMode === "dark"
            ? "blur-bg-black"
            : "blur-bg-white"
          } grid grid-cols-1 pb-3 my-3 rounded-xl shadow-md`}
      >
        <Task />
      </motion.div>
      {/* 5TH ROW END [TODO + SHORTCUTS] */}
    </div >
  );
};

export default DashboardPanel;
