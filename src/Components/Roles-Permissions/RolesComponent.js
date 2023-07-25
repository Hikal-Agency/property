import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Avatar, Box, Button, Switch } from "@mui/material";
import {
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineTable,
  AiOutlineAppstore,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "../../axoisConfig";
import { FaBan, FaEdit, FaTrash, FaUnlock } from "react-icons/fa";

const RolesComponent = () => {
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    pageState,
    setpageState,
    User,
    darkModeColors,
  } = useStateContext();

  const [user, setUser] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [value, setValue] = useState(0);
  const [model, setModel] = useState(false);
  const [userID, setUserId] = useState();
  const [userStatus, setUserStatus] = useState();
  const [username, setUserName] = useState();
  const [openDeleteModel, setOpenDeleteModel] = useState(false);

  const HandleOpenModel = () => {
    console.log("Model Open:");
    setModel(true);
  };

  const HandleModelClose = () => {
    console.log("Model Close:");

    setModel(false);
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

  const handleTrainerSwitchChange = async (cellValues) => {
    console.log("Id: ", cellValues?.id);
    const token = localStorage.getItem("auth-token");

    const make_trainer = cellValues?.formattedValue === 1 ? 2 : 1;

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

      toast.success("User trainer permission updated.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      console.log("Response: ", is_trainer);
    } catch (error) {
      toast.error("Unable to update user.", {
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
  const fetchUsers = async (token) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));
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
        profile_picture: row?.profile_picture,
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

      setUser(response?.data);
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
    setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    fetchUsers(token);
  }, [pageState.page]);
  const columns = [
    {
      field: "profile_picture",
      headerName: "User",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
      renderCell: (cellValues) => {
        console.log("Image: ", cellValues);
        const imgSrc = cellValues?.formattedValue;
        if (imgSrc) {
          return (
            <>
              <div className="flex flex-col items-center my-2">
                <img
                  src={imgSrc}
                  alt="User"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
                <h2 className="mt-2">{cellValues.row.userName}</h2>
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="flex flex-col items-center my-2">
                <Avatar
                  alt="User"
                  variant="circular"
                  style={{ width: "30px", height: "30px" }}
                />
                <h2 className="mt-2">{cellValues.row.userName}</h2>
              </div>
            </>
          );
        }
      },
    },

    {
      field: "userContact",
      headerName: "Contact Number",
      headerAlign: "center",
      editable: false,
      minwidth: 130,
      flex: 1,
    },
    {
      field: "position",
      headerName: "Position",
      headerAlign: "center",
      editable: false,
      minwidth: 150,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center ">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    {
      field: "userEmail",
      headerName: "Email Address",
      headerAlign: "center",
      editable: false,
      minwidth: 250,
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
      minwidth: 60,
      flex: 1,
      renderCell: (cellValues) => {
        console.log("Trainer: ", cellValues);

        return (
          <div className="w-full flex items-center justify-center capitalize">
            <Switch
              defaultChecked={cellValues?.formattedValue === 1}
              onChange={() => handleTrainerSwitchChange(cellValues)}
              sx={{
                color: "green !important",
                "& .MuiSwitch-thumb": {
                  color:
                    cellValues?.formattedValue === 1
                      ? "green !important"
                      : "#B91C1C !important",
                },
                "& .Mui-checked": {
                  color:
                    cellValues?.formattedValue === 1
                      ? "green !important"
                      : "#B91C1C !important",
                },
                "& .MuiSwitch-track": {
                  backgroundColor:
                    cellValues?.formattedValue === 1
                      ? "green !important"
                      : "#B91C1C !important",
                },
                "& .css-1q0bjt2-MuiSwitch-root .MuiSwitch-thumb": {
                  backgroundColor:
                    cellValues?.formattedValue === 1
                      ? "green !important"
                      : "#B91C1C !important",
                },
              }}
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
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues?.formattedValue === 1 ? (
              <div className="w-full h-full flex justify-center items-center text-[#0f9d58] px-5 text-xs font-semibold">
                ACTIVE
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center text-[#ff0000] px-5 text-xs font-semibold">
                DEACTIVE
              </div>
            )}
            {/* 
            {cellValues?.formattedValue === 0 && (
              <div className="w-full h-full flex justify-center items-center text-[#ff0000] px-5 text-xs font-semibold">
                DEACTIVE
              </div>
            )} */}
          </>
        );
      },
    },
    {
      field: "",
      headerName: "Action",
      minwidth: 90,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className=" space-x-2 w-full flex items-center justify-center ">
            {User?.role === 1 || User?.role === 2 ? (
              <>
                {cellValues.row.status === 1 ? (
                  <Button
                    onClick={() =>
                      handleDelete(
                        cellValues?.id,
                        cellValues.row.status,
                        cellValues?.row?.userName
                      )
                    }
                    className={`editUserBtn ${
                      currentMode === "dark"
                        ? "text-white bg-transparent rounded-md p-1 shadow-none "
                        : "text-black bg-transparent rounded-md p-1 shadow-none "
                    }`}
                  >
                    {currentMode === "dark" ? (
                      <FaBan style={{ color: "white" }} />
                    ) : (
                      <FaBan style={{ color: "black" }} />
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      handleDelete(
                        cellValues?.id,
                        cellValues.row.status,
                        cellValues?.row?.userName
                      )
                    }
                    className={`editUserBtn ${
                      currentMode === "dark"
                        ? "text-white bg-transparent rounded-md p-1 shadow-none "
                        : "text-black bg-transparent rounded-md p-1 shadow-none "
                    }`}
                  >
                    {currentMode === "dark" ? (
                      <FaUnlock style={{ color: "white" }} />
                    ) : (
                      <FaUnlock style={{ color: "black" }} />
                    )}
                  </Button>
                )}
              </>
            ) : null}
            <Button
              title="Edit User"
              className={`editUserBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
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
  return (
    <>
      {" "}
      <Box
        className={`${currentMode}-mode-datatable`}
        // width={"100%"}
        sx={DataGridStyles}
      >
        <DataGrid
          autoHeight
          disableSelectionOnClick
          rows={pageState.data}
          columns={columns}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[30, 50, 75, 100]}
          pagination
          // width="auto"
          getRowHeight={() => "auto"}
          paginationMode="server"
          page={pageState.page - 1}
          pageSize={pageState.pageSize}
          componentsProps={{
            toolbar: {
              printOptions: {
                disableToolbarButton: User?.role !== 1,
              },
              csvOptions: {
                disableToolbarButton: User?.role !== 1,
              },
              showQuickFilter: true,
            },
          }}
          onPageChange={(newPage) => {
            setpageState((old) => ({
              ...old,
              page: newPage + 1,
            }));
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
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
        />
      </Box>
    </>
  );
};

export default RolesComponent;
