import { Button, Pagination, Stack, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import { toast } from "react-toastify";
import usePermission from "../../utils/usePermission";
import AddVendor from "./AddVendor";

import axios from "../../axoisConfig";
import { IoMdMail } from "react-icons/io";
import { 
  BsMailbox, 
  BsPencil,
  BsPinMap,
  BsShieldCheck,
  BsPerson,
  BsTelephone,
  BsEnvelope 
} from "react-icons/bs";
import { FaUser, FaPhoneAlt } from "react-icons/fa";

const VendorsList = ({ }) => {
  const [loading, setLoading] = useState(false);
  const {
    currentMode,
    BACKEND_URL,
    pageState,
    setpageState,
    primaryColor,
    themeBgImg,
    t,
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

  console.log("vendors data: ", vendorsData);

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

  const handleModel = (id) => {
    console.log("SU ID: ", id);
    const selectedUser = vendorsData?.find((user) => user.id === id);
    console.log("Selected User: ", selectedUser);
    setSingleUserData(selectedUser);
    setOpenModel(true);
  };

  const handleDelete = (id, status, name) => {
    console.log("Delete id: ", id);
    setUserId(id);
    setUserStatus(status);
    setUserName(name);
    setOpenDeleteModel(true);
  };
  const handleDeleteModelClose = () => {
    setOpenDeleteModel(false);
  };

  const handleModelClose = () => {
    setOpenModel(false);
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/vendors?page=${pageState.page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

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
  }, [pageState.page]);

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
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                  {vendorsData?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${!themeBgImg
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
                              <p className="text-white uppercase font-semibold">{item?.country}</p>
                            </div>
                            <p className="font-semibold">{item?.vendor_name}</p>
                          </div>
                          <div className="gap-4 flex items-center">
                            {item?.type && (
                              <p className="text-primary font-semibold">{item?.type}</p>
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
                              <p className="col-span-6">{item?.person_to_contact}</p>
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
