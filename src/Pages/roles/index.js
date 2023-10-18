
import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { Box, Tab, Tabs, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useStateContext } from "../../context/ContextProvider";
import RolesComponent from "../../Components/Roles-Permissions/RolesComponent";
import DeleteComponent from "../../Components/Roles-Permissions/DeleteComponent";
import UpdateComponent from "../../Components/Roles-Permissions/UpdateComponent";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { FaBan } from "react-icons/fa";

import {
  BsTrash,
  BsPen,
  BsPlus
} from "react-icons/bs";


const Role = () => {
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    pageState,
    setpageState,
    User,
    darkModeColors,
    themeBgImg, t
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
      headerName: t("role"),
      headerAlign: "center",
      editable: false,
      minwidth: 130,
      flex: 1,
    },
    {
      field: "status",
      headerName: t("label_status"),
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
      headerName: t("label_action"),
      minwidth: 90,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        console.log("action data: ", cellValues);
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {/* EDIT ROLE  */}
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } editUserBtn hover:bg-blue-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Edit Role" arrow>
                <button onClick={() =>
                  handleUpdate(cellValues?.row?.role_id, cellValues?.row?.role)
                }>
                  <BsPen size={16} />
                </button>
              </Tooltip>
            </p>
            {/* DELETE ROLE  */}
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } editUserBtn hover:bg-red-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Delete Role" arrow>
                <button onClick={() =>
                  handleDelete(cellValues?.row?.role_id, cellValues?.row?.role)
                  }
                >
                  <BsTrash size={16} />
                </button>
              </Tooltip>
            </p>
          </div>
        );
      },
    },
  ];

  const permissionsColumns = [
    {
      field: "permission",
      headerName: t("permission"),
      headerAlign: "center",
      editable: false,
      minwidth: 130,
      flex: 1,
    },
    {
      field: "status",
      headerName: t("label_status"),
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
      headerName: t("label_action"),
      minwidth: 90,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {/* EDIT PERMISSION  */}
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } editUserBtn hover:bg-blue-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Edit Permission" arrow>
                <button onClick={() =>
                  handleUpdate(
                    cellValues?.row?.permission_id,
                    value === 0
                      ? cellValues?.row?.role
                      : cellValues?.row?.permission
                  )
                }>
                  <BsPen size={16} />
                </button>
              </Tooltip>
            </p>
            {/* DELETE PERMISSION  */}
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } editUserBtn hover:bg-red-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Delete Permission" arrow>
                <button onClick={() =>
                  handleDelete(
                    cellValues?.row?.permission_id,
                    cellValues?.row?.permission
                  )
                }>
                  <BsTrash size={16} />
                </button>
              </Tooltip>
            </p>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex min-h-screen">
        <div
          className={`w-full p-4 ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="w-full flex items-center justify-between pb-3">
            <div className="flex items-center">
              <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark"
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {t("title_roles_permissions")}
              </h1>
            </div>
            <button
              className="card-hover bg-primary text-white px-3 py-2 rounded-md"
              onClick={HandleOpenModel}
            >
              <span className="flex justify-between items-center gap-1 uppercase font-semibold text-sm">
                <BsPlus size={18} />
                {value === 0 ? t("create_new_role") : t("create_new_permission")}
              </span>
            </button>
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
              className={`w-full rounded-lg overflow-hidden ${
                !themeBgImg 
                ? (currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]") 
                : (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
              } `}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="standard"
                className="w-full m-1"
              >
                <Tab label={t("roles")}/>
                <Tab label={t("permissions")}/>
              </Tabs>
            </Box>
          </div>
          <div className="mt-3 pb-3">
            <TabPanel value={value} index={0}>
              <Box
                className={`${currentMode}-mode-datatable`}
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
    </>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Role;
