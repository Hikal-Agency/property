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
import BuyersSellers from "../../Components/Listings/Sellers";
import Sellers from "../../Components/Listings/Sellers";

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
  const [manualSellers, setManualSellers] = useState([]);
  const [leadSellers, setLeadSellers] = useState([]);
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

    // const listingsUrl = `${BACKEND_URL}/listings?page=${page}`;
    const listingsUrl = `${BACKEND_URL}/listings?is_fill=1&page=${page}`;
    // const leadsUrl = `${BACKEND_URL}/coldLeads?page=${page}&coldCall=0`;
    const leadsUrl = `${BACKEND_URL}/listings?is_fill=2&page=${page}`;

    try {
      const [listingsResponse, leadsResponse] = await Promise.all([
        axios.get(listingsUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
        axios.get(leadsUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
      ]);

      console.log("Listings: ", listingsResponse.data);
      console.log("Leads: ", leadsResponse.data);

      // Filter listings where lead_id is null
      const allListings = (listingsResponse.data.data.data
        //  || [])?.filter(
        // (listing) => listing.lead_id === null
      );

      // Filter leads where is_seller is 1
      const allLeads = (leadsResponse.data.data.data);

      //   total sellers
      setTotal(allListings.length + allLeads.length);

      // Count listings where listings.lead_id matches leads.id
      const listingsCountForLeads = allLeads?.reduce((count, lead) => {
        const matchingListings = allListings.filter(
          (listing) => listing.lead_id === lead.id
        );
        return {
          ...count,
          [lead.id]: matchingListings.length,
        };
      }, {});

      // Count listings where listings.seller_name and listings.seller_contact are repeated
      const listingSeller = allListings?.reduce((count, listing) => {
        const key = `${listing.seller_name}-${listing.seller_contact}`;
        count[key] = (count[key] || 0) + 1;
        return count;
      }, {});

      console.log(
        "leadSeller, listingsSeller: ",
        listingsCountForLeads,
        listingSeller
      );

      if (page > 1) {
        setManualSellers((prevListings) => [
          ...prevListings,
          ...allListings?.map((listing) => ({
            ...listing,
            page: page,
          })),
        ]);
        setLeadSellers((prevListings) => [
          ...prevListings,
          ...allLeads?.map((listing) => ({
            ...listing,
            page: page,
          })),
        ]);
      } else {
        setManualSellers(
          allListings?.map((listing) => ({
            ...listing,
            page: page,
          }))
        );
        setLeadSellers(
          allLeads?.map((listing) => ({
            ...listing,
            page: page,
          }))
        );
      }

      setLoading(false);
      setbtnloading(false);
    } catch (error) {
      console.error("Data not fetched. ", error);
      toast.error("Unable to fetch data.", {
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
                  Sellers{" "}
                  <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                    {total}
                  </span>
                </h1>
              </div>
            </div>

            <Sellers
              manualSellers={manualSellers}
              setCurrentPage={setCurrentPage}
              setPageBeingScrolled={setPageBeingScrolled}
              currentPage={currentPage}
              lastPage={lastPage}
              FetchListings={FetchListings}
              loading={loading}
              setLoading={setLoading}
              tabValue={tabValue}
              setTabValue={setTabValue}
              leadSellers={leadSellers}
              setLeadSellers={setLeadSellers}
            />
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
