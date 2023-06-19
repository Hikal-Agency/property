import { Avatar, Box } from "@mui/material";

const ConversationItem = ({phoneNumber}) => {
  return (
    <Box className="w-full bg-[#e9e9e9] px-4 py-3 flex items-center justify-between">
      <Box className="flex items-center">
        <Avatar sx={{ width: 36, height: 36 }} className="mr-3">
          92
        </Avatar>
        <Box>
          <p className="mb-0">
            <strong>+{phoneNumber}</strong>
          </p>
        <p className="text-gray-400"><small>...</small></p>
        </Box>
      </Box>
      <Box>
        <p className="text-gray-400"><small>a few seconds ago</small></p>
      </Box>
    </Box>
  );
};

export default ConversationItem;
