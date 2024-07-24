import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { toast } from "react-toastify";
import axios from "../../../axoisConfig";
import ListingDataGrid from "../ListingDataGrid";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

const AddListingType = ({
  data,
  setData,
  column,
  setColumn,
  loading,
  setLoading,
  page,
  pageSize,
  total,
  setPage,
  setPageSize,
  FetchData,
}) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
    fontFam,
  } = useStateContext();
  const token = localStorage.getItem("auth-token");

  const [btnLoading, setBtnLoading] = useState(false);
  const [deleteDialogue, setDeleteDialogue] = useState(false);

  const [name, setName] = useState("");

  const columns = [
    // id
    {
      field: "id",
      headerName: t("id"),
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center ">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    // NAME
    {
      field: "name",
      headerName: t("label_listing_type"),
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },

    {
      field: "notes",
      headerName: t("label_action"),
      minwidth: 100,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className="space-x-2 w-full flex items-center justify-center mx-2">
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } editUserBtn hover:bg-red-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Delete List Type" arrow>
                <button onClick={() => setDeleteDialogue(cellValues?.row)}>
                  <BsTrash size={16} />
                </button>
              </Tooltip>
            </p>
          </div>
        );
      },
    },
  ];

  const deleteListType = (deleteDialogue) => {
    setBtnLoading(true);

    axios
      .delete(
        `${BACKEND_URL}/listing-types/${deleteDialogue?.lid}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        setBtnLoading(false);
        setDeleteDialogue(false);

        toast.success(`${deleteDialogue?.name} deleted successfully.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        FetchData();
      })
      .catch((err) => {
        setBtnLoading(false);
        console.log(err);
        toast.error("Something Went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const AddListType = () => {
    setBtnLoading(true);

    if (!name) {
      setBtnLoading(false);
      toast.error("Kindly fill the field.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }

    axios
      .post(
        `${BACKEND_URL}/listing-types`,
        { name: name },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        setBtnLoading(false);
        setName("");
        toast.success("Listing type added successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        FetchData();
      })
      .catch((err) => {
        setBtnLoading(false);
        console.log(err);
        toast.error("Something Went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  return (
    <div className="my-4">
      <Box
        sx={{
          ...darkModeColors,
          "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
            {
              right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
              transformOrigin: isLangRTL(i18n.language) ? "right" : "left",
            },
          "& legend": {
            textAlign: isLangRTL(i18n.language) ? "right" : "left",
          },
        }}
      >
        <h4 className={`text-primary text-center font-semibold pb-5`}>
          {t("heading_listing_type")}
        </h4>{" "}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <TextField
            id="name"
            type={"text"}
            label={t("label_listing_type")}
            value={name}
            name="name"
            onChange={(e) => setName(e.target.value)}
            //   className="w-full"

            variant="outlined"
            size="small"
            required
          />
          <Button
            className={`min-w-fit text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
            ripple={true}
            style={{
              fontFamily: fontFam,
              background: `${primaryColor}`,
            }}
            size="lg"
            type="submit"
            onClick={AddListType}
            disabled={btnLoading ? true : false}
          >
            {btnLoading ? (
              <CircularProgress
                size={20}
                sx={{ color: "white" }}
                className="text-white"
              />
            ) : (
              <span className="text-white">{t("submit")}</span>
            )}
          </Button>
        </div>
      </Box>

      {deleteDialogue && (
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
            open={deleteDialogue}
            onClose={(e) => setDeleteDialogue(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <IconButton
              sx={{
                position: "absolute",
                right: 12,
                top: 10,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={() => setDeleteDialogue(false)}
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
              <div className="flex flex-col justify-center items-center">
                {/* <BsPersonCheck size={50} className="text-primary text-2xl" /> */}
                <h1 className="font-semibold pt-3 text-lg text-center">
                  {t("do_you_really_delete", { DataName: "" })}{" "}
                  <span className="text-sm bg-gray-500 px-2 py-1 rounded-md font-bold">
                    {deleteDialogue?.name}
                  </span>{" "}
                  ?
                </h1>
              </div>
              <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                <Button
                  className={` text-white rounded-md p-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                  ripple={true}
                  size="lg"
                  onClick={() => deleteListType(deleteDialogue)}
                >
                  {btnLoading ? (
                    <CircularProgress size={16} sx={{ color: "white" }} />
                  ) : (
                    <span>{t("confirm")}</span>
                  )}
                </Button>

                <Button
                  onClick={() => setDeleteDialogue(false)}
                  ripple={true}
                  variant="outlined"
                  className={`shadow-none p-3 rounded-md text-sm  ${
                    currentMode === "dark"
                      ? "text-white border-white"
                      : "text-black border-black"
                  }`}
                >
                  {t("cancel")}
                </Button>
              </div>
            </div>
          </Dialog>
        </>
      )}

      <div classNAme=" mt-5">
        <ListingDataGrid
          data={data}
          setData={setData}
          column={columns}
          // setColumn={setColumn}
          type="list_type"
          loading={loading}
          setLoading={setLoading}
          page={page}
          pageSize={pageSize}
          total={total}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
};

export default AddListingType;
