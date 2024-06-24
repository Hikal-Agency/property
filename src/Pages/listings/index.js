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
    let url = `${BACKEND_URL}/listings?page=${page}&listing_status=New`;
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
    SearchListings(token, currentPage);
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
            <div className={`flex items-center justify-between`}>
              <Box className={`pt-3 border-t-1 overflow-hidden`}>
                <Box
                  className="flex flex-wrap gap-3 items-center mb-5"
                  sx={darkModeColors}
                >
                  {" "}
                  {/* <TextField
                    className="w-[200px]"
                    label="Search"
                    size="small"
                    placeholder="City, area, Project, Neighborhood"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BsSearch
                            color={
                              currentMode == "dark" ? "#ffffff" : "#000000"
                            }
                          />
                        </InputAdornment>
                      ),
                    }}
                  /> */}
                  <TextField
                    className={`min-w-[200px]`}
                    // label="Search"
                    size="small"
                    placeholder={t("search")}
                    sx={{
                      ".css-2ehmn7-MuiInputBase-root-MuiOutlinedInput-root": {
                        paddingLeft: isLangRTL(i18n.language)
                          ? "10px !important"
                          : "0px !important",
                        paddingRight: isLangRTL(i18n.language)
                          ? "0px !important"
                          : "10px !important",
                      },
                      "& .MuiInputBase-root": {
                        backgroundColor:
                          themeBgImg &&
                          (currentMode === "dark"
                            ? blurDarkColor
                            : blurLightColor),
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <BsSearch
                            color={
                              currentMode === "dark" ? "#EEEEEE" : "#333333"
                            }
                          />
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <Box
                          sx={{
                            minWidth: "90px",
                            padding: 0,
                            marginLeft: isLangRTL(i18n.language)
                              ? "10px"
                              : "0px",
                            marginRight: isLangRTL(i18n.language)
                              ? "0px"
                              : "10px",
                          }}
                        >
                          <Select
                            value={searchCriteriaOptions.find(
                              (option) => option.value === searchCriteria
                            )}
                            onChange={handleSearchCriteriaChange}
                            options={searchCriteriaOptions}
                            placeholder={t("label_select")}
                            className={`w-full p-0 ${
                              !themeBgImg
                                ? currentMode === "dark"
                                  ? "bg-[#333333]"
                                  : "bg-[#DDDDDD]"
                                : currentMode === "dark"
                                ? "blur-bg-dark"
                                : "blur-bg-light"
                            } `}
                            menuPortalTarget={document.body}
                            styles={selectBgStyles(
                              currentMode,
                              primaryColor,
                              blurDarkColor,
                              blurLightColor
                            )}
                          />
                        </Box>
                        // <Select
                        //   value={searchCriteria}
                        //   onChange={handleSearchCriteriaChange}
                        //   className={`p-0 mr-3 ${
                        //     !themeBgImg ? (currentMode === "dark"
                        //       ? "bg-[#333333]"
                        //       : "bg-[#DDDDDD]")
                        //     : (currentMode === "dark"
                        //     ? "blur-bg-dark"
                        //     : "blur-bg-light")
                        //   } `}
                        //   displayEmpty
                        // >
                        //   <MenuItem value="" sx={{ fontSize: "x-small" }}>
                        //     {t("label_select")}
                        //   </MenuItem>
                        //   <MenuItem value="project">{t("label_project")}</MenuItem>
                        //   <MenuItem value="city">{t("label_city")}</MenuItem>
                        //   <MenuItem value="area">{t("label_area")}</MenuItem>
                        // </Select>
                      ),
                    }}
                    variant="outlined"
                    onChange={handleSearchQueryChange}
                    value={searchQuery}
                  />
                  <FormControlLabel
                    control={<Switch checked={switchValue} />}
                    value={filters?.sold}
                    onClick={(e) => {
                      const value = e.target.value;
                      value === "sold"
                        ? setSwitchValue(false)
                        : setSwitchValue(true);
                      setFilters({
                        ...filters,
                        sold: value === "sold" ? null : "sold",
                      });
                    }}
                    label={t("sold_listings")}
                    sx={{
                      marginX: "10px",

                      "& .MuiSwitch-track": {
                        backgroundColor:
                          currentMode === "dark" && "#9e9e9e !important",
                      },
                      "& .Mui-checked": {
                        color:
                          currentMode === "dark"
                            ? "green !important"
                            : "#B91C1C !important",
                      },
                      "& .MuiFormControlLabel-label ": {
                        color: currentMode === "dark" && "#ffffff !important",
                        fontWeight: "semi-bold",
                        fontFamily: fontFam,
                      },
                    }}
                  />
                  {/* PROPERTY TYPE  */}
                  <Box sx={{ minWidth: "120px" }}>
                    <Select
                      id="property"
                      value={
                        filters?.property
                          ? property_options(t).find(
                              (option) => option.value === filters?.property
                            )
                          : null
                      }
                      onChange={(selectedOption) =>
                        setFilters({
                          ...filters,
                          property: selectedOption?.value || null,
                        })
                      }
                      options={property_options(t)}
                      placeholder={t("label_property")}
                      className={`w-full`}
                      isClearable
                      menuPortalTarget={document.body}
                      styles={{
                        ...selectBgStyles(
                          currentMode,
                          primaryColor,
                          blurDarkColor,
                          blurLightColor
                        ),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          display: filters?.property ? "none" : "block",
                        }),
                        clearIndicator: (provided) => ({
                          ...provided,
                          display: filters?.property ? "block" : "none",
                        }),
                      }}
                    />
                  </Box>
                  {/* <TextField
                    id="property"
                    value={filters?.property}
                    label={t("label_property")}
                    onChange={(e) => {
                      e.preventDefault();
                      setFilters({
                        ...filters,
                        property: e.target.value,
                      });
                    }}
                    size="small"
                    displayEmpty
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                        minWidth: "120px",
                        marginX: "5px !important",
                      },
                    }}
                    className={`${themeBgImg && (currentMode === "dark" ? "blur-bg-dark rounded-md" : "blur-bg-light rounded-md")}`}
                    select
                  >
                    <MenuItem value={"apartment"}>{t("property_apartment")}</MenuItem>
                    <MenuItem value={"villa"}>{t("property_villa")}</MenuItem>
                    <MenuItem value={"retail"}>{t("property_retail")}</MenuItem>
                  </TextField> */}
                  {/* LISTING TYPE  */}
                  <Box sx={{ minWidth: "120px" }}>
                    <Select
                      id="category"
                      value={
                        filters?.category
                          ? categoryOptions.find(
                              (option) => option.value === filters?.category
                            )
                          : null
                      }
                      onChange={(selectedOption) =>
                        setFilters({
                          ...filters,
                          category: selectedOption?.value || null,
                        })
                      }
                      options={categoryOptions}
                      placeholder={t("label_category")}
                      className={`w-full`}
                      isClearable
                      menuPortalTarget={document.body}
                      styles={{
                        ...selectBgStyles(
                          currentMode,
                          primaryColor,
                          blurDarkColor,
                          blurLightColor
                        ),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          display: filters?.category ? "none" : "block",
                        }),
                        clearIndicator: (provided) => ({
                          ...provided,
                          display: filters?.category ? "block" : "none",
                        }),
                      }}
                    />
                  </Box>
                  {/* <TextField
                    id="category"
                    value={filters?.category}
                    label={t("label_category")}
                    onChange={(e) => {
                      e.preventDefault();
                      setFilters({
                        ...filters,
                        category: e.target.value,
                      });
                    }}
                    size="small"
                    displayEmpty
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                        minWidth: "120px",
                        marginX: "5px !important",
                      },
                    }}
                    className={`${themeBgImg && (currentMode === "dark" ? "blur-bg-dark rounded-md" : "blur-bg-light rounded-md")}`}
                    select
                  >
                    <MenuItem value={"Secondary"}>{t("category_secondary")}</MenuItem>
                    <MenuItem value={"Off-plan"}>{t("category_off_plan")}</MenuItem>
                  </TextField> */}
                  {/* BEDROOMS  */}
                  <Box sx={{ minWidth: "120px" }}>
                    <Select
                      id="bedrooms"
                      value={
                        filters?.bedrooms
                          ? enquiry_options(t).find(
                              (option) => option.value === filters?.bedrooms
                            )
                          : null
                      }
                      onChange={(selectedOption) =>
                        setFilters({
                          ...filters,
                          bedrooms: selectedOption?.value || null,
                        })
                      }
                      options={enquiry_options(t)}
                      placeholder={t("label_beds")}
                      className={`w-full`}
                      isClearable
                      menuPortalTarget={document.body}
                      styles={{
                        ...selectBgStyles(
                          currentMode,
                          primaryColor,
                          blurDarkColor,
                          blurLightColor
                        ),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          display: filters?.bedrooms ? "none" : "block",
                        }),
                        clearIndicator: (provided) => ({
                          ...provided,
                          display: filters?.bedrooms ? "block" : "none",
                        }),
                      }}
                    />
                  </Box>
                  {/* <TextField
                    id="bedrooms"
                    value={filters?.bedrooms}
                    label={t("label_beds")}
                    onChange={(e) => {
                      e.preventDefault();
                      setFilters({
                        ...filters,
                        bedrooms: e.target.value,
                      });
                    }}
                    size="small"
                    displayEmpty
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                        minWidth: "120px",
                        marginX: "5px !important",
                      },
                    }}
                    className={`${themeBgImg && (currentMode === "dark" ? "blur-bg-dark rounded-md" : "blur-bg-light rounded-md")}`}
                    select
                  >
                    <MenuItem value={"Studio"}>{t("enquiry_studio")}</MenuItem>
                    <MenuItem value={"1 Bedroom"}>{t("enquiry_1bed")}</MenuItem>
                    <MenuItem value={"2 Bedrooms"}>{t("enquiry_2bed")}</MenuItem>
                    <MenuItem value={"3 Bedrooms"}>{t("enquiry_3bed")}</MenuItem>
                    <MenuItem value={"4 Bedrooms"}>{t("enquiry_4bed")}</MenuItem>
                    <MenuItem value={"5 Bedrooms"}>{t("enquiry_5bed")}</MenuItem>
                    <MenuItem value={"6 Bedrooms"}>{t("enquiry_6bed")}</MenuItem>
                    <MenuItem value={"7 Bedrooms"}>{t("enquiry_7bed")}</MenuItem>
                    <MenuItem value={"8 Bedrooms"}>{t("enquiry_8bed")}</MenuItem>
                    <MenuItem value={"9 Bedrooms"}>{t("enquiry_9bed")}</MenuItem>
                    <MenuItem value={"10 Bedrooms"}>{t("enquiry_10bed")}</MenuItem>
                  </TextField> */}
                  {/* BATHROOMS  */}
                  <Box sx={{ minWidth: "120px" }}>
                    <Select
                      id="bathrooms"
                      value={
                        filters?.bathrooms
                          ? bathroom_options(t).find(
                              (option) => option.value === filters?.bathrooms
                            )
                          : null
                      }
                      onChange={(selectedOption) =>
                        setFilters({
                          ...filters,
                          bathrooms: selectedOption?.value || null,
                        })
                      }
                      options={bathroom_options(t)}
                      placeholder={t("label_baths")}
                      className={`w-full`}
                      isClearable
                      menuPortalTarget={document.body}
                      styles={{
                        ...selectBgStyles(
                          currentMode,
                          primaryColor,
                          blurDarkColor,
                          blurLightColor
                        ),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          display: filters?.bathrooms ? "none" : "block",
                        }),
                        clearIndicator: (provided) => ({
                          ...provided,
                          display: filters?.bathrooms ? "block" : "none",
                        }),
                      }}
                    />
                  </Box>
                  {/* <TextField
                    id="bathrooms"
                    value={filters?.bathrooms}
                    label={t("label_baths")}
                    onChange={(e) => {
                      e.preventDefault();
                      setFilters({
                        ...filters,
                        bathrooms: e.target.value,
                      });
                    }}
                    size="small"
                    displayEmpty
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                        minWidth: "120px",
                        marginX: "5px !important",
                      },
                    }}
                    className={`${themeBgImg && (currentMode === "dark" ? "blur-bg-dark rounded-md" : "blur-bg-light rounded-md")}`}
                    select
                  >
                    <MenuItem value={"1 Bathroom"}>{t("bathroom_1")}</MenuItem>
                    <MenuItem value={"2 Bathrooms"}>{t("bathroom_2")}</MenuItem>
                    <MenuItem value={"3 Bathroom"}>{t("bathroom_3")}</MenuItem>
                    <MenuItem value={"4 Bathrooms"}>{t("bathroom_4")}</MenuItem>
                    <MenuItem value={"5 Bathroom"}>{t("bathroom_5")}</MenuItem>
                    <MenuItem value={"6 Bathrooms"}>{t("bathroom_6")}</MenuItem>
                    <MenuItem value={"7 Bathroom"}>{t("bathroom_7")}</MenuItem>
                    <MenuItem value={"8 Bathrooms"}>{t("bathroom_8")}</MenuItem>
                    <MenuItem value={"9 Bathroom"}>{t("bathroom_9")}</MenuItem>
                    <MenuItem value={"10 Bathrooms"}>{t("bathroom_10")}</MenuItem>
                    <MenuItem value={"Unavailabe"}>{t("label_unavailable")}</MenuItem>
                  </TextField> */}
                  {/* SORT BY  */}
                  <Box sx={{ minWidth: "120px" }}>
                    <Select
                      id="sortby"
                      value={
                        filters?.sort
                          ? sortOptions.find(
                              (option) => option.value === filters?.sort
                            )
                          : null
                      }
                      onChange={(selectedOption) =>
                        setFilters({
                          ...filters,
                          sort: selectedOption?.value || null,
                        })
                      }
                      options={sortOptions}
                      placeholder={t("label_sort_by")}
                      className={`w-full`}
                      isClearable
                      menuPortalTarget={document.body}
                      styles={{
                        ...selectBgStyles(
                          currentMode,
                          primaryColor,
                          blurDarkColor,
                          blurLightColor
                        ),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          display: filters?.sort ? "none" : "block",
                        }),
                        clearIndicator: (provided) => ({
                          ...provided,
                          display: filters?.sort ? "block" : "none",
                        }),
                      }}
                    />
                  </Box>
                  {/* <TextField
                    id="sortby"
                    value={filters?.sort}
                    label={t("label_sort_by")}
                    onChange={(e) => {
                      e.preventDefault();
                      setFilters({
                        ...filters,
                        sort: e.target.value,
                      });
                    }}
                    size="small"
                    displayEmpty
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                        minWidth: "120px",
                        marginX: "5px !important",
                      },
                    }}
                    className={`${themeBgImg && (currentMode === "dark" ? "blur-bg-dark rounded-md" : "blur-bg-light rounded-md")}`}
                    select
                  >
                    <MenuItem value="latest">{t("label_latest")}</MenuItem>
                    <MenuItem value="sortByHigh">{t("label_price_high_to_low")}</MenuItem>
                    <MenuItem value="sortByLow">{t("label_price_low_to_high")}</MenuItem>
                  </TextField> */}
                  {(isFilterApplied || searchCriteria || searchQuery) && (
                    <Button
                      onClick={clearFilter}
                      className="w-max btn py-2 px-3 bg-btn-primary"
                    >
                      {t("clear")}
                    </Button>
                  )}
                </Box>
              </Box>
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
