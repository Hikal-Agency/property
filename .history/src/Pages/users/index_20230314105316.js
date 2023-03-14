import { Button } from "@material-tailwind/react";
import { Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import { GeneralInfo as GeneralInfoTab } from "../../Components/profile/GeneralInfo.jsx";
import { PersonalInfo as PersonalInfoTab } from "../../Components/profile/PersonalInfo";
import { ChangePassword as ChangePasswordTab } from "../../Components/profile/ChangePassword";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { AiOutlineEdit } from "react-icons/ai";
import { TbBan } from "react-icons/tb";
import SingleUser from "../../Components/Users/SingleUser";

const Users = () => {
  const [loading, setloading] = useState(true);
  const [singleUserData, setSingleUserData] = useState();
  //View LEAD MODAL VARIABLES
  const [UserModelOpen, setUserModelOpen] = useState(false);
  const handleUserModelOpen = () => setUserModelOpen(true);
  const handleUserModelClose = () => setUserModelOpen(false);

  const {
    User,
    setUser,
    currentMode,
    DataGridStyles,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
  } = useStateContext();

  const columns = [
    { 
      field: 'id', 
      headerName: '#', 
      headerAlign: 'center',
      minWidth: 30,
      flex: 1 
    },
    {
      field: 'userName',
      headerName: 'User Name',
      headerAlign: 'center',
      editable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      field: 'position',
      headerName: 'Position',
      headerAlign: 'center',
      editable: false,
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'contactNumber',
      headerName: 'Contact Number',
      headerAlign: 'center',
      editable: false,
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email Address',
      headerAlign: 'center',
      editable: false,
      minWidth: 250,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      editable: false,
      minWidth: 180,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.formattedValue === "1" && (
              <div className="w-full h-full flex justify-center items-center text-[#0f9d58] px-5 text-xs font-semibold">
                ACTIVATED ACCOUNT
              </div>
            )}

            {cellValues.formattedValue === "0" && (
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
    { id: 1, userName: 'Hala Hikal', position: 'Sales Agent', contactNumber: '566666555', email: "1@hikalproperties.ae", status: "1" },
    { id: 2, userName: 'Ameer Ali', position: 'Sales Agent', contactNumber: '555567678', email: "2@hikalproperties.ae", status: "0" },
    { id: 3, userName: 'Belal Hikal', position: 'Sales Manager', contactNumber: '536526766', email: "3@hikalproperties.ae", status: "1" },
    { id: 4, userName: 'Nada Amin', position: 'Head of Sales', contactNumber: '5638378937', email: "4@hikalproperties.ae", status: "1" },
  ];

  const handleRowClick = async (params, event) => {
    if (
      !event.target.classList.contains("editLeadBtn")
    ) {
      // setSingleUserData(params.row);
      // handleUserModelOpen();
      <SingleUser />
    }
  };

  return (
    <>
    {/* <ToastContainer/> */}
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
                    <h2 className={` ${currentMode === "dark" ? "text-white" : "text-black"} font-semibold text-xl`}>Users</h2>
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
                      rows={rows}
                      columns={columns}
                      sx={{
                        boxShadow: 2,
                        "& .MuiDataGrid-cell:hover": {
                          cursor: "pointer",
                        },
                      }}
                      getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
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
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Users;
