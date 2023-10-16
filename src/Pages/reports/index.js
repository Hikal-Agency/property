import { useStateContext } from "../../context/ContextProvider";
import ReportProjectBar from "../../Components/charts/ReportProjectBar";
import ReportMeetingsClosed from "../../Components/charts/ReportMeetingsClosed";
import DoughnutChart from "../../Components/charts/DoughnutChart";
import SalesAmountChartAdmin from "../../Components/charts/SalesAmountChartAdmin";
import ReportClosedMeetingDoughnut from "../../Components/charts/ReportClosedMeetingDoughnut";
import { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import axios from "../../axoisConfig";
import { Box, CircularProgress } from "@mui/material";
import SocialChart from "../../Components/charts/SocialChart";
import { toast } from "react-toastify";
import moment from "moment";
import SaleBubbleChart from "../../Components/charts/SaleBubbleChart";
import { MdCampaign } from "react-icons/md";
import { FaFacebookF } from "react-icons/fa";
import usePermission from "../../utils/usePermission";
import { BiMessageRoundedDots } from "react-icons/bi";

const Reports = () => {
  const {
    currentMode,
    DashboardData,
    setDashboardData,
    setSales_chart_data,
    BACKEND_URL,
    pageState,
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
          .subtract(1, "months")
          .endOf("month")
          .format("YYYY-MM-DD");
        params.date_range = `${lastMonthStartDate},${lastMonthEndDate}`;
      } else if (selectedMonthProject === "thismonth") {
        const thisMonthStartDate = moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        const thisMonthEndDate = moment().endOf("month").format("YYYY-MM-DD");
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
          .subtract(1, "months")
          .endOf("month")
          .format("YYYY-MM-DD");
        params.date_range = `${lastMonthStartDate},${lastMonthEndDate}`;
      } else if (selectedMonthSales === "thismonth") {
        const thisMonthStartDate = moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        const thisMonthEndDate = moment().endOf("month").format("YYYY-MM-DD");
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
          .subtract(1, "months")
          .endOf("month")
          .format("YYYY-MM-DD");
        params.date_range = `${lastMonthStartDate},${lastMonthEndDate}`;
      } else if (selectedMonthSocial === "thismonth") {
        const thisMonthStartDate = moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        const thisMonthEndDate = moment().endOf("month").format("YYYY-MM-DD");
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
    "Campaign Facebook": <FaFacebookF size={16} color={"#0e82e1"} />,
    "Property Finder": <MdCampaign size={20} color={"#696969"} />,
  };

  const fetchCounter = async (token) => {
    const currentDate = moment().format("YYYY-MM-DD");
    // const currentDate = "2023-01-01";
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
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="mb-10">
              <div className="mb-5 ">
                <div className="flex justify-center bg-primary py-2 mb-4 rounded-full">
                  <h1 className={`text-white text-lg font-semibold`}>
                    Lead Sources
                  </h1>
                </div>

                {hasPermission("leadSource_counts") && (
                  <div className="my-7">
                    <div className="px-4">
                      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
                        {counters && counters?.length > 0
                          ? counters?.map((counter) => (
                              <Box
                                sx={{
                                  padding: "5px 7px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  background:
                                    currentMode === "dark"
                                      ? "#000000"
                                      : "#FFFFFF",
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                  boxShadow:
                                    currentMode === "dark"
                                      ? "0px 1px 1px rgba(66, 66, 66, 1)"
                                      : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                                  height: "30px",
                                  minWidth: "60px",
                                  maxWidth: "100px",
                                }}
                              >
                                {sourceCounters[counter?.leadSource]}
                                <span className="px-2">{counter?.count}</span>
                              </Box>
                            ))
                          : ""}
                        {/* MESSAGE  */}
                        <Box
                          sx={{
                            padding: "5px 7px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background:
                              currentMode === "dark" ? "#000000" : "#FFFFFF",
                            color: currentMode === "dark" ? "white" : "black",
                            boxShadow:
                              currentMode === "dark"
                                ? "0px 1px 1px rgba(66, 66, 66, 1)"
                                : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                            height: "30px",
                            minWidth: "60px",
                            maxWidth: "100px",
                          }}
                        >
                          <BiMessageRoundedDots size={18} color={"#6A5ACD"} />
                          <span className="px-2">{pageState?.mCount}</span>
                        </Box>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-5">
                <div className="flex justify-center bg-primary py-2 mb-4 rounded-full">
                  <h1 className={`text-white text-lg font-semibold`}>
                    TURNOVER
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
                      <span className="font-semibold">SALES</span>
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
                          <option value="alltime">All-Time</option>
                          <option value="lastmonth">Last Month</option>
                          <option value="thismonth">This Month</option>
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
                        <span className="font-semibold">TARGET</span>
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
                        Total revenue achieved with respect to addressed target
                        for the month.
                      </h6>
                    </div>
                    <div
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                      } rounded-md p-2`}
                    >
                      <h6 className="mb-2 p-2">
                        <span className="font-semibold">
                          CLOSED OVER MEETING
                        </span>
                      </h6>
                      <div className="justify-between items-center mb-3">
                        {/* MONTHLY  */}
                        <ReportClosedMeetingDoughnut />
                      </div>
                      <h6 className="text-xs text-center mt-3 italic">
                        Number of total deals closed in comparison to total
                        attended meetings.
                      </h6>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-5">
                <div className="flex justify-center bg-primary py-2 mb-4 rounded-full">
                  <h1 className={`text-white text-lg font-semibold`}>
                    ACHIEVEMENT
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
                      <span className="font-semibold">PERFORMANCE</span>
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
                          <option value="alltime">All-Time</option>
                          <option value="lastmonth">Last Month</option>
                          <option value="thismonth">This Month</option>
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
                      <span className="font-semibold">LEAD SOURCE</span>
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
                          <option value="alltime">All-Time</option>
                          <option value="lastmonth">Last Month</option>
                          <option value="thismonth">This Month</option>
                        </select>
                      </span>
                    </h6>
                    <div className="justify-between items-center">
                      {saleschart_loading ? (
                        <div className="flex items-center space-x-2">
                          <CircularProgress size={20} /> <span>Loading</span>
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
                    PROJECTS
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
                    <span className="font-semibold">PROJECT</span>
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
                        <option value="alltime">All-Time</option>
                        <option value="lastmonth">Last Month</option>
                        <option value="thismonth">This Month</option>
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
