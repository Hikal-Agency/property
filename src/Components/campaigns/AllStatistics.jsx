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

const AllStatistics = ({ pageState, setpageState }) => {
  const { currentMode, BACKEND_URL, darkModeColors, graph_api_token } =
    useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [ads, setAds] = useState();
  // eslint-disable-next-line
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Ads: ", ads);

  // Model Variables
  // const [LeadModelOpen, setLeadModelOpen] = useState(false);
  // const handleLeadModelOpen = () => setLeadModelOpen(true);
  // const handleLeadModelClose = () => setLeadModelOpen(false);

  const data = [
    { amount: "10", title: "Fresh Leads", icon: FaChartLine },
    { amount: "20", title: "Manager Data", icon: FaChartLine },
    { amount: "30", title: "Agent Data", icon: FaChartLine },
    { amount: "30", title: "Agent Data", icon: FaChartLine },
    { amount: "30", title: "Agent Data", icon: FaChartLine },
    { amount: "30", title: "Agent Data", icon: FaChartLine },
  ];

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
    }));

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
              "name,bid_strategy,daily_budget,special_ad_category,ads{name,adset,bid_amount,status}",
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

  const selectCampaign = (e) => {
    console.log("Selected campaign: ", e.target.value);
    const selectedCampaign = e.target.value;

    FetchSingleCampaign(selectedCampaign);
  };

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

        const adsData = result.data.data;
        console.log("adsData: ", adsData);
        const adsWithInsights = await Promise.all(
          adsData?.map(async (ad) => {
            const insightsResult = await axios.get(
              `https://graph.facebook.com/v16.0/${ad.id}/insights?fields=spend,cpc,cpm,impressions&date_preset=maximum&access_token=${graph_api_token}`
            );
            console.log("Insights result: ", insightsResult);
            const insightsData = insightsResult.data.data[0];
            return {
              ...ad,
              adset: ad?.adset?.name,
              dailyBudget: ad?.adset?.daily_budget,
              spend: insightsData?.spend,
              cpc: insightsData?.cpc,
              cpm: insightsData?.cpm,
              impressions: insightsData?.impressions,
            };
          })
        );

        console.log("Insights Data: ", adsWithInsights);

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
      <div className=" mb-5">
        {/* data starts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-3 text-center">
          {data?.map((item, index) => (
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
                {item.amount}
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
          ))}
        </div>

        <div
          className={`${
            currentMode === "dark" ? "bg-gray-900 text-white " : "bg-gray-200"
          } h-full w-full rounded-md p-5 cursor-pointer mt-5`}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ flex: "1" }}>
            <h6 className="font-semibold w-full">Performance</h6>
            {/* <LineChart /> */}
            <CombineChart />
            {/* <CombinationChartTable /> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3 mt-5">
          <div
            className={`${
              currentMode === "dark" ? "bg-gray-900 text-white " : "bg-gray-200"
            } col-span-1 h-full w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
          >
            <div className="justify-between items-center ">
              <h6 className="font-semibold pb-3">Demographics</h6>
              {/* <AreaChart /> */}
              <HorizontalBarChart />
            </div>
          </div>

          <div
            className={`${
              currentMode === "dark" ? "bg-gray-900 text-white " : "bg-gray-200"
            } col-span-1 h-full w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
          >
            <div className="justify-between items-center">
              <h6 className="font-semibold pb-3">Table Data</h6>
              {/* <BarChartStatistics /> */}
              {/* <MapChartStatistics /> */}
              <CombinationChartTable />
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
              currentMode === "dark" ? "bg-gray-900 text-white " : "bg-gray-200"
            } col-span-1 h-min w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
            sx={{
              height: "300px",
              width: "300px",
            }}
          >
            <div className="justify-between items-center">
              <h6 className="font-semibold pb-3">Sales</h6>
              <DoughnutChart />
            </div>
          </div>

          <div
            className={`${
              currentMode === "dark" ? "bg-gray-900 text-white " : "bg-gray-200"
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
              currentMode === "dark" ? "bg-gray-900 text-white " : "bg-gray-200"
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
    </div>
  );
};

export default AllStatistics;
