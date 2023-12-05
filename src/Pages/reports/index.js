import React, { useEffect, useState } from "react";
import { Box, CircularProgress, TextField, Tooltip } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import moment from "moment";
import usePermission from "../../utils/usePermission";
import { useStateContext } from "../../context/ContextProvider";
import ReportProjectBar from "../../Components/charts/ReportProjectBar";
import ReportMeetingsClosed from "../../Components/charts/ReportMeetingsClosed";
import DoughnutChart from "../../Components/charts/DoughnutChart";
import ReportClosedMeetingDoughnut from "../../Components/charts/ReportClosedMeetingDoughnut";
import Loader from "../../Components/Loader";
import axios from "../../axoisConfig";
import SocialChart from "../../Components/charts/SocialChart";
import SaleBubbleChart from "../../Components/charts/SaleBubbleChart";

import {
  BiImport,
  BiArchive,
  BiMessageRoundedDots
} from "react-icons/bi";
import {
  BsSnow2,
  BsPersonCircle,
  BsInstagram,
  BsFacebook,
  BsSnapchat,
  BsTiktok,
  BsYoutube,
  BsTwitter,
  BsMegaphone,
  BsWhatsapp,
  BsChatDots,
  BsChatLeftText,
  BsGlobe2,
  BsLink45Deg,
  BsDownload,
  BsArchive,
  BsPersonRolodex
} from "react-icons/bs";
import { 
  FaFacebookF,
  FaSnapchatGhost,
  FaTiktok,
  FaYoutube,
  FaTwitter,
  FaWhatsapp,
  FaRegComments
} from "react-icons/fa";
import {
  FcGoogle
} from "react-icons/fc";
import {
  GiMagnifyingGlass
} from "react-icons/gi";
import { 
  MdCampaign 
} from "react-icons/md";
import {
  TbWorldWww
} from "react-icons/tb";

const Reports = () => {
  const {
    currentMode,
    DashboardData,
    setDashboardData,
    setSales_chart_data,
    BACKEND_URL,
    t,
    themeBgImg,
    primaryColor,
    darkModeColors
  } = useStateContext();

  const [saleschart_loading, setsaleschart_loading] = useState(true);
  const [loading, setloading] = useState(true);
  const [socialChartData, setSocialChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedMonthSocial, setSelectedMonthSocial] = useState();
  const [selectedMonthProject, setSelectedMonthProject] = useState();
  const [selectedMonthSales, setSelectedMonthSales] = useState();
  const [counters, setCounter] = useState([]);
  const { hasPermission } = usePermission();
  const [countFilter, setCountFilter] = useState();

  const FetchProfile = (token) => {
    let params = {
      page: 1,
    };
    if (selectedMonthProject) {
      if (selectedMonthProject === "lastmonth") {
        const lastMonthStartDate = moment()
          .subtract(1, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        const lastMonthEndDate = moment()
          .subtract(2, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        params.date_range = `${lastMonthStartDate},${lastMonthEndDate}`;
      } else if (selectedMonthProject === "thismonth") {
        const thisMonthStartDate = moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        const thisMonthEndDate = moment()
          .subtract(1, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        params.date_range = `${thisMonthStartDate},${thisMonthEndDate}`;
      }
    }
    axios
      .get(`${BACKEND_URL}/dashboard`, {
        params,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("dashboard data is");
        console.log(result.data);
        console.log("User from dashboard: ", result.data.user);
        setDashboardData({
          ...result.data,
          newLeads: result.data.lead_status.new,
        });
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Sorry something went wrong. Kindly refresh the page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const fetchData = async () => {
    let params = {};
    if (selectedMonthSales) {
      if (selectedMonthSales === "lastmonth") {
        const lastMonthStartDate = moment()
          .subtract(1, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        const lastMonthEndDate = moment()
          .subtract(2, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        params.date_range = `${lastMonthStartDate},${lastMonthEndDate}`;
      } else if (selectedMonthSales === "thismonth") {
        const thisMonthStartDate = moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        const thisMonthEndDate = moment()
          .subtract(1, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        params.date_range = `${thisMonthStartDate},${thisMonthEndDate}`;
      }
    }

    try {
      const token = localStorage.getItem("auth-token");
      const urls = [`${BACKEND_URL}/memberdeals`];

      const responses = await Promise.all(
        urls.map((url) => {
          return axios.get(url, {
            params,
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

  const fetchSocialChart = async () => {
    let params = {};

    if (selectedMonthSocial) {
      if (selectedMonthSocial === "lastmonth") {
        const lastMonthStartDate = moment()
          .subtract(1, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        const lastMonthEndDate = moment()
          .subtract(2, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        params.date_range = `${lastMonthStartDate},${lastMonthEndDate}`;
      } else if (selectedMonthSocial === "thismonth") {
        const thisMonthStartDate = moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        const thisMonthEndDate = moment()
          .subtract(1, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        params.date_range = `${thisMonthStartDate},${thisMonthEndDate}`;
      }
    }

    try {
      const token = localStorage.getItem("auth-token");
      const urls = [`${BACKEND_URL}/socialchart`];
      const responses = await Promise.all(
        urls.map((url) => {
          return axios.get(url, {
            params,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          });
        })
      );
      const warmLeads = responses[0].data?.social_chart?.filter((data) =>
        data?.leadSource.startsWith("Warm")
      );
      const totalWarmLeadsCount = warmLeads?.reduce((a, b) => a + b?.total, 0);
      const formattedData = responses[0].data?.social_chart?.filter(
        (data) => !data?.leadSource.startsWith("Warm")
      );
      const socialChartData = [
        ...formattedData,
        {
          leadSource: "Warm Leads",
          total: totalWarmLeadsCount,
        },
      ];
      const dataWithIcons = socialChartData?.map((item) => ({
        total: item?.total,
        leadSource: item?.leadSource?.toLowerCase(),
      }));
      setSocialChartData(dataWithIcons);
    } catch (error) {
      console.log(error);
    }
  };

  const sourceCounters = [
    {
        "Facebook": {
            icon: <BsFacebook size={20} color={"white"} />,
            bg: "#0E82E1",
        }
    },
    {
        "Instagram": {
            icon: <BsInstagram size={20} color={"white"} />,
            bg: "#BE238D",
        }
    },
    {
        "Snapchat": {
            icon: <BsSnapchat size={18} color={"white"} />,
            bg: "#EDBD34", //"#F6D80A",
        }
    },
    {
        "TikTok": {
            icon: <BsTiktok size={18} color={"white"} />,
            bg: "#000000",
        }
    },
    {
        "YouTube": {
            icon: <BsYoutube size={20} color={"white"} />,
            bg: "#C4302B",
        }
    },
    {
        "GoogleAds": {
            icon: <FcGoogle size={20} />,
            bg: currentMode === "dark" ? "#000000" : "#FFFFFF",
        }
    },
    {
        "Twitter": {
            icon: <BsTwitter size={20} color={"white"} />,
            bg: "#00ACEE",
        }
    },
    {
        "Campaign": {
            icon: <BsMegaphone size={20} color={"white"} />,
            bg: "#696969",
        }
    },
    {
        "WhatsApp": {
            icon: <BsWhatsapp size={20} color={"white"} />,
            bg: "#53CC60",
        }
    },
    {
        "Message": {
            icon: <BsChatDots size={20} color={"white"} />,
            bg: "#6A5ACD",
        }
    },
    {
        "Comment": {
            icon: <BsChatLeftText size={20} color={"white"} />,
            bg: "#A9B3C6",
        }
    },
    {
        "Website": {
            icon: <BsGlobe2 size={20} color={"white"} />,
            bg: "#AED6F1",
        }
    },
    {
        "Property Finder": {
            icon: <BsLink45Deg size={22} color={"white"} />,
            bg: "#EF5E4E",
        }
    },
    {
        "Bulk Import": {
            icon: <BsDownload size={20} color={"white"} />,
            bg: primaryColor,
        }
    },
    {
        "Warm": {
            icon: <BsArchive size={20} color={"white"} />,
            bg: "#AEC6CF",
        }
    },
    {
        "Cold": {
            icon: <BsSnow2 size={20} color={"white"} />,
            bg: "#0EC7FF",
        }
    },
    {
        "Personal": {
            icon: <BsPersonRolodex size={20} color={"white"} />,
            bg: "#6C7A89",
        }
    },
  ];

  const fetchCounter = async (token) => {
    const currentDate = moment(countFilter).format("YYYY-MM-DD");
    try {
      const callCounter = await axios.get(
        `${BACKEND_URL}/totalSource?date=${currentDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("counter===> :", callCounter);

      setCounter(callCounter?.data?.data?.query_result);
    } catch (error) {
      console.log("Error::: ", error);
      toast.error("Unable to fetch count.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchData();
    fetchSocialChart();

    const token = localStorage.getItem("auth-token");
    FetchProfile(token);
    fetchCounter(token);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    fetchCounter(token);
  }, [countFilter]);

  useEffect(() => {
    // fetchData();
    fetchSocialChart(selectedMonthSocial);
    // const token = localStorage.getItem("auth-token");
    // FetchProfile(token);
  }, [selectedMonthSocial]);

  useEffect(() => {
    // fetchData();
    // fetchSocialChart(selectedMonthSocial);
    const token = localStorage.getItem("auth-token");
    FetchProfile(token);
  }, [selectedMonthProject]);

  useEffect(() => {
    fetchData();
    // fetchSocialChart(selectedMonthSocial);
    // const token = localStorage.getItem("auth-token");
    // FetchProfile(token);
  }, [selectedMonthSales]);

  if (loading) {
    return <Loader />;
  } else {
    return (
      <>
        {/* <ToastContainer/> */}
        <div className="flex min-h-screen">
          <div
            className={`w-full ${
              !themeBgImg && (currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]")
            } ${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          >
            {hasPermission("leadSource_counts") && (
              <div className={`${themeBgImg && (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")} ${currentMode === "dark" ? "text-white" : "text-black"} p-4`}>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 flex justify-between">
                  <div className="w-full flex items-center gap-3">
                    <h1 className={`capitalize font-semibold`}>
                      {t("lead_source")}
                    </h1>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={countFilter}
                        views={["year", "month", "day"]}
                        format="yyyy-MM-dd"
                        onChange={(newValue) => {
                          const formattedDate = moment(newValue?.$d).format(
                            "YYYY-MM-DD"
                          );
                          setCountFilter(formattedDate);
                        }}
                        renderInput={(params) => (
                          <Box sx={darkModeColors}>
                          <TextField
                            size="small"
                            sx={{
                              "& input": {
                                color: currentMode === "dark" ? "1px solid #EEEEEE" : "1px solid #333333",
                              },
                              "&": {
                                borderRadius: "4px",
                                border: currentMode === "dark" ? "1px solid #EEEEEE" : "1px solid #333333",
                              },
                              "& .MuiSvgIcon-root": {
                                color: currentMode === "dark" ? "1px solid #EEEEEE" : "1px solid #333333",
                              },
                            }}
                            label="Date"
                            {...params}
                            onKeyDown={(e) => e.preventDefault()}
                            readOnly={true}
                          />
                          </Box>
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="lg:col-span-2 gap-3 flex flex-wrap justify-end">
                    {counters && counters?.length > 0
                      ? counters?.map((counter) => {
                        const matchingSource = sourceCounters.find(
                          sourceCounter => counter?.leadSource.toLowerCase().includes(Object.keys(sourceCounter)[0].toLowerCase())
                        );

                        if (!matchingSource) return null;

                        const leadSource = Object.keys(matchingSource)[0];
                        const { icon, bg } = matchingSource[leadSource];

                        return (
                          <Tooltip title={counter?.leadSource} key={counter?.leadSource} arrow>
                            <div className="px-1">
                                <div
                                className="shadow-sm card-hover flex items-center justify-between"
                                style={{
                                    border: `1px solid #AAAAAA`,
                                }}
                                >
                                    <div
                                        className="p-2 h-full flex items-center justify-center"
                                        style={{
                                        backgroundColor: bg,
                                        }}
                                    >
                                        {icon}
                                    </div>
                                    <div className="p-2 px-3 font-bold">{counter?.count}</div>
                                </div>
                            </div>
                          </Tooltip>
                        )
                      }) : ""
                    }
                  </div>
                </div>
              </div>
            )}

            {/* <div className="p-4 flex flex-col gap-5"> */}
              {/* TURNOVER  */}
              {/* <div className={`p-4 rounded-xl shadow-sm ${
                themeBgImg 
                ? (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light") 
                : (currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]")}`}
              >
                <div className="flex w-full justify-center">
                  <h1 className={`text-lg uppercase font-semibold`}>
                    {t("label_turnover")}
                  </h1>
                </div>
                <div className="h-0.5 w-full rounded-full bg-primary my-5"></div>
                <div className="grid gap-5">
                  MONTHLY CLOSED DEALS AND AMOUNT
                </div>
              </div> */}

              {/* PERFORMANCE  */}
              {/* <div className={`p-4 rounded-xl shadow-sm ${
                themeBgImg 
                ? (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light") 
                : (currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]")}`}
              >
                <div className="flex w-full justify-center">
                  <h1 className={`text-lg uppercase font-semibold`}>
                    {t("achievement")}
                  </h1>
                </div>
                <div className="h-0.5 w-full rounded-full bg-primary my-5"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="">
                    CLOSED DEALS AND MEETINGS
                  </div>
                  <div className="">
                    MONTHLY AGENT'S TARGET
                  </div>
                </div>
              </div> */}

              {/* PROJECTS  */}
              {/* <div className={`p-4 rounded-xl shadow-sm ${
                themeBgImg 
                ? (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light") 
                : (currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]")}`}
              >
                <div className="flex w-full justify-center">
                  <h1 className={`text-lg uppercase font-semibold`}>
                    {t("projects")}
                  </h1>
                </div>
                <div className="h-0.5 w-full rounded-full bg-primary my-5"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="">
                    CLOSED DEALS AND PROJECTS
                  </div>
                  <div className="">
                    LEADS AND PROJECTS
                  </div>
                </div>
              </div> */}

              {/* LEADS QUALITY  */}
              {/* <div className={`p-4 rounded-xl shadow-sm ${
                themeBgImg 
                ? (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light") 
                : (currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]")}`}
              >
                <div className="flex w-full justify-center">
                  <h1 className={`text-lg uppercase font-semibold`}>
                    {t("leads")}
                  </h1>
                </div>
                <div className="h-0.5 w-full rounded-full bg-primary my-5"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="">
                    MONTHLY LEADS CATEGORY WITH FEEDBACK
                  </div>
                  <div className="">
                    MONTHLY LEADS WITH LEAD SOURCE 
                  </div>
                </div>
              </div>
            </div> */}

            <div className="mb-10 p-4">
              <div className="mb-5">
                <div className="flex justify-center bg-primary py-2 mb-4 rounded-full">
                  <h1 className={`text-white text-lg font-semibold`}>
                    {t("label_turnover")?.toUpperCase()}
                  </h1>
                </div>
                <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3">
                  <div
                    className={`${
                      !themeBgImg ? (currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white"
                        : "bg-[#EEEEEE] text-black")
                        : (currentMode === "dark"
                        ? "blur-bg-dark text-white"
                        : "blur-bg-light text-black")
                    } rounded-lg p-2 h-auto`}
                  >
                    <h6 className="mb-2 p-2">
                      <span className="font-semibold">
                        {t("sales")}
                      </span>
                      <span className="float-right">
                        <Box sx={darkModeColors}>
                          <select
                            className={`${
                              currentMode === "dark"
                              ? "bg-[#1c1c1c] text-white"
                              : "bg-[#EEEEEE] text-black"
                            } text-xs rounded-lg p-1`}
                            value={selectedMonthSales}
                            onChange={(e) => {
                              setSelectedMonthSales(e.target.value);
                            }}
                          >
                            <option value="alltime">{t("all_time")}</option>
                            <option value="lastmonth">{t("last_month")}</option>
                            <option value="thismonth">{t("this_month")}</option>
                          </select>
                        </Box>
                      </span>
                    </h6>
                    <div className="justify-between items-center">
                      {saleschart_loading ? (
                        <div className="flex items-center space-x-2">
                          <CircularProgress size={20} /> <span>Loading</span>
                        </div>
                      ) : (
                        // <SalesAmountChartAdmin
                        //   selectedMonthSales={selectedMonthSales}
                        // />
                        <SaleBubbleChart
                          selectedMonthSales={selectedMonthSales}
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div
                      className={`${
                        currentMode === "dark" ? " text-white" : "text-black"
                      } rounded-lg p-2`}
                    >
                      <h6 className="mb-2 p-2">
                        <span className="font-semibold">
                          {t("label_target")?.toUpperCase()}
                        </span>
                      </h6>
                      <div className="justify-between items-center mb-3">
                        {/* MONTHLY  */}
                        <DoughnutChart
                          target={DashboardData?.user?.target}
                          target_reached={DashboardData?.target_reached}
                          target_remaining={DashboardData?.target_remaining}
                        />
                      </div>
                      <h6 className="text-xs text-center mt-3 italic">
                        {t("target_graph_caption")}
                      </h6>
                    </div>
                    <div
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                      } rounded-lg p-2`}
                    >
                      <h6 className="mb-2 p-2">
                        <span className="font-semibold">
                        {t("closed_over_meeting")?.toUpperCase()}
                        </span>
                      </h6>
                      <div className="justify-between items-center mb-3">
                        {/* MONTHLY  */}
                        <ReportClosedMeetingDoughnut />
                      </div>
                      <h6 className="text-xs text-center mt-3 italic">
                        {t("closedovermeeting_graph_caption")}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-5">
                <div className="flex justify-center bg-primary py-2 mb-4 rounded-full">
                  <h1 className={`text-white text-lg font-semibold`}>
                    {t("achievement")?.toUpperCase()}
                  </h1>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div
                    className={`${
                        !themeBgImg ? (currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white"
                        : "bg-[#EEEEEE] text-black")
                        : (currentMode === "dark"
                        ? "blur-bg-dark text-white"
                        : "blur-bg-light text-black")
                    } rounded-lg p-2`}
                  >
                    <h6 className="mb-2 p-2">
                      <span className="font-semibold">{t("performance")?.toUpperCase()}</span>
                      <span className="float-right">
                        <Box sx={darkModeColors}>
                          <select
                            className={`${
                              currentMode === "dark"
                              ? "bg-[#1c1c1c] text-white"
                              : "bg-[#EEEEEE] text-black"
                            } text-xs rounded-lg p-1`}
                            value={selectedMonth}
                            onChange={(e) => {
                              setSelectedMonth(e.target.value);
                            }}
                          >
                            <option value="alltime">{t("all_time")}</option>
                            <option value="lastmonth">{t("last_month")}</option>
                            <option value="thismonth">{t("this_month")}</option>
                          </select>
                        </Box>
                      </span>
                    </h6>
                    <div className="justify-between items-center">
                      <ReportMeetingsClosed selectedMonth={selectedMonth} />
                    </div>
                  </div>
                  <div
                    className={`${
                      !themeBgImg ? (currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white"
                        : "bg-[#EEEEEE] text-black")
                        : (currentMode === "dark"
                        ? "blur-bg-dark text-white"
                        : "blur-bg-light text-black")
                    } rounded-lg  p-2`}
                  >
                    <h6 className="mb-2 p-2">
                      <span className="font-semibold">{t("lead_source")?.toUpperCase()}</span>
                      <span className="float-right">
                        <select
                          className={`${
                            currentMode === "dark"
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          } text-xs rounded-lg p-1`}
                          value={selectedMonthSocial}
                          onChange={(e) => {
                            setSelectedMonthSocial(e.target.value);
                          }}
                        >
                          <option value="alltime">{t("all_time")}</option>
                          <option value="lastmonth">{t("last_month")}</option>
                          <option value="thismonth">{t("this_month")}</option>
                        </select>
                      </span>
                    </h6>
                    <div className="justify-between items-center">
                      {saleschart_loading ? (
                        <div className="flex items-center space-x-2">
                          <CircularProgress size={20} />{" "}
                          <span>{t("loading")}</span>
                        </div>
                      ) : (
                        <SocialChart
                          data={socialChartData}
                          selectedMonthSocial={selectedMonthSocial}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex justify-center bg-primary py-2 mb-4 rounded-full">
                  <h1 className={`text-white text-lg font-semibold`}>
                    {t("projects")?.toUpperCase()}
                  </h1>
                </div>
                <div
                  className={`${
                    !themeBgImg ? (currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white"
                        : "bg-[#EEEEEE] text-black")
                        : (currentMode === "dark"
                        ? "blur-bg-dark text-white"
                        : "blur-bg-light text-black")
                  } rounded-lg p-3`}
                >
                  <h6 className="mb-2 p-2">
                    <span className="font-semibold">{t("project")?.toUpperCase()}</span>
                    <span className="float-right">
                      <Box sx={darkModeColors}>
                        <select
                          className={`${
                            currentMode === "dark"
                            ? "bg-[#1c1c1c] text-white"
                            : "bg-[#EEEEEE] text-black"
                          } text-xs rounded-lg p-1`}
                          value={selectedMonthProject}
                          onChange={(e) => {
                            setSelectedMonthProject(e.target.value);
                          }}
                        >
                          <option value="alltime">{t("all_time")}</option>
                          <option value="lastmonth">{t("last_month")}</option>
                          <option value="thismonth">{t("this_month")}</option>
                        </select>
                      </Box>
                    </span>
                  </h6>
                  <div className="justify-between items-center">
                    <ReportProjectBar
                      total_projects={DashboardData?.total_projects}
                      selectedMonthProject={selectedMonthProject}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Reports;
