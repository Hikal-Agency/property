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

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const OrderHistory = ({ openInventory, setOpenInventory }) => {
  const [leadNotFound, setLeadNotFound] = useState(false);
  const [openAddItem, setOpenAddItem] = useState(false);

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

  const changeStatus = () => {};
  const rows = [
    {
      id: 1,
      date: "2023-20-12",
      itemName: "Product A",
      quantity: "2",
      amount: "20",
      User: "ubaid",
      status: "Active",
    },
    {
      id: 2,
      itemName: "Product B",
      itemPrice: 30.0,
      note: "Dolor sit amet",
      status: "Inactive",
    },
    {
      id: 3,
      itemName: "Product C",
      itemPrice: 25.0,
      note: "Consectetur adipiscing",
      status: "Active",
    },
    {
      id: 4,
      itemName: "Product D",
      itemPrice: 18.0,
      note: "Elit sed do eiusmod",
      status: "Inactive",
    },
    {
      id: 5,
      itemName: "Product E",
      itemPrice: 40.0,
      note: "Tempor incididunt ut labore",
      status: "Active",
    },
  ];

  const columns = [
    { field: "date", headerName: "date", width: 80, headerAlign: "center" },
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
      field: "note",
      headerName: "Note",
      type: "number",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "user",
      headerName: "User",
      type: "number",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Order Status",
      type: "number",
      width: 150,
      headerAlign: "center",
      renderCell: (cellValues) => (
        <Select
          id="status"
          // value={inventory_status(t)?.find(
          //   (option) => option?.value === inventoryStatus
          // )}
          onChange={changeStatus}
          options={order_status(t)}
          placeholder={t("select_status")}
          className={`w-full`}
          menuPortalTarget={document.body}
          styles={renderStyles(currentMode, primaryColor)}
        />
      ),
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
              rows={rows}
              // columns={columns}
              columns={columns}
              //   rowCount={pageState.total}
              //   loading={pageState.isLoading}
              //   rowsPerPageOptions={[30, 50, 75, 100]}
              pagination
              // width="auto"
              //   getRowHeight={() => "auto"}
              rowHeight={25}
              paginationMode="server"
              //   page={pageState.page - 1}
              //   pageSize={pageState.pageSize}
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
              //   onPageChange={(newPage) => {
              //     setpageState((old) => ({
              //       ...old,
              //       page: newPage + 1,
              //     }));
              //   }}
              //   onPageSizeChange={(newPageSize) =>
              //     setpageState((old) => ({
              //       ...old,
              //       pageSize: newPageSize,
              //     }))
              //   }
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
