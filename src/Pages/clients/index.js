import { Button } from "@material-tailwind/react";
import { Box, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import Footer from "../../Components/Footer/Footer";

import { AiOutlineEdit } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";

import { ImUser } from "react-icons/im";
import { HiUsers } from "react-icons/hi";
import { FaBan } from "react-icons/fa";
import SingleUser from "../../Components/Users/SingleUser";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import DeactivateModel from "./deactivateModel";

const Clients = () => {
  const { currentMode, DataGridStyles, BACKEND_URL } = useStateContext();
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
  const HandleViewAccounts = (cellValues) => {
    console.log("cellValues : ", cellValues.id);
    navigate(`/agencyUsers/${cellValues.id}`);
  };

  const HandleOpenModel = (cellValues) => {
    setModel(true);
  };

  const HandleModelClose = (cellValues) => {
    setModel(false);
  };

  const HandleViewLeads = (cellValues) => {
    console.log("cellValues : ", cellValues.id);
    navigate(`/clientLeads/${cellValues.id}`);
  };

  const HandleAccountDeactivation = async (accountDeactivate) => {
    try {
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
      accountCount = await axios.get(`${BACKEND_URL}/totalUser/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("Total Accounts: ", accountCount?.data?.total_users);
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
    return accountCount?.data?.total_users;
  };

  const activeAccountCount = async (token, id) => {
    let accounts;
    try {
      accounts = await axios.get(`${BACKEND_URL}/activeAccounts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("Accounts: ", accounts?.data?.total_users);
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
    return accounts?.data?.total_users;
  };

  const LeadCount = async (token, id) => {
    let userLeads;
    try {
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

    // setpageState((old) => ({
    //   ...old,
    //   isLoading: false,
    // }));

    return userLeads?.data?.total_users_leads;
  };

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

      console.log("Clients ", response);

      const clientsData = response.data.clients.data;
      console.log("clients array is", clientsData);

      const rowsdataPromises = clientsData?.map(async (client, index) => ({
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
        totalLeads: await LeadCount(token, client?.id),
        activeAccounts: await activeAccountCount(token, client?.id),
        totalAccounts: await totalUser(token, client?.id),
      }));

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
      toast.error("Sorry something went wrong.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
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
      field: "id",
      headerName: "Client Id",
      headerAlign: "center",
      minWidth: 90,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div
            className={`${
              currentMode === "dark" ? "bg-gray-800" : "bg-gray-200"
            } w-full h-full flex justify-center items-center px-5 font-semibold`}
          >
            {cellValues.formattedValue}
          </div>
        );
      },
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
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
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues.formattedValue}</p>
          </div>
        );
      },
    },

    {
      field: "totalAccounts",
      headerName: "Total User Accounts",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      field: "activeAccounts",
      headerName: "Total Active Accounts",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      field: "totalLeads",
      headerName: "Total Leads",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      field: "",
      headerName: "Actions",
      minWidth: 170,
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
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              <ImUser size={20} />
            </Button>
            <Button
              onClick={() => HandleViewLeads(cellValues)}
              title="View Leads of the Client"
              className={` ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
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
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              <FaBan size={20} />
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

      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="flex">
            <Sidebarmui />
            <div className={`w-full `}>
              <div className="px-5">
                <Navbar />
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
                  <Box width={"100%"} sx={DataGridStyles}>
                    <DataGrid
                      autoHeight
                      disableSelectionOnClick
                      onRowClick={handleRowClick}
                      rowCount={pageState.total}
                      rowsPerPageOptions={[30, 50, 75, 100]}
                      pagination
                      width="auto"
                      paginationMode="server"
                      rows={pageState?.data}
                      loading={pageState.isLoading}
                      columns={columns}
                      sx={{
                        boxShadow: 2,
                        "& .MuiDataGrid-cell:hover": {
                          cursor: "pointer",
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
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Clients;
