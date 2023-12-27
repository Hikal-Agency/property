import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import Loader from "../../Components/Loader";
import MenuList from "../../Components/OfficeBoy_Comp/MenuList";
import usePermission from "../../utils/usePermission";
import { Button } from "@mui/material";

const Menu = () => {
  const {
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
    themeBgImg,
    t,
    primaryColor,
  } = useStateContext();
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
            className={`w-full p-4 ${
              !themeBgImg & (currentMode === "dark" ? "bg-black" : "bg-white")
            }
            ${currentMode === "dark" ? "text-white" : "text-black"}`}
          >
            <div className="w-full flex justify-between items-center pb-3">
              <div className="flex items-center">
                <div className="bg-primary h-10 w-1 rounded-full"></div>
                <h1
                  className={`text-lg font-semibold mx-2 uppercase ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("menu_menu")}
                </h1>
              </div>
              <Button
                style={{
                  background: `${primaryColor}`,
                  color: "#fff",
                }}
              >
                Inventory
              </Button>
            </div>

            <MenuList
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
          </div>
        )}
      </div>
    </>
  );
};

export default Menu;
