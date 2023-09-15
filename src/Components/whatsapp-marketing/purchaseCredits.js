import { CircularProgress, Modal, Backdrop, Button } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import {HiCreditCard} from "react-icons/hi";
import Checkout from "./Checkout";


const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const PurchaseCreditsModal = ({
  purchaseCreditsModal, 
  handleClose,
}) => {
  const { currentMode, fetchSidebarData, BACKEND_URL } = useStateContext();

  return (
    <Modal
      keepMounted
      open={purchaseCreditsModal}
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
        style={style}
        className={`w-[calc(100%-20px)] md:w-[40%]  ${
          currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 rounded-md`}
      >
       
       <div className="flex flex-col justify-center items-center mb-4">
          <HiCreditCard size={50} className="text-main-red-color text-2xl" />
          <h1 className="font-semibold pt-2 text-lg">
              Purchase Credits
          </h1>
        </div>

        <Checkout/>

        
      </div>
    </Modal>
  );
};

export default PurchaseCreditsModal;
