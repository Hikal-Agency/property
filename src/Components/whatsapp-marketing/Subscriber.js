import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const Subscriber = ({ data }) => {
  const {currentMode} = useStateContext();
  return (
    <>
      <Box className={`p-2 rounded ${currentMode === "dark" ? 'bg-[#252525]' : 'bg-gray-300'} border-gray-500 flex items-center w-[48%] m-2`}>
        <img
          className="mr-3 rounded shadow-md"
          width={70}
          height={70}
          src={data?.profile_picture}
          alt=""
        />
        <Box className="flex flex-col justify-between w-[100%]">
          <p className="capitalize text-primary font-bold">
            {data.package_name}
          </p>
          <Box className="flex justify-between">
            <strong className={currentMode === "dark" ? 'text-white' : ''}>{data.userName}</strong>
            <strong
              style={{ color: currentMode === "dark" ? "white" : "black", paddingRight: 10 }}
              className="capitalize"
            >
              {data.nationality}
            </strong>
          </Box>
          <p style={{ color: "grey", fontWeight: "light" }}>
            {data.position ? `(${data.position})` : " "}
          </p>
        </Box>
      </Box>
    </>
  );
};

export default Subscriber;
