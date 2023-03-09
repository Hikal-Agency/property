
import React, { useEffect, useState } from "react";
import {
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { DataGrid } from '@mui/x-data-grid';

import { BiSupport, BiMailSend } from "react-icons/bi"; 
import { BsWhatsapp } from "react-icons/bs";
import { MdVideoCameraFront, MdOutlineWhatsapp } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";

const Transactions = () => {
  const { 
    currentMode, 
    DataGridStyles 
  } = useStateContext();

  const columns = [
    { 
      field: 'id', 
      headerName: 'Transaction ID', 
      headerAlign: 'center',
      minWidth: 50,
      flex: 1 
    },
    {
      field: 'creationDate',
      headerName: 'Transaction Date',
      headerAlign: 'center',
      editable: false,
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'method',
      headerName: 'Method',
      headerAlign: 'center',
      editable: false,
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerAlign: 'center',
      editable: false,
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      editable: false,
      minWidth: 120,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.formattedValue === "Paid" && (
              <div className="w-full h-full flex justify-center items-center text-[#0f9d58] px-5 text-xs font-semibold">
                PAID
              </div>
            )}

            {cellValues.formattedValue === "Pending" && (
              <div className="w-full h-full flex justify-center items-center text-[#ff0000] px-5 text-xs font-semibold">
                PENDING
              </div>
            )}
          </>
        );
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      headerAlign: 'center',
      editable: false,
      minWidth: 120,
      flex: 1,
    },
  ];
  
  const rows = [
    { id: 1, creationDate: "2022-03-03 03:03:03", method: 'Cash', amount: 'AED 2000', status: "Pending", type: "Monthly" },
    { id: 2, creationDate: "2022-03-03 03:03:03", method: 'Card', amount: 'AED 2000', status: "Paid", type: "Monthly" },
    { id: 3, creationDate: "2022-03-03 03:03:03", method: 'Cheque', amount: 'AED 2000', status: "Paid", type: "Monthly" },
    { id: 4, creationDate: "2022-03-03 03:03:03", method: 'Card', amount: 'AED 2000', status: "Paid", type: "Monthly" },
  ];

  return (
    <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} rounded-md`}>

      <Box width={"100%"} sx={DataGridStyles}>
        <DataGrid
          autoHeight
          disableSelectionOnClick
          rowsPerPageOptions={[30, 50, 75, 100]}
          pagination
          width="auto"
          paginationMode="server"
          rows={rows}
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
  );
};

export default Transactions;
