import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const Subscriber = ({ data }) => {
  const {
    currentMode,
    themeBgImg
  } = useStateContext();
  return (
    <>
      <Box className={`p-2 rounded ${
          !themeBgImg ? (currentMode === "dark" ? 'bg-[#1C1C1C]' : 'bg-[#EEEEEE]')
          : (currentMode === "dark" ? 'blur-bg-dark' : 'blur-bg-light')
        } ${ currentMode === "dark" ? "text-white" : "text-black"
        } rounded-xl shadow-sm flex items-center w-[48%] p-3`}>
        <img
          className="mr-3 rounded-xl shadow-md"
          width={70}
          height={70}
          src={data?.profile_picture}
          alt=""
        />
        <Box className="flex flex-col justify-between w-[100%] gap-2">
          <p className="text-primary font-bold text-right">
            {data.package_name}
          </p>
          <p className={`${currentMode === "dark" ? 'text-white' : 'text-black'} uppercase font-bold text-lg`}>
            {data.userName}
          </p>
          <p className="text-sm font-semibold uppercase">
            {data.position ? `${data.position}` : " "}
          </p>
        </Box>
      </Box>
    </>
  );
};

export default Subscriber;
