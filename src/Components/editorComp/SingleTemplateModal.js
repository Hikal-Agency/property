import { Backdrop, Box, IconButton, Modal, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { MdClose } from "react-icons/md";
import GrapesJSEditor from "./GrapesJSEditor";
import FunnelSettings from "./FunnelSettings";

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
          <div className="w-full flex items-center pb-3 ">
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
              Landing Page
            </h1>
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
                <Tab label={t("edit_landing_page")?.toUpperCase()} />
                <Tab label={t("landing_page_settings")?.toUpperCase()} />
              </Tabs>
            </Box>

            <div className="mt-3 pb-3">
              <TabPanel value={value} index={0}>
                <GrapesJSEditor />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <FunnelSettings />
              </TabPanel>
            </div>
          </div>

          {!value && (
            <div className="w-full">
              <img
                src={openSingleTemplate?.image}
                alt="overlay"
                className="h-[70vh] w-[90vw]"
              />
              <img
                src={hikalrewhite}
                alt="hikal real estate"
                className="absolute right-4 bottom-4 w-[100px] p-2 bg-[#000000] bg-opacity-70"
              />
            </div>
          )}
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
