import { Button } from "@material-tailwind/react";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";

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
import { Link } from "react-router-dom";

const Users = () => {
  const { currentMode, DataGridStyles, BACKEND_URL, pageState, setpageState } =
    useStateContext();

  const [user, setUser] = useState([]);

  const handleTrainerSwitchChange = async (cellValues) => {
    console.log("Id: ", cellValues?.id);
    const token = localStorage.getItem("auth-token");

    const make_trainer = cellValues?.formattedValue === 1 ? 0 : 1;

    console.log("Make trainer: ", make_trainer);

    const Update_trainer = new FormData();

    Update_trainer.append("is_trainer", make_trainer);

    try {
      const is_trainer = await axios.post(
        `${BACKEND_URL}/updateuser/${cellValues?.id}`,
        Update_trainer,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Response: ", is_trainer);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const fetchUsers = async (token) => {
    try {
      // const token = localStorage.getItem("auth-token");
      const response = await axios.get(
        `${BACKEND_URL}/users?page=${pageState.page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("Users: ", response);

      let rowsDataArray = "";
      if (response?.data?.managers?.current_page > 1) {
        const theme_values = Object.values(response?.data?.managers?.data);
        rowsDataArray = theme_values;
      } else {
        rowsDataArray = response?.data?.managers?.data;
      }

      let rowsdata = rowsDataArray?.map((row, index) => ({
        id:
          pageState.page > 1
            ? pageState.page * pageState.pageSize -
              (pageState.pageSize - 1) +
              index
            : index + 1,
        id: row?.id,
        userName: row?.userName || "No Name",
        position: row?.position || "No Position",
        userContact: row?.userContact || "No Contact",
        userEmail: row?.userEmail || "No Email",
        status: row?.status,
        is_trainer: row?.is_trainer,
        displayImg: row?.displayImg,
        edit: "edit",
      }));

      console.log("Rows Data: ", rowsdata);

      setpageState((old) => ({
        ...old,
        isLoading: false,
        data: rowsdata,
        pageSize: response?.data?.managers?.per_page,
        total: response?.data?.managers?.total,
      }));

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
    const token = localStorage.getItem("auth-token");
    fetchUsers(token);
  }, [pageState.page]);

  const columns = [
    {
      field: "id",
      headerName: "#",
      headerAlign: "center",
      maxWidth: 90,
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
      field: "displayImg",
      headerName: "Image",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 90,
      flex: 1,
      renderCell: (cellValues) => {
        console.log("Image: ", cellValues);
        const imgSrc = cellValues?.formattedValue;
        if (imgSrc) {
          return (
            <img
              src={imgSrc}
              alt="User"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
              }}
            />
          );
        } else {
          return (
            <Avatar
              alt="User"
              variant="circular"
              style={{ width: "30px", height: "30px" }}
            />
          );
        }
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
      field: "userEmail",
      headerName: "Email Address",
      headerAlign: "center",
      editable: false,
      minWidth: 250,
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
      field: "is_trainer",
      headerName: "Trainer",
      headerAlign: "center",
      editable: false,
      minWidth: 150,
      flex: 1,
      renderCell: (cellValues) => {
        console.log("Trainer: ", cellValues);
        return (
          <div className="w-full flex items-center justify-center">
            <Switch
              defaultChecked={cellValues?.formattedValue === 1}
              onClick={() => handleTrainerSwitchChange(cellValues)}
              color={"default"}
            />
          </div>
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      editable: false,
      maxWidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues?.formattedValue === 1 && (
              <div className="w-full h-full flex justify-center items-center text-[#0f9d58] px-5 text-xs font-semibold">
                ACTIVE
              </div>
            )}

            {cellValues?.formattedValue === 0 && (
              <div className="w-full h-full flex justify-center items-center text-[#ff0000] px-5 text-xs font-semibold">
                DEACTIVE
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "",
      headerName: "Action",
      maxWidth: 90,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className="deleteLeadBtn editLeadBtn space-x-2 w-full flex items-center justify-center ">
            <Button
              title="Edit User"
              className={`editUserBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              <Link to={`/updateuser/${cellValues?.id}`}>
                {" "}
                <AiOutlineEdit size={20} />
              </Link>
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
                      Users :{" "}
                      <span className="text-main-red-color font-bold">
                        {pageState?.total}
                      </span>
                    </h2>
                  </div>
                  <Box width={"100%"} sx={DataGridStyles}>
                    <DataGrid
                      autoHeight
                      disableSelectionOnClick
                      rows={pageState.data}
                      columns={columns}
                      rowCount={pageState.total}
                      rowsPerPageOptions={[30, 50, 75, 100]}
                      pagination
                      width="auto"
                      paginationMode="server"
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
