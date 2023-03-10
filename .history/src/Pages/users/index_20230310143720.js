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

const Users = () => {
  const [loading, setloading] = useState(true);
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
      headerName: 'Ticket ID', 
      headerAlign: 'center',
      minWidth: 50,
      flex: 1 
    },
    {
      field: 'creationDate',
      headerName: 'Ticket Date',
      headerAlign: 'center',
      editable: false,
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'userName',
      headerName: 'User Name',
      headerAlign: 'center',
      editable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'category',
      headerName: 'Category',
      headerAlign: 'center',
      editable: false,
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      headerAlign: 'center',
      editable: false,
      minWidth: 555,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      editable: false,
      minWidth: 110,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.formattedValue === "Closed" && (
              <div className="w-full h-full flex justify-center items-center text-[#0f9d58] px-5 text-xs font-semibold">
                CLOSED
              </div>
            )}

            {cellValues.formattedValue === "Pending" && (
              <div className="w-full h-full flex justify-center items-center text-[#ff0000] px-5 text-xs font-semibold">
                PENDING
              </div>
            )}
          </>
        );
      },
    },
  ];
  
  const rows = [
    { id: 1, creationDate: "2022-03-03 03:03:03", userName: 'Hala Hikal', category: 'Closed Deals', description: "dhfjsfhs hasbdhakjbasda ashdbmajsdhaksjddakjdba jdbbajhakj jchjhbsadjh sjbsdjkbsdjhsddhsdd jcsdkhsksdf", status: "Pending" },
    { id: 2, creationDate: "2022-03-03 03:03:03", userName: 'Ameer Ali', category: 'Meetings', description: "dhfjsfhs hasbdhakjbasda ashdbmajsdhaksjddakjdba jdbbajhakj jchjhbsadjh sjbsdjkbsdjhsddhsdd jcsdkhsksdf", status: "Closed" },
    { id: 3, creationDate: "2022-03-03 03:03:03", userName: 'Hala Hikal', category: 'Closed Deals', description: "dhfjsfhs hasbdhakjbasda ashdbmajsdhaksjddakjdba jdbbajhakj jchjhbsadjh sjbsdjkbsdjhsddhsdd jcsdkhsksdf", status: "Postponed" },
    { id: 4, creationDate: "2022-03-03 03:03:03", userName: 'Hala Hikal', category: 'Closed Deals', description: "dhfjsfhs hasbdhakjbasda ashdbmajsdhaksjddakjdba jdbbajhakj jchjhbsadjh sjbsdjkbsdjhsddhsdd jcsdkhsksdf", status: "pending" },
  ];

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
                  <Box width={"100%"} sx={DataGridStyles}>
                    <DataGrid
                      autoHeight
                      disableSelectionOnClick
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

                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                    <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} rounded-md p-2`}>
                      hhh
                    </div>
                  </div>
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
