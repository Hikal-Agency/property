import { Box } from "@mui/material";

const AllMessagesItem = ({content}) => {
    return (
        <>
    <Box
      className="rounded py-2 px-4 text-white mb-2"
      style={{background: "#575757"}}
    >
      <Box className="flex justify-between font-bold" style={{ fontSize: 14 }}>
        <strong style={{fontSize: 18}}>+{content.msg_from}</strong>
        <span>{content.created_at}</span>
      </Box>
      <Box className="border p-3 rounded my-3">{content.message}</Box>
      <p>Recipient: <b><i>+{content.msg_to}</i></b></p>
    </Box>
        </>
    );
}

export default AllMessagesItem;