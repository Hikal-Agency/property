import { Box, Container, IconButton } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { BsCheck } from "react-icons/bs";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import {BiBlock} from "react-icons/bi";

const colors = [
  "rgb(218,31,38)", // Main color
  "rgb(20, 77, 186)", // Dark blue
  "rgb(38, 145, 68)", // Green
  "rgb(128, 61, 191)", // Purple
  "rgb(233, 65, 150)", // Hotpink
  "rgb(101, 176, 207)", // Light blue
  "rgb(51, 196, 160)", // Greenish Blue
  "rgb(229, 124, 0)", // Orange
];

const solidColors = [
  { //red
    "#F3D5DD": {
      theme: "light",
      primary: "rgb(218,31,38)",
    }
  },
  { //cool-skyblue
    "#94BFD0": {
      theme: "light",
      primary: "rgb(20, 77, 186)",
    }
  },
  { //earth-pale-green
    "#BFD3C1": {
      theme: "light",
      primary: "rgb(38, 145, 68)",
    }
  },
  { //pastel-lavender
    "#D5DDF3": {
      theme: "light",
      primary: "rgb(128, 61, 191)",
    }
  },
  { //earth-beige
    "#F4E1C1": {
      theme: "light",
      primary: "rgb(229, 124, 0)",
    }
  },

  { //red
    "#4d0b0e": {
      theme: "dark",
      primary: "rgb(218,31,38)",
    }
  },
  { //blue
    "#001F3F": {
      theme: "dark",
      primary: "rgb(20, 77, 186)",
    }
  },
  { //green
    "#003300": {
      theme: "dark",
      primary: "rgb(38, 145, 68)"
    }
  },
  { //purple
    "#2E0854": {
      theme: "dark",
      primary: "rgb(128, 61, 191)",
    }
  },
  { //pink
    "#4d1532": {
      theme: "dark",
      primary: "rgb(233, 65, 150)",
    }
  },

  // { //red
  //   "#ffbaba": {
  //     theme: "light",
  //     primary: "rgb(218,31,38)",
  //   }
  // },
  // { //blue
  //   "#849DD2": {
  //     theme: "light",
  //     primary: "rgb(20, 77, 186)",
  //   }
  // },
  // { //green
  //   "#A4D3B4": {
  //     theme: "light",
  //     primary: "rgb(38, 145, 68)",
  //   }
  // },
  // { //purple
  //   "#D7A1F9": {
  //     theme: "light",
  //     primary: "rgb(128, 61, 191)",
  //   }
  // },
  // { //pink
  //   "#F996C5": {
  //     theme: "light",
  //     primary: "rgb(233, 65, 150)",
  //   }
  // },
  // { //sky blue
  //   "#BCDAE8": {
  //     theme: "light",
  //     primary: "rgb(101, 176, 207)",
  //   }
  // },
  // { //mint
  //   "#A3E2CE": {
  //     theme: "light",
  //     primary: "rgb(51, 196, 160)",
  //   }
  // },
  // { //orange
  //   "#FFD08C": {
  //     theme: "light",
  //     primary: "rgb(229, 124, 0)",
  //   }
  // },
]; 

const images = [
  { //red
    "pink_pink": {
      bg: "https://images.unsplash.com/photo-1503455637927-730bce8583c0?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29saWQlMjBiYWNrZ3JvdW5kfGVufDB8MHwwfHx8MA%3D%3D",
      theme: "light",
      primary: "rgb(218,31,38)",
    }
  },
  { //blue
    "blue_ocean": {
      bg: "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      theme: "light",
      primary: "rgb(20, 77, 186)",
    }
  },
  { //green
    "green_black_code": {
      bg: "https://images.unsplash.com/photo-1538438253612-287c9fc9217e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      theme: "light",
      primary: "rgb(38, 145, 68)",
    }
  },
  { //purple
    "orange_black_bridge": {
      bg: "https://images.unsplash.com/photo-1464692805480-a69dfaafdb0d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      theme: "light",
      primary: "rgb(128, 61, 191)",
    }
  },
  { //pink
    "pink_black": {
      bg: "https://images.unsplash.com/photo-1520052205864-92d242b3a76b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhbGxwYXBlciUyMGxhbmRzY2FwZSUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
      theme: "light",
      primary: "rgb(233, 65, 150)",
    }
  },
  { //skyblue
    "blue_teal": {
      bg: "https://images.unsplash.com/photo-1508108712903-49b7ef9b1df8?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      theme: "light",
      primary: "rgb(101, 176, 207)",
    }
  },
  { //mint
    "black_aurora": {
      bg: "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8",
      theme: "dark",
      primary: "rgb(51, 196, 160)",
    }
  },
  { //orange
    "mint_orange": {
      bg: "https://images.unsplash.com/photo-1620503374956-c942862f0372?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      theme: "light",
      primary: "rgb(229, 124, 0)",
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


  const handleSelectBgImg = async (bgImg, theme, primary) => {
    setThemeBgImg(bgImg);

    if (theme !== "") {
      setCurrentMode(theme);
    }

    if (primary !== "") {
      // setPrimaryColor(primary);
      handleSelectTheme(primary)
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
            <IconButton onClick={() => handleSelectBgImg("", "light", "rgb(218,31,38)")}>
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
            const imagePrimary = image[imagei].primary;

            return (
              <div 
                key={index}
                onClick={() => handleSelectBgImg(imageLink, imageTheme, imagePrimary)} 
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
            const colorPrimary = colorObject[colorHex].primary;

            return (
              <div
                key={index}
                onClick={() => handleSelectBgImg(colorHex, colorTheme, colorPrimary)}
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
