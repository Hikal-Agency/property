import { Backdrop, Box, Button, IconButton, Modal } from "@mui/material";
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

import { BiTrash } from "react-icons/bi";
import AddItem from "./AddItem";
import { toast } from "react-toastify";

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

      setRow(listItem?.data?.data);
      console.log("list item::::: ", listItem);
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

  const changeStatus = () => {};
  // const rows = [
  //   {
  //     id: 1,
  //     itemName: "Product A",
  //     itemPrice: 20.0,
  //     note: "Lorem ipsum",
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  //     itemName: "Product B",
  //     itemPrice: 30.0,
  //     note: "Dolor sit amet",
  //     status: "Inactive",
  //   },
  //   {
  //     id: 3,
  //     itemName: "Product C",
  //     itemPrice: 25.0,
  //     note: "Consectetur adipiscing",
  //     status: "Active",
  //   },
  //   {
  //     id: 4,
  //     itemName: "Product D",
  //     itemPrice: 18.0,
  //     note: "Elit sed do eiusmod",
  //     status: "Inactive",
  //   },
  //   {
  //     id: 5,
  //     itemName: "Product E",
  //     itemPrice: 40.0,
  //     note: "Tempor incididunt ut labore",
  //     status: "Active",
  //   },
  // ];

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
            value={cellValues?.row?.itemStatus}
            onChange={changeStatus}
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
            >
              <FaPencilAlt color="#ffffff" size={12} />
            </IconButton>
            <IconButton sx={{ background: `${primaryColor}` }}>
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
  }, []);

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
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default Inventory;
