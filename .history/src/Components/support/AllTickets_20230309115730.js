
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

const AllTickets = () => {
  const { currentMode } = useStateContext();

  const columns = [
    { 
      field: 'id', 
      headerName: 'Ticket ID', 
      headerAlign: 'center',
      minWidth: 50,
      flex: 1 
    },
    {
      field: 'userName',
      headerName: 'User Name',
      headerAlign: 'center',
      editable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'category',
      headerName: 'Category',
      headerAlign: 'center',
      editable: false,
      minWidth: 110,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      headerAlign: 'center',
      editable: false,
      minWidth: 400,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      editable: false,
      minWidth: 110,
      flex: 1,
    },
  ];
  
  const rows = [
    { id: 1, userName: 'Hala Hikal', category: 'Closed Deals', description: "dhfjsfhs hasbdhakjbasda ashdbmajsdhaksjddakjdba jdbbajhakj jchjhbsadjh sjbsdjkbsdjhsddhsdd jcsdkhsksdf", status: "Pending" },
    { id: 2, userName: 'Ameer Ali', category: 'Meetings', description: "dhfjsfhs hasbdhakjbasda ashdbmajsdhaksjddakjdba jdbbajhakj jchjhbsadjh sjbsdjkbsdjhsddhsdd jcsdkhsksdf", status: "Closed" },
    { id: 3, userName: 'Hala Hikal', category: 'Closed Deals', description: "dhfjsfhs hasbdhakjbasda ashdbmajsdhaksjddakjdba jdbbajhakj jchjhbsadjh sjbsdjkbsdjhsddhsdd jcsdkhsksdf", status: "Postponed" },
    { id: 4, userName: 'Hala Hikal', category: 'Closed Deals', description: "dhfjsfhs hasbdhakjbasda ashdbmajsdhaksjddakjdba jdbbajhakj jchjhbsadjh sjbsdjkbsdjhsddhsdd jcsdkhsksdf", status: "pending" },
  ];

  return (
    <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} rounded-md`}>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default AllTickets;
