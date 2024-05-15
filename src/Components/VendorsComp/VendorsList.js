import {
  Box,
  Button,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import { toast } from "react-toastify";
import usePermission from "../../utils/usePermission";
import AddVendor from "./AddVendor";
import { BsBuildingAdd, BsSearch } from "react-icons/bs";
import { selectBgStyles } from "../../Components/_elements/SelectStyles";
import Select from "react-select";

import axios from "../../axoisConfig";
import { IoMdMail } from "react-icons/io";
import {
  BsMailbox,
  BsPencil,
  BsPinMap,
  BsShieldCheck,
  BsPerson,
  BsTelephone,
  BsEnvelope,
} from "react-icons/bs";
import { FaUser, FaPhoneAlt } from "react-icons/fa";
import {
  vendor_type,
  countries_list,
  vendors_search_filter,
} from "../../Components/_elements/SelectOptions";

const VendorsList = ({}) => {
  const [loading, setLoading] = useState(false);
  const {
    currentMode,
    BACKEND_URL,
    pageState,
    setpageState,
    primaryColor,
    themeBgImg,
    darkModeColors,
    isLangRTL,
    i18n,
    t,
    blurDarkColor,
    blurLightColor,
  } = useStateContext();
  const [maxPage, setMaxPage] = useState(0);
  const [vendorsData, setVendorsData] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [singleUser, setSingleUserData] = useState({});
  const [userID, setUserId] = useState();
  const [status, setUserStatus] = useState();
  const [username, setUserName] = useState();
  const [currentPage, setCurrentPage] = useState();
  const token = localStorage.getItem("auth-token");
  const { hasPermission } = usePermission();
  const [filters, setFilters] = useState({
    type: null,
    country: null,
    vendor_name: null,
    person_to_contact: null,
    email: null,
    contact: null,
  });

  console.log("vendors data: ", vendorsData);

  const isFilterApplied = Object.values(filters).some(
    (value) => value !== null
  );

  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchCriteriaChange = (event) => {
    setSearchCriteria(event.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearFilter = (e) => {
    e.preventDefault();

    setFilters({
      type: null,
      country: null,
      vendor_name: null,
      person_to_contact: null,
      email: null,
      contact: null,
    });

    setSearchQuery("");
    setSearchCriteria("");
  };

  const [openVendorModal, setOpenVendorModal] = useState(false);
  const handleCloseEditModal = () => setOpenVendorModal(false);
  const handleEditModal = (item) => {
    setOpenVendorModal(item);
  };

  const handlePageChange = (event, value) => {
    console.log("pagination value: ", value);
    setpageState({ ...pageState, page: value });
    // setCurrentPage();
  };

  const fetchVendors = async () => {
    setLoading(true);

    let url = `${BACKEND_URL}/vendors?page=${pageState.page}`;

    if (filters?.type) url += `&type=${filters?.type}`;
    if (filters?.country) url += `&country=${filters?.country}`;

    if (searchCriteria === "vendor_name") url += `&vendor_name=${searchQuery}`;
    if (searchCriteria === "person_to_contact")
      url += `&person_to_contact=${searchQuery}`;
    if (searchCriteria === "email") url += `&email=${searchQuery}`;
    if (searchCriteria === "contact") url += `&contact=${searchQuery}`;

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("fetched vendors:: ", response);
      setVendorsData(response.data?.data?.data);
      setMaxPage(response.data?.data?.last_page);
      setpageState((old) => ({
        ...old,
        isLoading: false,
        pageSize: response?.data?.managers?.per_page,
        total: response?.data?.data?.total,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Unable to fetch vendors.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [pageState.page, filters, searchQuery]);

  return (
    <>
      <div className="min-h-screen">
        {/* {openModel && (
          <SingleUser
            UserModelOpen={handleModel}
            handleUserModelClose={handleModelClose}
            vendorsData={singleUser}
          />
        )}
        {openDeleteModel && (
          <DeleteUser
            UserModelOpen={handleDelete}
            handleUserModelClose={handleDeleteModelClose}
            vendorsData={userID}
            UserStatus={status}
            UserName={username}
            fetchUser={fetchVendors}
          />
        )}*/}
        {openVendorModal && (
          <AddVendor
            handleCloseEditModal={handleCloseEditModal}
            setOpenVendorModal={setOpenVendorModal}
            openVendorModal={openVendorModal}
            edit="edit"
            fetchVendors={fetchVendors}
          />
        )}

        {loading ? (
          <Loader />
        ) : (
          <div className={`w-full`}>
            <div className="px-5">
              <div className="mt-5 md:mt-2">
                {/* filters */}
                <div className={`flex items-center justify-between`}>
                  <Box className={`pt-3 border-t-1 overflow-hidden`}>
                    <Box
                      className="flex flex-wrap gap-3 items-center mb-5"
                      sx={darkModeColors}
                    >
                      {" "}
                      <TextField
                        className={`min-w-[200px]`}
                        size="small"
                        placeholder={t("search")}
                        sx={{
                          ".css-2ehmn7-MuiInputBase-root-MuiOutlinedInput-root":
                            {
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
                                value={vendors_search_filter(t).find(
                                  (option) => option.value === searchCriteria
                                )}
                                onChange={handleSearchCriteriaChange}
                                options={vendors_search_filter(t)}
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
                          ),
                        }}
                        variant="outlined"
                        onChange={handleSearchQueryChange}
                        value={searchQuery}
                      />
                      {/* VENDOR TYPE  */}
                      <Box sx={{ minWidth: "120px" }}>
                        <Select
                          id="type"
                          value={
                            filters?.type
                              ? vendor_type(t).find(
                                  (option) => option.value === filters?.type
                                )
                              : null
                          }
                          onChange={(selectedOption) =>
                            setFilters({
                              ...filters,
                              type: selectedOption?.value || null,
                            })
                          }
                          options={vendor_type(t)?.map((ven) => ({
                            value: ven.value,
                            label: ven.label,
                          }))}
                          placeholder={t("type")}
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
                              display: filters?.type ? "none" : "block",
                            }),
                            clearIndicator: (provided) => ({
                              ...provided,
                              display: filters?.type ? "block" : "none",
                            }),
                          }}
                        />
                      </Box>
                      {/* COUNTRY */}
                      <Box sx={{ minWidth: "120px" }}>
                        <Select
                          id="country"
                          value={
                            filters?.country
                              ? countries_list(t).find(
                                  (option) => option.value === filters?.country
                                )
                              : null
                          }
                          onChange={(selectedOption) =>
                            setFilters({
                              ...filters,
                              country: selectedOption?.value || null,
                            })
                          }
                          options={countries_list(t)?.map((con) => ({
                            value: con.value,
                            label: con.label,
                          }))}
                          placeholder={t("label_country")}
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
                              display: filters?.country ? "none" : "block",
                            }),
                            clearIndicator: (provided) => ({
                              ...provided,
                              display: filters?.country ? "block" : "none",
                            }),
                          }}
                        />
                      </Box>
                      {(isFilterApplied || searchCriteria || searchQuery) && (
                        <Button
                          onClick={clearFilter}
                          className="w-max btn py-2 px-3 bg-btn-primary text-white"
                        >
                          <p className="text-white">{t("clear")}</p>
                        </Button>
                      )}
                    </Box>
                  </Box>
                </div>
                {/* filters end */}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                  {vendorsData?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          !themeBgImg
                            ? currentMode === "dark"
                              ? "bg-[#1c1c1c] text-white"
                              : "bg-[#EEEEEE] text-black"
                            : currentMode === "dark"
                            ? "blur-bg-dark text-white"
                            : "blur-bg-light text-black"
                        } rounded-xl relative shadow-sm card-hover text-sm border-primary border-b-2 p-4`}
                      >
                        {/* TITLE COUNTRY AND ACTIONS  */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-primary py-1 px-2 rounded-md">
                              <p className="text-white uppercase font-semibold">
                                {item?.country}
                              </p>
                            </div>
                            <p className="font-semibold">{item?.vendor_name}</p>
                          </div>
                          <div className="gap-4 flex items-center">
                            {item?.type && (
                              <p className="text-primary font-semibold">
                                {item?.type}
                              </p>
                            )}
                            <button
                              className={`border bg-primary rounded-full p-2`}
                              onClick={() => handleEditModal(item)}
                            >
                              <BsPencil size={16} color={"white"} />
                            </button>
                          </div>
                        </div>

                        {/* DETAILS */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 flex flex-col gap-4">
                            {/* ADDRESS  */}
                            <div className="grid grid-cols-7 gap-2">
                              <BsPinMap size={16} />
                              <p className="col-span-6">{item?.address}</p>
                            </div>
                            {/* POBOX */}
                            <div className="grid grid-cols-7 gap-2">
                              <BsMailbox size={16} />
                              <p className="col-span-6">{item?.pobox}</p>
                            </div>
                            {/* TRN */}
                            <div className="grid grid-cols-7 gap-2">
                              <BsShieldCheck size={16} />
                              <p className="col-span-6">{item?.trn}</p>
                            </div>
                          </div>
                          <div className="p-4 flex flex-col gap-4">
                            {/* USER  */}
                            <div className="grid grid-cols-7 gap-2">
                              <BsPerson size={16} />
                              <p className="col-span-6">
                                {item?.person_to_contact}
                              </p>
                            </div>
                            {/* CONTACT */}
                            <div className="grid grid-cols-7 gap-2">
                              <BsTelephone size={16} />
                              <p className="col-span-6">{item?.contact}</p>
                            </div>
                            {/* EMAIL */}
                            <div className="grid grid-cols-7 gap-2">
                              <BsEnvelope size={16} />
                              <p className="col-span-6">{item?.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <Stack spacing={2} marginTop={2}>
              <Pagination
                count={maxPage}
                color={currentMode === "dark" ? "primary" : "secondary"}
                onChange={handlePageChange}
                style={{ margin: "auto" }}
                page={pageState.page}
                sx={{
                  "& .Mui-selected": {
                    color: "white !important",
                    backgroundColor: `${primaryColor} !important`,
                    "&:hover": {
                      backgroundColor:
                        currentMode === "dark" ? "black" : "white",
                    },
                  },
                  "& .MuiPaginationItem-root": {
                    color: currentMode === "dark" ? "white" : "black",
                  },
                }}
              />
            </Stack>
          </div>
        )}
      </div>
    </>
  );
};

export default VendorsList;
