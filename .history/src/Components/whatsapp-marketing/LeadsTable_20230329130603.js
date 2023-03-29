import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SendMessageModal from "./SendMessageModal";
import { Button, Checkbox, Alert, Box } from "@mui/material";
import { AiFillMessage } from "react-icons/ai";
import { CgRemoveR } from "react-icons/cg";

export default function LeadsTable({ rows }) {
  const [selected, setSelected] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [messageModal, setMessageModal] = useState(false);

  const isChecked = (lid) => {
    return Object.keys(selected).indexOf(String(lid)) !== -1;
  };

  const handleClickCheckbox = (obj) => {
    if (selectAll) {
      setSelectAll(false);
    }
    if (Object.keys(selected).indexOf(Object.keys(obj)[0]) !== -1) {
      const selectedCopy = { ...selected };
      delete selectedCopy[Object.keys(obj)[0]];
      setSelected(selectedCopy);
    } else {
      setSelected({ ...selected, ...obj });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected({});
    } else {
      const selectedObj = {};
      rows.forEach((row) => {
        selectedObj[row.lid] = row.leadContact;
      });
      setSelected(selectedObj);
    }
    setSelectAll(!selectAll);
  };

  const handleOpenMessageModal = () => setMessageModal(true);

  return (
    <>
      <Box width={"100%"} sx={{ ...DataGridStyles, position: "relative" }}>

      </Box>




      <TableContainer component={Paper}>
        {Object.keys(selected).length > 0 && (
          <Alert sx={{ mb: 2, position: "relative", padding: "20px" }}>
            <p>{Object.keys(selected).length} items selected</p>
            <Button
              onClick={handleOpenMessageModal}
              sx={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              variant="contained"
              color="info"
            >
              <AiFillMessage
                color="white"
                style={{ paddingRight: "5px" }}
                size={20}
              />
              Send SMS
            </Button>
          </Alert>
        )}
        <Table sx={{ width: "100%", overflow: "scroll" }}>
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  color: "white",
                  backgroundColor: "black",
                },
              }}
            >
              <TableCell>
                {Object.keys(selected).length > 0 && selectAll ? (
                  <CgRemoveR
                    style={{ marginLeft: "8px", cursor: "pointer" }}
                    size={23}
                    color="white"
                    onClick={handleSelectAll}
                  />
                ) : (
                  <Checkbox
                    sx={{ color: "white" }}
                    onClick={handleSelectAll}
                    checked={selectAll}
                  />
                )}
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Lead Name</TableCell>
              <TableCell>Lead Email</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => (
              <TableRow
                key={row.lid}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Checkbox
                    onClick={() =>
                      handleClickCheckbox({ [row.lid]: row.leadContact })
                    }
                    checked={isChecked(row.lid)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.lid}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.leadName}
                </TableCell>
                <TableCell>{row.leadEmail}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success">
                    <AiFillMessage
                      color="white"
                      style={{ paddingRight: "5px" }}
                      size={20}
                    />
                    Whatsapp
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {messageModal && (
        <SendMessageModal
          sendMessageModal={messageModal}
          setSendMessageModal={setMessageModal}
        />
      )}
    </>
  );
}
