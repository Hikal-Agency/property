import { Box, Container } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const colors = [
  'rgb(218,31,38)', // Main color
  'rgb(20, 77, 186)', // Dark blue
  'rgb(101, 176, 207)', // Light blue
  'rgb(128, 61, 191)',   // Purple
  'rgb(38, 145, 68)',   // Green
  'rgb(233, 65, 150)',   // Hotpink
  'rgb(51, 196, 160)', // Greenish Blue
  'rgb(229, 124, 0)', // Dark yellow
  'rgb(247, 193, 52)', // Light yellow
];

const ColorsPopup = ({handleClose}) => {
    const {setPrimaryColor} = useStateContext();
    return (

      <Container   
      className="py-4"
      onMouseLeave={handleClose}
      
        sx={{ maxHeight: 500, width: 280, position: "relative" }}
        >
        <Box className="mx-auto py-4 place-items-center grid grid-cols-5 gap-y-5">
        {colors.map((color) => (
            <div style={{
                background: color
            }} onClick={() => setPrimaryColor(color)} className={`w-[35px] rounded-full h-[35px] cursor-pointer border-4 border-white shadow`}>
            </div>
        ))}
        </Box>
      </Container>
    );
}


export default ColorsPopup;