import {
  Box, FormControl,
  TextField,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "../../axoisConfig";
import Loader from "../Loader";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import BubbleChartStat from "../charts/statisticsCharts/BubbleChartStat";
import DoughnutChart from "../charts/statisticsCharts/DoughnutChartState";
import HorizontalBarChart from "../charts/statisticsCharts/HorizontalBarChart";
import CombineChart from "../charts/statisticsCharts/CombineChart";
import CombinationChartTable from "../charts/statisticsCharts/CombinationTableChart";
import MapChartStatistics from "../charts/statisticsCharts/MapChartStatistics";
import TopCampaignsTable from "../charts/statisticsCharts/TopCampaignsTable";

const AllStatistics = ({ pageState, setpageState }) => {
  const { currentMode, User, darkModeColors, graph_api_token, primaryColor } =
    useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaigns] = useState({});
  const [campaignStats, setCampaignStats] = useState(null);
  const [ads, setAds] = useState();
  const [chartData, setChartData] = useState();
  const [horizontalBarChart, sethorizontalBarChart] = useState();
  const [doughnutChart, setDoughnut] = useState();
  const [ageGender, setAgeGender] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedAd, setSelectedAd] = useState();
  const [selectedAdset, setSelectedAdset] = useState();
  const [devices, setdevices] = useState();

  console.log("ChartData: ", chartData);

  console.log();
  console.log("Ads: ", ads);

  console.log("campaign stats: ", campaignStats);

  console.log("age,gender: ", ageGender);

  const FetchCampaignStats = async (campaignId) => {
    try {
      const insightsWithBreakdownsPromise = axios.get(
        `https://graph.facebook.com/v16.0/${campaignId}/insights?access_token=${graph_api_token}&breakdowns=gender,age`
      );

      const insightsWithDeviceBreakdownPromise = axios.get(
        `https://graph.facebook.com/v16.0/${campaignId}/insights?access_token=${graph_api_token}&breakdowns=device_platform`
      );

      const overallInsightsPromise = axios.get(
        `https://graph.facebook.com/v16.0/${campaignId}/insights?access_token=${graph_api_token}&fields=impressions,clicks,cpc,cpm,ctr,spend,website_ctr,actions`
      );

      console.log("overallpromise: ", overallInsightsPromise);

      const [
        insightsWithBreakdownsResult,
        insightsWithDeviceBreakdownsResult,
        overallInsightsResult,
      ] = await Promise.all([
        // adsetsPromise,
        // adsPromise,
        insightsWithBreakdownsPromise,
        insightsWithDeviceBreakdownPromise,
        overallInsightsPromise,
      ]);

      console.log("overallinsights: ", overallInsightsResult);
      // const adsetsCount = adsetsResult.data.data;
      // const adsCount = adsResult.data.data;

      // const activeAdsCount = adsResult.data.data.reduce((count, ad) => {
      //   if (ad.status === "ACTIVE") {
      //     count++;
      //   }
      //   return count;
      // }, 0);

      // const activeAdsetsCount = adsetsResult.data.data.reduce(
      //   (count, adset) => {
      //     if (adset.status === "ACTIVE") {
      //       count++;
      //     }
      //     return count;
      //   },
      //   0
      // );

      const genderData = insightsWithBreakdownsResult.data.data.map(
        (insight) => insight.gender
      );
      const ageData = insightsWithBreakdownsResult.data.data.map(
        (insight) => insight.age
      );

      const devices = insightsWithDeviceBreakdownsResult?.data?.data;
      console.log("devices: ", devices);
      const campaignInsights = overallInsightsResult.data.data[0];
      const cpc = campaignInsights.cpc;
      const cpm = campaignInsights.cpm;
      const impressions = campaignInsights.impressions;
      const clicks = campaignInsights.clicks;
      const ctr = campaignInsights.ctr;
      const spend = campaignInsights.spend;
      const link_clicks = campaignInsights?.actions?.find(
        (action) => action.action_type === "link_click"
      )?.value;

      console.log("linkclicks: ", link_clicks);

      setdevices(devices);

      const campaignStats = {
        // adsetsCount: adsetsCount,
        // adsCount: adsCount,
        // activeAdsCount: activeAdsCount,
        // activeAdsetCount: activeAdsetCount,
        genderData: genderData,
        ageData: ageData,
        cpc: cpc,
        cpm: cpm,
        spend: spend,
        impressions: impressions,
        clicks: clicks,
        ctr: ctr,
        link_clicks: link_clicks,
      };

      console.log("campstats: ", campaignStats);

      setAgeGender([campaignStats?.ageData, campaignStats?.genderData]);

      setCampaignStats(campaignStats);
    } catch (error) {
      console.log("Error occurred while fetching campaign stats: ", error);
    }
  };

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
      field: "campaignName",
      headerName: "Ad Name",
      minWidth: 170,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "adset",
      headerAlign: "center",
      headerName: "Adset",
      minWidth: 110,
      flex: 1,
    },
    {
      field: "dailyBudget",
      headerName: "Daily Budget",
      headerAlign: "center",
      minWidth: 110,
      flex: 1,
    },
    {
      field: "spend",
      headerAlign: "center",
      headerName: "Spend",
      minWidth: 110,
      flex: 1,
    },
    {
      field: "cpc",
      headerAlign: "center",
      headerName: "Cost Per Click",
      minWidth: 110,
      flex: 1,
    },
    {
      field: "cpm",
      headerName: "CPM",
      headerAlign: "center",
      minWidth: 110,
      flex: 1,
    },
    // {
    //   field: "impressions",
    //   headerName: "Impressions",
    //   minWidth: 110,
    //   flex: 1,
    //   headerAlign: "center",
    // },
  ];

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
      ctr: ad?.ctr || "No CTR",
      link_clicks: ad?.link_clicks || "No link clicks",
      reach: ad?.reach || "No Reach",
      frequency: ad?.frequency || "No Frequency",
    }));

  console.log("Row: ", row);

  const totalCounts = {
    cpc: campaignStats?.cpc || "0",
    cpm: campaignStats?.cpm || "0",
    impressions: campaignStats?.impressions || "0",
    link_clicks: campaignStats?.link_clicks || "0",
    clicks: campaignStats?.clicks || "0",
    ctr: campaignStats?.ctr || "0",
    spend: campaignStats?.spend || "0",
  };

  console.log("totalCounts: ", totalCounts);

  const data = [
    { amount: totalCounts.cpc, title: "CPC" },
    { amount: totalCounts.cpm, title: "CPM" },
    { amount: totalCounts.impressions, title: "Impressions" },
    { amount: totalCounts.link_clicks, title: "Link clicks" },
    { amount: totalCounts.clicks, title: "Clicks" },
    { amount: totalCounts.ctr, title: "CTR" },
    { amount: totalCounts.spend, title: "Spend" },
  ];

  console.log("Data", data);

  const FetchCampaigns = async (e) => {
    try {
      setLoading(true);
      const relative_campaigns = await axios.get(
        "https://graph.facebook.com/v16.0/act_967421490560096/campaigns",
        {
          params: {
            fields:
              "name,bid_strategy,daily_budget,special_ad_category,ads{name,adset{id,name},bid_amount,status,insights{clicks}}",
            access_token: graph_api_token,
          },
        }
      );

      setCampaigns(relative_campaigns?.data?.data);
      setLoading(false);

      console.log("Relative Campaigns:  ", relative_campaigns);
    } catch (error) {
      setLoading(false);
      console.error("Error: ", error);
    }
  };

  console.log("slectecampaign data:  ", selectedCampaign);

  const handleselectedAdset = (e) => {
    console.log("id: ", e);
    // setSelectedAdset(e);

    console.log("selectedCamp: ", selectedCampaign);

    const filteredAds = selectedCampaign?.ads.filter(
      (ad) => ad.adset.id === e.target.value
    );

    // setSelectedCampaigns((prevState) => ({
    //   ...prevState,
    //   ads: filteredAds,
    // }));

    setSelectedAd(filteredAds);

    console.log("ads<-adsets: ", filteredAds);
  };

  const selectCampaign = (e, id, name) => {
    console.log("Selected campaign ID: ", e.target.value);
    console.log("Selected campaign name: ", name);

    const selectedCampaignId = e.target.value;

    const selectedCampaign = campaigns.find(
      (campaign) => campaign.id === selectedCampaignId
    );

    if (selectedCampaign) {
      const selectedCampaignName = selectedCampaign.name;
      const selectedAds = selectedCampaign?.ads?.data;
      // const selectedAdsets = selectedAds?.map((ad) => ad.adset);

      const uniqueAdsetsMap = new Map();
      selectedAds?.forEach((ad) => {
        if (!uniqueAdsetsMap.has(ad.adset.name)) {
          uniqueAdsetsMap.set(ad.adset.name, ad.adset);
        }
      });

      const uniqueAdsets = Array.from(uniqueAdsetsMap.values());

      console.log("selected ads: ", selectedAds);
      console.log("selected adset: ", uniqueAdsets);

      setSelectedCampaigns({
        SelectedCampaign: selectedCampaignId,
        CampaignName: selectedCampaignName,
        ads: selectedAds,
        adsets: uniqueAdsets,
      });

      setSelectedAd([]);

      FetchSingleCampaign(selectedCampaignId);
    } else {
      console.log("Campaign not found");
    }
  };

  const FetchSingleCampaign = async (selectedCampaign) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    axios
      .get(
        `https://graph.facebook.com/v16.0/${selectedCampaign}/ads?fields=id,name,adset{id,name,daily_budget,targeting},status&date_preset=last_year&limit=1000&access_token=${graph_api_token}`
      )
      .then(async (result) => {
        console.log("ads of campaign ");
        console.log(result.data);

        const adsData = result?.data?.data;
        console.log("adsData: ", adsData);
        const adsWithInsights = await Promise.all(
          adsData?.map(async (ad) => {
            const insightsResult = await axios.get(
              `https://graph.facebook.com/v16.0/${ad.id}/insights?fields=spend,clicks,cpc,cpm,impressions,conversions,gender_targeting,reach,frequency
              &date_preset=maximum&access_token=${graph_api_token}`
            );
            console.log("Insights result: ", insightsResult);
            const insightsData = insightsResult.data.data[0];
            const conversions = insightsData?.conversions || [];
            const conversionValues = conversions.map(
              (conversion) => conversion.value
            );

            console.log("Conversions: ");
            return {
              ...ad,
              adset: ad?.adset?.name,
              dailyBudget: ad?.adset?.daily_budget,
              targeting: ad?.adset?.targeting,
              spend: insightsData?.spend,
              cpc: insightsData?.cpc,
              cpm: insightsData?.cpm,
              impressions: insightsData?.impressions,
              conversions: conversionValues,
              clicks: insightsData?.clicks,
              reach: insightsData?.reach,
              frequency: insightsData?.frequency,
            };
          })
        );

        console.log("Insights Data: ", adsWithInsights);

        const filterTargetting = [
          ...new Set(adsWithInsights.map((item) => item.targeting)),
        ];

        setLocations(filterTargetting);

        console.log("location: ", filterTargetting);

        const conversionsData = adsWithInsights
          .map((row) => row.conversions)
          .filter((conversions) => conversions.length > 0)
          .map((conversions) => conversions);

        console.log("conversionsdata: ", conversionsData);

        const spendData = adsWithInsights
          .map((row) => row.spend)
          .filter((spend) => spend !== undefined);

        console.log(
          "spenddata, conversions data: ",
          spendData,
          conversionsData
        );

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

        console.log("Clicks, impressions: ", clicksData, impressionsData);

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
          targeting: row?.targeting, // Add this line
          spend: row?.spend,
          cpc: row?.cpc,
          cpm: row?.cpm,
          impressions: row?.impressions,
          Cid: row?.id,
          reach: row?.reach,
          frequency: row?.frequency,
        }));

        console.log("rowdata: ", rowsdata);

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
    FetchCampaigns();
    // eslint-disable-next-line
  }, [pageState.page]);

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
      backgroundColor: primaryColor,
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
      backgroundColor: primaryColor,
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
  if (loading) {
    return <Loader />;
  } else {
    return (
      <div
        className={`pb-10 mb-5 min-h-screen section-container-${currentMode}`}
      >
        <div className={`grid gap-3 ${darkModeColors}`}>
          <div>
            <div className="pl-3 mt-4 flex items-center justify-center mb-6">
              <h4
                className={`inline-block py-1 px-3 rounded bg-primary font-semibold mb-3 text-center text-2xl text-white`}
              >
                Facebook Statistics
              </h4>
            </div>
            <>
              <div className="w-full -mx-2">
                <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiSelect-select": {
                      // padding: "4px",
                      paddingLeft: "6px !important",
                      // paddingRight: "20px",
                      borderRadius: "8px",
                    },
                    "& .MuiInputBase-root": {
                      width: "150px",
                      marginRight: "10px",
                    },
                  }}
                  className="w-full flex flex-wrap justify-center items-center px-2"
                >
                  <div>
                    <FormControl
                      className="w-full mt-1 mb-5 mr-2"
                      variant="outlined"
                      required
                    >
                      {/* <InputLabel
                        id="campaign-label"
                        sx={{
                          color:
                            currentMode === "dark"
                              ? "#ffffff !important"
                              : "#000000 !important",
                        }}
                      >
                        Campaign
                      </InputLabel> */}
                      <TextField
                        id="campaign-label"
                        value={selectedCampaign.SelectedCampaign}
                        onChange={(event) =>
                          selectCampaign(event, event.target.value)
                        }
                        labelId="campaign-label"
                        label="Select Campaign"
                        size="medium"
                        select
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              currentMode === "dark" ? "#ffffff" : "#000000",
                          },
                          "&:hover:not(.Mui-disabled):before": {
                            borderColor:
                              currentMode === "dark" ? "#ffffff" : "#000000",
                          },
                        }}
                        displayEmpty
                      >
                        <MenuItem value="0" selected disabled>
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
                          <MenuItem disabled>No Campaigns found.</MenuItem>
                        )}
                      </TextField>
                    </FormControl>
                  </div>

                  <div>
                    <FormControl
                      className="w-full mt-1 mb-5 mr-2"
                      variant="outlined"
                      value={selectedAdset}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            currentMode === "dark" ? "#ffffff" : "#000000",
                        },
                        "&:hover:not(.Mui-disabled):before": {
                          borderColor:
                            currentMode === "dark" ? "#ffffff" : "#000000",
                        },
                      }}
                    >
                      <InputLabel
                        id="adset-label"
                        sx={{
                          color:
                            currentMode === "dark"
                              ? "#ffffff !important"
                              : "#000000 !important",
                        }}
                      >
                        Ad Set
                      </InputLabel>
                      <Select
                        // value={selectedAdset}
                        labelId="adset-label"
                        label="Select Ad Set"
                        onChange={handleselectedAdset}
                      >
                        <MenuItem value="0" selected disabled>
                          Select Ad Set
                        </MenuItem>
                        {selectedCampaign?.adsets?.length > 0 ? (
                          selectedCampaign?.adsets?.map((adset, index) => (
                            <MenuItem key={index} value={adset?.id || ""}>
                              {adset?.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No Ad Sets found.</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </div>

                  <div>
                    {selectedAd?.length > 0 ? (
                      <FormControl
                        className="w-full mt-1 mb-5 mr-2"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              currentMode === "dark" ? "#ffffff" : "#000000",
                          },
                          "&:hover:not(.Mui-disabled):before": {
                            borderColor:
                              currentMode === "dark" ? "#ffffff" : "#000000",
                          },
                        }}
                      >
                        <InputLabel
                          id="ad-label"
                          sx={{
                            color:
                              currentMode === "dark"
                                ? "#ffffff !important"
                                : "#000000 !important",
                          }}
                        >
                          Select Ad
                        </InputLabel>
                        <Select
                          // value={selectedAd}
                          // onChange={(event) => selectAd(event, event.target.value)}
                          labelId="ad-label"
                          label="Select Ad"
                          value={selectedAd}
                        >
                          <MenuItem value="0" selected disabled>
                            Select Ad
                          </MenuItem>
                          {selectedAd !== "0" && selectedAd.length > 0 ? (
                            selectedAd?.map((ad, index) => (
                              <MenuItem key={index} value={ad?.id || ""}>
                                {ad?.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No Ads found.</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    ) : (
                      <FormControl
                        className="w-full mt-1 mb-5"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              currentMode === "dark" ? "#ffffff" : "#000000",
                          },
                          "&:hover:not(.Mui-disabled):before": {
                            borderColor:
                              currentMode === "dark" ? "#ffffff" : "#000000",
                          },
                        }}
                      >
                        <InputLabel
                          id="ad-label2"
                          sx={{
                            color:
                              currentMode === "dark"
                                ? "#ffffff !important"
                                : "#000000 !important",
                          }}
                        >
                          Select Ad
                        </InputLabel>
                        <Select
                          // value={selectedAd}
                          // onChange={(event) => selectAd(event, event.target.value)}

                          labelId="ad-label2"
                          id="ad-label2"
                          label="Select Ad"
                          value={selectedAd}
                        >
                          <MenuItem selected value="0" disabled>
                            Select Ad
                          </MenuItem>
                          {selectedCampaign?.ads?.length > 0 ? (
                            selectedCampaign?.ads?.map((ad, index) => (
                              <MenuItem key={index} value={ad?.id || ""}>
                                {ad?.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No Ads found.</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    )}
                  </div>
                </Box>
              </div>
            </>
          </div>
        </div>
        {selectedCampaign.SelectedCampaign && (
          <>
            <div className=" mb-5">
              <div className="mb-4 mt-5 ml-0">
                {selectedCampaign.SelectedCampaign && (
                  <h2
                    className={`text-center ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Campaign:{" "}
                    <span className="text-primary font-bold">
                      {selectedCampaign.CampaignName}
                    </span>
                  </h2>
                )}
              </div>
              <h1
                className={`text-xl border-l-[4px] ml-1 pl-1 mb-4 mt-5 font-bold ${
                  currentMode === "dark"
                    ? "text-white border-white"
                    : "text-primary font-bold border-primary"
                }`}
              >
                ● Overview
              </h1>

              {/* data starts */}
              <div className="grid md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 gap-y-3 text-center">
                {data?.length > 0 &&
                  data?.map((item, index) => (
                    <div
                      key={index}
                      className={`${
                        currentMode === "dark"
                          ? "bg-[#1c1c1c] text-white "
                          : "bg-primary text-black"
                      } rounded-lg h-20 p-2 shadow cursor-pointer hover:shadow-sm grid content-center`}
                    >
                      <p className="text-xl font-bold pb-2 text-white">
                        {item?.amount}
                      </p>
                      <p
                        className={`text-sm ${
                          currentMode === "dark"
                            ? "text-white"
                            : "text-white font-semibold"
                        }`}
                      >
                        {item?.title}
                      </p>
                    </div>
                  ))}
              </div>
              <h1
                className={`text-xl border-l-[4px] ml-1 pl-1 mb-4 mt-7 font-bold ${
                  currentMode === "dark"
                    ? "text-white border-white"
                    : "text-primary font-bold border-primary"
                }`}
              >
                ● Performance & Interactions
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3">
                <div
                  className={`${
                    currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white "
                      : "bg-white"
                  } col-span-1 h-96 shadow w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
                  // style={{ height: "300px" }}
                >
                  <div className="justify-between items-center ">
                    <h6 className="font-semibold pb-3 text-primary">
                      Performance
                    </h6>
                    {/* <AreaChart /> */}
                    <CombineChart combineData={chartData} />
                  </div>
                </div>

                <div
                  className={`${
                    currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white "
                      : "bg-white"
                  } col-span-1 h-96 shadow w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
                >
                  <div className="justify-between items-center">
                    <h6 className="font-semibold pb-3 text-primary">
                      Top Campaigns
                    </h6>
                    <TopCampaignsTable tablData={campaigns} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3 mt-5">
                <div
                  className={`${
                    currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white "
                      : "bg-white"
                  } col-span-1 w-full h-[300px] shadow rounded-md p-5 cursor-pointer hover:shadow-sm`}
                  sx={{
                    height: "300px",
                    width: "300px",
                  }}
                >
                  <div className="justify-between items-center">
                    <h6 className="font-semibold pb-3 text-primary">Devices</h6>
                    <DoughnutChart doughnutChart={devices} />
                    {/* <DoughnutChart doughnutChart={doughnutChart} /> */}
                  </div>
                </div>

                <div
                  className={`${
                    currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white "
                      : "bg-white"
                  } col-span-1 h-96 shadow w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
                >
                  <div className="justify-between items-center">
                    <h6 className="font-semibold pb-3  text-primary">
                      Ads Data
                    </h6>
                    <CombinationChartTable tablData={row} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-x-3 gap-y-3 pb-3 mt-5">
                <div
                  className={`${
                    currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white "
                      : "bg-white"
                  } col-span-1 h-[450px] shadow w-full rounded-md p-5 cursor-pointer hover:shadow-sm flex flex-col justify-start`}
                >
                  <h6 className="font-semibold pb-3 text-primary">
                    Frequency And Reach
                  </h6>
                  <div className="flex-grow flex items-center justify-center">
                    <BubbleChartStat bubbleChartData={row} />
                    {/* <CombineChart /> */}
                  </div>
                </div>
              </div>
            </div>

            <Box
              width={"100%"}
              sx={DataGridStyles}
              style={{ width: "100%", overflowX: "auto" }}
            >
              <h1
                className={`text-xl border-l-[4px] ml-1 pl-1 mb-4 mt-2 font-bold ${
                  currentMode === "dark"
                    ? "text-white border-white"
                    : "text-primary font-bold border-primary"
                }`}
              >
                ● Audience
              </h1>
              <div className="flex justify-center">
                <div className="grid w-full px-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3 mt-2">
                  {/* other commented out code */}

                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white "
                        : "bg-white"
                    } col-span-1 h-full shadow w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
                  >
                    <div className="flex w-full flex-col justify-between items-center h-full">
                      <h6 className="font-semibold pb-3 text-primary">
                        Audience
                      </h6>
                      <div className="flex-grow">
                        <HorizontalBarChart barCharData={ageGender} />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white "
                        : "bg-white"
                    } col-span-1 h-min shadow w-full rounded-md p-5 cursor-pointer hover:shadow-sm`}
                  >
                    <div className="justify-between items-center h-80">
                      <h6 className="font-semibold pb-3 text-primary">
                        Locations
                      </h6>
                      <MapChartStatistics locationData={locations} />
                    </div>
                  </div>
                </div>
              </div>

              {/* MANAGER TAGET PROGRESS BAR  */}
              <div
                className={`${currentMode}-mode-datatable grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-3 pb-3`}
              ></div>

              <h1
                className={`text-xl border-l-[4px] ml-1 pl-1 mb-4 mt-5 font-bold ${
                  currentMode === "dark"
                    ? "text-white border-white"
                    : "text-primary font-bold border-primary"
                }`}
              >
                ● Ads Details
              </h1>

              <DataGrid
              disableDensitySelector
                autoHeight
                rows={row}
                columns={columns}
                components={{
                  Toolbar: GridToolbar,
                  // Pagination: CustomPagination,
                }}
                rowsPerPageOptions={[]}
                componentsProps={{
                  toolbar: {
                    printOptions: { disableToolbarButton: User?.role !== 1 },
                    csvOptions: { disableToolbarButton: User?.role !== 1 },
                    showQuickFilter: true,
                    value: searchText,
                    onChange: HandleQuicSearch,
                  },
                }}
                sx={{
                  ...DataGridStyles,
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
  }
};

export default AllStatistics;
