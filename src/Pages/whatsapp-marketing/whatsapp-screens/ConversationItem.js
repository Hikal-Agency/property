import { Avatar, Box } from "@mui/material";

const ConversationItem = () => {
  return (
    <Box className="w-full bg-[#e9e9e9] px-4 py-3 flex items-center justify-between">
      <Box className="flex items-center">
        <Avatar sx={{ width: 32, height: 32 }} className="mr-3">
          R
        </Avatar>
        <Box>
          <p className="mb-0">
            <strong>Sophia</strong>
          </p>
        <p className="text-gray-400"><small>You: Yep! It..</small></p>
        </Box>
      </Box>
      <Box>
        <p className="text-gray-400"><small>a few seconds ago</small></p>
      </Box>
    </Box>
  );
};

export default ConversationItem;
