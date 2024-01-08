import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import Loader from "../../Components/Loader";
import MenuList from "../../Components/OfficeBoy_Comp/MenuList";
import usePermission from "../../utils/usePermission";
import { Button } from "@mui/material";
import Inventory from "../../Components/OfficeBoy_Comp/Inventory";

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
  const [menu, setMenu] = useState([]);
  const [btnloading, setbtnloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openInventory, setOpenInventory] = useState(false);

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

  const FetchMenu = async (token, page = 1) => {
    if (page > 1) {
      setbtnloading(true);
    }
    try {
      const all_menu = await axios.get(`${BACKEND_URL}/items?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("menu items::: ", all_menu);

      if (page > 1) {
        setMenu((prevMenu) => {
          return [
            ...prevMenu,
            ...all_menu?.data?.data?.map((menu) => ({
              ...menu,
              page: page,
            })),
          ];
        });
      } else {
        setMenu(() => {
          return [
            ...all_menu?.data?.data?.map((menu) => ({
              ...menu,
              page: page,
            })),
          ];
        });
      }
      setLoading(false);
      setLastPage(all_menu?.data?.data?.meta?.last_page);
      setbtnloading(false);
      //   console.log("All menu: ",all_menu)
    } catch (error) {
      console.log("menu not fetched. ", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchMenu(token, currentPage);
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
              {hasPermission("displayInventory") && (
                <Button
                  style={{
                    background: `${primaryColor}`,
                    color: "#fff",
                  }}
                  onClick={() => setOpenInventory(true)}
                >
                  {t("product_inventory")}
                </Button>
              )}
            </div>

            <MenuList
              user={"manager"}
              lastPage={lastPage}
              setLastPage={setLastPage}
              pageBeingScrolled={pageBeingScrolled}
              setPageBeingScrolled={setPageBeingScrolled}
              btnloading={btnloading}
              currentPage={currentPage}
              menu={menu}
              setCurrentPage={setCurrentPage}
            />
            {openInventory && (
              <Inventory
                openInventory={openInventory}
                setOpenInventory={setOpenInventory}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Menu;
