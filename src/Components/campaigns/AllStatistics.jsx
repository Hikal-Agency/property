import { Box, MenuItem, Pagination, Select } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import CombinationChart from "../../Components/charts/CombinationChart";
import SalesAmountChartAdmin from "../charts/SalesAmountChartAdmin";
import BarChartStatistics from "../charts/statisticsCharts/BarChartStatistics";
import BubbleChartStat from "../charts/statisticsCharts/BubbleChartStat";
import DoughnutChart from "../charts/statisticsCharts/DoughnutChartState";
import AreaChart from "../charts/statisticsCharts/AreaChart";
import LineChart from "../charts/statisticsCharts/LineChart";
import HorizontalBarChart from "../charts/statisticsCharts/HorizontalBarChart";
import CombineChart from "../charts/statisticsCharts/CombineChart";
import CombinationChartTable from "../charts/statisticsCharts/CombinationTableChart";
import MapChartStatistics from "../charts/statisticsCharts/MapChartStatistics";
import { FaAd, FaThList, FaCheckCircle } from "react-icons/fa";
import TopCampaignsTable from "../charts/statisticsCharts/TopCampaignsTable";

const AllStatistics = ({ pageState, setpageState }) => {
  const { currentMode, BACKEND_URL, darkModeColors, graph_api_token } =
    useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaigns] = useState({});
  const [campaignStats, setCampaignStats] = useState(null);
  const [ads, setAds] = useState();
  const [chartData, setChartData] = useState();
  const [horizontalBarChart, sethorizontalBarChart] = useState();
  const [doughnutChart, setDoughnut] = useState();

  console.log("ChartData: ", chartData);

  const navigate = useNavigate();
  const location = useLocation();

  console.log();
  console.log("Ads: ", ads);

  // const data = [
  //   { amount: campaignStats?.adsCount, title: "Ads", icon: FaAd },
  //   { amount: campaignStats?.adsetsCount, title: "Adsets", icon: FaThList },
  //   {
  //     amount: campaignStats?.activeAdsCount,
  //     title: "Active Ads",
  //     icon: FaCheckCircle,
  //   },
  //   {
  //     amount: campaignStats?.activeAdsetCount,
  //     title: "Active Adsets",
  //     icon: FaCheckCircle,
  //   },
  // ];

  // count of ads adsets
  const FetchCampaignStats = async (campaignId) => {
    try {
      const adsetsPromise = axios.get(
        `https://graph.facebook.com/v16.0/${campaignId}/adsets?summary=true&fields=id,name,status&access_token=${graph_api_token}`
      );

      const adsPromise = axios.get(
        `https://graph.facebook.com/v16.0/${campaignId}/ads?summary=true&fields=id,name,status&access_token=${graph_api_token}`
      );

      const [adsetsResult, adsResult] = await Promise.all([
        adsetsPromise,
        adsPromise,
      ]);

      console.log("ADSERRESULT: ", adsetsResult);

      const adsetsCount = adsetsResult.data.summary.total_count;
      const adsCount = adsResult.data.summary.total_count;

      const activeAdsCount = adsResult.data.data.reduce((count, ad) => {
        if (ad.status === "ACTIVE") {
          count++;
        }
        return count;
      }, 0);

      const activeAdsetsCount = adsetsResult.data.data.reduce(
        (count, adset) => {
          if (adset.status === "ACTIVE") {
            count++;
          }
          return count;
        },
        0
      );

      console.log("Ad Sets Count: ", adsetsCount);
      console.log("Ads Count: ", adsCount);
      console.log("Active Ads Count: ", activeAdsCount);
      console.log("Active Adset Count: ", activeAdsetsCount);

      // Set the fetched counts to state or use them as needed
      const campaignStats = {
        adsetsCount: adsetsCount,
        adsCount: adsCount,
        activeAdsCount: activeAdsCount,
        activeAdsetCount: activeAdsetsCount,
      };

      // Set the campaign stats state with the fetched data
      setCampaignStats(campaignStats);
    } catch (error) {
      console.log("Error occurred while fetching campaign stats: ", error);
    }
  };

  // adseet stats
  const FetchAdsetStats = async (campaignId) => {
    try {
      const adsetsPromise = axios.get(
        `https://graph.facebook.com/v16.0/${campaignId}/adsets?summary=true&fields=id,name,status&access_token=${graph_api_token}`
      );

      const adsetStatsPromises = adsetsPromise.then(async (adsetsResult) => {
        const adsets = adsetsResult.data.data;
        const adsetStatsPromises = adsets?.map((adset) =>
          axios.get(
            `https://graph.facebook.com/v16.0/${adset.id}/insights?fields=clicks&access_token=${graph_api_token}`
          )
        );
        return Promise.all(adsetStatsPromises);
      });

      const [adsetsResult, adsetStatsResults] = await Promise.all([
        adsetsPromise,
        adsetStatsPromises,
      ]);

      console.log("Ad Sets Result: ", adsetsResult);
      console.log("Adset Stats Results: ", adsetStatsResults);

      const adsetsCount = adsetsResult.data.summary.total_count;
      const adsetClicksData = adsetStatsResults.map((statsResult) => {
        console.log("STatsresult: ", statsResult);
        const adsetClicks = statsResult.data.data.reduce(
          (totalClicks, stats) => totalClicks + stats.clicks,
          0
        );

        console.log("total clicks: ", adsetClicks);
        return adsetClicks;
      });

      console.log("Ad Sets Count: ", adsetsCount);
      console.log("Adset Clicks Data: ", adsetClicksData);

      const adsetNames = adsetsResult?.data?.data?.map((adset) => adset.name);

      console.log("Names: ", adsetNames);

      setDoughnut({
        adsetclicks: adsetClicksData,
        adsetData: adsetNames,
      });
    } catch (error) {
      console.log("Error occurred while fetching adset stats: ", error);
    }
  };

  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };

  const columns = [
    {
      field: "id",
      headerName: "#",
      minWidth: "50",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "campaignName",
      headerName: "Ad Name",
      minWidth: 170,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "adset",
      headerName: "Adset",
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "dailyBudget",
      headerName: "Daily Budget",
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "spend",
      headerName: "Spend",
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "cpc",
      headerName: "Cost Per Click",
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "cpm",
      headerName: "CPM",
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "impressions",
    //   headerName: "Impressions",
    //   minWidth: 110,
    //   flex: 1,
    //   headerAlign: "center",
    // },
  ];

  // const row =
  //   ads?.length > 0 &&
  //   ads?.map((ad, index) => ({
  //     id: ad?.id,
  //     campaignName: ad?.name,
  //     status: ad?.status,
  //     adset: ad?.adset?.name,
  //     dailyBudget: ad?.adset?.daily_budget,
  //   }));

  const row =
    ads?.length > 0 &&
    ads?.map((ad, index) => ({
      id: ad?.id,
      campaignName: ad?.name || "No Data",
      status: ad?.status || "No Data",
      adset: ad?.adset || "No Data",
      dailyBudget: ad?.dailyBudget || "No Data",
      spend: ad?.spend || "No Data",
      cpc: ad?.cpc || "No Data",
      cpm: ad?.cpm || "No Data",
      impressions: ad?.impressions || "No Data",
      clicks: ad?.clicks || "No Data",
      conversions: ad?.consversions || "No Conversions",
    }));

  console.log("Row: ", row);

  const totalCounts = {
    cpc:
      row?.length > 0 &&
      row?.reduce((total, ad) => total + (ad?.cpc !== "No Data" ? 1 : 0), 0),
    cpm:
      row?.length > 0 &&
      row?.reduce((total, ad) => total + (ad?.cpm !== "No Data" ? 1 : 0), 0),
    impressions:
      row?.length > 0 &&
      row?.reduce(
        (total, ad) => total + (ad?.impressions !== "No Data" ? 1 : 0),
        0
      ),
    conversions:
      row?.length > 0 &&
      row.reduce(
        (total, ad) =>
          total + (ad.conversions.length !== 0 ? ad.conversions.length : 0),
        0
      ),
  };

  const data = [
    { amount: totalCounts.cpc, title: "CPC" },
    { amount: totalCounts.cpm, title: "CPM" },
    { amount: totalCounts.impressions, title: "Impressions" },
    { amount: totalCounts.conversions, title: "Conversions" },
  ];

  console.log("Data", data);

  const FetchCampaigns = async (e) => {
    try {
      // const relative_campaigns = await axios.get(
      //   `https://graph.facebook.com/v16.0/act_967421490560096/campaigns?fields=name,bid_strategy,daily_budget,special_ad_category,ads{name,adset,bid_amount,status}&access_token=${graph_api_token}`
      // );

      const relative_campaigns = await axios.get(
        "https://graph.facebook.com/v16.0/act_967421490560096/campaigns",
        {
          params: {
            fields:
              "name,bid_strategy,daily_budget,special_ad_category,ads{name,adset,bid_amount,status,insights{clicks}}",
            access_token: graph_api_token,
          },
        }
      );

      setCampaigns(relative_campaigns?.data?.data);

      console.log("Relative Campaigns:  ", relative_campaigns);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const selectCampaign = (e, id, name) => {
    console.log("Selected campaign ID: ", e.target.value);
    console.log("Selected campaign name: ", name);

    const selectedCampaignId = e.target.value;

    const selectedCampaign = campaigns.find(
      (campaign) => campaign.id === selectedCampaignId
    );
    const selectedCampaignName = selectedCampaign ? selectedCampaign.name : "";

    setSelectedCampaigns({
      SelectedCampaign: selectedCampaignId,
      CampaignName: selectedCampaignName,
    });

    FetchSingleCampaign(selectedCampaignId);
  };

  // const FetchSingleCampaign = async (selectedCampaign) => {
  //   setpageState((old) => ({
  //     ...old,
  //     isLoading: true,
  //   }));

  //   axios
  //     .get(
  //       `https://graph.facebook.com/v16.0/${selectedCampaign}/ads?fields=id,name,adset{id,name,daily_budget},status&date_preset=last_year&limit=1000&access_token=${graph_api_token}`
  //     )
  //     .then(async (result) => {
  //       console.log("ads of campaign ");
  //       console.log(result.data);

  //       const adsData = result.data.data;
  //       console.log("adsData: ", adsData);
  //       const adsWithInsights = await Promise.all(
  //         adsData?.map(async (ad) => {
  //           const insightsResult = await axios.get(
  //             `https://graph.facebook.com/v16.0/${ad.id}/insights?fields=spend,cpc,cpm,impressions&date_preset=maximum&access_token=${graph_api_token}`
  //           );
  //           console.log("Insights result: ", insightsResult);
  //           const insightsData = insightsResult.data.data[0];
  //           return {
  //             ...ad,
  //             adset: ad?.adset?.name,
  //             dailyBudget: ad?.adset?.daily_budget,
  //             spend: insightsData?.spend,
  //             cpc: insightsData?.cpc,
  //             cpm: insightsData?.cpm,
  //             impressions: insightsData?.impressions,
  //           };
  //         })
  //       );

  //       console.log("Insights Data: ", adsWithInsights);

  //       setAds(adsWithInsights);
  //       FetchCampaignStats(selectedCampaign);

  //       const rowsdata = adsWithInsights.map((row, index) => ({
  //         id: index + 1,
  //         campaignName: row?.name,
  //         status: row?.status,
  //         adset: row?.adset,
  //         dailyBudget: row?.dailyBudget,
  //         spend: row?.spend,
  //         cpc: row?.cpc,
  //         cpm: row?.cpm,
  //         impressions: row?.impressions,
  //         Cid: row?.id,
  //       }));

  //       setpageState((old) => ({
  //         ...old,
  //         isLoading: false,
  //         data: rowsdata,
  //         total: rowsdata.length,
  //         pageSize: 10,
  //       }));
  //     })
  //     .catch((err) => {
  //       console.log("error occured", err);
  //       console.log(err);
  //     });
  // };

  const FetchSingleCampaign = async (selectedCampaign) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    axios
      .get(
        `https://graph.facebook.com/v16.0/${selectedCampaign}/ads?fields=id,name,adset{id,name,daily_budget},status&date_preset=last_year&limit=1000&access_token=${graph_api_token}`
      )
      .then(async (result) => {
        console.log("ads of campaign ");
        console.log(result.data);

        const adsData = result?.data?.data;
        console.log("adsData: ", adsData);
        const adsWithInsights = await Promise.all(
          adsData?.map(async (ad) => {
            const insightsResult = await axios.get(
              `https://graph.facebook.com/v16.0/${ad.id}/insights?fields=spend,clicks,cpc,cpm,impressions,conversions,gender_targeting
              &date_preset=maximum&access_token=${graph_api_token}`
            );
            console.log("Insights result: ", insightsResult);
            const insightsData = insightsResult.data.data[0];
            const conversions = insightsData?.conversions || [];
            const conversionValues = conversions.map(
              (conversion) => conversion.value
            );

            console.log("Conversinos: ");
            return {
              ...ad,
              adset: ad?.adset?.name,
              dailyBudget: ad?.adset?.daily_budget,
              spend: insightsData?.spend,
              cpc: insightsData?.cpc,
              cpm: insightsData?.cpm,
              impressions: insightsData?.impressions,
              conversions: conversionValues,
              clicks: insightsData?.clicks,
            };
          })
        );

        console.log("Insights Data: ", adsWithInsights);

        const conversionsData = adsWithInsights
          .map((row) => row.conversions)
          .filter((conversions) => conversions.length > 0)
          .map((conversions) => conversions);

        console.log(conversionsData);

        const spendData = adsWithInsights
          .map((row) => row.spend)
          .filter((spend) => spend !== undefined);

        setChartData({
          conversions: conversionsData,
          spend: spendData,
        });

        const impressionsData = adsWithInsights
          .map((row) => row.impressions)
          .filter((impressions) => impressions)
          .map((impressions) => impressions);

        const clicksData = adsWithInsights
          .map((row) => row.clicks)
          .filter((clicks) => clicks)
          .map((clicks) => clicks);

        console.log("CLicks, impr: ", clicksData, impressionsData);

        sethorizontalBarChart({
          impressions: impressionsData,
          clicks: clicksData,
        });

        FetchCampaignStats(selectedCampaign);
        FetchAdsetStats(selectedCampaign);
        setAds(adsWithInsights);

        const rowsdata = adsWithInsights.map((row, index) => ({
          id: index + 1,
          campaignName: row?.name,
          status: row?.status,
          adset: row?.adset,
          dailyBudget: row?.dailyBudget,
          spend: row?.spend,
          cpc: row?.cpc,
          cpm: row?.cpm,
          impressions: row?.impressions,
          Cid: row?.id,
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          total: rowsdata.length,
          pageSize: 10,
        }));
      })
      .catch((err) => {
        console.log("error occured", err);
        console.log(err);
      });
  };

  useEffect(() => {
    // const token = localStorage.getItem("auth-token");
    // FetchSingleCampaign(token);
    FetchCampaigns();
    // eslint-disable-next-line
  }, [pageState.page]);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params) => {
    console.log("Clicked");
    // window.open(`/leadnotes/${params.row.leadId}`);
  };

  const DataGridStyles = {
    "& .MuiButtonBase-root": {
      color: "white",
    },
    // TOOLBAR
    "& .MuiDataGrid-toolbarContainer": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#000000",
      paddingTop: "10px",
      paddingBottom: "10px",
      paddingLeft: "20px",
      paddingRight: "20px",
    },

    "& .MuiInputBase-root": {
      color: "white",
    },
    "& .MuiInputBase-root::before": {
      color: "white",
    },
    "& .MuiInputBase-root:hover::before": {
      color: "white",
    },

    // Background color of header of data grid
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: currentMode === "dark" ? "white" : "white",
    },
    "& .MuiIconButton-sizeSmall": {
      color: currentMode === "dark" ? "white" : "white",
    },
    // background color of main table content
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
      color: currentMode === "dark" ? "white" : "black",
    },
    // changing rows hover color
    "& .css-1uhmucx-MuiDataGrid-root .MuiDataGrid-row:hover .MuiDataGrid-row": {
      backgroundColor: currentMode === "dark" && "#000000",
      border: "none",
    },
    // changing row colors
    " .even": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
    },
    // changing rows right border
    // "& .MuiDataGrid-cell": {
    //   borderRight: "1px solid rgb(240, 240, 240)",
    // },
    // BACKGROUND COLOR OF FOOTER
    "& .MuiDataGrid-footerContainer": {
      borderTop: "none",
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: "white",
    },
    "& .MuiTablePagination-selectLabel": {
      color: "white",
    },
    "& .MuiTablePagination-select ": { color: "white" },
    "& .MuiSvgIcon-fontSizeMedium ": { color: "white" },
    "& .MuiTablePagination-displayedRows": { color: "white" },
    // For inner data styling
    "& .MuiDataGrid-virtualScrollerRenderZone": {
      // backgroundColor: "red",
    },
  };
  // Custom Pagination
  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <>
        {/* <Pagination
          sx={{
            "& .Mui-selected": {
              backgroundColor: "white !important",
              color: "black !important",
              borderRadius: "5px !important",
            },
          }}
          count={pageCount}
          page={page + 1}
          onChange={(event, value) => apiRef.current.setPage(value - 1)}
        /> */}
      </>
    );
  }
  return (
    <div className="pb-10 mb-5">
      <div className={`grid grid-cols-4 gap-3 ${darkModeColors}`}>
        <div>
          <label
            htmlFor="leadOrigin"
            className={`${
              currentMode === "dark" ? "text-white" : "text-dark"
            } `}
          >
            Select a campaign
          </label>
          <Select
            id="leadOrigin"
            value={selectedCampaign.SelectedCampaign}
            onChange={(event) => selectCampaign(event, event.target.value)}
            size="medium"
            className={`w-full mt-1 mb-5 `}
            displayEmpty
            required
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
              },
              "&:hover:not (.Mui-disabled):before": {
                borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
              },
            }}
          >
            <MenuItem value="0" disabled>
              Select Campaign
            </MenuItem>
            {campaigns?.length > 0 ? (
              campaigns?.map((campaign, index) => (
                <MenuItem
                  key={index}
                  value={campaign?.id || ""}
                  name={campaign?.name}
                >
                  {campaign?.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem>No Campaigns found.</MenuItem>
            )}
          </Select>
        </div>
      </div>
      {selectedCampaign.SelectedCampaign && (
        <>
          <div className=" mb-5">
            <div className="mb-4 ml-0">
              {selectedCampaign.SelectedCampaign && (
                <h2
                  className={`${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Campaign:{" "}
                  <span className="text-red-600 font-bold">
                    {selectedCampaign.CampaignName}
                  </span>
                </h2>
              )}
            </div>

            {/* data starts */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-3 text-center">
              {/* {data?.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    currentMode === "dark"
                      ? "bg-gray-900 text-white "
                      : "bg-gray-200 text-main-dark-bg"
                  } h-auto dark:bg-secondary-dark-bg p-2 rounded-md cursor-pointer hover:shadow-sm grid content-center`}
                >
                  {item?.icon && <item.icon className="text-2xl" />}

                  <p className="text-xl font-bold pb-2 text-red-600">
                    {row?.amount}
                  </p>
                  <p
                    className={`text-sm ${
                      currentMode === "dark"
                        ? "text-white"
                        : "text-main-dark-bg-2 font-semibold"
                    }`}
                  >
                    {item.title}
                  </p>
                </div>
              ))} */}
              {data?.length > 0 &&
                data?.map((item, index) => (
                  <div
                    key={index}
                    className={`${
                      currentMode === "dark"
                        ? "bg-gray-900 text-white "
                        : "bg-gray-200 text-main-dark-bg"
                    } h-auto dark:bg-secondary-dark-bg p-2 rounded-md cursor-pointer hover:shadow-sm grid content-center`}
                  >
                    <p className="text-xl font-bold pb-2 text-red-600">
                      {item?.amount}
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
                ))}
            </div>

            <div>
              {/* <div style={{ flex: "1" }}>
                <h6 className="font-semibold w-full">Performance</h6>
              
                <CombineChart combineData={chartData} />
                
              </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3 mt-5">
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white "
                    : "bg-gray-200"
                } col-span-1 h-full w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
              >
                <div className="justify-between items-center ">
                  <h6 className="font-semibold pb-3">Performance</h6>
                  {/* <AreaChart /> */}
                  <CombineChart combineData={chartData} />
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
                  <h6 className="font-semibold pb-3">Top Campaigns</h6>
                  {/* <BarChartStatistics /> */}
                  {/* <MapChartStatistics /> */}
                  <TopCampaignsTable tablData={campaigns} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3 mt-5">
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white "
                    : "bg-gray-200"
                } col-span-1 h-full w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
              >
                <div className="justify-between items-center ">
                  <h6 className="font-semibold pb-3">Demographics</h6>
                  {/* <AreaChart /> */}
                  <HorizontalBarChart barCharData={horizontalBarChart} />
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
                  <h6 className="font-semibold pb-3">Ads Data</h6>
                  {/* <BarChartStatistics /> */}
                  {/* <MapChartStatistics /> */}
                  <CombinationChartTable tablData={row} />
                </div>
              </div>
            </div>
            {/* MANAGER TAGET PROGRESS BAR  */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3"></div>

            {/* data ends*/}
          </div>

          <Box
            width={"100%"}
            sx={DataGridStyles}
            style={{ width: "100%", overflowX: "auto" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-3 pb-3 mt-5">
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white "
                    : "bg-gray-200"
                } col-span-1 h-min w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
                sx={{
                  height: "300px",
                  width: "300px",
                }}
              >
                <div className="justify-between items-center">
                  <h6 className="font-semibold pb-3">Adsets Clicks</h6>
                  <DoughnutChart doughnutChart={doughnutChart} />
                </div>
              </div>

              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white "
                    : "bg-gray-200"
                } col-span-1 h-min w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
              >
                <div className="justify-between items-center">
                  <h6 className="font-semibold pb-3">Closed Projects</h6>
                  <BubbleChartStat />
                  {/* <CombineChart /> */}
                </div>
              </div>

              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white "
                    : "bg-gray-200"
                } col-span-1 h-min w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
              >
                <div className="justify-between items-center h-80">
                  <h6 className="font-semibold pb-3">Locations</h6>
                  {/* <CombinationChartTable /> */}
                  <MapChartStatistics />
                </div>
              </div>
            </div>

            {/* MANAGER TAGET PROGRESS BAR  */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3"></div>

            <DataGrid
              autoHeight
              rows={row}
              columns={columns}
              components={{
                Toolbar: GridToolbar,
                // Pagination: CustomPagination,
              }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  value: searchText,
                  onChange: HandleQuicSearch,
                },
              }}
              sx={{
                boxShadow: 2,
                "& .MuiDataGrid-cell:hover": {
                  cursor: "pointer",
                },
              }}
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default AllStatistics;
