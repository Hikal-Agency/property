import { Box, Pagination } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

import axios from "../../axoisConfig";
import moment from "moment";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import RenderFeedback from "./RenderFeedback";
import { langs } from "../../langCodes";
import RenderPriority from "./RenderPriority";

const VerifiedColdLeads = ({ LEADS_URL, pageState, setpageState }) => {
  const { currentMode, User } = useStateContext();
  const DataGridStyles = {
    "& .MuiButtonBase-root": {
      color: "white",
    },
    // TOOLBAR COLORS
    "& .MuiDataGrid-toolbarContainer": {
      backgroundColor: currentMode === "dark" ? "#424242" : "#000000",
      // backgroundColor: "#3b3d44",
      paddingTop: "10px",
      paddingBottom: "10px",
      paddingLeft: "20px",
      paddingRight: "20px",
    },
    // TOOLBAR BUTTON
    "& .MuiInputBase-root": {
      color: "white",
    },
    "& .MuiInputBase-root::before": {
      color: "white",
      // borderColor: "white",
    },
    "& .MuiInputBase-root:hover::before": {
      color: "white",
      // borderColor: "white",
    },

    // Background color of header of data grid
    "& .MuiDataGrid-columnHeaders": {
      border: "none",
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: currentMode === "dark" ? "white" : "white",
    },
    "& .MuiIconButton-sizeSmall": {
      color: currentMode === "dark" ? "white" : "white",
    },
    // background color of main table content
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: currentMode === "dark" ? "#424242" : "#ffffff",
      color: currentMode === "dark" ? "white" : "black",
    },
    // changing rows hover color
    "& .css-1uhmucx-MuiDataGrid-root,& .MuiDataGrid-row:hover": {
      backgroundColor: currentMode === "dark" && "#000000",
      border: "none",
    },
    // changing row colors
    "& .even": {
      backgroundColor: currentMode === "dark" ? "#424242" : "#ffffff",
    },
    // changing rows right border
    // "& .MuiDataGrid-cell": {
    //   borderRight: "1px solid rgb(240, 240, 240)",
    // },
    // BACKGROUND COLOR OF FOOTER
    "& .MuiDataGrid-footerContainer": {
      border: "none",
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: "white",
    },
    "& .MuiTablePagination-selectLabel": {
      color: "white",
    },
    "& .MuiTablePagination-select ": { color: "white" },
    "& .MuiSvgIcon-fontSizeMedium ": { color: "white" },
    "& .MuiTablePagination-displayedRows": { color: "white" },
    // For inner data styling
    "& .MuiDataGrid-virtualScrollerRenderZone": {
      // backgroundColor: "red",
    },
  };

  const getLangCode = (language) => {
    if (language) {
      const l = langs.find(
        (lang) =>
          lang["name"].toLowerCase() === String(language).toLowerCase() ||
          lang["nativeName"].toLowerCase() === String(language).toLowerCase()
      );
      if (l) {
        return l.code.toUpperCase();
      } else {
        return "Invalid";
      }
    } else {
      return null;
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "#",
      minWidth: 40,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <small>
            <strong>{cellValues?.formattedValue}</strong>
          </small>
        );
      },
    },

    {
      field: "city",
      headerName: "City",
      width: 100,
      headerAlign: "center",
    },
    {
      field: "leadName",
      headerName: "Lead name",
      width: 170,
      headerAlign: "center",
    },
    {
      field: "leadContact",
      headerName: "Contact",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => {
        const contactNumber = params.getValue(params.id, "leadContact");
        // const countryCode = `(+${contactNumber.slice(0, 1)} ${contactNumber.slice(1, 3)})`;

        // Replace last 4 digits with "*"
        const stearics =
          contactNumber?.slice(0, contactNumber?.length - 4) + "****";
        let finalNumber;

        if (hasPermission("number_masking")) {
          if (User?.role === 1) {
            finalNumber = contactNumber;
          } else {
            finalNumber = `${stearics}`;
          }
        } else {
          finalNumber = contactNumber;
        }

        return <span>{finalNumber}</span>;
      },
    },
    {
      field: "project",
      headerName: "Project",
      width: 110,
      headerAlign: "center",
    },
    {
      field: "enquiryType",
      headerName: "Enquiry",
      width: 110,
      headerAlign: "center",
    },
    {
      field: "leadType",
      headerName: "Type",
      width: 100,
      headerAlign: "center",
    },
    {
      field: "feedback",
      headerName: "Feedback",
      width: 150,
      headerAlign: "center",
      hideable: false,
      renderCell: (cellValues) => <RenderFeedback cellValues={cellValues} />,
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 150,
      headerAlign: "center",
      hideable: false,
      renderCell: (cellValues) => <RenderPriority cellValues={cellValues} />,
    },
  ];

  const FetchLeads = async (token) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));
    axios
      .get(LEADS_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(async (result) => {
        console.log("verified cold leads are ");
        console.log(result.data);
        let rowsDataArray = "";
        if (result.data.coldLeads.current_page > 1) {
          const theme_values = Object.values(result.data.coldLeads.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.coldLeads.data;
        }

        let rowsdata = rowsDataArray.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          creationDate: row?.creationDate,
          city: row?.city || "-",
          leadName: row?.leadName || "-",
          leadContact: row?.leadContact || "-",
          project: row?.project || "-",
          enquiryType: row?.enquiryType || "-",
          leadType: row?.leadType || "-",
          assignedToManager: row?.assignedToManager,
          assignedToSales: row.assignedToSales,
          feedback: row?.feedback,
          priority: row.priority,
          language: getLangCode(row?.language) || "-",
          //   leadSource: row?.leadSource,
          lid: row?.lid,
          //   lastEdited: row?.lastEdited,
          leadFor: row?.leadFor,
          //   leadStatus: row?.leadStatus,
          //   leadCategory: leadCategory,
          //   notes: row?.notes,
          //   edit: "edit",
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          pageSize: result.data.coldLeads.per_page,
          total: result.data.coldLeads.total,
        }));
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchLeads(token);
    // eslint-disable-next-line
  }, [pageState.page]);

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

  return (
    <div className="pb-10">
      <Box
        width={"100%"}
        className={`${currentMode}-mode-datatable`}
        sx={DataGridStyles}
      >
        <DataGrid
          initialState={{
            columns: {
              columnVisibilityModel: {
                creationDate: false,
              },
            },
          }}
          autoHeight
          disableSelectionOnClick
          rows={pageState.data}
          //   onRowClick={handleRowClick}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[30, 50, 75, 100]}
          pagination
          paginationMode="server"
          page={pageState.page - 1}
          pageSize={pageState.pageSize}
          onPageChange={(newPage) => {
            setpageState((old) => ({ ...old, page: newPage + 1 }));
          }}
          onPageSizeChange={(newPageSize) =>
            setpageState((old) => ({ ...old, pageSize: newPageSize }))
          }
          columns={columns}
          components={{
            Toolbar: GridToolbar,
            Pagination: CustomPagination,
          }}
          componentsProps={{
            toolbar: {
              printOptions: { disableToolbarButton: User?.role !== 1 },
              csvOptions: { disableToolbarButton: User?.role !== 1 },
              showQuickFilter: true,
              //   value: searchText,
              //   onChange: HandleQuicSearch,
            },
          }}
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

export default VerifiedColdLeads;
