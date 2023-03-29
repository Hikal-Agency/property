import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SendMessageModal from "./SendMessageModal";
import Pagination from "@mui/material/Pagination";
import { Button, Checkbox, Alert, Box } from "@mui/material";
import { FaWhatsapp } from "react-icons/fa";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { AiFillMessage } from "react-icons/ai";
import { CgRemoveR } from "react-icons/cg";
import { useStateContext } from "../../context/ContextProvider";

export default function LeadsTable({ rows }) {
  const [selected, setSelected] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  
// --------START------------
  const { 
    currentMode, 
    pageState,
    setpageState,
    reloadDataGrid,
    setreloadDataGrid,
    DataGridStyles, 
    User,
    BACKEND_URL,
  } = useStateContext();
// --------END------------

// --------START------------
  const [searchText, setSearchText] = useState("");
  // --------END------------

// --------START------------
  const leadsList = [
    {
      field: "id",
      headerName: "#",
      minWidth: 10,
      flex: 1,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div
            className={`${
              currentMode === "dark" ? "bg-gray-800" : "bg-gray-200"
            } w-full h-full flex justify-center items-center px-5 font-semibold`}
          >
            {cellValues.formattedValue}
          </div>
        );
      },
    },
    {
      field: "leadName",
      headerName: "Lead Name",
      minWidth: 130,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "leadContact",
      headerName: "Contact Number",
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "leadEmail",
      headerName: "Email Address",
      minWidth: 130,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "project",
      headerName: "Project",
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "feedback",
      headerName: "Feedback",
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "",
      headerName: "Action",
      minWidth: 200,
      flex: 1,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div className="deleteLeadBtn editLeadBtn space-x-2 w-full flex items-center justify-center ">
            <Button variant="contained" color="success">
              {/* <AiTwotoneEdit size={20} /> */}
              <FaWhatsapp size={20} color="white" style={{ paddingRight: "5px" }} />
              WhatsApp
            </Button>
          </div>
        );
      },
    },
  ];
  // --------END------------

  // --------START------------
  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = async (e) => {
    console.log(e.target.value);
    // if (e.target.value === "") {
    //   FetchLeads(token);
    // } else {
      setpageState((old) => ({
        ...old,
        isLoading: true,
      }));
      console.log("the search lead  url is ");
      console.log(
        `${BACKEND_URL}/search?title=${e.target.value}&page=${pageState.page}`
      );
      await axios
        .get(`${BACKEND_URL}/search?title=${e.target.value}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((result) => {
          console.log("search result is");
          console.log(result.data);
          let rowsdata = result.data.result.data.map((row, index) => ({
            id:
              pageState.page > 1
                ? pageState.page * pageState.pageSize -
                  (pageState.pageSize - 1) +
                  index
                : index + 1,
            creationDate: row?.creationDate,
            leadName: row?.leadName,
            leadContact: row?.leadContact,
            project: row?.project,
            enquiryType: row?.enquiryType,
            leadType: row?.leadType,
            assignedToManager: row.assignedToManager,
            assignedToSales: row.assignedToSales,
            feedback: row?.feedback,
            priority: row.priority,
            language: row.language,
            leadSource: row?.leadSource,
            lid: row?.id,
            lastEdited: row?.lastEdited,
            leadFor: row?.leadFor,
            leadStatus: row?.leadStatus,
            leadCategory: leadCategory,
            notes: row?.notes,
            otp: row?.otp,
            edit: "edit",
          }));
          setpageState((old) => ({
            ...old,
            isLoading: false,
            data: rowsdata,
            pageSize: result.data.result.per_page,
            total: result.data.result.total,
          }));
        })
        .catch((err) => console.log(err));
    // }
  };
  // --------END------------

  // --------START------------
  // Custom Pagination
  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    return (
      <>
        <Pagination
          sx={{
            "& .Mui-selected": {
              backgroundColor: "white !important",
              color: "black !important",
              borderRadius: "5px !important",
            },
          }}
          count={pageCount}
          page={page + 1}
          onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
      </>
    );
  }
  // --------END------------

  const isChecked = (lid) => {
    return Object.keys(selected).indexOf(String(lid)) !== -1;
  };

  const handleClickCheckbox = (obj) => {
    if (selectAll) {
      setSelectAll(false);
    }
    if (Object.keys(selected).indexOf(Object.keys(obj)[0]) !== -1) {
      const selectedCopy = { ...selected };
      delete selectedCopy[Object.keys(obj)[0]];
      setSelected(selectedCopy);
    } else {
      setSelected({ ...selected, ...obj });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected({});
    } else {
      const selectedObj = {};
      rows.forEach((row) => {
        selectedObj[row.lid] = row.leadContact;
      });
      setSelected(selectedObj);
    }
    setSelectAll(!selectAll);
  };

  const handleOpenMessageModal = () => setMessageModal(true);

  return (
    <>
    {/* --------START------------ */}
      <Box width={"100%"} sx={{ ...DataGridStyles, position: "relative" }}>
        <DataGrid
          autoHeight
          disableSelectionOnClick
          rows={rows}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[30, 50, 75, 100]}
          pagination
          width="auto"
          paginationMode="server"
          page={pageState.page - 1}
          checkboxSelection
          pageSize={pageState.pageSize}
          onPageChange={(newPage) => {
            setpageState((old) => ({ ...old, page: newPage + 1 }));
          }}
          onPageSizeChange={(newPageSize) =>
            setpageState((old) => ({ ...old, pageSize: newPageSize }))
          }
          columns={ leadsList }
          // columns={columns}
          components={{
            Toolbar: GridToolbar,
            Pagination: CustomPagination,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              value: searchText,
              // onChange: HandleQuicSearch,
            },
            // columnsPanel: {
            //   disableHideAllButton: true,
            // }
          }}
          sx={{
            boxShadow: 2,
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          // style={{justifyContent: "center", alignItems: "center"}}
        />
      </Box>
      {/* --------END------------ */}




      <TableContainer component={Paper}>
        {Object.keys(selected).length > 0 && (
          <Alert sx={{ mb: 2, position: "relative", padding: "20px" }}>
            <p>{Object.keys(selected).length} items selected</p>
            <Button
              onClick={handleOpenMessageModal}
              sx={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              variant="contained"
              color="info"
            >
              <AiFillMessage
                color="white"
                style={{ paddingRight: "5px" }}
                size={20}
              />
              Send SMS
            </Button>
          </Alert>
        )}
        <Table sx={{ width: "100%", overflow: "scroll" }}>
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  color: "white",
                  backgroundColor: "black",
                },
              }}
            >
              <TableCell>
                {Object.keys(selected).length > 0 && selectAll ? (
                  <CgRemoveR
                    style={{ marginLeft: "8px", cursor: "pointer" }}
                    size={23}
                    color="white"
                    onClick={handleSelectAll}
                  />
                ) : (
                  <Checkbox
                    sx={{ color: "white" }}
                    onClick={handleSelectAll}
                    checked={selectAll}
                  />
                )}
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Lead Name</TableCell>
              <TableCell>Lead Email</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => (
              <TableRow
                key={row.lid}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Checkbox
                    onClick={() =>
                      handleClickCheckbox({ [row.lid]: row.leadContact })
                    }
                    checked={isChecked(row.lid)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.lid}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.leadName}
                </TableCell>
                <TableCell>{row.leadEmail}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success">
                    <AiFillMessage
                      color="white"
                      style={{ paddingRight: "5px" }}
                      size={20}
                    />
                    Whatsapp
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {messageModal && (
        <SendMessageModal
          sendMessageModal={messageModal}
          setSendMessageModal={setMessageModal}
        />
      )}
    </>
  );
}
