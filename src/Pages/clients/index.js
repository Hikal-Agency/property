import { Button } from "@material-tailwind/react";
import { Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import Footer from "../../Components/Footer/Footer";

import { AiOutlineEdit } from "react-icons/ai";
import { ImUser } from "react-icons/im";
import { HiUsers } from "react-icons/hi";
import { FaBan } from "react-icons/fa";
import SingleUser from "../../Components/Users/SingleUser";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Clients = () => {
  const { currentMode, DataGridStyles, BACKEND_URL } = useStateContext();
  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });

  const HandleEditFunc = (cellValues) => {
    console.log("cellValues : ", cellValues.id);
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

      const rowsdata = clientsData?.map((client, index) => ({
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
        // notes: client?.notes,
        project: client?.website,
        clientName: client?.clientName,
        clientId: client?.id,
      }));

      console.log("Rows data: ", rowsdata);

      setpageState((old) => ({
        ...old,
        isLoading: false,
        data: rowsdata,
        total: response.data.clients.total,
        pageSize: response.data.clients.per_page,
      }));
    } catch (error) {
      console.log("error occurred", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchLeads(token);
    // eslint-disable-next-line
  }, [pageState.page]);

  const columns = [
    { 
      field: 'id', 
      headerName: '#', 
      headerAlign: 'center',
      minWidth: 30,
      flex: 1 ,
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
      field: 'clientName',
      headerName: 'Client Name',
      headerAlign: 'center',
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
      headerName: "Business",
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
    // {
    //   field: "notes",
    //   headerName: "Notes",
    //   headerAlign: "center",
    //   editable: false,
    //   minWidth: 180,
    //   flex: 1,
    //   renderCell: (cellValues) => {
    //     return (
    //       <div className="w-full flex items-center justify-center">
    //         <p className="text-center">{cellValues.formattedValue}</p>
    //       </div>
    //     );
    //   },
    // },
    {

      field: "creationDate",
      headerName: "Creation Date",
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
              onClick={() => HandleEditFunc(cellValues)}
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
                    <h2 className={` ${currentMode === "dark" ? "text-white" : "text-black"} font-semibold text-xl`}>Clients</h2>
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
                      rows={pageState?.data}
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
};

export default Clients;
