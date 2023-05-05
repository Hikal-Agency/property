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

const AllCampaigns = ({ pageState, setpageState }) => {
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
          adsData.map(async (ad) => {
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
    window.open(`/leadnotes/${params.row.leadId}`);
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
    <div className="pb-10">
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
            value={campaigns}
            onChange={selectCampaign || "23852162763410143"}
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
                <MenuItem key={index} value={campaign?.id || ""}>
                  {campaign?.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem>No Campaigns found.</MenuItem>
            )}
          </Select>
        </div>
      </div>
      <Box
        width={"100%"}
        sx={DataGridStyles}
        style={{ width: "100%", overflowX: "auto" }}
      >
        <DataGrid
          autoHeight
          rows={row}
          // onRowClick={handleRowClick}
          // rowCount={pageState.total}
          // loading={pageState.isLoading}
          // rowsPerPageOptions={[30, 50, 75, 100]}
          // pagination
          // paginationMode="server"
          // page={pageState.page - 1}
          // pageSize={pageState.pageSize}
          // onPageChange={(newPage) => {
          //   setpageState((old) => ({ ...old, page: newPage + 1 }));
          // }}
          // onPageSizeChange={(newPageSize) =>
          //   setpageState((old) => ({ ...old, pageSize: newPageSize }))
          // }
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
          // getRowClassName={(params) =>
          //   params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          // }
        />
      </Box>
    </div>
  );
};

export default AllCampaigns;
