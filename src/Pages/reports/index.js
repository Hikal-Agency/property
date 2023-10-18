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

import { MdCampaign } from "react-icons/md";
import { 
  FaFacebookF,
  FaSnapchatGhost,
  FaTiktok,
  FaYoutube
} from "react-icons/fa";
import {
  FcGoogle
} from "react-icons/fc";
import {
  GiMagnifyingGlass
} from "react-icons/gi";

const Reports = () => {
  const {
    currentMode,
    DashboardData,
    setDashboardData,
    setSales_chart_data,
    BACKEND_URL,
    pageState, 
    t,
    themeBgImg
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

  const sourceCounters = {
    "Campaign Facebook": <FaFacebookF size={14} color={"#0e82e1"} />,
    "Campaign Snapchat": <FaSnapchatGhost size={16} color={"#f6d80a"} />,
    "Campaign TikTok": <FaTiktok size={16} color={currentMode === "dark" ? "white" : "black"} />,
    "Campaign YouTube": <FaYoutube size={18} color={"#c4302b"} />,
    "Campaign GoogleAds": <FcGoogle size={18} />,
    "Property Finder": <GiMagnifyingGlass size={16} color={"#ef5e4e"} />,
  };

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
            className={`w-full p-4 ${
              !themeBgImg & (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            <div className="mb-10">
              {hasPermission("leadSource_counts") && (
                <div className="bg-primary p-3 mb-5 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5 flex justify-between">
                    <div className="w-full flex items-center gap-5">
                      <h1 className={`text-white uppercase font-semibold`}>
                        Lead Source
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
                            <TextField
                              size="small"
                              sx={{
                                "& input": {
                                  color: "#ffffff",
                                },
                                "&": {
                                  borderRadius: "4px",
                                  border: "1px solid #AAAAAA",
                                },
                                "& .MuiSvgIcon-root": {
                                  color: "#AAAAAA",
                                },
                              }}
                              label="Date"
                              {...params}
                              onKeyDown={(e) => e.preventDefault()}
                              readOnly={true}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="lg:col-span-2 gap-4 flex flex-wrap justify-end">
                      {counters && counters?.length > 0
                        ? counters?.map((counter) => (
                          <Tooltip title={counter?.leadSource} arrow>
                            <Box
                              className={`
                                ${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"}
                                card-hover p-0.5 flex justify-between items-center shadow-md rounded-sm w-fit
                              `}
                              sx={{
                                // height: "30px",
                                // minWidth: "60px",
                                // maxWidth: "100px",
                              }}
                            >
                              <div className="px-2">{sourceCounters[counter?.leadSource]}</div>
                              <div className="px-2 font-semibold">{counter?.count}</div>
                            </Box>
                          </Tooltip>
                        )) : ""
                      }
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-5">
                <div className="flex justify-center bg-primary py-2 mb-4 rounded-full">
                  <h1 className={`text-white text-lg font-semibold`}>
                    {t("label_turnover")?.toUpperCase()}
                  </h1>
                </div>
                <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3">
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white"
                        : "bg-[#EEEEEE] text-black"
                    } rounded-md p-2 h-auto`}
                  >
                    <h6 className="mb-2 p-2">
                      <span className="font-semibold">
                        {t("sales")}
                      </span>
                      <span className="float-right">
                        <select
                          className={`${
                            currentMode === "dark"
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          } text-xs rounded-md p-1`}
                          value={selectedMonthSales}
                          onChange={(e) => {
                            setSelectedMonthSales(e.target.value);
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
                      } rounded-md p-2`}
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
                      } rounded-md p-2`}
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
                      currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white"
                        : "bg-[#EEEEEE] text-black"
                    } rounded-md p-2`}
                  >
                    <h6 className="mb-2 p-2">
                      <span className="font-semibold">{t("performance")?.toUpperCase()}</span>
                      <span className="float-right">
                        <select
                          className={`${
                            currentMode === "dark"
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          } text-xs rounded-md p-1`}
                          value={selectedMonth}
                          onChange={(e) => {
                            setSelectedMonth(e.target.value);
                          }}
                        >
                          <option value="alltime">{t("all_time")}</option>
                          <option value="lastmonth">{t("last_month")}</option>
                          <option value="thismonth">{t("this_month")}</option>
                        </select>
                      </span>
                    </h6>
                    <div className="justify-between items-center">
                      <ReportMeetingsClosed selectedMonth={selectedMonth} />
                    </div>
                  </div>
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white"
                        : "bg-[#EEEEEE] text-black"
                    } rounded-md  p-2`}
                  >
                    <h6 className="mb-2 p-2">
                      <span className="font-semibold">{t("lead_source")?.toUpperCase()}</span>
                      <span className="float-right">
                        <select
                          className={`${
                            currentMode === "dark"
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          } text-xs rounded-md p-1`}
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
                    currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white"
                      : "bg-[#EEEEEE] text-black"
                  } rounded-md p-3`}
                >
                  <h6 className="mb-2 p-2">
                    <span className="font-semibold">{t("project")?.toUpperCase()}</span>
                    <span className="float-right">
                      <select
                        className={`${
                          currentMode === "dark"
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        } text-xs rounded-md p-1`}
                        value={selectedMonthProject}
                        onChange={(e) => {
                          setSelectedMonthProject(e.target.value);
                        }}
                      >
                        <option value="alltime">{t("all_time")}</option>
                        <option value="lastmonth">{t("last_month")}</option>
                        <option value="thismonth">{t("this_month")}</option>
                      </select>
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
