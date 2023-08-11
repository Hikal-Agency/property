import { useStateContext } from "../../context/ContextProvider";
import {
    Modal,
    Backdrop,
    IconButton,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import AddLeadComponent from "../Leads/AddLeadComponent";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const AddLeadModal = ({
    addLeadModalOpen, 
    handleCloseAddLeadModal, 
    FetchLeads
}) => {
    const {currentMode} = useStateContext();

  return (
    <>
      <Modal
        keepMounted
        open={addLeadModalOpen}
        onClose={() => handleCloseAddLeadModal()}
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
          className={`w-[calc(100%-20px)] h-[60%] overflow-y-scroll md:w-[80%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => handleCloseAddLeadModal()}
          >
            <IoMdClose size={18} />
          </IconButton>

          <AddLeadComponent FetchLeads={FetchLeads}/>
        </div>
      </Modal>
    </>
  );
};

export default AddLeadModal;
