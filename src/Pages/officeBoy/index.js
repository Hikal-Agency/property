import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import Loader from "../../Components/Loader";
import MenuList from "../../Components/OfficeBoy_Comp/MenuList";
import usePermission from "../../utils/usePermission";
import { Button } from "@mui/material";
import Inventory from "../../Components/OfficeBoy_Comp/Inventory";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

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
      const all_menu = await axios.get(`${BACKEND_URL}/items?&page=${page}`, {
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

  const Additional = () => {
    return (
      <>
        {hasPermission("displayInventory") && (
          <button
            onClick={() => setOpenInventory(true)}
            className={`${themeBgImg ? "bg-primary" : currentMode === "dark" 
              ? "bg-primary-dark-neu" : "bg-primary-light-neu"
            } px-3 py-2 rounded-md uppercase text-white`}
          >
            {t("product_inventory")}
          </button>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex relative min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-5 mt-2 ${!themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
              }
            ${currentMode === "dark" ? "text-white" : "text-black"}`}
          >
            <HeadingTitle
              title={t("menu_menu")}
              additional={<Additional />}
            />

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
