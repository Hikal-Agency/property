import {Avatar, Box} from "@mui/material";

const TemplatesCountCard = ({count, type, icon})=> {
    return (<>
            <Box className="relative p-3 w-[30%] rounded shadow-lg border border-gray-500 flex flex-col justify-between">
                <h4 className="mb-4 font-bold" style={{fontSize: 22}}>{count}</h4>
                <p>{type}</p>
                <Box sx={{position: "absolute", right: 12, top: 12}}>
                    <Avatar>{icon}</Avatar>
                </Box>
            </Box>
    </>);
}

export default TemplatesCountCard;