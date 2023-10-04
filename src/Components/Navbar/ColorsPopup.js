import { Box, Container } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { BsCheck } from "react-icons/bs";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";

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
  "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1834&q=80",
  "https://images.unsplash.com/photo-1682685797365-41f45b562c0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1554034483-04fda0d3507b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
  "https://images.unsplash.com/photo-1620503374956-c942862f0372?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://www.bsr.org/images/heroes/bsr-focus-nature-hero.jpg", 
  "https://s1.1zoom.me/big3/695/Mountains_Lake_Canada_Scenery_Parks_Alberta_574417_6144x4097.jpg", 
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", 
  "https://images.unsplash.com/photo-1414872785488-7620d2ae7566?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
            {images?.map((image) => <div onClick={() => setThemeBgImg(image)} className="cursor-pointer rounded-md w-[40px] h-[40px]" style={{
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
