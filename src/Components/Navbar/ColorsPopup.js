import { Box, Container } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const colors = [
  'rgb(255, 165, 0)', // Orange
  'rgb(165, 42, 42)', // Brown
  'rgb(0, 128, 0)',   // Green
  'rgb(18, 69, 168)',   // Blue
  'rgb(255, 0, 0)',   // Red
  'rgb(255, 255, 0)', // Yellow
  'rgb(128, 128, 128)', // Grey
  'rgb(255, 165, 0)', // Orange (again)
  'rgb(255,105,180)', // Pink
  'rgb(128, 0, 128)',  // Purple
  'rgb(0, 128, 128)',  // Teal
  'rgb(0, 255, 255)'   // Cyan
];

const ColorsPopup = () => {
    const {setPrimaryColor} = useStateContext();
    return (

      <Container
        sx={{ maxHeight: 500, width: 280, position: "relative" }}
        >
        <Box className="mx-auto place-items-center grid grid-cols-5 gap-y-5">
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