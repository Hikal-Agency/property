
import {
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

import { BiSupport, BiMailSend } from "react-icons/bi"; 
import { BsWhatsapp } from "react-icons/bs";
import { MdVideoCameraFront } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";

const CreateTicket = () => {
  const { currentMode, darkModeColors } = useStateContext();

  return (
    <div className={`${currentMode === "dark" ? "text-white" : "text-black"} w-full h-full rounded-md p-5`}>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5">
        <div className={`${currentMode === "dark" ? "bg-black" : "bg-white"} rounded-md space-3 p-7`}>
          <h3 className="mb-3 font-semibold text-main-red-color text-center">Ticket Details</h3>
          <hr className="mb-5"></hr>

          <Box sx={darkModeColors}>
            {/* TICKET CATEGORY  */}
            <FormControl fullWidth>
              <InputLabel>Ticket Category</InputLabel>
              <Select
                label="Ticket Category"
                size="medium"
                className="w-full mb-5"
                required
              >
                <MenuItem value={null}>- - -</MenuItem>
                <MenuItem value={"1"}>1</MenuItem>
                <MenuItem value={"2"}>2</MenuItem>
              </Select>
            </FormControl>

            {/* TICKET DESCRIPTION  */}
            <TextField
              id="ticket"
              type={"text"}
              label="Ticket Description"
              className="w-full mb-5"
              style={{ marginBottom: "20px"}}
              variant="outlined"
              size="medium"
              value=""
            />

            {/* SUPORT VIA  */}
            <FormControl fullWidth>
              <InputLabel>Support Source</InputLabel>
              <Select
                label="Support Source"
                size="medium"
                className="w-full mb-5"
                required
              >
                <MenuItem value={null}>- - -</MenuItem>
                <MenuItem value={"Email"}>Email</MenuItem>
                <MenuItem value={"Video Call"}>Video Call</MenuItem>
                <MenuItem value={"Phone Call"}>Phone Call</MenuItem>
                <MenuItem value={"WhatsApp Chat"}>WhatsApp Chat</MenuItem>
              </Select>
            </FormControl>
            <Button 
              type="submit"
              size="medium"
              className="bg-main-red-color w-full text-white rounded-lg py-3 font-semibold mb-3"
              style={{ backgroundColor: "#da1f26", color: "#ffffff"}}
            >
              SUBMIT
            </Button>
          </Box>
        </div>
        <div className="space-3 p-1 sm:pb-1 sm:pt-5 md:pb-1 md:pt-5 lg:pb-3 lg:pt-5 xl:p-5">
          <h3 className="mb-3 font-semibold text-main-red-color text-center">24x7 Real-time Support</h3>
          <h6 className="mb-3 text-center">Need help with our system? Contact our support team or create ticket for prompt assistance.</h6>
          {/* <h6 className="mb-3 text-center">For any questions or issues related to our website or services, please feel free to contact our friendly support team at support@hikalcrm.com, and we will do our best to assist you as soon as possible.</h6> */}
          <hr className="mb-5"></hr>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-3">
            {/* EMAIL  */}
            <div className={`${currentMode === "dark" ? "bg-black" : "bg-white"} rounded-lg p-3`}>
              <div className="gap-2">
                <div className="flex justify-center mb-2">
                  <BiMailSend
                    size={"50"}
                    color={"#ffffff"} 
                    className="bg-main-red-color p-3 rounded-full"
                  />
                </div>
                <h3 className="flex justify-center flex-wrap">Support via Email</h3>
              </div>
            </div>
            {/* PHONE  */}
            <div className={`${currentMode === "dark" ? "bg-black" : "bg-white"} rounded-lg p-3`}>
              <div className="gap-2 text-center">
                <div className="flex justify-center mb-2">
                  <BiSupport
                    size={"50"}
                    color={"#ffffff"} 
                    className="bg-main-red-color p-3 rounded-full"
                  />
                </div>
                <h3 className="col-span-3">Support via Call</h3>
              </div>
            </div>
            {/* WHATSAPP CHAT  */}
            <div className={`${currentMode === "dark" ? "bg-black" : "bg-white"} rounded-lg p-3`}>
              <div className="gap-2 text-center">
                <div className="flex justify-center mb-2">
                  <BsWhatsapp
                    size={"50"}
                    color={"#ffffff"} 
                    className="bg-main-red-color p-3 rounded-full"
                  />
                </div>
                <h3 className="col-span-3">Support via WhatsApp</h3>
              </div>
            </div>
            {/* VIDEO CALL */}
            <div className={`${currentMode === "dark" ? "bg-black" : "bg-white"} rounded-lg p-3`}>
              <div className="gap-2 text-center">
                <div className="flex justify-center mb-2">
                  <MdVideoCameraFront
                    size={"50"}
                    color={"#ffffff"} 
                    className="bg-main-red-color p-3 rounded-full"
                  />
                </div>
                <h3 className="col-span-3">Support via Video Call</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
