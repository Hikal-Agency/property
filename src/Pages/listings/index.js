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

const Listings = () => {
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
  const [filters, setFilters] = useState({
    bedrooms: null,
    bathrooms: null,
    sort: null,
  });

  const searchRef = useRef("");

  const clearFilter = (e) => {
    e.preventDefault();

    setFilters({
      bedrooms: null,
      bathrooms: null,
      sort: null,
    });
  };

  const FetchListings = async (token, page = 1) => {
    if (page > 1) {
      setbtnloading(true);
    }
    let url = `${BACKEND_URL}/listings?page=${page}`;
    if (filters?.bedrooms) url += `&bedrooms=${filters?.bedrooms}`;
    if (filters?.bathrooms) url += `&bathrooms=${filters?.bathrooms}`;

    try {
      const all_listings = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("all listings: ", all_listings);

      let filteredListings = all_listings?.data?.data?.data || [];

      console.log("sort: ", filters?.sort);

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

    // try {
    //   const all_listings = await axios.get(url, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + token,
    //     },
    //   });

    //   console.log("all listings: ", all_listings);

    //   if (page > 1) {
    //     setListings((prevOffers) => {
    //       return [
    //         ...prevOffers,
    //         ...all_listings?.data?.data?.data?.map((listing) => ({
    //           ...listing,
    //           page: page,
    //         })),
    //       ];
    //     });
    //   } else {
    //     setListings(() => {
    //       return [
    //         ...all_listings?.data?.data?.data?.map((listing) => ({
    //           ...listing,
    //           page: page,
    //         })),
    //       ];
    //     });
    //   }
    //   setLoading(false);
    //   setLastPage(all_listings?.data?.last_page);
    //   setTotal(all_listings?.data?.data?.total);
    //   setbtnloading(false);
    //   //   console.log("All Offers: ",all_listings)
    // } catch (error) {
    //   console.log("listings not fetched. ", error);
    //   toast.error("Unable to fetch listings.", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    // }
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
    const token = localStorage.getItem("auth-token");
    FetchListings(token, currentPage);
  }, [currentPage, value, filters]);

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
                  Secondary Listings{" "}
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
                  Add New Listing
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
              <Box
                className={`pt-3 border-t-1 overflow-hidden ${
                  currentMode === "dark" ? "bg-black" : "bg-white"
                } `}
              >
                <Box sx={darkModeColors}>
                  {" "}
                  <TextField
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
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Solid Listings"
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
                      },
                    }}
                  />
                  <TextField
                    id="bedrooms"
                    value={filters?.bedrooms}
                    label="Beds"
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
                    select
                  >
                    <MenuItem value={"Studio"}>Studio</MenuItem>
                    <MenuItem value={"1 Bedroom"}>1 Bedroom</MenuItem>
                    <MenuItem value={"2 Bedrooms"}>2 Bedrooms</MenuItem>
                    <MenuItem value={"3 Bedrooms"}>3 Bedrooms</MenuItem>
                    <MenuItem value={"4 Bedrooms"}>4 Bedrooms</MenuItem>
                    <MenuItem value={"5 Bedrooms"}>5 Bedrooms</MenuItem>
                    <MenuItem value={"6 Bedrooms"}>6 Bedrooms</MenuItem>
                    <MenuItem value={"7 Bedrooms"}>7 Bedrooms</MenuItem>
                    <MenuItem value={"8 Bedrooms"}>8 Bedrooms</MenuItem>
                    <MenuItem value={"9 Bedrooms"}>9 Bedrooms</MenuItem>
                    <MenuItem value={"10 Bedrooms"}>10 Bedrooms</MenuItem>
                    <MenuItem value={"Retail"}>Retail</MenuItem>
                  </TextField>
                  <TextField
                    id="bathrooms"
                    value={filters?.bathrooms}
                    label="Baths"
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
                    select
                  >
                    <MenuItem value={"1 Bathroom"}>1 Bathroom</MenuItem>
                    <MenuItem value={"2 Bathrooms"}>2 Bathrooms</MenuItem>
                    <MenuItem value={"3 Bathrooms"}>3 Bathrooms</MenuItem>
                    <MenuItem value={"4 Bathrooms"}>4 Bathrooms</MenuItem>
                    <MenuItem value={"5 Bathrooms"}>5 Bathrooms</MenuItem>
                    <MenuItem value={"6 Bathrooms"}>6 Bathrooms</MenuItem>
                    <MenuItem value={"7 Bathrooms"}>7 Bathrooms</MenuItem>
                    <MenuItem value={"8 Bathrooms"}>8 Bathrooms</MenuItem>
                    <MenuItem value={"9 Bathrooms"}>9 Bathrooms</MenuItem>
                    <MenuItem value={"10 Bathrooms"}>10 Bathrooms</MenuItem>
                    <MenuItem value={"Unavailabe"}>Unavailabe</MenuItem>
                  </TextField>
                  <TextField
                    id="sortby"
                    value={filters?.sort}
                    label="Sort by"
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
                    select
                  >
                    <MenuItem value="latest">Latest</MenuItem>
                    <MenuItem value="sortByHigh">Price High to Low</MenuItem>
                    <MenuItem value="sortByLow">Price Low to High</MenuItem>
                  </TextField>
                  {filters && (
                    <Button
                      onClick={clearFilter}
                      className="w-max btn py-2 px-3 bg-btn-primary"
                    >
                      Clear
                    </Button>
                  )}
                </Box>
              </Box>

              {/* <div className="flex space-x-3">
                <AiOutlineFilter
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
            </div>
            <SecondaryListings
              listing={listing}
              setCurrentPage={setCurrentPage}
              setPageBeingScrolled={setPageBeingScrolled}
              currentPage={currentPage}
              lastPage={lastPage}
              FetchListings={FetchListings}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Listings;
