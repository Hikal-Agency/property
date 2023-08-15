import { Button, Pagination, Stack, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";

import axios from "../../axoisConfig";
import { FaBan, FaEdit, FaEye, FaTrash, FaUnlock } from "react-icons/fa";
import { Link } from "react-router-dom";
import SingleUser from "./SingleUser";
import usePermission from "../../utils/usePermission";
import DeleteUser from "./DeleteUser";

import { 
  MdOutlineCall,
  MdOutlinePermContactCalendar
} from "react-icons/md";
import { TfiEmail } from "react-icons/tfi";
import { AiOutlineEdit } from "react-icons/ai";
import { SlBan } from "react-icons/sl";

// const UserTable = ({ user }) => {
//   const [loading, setloading] = useState(false);
//   const { currentMode, BACKEND_URL, pageState, setpageState } =
//     useStateContext();
//   const [page, setPage] = useState("1");
//   const [maxPage, setMaxPage] = useState(0);
//   const [userData, setUserData] = useState([]);

//   const handlePageChange = (event, value) => {
//     setPage(value);
//     setUserData(user?.managers?.data);
//   };

//   useEffect(() => {
//     setUserData(user?.managers?.data);
//     setMaxPage(user?.managers?.last_page);
//   }, [user]);

//   console.log("UsersData: ", userData);

//   return (
//     <>
//       <div className="min-h-screen">
//         {loading ? (
//           <Loader />
//         ) : (
//           <div
//             className={`w-full  ${
//               currentMode === "dark" ? "bg-black" : "bg-white"
//             }`}
//           >
//             <div className="px-5">
//               <div className="mt-5 md:mt-2">
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
//                   {userData?.map((item, index) => {
//                     return (
//                       <div
//                         key={index}
//                         className={`${
//                           currentMode === "dark"
//                             ? "bg-gray-900 text-white"
//                             : "bg-gray-200 text-black"
//                         } p-3 rounded-md `}
//                       >
//                         {item?.displayImg ? (
//                           <img
//                             src={item?.displayImg}
//                             className="rounded-md cursor-pointer h-[50px] w-[50px] object-cover"
//                             alt=""
//                           />
//                         ) : (
//                           <Avatar
//                             alt="User"
//                             variant="circular"
//                             style={{ width: "30px", height: "30px" }}
//                           />
//                         )}
//                         <div className="mt-2 space-y-1 overflow-hidden">
//                           <h1 className="font-bold">{item?.userName}</h1>
//                           <p className="text-sm font-semibold text-red-600">
//                             {item?.position}
//                           </p>

//                           <hr />

//                           <p className="text-sm">{item?.userContact}</p>
//                           <p className="text-sm">{item?.userEmail}</p>
//                           {item?.status === 0 ? (
//                             <p className="text-sm text-red-600">Deactive</p>
//                           ) : (
//                             <p className="text-sm text-green-600">Active</p>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <Stack spacing={2} marginTop={2}>
//               <Pagination
//                 count={maxPage}
//                 color="error"
//                 onChange={handlePageChange}
//                 style={{ margin: "auto" }}
//               />
//             </Stack>
//           </div>
//         )}
//         {/* <Footer /> */}
//       </div>
//     </>
//   );
// };

const UserTable = ({  }) => {
  const [loading, setLoading] = useState(false);
  const { currentMode, BACKEND_URL, pageState, setpageState, User } =
    useStateContext();
  const [maxPage, setMaxPage] = useState(0);
  const [userData, setUserData] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [singleUser, setSingleUserData] = useState({});
  const [userID, setUserId] = useState();
  const [status, setUserStatus] = useState();
  const [username, setUserName] = useState();
  const [currentPage, setCurrentPage] = useState();
  const token = localStorage.getItem("auth-token");
  const {hasPermission} = usePermission();

  const handlePageChange = (event, value) => {
    setpageState({ ...pageState, page: value });
    setCurrentPage();
  };

  const handleModel = (id) => {
    console.log("SU ID: ", id);
    const selectedUser = userData?.find((user) => user.id === id);
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

  // useEffect(() => {
  //   setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
  // }, [pageState.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/users?page=${pageState.page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setUserData(response.data?.managers?.data);
      setMaxPage(response.data?.managers?.last_page);
      setCurrentPage(response.data?.managers?.currentPage);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageState.page]);

  return (
    <>
      <div className="min-h-screen">
        {openModel && (
          <SingleUser
            UserModelOpen={handleModel}
            handleUserModelClose={handleModelClose}
            UserData={singleUser}
          />
        )}
        {openDeleteModel && (
          <DeleteUser
            UserModelOpen={handleDelete}
            handleUserModelClose={handleDeleteModelClose}
            UserData={userID}
            UserStatus={status}
            UserName={username}
            fetchUser={fetchUsers}
          />
        )}
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            {/* <div className="px-5">
              <div className="mt-5 md:mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
                  {userData?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          currentMode === "dark"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-black"
                        } p-3 rounded-md `}
                      >
                        {item?.displayImg ? (
                          <img
                            src={item?.displayImg}
                            className="rounded-md cursor-pointer h-[50px] w-[50px] object-cover"
                            alt=""
                          />
                        ) : (
                          <Avatar
                            alt="User"
                            variant="circular"
                            style={{ width: "30px", height: "30px" }}
                          />
                        )}
                        <div className="mt-2 space-y-1 overflow-hidden">
                          <h1 className="font-bold capitalize">
                            {item?.userName}
                          </h1>
                          <p className="text-sm font-semibold text-red-600 capitalize">
                            {item?.position}
                          </p>
                          <hr />
                          <p className="text-sm">{item?.userContact}</p>
                          <p className="text-sm">{item?.userEmail}</p>
                          {item?.status === 0 ? (
                            <p className="text-sm text-red-600">Deactive</p>
                          ) : (
                            <p className="text-sm text-green-600">Active</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div> */}
            {/* <div className="px-5">
              <div className="mt-5 md:mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
                  {userData?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          currentMode === "dark"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-black"
                        } p-3 rounded-md `}
                      >
                        {item?.displayImg ? (
                          <img
                            src={item?.displayImg}
                            className="rounded-md cursor-pointer h-[50px] w-[50px] object-cover"
                            alt=""
                          />
                        ) : (
                          <Avatar
                            alt="User"
                            variant="circular"
                            style={{ width: "50px", height: "50px" }}
                          />
                        )}
                        <div className="mt-2 space-y-1 overflow-hidden">
                          <h1 className="font-bold capitalize">
                            {item?.userName}
                          </h1>
                          <p className="text-sm font-semibold text-red-600 capitalize">
                            {item?.position}
                          </p>
                          <hr />
                          <p className="text-sm">{item?.userContact}</p>
                          <p className="text-sm">{item?.userEmail}</p>
                          {item?.status === 0 ? (
                            <p className="text-sm text-red-600">Deactive</p>
                          ) : (
                            <p className="text-sm text-green-600">Active</p>
                          )}
                        </div>

                        <div className="flex  justify-between space-x-2 mt-2">
                          <Link
                            to={`/updateuser/${item?.id}`}
                            className="text-blue-500"
                          >
                            <FaEdit />
                          </Link>

                          <Button
                            className="text-green-500"
                            onClick={() => handleModel(item?.id)}
                          >
                            <FaEye />
                          </Button>

                          <Button
                            className="text-red-500"
                            onClick={() => handleDelete(item?.id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div> */}

            <div className="px-5">
              <div className="mt-5 md:mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 pb-3">
                  {userData?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          currentMode === "dark"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-black"
                        } rounded-md relative hover:shadow-lg text-sm`}
                      >
                        <div className="grid grid-cols-12">
                          <div className="col-span-10 p-2">
                            <div className="flex items-center m-1">
                              {/* IMAGE  */}
                              {item?.profile_picture ? (
                                <img
                                  src={item?.profile_picture}
                                  className="rounded-full cursor-pointer h-[50px] w-[50px] object-cover"
                                  alt=""
                                />
                              ) : (
                                <Avatar
                                  alt="User"
                                  variant="circular"
                                  style={{ width: "50px", height: "50px" }}
                                />
                              )}
                              {/* NAME & POSITION  */}
                              <div className="mx-3 space-y-1 overflow-hidden">
                                <h1 className="font-bold text-base">
                                  {item?.userName}
                                </h1>
                                <p className="text-red-600 capitalize">
                                  {item?.position}
                                </p>
                              </div>
                            </div>
                            <div className="h-0.5 w-full bg-[#DA1F26] my-3"></div>
                            <div className="space-y-3 m-1">
                              <div className="flex">
                                <MdOutlineCall size={16} className="mr-3" />
                                <p>{item?.userContact}</p>
                              </div>
                              <div className="flex">
                                <TfiEmail size={16} className="mr-3" />
                                <p>{item?.userEmail}</p>
                              </div>
                              
                              {item?.status !== 1 ? (
                                <p className="text-red-600">Deactive</p>
                              ) : (
                                <p className="text-green-600">Active</p>
                              )}
                            </div>
                          </div>
                          <div className="col-span-2 bg-[#DA1F26] text-white p-2 flex flex-col space-y-3 justify-center rounded-md">
                            {/* VIEW  */}
                            <div className="w-full flex justify-center my-1">
                              <Tooltip title="View User Details" arrow>
                                <Button
                                  onClick={() => handleModel(item?.id)}
                                >
                                  <MdOutlinePermContactCalendar size={18} className="text-white hover:text-black" />
                                </Button>
                              </Tooltip>
                            </div>
                            
                            {/* EDIT  */}
                            <div className="w-full flex justify-center items-center my-1 mb-5">
                              <Tooltip title="Edit User Details" arrow>
                                <Link
                                  to={`/updateuser/${item?.id}`}
                                >
                                  <AiOutlineEdit size={18} className="text-white hover:text-black" />
                                </Link>
                              </Tooltip>
                            </div>
                            
                            {/* DEACTIVATE & REACTIVATE */}
                            <div className="w-full flex justify-center my-1">
                              {hasPermission("users_delete") ? (
                                <>
                                  {item?.status === 1 ? (
                                    <Tooltip title="Deactivate User" arrow>
                                      <Button
                                        onClick={() =>
                                          handleDelete(
                                            item?.id,
                                            item?.status,
                                            item?.userName
                                          )
                                        }
                                      >
                                        <FaBan size={14} className="text-white hover:text-black" />
                                      </Button>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="Reactivate User" arrow>
                                        <Button
                                        onClick={() =>
                                          handleDelete(
                                            item?.id,
                                            item?.status,
                                            item?.userName
                                          )
                                        }
                                      >
                                        <FaUnlock size={14} className="text-white hover:text-black" />
                                      </Button>
                                    </Tooltip>
                                  )}
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        

                        <div className="absolute items-center right-2 flex flex-col space-y-10">
                          

                          

                            
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
                    backgroundColor: "#DA1F26 !important",
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

export default UserTable;
