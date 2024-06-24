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
import { PiFolderPlusThin } from "react-icons/pi";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useStateContext } from "../../context/ContextProvider";

import {
  MdDeleteOutline,
  MdOpenInFull,
  MdOutlineModeEdit,
} from "react-icons/md";

import useApi from "../../utils/useApi";
import { minWidth } from "@mui/system";
const FormsList = () => {
  const [searchText, setSearchText] = useState("");
  const {
    currentMode,
    themeBgImg,
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

  const columns = [
    {
      field: "title",
      headerName: "Name",
      minWidth: 110,
      flex: 1,
      headerAlign: "left",
    },
    {
      field: "last_updated",
      headerName: "Last Upadted",
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "updated_by",
      headerName: "Updated By",
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "updated_by",
      headerName: "Updated By",
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
  ];
  const data = [
    {
      _id: 1,
      title: "Form 1",
      description: "Description of form in form builder",
      status: "Active",
    },
    {
      _id: 2,
      title: "Form 2",
      description: "Description of form in form builder",
      status: "Active",
    },
    {
      _id: 3,
      title: "Form 3",
      description: "Description of form in form builder",
      status: "Active",
    },
    {
      _id: 4,
      title: "Form 4",
      description: "Description of form in form builder",
      status: "Active",
    },
  ];
  return (
    <>
      <div className="flex min-h-screen">
        <div
          className={`w-full py-10 px-[5rem] ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="w-full flex items-center justify-between pb-3">
            <div className="flex items-center">
              <div className="bg-primary h-10 w-1 rounded-full"></div>
              <h1
                className={`text-lg font-semibold mx-2 uppercase ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("Forms")}
                <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto mx-2">
                  {data?.length}
                </span>
              </h1>
            </div>
            <div className="flex justify-end items-center gap-3 ">
              <Button
                className={`min-w-fit ${
                  currentMode == "dark" ? "text-white" : "text-black"
                } rounded-md py-3 flex items-center border gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
                ripple={true}
                style={{
                  // border: `1px solid ${
                  //   currentMode == "dark" ? "white" : "black"
                  // }`,
                  backgroundColor: `${
                    currentMode == "dark" ? "black" : "white"
                  }`,
                }}
                size="lg"
                type="submit"
                onClick={() => {
                  //   setIsNotificationModal(true);
                  //   setIsCreateNotification(true);
                }}
                //   disabled={loading ? true : false}
              >
                <PiFolderPlusThin size={16} />
                {<span>{t("Create Folder")}</span>}
              </Button>
              <Button
                className={`min-w-fit flex items-center gap-3 text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
                ripple={true}
                style={{
                  background: `${primaryColor}`,
                }}
                size="lg"
                type="submit"
                onClick={() => {
                  //   setIsNotificationModal(true);
                  //   setIsCreateNotification(true);
                }}
                //   disabled={loading ? true : false}
              >
                <GoPlus size={16} />
                {<span>{t("Add Form")}</span>}
              </Button>
            </div>
          </div>
          <div>
            <p className="ml-[1rem] text-lg text-gray-500">
              Enhance reach with unlimited forms, no coding, Gather essential{" "}
              into for targeted, personalized content.
            </p>
          </div>
          <div className="mt-6">
            <Box
              className={`closed-datatable ${currentMode}-mode-datatable`}
              sx={{
                ...DataGridStyles,
                position: "relative",
                marginBottom: "50px",
                width: "100%",
              }}
            >
              <DataGrid
                //   loading={loading}
                // disableDensitySelector
                // initialState={{
                //   columns: {
                //     columnVisibilityModel: {
                //       creationDate: false,
                //     },
                //   },
                // }}
                disableDensitySelector
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
                    //   onChange: HandleQuicSearch,
                  },
                }}
                sx={{
                  boxShadow: 2,
                  "& .MuiDataGrid-cell:hover": {
                    cursor: "pointer",
                  },
                  // "& .MuiDataGrid-main": {
                  //   overflowY: "inherit",
                  //   height: "auto",
                  // },
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
          </div>
        </div>
      </div>
    </>
  );
};

export default FormsList;
