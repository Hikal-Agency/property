import { useStateContext } from "../../context/ContextProvider";
import ReportProjectBar from "../../Components/charts/ReportProjectBar";
import ReportMeetingsClosed from "../../Components/charts/ReportMeetingsClosed";
import DoughnutChart from "../../Components/charts/DoughnutChart";
import SalesAmountChartAdmin from "../../Components/charts/SalesAmountChartAdmin";
import ReportClosedMeetingDoughnut from "../../Components/charts/ReportClosedMeetingDoughnut";
import { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import SocialChart from "../../Components/charts/SocialChart";
import { toast } from "react-toastify";


const Reports = () => {
  const {
    currentMode,
    DashboardData,
    setDashboardData,
    setSales_chart_data,
    BACKEND_URL,
  } = useStateContext();
  const [saleschart_loading, setsaleschart_loading] = useState(true);
  const [loading, setloading] = useState(true);
  const [socialChartData, setSocialChartData] = useState([]);

  const FetchProfile = (token) => {
    axios
      .get(`${BACKEND_URL}/dashboard?page=1`, {
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


  const fetchSocialChart = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const urls = [`${BACKEND_URL}/socialchart`];
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

  useEffect(() => {
    fetchData();
    fetchSocialChart();
    const token = localStorage.getItem("auth-token");
    FetchProfile(token);
  }, []);

  if (loading) {
    return <Loader />;
  } else {
    return (
      <>
        {/* <ToastContainer/> */}
        <div className="flex min-h-screen">
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className={`w-full `}>
              <div className="pl-3">
                <div className="my-5 mb-10">
                  <div className="grid grid-cols-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3">
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-black"
                      } rounded-md p-2`}
                    >
                      <h6 className="mb-2 p-2">
                        <span className="font-semibold">Sales</span>
                        <span className="float-right">
                          <select
                            className={`${
                              currentMode === "dark"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            } text-xs rounded-md p-1`}
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
                          <SalesAmountChartAdmin />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`${
                          currentMode === "dark" ? " text-white" : "text-black"
                        } rounded-md p-2`}
                      >
                        <div className="justify-between items-center mb-3">
                          {/* MONTHLY  */}
                          <DoughnutChart
                            target={DashboardData?.user?.target}
                            target_reached={DashboardData?.target_reached}
                            target_remaining={DashboardData?.target_remaining}
                          />
                        </div>
                        <h6 className="text-xs text-center mt-3 italic">
                          Total revenue achieved with respect to addressed
                          target for the month.
                        </h6>
                      </div>
                      <div
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-black"
                        } rounded-md p-2`}
                      >
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
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-black"
                      } col-span-2 rounded-md p-2`}
                    >
                      <h6 className="mb-2 p-2">
                        <span className="font-semibold">Performance</span>
                        <span className="float-right">
                          <select
                            className={`${
                              currentMode === "dark"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            } text-xs rounded-md p-1`}
                          >
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

                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-black"
                      } rounded-md col-span-2 p-2`}
                    >
                      <h6 className="mb-2 p-2">
                        <span className="font-semibold">Social Chart</span>
                        <span className="float-right">
                          <select
                            className={`${
                              currentMode === "dark"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            } text-xs rounded-md p-1`}
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
                          <SocialChart data={socialChartData} />
                        )}
                      </div>
                    </div>

                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-black"
                      } rounded-md p-3`}
                    >
                      <h6 className="mb-2 p-2">
                        <span className="font-semibold">Project</span>
                        <span className="float-right">
                          <select
                            className={`${
                              currentMode === "dark"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            } text-xs rounded-md p-1`}
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
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        </div>
      </>
    );
  }
};

export default Reports;
