import { Backdrop, Box, IconButton, Modal, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { MdClose } from "react-icons/md";
import GrapesJSEditor from "./GrapesJSEditor";
import FunnelSettings from "./FunnelSettings";
import { Link } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import DOMPurify from "dompurify";

const SingleTemplateModal = ({
  setOpenSingleTemplate,
  openSingleTemplate,
  hikalrewhite,
  hikalre,
}) => {
  console.log("single template:: ", openSingleTemplate);
  const { currentMode, i18n, isLangRTL, t, darkModeColors, themeBgImg } =
    useStateContext();
  const [value, setValue] = useState();

  const data = openSingleTemplate?.image;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // MODAL CLOSE
  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenSingleTemplate({
        open: false,
      });
    }, 1000);
  };
  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  return (
    <Modal
      keepMounted
      open={openSingleTemplate?.open}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className="relative"
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
        } w-[100vw] h-[100vh] flex items-start justify-end`}
      >
        <button
          onClick={handleClose}
          className={`${
            isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
          }
    bg-primary w-fit h-fit p-3 my-4 z-10`}
        >
          <MdClose
            size={18}
            color={"white"}
            className="hover:border hover:border-white hover:rounded-full"
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
    p-4 h-[100vh] w-[80vw] overflow-y-scroll 
    `}
        >
          <div className="flex justify-between items-center  ">
            <div className="flex items-center pb-3">
              <div
                className={`${
                  isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                } bg-primary h-10 w-1 rounded-full my-1`}
              ></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("btn_add_template")}
              </h1>
            </div>

            <Link
              to={`/editor/${openSingleTemplate?.image?.id}`}
              className="bg-btn-primary text-white px-4 py-2 rounded-md mr-2 "
            >
              <span className="flex justify-between items-center ">
                {/* <AiOutlinePlus style={{ marginRight: "0.5em" }} /> */}
                {t("edit")}
              </span>
            </Link>
          </div>

          <div className="mb-4">
            <Box
              sx={{
                ...darkModeColors,
                "& .MuiTabs-indicator": {
                  height: "100%",
                  borderRadius: "5px",
                },
                "& .Mui-selected": {
                  color: "white !important",
                  zIndex: "1",
                },
              }}
              className={`w-full rounded-lg overflow-hidden ${
                !themeBgImg
                  ? currentMode === "dark"
                    ? "bg-[#1c1c1c]"
                    : "bg-[#EEEEEE]"
                  : currentMode === "dark"
                  ? "blur-bg-dark"
                  : "blur-bg-light"
              } `}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="variant"
                className="w-full m-1"
              >
                {/* <Tab label={t("edit_landing_page")?.toUpperCase()} /> */}
                <Tab label={t("landing_page_settings")?.toUpperCase()} />
              </Tabs>
            </Box>

            <div className="mt-3 pb-3">
              {/* <TabPanel value={value} index={0}>
                <GrapesJSEditor />
              </TabPanel> */}
              <TabPanel value={value} index={0}>
                <FunnelSettings />
              </TabPanel>
            </div>
          </div>

          <div className="w-full">
            <iframe
              className="html-content-container w-full h-[80vh]  overflow-y-auto overflow-x-hidden"
              sandbox="allow-same-origin allow-scripts"
              // srcDoc={DOMPurify.sanitize(template?.html)}
              srcDoc={`<html><head><style>${DOMPurify.sanitize(
                data?.css || ""
              )}</style></head><body>${DOMPurify.sanitize(
                data?.html || ""
              )}</body></html>`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </Modal>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default SingleTemplateModal;
