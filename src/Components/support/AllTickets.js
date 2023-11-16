import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { DataGrid } from "@mui/x-data-grid";

import axios from "../../axoisConfig";
import { useNavigate } from "react-router-dom";
import UpdateTicketSelect from "./UpdateTicketSelect";

const AllTickets = ({ value, setValue }) => {
  const { currentMode, DataGridStyles, BACKEND_URL, User, t } =
    useStateContext();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ROW CLICK FUNCTION
  const handleRowClick = async (params, event) => {
    console.log("ID: ", params?.id);
    const ticketId = params?.id;
    navigate(`/support/singleTicket/${ticketId}`);
  };

  const columns = [
    {
      field: "creationDate",
      headerName: t("ticket_date"),
      headerAlign: "center",
      editable: false,
      minWidth: 60,
      flex: 1,
    },
    {
      field: "userName",
      headerName: t("label_user_name"),
      headerAlign: "center",
      editable: false,
      minWidth: 120,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full ">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    {
      field: "category",
      headerName: t("label_category"),
      headerAlign: "center",
      editable: false,
      minWidth: 40,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    {
      field: "description",
      headerName: t("description"),
      headerAlign: "center",
      editable: false,
      minWidth: 150,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    {
      field: "issue",
      headerName: t("label_issue"),
      headerAlign: "center",
      editable: false,
      minWidth: 130,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full ">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
      hide: !(User?.role === 1),
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   headerAlign: "center",
    //   editable: false,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (cellValues) => {
    //     return (
    //       <>
    //         {cellValues.formattedValue === "closed" && (
    //           <div className="w-full h-full flex justify-center items-center text-red-400 px-5 text-xs font-semibold">
    //             CLOSED
    //           </div>
    //         )}

    //         {cellValues.formattedValue === "open" && (
    //           <div className="w-full h-full flex justify-center items-center text-green-400 px-5 text-xs font-semibold">
    //             OPEN
    //           </div>
    //         )}

    //         {cellValues.formattedValue === "pending" && (
    //           <div className="w-full h-full flex justify-center items-center text-blue-400 px-5 text-xs font-semibold">
    //             PENDING
    //           </div>
    //         )}

    //         {cellValues.formattedValue === "in process" && (
    //           <div className="w-full h-full flex justify-center items-center text-slate-400 px-5 text-xs font-semibold">
    //             IN PROCESS
    //           </div>
    //         )}

    //         {cellValues.formattedValue === "resolved" && (
    //           <div className="w-full h-full flex justify-center items-center text-purple-400 px-5 text-xs font-semibold">
    //             RESOLVED
    //           </div>
    //         )}
    //       </>
    //     );
    //   },
    // },
    {
      field: "edit",
      headerName: "Update Status",
      // width: 150,
      minWidth: 170,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => (
        <UpdateTicketSelect cellValues={cellValues} />
      ),
    },
  ];

  const fetchTickets = async () => {
    setLoading(true);
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
        row.creationDate = row.created_at || "-";
        row.userName = row.added_by_name || "-";
      });
      setRows(rowsList);
      setLoading(false);
      console.log("Rowslist: ", rowsList);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div
      className={`${
        currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"
      } rounded-md`}
    >
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

      <Box
        width={"100%"}
        className={`${currentMode}-mode-datatable`}
        sx={DataGridStyles}
      >
        <DataGrid
          disableDensitySelector
          autoHeight
          onRowClick={handleRowClick}
          disableSelectionOnClick
          rowsPerPageOptions={[30, 50, 75, 100]}
          pagination
          loading={loading}
          width="auto"
          paginationMode="server"
          rows={rows}
          columns={columns}
          componentsProps={{
            toolbar: {
              showQuickFilter: false,
              printOptions: { disableToolbarButton: User?.role !== 1 },
              csvOptions: { disableToolbarButton: User?.role !== 1 },
              // value: searchText,
              // onChange: HandleQuicSearch,
            },
          }}
          // checkboxSelection
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
  );
};

export default AllTickets;
