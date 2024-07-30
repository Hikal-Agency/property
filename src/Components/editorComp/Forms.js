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
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import ViewForm from "./ViewForm";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { maxWidth } from "@mui/system";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { TiArrowLeft } from "react-icons/ti";
import { MdOutlineDelete } from "react-icons/md";
import { BiSearch } from "react-icons/bi";

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
  } = useStateContext();

  const [searchRows, setSearchRows] = useState(forms);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowMenu, setRowMenu] = useState({
    type: "",
    fields: [],
  });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [folderDeleteModal, setFolderDeleteModal] = useState(false);
  const dataTableRef = useRef();

  const [anchorEl, setAnchorEl] = React.useState(null);
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
      minWidth: 30,
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
      minWidth: 30,
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
      minWidth: 30,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      minWidth: 30,
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
                onClick={(e) => navigate(`/forms/${selectedRow?.id}`)}
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

  const handleSearchChange = (e) => {
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
            // "& .MuiDataGrid-columnHeaders": {
            //   backgroundColor: "black",
            //   color: "white",
            //   width: "100%",
            // },
            // "& .MuiDataGrid-footerContainer": {
            //   borderTop: `0px`,
            //   borderRadius: "0px 0px 120px 120px",
            // },
          }}
          className={`${currentMode}-mode-datatable`}
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
                  <TiArrowLeft size={16} />
                  {t("Back")}
                </Button>
                <Button
                  onClick={() => setFolderDeleteModal(true)}
                  ripple={true}
                  variant="outlined"
                  className={`shadow-none px-3 rounded-md !py-2 text-sm flex gap-2 !border-gray-400 text-black bg-white`}
                >
                  {t("Delete Folder")}
                  <MdOutlineDelete size={16} />
                </Button>
              </>
            )}
            {/* <div className="flex items-center border border-gray-400 gap-2 rounded-lg px-3 py-1">
              <div
                className={`p-2 pr-3 border-r border-gray-400 ${
                  currentMode == "dark" ? "text-white" : "text-black"
                }`}
              >
                <GoClock size={16} />
              </div>
              <div
                className={`p-2 ${
                  currentMode == "dark" ? "text-white" : "text-black"
                }`}
              >
                <FaList size={16} />
              </div>
            </div> */}
            {/* <div className="flex items-center border border-gray-400 gap-2 px-2 py-3 rounded-lg w-[20%]">
              <div
                className={`${
                  currentMode == "dark" ? "text-white" : "text-black"
                }`}
              >
                <CiSearch size={16} />
              </div>
              <input
                type="text"
                name=""
                id=""
                placeholder="Search for forms"
                className={`focus:outline-none bg-transparent ${
                  currentMode == "dark" ? "text-white" : "black"
                }`}
                onChange={handleSearchChange}
              />
            </div> */}
          </div>
          <Box
            sx={{ ...DataGridStyles, position: "relative", marginBottom: 50 }}
          >
            <div className="absolute top-[7px] right-[20px] z-[5]">
              <TextField
                placeholder={t("search") + ".."}
                // ref={searchRef}
                sx={{
                  "& input": {
                    borderBottom: "2px solid #ffffff6e",
                  },
                }}
                variant="standard"
                // onKeyUp={handleKeyUp}
                onInput={handleSearchChange}
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
            </div>

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
                Toolbar: GridToolbar,
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
          message="Are you sure want to delete form"
        />
      )}
      {folderDeleteModal && folder && (
        <ConfirmDeleteModal
          deleteConfirmModal={folderDeleteModal}
          setDeleteConfirmModal={setFolderDeleteModal}
          handleDelete={deleteFolder}
          selectedRow={folder}
          message="Are you sure want to delete folder?"
          inFolder
        />
      )}
    </>
  );
};

export default Forms;
