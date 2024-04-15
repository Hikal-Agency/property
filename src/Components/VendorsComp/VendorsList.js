import { Button, Pagination, Stack, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";

import axios from "../../axoisConfig";
import { IoLocation, IoShieldOutline } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { BsMailbox, BsPencil } from "react-icons/bs";
import { FaUser, FaPhoneAlt } from "react-icons/fa";

import { Link } from "react-router-dom";
// import SingleUser from "./SingleUser";
import usePermission from "../../utils/usePermission";
// import DeleteUser from "./DeleteUser";
// import EditUserModal from "./EditUserModal";

import { MdOutlineCall, MdOutlinePermContactCalendar } from "react-icons/md";
import { TfiEmail } from "react-icons/tfi";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineBan } from "react-icons/hi";
import { AiFillUnlock } from "react-icons/ai";
import { toast } from "react-toastify";

const VendorsList = ({}) => {
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

  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleCloseEditModal = () => setEditModalOpen(false);
  const handleEditModal = (id) => {
    setUserId(id);
    setEditModalOpen(true);
    // handleLeadModelClose();
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
        )}
        {editModalOpen && (
          <EditUserModal
            vendorsData={userID}
            handleCloseEditModal={handleCloseEditModal}
            setEditModalOpen={setEditModalOpen}
            fetchUser={fetchVendors}
          />
        )} */}

        {loading ? (
          <Loader />
        ) : (
          <div className={`w-full`}>
            <div className="px-5">
              <div className="mt-5 md:mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3 pb-3">
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
                        } rounded-md relative hover:shadow-lg text-sm`}
                      >
                        <div
                          className={`border-primary flex justify-between border-t-2 rounded-md m-2`}
                        >
                          <div>
                            <div className="flex items-center m-1 mt-3 mb-4 ">
                              {/* NAME   */}
                              <div className="mx-3 space-y-1 overflow-hidden">
                                <p className=" ">{item?.country}</p>
                                <h1 className="font-bold text-lg">
                                  {item?.vendor_name}
                                </h1>
                              </div>
                            </div>

                            <div className="space-y-4 m-1">
                              {/* address */}
                              <div className="flex">
                                <IoLocation size={16} className="mr-3" />
                                <p>{item?.address}</p>
                              </div>
                              {/* pobox */}
                              <div className="flex">
                                <BsMailbox size={16} className="mr-3" />
                                <p>{item?.pobox}</p>
                              </div>
                              {/* trn */}
                              <div className="flex">
                                <IoShieldOutline size={16} className="mr-3" />
                                <p>{item?.trn}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center m-1 mt-2 mb-4">
                              <div className="mx-1 ">
                                <button className="border rounded-full p-3 ">
                                  <BsPencil />
                                </button>
                              </div>
                              {item?.type && (
                                <div className="mx-1 bg-primary py-2 px-7 ">
                                  <p>{item?.type}</p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-4 m-1">
                              {/* user to be contacted */}
                              <div className="flex">
                                <FaUser size={16} className="mr-3" />
                                <p>{item?.person_to_contact}</p>
                              </div>
                              {/* phone */}
                              <div className="flex">
                                <FaPhoneAlt size={16} className="mr-3" />
                                <p>{item?.contact}</p>
                              </div>
                              {/* email */}
                              <div className="flex">
                                <IoMdMail size={16} className="mr-3" />
                                <p>{item?.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute items-center right-2 flex flex-col space-y-10"></div>
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
