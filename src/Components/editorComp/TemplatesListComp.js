import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Pagination,
  Stack,
  Tooltip,
} from "@mui/material";
import { MdMoreVert } from "react-icons/md";
import { IoIosAlert } from "react-icons/io";
import pako from "pako";
import { IoEye } from "react-icons/io5";

import { MdClose } from "react-icons/md";
import SingleTemplateModal from "./SingleTemplateModal";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { decompressData } from "../../utils/compressionFunction";

const TemplatesListComp = ({ modal }) => {
  console.log("modal", modal);
  const {
    themeBgImg,
    currentMode,
    isLangRTL,
    i18n,
    t,
    BACKEND_URL,
    primaryColor,
  } = useStateContext();
  const [loading, setloading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [page, setPage] = useState(1);
  const [btnLoading, setBtnLoading] = useState(false);
  const [openSingleTemplate, setOpenSingleTemplate] = useState({
    open: false,
    image: null,
  });
  const navigate = useNavigate();
  const [templatesList, setTemplatesList] = useState([]);
  const token = localStorage.getItem("auth-token");
  const static_img = "assets/no-image.png";
  const hikalre = "fullLogoRE.png";
  const hikalrewhite = "fullLogoREWhite.png";
  const ITEM_HEIGHT = 48;
  const [deleteTemplate, setDeleteTemplate] = useState(false);
  const handleCloseModal = () => setDeleteTemplate(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [maxPage, setMaxPage] = useState(0);
  const [currentID, setCurrentID] = useState(null);
  const [deleteTemp, setDeleteTemp] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event, id, data) => {
    console.log("id: ", id);
    setAnchorEl(event.currentTarget);
    setCurrentID(id);
    setDeleteTemp(data);
  };

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchTemplates = async () => {
    setloading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/page-templates`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const templates = response?.data?.data;
      console.log("templates list::: ", response);

      //  decompress the html and css
      const decompressedTemplates = templates?.data?.map((template) => {
        return {
          ...template,
          html: decompressData(template.html),
          css: decompressData(template.css),
        };
      });

      console.log("docompressed data:: ", decompressedTemplates);

      setTemplatesList(decompressedTemplates);

      // setTemplatesList(response?.data?.data);
      setMaxPage(response?.data?.data?.last_page);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error("Error fetching template data:", error);
      toast.error("Error fetching templates.", {
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

  const handleDeleteTemplate = async (e, data) => {
    console.log("data:: ", data);

    setBtnLoading(true);
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/page-templates/${data?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("template delete", response);
      toast.success("Template Deleted successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setBtnLoading(false);
      handleCloseModal();
      fetchTemplates();
    } catch (error) {
      setBtnLoading(false);
      console.error("Error deleting template:", error);
      toast.error("Error deleting template.", {
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

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleImageClick = (imageUrl) => {
    setActiveImage(imageUrl);
    setShowOverlay(true);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="relative">
      <Box className="p-0">
        {loading ? (
          <div className="flex col-span-3 justify-center items-center h-[500px] w-full">
            <CircularProgress />
          </div>
        ) : templatesList?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {templatesList?.map((template, index) => {
              if (modal) {
                return (
                  <div
                    key={index}
                    className={`card-hover relative overflow-hidden offers-page-${
                      template?.page
                    } ${
                      !themeBgImg
                        ? currentMode === "dark"
                          ? "bg-[#1C1C1C] text-white"
                          : "bg-[#EEEEEE] text-black"
                        : currentMode === "dark"
                        ? "blur-bg-dark text-white"
                        : "blur-bg-light text-black"
                    } rounded-lg `}
                  >
                    <div className="rounded-md flex flex-col justify-between">
                      <div className="flex items-center justify-between mr-2 ">
                        <IconButton
                          aria-label="more"
                          id="long-button"
                          aria-controls={open ? "long-menu" : undefined}
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={(event) =>
                            handleClick(event, template?.id, template)
                          }
                        >
                          <MdMoreVert
                            color={currentMode === "dark" ? "#fff" : "#000"}
                          />
                        </IconButton>
                        <Menu
                          id="long-menu"
                          MenuListProps={{
                            "aria-labelledby": "long-button",
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          PaperProps={{
                            style: {
                              maxHeight: ITEM_HEIGHT * 4.5,
                              width: "20ch",
                            },
                          }}
                        >
                          <MenuItem
                          // onClick={() => navigate(`/editor/${template?.id}`)}
                          >
                            <Link to={`/editor/${currentID}`}>{t("edit")}</Link>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setDeleteTemplate(template);
                              handleClose();
                            }}
                          >
                            {t("btn_delete")}
                          </MenuItem>
                        </Menu>

                        <h3
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-dark"
                          } font-bold text-lg`}
                        >
                          {template?.template_name}
                        </h3>
                      </div>

                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          setOpenSingleTemplate({
                            open: true,
                            image: template,
                          })
                        }
                      >
                        <iframe
                          className="html-content-container w-full h-[500px] object-cover overflow-y-auto overflow-x-hidden"
                          sandbox="allow-same-origin allow-scripts"
                          // srcDoc={DOMPurify.sanitize(template?.html)}
                          srcDoc={`<html><head><style>${DOMPurify.sanitize(
                            template?.css || ""
                          )}</style></head><body>${DOMPurify.sanitize(
                            template?.html || ""
                          )}</body></html>`}
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>

                        <div
                          className={`absolute top-0 ${
                            isLangRTL(i18n.language) ? "left-0" : "right-0"
                          } p-2`}
                        ></div>

                        <button
                          className={`absolute top-[410px]   z-10 rounded-full bg-btn-primary ${
                            isLangRTL(i18n.language) ? "left-0" : "right-0"
                          } p-3`}
                          onClick={() =>
                            setOpenSingleTemplate({
                              open: true,
                              image: template,
                            })
                          }
                        >
                          <IoEye />
                        </button>
                      </div>

                      {/* </Link> */}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className={`card-hover relative overflow-hidden offers-page-${
                      template?.page
                    } ${
                      !themeBgImg
                        ? currentMode === "dark"
                          ? "bg-[#1C1C1C] text-white"
                          : "bg-[#EEEEEE] text-black"
                        : currentMode === "dark"
                        ? "blur-bg-dark text-white"
                        : "blur-bg-light text-black"
                    } rounded-lg cursor-pointer `}
                  >
                    <div className="flex items-center justify-between mr-2 ">
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={(event) =>
                          handleClick(event, template?.id, template)
                        }
                      >
                        <MdMoreVert
                          color={currentMode === "dark" ? "#fff" : "#000"}
                        />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        MenuListProps={{
                          "aria-labelledby": "long-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "20ch",
                          },
                        }}
                      >
                        <MenuItem>
                          <Link to={`/editor/${currentID}`}>{t("edit")}</Link>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setDeleteTemplate(template);
                            handleClose();
                          }}
                        >
                          {t("btn_delete")}
                        </MenuItem>
                      </Menu>
                    </div>
                    <div
                      className="flex items-center justify-center mr-2  py-5"
                      onClick={() =>
                        setOpenSingleTemplate({
                          open: true,
                          image: template,
                        })
                      }
                    >
                      <h3
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-dark"
                        } font-bold text-lg capitalize`}
                      >
                        {template?.template_name}
                      </h3>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center col-span-3 h-[500px] w-full">
            <h2 className="text-primary font-bold text-2xl">
              {t("no_landing_pages")}
            </h2>
          </div>
        )}

        {/* {currentPage < lastPage && (
          <div className="flex justify-center mt-5">
            <Button
              disabled={btnloading}
              // onClick={() => setCurrentPage((page) => page + 1)}
              variant="contained"
              color="error"
            >
              {btnloading ? (
                <div className="flex items-center justify-center space-x-1">
                  <CircularProgress size={18} sx={{ color: "blue" }} />
                </div>
              ) : (
                <span>{t("show_more")}</span>
              )}
            </Button>
          </div>
        )} */}

        {/* DELETE CONFIRMATION */}
        {deleteTemplate && (
          <Modal
            keepMounted
            open={deleteTemplate}
            onClose={handleCloseModal}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
            closeAfterTransition
            // BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <div
              style={style}
              className={`w-[calc(100%-20px)] md:w-[40%]  ${
                currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
              } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
            >
              <div className="flex flex-col justify-center items-center">
                <IoIosAlert
                  size={50}
                  className="text-main-red-color text-2xl"
                />
                <h1
                  className={`font-semibold pt-3 text-lg ${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  }`}
                >
                  {`Do you really want to delete this template ${deleteTemp?.template_name}?`}
                </h1>
              </div>

              <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                <Button
                  className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                  ripple="true"
                  size="lg"
                  onClick={(e) => handleDeleteTemplate(e, deleteTemp)}
                >
                  {btnLoading ? (
                    <CircularProgress size={18} sx={{ color: "blue" }} />
                  ) : (
                    <span>{t("confirm")}</span>
                  )}
                </Button>

                <Button
                  onClick={handleCloseModal}
                  ripple="true"
                  variant="outlined"
                  className={`shadow-none  rounded-md text-sm  ${
                    currentMode === "dark"
                      ? "text-white border-white"
                      : "text-main-red-color border-main-red-color"
                  }`}
                >
                  {t("cancel")}
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {openSingleTemplate?.open && (
          <SingleTemplateModal
            openSingleTemplate={openSingleTemplate}
            setOpenSingleTemplate={setOpenSingleTemplate}
            hikalre={hikalre}
            hikalrewhite={hikalrewhite}
            fetchTemplates={fetchTemplates}
            modal="modal"
          />
        )}

        {/* PICTURE OVERLAY  */}
        {/* {showOverlay && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-75"></div>
            <div className="relative z-10 bg-white">
              <img src={activeImage} alt="overlay" className="h-[90vh]" />
              <button
                onClick={handleCloseOverlay}
                className="absolute top-4 right-4 text-2xl text-white bg-primary p-2 rounded-full m-0"
              >
                <MdClose />
              </button>
              <img
                src={hikalrewhite}
                alt="hikal real estate"
                className="absolute right-4 bottom-4 w-[100px] p-2 bg-[#000000] bg-opacity-70"
              />
            </div>
          </div>
        )} */}

        <Stack spacing={2} marginTop={2}>
          <Pagination
            count={maxPage}
            color={currentMode === "dark" ? "primary" : "secondary"}
            onChange={(value) => setPage(value)}
            style={{ margin: "auto" }}
            page={page}
            sx={{
              "& .Mui-selected": {
                color: "white !important",
                backgroundColor: `${primaryColor} !important`,
                "&:hover": {
                  backgroundColor: currentMode === "dark" ? "black" : "white",
                },
              },
              "& .MuiPaginationItem-root": {
                color: currentMode === "dark" ? "white" : "black",
              },
            }}
          />
        </Stack>
      </Box>
    </div>
  );
};

export default TemplatesListComp;
