import { Box } from "@mui/material";
import { useStateContext } from "../../../context/ContextProvider";
import { QRCodeCanvas } from "qrcode.react";

const QRCode = ({ qr }) => {
  const { currentMode } = useStateContext();
  return (
    <>
      <div className="h-[90vh] px-4 items-center w-[98%] bg-[#F6F6F6] rounded-lg flex justify-evenly">
        <Box sx={{
            "& ol li": {
                marginBottom: "12px", 
                listStyleType: "decimal"
            }, 
            "& ol": {
                marginLeft: '20px'
            }
        }}>
            <h1
              style={{
                color: currentMode === "dark" ? "white" : "black",
                fontSize: 28,
                marginBottom: 32,
              }}
            >
              <strong>Use Whatsapp from CRM</strong>
            </h1>
            <ol>
                <li>Open WhatsApp on your phone</li>
                <li>Tap <strong>Menu</strong> or <strong>Settings</strong> and select <strong>Linked Devices</strong></li>
                <li>Tap on <strong>Link a device</strong></li>
                <li>Point your Phone this screen to scan <strong>QR Code</strong></li>
            </ol>
        </Box>
        <Box className="p-2 bg-white border">
          <QRCodeCanvas
            style={{ width: 190, height: 190, margin: "0 auto" }}
            value={qr}
          />
        </Box>
      </div>
    </>
  );
};

export default QRCode;
