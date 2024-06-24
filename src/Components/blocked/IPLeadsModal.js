import { useEffect, useState } from "react";
import { Modal, Backdrop, IconButton, Box, CircularProgress } from "@mui/material";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";
import IPLead from "./IPLead";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const IPLeadsModal = ({ blockIPModalOpened, handleCloseIPModal, ip }) => {
  const { 
    currentMode, 
    BACKEND_URL, 
    t,
    isLangRTL,
    i18n,
  } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseIPModal();
    }, 1000);
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(`${BACKEND_URL}/search?ip=${ip}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setLeads(result.data?.result?.data);
    } catch (error) {
      console.log(error);
      toast.error("Leads couldn't be fetched", {
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
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);
  return (
    // <Modal
    //   keepMounted
    //   open={blockIPModalOpened}
    //   onClose={() => ()}
    //   aria-labelledby="keep-mounted-modal-title"
    //   aria-describedby="keep-mounted-modal-description"
    //   closeAfterTransition
    //   BackdropComponent={Backdrop}
    //   BackdropProps={{
    //     timeout: 500,
    //   }}
    // >
    <Modal
      keepMounted
      open={blockIPModalOpened}
      onClose={handleClose}
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
      w-[100vw] h-[100vh] flex items-start justify-end`}
      >
        <button
          // onClick={handleLeadModelClose}
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
          } ${isLangRTL(i18n.language) 
            ? (currentMode === "dark" && "border-r-2 border-primary") 
            : (currentMode === "dark" && "border-l-2 border-primary")}
            p-4 h-[100vh] w-[80vw] overflow-y-scroll
          `}
        >
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
                <CircularProgress size={28}/>
            </div>
          ) : (
            <div className="">
              <div className="w-full flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("leads_for_ip")}
                  <span className="bg-primary p-2 mx-2 rounded-md text-white font-bold">{ip}</span>
                </h1>
              </div>
              <div className="flex flex-col gap-5 p-4">
                {leads?.map((lead) => {
                  return <IPLead lead={lead}/>;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default IPLeadsModal;
