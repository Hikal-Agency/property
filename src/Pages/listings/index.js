import { Button } from "@material-tailwind/react";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";

import {
  Box,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import Select from "react-select";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import { useEffect, useState } from "react";
import axios from "../../axoisConfig";
import AddUserModel from "../../Components/addUser/AddUserModel";
import SecondaryListings from "../../Components/Listings/SecondaryListings";
import AddNewListingModal from "../../Components/Listings/AddNewListingModal";
import { BsBuildingAdd, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import moment from "moment";
import { selectBgStyles } from "../../Components/_elements/SelectStyles";
import {
  bathroom_options,
  enquiry_options,
  property_options,
} from "../../Components/_elements/SelectOptions";

const Listings = () => {
  const {
    currentMode,
    BACKEND_URL,
    darkModeColors,
    t,
    themeBgImg,
    primaryColor,
    blurDarkColor,
    blurLightColor,
    isLangRTL,
    i18n,
    fontFam,
  } = useStateContext();

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
  const [switchValue, setSwitchValue] = useState(false);

  const handleSearchCriteriaChange = (event) => {
    setSearchCriteria(event.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearFilter = (e) => {
    e.preventDefault();

    setFilters({
      bedrooms: null,
      bathrooms: null,
      sort: null,
      sold: null,
      category: null,
    });

    setSearchQuery("");
    setSearchCriteria("");
    setSwitchValue(false);
  };

  const FetchListings = async (token, page = 1) => {
    setLoading(true);
    if (page > 1) {
      setbtnloading(true);
    }
    let url = `${BACKEND_URL}/new-listings?page=${page}&listing_status=New`;
    if (filters?.bedrooms) url += `&bedrooms=${filters?.bedrooms}`;
    if (filters?.bathrooms) url += `&bathrooms=${filters?.bathrooms}`;
    if (filters?.property) url += `&property_type=${filters?.property}`;
    if (filters?.category) url += `&listing_type=${filters?.category}`;
    if (filters?.sold) url += `&listing_status=Sold`;

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
      let filteredListings = all_listings?.data?.data || [];

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
      setLastPage(all_listings?.data?.pagination?.last_page);
      setTotal(all_listings?.data?.pagination?.total);
      setbtnloading(false);
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

  const SearchListings = async (token, page = 1) => {
    setLoading(true);
    if (page > 1) {
      setbtnloading(true);
    }
    let url = `${BACKEND_URL}/search-listings?page=${page}&listing_status=New`;
    if (filters?.bedrooms) url += `&bedrooms=${filters?.bedrooms}`;
    if (filters?.bathrooms) url += `&bathrooms=${filters?.bathrooms}`;
    if (filters?.property) url += `&property_type=${filters?.property}`;
    if (filters?.category) url += `&listing_type=${filters?.category}`;
    if (filters?.sold) url += `&listing_status=Sold`;

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

  useEffect(() => {
    if (searchQuery) {
      SearchListings(token, currentPage);
    }
  }, [searchQuery]);

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
  }, [currentPage, value, filters]);

  const searchCriteriaOptions = [
    { value: "project", label: t("label_project") },
    { value: "city", label: t("label_city") },
    { value: "area", label: t("label_area") },
  ];

  const categoryOptions = [
    { value: "Secondary", label: t("category_secondary") },
    { value: "Off-plan", label: t("category_off_plan") },
  ];

  const sortOptions = [
    { value: "latest", label: t("label_latest") },
    { value: "sortByHigh", label: t("label_price_high_to_low") },
    { value: "sortByLow", label: t("label_price_low_to_high") },
  ];

  return (
    <>
      <div className="flex min-h-screen ">
        <div
          className={`w-full p-4 ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
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
                <div className="bg-primary h-10 w-1 rounded-full"></div>
                <h1
                  className={`text-lg font-semibold mx-2 uppercase ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("listings")}{" "}
                  <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                    {total}
                  </span>
                </h1>
              </div>

              {/* <div className="flex space-x-3 mr-4 items-center">
                <AiOutlineFilter size={16}
                  color={currentMode == "dark" ? "#ffffff" : "#000000"}
                />
                <h2
                  className={`${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  }`}
                >
                  All Filters (0)
                </h2>
              </div> */}

              <div className="mr-4">
                <Button
                  fullWidth
                  sx={{ mt: 1 }}
                  variant="contained"
                  className="bg-btn-primary flex items-center gap-x-3 px-3"
                  size="small"
                  onClick={handleOpenListingModal}
                >
                  <BsBuildingAdd size={16} />
                  {t("btn_add_new_listing")}
                </Button>
              </div>

              {listingModalOpen && (
                <AddNewListingModal
                  // LeadData={LeadData}
                  handleCloseListingModal={handleCloseListingModal}
                  setListingModalOpen={setListingModalOpen}
                />
              )}
            </div>
            <div className={`flex items-center justify-between mt-3`}>
              {/* filters here */}
            </div>
            <SecondaryListings
              listing={listing}
              setCurrentPage={setCurrentPage}
              setPageBeingScrolled={setPageBeingScrolled}
              currentPage={currentPage}
              lastPage={lastPage}
              FetchListings={FetchListings}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Listings;
