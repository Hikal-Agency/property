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
  "rgb(229, 124, 0)", // Orange
  "rgb(247, 193, 52)", // Yellow
];

const solidColors = [
  {
    "#FFB4B7": {
      theme: "light",
    }
  },
  {
    "#849DD2": {
      theme: "light",
    }
  },
  {
    "#BCDAE8": {
      theme: "light",
    }
  },
  {
    "#B130D0": {
      theme: "light",
    }
  },
  {
    "#A4D3B4": {
      theme: "light",
    }
  },
  {
    "#F996C5": {
      theme: "light",
    }
  },
  {
    "#A3E2CE": {
      theme: "light",
    }
  },
  {
    "#FFD08C": {
      theme: "light",
    }
  },
  {
    "#FFEDBE": {
      theme: "light",
    }
  },
]; 

const images = [
  {
    "blue_pink": {
      bg: "https://images.unsplash.com/photo-1554034483-04fda0d3507b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      theme: "light",
    }
  },
  {
    "blue_ocean": {
      bg: "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      theme: "light",
    }
  },
  {
    "mint_orange": {
      bg: "https://images.unsplash.com/photo-1620503374956-c942862f0372?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      theme: "light",
    }
  },
  {
    "pink_black": {
      bg: "https://images.unsplash.com/photo-1520052205864-92d242b3a76b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhbGxwYXBlciUyMGxhbmRzY2FwZSUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
      theme: "",
    }
  },
  {
    "blue_teal": {
      bg: "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
      theme: "dark",
    }
  },
  {
    "pink_pink": {
      bg: "https://images.unsplash.com/photo-1503455637927-730bce8583c0?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29saWQlMjBiYWNrZ3JvdW5kfGVufDB8MHwwfHx8MA%3D%3D",
      theme: "light",
    }
  },
  {
    "black_aurora": {
      bg: "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8",
      theme: "dark",
    }
  },
];

const ColorsPopup = ({ handleClose }) => {
  const { setPrimaryColor, primaryColor, currentMode, BACKEND_URL, User, setThemeBgImg, setCurrentMode } =
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


  const handleSelectBgImg = async (bgImg, theme) => {
    setThemeBgImg(bgImg);

    if (theme !== "") {
      setCurrentMode(theme);
    }

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
              <BiBlock size={18} color={currentMode === "dark" ? "#EEEEEE" : "#1C1C1C"} />
            </IconButton>
          </div>
          {/* {images?.map((image) => 
            <div onClick={() => handleSelectBgImg(image)} className="cursor-pointer rounded-md w-[40px] h-[40px]" style={{
              backgroundImage: `url(${image})`, 
              backgroundRepeat: "no-repeat", 
              backgroundSize: "cover"
            }}>
            </div>
          )} */}

          {images?.map((image, index) => {
            const imagei = Object.keys(image)[0];
            const imageLink = image[imagei].bg;
            const imageTheme = image[imagei].theme;

            return (
              <div 
                key={index}
                onClick={() => handleSelectBgImg(imageLink, imageTheme)} 
                className="cursor-pointer rounded-md w-[40px] h-[40px]" 
                style={{
                  backgroundImage: `url(${imageLink})`, 
                  backgroundRepeat: "no-repeat", 
                  backgroundSize: "cover",
                }}
              >
              </div>
            )
          })}
        </div>

        {/* <div className="my-4 mx-auto place-items-center grid grid-cols-5 gap-y-5">
            {solidColors?.map((color) => <div onClick={() => handleSelectBgImg(color)} className="cursor-pointer rounded-md w-[35px] h-[35px]" style={{
              backgroundColor: color, 
            }}>
            </div>)}
        </div> */}

        <div className="my-4 mx-auto place-items-center grid grid-cols-5 gap-y-5">
          {solidColors?.map((colorObject, index) => {
            const colorHex = Object.keys(colorObject)[0];
            const colorTheme = colorObject[colorHex].theme;

            return (
              <div
                key={index}
                onClick={() => handleSelectBgImg(colorHex, colorTheme)}
                className="cursor-pointer rounded-md w-[35px] h-[35px]"
                style={{
                  backgroundColor: colorHex,
                }}
              >
              </div>
            );
          })}
        </div>

    </Container>
  );
};

export default ColorsPopup;
