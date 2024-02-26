import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Modal,
} from "@mui/material";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import Error404 from "../../Pages/Error";
import { DataGrid } from "@mui/x-data-grid";
import { inventory_status } from "../_elements/SelectOptions";
import { renderStyles } from "../_elements/SelectStyles";
import { FaPencilAlt } from "react-icons/fa";
import axios from "../../axoisConfig";
import { IoMdClose } from "react-icons/io";

import { BiTrash } from "react-icons/bi";
import AddItem from "./AddItem";
import { toast } from "react-toastify";
import { MdErrorOutline } from "react-icons/md";
import EditItem from "./EditItem";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const Inventory = ({ openInventory, setOpenInventory }) => {
  const [leadNotFound, setLeadNotFound] = useState(false);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("auth-token");
  const [row, setRow] = useState([]);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(null);
  const [pageSize, setPageSize] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [btnloading, setBtnLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const {
    t,
    currentMode,
    isLangRTL,
    i18n,
    User,
    DataGridStyles,
    primaryColor,
    BACKEND_URL,
  } = useStateContext();
  const [isClosing, setIsClosing] = useState(false);
  console.log("inventory status array ::::: ", inventory_status(t));
  const inventoryStatus = "available";

  const listITems = async () => {
    setLoading(true);
    try {
      const listItem = await axios.get(`${BACKEND_URL}/items`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("list item::::: ", listItem);
      setRow(listItem?.data?.data);
      setTotal(listItem?.data?.data?.meta?.total);
      setPageSize(listItem?.data?.data?.meta?.per_page);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error:::: ", error);
      toast.error(`Unable to fetch inventory. Kindly try again`, {
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

  const changeStatus = async (e, value) => {
    const newValue = e.value;
    console.log("new value status:: ", newValue);
    setLoading(true);
    try {
      const updateStatus = await axios.post(
        `${BACKEND_URL}/items/${value?.id}`,
        JSON.stringify({ itemStatus: newValue, itemName: value?.itemName }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success(`${value?.itemName} Item Status Update Successfully.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      console.log("list item::::: ", updateStatus);
      setLoading(false);

      listITems();
    } catch (error) {
      setLoading(false);
      console.log("error:::: ", error);
      toast.error(`Unable to update Status. Kindly try again`, {
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

  const deleteItem = async (value) => {
    setBtnLoading(true);
    try {
      const deleteItem = await axios.delete(
        `${BACKEND_URL}/items/${value?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      listITems();

      toast.success(`${value?.itemName} Item Deleted Successfully.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      console.log("list item::::: ", deleteItem);

      setBtnLoading(false);
      setDeleteModal(false);
    } catch (error) {
      setBtnLoading(false);
      console.log("error:::: ", error);
      toast.error(`Unable to delete item. Kindly try again`, {
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

  const columns = [
    { field: "id", headerName: "ID", width: 100, headerAlign: "center" },
    {
      field: "itemName",
      headerName: "Item Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "itemPrice",
      headerName: "Item Price",
      type: "number",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "image_path",
      headerName: "Item Price",
      width: 150,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div className=" rounded-lg border">
            <img
              src={`${cellValues?.row?.image_path}`}
              width="50px"
              height="50px"
            />
          </div>
        );
      },
    },
    { field: "notes", headerName: "Note", flex: 1, headerAlign: "center" },
    {
      field: "itemStatus",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      renderCell: (cellValues) => {
        console.log("cellvalues::: ", cellValues);
        return (
          <Select
            id="status"
            value={inventory_status(t)?.find(
              (option) =>
                option?.value?.toLowerCase() ===
                cellValues?.row?.itemStatus?.toLowerCase()
            )}
            onChange={(e) => changeStatus(e, cellValues?.row)}
            options={inventory_status(t)}
            placeholder={t("select_status")}
            className={`w-full`}
            menuPortalTarget={document.body}
            styles={renderStyles(currentMode, primaryColor)}
          />
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div className="">
            <IconButton
              sx={{ background: `${primaryColor}`, marginRight: "10px" }}
              onClick={() => setEditModal(cellValues?.row)}
            >
              <FaPencilAlt color="#ffffff" size={12} />
            </IconButton>
            <IconButton
              sx={{ background: `${primaryColor}` }}
              onClick={() => setDeleteModal(cellValues?.row)}
            >
              <BiTrash color="#ffffff" size={12} />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenInventory(false);
    }, 1000);
  };

  useEffect(() => {
    listITems();
  }, [page, pageSize]);

  return (
    <>
      <Modal
        keepMounted
        open={openInventory}
        onClose={() => setOpenInventory(false)}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          className={`${
            isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${
            isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
          }
            w-[100vw] h-[100vh] flex items-start justify-end `}
        >
          <button
            // onClick={handleCloseTimelineModel}
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
                bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className=" hover:border hover:border-white hover:rounded-full"
            />
          </button>

          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            } 
                 p-4 h-[100vh] w-[80vw] overflow-y-scroll border-primary
                `}
          >
            {leadNotFound ? (
              <Error404 />
            ) : (
              <div>
                <div className="w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 mb-3">
                  <div className="w-full flex items-center pb-3 ">
                    <div
                      className={`${isLangRTL(i18n.language) ? "ml-2" : "mr-2"}
                        bg-primary w-fit rounded-md my-1 py-1 px-2 text-white flex items-center justify-center`}
                    >
                      {t("product_inventory")}
                    </div>
                  </div>

                  <div className="w-full flex justify-end items-center">
                    <Button
                      style={{
                        background: `${primaryColor}`,
                        color: "#fff",
                      }}
                      onClick={() => setOpenAddItem(true)}
                    >
                      {t("add_item")}
                    </Button>
                  </div>
                </div>

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
                      getRowHeight={() => "auto"}
                      // rowHeight={25}
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
                      onPageSizeChange={(newPageSize) =>
                        setPageSize(newPageSize)
                      }
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
                        params.indexRelativeToCurrentPage % 2 === 0
                          ? "even"
                          : "odd"
                      }
                    />
                  </Box>
                </div>
              </div>
            )}
          </div>
          {openAddItem && (
            <AddItem
              openAddItem={openAddItem}
              setOpenAddItem={setOpenAddItem}
              listITems={listITems}
            />
          )}

          {editModal && (
            <EditItem
              setEditModal={setEditModal}
              editModal={editModal}
              listITems={listITems}
            />
          )}

          {deleteModal && (
            <>
              <Dialog
                sx={{
                  "& .MuiPaper-root": {
                    boxShadow: "none !important",
                  },
                  "& .MuiBackdrop-root, & .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop":
                    {
                      // backgroundColor: "rgba(0, 0, 0, 0.6) !important",
                    },
                }}
                open={deleteModal}
                onClose={(e) => setDeleteModal(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="relative"
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: 10,
                    color: (theme) => theme.palette.grey[500],
                  }}
                  onClick={() => setDeleteModal(false)}
                >
                  <IoMdClose size={18} />
                </IconButton>
                <div
                  className={`px-10 py-5 ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {/* FEEDBACK  */}
                  <div className="flex flex-col justify-center items-center">
                    <MdErrorOutline
                      size={50}
                      className="text-primary text-2xl"
                    />
                    <h1 className="font-semibold pt-3 mb-3 text-lg text-center">
                      {t("want_to_delete", { DataName: deleteModal?.itemName })}{" "}
                    </h1>
                  </div>

                  <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                    <Button
                      className={` text-white rounded-md p-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                      ripple={true}
                      size="lg"
                      onClick={() => deleteItem(deleteModal)}
                    >
                      {btnloading ? (
                        <CircularProgress size={16} sx={{ color: "white" }} />
                      ) : (
                        <span className="text-white"> Confirm</span>
                      )}
                    </Button>

                    <Button
                      onClick={() => setDeleteModal(false)}
                      ripple={true}
                      variant="outlined"
                      className={`shadow-none p-3 rounded-md text-sm  ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-primary border-primary"
                      }`}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Dialog>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Inventory;
