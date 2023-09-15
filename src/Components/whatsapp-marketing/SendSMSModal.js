import { useStateContext } from "../../context/ContextProvider";
import { Modal, Backdrop, IconButton } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import AddLeadComponent from "../Leads/AddLeadComponent";
import BulkSMSModal from "./BulkSMSModal";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const SendSMSModal = ({
  sendSMSModal,
  handleSMSModelClose,
  FetchLeads,
  fromRange,
  toRange,
  rangeData,
  setRangeData,
  setFromRange,
  setToRange,
  setSendSMSModal,
}) => {
  console.log("sms range dat: ", rangeData);
  const { currentMode } = useStateContext();

  return (
    <>
      <Modal
        keepMounted
        open={sendSMSModal}
        onClose={() => handleSMSModelClose()}
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
          className={`w-[calc(100%-20px)] h-[66%] overflow-y-scroll md:w-[50%] border-2 border-solid shadow-lg  ${
            currentMode === "dark"
              ? "bg-black border-[#1C1C1C]"
              : "bg-white border-[#EEEEEE]"
          } absolute top-1/2 left-1/2 p-4 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => handleSMSModelClose()}
          >
            <IoMdClose size={18} />
          </IconButton>

          <BulkSMSModal
            FetchLeads={FetchLeads}
            fromRange={fromRange}
            toRange={toRange}
            rangeData={rangeData}
            setRangeData={setRangeData}
            setSendSMSModal={setSendSMSModal}
            sendSMSModal={sendSMSModal}
            setFromRange={setFromRange}
            setToRange={setToRange}
          />
        </div>
      </Modal>
    </>
  );
};

export default SendSMSModal;
