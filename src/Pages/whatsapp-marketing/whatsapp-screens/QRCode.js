import { Box } from "@mui/material";
import { useStateContext } from "../../../context/ContextProvider";
import { QRCodeCanvas } from "qrcode.react";

const QRCode = ({ qr }) => {
  const { currentMode } = useStateContext();
  return (
    <>
      <div className="h-[60vh] flex flex-col justify-center pt-8 text-center">
        <h1
          style={{
            color: currentMode === "dark" ? "white" : "black",
            fontWeight: "bold",
            fontSize: 26,
            marginBottom: 25,
          }}
        >
          Go to Whatsapp and Scan this QR
        </h1>
        <Box className="p-1 bg-white rounded">
          <QRCodeCanvas
            style={{ width: 170, height: 170, margin: "0 auto" }}
            value={qr}
          />
        </Box>
      </div>
    </>
  );
};

export default QRCode;
