import { Avatar, Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const TemplatesCountCard = ({ count, type, icon }) => {
  const {
    primaryColor,
    currentMode,
    themeBgImg
  } = useStateContext();
  return (
    <>
      <Box
        style={{
          minWidth: "24%",
        }}
        className={`${
          !themeBgImg 
          ? (currentMode === "dark" ? "bg-[#1C1C1C] text-white" : "bg-[#EEEEEE] text-black") 
          : (currentMode === "dark" ? "blur-bg-dark text-white" : "blur-bg-light text-black")
        }
        relative p-4 rounded-xl card-hover shadow-sm flex flex-col justify-between`}
      >
        <div className="flex justify-between items-center gap-2">
          <h4 className="font-bold" style={{ fontSize: 22 }}>
            {count}
          </h4>
          <Avatar sx={{
            background: currentMode === "dark" ? "#000000" : "#FFFFFF", 
            width: "32px", 
            height: '32px',
            color: primaryColor,
          }}>
            {icon}
          </Avatar>
        </div>
        <p className="my-1">{type}</p>
      </Box>
    </>
  );
};

export default TemplatesCountCard;
