import { useState, useEffect } from "react";
import {
  Box,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";

const AllTickets = () => {
  const { 
    currentMode, 
    DataGridStyles,
    BACKEND_URL
  } = useStateContext();
  const [rows, setRows] = useState([]);

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      headerAlign: 'center',
      minWidth: 50,
      flex: 1 
    },
    {
      field: 'creationDate',
      headerName: 'Ticket Date',
      headerAlign: 'center',
      editable: false,
      minWidth: 130,
      flex: 1,
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
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      headerAlign: 'center',
      editable: false,
      minWidth: 300,
      flex: 1,
    },
    {
      field: 'issue',
      headerName: 'Issue',
      headerAlign: 'center',
      editable: false,
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      editable: false,
      minWidth: 110,
      flex: 1,
      renderCell: (cellValues) => {
         return (
          <>
            {cellValues.formattedValue === "closed" && (
              <div className="w-full h-full flex justify-center items-center text-red-400 px-5 text-xs font-semibold">
                CLOSED
              </div>
            )}

            {cellValues.formattedValue === "open" && (
              <div className="w-full h-full flex justify-center items-center text-green-400 px-5 text-xs font-semibold">
                OPEN
              </div>
            )}

            {cellValues.formattedValue === "pending" && (
              <div className="w-full h-full flex justify-center items-center text-blue-400 px-5 text-xs font-semibold">
                PENDING
              </div>
            )}

            {cellValues.formattedValue === "in process" && (
              <div className="w-full h-full flex justify-center items-center text-slate-400 px-5 text-xs font-semibold">
                IN PROCESS
              </div>
            )}

            {cellValues.formattedValue === "resolved" && (
              <div className="w-full h-full flex justify-center items-center text-purple-400 px-5 text-xs font-semibold">
                RESOLVED
              </div>
            )}
          </>
        );
      },
    },
  ];

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/tickets`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const rowsList = response.data.tickets.data;
      rowsList.forEach((row) => {
        row.creationDate = row.created_ad;
        row.userName = row.added_by;
      })
      setRows(rowsList);
      console.log(rowsList)
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    fetchTickets();
  }, []); 

  return (
    <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} rounded-md`}>
      {/* <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          // checkboxSelection
          disableRowSelectionOnClick
        />
      </Box> */}

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

export default AllTickets;
