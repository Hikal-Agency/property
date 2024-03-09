import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import Error404 from "../../Pages/Error";
import axios from "../../axoisConfig";

import { toast } from "react-toastify";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const EditCategory = ({ editModal, setEditCategory, fetchCategories }) => {
  const [leadNotFound, setLeadNotFound] = useState(false);
  const editITem = editModal?.row;

  const [categoryData, setCategoryData] = useState({
    category: editITem?.category || editModal?.category || null,
    description: editITem?.description || editModal?.description || null,
  });

  console.log("ITem Data:::: ", categoryData);
  console.log("edit item::: ", editModal);

  const {
    t,
    currentMode,
    isLangRTL,
    i18n,
    User,
    primaryColor,
    darkModeColors,
    fontFam,
    BACKEND_URL,
  } = useStateContext();
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("auth-token");

  const handleChange = (e) => {
    console.log("handlechange ::: ", e.target.value);
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  const editCategory = async () => {
    setLoading(true);
    if (!categoryData?.category) {
      setLoading(false);
      toast.error(`Category name is required.`, {
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
    try {
      const editCategory = await axios.post(
        `${BACKEND_URL}/categories/${editModal?.row?.id}`,
        categoryData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("edit category::::: ", editCategory);

      toast.success(`Item Updated.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setLoading(false);
      setEditCategory(false);
      setCategoryData({
        category: null,
        description: null,
      });
      fetchCategories();
    } catch (error) {
      setLoading(false);
      console.log("error:::: ", error);
      toast.error(`Unable to edit item. Kindly try again`, {
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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setEditCategory(false);
    }, 1000);
  };
  return (
    <>
      <Modal
        keepMounted
        open={editModal}
        onClose={() => setEditCategory(false)}
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
              <div className="">
                <div className="ml-3 pb-3 ">
                  <div
                    className="w-full flex items-center py-1 mb-5"
                    style={{
                      position: "absolute",
                      right: -3,
                      top: 2,
                      color: (theme) => theme.palette.grey[500],
                      marginLeft: "10px",
                    }}
                  >
                    <div className="bg-primary h-10 w-1 rounded-full ml-3"></div>
                    <h1
                      className={`text-lg font-semibold mx-2 uppercase ${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {t("edit_category")}
                    </h1>
                  </div>
                </div>

                <div className="mt-5 " style={{ marginTop: "40px" }}>
                  <form>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5 py-5">
                      <Box
                        sx={{
                          ...darkModeColors,
                          "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                            {
                              right: isLangRTL(i18n.language)
                                ? "2.5rem"
                                : "inherit",
                              transformOrigin: isLangRTL(i18n.language)
                                ? "right"
                                : "left",
                            },
                          "& legend": {
                            textAlign: isLangRTL(i18n.language)
                              ? "right"
                              : "left",
                          },
                        }}
                        className="p-2"
                      >
                        <TextField
                          type={"text"}
                          label={t("edit_cat_label")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          size="small"
                          name="category"
                          value={categoryData?.category}
                          onChange={handleChange}
                          required
                        />

                        <TextField
                          type={"text"}
                          label={t("edit_cat_description_label")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          name="description"
                          size="small"
                          value={categoryData?.description}
                          onChange={handleChange}
                        />
                      </Box>
                    </div>

                    <Button
                      type="submit"
                      size="medium"
                      style={{
                        color: "white",
                        fontFamily: fontFam,
                      }}
                      className="bg-btn-primary w-full text-white rounded-lg py-4 font-semibold mb-3 shadow-md hover:-mt-1 hover:mb-1"
                      onClick={editCategory}
                      disabled={loading ? true : false}
                    >
                      {loading ? (
                        <CircularProgress
                          size={23}
                          sx={{ color: "white" }}
                          className="text-white"
                        />
                      ) : (
                        <span>{t("edit_category")}</span>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditCategory;
