import { Button, Pagination, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
// import axios from "axios";
import axios from "../../axoisConfig";
import { FaBan, FaEdit, FaEye, FaTrash, FaUnlock } from "react-icons/fa";
import { Link } from "react-router-dom";
import SingleUser from "./SingleUser";
import usePermission from "../../utils/usePermission";
import DeleteUser from "./DeleteUser";

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

const UserTable = ({ user }) => {
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
                  {userData?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          currentMode === "dark"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-black"
                        } p-3 rounded-md relative`}
                      >
                        {item?.profile_picture ? (
                          <img
                            src={item?.profile_picture}
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
                          {/* <hr /> */}
                          <p className="text-sm">{item?.userContact}</p>
                          <p className="text-sm">{item?.userEmail}</p>
                          {item?.status !== 1 ? (
                            <p className="text-sm text-red-600">Deactive</p>
                          ) : (
                            <p className="text-sm text-green-600">Active</p>
                          )}
                        </div>

                        <div className="absolute top-2 items-center right-2 flex flex-col space-y-10">
                          <Button
                            className="text-green-500 mt-5"
                            onClick={() => handleModel(item?.id)}
                          >
                            <FaEye style={{ color: "green" }} />
                          </Button>

                          <Link
                            to={`/updateuser/${item?.id}`}
                            className="text-blue-500"
                          >
                            <FaEdit
                              style={{
                                color:
                                  currentMode == "dark" ? "white" : "black",
                              }}
                            />
                          </Link>

                            <>
                              {hasPermission("users_delete") ? (
                                <>
                                  {item?.status === 1 ? (
                                    <Button
                                      className="text-red-500"
                                      onClick={() =>
                                        handleDelete(
                                          item?.id,
                                          item?.status,
                                          item?.userName
                                        )
                                      }
                                    >
                                      <FaBan style={{ color: "red" }} />
                                    </Button>
                                  ) : (
                                    <Button
                                      className="text-green-500"
                                      onClick={() =>
                                        handleDelete(
                                          item?.id,
                                          item?.status,
                                          item?.userName
                                        )
                                      }
                                    >
                                      <FaUnlock style={{ color: "green" }} />
                                    </Button>
                                  )}
                                </>
                              ) : null}
                            </>
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
