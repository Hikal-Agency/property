import { Box } from "@mui/material";

const Subscriber = ({ data }) => {
  return (
    <>
      <Box className="p-2 rounded bg-gray-300 border-gray-500 flex items-center w-[48%] m-2">
        <img
          className="mr-3 rounded shadow-md"
          width={70}
          height={70}
          src={data.displayImg}
          alt=""
        />
        <Box className="flex flex-col justify-between w-[100%]">
          <small style={{ color: "red" }} className="capitalize">
            {data.package_name}
          </small>
          <Box className="flex justify-between">
            <strong>{data.userName}</strong>
            <strong
              style={{ color: "blue", paddingRight: 10 }}
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
