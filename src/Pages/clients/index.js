import { Button } from "@material-tailwind/react";

import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { useStateContext } from "../../context/ContextProvider";
import { RiRadioButtonLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";

import { ImUser } from "react-icons/im";
import { HiUsers } from "react-icons/hi";
import { FaBan } from "react-icons/fa";
import SingleUser from "../../Components/Users/SingleUser";
import { useState } from "react";
import { useEffect } from "react";
// import axios from "axios";
import axios from "../../axoisConfig";
import { useNavigate, useLocation } from "react-router";
import DeactivateModel from "./deactivateModel";
// import axios from "../../axoisConfig";

const Clients = () => {
  // const { currentMode, DataGridStyles, BACKEND_URL, User } = useStateContext();
  const { currentMode, DataGridStyles, BACKEND_URL, User, setUser } =
    useStateContext();
  const [accountDeactivate, setAccountToDeactivate] = useState();
  const [model, setModel] = useState(false);
  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });
  const [token, setToken] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const HandleViewAccounts = (cellValues) => {
    console.log("cellValues : ", cellValues.id);
    navigate(`/clients/agencyUsers/${cellValues.id}`);
  };

  const HandleOpenModel = (cellValues) => {
    setModel(true);
  };

  const HandleModelClose = (cellValues) => {
    setModel(false);
  };

  const HandleViewLeads = (cellValues) => {
    console.log("cellValues : ", cellValues.id);
    navigate(`/clients/clientLeads/${cellValues.id}`);
  };

  const HandleAccountDeactivation = async (accountDeactivate) => {
    try {
      // const deactivateAccount = await axios.get(
      //   `${BACKEND_URL}/blockagency/${accountDeactivate}`,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: "Bearer " + token,
      //     },
      //   }
      // );

      const deactivateAccount = await axios.get(
        `${BACKEND_URL}/blockagency/${accountDeactivate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      setModel(false);

      console.log("ID: ", accountDeactivate);

      toast.success("Account Deactivated.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      console.log("Deactivate: ", deactivateAccount);
    } catch (error) {
      console.error(error);
      toast.error("Sorry something went wrong.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const totalUser = async (token, id) => {
    let accountCount;
    try {
      // accountCount = await axios.get(`${BACKEND_URL}/totalUser/${id}`, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + token,
      //   },
      // });
      accountCount = await axios.get(`${BACKEND_URL}/totalUser/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      console.log("accounts count: ", error);
      toast.error("Failed to fetch accounts count.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    console.log(
      `Total Accounts: ${accountCount?.data?.total_users} for User ${id}`
    );
    return accountCount?.data?.total_users;
  };

  const activeAccountCount = async (token, id) => {
    let accounts;
    try {
      // accounts = await axios.get(`${BACKEND_URL}/activeAccounts/${id}`, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + token,
      //   },
      // });
      accounts = await axios.get(`${BACKEND_URL}/activeAccounts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      console.log("active account error: ", accounts);
      toast.error("Failed to fetch active accounts.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    console.log(
      `Active  Accounts:  ${accounts?.data?.total_users} for User : ${id}`
    );
    return accounts?.data?.total_users;
  };

  const LeadCount = async (token, id) => {
    let userLeads;
    try {
      // userLeads = await axios.get(`${BACKEND_URL}/usersleads/${id}`, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + token,
      //   },
      // });
      userLeads = await axios.get(`${BACKEND_URL}/usersleads/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      console.log("lead error: ", userLeads);
      toast.error("Failed to load leads.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    console.log(
      `Users Leads: ${userLeads?.data?.total_users_leads} for User: ${id}`
    );

    return userLeads?.data?.total_users_leads;
  };

  // const FetchLeads = async (token) => {
  //   setpageState((old) => ({
  //     ...old,
  //     isLoading: true,
  //   }));

  //   const MAX_RETRY_COUNT = 5; // maximum number of times to retry the API call
  //   const RETRY_DELAY = 9000; // delay in milliseconds between each retry
  //   const STORAGE_KEY = "leadsData";
  //   const EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes expiry time

  //   let retryCount = 0;
  //   let shouldFetchFromApi = true;

  //   // Check if data is present in local storage and if it is not expired
  //   const storedData = localStorage.getItem(STORAGE_KEY);
  //   if (storedData) {
  //     const { data, timestamp } = JSON.parse(storedData);
  //     if (Date.now() - timestamp < EXPIRY_TIME) {
  //       setpageState((old) => ({
  //         ...old,
  //         isLoading: false,
  //         data,
  //         total: data.length,
  //       }));
  //       shouldFetchFromApi = false;
  //     } else {
  //       localStorage.removeItem(STORAGE_KEY); // remove expired data
  //     }
  //   }

  //   if (shouldFetchFromApi) {
  //     while (retryCount < MAX_RETRY_COUNT) {
  //       try {
  //         // const response = await axios.get(
  //         //   `${BACKEND_URL}/clients?page=${pageState.page}`,
  //         //   {
  //         //     headers: {
  //         //       "Content-Type": "application/json",
  //         //       Authorization: "Bearer " + token,
  //         //     },
  //         //   }
  //         // );
  //         // console.log("Clients ", response);

  //         // let response;
  //         // apiClient
  //         //   .get(`/clients?page=${pageState.page}`, {
  //         //     headers: {
  //         //       "Content-Type": "application/json",
  //         //       Authorization: "Bearer " + token,
  //         //     },
  //         //   })
  //         //   .then((res) => {
  //         //     console.log("Clients: ", res);
  //         //     response = res;
  //         //   })
  //         //   .catch((error) => {
  //         //     console.error("Error: ", error);
  //         //     toast.error("Sorry something went wrong.", {
  //         //       position: "top-right",
  //         //       autoClose: 3000,
  //         //       hideProgressBar: false,
  //         //       closeOnClick: true,
  //         //       draggable: true,
  //         //       progress: undefined,
  //         //       theme: "light",
  //         //     });
  //         //     setpageState((old) => ({
  //         //       ...old,
  //         //       isLoading: false,
  //         //     }));
  //         //   });

  //         // console.log("Response: ", response);

  //         const response = await apiClient.get(
  //           `${BACKEND_URL}/clients?page=${pageState.page}`,
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: "Bearer " + token,
  //             },
  //           }
  //         );

  //         console.log("Clients: ", response);

  //         const clientsData = response.data.clients.data;
  //         console.log("clients array is", clientsData);

  //         const sortedClients = clientsData?.sort((a, b) => a.id - b.id);

  //         console.log("Sorted: ", sortedClients);

  //         const rowsdataPromises = clientsData?.map(async (client, index) => {
  //           const totalLeadsPromise = LeadCount(token, client?.id);
  //           const activeAccountsPromise = activeAccountCount(token, client?.id);
  //           const totalAccountsPromise = totalUser(token, client?.id);

  //           // Wait for all three promises to complete
  //           const [totalLeads, activeAccounts, totalAccounts] =
  //             await Promise.all([
  //               totalLeadsPromise,
  //               activeAccountsPromise,
  //               totalAccountsPromise,
  //             ]);

  //           return {
  //             id:
  //               pageState.page > 1
  //                 ? pageState.page * pageState.pageSize -
  //                   (pageState.pageSize - 1) +
  //                   index
  //                 : index + 1,
  //             creationDate: client?.creationDate,
  //             businessName: client?.businessName,
  //             clientContact: client?.clientContact,
  //             clientEmail: client?.clientEmail,
  //             project: client?.website,
  //             clientName: client?.clientName,
  //             clientId: client?.id,
  //             totalLeads,
  //             activeAccounts,
  //             totalAccounts,
  //           };
  //         });

  //         const rowsdata = await Promise.all(rowsdataPromises);
  //         console.log("Rows data here: ", rowsdata);

  //         setpageState((old) => ({
  //           ...old,
  //           isLoading: false,
  //           data: rowsdata,
  //           total: response.data.clients.total,
  //         }));

  //         // Store the data in local storage
  //         localStorage.setItem(
  //           STORAGE_KEY,
  //           JSON.stringify({ data: rowsdata, timestamp: Date.now() })
  //         );

  //         return; // exit the function on success
  //       } catch (error) {
  //         console.error(error);

  //         if (retryCount < MAX_RETRY_COUNT - 1) {
  //           console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
  //           await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
  //           retryCount++;
  //         } else {
  //           toast.error(
  //             "Sorry something went wrong. Kindly refresh the page.",
  //             {
  //               position: "top-right",
  //               autoClose: 3000,
  //               hideProgressBar: false,
  //               closeOnClick: true,
  //               draggable: true,
  //               progress: undefined,
  //               theme: "light",
  //             }
  //           );
  //           setpageState((old) => ({
  //             ...old,
  //             isLoading: false,
  //           }));
  //           return; // exit the function on failure
  //         }
  //       }
  //     }
  //   }
  // };

  const FetchLeads = async (token) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    try {
      const response = await axios.get(
        `${BACKEND_URL}/clients?page=${pageState.page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Clients: ", response);

      const clientsData = response.data.clients.data;
      console.log("clients array is", clientsData);

      const sortedClients = clientsData?.sort((a, b) => a.id - b.id);

      console.log("Sorted: ", sortedClients);

      const rowsdataPromises = clientsData?.map(async (client, index) => {
        const totalLeadsPromise = LeadCount(token, client?.id);
        const activeAccountsPromise = activeAccountCount(token, client?.id);
        const totalAccountsPromise = totalUser(token, client?.id);

        // Wait for all three promises to complete
        const [totalLeads, activeAccounts, totalAccounts] = await Promise.all([
          totalLeadsPromise,
          activeAccountsPromise,
          totalAccountsPromise,
        ]);

        return {
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          creationDate: client?.creationDate,
          businessName: client?.businessName,
          clientContact: client?.clientContact,
          clientEmail: client?.clientEmail,
          project: client?.website,
          clientName: client?.clientName,
          clientId: client?.id,
          totalLeads,
          activeAccounts,
          totalAccounts,
        };
      });

      const rowsdata = await Promise.all(rowsdataPromises);
      console.log("Rows data here: ", rowsdata);

      setpageState((old) => ({
        ...old,
        isLoading: false,
        data: rowsdata,
        total: response.data.clients.total,
      }));
    } catch (error) {
      console.error(error);

      toast.error("Sorry something went wrong. Kindly refresh the page.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setpageState((old) => ({
        ...old,
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    // const token = localStorage.getItem("auth-token");
    // FetchLeads(token);
    const authToken = localStorage.getItem("auth-token");
    setToken(authToken);
    FetchLeads(authToken);
  }, [pageState.page]);

  const columns = [
    {
      field: "clientId",
      headerName: "Id",
      headerAlign: "center",
      maxWidth: 40,
      flex: 1,

      // renderCell: (cellValues) => {
      //   return (
      //     <div
      //       className={`${
      //         currentMode === "dark" ? "bg-gray-800" : "bg-gray-200"
      //       } w-full h-full flex justify-center items-center px-5 font-semibold`}
      //     >
      //       {cellValues.formattedValue}
      //     </div>
      //   );
      // },
    },
    // {
    //   field: "clientName",
    //   headerName: "Client Name",
    //   headerAlign: "center",
    //   editable: false,
    //   minWidth: 180,
    //   flex: 1,
    // },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      editable: false,
      align: "center",
      minWidth: 17,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div
          // className="w-full flex flex-col items-center justify-center"
          // style={{ height: "500px" }}
          >
            <p className="text-center font-bold mb-2 capitalize">
              {cellValues.formattedValue}
            </p>
            <div className="flex flex-row  w-full">
              <div className="flex items-center w-full">
                <p
                  className="text-sm font-medium text-gray-500"
                  style={{ marginRight: "5px" }}
                >
                  Active
                </p>
                <RiRadioButtonLine
                  style={{ color: "green", marginRight: "5px" }}
                />
                :{"  "}
                <p className="text-sm font-medium text-gray-500">
                  {" "}
                  {cellValues.row.activeAccounts}
                </p>
              </div>
            </div>
            <div className="flex flex-col  justify-between w-full">
              <p className="text-sm font-medium text-gray-500">
                Total : {cellValues.row.totalAccounts}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      field: "clientContact",
      headerName: "Contact Number",
      headerAlign: "center",
      editable: false,
      minWidth: 130,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues.formattedValue}</p>
          </div>
        );
      },
    },
    {
      field: "clientEmail",
      headerName: "Email Address",
      headerAlign: "center",

      editable: false,
      minWidth: 250,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues.formattedValue}</p>
          </div>
        );
      },
    },
    {
      field: "businessName",
      headerName: "Business Name",
      headerAlign: "center",

      editable: false,
      minWidth: 180,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center ">
            <p className="text-center capitalize">
              {cellValues.formattedValue}
            </p>
          </div>
        );
      },
    },

    // {
    //   field: "totalAccounts",
    //   headerName: "Total User Accounts",

    //   headerAlign: "center",
    //   align: "center",
    //   editable: false,
    //   minWidth: 180,
    //   flex: 1,
    // },
    // {
    //   field: "activeAccounts",
    //   headerName: "Total Active Accounts",
    //   headerAlign: "center",
    //   align: "center",
    //   editable: false,
    //   minWidth: 180,
    //   flex: 1,
    // },
    {
      field: "totalLeads",
      headerName: "Leads",
      headerAlign: "center",
      align: "center",
      editable: false,
      maxWidth: 80,
      flex: 1,
    },
    {
      field: "",
      headerName: "Actions",
      minWidth: 130,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className="space-x-2 w-full flex items-center justify-center ">
            <Button
              onClick={() => HandleViewAccounts(cellValues)}
              title="View User Accounts of the Client"
              className={` ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <ImUser size={20} />
            </Button>
            <Button
              onClick={() => HandleViewLeads(cellValues)}
              title="View Leads of the Client"
              className={` ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <HiUsers size={20} />
            </Button>
            <Button
              onClick={() => {
                HandleOpenModel(cellValues);
                setAccountToDeactivate(cellValues?.id);
              }}
              title="Deactivate All User Accounts of the Client"
              className={` ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <FaBan size={20} color={"#DA1F26"} />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleRowClick = async (params, event) => {
    if (!event.target.classList.contains("editLeadBtn")) {
      // setSingleUserData(params.row);
      // handleUserModelOpen();
      <SingleUser />;
    }
  };

  return (
    <>
      <ToastContainer />

      {model && (
        <DeactivateModel
          handleOpenModel={HandleOpenModel}
          deactivateAccount={HandleAccountDeactivation}
          deactivateModelClose={HandleModelClose}
          accountToDelete={accountDeactivate}
        />
      )}

      <div className="flex min-h-screen mb-5">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className={`w-full `}>
            <div className="pl-3">
              <div className="my-5 mb-10">
                <div className="my-3">
                  <h2
                    className={` ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    } font-semibold text-xl`}
                  >
                    Clients
                  </h2>
                </div>
                <Box width={"100%"} className={`${currentMode}-mode-datatable`} sx={DataGridStyles}>
                  <DataGrid
                    autoHeight
                    disableSelectionOnClick
                    onRowClick={handleRowClick}
                    rowCount={pageState.total}
                    rowsPerPageOptions={[30, 50, 75, 100]}
                    pagination
                    width="auto"
                    rowHeight={90}
                    paginationMode="server"
                    rows={pageState?.data}
                    loading={pageState.isLoading}
                    columns={columns}
                    page={pageState.page - 1}
                    pageSize={pageState.pageSize}
                    onPageChange={(newPage) => {
                      setpageState((old) => ({ ...old, page: newPage + 1 }));
                    }}
                    onPageSizeChange={(newPageSize) =>
                      setpageState((old) => ({
                        ...old,
                        pageSize: newPageSize,
                      }))
                    }
                    sx={{
                      boxShadow: 2,
                      "& .MuiDataGrid-cell:hover": {
                        cursor: "pointer",
                      },
                      "& .MuiDataGrid-cell[data-field='edit'] svg": {
                        color:
                          currentMode === "dark"
                            ? "white !important"
                            : "black !important",
                      },
                    }}
                    getRowClassName={(params) =>
                      params.indexRelativeToCurrentPage % 2 === 0
                        ? "even"
                        : "odd"
                    }
                  />
                </Box>
              </div>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

export default Clients;
