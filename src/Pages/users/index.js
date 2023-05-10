import { Button } from "@material-tailwind/react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import Footer from "../../Components/Footer/Footer";

import { AiOutlineEdit } from "react-icons/ai";
import SingleUser from "../../Components/Users/SingleUser";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Users = () => {
  //View LEAD MODAL VARIABLES

  const { currentMode, DataGridStyles, BACKEND_URL } = useStateContext();

  const [user, setUser] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Users: ", response);
      setUser(response?.data?.managers?.data);
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch users.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "#",
      headerAlign: "center",
      minWidth: 60,
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
      field: "userName",
      headerName: "User Name",
      headerAlign: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      field: "position",
      headerName: "Position",
      headerAlign: "center",
      editable: false,
      minWidth: 130,
      flex: 1,
    },
    {
      field: "userContact",
      headerName: "Contact Number",
      headerAlign: "center",
      editable: false,
      minWidth: 130,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },
    {
      field: "userEmail",
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
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues?.formattedValue === 1 && (
              <div className="w-full h-full flex justify-center items-center text-[#0f9d58] px-5 text-xs font-semibold">
                ACTIVATED ACCOUNT
              </div>
            )}

            {cellValues?.formattedValue === 0 && (
              <div className="w-full h-full flex justify-center items-center text-[#ff0000] px-5 text-xs font-semibold">
                DEACTIVATED ACCOUNT
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "",
      headerName: "Action",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className="deleteLeadBtn editLeadBtn space-x-2 w-full flex items-center justify-center ">
            <Button
              // onClick={() => HandleEditFunc(cellValues)}
              title="Edit User"
              className={`editUserBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              <AiOutlineEdit size={20} />
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = [
    {
      id: 1,
      userName: "Hala Hikal",
      position: "Sales Agent",
      contactNumber: "566666555",
      email: "1@hikalproperties.ae",
      status: "1",
    },
    {
      id: 2,
      userName: "Ameer Ali",
      position: "Sales Agent",
      contactNumber: "555567678",
      email: "2@hikalproperties.ae",
      status: "0",
    },
    {
      id: 3,
      userName: "Belal Hikal",
      position: "Sales Manager",
      contactNumber: "536526766",
      email: "3@hikalproperties.ae",
      status: "1",
    },
    {
      id: 4,
      userName: "Nada Amin",
      position: "Head of Sales",
      contactNumber: "5638378937",
      email: "4@hikalproperties.ae",
      status: "1",
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
                      Users
                    </h2>
                  </div>
                  <Box width={"100%"} sx={DataGridStyles}>
                    <DataGrid
                      autoHeight
                      disableSelectionOnClick
                      onRowClick={handleRowClick}
                      rowsPerPageOptions={[30, 50, 75, 100]}
                      pagination
                      width="auto"
                      paginationMode="server"
                      rows={user}
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

export default Users;
