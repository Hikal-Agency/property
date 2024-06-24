import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  GridActionsCellItem,
  useGridSelector,
} from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Dialog,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { IoIosAlert } from "react-icons/io";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import NotificationModal from "./NotificationModal";
import {
  MdDeleteOutline,
  MdOpenInFull,
  MdOutlineModeEdit,
} from "react-icons/md";

import useApi from "../../utils/useApi";
import { minWidth } from "@mui/system";
const NotificationsManagementComponent = () => {
  const [isNotificationModal, setIsNotificationModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [notificationId, setNotificationId] = useState("");
  const [isViewModal, setIsViewModal] = useState(false);
  const [isCreateNotification, setIsCreateNotification] = useState(false);
  const [searchText, setSearchText] = useState("");
  const {
    currentMode,
    setpageState,
    reloadDataGrid,
    setreloadDataGrid,
    DataGridStyles,
    setopenBackDrop,
    User,
    fetchSidebarData,
    BACKEND_URL,
    isArabic,
    darkModeColors,
    primaryColor,
    t,
    isLangRTL,
    i18n,
    blurDarkColor,
    blurLightColor,
  } = useStateContext();
  const [data, error, loading, fetchData] = useApi(
    "http://localhost:8000/api/getUserNotifications/",
    "POST",
    { user_id: "6669991a8f57044526545c69" }
  );
  const [deleteData, deleteError, deleteLoading, deleteFetch] = useApi(
    "http://localhost:8000/api/deleteUserNotification/",
    "POST",
    { id: notificationId }
  );
  useEffect(() => {
    fetchData();
  }, [deleteData]);
  const handleViewClick = (id) => {
    // Implement your view logic here
    setIsNotificationModal(true);
    setIsViewModal(true);
    setNotificationId(id);
  };

  const handleEditClick = (id) => {
    console.log("Edit clicked for id:", id);
    // Implement your edit logic here
    setIsNotificationModal(true);
    setNotificationId(id);
  };

  const handleDeleteClick = (id) => {
    console.log("Delete clicked for id:", id);
    // Implement your delete logic here
    setIsDeleteModal(true);
    setNotificationId(id);
  };
  const columns = [
    {
      field: "title",
      headerName: "Title",
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Description",
      // width: 150,
      minWidth: 210,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "frequency",
      headerName: "Frequency",
      // width: 150,
      minWidth: 130,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "specific_days",
      headerName: "Specific Days",
      // width: 150,
      minWidth: 130,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <GridActionsCellItem
            icon={<MdOpenInFull size={16} />}
            label="View"
            onClick={() => handleViewClick(params.id)}
            className={`${
              currentMode === "dark"
                ? "text-[#FFFFFF] bg-[#262626]"
                : "text-[#1C1C1C] bg-[#EEEEEE]"
            } hover:!bg-blue-500 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center `}
          />
          <GridActionsCellItem
            icon={<MdOutlineModeEdit size={16} />}
            label="Edit"
            onClick={() => handleEditClick(params.id)}
            className={`${
              currentMode === "dark"
                ? "text-[#FFFFFF] bg-[#262626]"
                : "text-[#1C1C1C] bg-[#EEEEEE]"
            } hover:!bg-green-500 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center `}
          />
          <GridActionsCellItem
            icon={<MdDeleteOutline size={16} />}
            label="Delete"
            onClick={() => handleDeleteClick(params.id)}
            className={`${
              currentMode === "dark"
                ? "text-[#FFFFFF] bg-[#262626]"
                : "text-[#1C1C1C] bg-[#EEEEEE]"
            } hover:!bg-red-500 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center `}
          />
        </>
      ),
    },
  ];
  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };
  console.log(data, "data");
  return (
    <>
      <div className="mt-3">
        <Box
          className={`closed-datatable ${currentMode}-mode-datatable`}
          sx={{
            ...DataGridStyles,
            position: "relative",
            marginBottom: "50px",
            width: "100%",
          }}
        >
          <div className="flex justify-end items-center mb-3">
            <Button
              className={`min-w-fit text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
              ripple={true}
              style={{
                background: `${primaryColor}`,
              }}
              size="lg"
              type="submit"
              onClick={() => {
                setIsNotificationModal(true);
                setIsCreateNotification(true);
              }}
              //   disabled={loading ? true : false}
            >
              {<span>{t("create notifcation")}</span>}
            </Button>
          </div>
          <DataGrid
            loading={loading}
            // disableDensitySelector
            // initialState={{
            //   columns: {
            //     columnVisibilityModel: {
            //       creationDate: false,
            //     },
            //   },
            // }}
            autoHeight
            disableSelectionOnClick
            rows={data || []}
            pagination
            width="auto"
            paginationMode="server"
            columns={columns}
            getRowId={(row) => row._id}
            components={{
              Toolbar: GridToolbar,
            }}
            componentsProps={{
              toolbar: {
                printOptions: { disableToolbarButton: User?.role !== 1 },
                csvOptions: { disableToolbarButton: User?.role !== 1 },
                showQuickFilter: true,
                value: searchText,
                onChange: HandleQuicSearch,
              },
            }}
          />
        </Box>
      </div>
      {isNotificationModal && (
        <NotificationModal
          isNotificationModal={isNotificationModal}
          setIsNotificationModal={setIsNotificationModal}
          notificationId={notificationId}
          setIsViewState={setIsViewModal}
          isViewState={isViewModal}
          setIsNewState={setIsCreateNotification}
          isNewState={isCreateNotification}
          fetchAllNotifications={fetchData}
        />
      )}
      {isDeleteModal && (
        <Dialog
          sx={{
            "& .MuiPaper-root": {
              boxShadow: "none !important",
            },
            "& .MuiBackdrop-root, & .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop":
              {
                backgroundColor: "rgba(0, 0, 0, 0.6) !important",
              },
          }}
          open={isDeleteModal}
          onClose={() => setIsDeleteModal(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className="px-10 py-5">
            <div className="flex flex-col justify-center items-center">
              <IoIosAlert size={50} className="text-main-red-color text-2xl" />
              <h1 className="font-semibold pt-3 text-lg">
                Do You Really Want to delete this Notification?
              </h1>
            </div>

            <div className="action buttons mt-5 flex items-center justify-center space-x-2">
              <Button
                className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                ripple={true}
                style={{ color: "white" }}
                size="lg"
                onClick={() => {
                  setIsDeleteModal(false);
                  deleteFetch();
                }}
              >
                {/* {deletebtnloading ? (
                            <CircularProgress
                              size={18}
                              sx={{ color: "white" }}
                            />
                          ) : ( */}
                <span>Delete</span>
              </Button>

              <Button
                onClick={() => setIsDeleteModal(false)}
                ripple={true}
                variant="outlined"
                className={`shadow-none  rounded-md text-sm px-3  ${
                  currentMode === "dark"
                    ? "text-white border-white"
                    : "text-primary border-primary"
                }`}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default NotificationsManagementComponent;
