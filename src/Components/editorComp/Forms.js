import React, { useState, useEffect, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { GoClock } from "react-icons/go";
import { FaList } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  MenuItem,
  InputAdornment,
  TextField,
  FormControl,
  Tooltip,
} from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import ViewForm from "./ViewForm";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { maxWidth, minWidth } from "@mui/system";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";
import { MdOutlineDelete } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const CustomToolbar = React.memo(({ searchText, handleSearchChange }) => {
  const { t } = useTranslation();

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
      <Box sx={{ flex: 1 }} />
      <TextField
        placeholder={`${t("search")}..`}
        // ref={searchRef}
        sx={{ "& input": { borderBottom: "2px solid #ffffff6e" } }}
        variant="standard"
        onInput={handleSearchChange}
        value={searchText}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton sx={{ padding: 0 }}>
                <BiSearch size={17} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </GridToolbarContainer>
  );
});

const Forms = ({
  forms,
  setFolder,
  fetchForms,
  setFormEditor,
  setFormEdit,
  loading,
  deleteFolder,
  folder,
}) => {
  const navigate = useNavigate();
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    pageState,
    setpageState,
    User,
    darkModeColors,
    themeBgImg,
    t,
    modal,
    isLangRTL,
    i18n,
  } = useStateContext();

  const [searchRows, setSearchRows] = useState(forms);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [rowMenu, setRowMenu] = useState({
    type: "",
    fields: [],
  });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [folderDeleteModal, setFolderDeleteModal] = useState(false);
  const dataTableRef = useRef();

  const [anchorEl, setAnchorEl] = React.useState(null);
  // const searchRef = useRef(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = (e) => {
    if (selectedRow) {
      if (e?.target?.innerText == "Delete") {
        // handleDeleteForm(selectedRow);
        setDeleteConfirmModal(true);
        setAnchorEl(null);
        // setSelectedRow(null);
        return;
      }
      setRowMenu({
        type: e?.target?.innerText,
        fields: selectedRow?.fields,
        name: selectedRow?.name,
        id: selectedRow?.id,
        folder_id: selectedRow?.folder_id,
      });
      console.log("selected Row fields of form", selectedRow?.fields);
    }

    setAnchorEl(null);
    setSelectedRow(null);
  };

  useEffect(() => {
    if (rowMenu?.type === "Edit") {
      setFormEditor(true);
      setFormEdit(rowMenu);
    }
  }, [rowMenu]);

  useEffect(() => {
    setSearchRows(forms);
  }, [forms]);

  const columns = [
    {
      field: "name",
      headerName: <div className="px-5">Name</div>,
      headerAlign: "left",
      align: "left",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="w-full h-full flex items-center px-9 ">
            {params?.row?.name}
          </div>
        );
      },
    },
    {
      field: "updated_at",
      headerName: "Last Updated",
      headerAlign: "center",
      minWidth: 100,
      flex: 1,
      renderCell: (row) => {
        const updatedDate = new Date(row?.row?.updated_at);
        return <div>{updatedDate?.toLocaleDateString()}</div>;
      },
    },
    {
      field: "lastEditedBy",
      headerName: "Updated By",
      headerAlign: "center",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      minWidth: 70,
      flex: 1,
      renderCell: (row) => {
        console.log(row, "row");
        return <div>{row?.row?.status == "1" ? "Active" : "Inactive"}</div>;
      },
    },
    {
      field: "",
      headerName: "",
      headerAlign: "center",
      minWidth: 40,
      maxWidth: 80,
      renderCell: (row) => {
        // return <HiDotsVertical />;
        const isDarkMode = currentMode === "dark";
        return (
          <div>
            <HiDotsVertical
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(e) => handleClick(e, row?.row)}
              size={14}
            />

            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={(e) => handleClose(e, row)}
              anchorOrigin={{
                horizontal: "right",
              }}
              transformOrigin={{
                horizontal: "right",
              }}
              PaperProps={{
                style: {
                  backgroundColor: isDarkMode ? "#333" : "#fff", // Conditional background color
                  color: isDarkMode ? "#fff" : "#000", // Conditional text color
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)", // Box shadow for both modes
                },
              }}
              MenuListProps={{
                style: {
                  padding: 0,
                },
              }}
            >
              <MenuItem
                onClick={(e) => navigate(`/forms/${selectedRow?.id}/inline`)}
                style={{
                  backgroundColor: isDarkMode ? "#444" : "#fff", // Conditional background color
                  color: isDarkMode ? "#fff" : "#000", // Conditional text color
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = isDarkMode
                    ? "#555"
                    : "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = isDarkMode
                    ? "#444"
                    : "#fff")
                }
              >
                View
              </MenuItem>
              <MenuItem
                onClick={(e) => handleClose(e)}
                style={{
                  backgroundColor: isDarkMode ? "#444" : "#fff",
                  color: isDarkMode ? "#fff" : "#000",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = isDarkMode
                    ? "#555"
                    : "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = isDarkMode
                    ? "#444"
                    : "#fff")
                }
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={(e) => handleClose(e)}
                style={{
                  backgroundColor: isDarkMode ? "#444" : "#fff",
                  color: isDarkMode ? "#fff" : "#000",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = isDarkMode
                    ? "#555"
                    : "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = isDarkMode
                    ? "#444"
                    : "#fff")
                }
              >
                Delete
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  // const CustomToolbar = () => {
  //   const searchRef = useRef(null);
  //   useEffect(() => {
  //     searchRef?.current?.focus();
  //   }, [searchText]);
  //   return (
  //     <GridToolbarContainer>
  //       <GridToolbarColumnsButton />
  //       <GridToolbarFilterButton />
  //       <GridToolbarExport />
  //       <Box
  //         sx={{
  //           flex: 1,
  //         }}
  //       ></Box>
  //       <TextField
  //         placeholder={t("search") + ".."}
  //         ref={searchRef}
  //         sx={{
  //           "& input": {
  //             borderBottom: "2px solid #ffffff6e",
  //           },
  //         }}
  //         variant="standard"
  //         // onKeyUp={handleKeyUp}
  //         onInput={handleSearchChange}
  //         value={searchText}
  //         InputProps={{
  //           startAdornment: (
  //             <InputAdornment position="start">
  //               <IconButton sx={{ padding: 0 }}>
  //                 <BiSearch size={17} />
  //               </IconButton>
  //             </InputAdornment>
  //           ),
  //         }}
  //       />
  //     </GridToolbarContainer>
  //   );
  // };

  const handleSearchChange = (e) => {
    setSearchText(e?.target?.value);
    const searchResults = forms?.filter((row) => {
      return (
        row?.name?.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        row?.lastEditedBy
          ?.toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.updated_at?.toLowerCase().includes(e?.target?.value.toLowerCase())
      );
    });

    setSearchRows(searchResults);
  };

  const handleDeleteForm = async (id) => {
    let token = localStorage.getItem("auth-token");
    setSelectedRow(null);
    try {
      const res = await axios.delete(`${BACKEND_URL}/forms/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (res?.status) {
        toast.success("Form is deleted Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchForms();
      }
    } catch (error) {
      toast.error("Can't delete form", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      {rowMenu?.type === "" && (
        <Box
          sx={{
            ...DataGridStyles,
            width: "100%",
          }}
          className={`forms-datatable ${currentMode}-mode-datatable`}
        >
          <div
            className={`flex gap-4 justify-end items-center py-8 pr-2 ${
              currentMode == "dark" ? "text-light" : "text-dark"
            }`}
          >
            {folder && (
              <>
                {" "}
                <Button
                  onClick={() => setFolder(null)}
                  ripple={true}
                  variant="outlined"
                  className={`shadow-none px-3 rounded-md !py-2 text-sm flex gap-2 !border-gray-400 text-black bg-white`}
                >
                  {isLangRTL(i18n.language) ? (
                    <TiArrowRight size={16} />
                  ) : (
                    <TiArrowLeft size={16} />
                  )}
                  {t("btn_back")}
                </Button>
                <Button
                  onClick={() => setFolderDeleteModal(true)}
                  ripple={true}
                  variant="outlined"
                  className={`shadow-none px-3 rounded-md !py-2 text-sm flex gap-2 !border-gray-400 text-black bg-white`}
                >
                  {t("btn_delete")} {t("folder")}
                  <MdOutlineDelete size={16} />
                </Button>
              </>
            )}
          </div>
          <Box
            sx={{
              ...DataGridStyles,
              position: "relative",
              marginBottom: 50,
              width: "100%",
            }}
          >
            {/* <div className="absolute sm:top-[7px] sm:right-[20px] sm:left-auto sm:mb-0  right-auto left-[20px] top-[40px] mb-4 z-[5]">
            
            </div> */}

            <DataGrid
              disableDensitySelector
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    creationDate: false,
                    otp: false,
                    language: false,
                  },
                },
              }}
              ref={dataTableRef}
              loading={loading}
              autoHeight
              disableSelectionOnClick
              rows={searchRows}
              rowsPerPageOptions={[30, 50, 75, 100]}
              pagination
              components={{
                // Toolbar: GridToolbar,
                Toolbar: CustomToolbar,
              }}
              componentsProps={{
                toolbar: {
                  searchText: searchText,
                  handleSearchChange: handleSearchChange,
                },
              }}
              width="auto"
              paginationMode="server"
              columns={columns}
              sx={{
                boxShadow: 2,
                "& .MuiDataGrid-main": {
                  overflowY: "scroll",
                  height: "auto",
                  borderRadius: "12px",
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
        </Box>
      )}

      {deleteConfirmModal && (
        <ConfirmDeleteModal
          deleteConfirmModal={deleteConfirmModal}
          setDeleteConfirmModal={setDeleteConfirmModal}
          handleDelete={handleDeleteForm}
          selectedRow={selectedRow}
          message={t("want_to_delete", { DataName: selectedRow?.name })}
        />
      )}
      {folderDeleteModal && folder && (
        <ConfirmDeleteModal
          deleteConfirmModal={folderDeleteModal}
          setDeleteConfirmModal={setFolderDeleteModal}
          handleDelete={deleteFolder}
          selectedRow={folder}
          message={t("want_to_delete", { DataName: folder?.name })}
          inFolder
        />
      )}
    </>
  );
};

export default Forms;
