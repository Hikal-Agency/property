import { useEffect, useState } from "react";
import { Modal, Backdrop, IconButton, Box, CircularProgress } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";
import IPLead from "./IPLead";
import Loader from "../Loader";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const IPLeadsModal = ({ blockIPModalOpened, handleCloseIPModal, ip }) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);

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
    <Modal
      keepMounted
      open={blockIPModalOpened}
      onClose={() => handleCloseIPModal()}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div
        style={style}
        className={`w-[calc(100%-20px)] md:w-[70%] h-[70%]  ${
          currentMode === "dark" ? "bg-gray-900" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
      >
        <IconButton
          sx={{
            position: "absolute",
            right: 12,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={() => handleCloseIPModal()}
        >
          <IoMdClose size={18} />
        </IconButton>

        {loading ? <div className="w-full h-full flex items-center justify-center">
            <CircularProgress size={28}/>
        </div> :

        <div className="mt-12 h-[80%] overflow-y-scroll">
          <p className="text-2xl mb-16 text-center">Leads for IP: <span className="text-[#da1f26]">{ip}</span></p>
          {leads?.map((lead) => {
            return <IPLead lead={lead}/>;
          })}
        </div>
        }
      </div>
    </Modal>
  );
};

export default IPLeadsModal;
