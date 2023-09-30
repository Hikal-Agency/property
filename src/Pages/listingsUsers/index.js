import { Button } from "@material-tailwind/react";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import { useEffect, useState, useRef } from "react";
import axios from "../../axoisConfig";
import AddUserModel from "../../Components/addUser/AddUserModel";
import SecondaryListings from "../../Components/Listings/SecondaryListings";
import AddNewListingModal from "../../Components/Listings/AddNewListingModal";
import { Link } from "react-router-dom";
import { BsBuildingAdd, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import moment from "moment";
import BuyersSellers from "../../Components/Listings/BuyersSellers";

const ListingUsers = () => {
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    pageState,
    setpageState,
    User,
    darkModeColors,
  } = useStateContext();
  const { hasPermission } = usePermission();
  const [tabValue, setTabValue] = useState(0);

  const [value, setValue] = useState(0);
  const [listing, setListings] = useState([]);
  const [lastPage, setLastPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(false);
  const [btnloading, setbtnloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageBeingScrolled, setPageBeingScrolled] = useState(1);
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const handleCloseListingModal = () => setListingModalOpen(false);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("auth-token");

  const [filters, setFilters] = useState({
    bedrooms: null,
    bathrooms: null,
    sort: null,
    sold: null,
    property: null,
    category: null,
  });
  const isFilterApplied = Object.values(filters).some(
    (value) => value !== null
  );

  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // setbtnloading(false);
    // setCurrentPage(1);
    // setPageBeingScrolled(1);
  };

  const FetchListings = async (token, page = 1) => {
    setLoading(true);
    if (page > 1) {
      setbtnloading(true);
    }
    let url = `${BACKEND_URL}/listings?page=${page}`;
    if (filters?.bedrooms) url += `&bedrooms=${filters?.bedrooms}`;
    if (filters?.bathrooms) url += `&bathrooms=${filters?.bathrooms}`;
    if (filters?.property) url += `&property_type=${filters?.property}`;
    if (filters?.category) url += `&listing_type=${filters?.category}`;

    if (searchCriteria === "city") url += `&city=${searchQuery}`;
    if (searchCriteria === "project") url += `&project=${searchQuery}`;
    if (searchCriteria === "area") url += `&area=${searchQuery}`;

    try {
      const all_listings = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("all listings: ", all_listings);
      let filteredListings = all_listings?.data?.data?.data || [];

      // default sorting listing status = New
      filteredListings = filteredListings?.filter((listing) => {
        return listing?.listing_status.toLowerCase() === "new";
      });

      // sort by sold status
      if (filters?.sold) {
        filteredListings = filteredListings?.filter((listing) => {
          return listing?.listing_status.toLowerCase() === "sold";
        });
      }

      console.log("sold: ", filters?.sold);

      // sort by price
      if (filters?.sort == "sortByHigh") {
        filteredListings = filteredListings.sort((a, b) =>
          a.price > b.price ? -1 : 1
        );
      } else if (filters?.sort == "sortByLow") {
        filteredListings = filteredListings?.sort((a, b) =>
          a.price < b.price ? -1 : 1
        );
      } else if (filters?.sort === "latest") {
        filteredListings = filteredListings.sort((a, b) =>
          moment(b.created_at).isBefore(moment(a.created_at)) ? -1 : 1
        );
      }
      console.log("filtered listings: ", filteredListings);

      if (page > 1) {
        setListings((prevOffers) => {
          return [
            ...prevOffers,
            ...filteredListings?.map((listing) => ({
              ...listing,
              page: page,
            })),
          ];
        });
      } else {
        setListings(() => {
          return [
            ...filteredListings?.map((listing) => ({
              ...listing,
              page: page,
            })),
          ];
        });
      }
      setLoading(false);
      setLastPage(all_listings?.data?.last_page);
      setTotal(all_listings?.data?.data?.total);
      setbtnloading(false);
      //   console.log("All Offers: ",all_listings)
    } catch (error) {
      console.log("listings not fetched. ", error);
      toast.error("Unable to fetch listings.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // open listing modal
  const handleOpenListingModal = () => {
    setListingModalOpen(true);
  };

  const HandleOpenModel = () => {
    console.log("Model Open:");
    setModel(true);
  };

  const HandleModelClose = () => {
    console.log("Model Close:");

    setModel(false);
  };

  useEffect(() => {
    FetchListings(token, currentPage);
  }, [currentPage, value, filters, searchQuery]);

  return (
    <>
      <div className="flex min-h-screen ">
        <div
          className={`w-full p-4 ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="">
            {model && (
              <AddUserModel
                handleOpenModel={HandleOpenModel}
                addUserModelClose={HandleModelClose}
              />
            )}
            <div className="flex justify-between items-center ">
              <div className="flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Buyers/Sellers{" "}
                  <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                    {total}
                  </span>
                </h1>
              </div>
            </div>
            <div className={`flex items-center justify-between`}>
              <Box className={`pt-3 border-t-1 overflow-hidden mb-3`}>
                <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiTabs-indicator": {
                      height: "100%",
                      borderRadius: "5px",
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
                    {/* {hasPermission("offers_create") ? ( */}
                    <Tab label="Sellers " />
                    {/* )} */}

                    {/* {hasPermission("offers_manager_tab") && ( */}
                    <Tab label="Buyers" />
                    {/* )} */}
                  </Tabs>
                </Box>
              </Box>
            </div>

            <TabPanel value={value} index={0}>
              <BuyersSellers
                listing={listing}
                setCurrentPage={setCurrentPage}
                setPageBeingScrolled={setPageBeingScrolled}
                currentPage={currentPage}
                lastPage={lastPage}
                FetchListings={FetchListings}
                loading={loading}
                setLoading={setLoading}
                tabValue={tabValue}
                setTabValue={setTabValue}
              />
            </TabPanel>
          </div>
        </div>
      </div>
    </>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default ListingUsers;
