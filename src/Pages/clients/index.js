import { Button } from "@material-tailwind/react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import Footer from "../../Components/Footer/Footer";

import { AiOutlineEdit } from "react-icons/ai";
import { ImUser } from "react-icons/im";
import { HiUsers } from "react-icons/hi";
import { FaBan } from "react-icons/fa";
import SingleUser from "../../Components/Users/SingleUser";

const Clients = () => {
  const { currentMode, DataGridStyles } = useStateContext();

  const columns = [
    {
      field: "id",
      headerName: "#",
      headerAlign: "center",
      minWidth: 30,
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
      field: "contactNumber",
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
      field: "email",
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
      field: "totalUser",
      headerName: "Total User Accounts",
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
      field: "activeUser",
      headerName: "Active User Accounts",
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
      field: "totalLeads",
      headerName: "Total Leads",
      headerAlign: "center",
      editable: false,
      minWidth: 110,
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
              // onClick={() => HandleEditFunc(cellValues)}
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
              // onClick={() => HandleEditFunc(cellValues)}
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
              // onClick={() => HandleEditFunc(cellValues)}
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

  const rows = [
    {
      id: 1,
      clientName: "Mahmoud Zreik",
      contactNumber: "566666555",
      email: "1@hikalproperties.ae",
      businessName: "Fam Properties",
      totalUser: "18",
      activeUser: "13",
      totalLeads: "714",
    },
    {
      id: 2,
      clientName: "Hadjer",
      contactNumber: "555567678",
      email: "2@hikalproperties.ae",
      businessName: "",
      totalUser: "1",
      activeUser: "1",
      totalLeads: "371",
    },
    {
      id: 3,
      clientName: "Saad Bukhari",
      contactNumber: "536526766",
      email: "3@hikalproperties.ae",
      businessName: "Grace House Properties",
      totalUser: "1",
      activeUser: "0",
      totalLeads: "0",
    },
    {
      id: 4,
      clientName: "Kareem",
      contactNumber: "5638378937",
      email: "4@hikalproperties.ae",
      businessName: "Azizi Developments",
      totalUser: "1",
      activeUser: "1",
      totalLeads: "0",
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
