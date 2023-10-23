import { Box, Container, IconButton } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { BsCheck } from "react-icons/bs";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import {BiBlock} from "react-icons/bi";

const colors = [
  "rgb(218,31,38)", // Main color
  "rgb(20, 77, 186)", // Dark blue
  "rgb(101, 176, 207)", // Light blue
  "rgb(128, 61, 191)", // Purple
  "rgb(38, 145, 68)", // Green
  "rgb(233, 65, 150)", // Hotpink
  "rgb(51, 196, 160)", // Greenish Blue
  "rgb(229, 124, 0)", // Dark yellow
  "rgb(247, 193, 52)", // Light yellow
];

const images = [
  "https://images.unsplash.com/photo-1554034483-04fda0d3507b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
  "https://images.unsplash.com/photo-1620503374956-c942862f0372?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1572039863446-dd69ee840291?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzZ8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1520052205864-92d242b3a76b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhbGxwYXBlciUyMGxhbmRzY2FwZSUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",

  "https://images.unsplash.com/photo-1613375920388-f1f70f341f8a?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c29saWQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1531685250784-7569952593d2?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1448067686092-1f4f2070baae?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGJhY2tncm91bmR8ZW58MHwwfDB8fHww", 
  "https://images.unsplash.com/photo-1507608158173-1dcec673a2e5?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJhY2tncm91bmR8ZW58MHwwfDB8fHww",
  "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJhY2tncm91bmR8ZW58MHwwfDB8fHww",

  //"https://www.bsr.org/images/heroes/bsr-focus-nature-hero.jpg", 
  //"https://s1.1zoom.me/big3/695/Mountains_Lake_Canada_Scenery_Parks_Alberta_574417_6144x4097.jpg", 
  //"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", 
  //"https://images.unsplash.com/photo-1414872785488-7620d2ae7566?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
];

const ColorsPopup = ({ handleClose }) => {
  const { setPrimaryColor, primaryColor, currentMode, BACKEND_URL, User, setThemeBgImg } =
    useStateContext();

  const handleSelectTheme = async (color) => {
    setPrimaryColor(color);
    const token = localStorage.getItem("auth-token");
    try {
      await axios.post(
        `${BACKEND_URL}/updateuser/${User.id}`,
        JSON.stringify({
          theme: color
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };


  const handleSelectBgImg = async (bgImg) => {
    setThemeBgImg(bgImg);
    const token = localStorage.getItem("auth-token");
    try {
      await axios.post(
        `${BACKEND_URL}/updateuser/${User.id}`,
        JSON.stringify({
          backgroundImg: bgImg || "default"
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  return (
    <Container
      onMouseLeave={handleClose}
      sx={{ width: "100%", position: "relative" }}
    >
      <Box className="mx-auto py-4 place-items-center grid grid-cols-5 gap-y-5">
        {colors.map((color) => (
          <div
            style={{
              background: color,
            }}
            onClick={() => handleSelectTheme(color)}
            className={`w-[35px] relative rounded-full h-[35px] cursor-pointer border-4 border-white shadow`}
          >
            {primaryColor === color && (
              <Box
                sx={{
                  "& svg": {
                    color: currentMode === "dark" ? "black" : "white",
                  },
                }}
                className={`absolute rounded-full -top-[4px] -right-[4px] ${
                  currentMode === "dark" ? "bg-white" : "bg-black"
                }`}
              >
                <BsCheck size={18} />
              </Box>
            )}
          </div>
        ))}

      </Box>
        <div className="my-4 mx-auto place-items-center grid grid-cols-5 gap-y-5">
        <div>
            <IconButton onClick={() => handleSelectBgImg("")}>
              <BiBlock size={18}/>
            </IconButton>
        </div>
            {images?.map((image) => <div onClick={() => handleSelectBgImg(image)} className="cursor-pointer rounded-md w-[40px] h-[40px]" style={{
              backgroundImage: `url(${image})`, 
              backgroundRepeat: "no-repeat", 
              backgroundSize: "cover"
            }}>
            </div>)}
        </div>
    </Container>
  );
};

export default ColorsPopup;
