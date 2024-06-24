import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Box, Switch } from "@mui/material";
import SwitchButtonComponent from "./SwitchButtonComponent";
import { DataGrid } from "@mui/x-data-grid";
import NotificationsGridComponent from "./NotificationsGridComponent";

const NotificationsComponent = () => {
  const { currentMode, DataGridStyles } = useStateContext();
  const columns = [
    {
      field: "id",
      headerName: "#",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      field: "notify_type",
      headerName: "Notification Type",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      field: "sms_notify",
      headerName: "SMS Notification",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
      renderCell: (cellValues) => {
        console.log("Trainer: ", cellValues);

        return (
          <div className="w-full flex items-center justify-center capitalize">
            <SwitchButtonComponent cellValues={cellValues} />
          </div>
        );
      },
    },
    {
      field: "email_notify",
      headerName: "Email Notification",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
      renderCell: (cellValues) => {
        console.log("Trainer: ", cellValues);

        return (
          <div className="w-full flex items-center justify-center capitalize">
            <SwitchButtonComponent />
          </div>
        );
      },
    },
    {
      field: "whatsapp_notify",
      headerName: "Whatsapp Notification",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
      renderCell: (cellValues) => {
        console.log("Trainer: ", cellValues);

        return (
          <div className="w-full flex items-center justify-center capitalize">
            <SwitchButtonComponent />
          </div>
        );
      },
    },
  ];

  const rows = [
    {
      id: 1,
      notify_type: "Lead Assignment Notification",
    },
    {
      id: 2,
      notify_type: "Feedback Notification",
    },
    {
      id: 3,
      notify_type: "Priority Notification",
    },
    {
      id: 4,
      notify_type: "Reminder Notification",
    },
    {
      id: 5,
      notify_type: "Meeting Notification",
    },
    {
      id: 6,
      notify_type: "Billings Notification",
    },
    {
      id: 7,
      notify_type: "Support Notification",
    },
  ];
  return (
    <>
      <div className="pl-5 mt-3  ">
        {/* <NotificationsGridComponent /> */}
        <Box
          className={`${currentMode}-mode-datatable`}
          // width={"100%"}
          sx={{ ...DataGridStyles, marginBottom: "5%" }}
        >
          <DataGrid
            autoHeight
            disableSelectionOnClick
            rows={rows}
            columns={columns}
            // rowCount={pageState.total}
            // loading={pageState.isLoading}
            rowsPerPageOptions={[]}
            pagination={false}
            // width="auto"
            getRowHeight={() => "auto"}
            // paginationMode="server"
            // page={pageState.page - 1}
            // pageSize={pageState.pageSize}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            hideFooterPagination
            hideFooter
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: `${
                  currentMode === "dark"
                    ? "#474747 !important"
                    : "#eaeaea !important"
                }`,
                color: `${currentMode !== "dark" && "#000000"}`,
              },

              border: "0 !important",
              "& .MuiDataGrid-cell": {
                borderBottom: "0 !important",
              },

              "& .MuiDataGrid-cell ": {
                backgroundColor: `${currentMode == "dark" && "#000000"}`,
              },
              // boxShadow: 2,
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
      </div>
    </>
  );
};

export default NotificationsComponent;
