import { Pagination, PaginationItem, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

// const NotesGrid = ({ pageState, setpageState }) => {
//   console.log("Notes state: ", pageState);
//   const [loading, setLoading] = useState(false);
//   const { currentMode, BACKEND_URL, pageState, setpageState } =
//     useStateContext();
//   const [maxPage, setMaxPage] = useState(0);
//   const [userData, setUserData] = useState([]);
//   const token = localStorage.getItem("auth-token");
//   const handlePageChange = (event, value) => {
//     setpageState({ ...pageState, page: value });
//   };
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${BACKEND_URL}/api?page=${pageState.page}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: "Bearer " + token,
//             },
//           }
//         );
//         setUserData(response.data?.managers?.data);
//         setMaxPage(response.data?.managers?.last_page);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [pageState.page]);
//   return (
//     <>
//       <div className="min-h-screen">
//         {loading ? (
//           <Loader />
//         ) : (
//           <div
//             className={`w-full ${
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
//                           <h1 className="font-bold capitalize">
//                             {item?.userName}
//                           </h1>
//                           <p className="text-sm font-semibold text-red-600 capitalize">
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
//                 color={currentMode === "dark" ? "primary" : "secondary"}
//                 onChange={handlePageChange}
//                 style={{ margin: "auto" }}
//                 sx={{
//                   "& .Mui-selected": {
//                     color: currentMode === "dark" ? "white" : "gray",
//                     backgroundColor: currentMode === "dark" ? "black" : "white",
//                     "&:hover": {
//                       backgroundColor:
//                         currentMode === "dark" ? "black" : "white",
//                     },
//                   },
//                   "& .MuiPaginationItem-root": {
//                     color: currentMode === "dark" ? "white" : "gray",
//                   },
//                 }}
//               />
//             </Stack>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// const NotesGrid = ({ pageState, setpageState }) => {
//   console.log("Notes state: ", pageState);
//   const [loading, setLoading] = useState(false);
//   const { currentMode } = useStateContext();
//   const [maxPage, setMaxPage] = useState(0);
//   const [notesData, setUserData] = useState([]);

//   console.log("USERDATA: ", notesData);

//   const handlePageChange = (event, value) => {
//     setpageState({ ...pageState, page: value });
//   };

//   useEffect(() => {
//     setLoading(true);

//     const { data, isLoading, page, pageSize, total } = pageState;
//     setUserData(data);
//     setMaxPage(Math.ceil(total / pageSize));
//     setLoading(isLoading);

//     // const timeout = setTimeout(() => {
//     //   const { data, isLoading, page, pageSize, total } = pageState;
//     //   console.log("DATA: ", data);
//     //   const start = (page - 1) * pageSize;
//     //   console.log("start", start);
//     //   const end = start + pageSize;
//     //   console.log("End: ", end);
//     //   const paginatedData = data.slice(start, end);

//     //   console.log("PAgination: ", paginatedData);

//     //   setUserData(data);
//     //   setMaxPage(Math.ceil(total / pageSize));
//     //   setLoading(isLoading);
//     // }, 1000);

//     // return () => clearTimeout(timeout);
//   }, [pageState]);

//   return (
//     <>
//       <div className="min-h-screen">
//         {loading ? (
//           <Loader />
//         ) : (
//           <div
//             className={`w-full ${
//               currentMode === "dark" ? "bg-black" : "bg-white"
//             }`}
//           >
//             <div className="px-5">
//               <div className="mt-5 md:mt-2">
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
//                   {notesData?.length > 0 &&
//                     notesData?.map((item, index) => {
//                       return (
//                         <div
//                           key={index}
//                           className={`${
//                             currentMode === "dark"
//                               ? "bg-gray-900 text-white"
//                               : "bg-gray-200 text-black"
//                           } p-3 rounded-md `}
//                         >
//                           <div className="mt-2 space-y-1 overflow-hidden">
//                             <h1 className="font-bold capitalize">
//                               <b>Lead Name: </b> {item?.leadName}
//                             </h1>

//                             <p className="text-sm">
//                               <b>Project: </b> {item?.project}
//                             </p>
//                             <hr />
//                             <p className="text-sm font-semibold text-red-600 capitalize">
//                               <b>Lead Note: </b> {item?.leadNote}
//                             </p>
//                             <p className="text-sm">{item.userEmail}</p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                 </div>
//               </div>
//             </div>
//             <Stack spacing={2} marginTop={2}>
//               {/* <Pagination
//                 count={maxPage}
//                 color={currentMode === "dark" ? "primary" : "secondary"}
//                 onChange={handlePageChange}
//                 style={{ margin: "auto" }}
//                 sx={{
//                   "& .Mui-selected": {
//                     color: currentMode === "dark" ? "white" : "gray",
//                     backgroundColor: currentMode === "dark" ? "black" : "white",
//                     "&:hover": {
//                       backgroundColor:
//                         currentMode === "dark" ? "black" : "white",
//                     },
//                   },
//                   "& .MuiPaginationItem-root": {
//                     color: currentMode === "dark" ? "white" : "gray",
//                   },
//                 }}
//               /> */}
//               <Pagination
//                 count={maxPage}
//                 color={currentMode === "dark" ? "primary" : "secondary"}
//                 onChange={handlePageChange}
//                 style={{ margin: "auto" }}
//                 sx={{
//                   "& .Mui-selected": {
//                     color: currentMode === "dark" ? "white" : "gray",
//                     backgroundColor: currentMode === "dark" ? "black" : "white",
//                     "&:hover": {
//                       backgroundColor:
//                         currentMode === "dark" ? "black" : "white",
//                     },
//                   },
//                   "& .MuiPaginationItem-root": {
//                     color: currentMode === "dark" ? "white" : "gray",
//                   },
//                 }}
//                 renderItem={(item) => (
//                   <PaginationItem
//                     {...item}
//                     sx={{
//                       color:
//                         item.type === "start-ellipsis" ||
//                         item.type === "end-ellipsis"
//                           ? currentMode === "dark"
//                             ? "white"
//                             : "gray"
//                           : undefined,
//                       backgroundColor:
//                         item.type === "start-ellipsis" ||
//                         item.type === "end-ellipsis"
//                           ? undefined
//                           : currentMode === "dark"
//                           ? "black"
//                           : "white",
//                       "&:hover": {
//                         backgroundColor:
//                           currentMode === "dark" ? "black" : "white",
//                       },
//                     }}
//                   />
//                 )}
//               />
//             </Stack>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

const NotesGrid = ({ pageState, setpageState }) => {
  console.log("Notes state: ", pageState);
  const [loading, setLoading] = useState(false);
  const { currentMode } = useStateContext();
  const [maxPage, setMaxPage] = useState(0);
  const [notesData, setUserData] = useState([]);
  const navigate = useNavigate();

  console.log("USERDATA: ", notesData);

  const handlePageChange = (event, value) => {
    setpageState({ ...pageState, page: value });
  };

  const handleNavigate = (e, leadId) => {
    e.preventDefault();

    const url = `/leadnotes/${leadId}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    setLoading(true);

    const { data, isLoading, page, pageSize, total, gridPageSize } = pageState;
    setUserData(data);
    // setMaxPage(Math.ceil(total / pageSize));
    setMaxPage(gridPageSize);
    setLoading(isLoading);
  }, [pageState.page]);

  return (
    <>
      <div className="min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="px-5">
              <div className="mt-5 md:mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
                  {notesData?.length > 0 &&
                    notesData?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={`${
                            currentMode === "dark"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-200 text-black"
                          } p-3 rounded-md cursor-pointer `}
                          onClick={(e) => handleNavigate(e, item?.leadId)}
                        >
                          <div className="mt-2 space-y-1 overflow-hidden">
                            <h1 className="font-bold capitalize">
                              <b>Lead Name: </b> {item?.leadName}
                            </h1>

                            <p className="text-sm">
                              <b>Project: </b> {item?.project}
                            </p>
                            <hr />
                            <p className="text-sm font-semibold text-red-600 capitalize">
                              <b>Lead Note: </b> {item?.leadNote}
                            </p>
                            <p className="text-sm">{item.userEmail}</p>
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
                page={pageState.page}
                onChange={handlePageChange}
                style={{ margin: "auto" }}
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
                // renderItem={(item) => {
                //   const isEllipsis =
                //     item.type === "start-ellipsis" ||
                //     item.type === "end-ellipsis";

                //   return (
                //     <PaginationItem
                //       {...item}
                //       // page={pageState.page}
                //       sx={{
                //         color: isEllipsis
                //           ? currentMode === "dark"
                //             ? "red"
                //             : "red"
                //           : undefined,
                //         backgroundColor: isEllipsis
                //           ? undefined
                //           : currentMode === "dark"
                //           ? "red"
                //           : "red",
                //         "&:hover": {
                //           backgroundColor:
                //             currentMode === "dark" ? "red" : "red",
                //         },
                //       }}
                //     />
                //   );
                // }}
              />
            </Stack>
          </div>
        )}
      </div>
    </>
  );
};

export default NotesGrid;
