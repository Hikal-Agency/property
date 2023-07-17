import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import CreateOffer from "../../Components/offers/createoffer";
import axios from "axios";
import Loader from "../../Components/Loader";
import OffersList from "../../Components/offers/OffersList";

const Offers = () => {
  const { currentMode, darkModeColors, setopenBackDrop, User, BACKEND_URL } =
    useStateContext();
    const [value, setValue] = useState(0);
    
    const [tabValue, setTabValue] = useState(0);
    const [pageBeingScrolled, setPageBeingScrolled] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [offers, setOffers] = useState([]);
    const [btnloading, setbtnloading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handleChange = (event, newValue) => {
      console.log("newvalue: ", newValue);
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
      {/* <ToastContainer/> */}
      <div className="flex relative min-h-screen">
      {loading ? <Loader/> :
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className={`w-full `}>
            <div className="pl-3">
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-black"
                } p-5 rounded-md my-5 mb-10`}
              >
                <h4 className="font-semibold pb-5">Offers</h4>
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
                    currentMode === "dark" ? "bg-black" : "bg-white"
                  } `}
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="standard"
                    className="w-full px-1 m-1"
                  >
                    {User?.role !== 7 ? <Tab label="CREATE NEW OFFER" /> : ""}
                    {(User?.role === 1 || User?.role === 2) && (
                      <Tab label="FOR MANAGERS" />
                    )}
                    <Tab label="FOR AGENTS" />
                  </Tabs>
                </Box>
                <div className="mt-3 pb-3">
                  {User?.role !== 7 ? (
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
                  {User?.role === 1 || User?.role === 2 ? (
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
                    index={
                      User?.role === 1 || User?.role === 2
                        ? 2
                        : User?.role === 3
                        ? 1
                        : 0
                    }
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
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      }
        {value ? (
          <Box className="fixed z-[10] rounded-t rounded-b rounded-tr-none rounded-br-none top-[100px] right-0 w-max px-2 py-1 bg-black text-white">
            Page {pageBeingScrolled} of {lastPage}
          </Box>
        ) : ""}
      </div>
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Offers;
