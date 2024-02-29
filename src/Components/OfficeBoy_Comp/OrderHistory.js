import { Backdrop, Box, Button, IconButton, Modal } from "@mui/material";
import Select from "react-select";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import Error404 from "../../Pages/Error";
import { DataGrid } from "@mui/x-data-grid";
import { order_status } from "../_elements/SelectOptions";
import { renderStyles } from "../_elements/SelectStyles";
import { FaPencilAlt } from "react-icons/fa";

import { BiTrash } from "react-icons/bi";
import AddItem from "./AddItem";
import moment from "moment";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const OrderHistory = ({
  row,
  setRow,
  loading,
  setPage,
  pageSize,
  setPageSize,
  changeStatus,
}) => {
  const [leadNotFound, setLeadNotFound] = useState(false);

  const {
    t,
    currentMode,
    isLangRTL,
    i18n,
    User,
    DataGridStyles,
    primaryColor,
  } = useStateContext();
  const [isClosing, setIsClosing] = useState(false);

  const columns = [
    {
      field: "created_at",
      headerName: "date",
      width: 120,
      headerAlign: "center",
      renderCell: (cellValues) =>
        moment(cellValues?.row?.created_at).format("HH:MM YYYY-MM-DD"),
    },
    {
      field: "itemName",
      headerName: "Item Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      headerAlign: "center",
      width: 70,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 150,
      headerAlign: "center",
      width: 70,
    },
    {
      field: "notes",
      headerName: "Note",
      type: "number",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "userName",
      headerName: "User",
      type: "number",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      type: "number",
      width: 150,
      headerAlign: "center",
      renderCell: (cellValues) => {
        const status = cellValues?.row?.orderStatus?.toLowerCase();
        let disableUpdate = false;

        if (["delivered", "cancelled", "out of stock"].includes(status)) {
          disableUpdate = true;
        }
        return (
          <Select
            id="status"
            value={order_status(t)?.find(
              (option) => option?.value?.toLowerCase() === status
            )}
            onChange={(e) => changeStatus(e, cellValues?.row)}
            options={order_status(t)}
            placeholder={t("select_status")}
            className={`w-full`}
            menuPortalTarget={document.body}
            styles={renderStyles(currentMode, primaryColor)}
            isDisabled={disableUpdate}
            isSearchable={false}
          />
        );
      },
    },
  ];

  return (
    <>
      <div>
        <div className="">
          <Box
            className={`${currentMode}-mode-datatable`}
            // width={"100%"}
            sx={{ ...DataGridStyles, marginBottom: "5%" }}
          >
            <DataGrid
              disableDensitySelector
              autoHeight
              disableSelectionOnClick
              rows={row}
              columns={columns}
              //   rowCount={pageState.total}
              loading={loading}
              //   rowsPerPageOptions={[30, 50, 75, 100]}
              pagination
              // width="auto"
              //   getRowHeight={() => "auto"}
              rowHeight={25}
              paginationMode="server"
              //   page={pageState.page - 1}
              pageSize={pageSize}
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
                setPage(newPage + 1);
              }}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
