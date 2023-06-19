import { Avatar, Box } from "@mui/material";

const ConversationItem = () => {
    return (
        <Box className="w-full py-1 px-3 flex items-center justify-between">
            <Box className="flex items-center">
                <Avatar className="mr-2">
                    R
                </Avatar>
            </Box>
        </Box>
    );
}

export default ConversationItem;