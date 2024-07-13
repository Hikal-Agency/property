import React, { useEffect, useState } from "react";

import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";

import Loader from "../../Components/Loader";
import VendorsList from "../../Components/VendorsComp/VendorsList";
import { Button } from "@mui/base";
import AddVendor from "../../Components/VendorsComp/AddVendor";
import HeadingTitle from "../../Components/_elements/HeadingTitle";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";

const currentDate = dayjs();

const Vendors = ({ isLoading }) => {
  const {
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
    themeBgImg,
    pageState,
    setpageState,
    t,
  } = useStateContext();

  const [loading, setLoading] = useState(false);
  const [openVendorModal, setOpenVendorModal] = useState(false);
  const [vendorsData, setVendorsData] = useState([]);
  const [maxPage, setMaxPage] = useState(0);

  const [filters, setFilters] = useState({
    type: null,
    country: null,
    vendor_name: null,
    person_to_contact: null,
    email: null,
    contact: null,
  });
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("auth-token");

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

  const handleSearchCriteriaChange = (event) => {
    setSearchCriteria(event.value);
  };

  const handleSearchQueryChange = (event) => {
    const value = event.target.value;

    setSearchQuery(value);
  };

  const HandleOpenModel = () => {
    setOpenVendorModal(true);
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
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [pageState.page, filters]);
  useEffect(() => {
    if (searchQuery.length >= 3) {
      fetchVendors();
    }
  }, [searchQuery]);

  const Additional = () => {
    return (
      <button
        className={`${
          themeBgImg
            ? "bg-primary shadow-md"
            : currentMode === "dark"
            ? "bg-primary-dark-neu"
            : "bg-primary-light-neu"
        } p-2 px-5 text-white rounded-md uppercase`}
        onClick={HandleOpenModel}
      >
        {t("add_vendor")}
      </button>
    );
  };

  return (
    <>
      <div className="flex relative min-h-screen">
        {/* {loading ? (
          <Loader />
        ) : ( */}
        <div
          className={`w-full p-5 mt-2 ${
            !themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
          }
                ${currentMode === "dark" ? "text-white" : "text-black"}`}
        >
          <HeadingTitle
            title={t("vendor")}
            counter={pageState?.total}
            additional={<Additional />}
          />

          <div className="mt-1 pb-5">
            <VendorsList
              fetchVendors={fetchVendors}
              loading={loading}
              setLoading={setLoading}
              vendorsData={vendorsData}
              setVendorsData={setVendorsData}
              maxPage={maxPage}
              setMaxPage={setMaxPage}
              handleSearchQueryChange={handleSearchQueryChange}
              handleSearchCriteriaChange={handleSearchCriteriaChange}
              clearFilter={clearFilter}
              setSearchQuery={setSearchQuery}
              searchQuery={searchQuery}
              setSearchCriteria={setSearchCriteria}
              searchCriteria={searchCriteria}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>
        {/* )} */}

        {openVendorModal && (
          <AddVendor
            openVendorModal={openVendorModal}
            setOpenVendorModal={setOpenVendorModal}
          />
        )}
      </div>
    </>
  );
};

export default Vendors;
