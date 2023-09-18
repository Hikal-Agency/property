import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import CreateOffer from "../../Components/offers/createoffer";
import axios from "../../axoisConfig";
import Loader from "../../Components/Loader";
import OffersList from "../../Components/offers/OffersList";
import usePermission from "../../utils/usePermission";

const Offers = () => {
  const { currentMode, darkModeColors, setopenBackDrop, User, BACKEND_URL } =
    useStateContext();
  const [value, setValue] = useState(0);
  const { hasPermission } = usePermission();

  const [tabValue, setTabValue] = useState(0);
  const [pageBeingScrolled, setPageBeingScrolled] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [btnloading, setbtnloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setbtnloading(false);
    setCurrentPage(1);
    setPageBeingScrolled(1);
  };

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, []);

  const FetchOffers = async (token, page = 1) => {
    if (page > 1) {
      setbtnloading(true);
    }
    try {
      const all_offers = await axios.get(`${BACKEND_URL}/offers?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (page > 1) {
        setOffers((prevOffers) => {
          return [
            ...prevOffers,
            ...all_offers?.data?.offers?.data?.map((offer) => ({
              ...offer,
              page: page,
            })),
          ];
        });
      } else {
        setOffers(() => {
          return [
            ...all_offers?.data?.offers?.data?.map((offer) => ({
              ...offer,
              page: page,
            })),
          ];
        });
      }
      setLoading(false);
      setLastPage(all_offers?.data?.offers?.last_page);
      setbtnloading(false);
      //   console.log("All Offers: ",all_offers)
    } catch (error) {
      console.log("Offers not fetched. ", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchOffers(token, currentPage);
  }, [currentPage, value]);

  return (
    <>
      <div className="flex relative min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full pl-3 ${
              currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            <div className="w-full flex items-center py-3">
              <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark"
                    ? "text-white"
                    : "text-black"
                }`}
              >
                Offers
              </h1>
            </div>

            <Box
              sx={{
                ...darkModeColors,
                "& .MuiTabs-indicator": {
                  height: "100%",
                  borderRadius: "5px",
                  backgroundColor: "#da1f26",
                },
                "& .Mui-selected": {
                  color: "white !important",
                  zIndex: "1",
                },
              }}
              className={`w-full rounded-md overflow-hidden ${
                currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-gray-100"
              } `}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="variant"
                className="w-full px-1 m-1"
              >
                {hasPermission("offers_create") ? (
                  <Tab label="CREATE NEW OFFER" />
                ) : (
                  ""
                )}
                {hasPermission("offers_manager_tab") && (
                  <Tab label="OFFERS FOR MANAGERS" />
                )}
                <Tab label="OFFERS FOR AGENTS" />
              </Tabs>
            </Box>
            <div className="mt-3 pb-3">
              {hasPermission("offers_create") ? (
                <TabPanel value={value} index={0}>
                  <CreateOffer
                    isLoading={loading}
                    tabValue={tabValue}
                    setTabValue={setTabValue}
                  />
                </TabPanel>
              ) : (
                ""
              )}
              {hasPermission("offers_manager_tab") ? (
                <TabPanel value={value} index={1}>
                  <OffersList
                    user={"manager"}
                    lastPage={lastPage}
                    setLastPage={setLastPage}
                    pageBeingScrolled={pageBeingScrolled}
                    setPageBeingScrolled={setPageBeingScrolled}
                    btnloading={btnloading}
                    currentPage={currentPage}
                    offers={offers}
                    setCurrentPage={setCurrentPage}
                  />
                </TabPanel>
              ) : (
                ""
              )}
              <TabPanel
                value={value}
                index={hasPermission("offers_manager_tab") ? 2 : 0}
              >
                <OffersList
                  user={"salesperson"}
                  lastPage={lastPage}
                  setLastPage={setLastPage}
                  pageBeingScrolled={pageBeingScrolled}
                  setPageBeingScrolled={setPageBeingScrolled}
                  btnloading={btnloading}
                  currentPage={currentPage}
                  offers={offers}
                  setCurrentPage={setCurrentPage}
                />
              </TabPanel>
            </div>
              
          </div>
        )}
        {value ? (
          <Box className="fixed z-[10] rounded-t rounded-b rounded-tr-none rounded-br-none top-[100px] right-0 w-max px-2 py-1 bg-black text-white">
            Page {pageBeingScrolled} of {lastPage}
          </Box>
        ) : (
          ""
        )}
      </div>
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Offers;
