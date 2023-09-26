import { useStateContext } from "../../context/ContextProvider";
import {
  Modal,
  Backdrop, Box,
  TextField
} from "@mui/material";
import moment from "moment";
import { FaSms } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const typeIcon = {
  sms: <FaSms color="#aaaaaa" size={22} />,
  whatsapp: <RiWhatsappFill color="#aaaaaa" size={22} />,
};

const SingleSMSModal = ({
  smsModalOpen,
  handleLeadModelClose,

  singleMsg,
}) => {
  console.log("sms details: ", singleMsg);
  const { currentMode, darkModeColors } = useStateContext();

  return (
    <>
      <Modal
        keepMounted
        open={smsModalOpen}
        onClose={() => handleLeadModelClose()}
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
          className={`w-[calc(100%-20px)] h-[40%] overflow-y-scroll md:w-[40%] border-2 border-solid shadow-lg  ${
            currentMode === "dark"
              ? "bg-black border-[#1C1C1C]"
              : "bg-white border-[#EEEEEE]"
          } absolute top-1/2 left-1/2 p-4 rounded-md`}
        >
          {/* <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => handleLeadModelClose()}
          >
            <IoMdClose size={18} />
          </IconButton> */}
          <div className="mx-auto">
            <div className="w-full flex items-center justify-between py-1 mb-6">
              <div className="flex items-center justify-between">
                <h1
                  className={`text-lg bg-[#DA1F26] p-2 font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {singleMsg?.sender || "No Sender"}
                </h1>
                <h2
                  className={`text-lg ml-3 font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {singleMsg?.user_name}
                </h2>
              </div>
              <div
                className={`flex items-center justify-between gap-4 ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                {moment(singleMsg?.date).format("YYYY-MM-DD HH:MM:SS ")}
                {typeIcon[singleMsg?.type]}
              </div>
            </div>

            <div className="px-5">
              <Box sx={darkModeColors}>
                <h4
                  className={`${
                    currentMode === "dark" ? "text-[#EEEEEE]" : "text-[#1C1C1C]"
                  }  font-semibold pb-4`}
                >
                  Message
                </h4>

                <TextField
                  id="Manager"
                  placeholder="Recipients"
                  multiline
                  minRows={2}
                  value={singleMsg?.message || "No Message"}
                  size="small"
                  className="w-full p-2"
                  displayEmpty
                />
              </Box>

              <div className="my-3 mt-7">
                <Box sx={darkModeColors}>
                  <div className="flex items-center justify-between">
                    <h4
                      className={`${
                        currentMode === "dark"
                          ? "text-[#EEEEEE]"
                          : "text-[#1C1C1C]"
                      }  font-semibold pb-4`}
                    >
                      Recipients
                    </h4>
                    <h4
                      className={`${
                        currentMode === "dark"
                          ? "text-[#EEEEEE]"
                          : "text-[#1C1C1C]"
                      }  font-semibold pb-4`}
                    >
                      {singleMsg?.recipientCount}
                    </h4>
                  </div>

                  <TextField
                    id="Manager"
                    label="Message"
                    size="small"
                    minRows={3}
                    value={singleMsg?.recipients || "No recipients"}
                    className="w-full p-2"
                    displayEmpty
                    multiline
                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SingleSMSModal;
