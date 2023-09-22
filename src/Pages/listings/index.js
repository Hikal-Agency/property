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
import { DataGrid } from "@mui/x-data-grid";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";

import {
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineTable,
  AiOutlineAppstore,
  AiOutlineFilter,
} from "react-icons/ai";
import SingleUser from "../../Components/Users/SingleUser";
import { useEffect, useState, useRef } from "react";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import UserTable from "../../Components/Users/UserTable";
import AddUserModel from "../../Components/addUser/AddUserModel";
import { FaBan, FaUnlock } from "react-icons/fa";
import DeleteUser from "../../Components/Users/DeleteUser";
import { BsPersonFillLock, BsSearch } from "react-icons/bs";
import UpdateUserPermissions from "../../Components/addUser/UpdateUserPermissions";
import { BiSearch } from "react-icons/bi";
import SecondaryListings from "../../Components/Listings/SecondaryListings";

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

  const searchRef = useRef("");

  const FetchListings = async (token, page = 1) => {
    if (page > 1) {
      setbtnloading(true);
    }
    try {
      const all_listings = await axios.get(
        `${BACKEND_URL}/listings?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("all listings: ", all_listings);

      if (page > 1) {
        setListings((prevOffers) => {
          return [
            ...prevOffers,
            ...all_listings?.data?.data?.data?.map((listing) => ({
              ...listing,
              page: page,
            })),
          ];
        });
      } else {
        setListings(() => {
          return [
            ...all_listings?.data?.data?.data?.map((listing) => ({
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
      console.log("Offers not fetched. ", error);
    }
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
  }, [currentPage, value]);

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
                    currentMode === "dark"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  Secondary Listings {" "}
                  <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                    {total}
                  </span>
                </h1>
              </div>

              <div className="flex space-x-3 mr-4 items-center">
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
              </div>
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
                        color:
                          currentMode === "dark" && "#ffffff !important",
                        fontWeight: "semi-bold",
                      },
                    }}
                  />
                  <TextField
                    id="bedrooms"
                    // value={PropertyType}
                    label="Beds"
                    // onChange={ChangePropertyType}
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
                    // value={PropertyType}
                    label="Baths"
                    // onChange={ChangePropertyType}
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
                    <MenuItem value={"10 Bathrooms"}>
                      10 Bathrooms
                    </MenuItem>
                    <MenuItem value={"Unavailabe"}>Unavailabe</MenuItem>
                  </TextField>
                  
                  <TextField
                    id="sortby"
                    // value={PropertyType}
                    label="Sort by"
                    // onChange={ChangePropertyType}
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
                    <MenuItem value="Latest" >
                      Latest
                    </MenuItem>
                    <MenuItem value="Price High to Low">
                      Price High to Low
                    </MenuItem>
                    <MenuItem value="Price Low to High">
                      Price Low to High
                    </MenuItem>
                  </TextField>
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
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Listings;
