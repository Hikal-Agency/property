import { Button } from "@material-tailwind/react";

import { Box, Tab, Tabs } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useStateContext } from "../../context/ContextProvider";

import {
  AiOutlineEdit,
  AiOutlinePlus
} from "react-icons/ai";
import { useEffect, useState } from "react";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { FaBan } from "react-icons/fa";
import RolesComponent from "../../Components/Roles-Permissions/RolesComponent";
import DeleteComponent from "../../Components/Roles-Permissions/DeleteComponent";
import UpdateComponent from "../../Components/Roles-Permissions/UpdateComponent";

const Role = () => {
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
  const [value, setValue] = useState(0);
  const [model, setModel] = useState(false);
  const [userID, setDataId] = useState();
  const [DataName, setDataName] = useState();
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);

  console.log("User: ", user);
  const handleChange = (event, newValue) => {
    setValue(value === 0 ? 1 : 0);
  };

  const HandleOpenModel = () => {
    console.log("Model Open:");
    setModel(true);
  };

  const HandleModelClose = () => {
    console.log("Model Close:");

    setModel(false);
  };

  const handleUpdate = (id, name) => {
    console.log("Delete id: ", id);
    setDataId(id);
    setDataName(name);

    setOpenUpdateModel(true);
  };
  const handleDelete = (id, name) => {
    console.log("Delete id: ", id);
    setDataId(id);
    setDataName(name);

    setOpenDeleteModel(true);
  };
  const handleDeleteModelClose = () => {
    setOpenDeleteModel(false);
  };

  const handleCloseUpdateModel = () => {
    setOpenUpdateModel(false);
  };

  const fetchData = async (token) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));
    try {
      // const token = localStorage.getItem("auth-token");
      const response = await axios.get(
        `${BACKEND_URL}/${value === 0 ? "roles" : "permissions"}?page=${
          pageState.page
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("Data: ", response?.data?.role);

      let rowsDataArray = "";
      let rowsdata;
      if (value === 0) {
        if (response?.data?.role?.current_page > 1) {
          const theme_values = Object.values(response?.data?.role?.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = response?.data?.role?.data;
        }

        // rowsDataArray = rowsDataArray?.filter(
        //   (role) => role?.role !== "Administrator"
        // );

        rowsdata = rowsDataArray?.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          role_id: row?.id,
          role: row?.role || "No Role",
          status: row?.status || "No Status",
          updated_at: row?.updated_at || "No Time",
          user_id: row?.user_id || "No User Id",
          edit: "edit",
        }));
      } else {
        if (response?.data?.permission?.current_page > 1) {
          const theme_values = Object.values(response?.data?.permission?.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = response?.data?.permission?.data;
        }

        rowsdata = rowsDataArray?.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          permission_id: row?.id,
          permission: row?.permission || "No Permission",
          status: row?.status || "No Status",
          updated_at: row?.updated_at || "No Time",
          user_id: row?.user_id || "No User Id",
          edit: "edit",
        }));
      }

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
      toast.error("Unable to fetch data.", {
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
    fetchData(token);
  }, [pageState.page, value]);

  const columns = [
    {
      field: "role",
      headerName: "Role",
      headerAlign: "center",
      editable: false,
      minwidth: 130,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      editable: false,
      minwidth: 150,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center ">
            <p className="text-center capitalize">
              {cellValues?.formattedValue === 1 ? "Active" : "Deactive"}
            </p>
          </div>
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
        console.log("action data: ", cellValues);
        return (
          <div className=" space-x-2 w-full flex items-center justify-center ">
            <Button
              onClick={() =>
                handleDelete(cellValues?.row?.role_id, cellValues?.row?.role)
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
            <Button
              title="Edit Role"
              className={`editUserBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
              onClick={() =>
                handleUpdate(cellValues?.row?.role_id, cellValues?.row?.role)
              }
            >
              <AiOutlineEdit size={20} />
            </Button>
          </div>
        );
      },
    },
  ];

  const permissionsColumns = [
    {
      field: "permission",
      headerName: "Permission",
      headerAlign: "center",
      editable: false,
      minwidth: 130,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      editable: false,
      minwidth: 150,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center ">
            <p className="text-center capitalize">
              {cellValues?.formattedValue === 1 ? "Active" : "Deactive"}
            </p>
          </div>
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
            <Button
              onClick={() =>
                handleDelete(
                  cellValues?.row?.permission_id,
                  cellValues?.row?.permission
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
            <Button
              title="Edit Permission"
              className={`editUserBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
              onClick={() =>
                handleUpdate(
                  cellValues?.row?.permission_id,
                  value === 0
                    ? cellValues?.row?.role
                    : cellValues?.row?.permission
                )
              }
            >
              <AiOutlineEdit size={20} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className={`w-full `}>
            <div className="pl-3">
              <div className="my-5 mb-10">
                <div className="mt-3 flex justify-between items-center">
                  <h1
                    className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-primary font-bold border-primary"
                    }`}
                  >
                    ● Roles & Permissions{" "}
                    {/* <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                      <span>{pageState?.total}</span>
                    </span> */}
                  </h1>
                </div>
                <div className="flex items-center justify-between">
                  <Box
                    sx={{
                      ...darkModeColors,
                      "& .MuiTabs-indicator": {
                        height: "100%",
                        borderRadius: "5px",
                      },
                      "& .Mui-selected": {
                        color: "white !important",
                        zIndex: "1",
                      },
                    }}
                    className={`w-full rounded-md overflow-hidden ${
                      currentMode === "dark" ? "bg-black" : "bg-white"
                    } `}
                  >
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      variant="standard"
                      className="w-full px-1 m-1"
                    >
                      <Tab label="Roles" />
                      <Tab label="Permissions" />
                    </Tabs>
                  </Box>
                  <div className="w-max">
                    <Button
                      className="bg-btn-primary text-white px-4 py-2 rounded-md mr-2 "
                      onClick={HandleOpenModel}
                    >
                      <span className="flex justify-between items-center ">
                        <AiOutlinePlus style={{ marginRight: "0.5em" }} />
                        {value === 0 ? "Add Role" : "Add Permissions"}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="mt-3 pb-3">
                  <TabPanel value={value} index={0}>
                    <Box
                      className={`${currentMode}-mode-datatable`}
                      // width={"100%"}
                      sx={DataGridStyles}
                    >
                      <DataGrid
                        autoHeight
                        disableDensitySelector
                        disableSelectionOnClick
                        rowHeight={45}
                        rows={pageState.data}
                        columns={columns}
                        rowCount={pageState.total}
                        loading={pageState.isLoading}
                        rowsPerPageOptions={[]}
                        pagination
                        // width="auto"
                        // getRowHeight={() => "auto"}
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
                          params.indexRelativeToCurrentPage % 2 === 0
                            ? "even"
                            : "odd"
                        }
                      />
                    </Box>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Box
                      className={`${currentMode}-mode-datatable`}
                      // width={"100%"}
                      sx={DataGridStyles}
                    >
                      <DataGrid
                        disableDensitySelector
                        autoHeight
                        disableSelectionOnClick
                        rows={pageState.data}
                        columns={permissionsColumns}
                        rowCount={pageState.total}
                        loading={pageState.isLoading}
                        rowsPerPageOptions={[30, 50, 75, 100]}
                        pagination
                        // width="auto"
                        // getRowHeight={() => "auto"}
                        rowHeight={45}
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
                          params.indexRelativeToCurrentPage % 2 === 0
                            ? "even"
                            : "odd"
                        }
                      />
                    </Box>
                  </TabPanel>
                </div>
                {openDeleteModel && (
                  <DeleteComponent
                    UserModelOpen={handleDelete}
                    handleUserModelClose={handleDeleteModelClose}
                    UserData={userID}
                    fetchData={fetchData}
                    value={value}
                    DataName={DataName}
                  />
                )}

                {openUpdateModel && (
                  <UpdateComponent
                    handleOpenModel={HandleOpenModel}
                    addUserModelClose={handleCloseUpdateModel}
                    UserData={userID}
                    fetchData={fetchData}
                    value={value}
                    DataName={DataName}
                  />
                )}
                {model && (
                  <RolesComponent
                    handleOpenModel={HandleOpenModel}
                    addUserModelClose={HandleModelClose}
                    value={value}
                    fetchData={fetchData}
                  />
                )}
              </div>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Role;
