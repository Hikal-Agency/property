import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  Paper,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
} from "@mui/material";
import { AiFillPicture } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { GrStatusGoodSmall } from "react-icons/gr";
import { useStateContext } from "../../context/ContextProvider";

const Instances = () => {
  const [instances, setInstances] = useState([]);
  const { BACKEND_URL } = useStateContext();

  const fetchInstances = async () => {
    const ULTRA_MSG_API = process.env.REACT_APP_ULTRAMSG_API_URL;
    const ULTRA_MSG_TOKEN = process.env.REACT_APP_ULTRAMSG_API_TOKEN;

    try {
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(`${BACKEND_URL}/instances`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const instancesArr = result.data.instances.data;

      const ultramsgResults = await Promise.all(
        instancesArr.map((instance) => {
          return axios.get(
            `${ULTRA_MSG_API}/instance${instance.instance_name}/instance/me?token=${ULTRA_MSG_TOKEN}`
          );
        })
      );
      // const ultramsgInstance = await axios.get(`${ULTRA_MSG_API}/instance24405/instance/me?token=${ULTRA_MSG_TOKEN}`);
      setInstances(ultramsgResults.map((result) => result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);
  return (
    <div className="h-screen">
      <h1>Instances</h1>

      <Box className="mt-4">
        <TableContainer component={Paper}>
          <Table aria-label="simple table" sx={{ maxWidth: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box className="flex items-center">
                    <AiFillPicture />
                    <span style={{ marginLeft: 5 }}> Profile Picture</span>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box className="flex items-center">
                    <FaUserAlt />{" "}
                    <span style={{ marginLeft: 5 }}>User Name</span>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box className="flex items-center">
                    <BsFillTelephoneFill />{" "}
                    <span style={{ marginLeft: 5 }}>Phone Number</span>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box className="flex items-center">
                    <GrStatusGoodSmall />{" "}
                    <span style={{ marginLeft: 5 }}>Status</span>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {instances.map((instance) => (
                <TableRow
                  key={instance?.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {instance?.profile_picture ? (
                      <img
                        style={{ borderRadius: 4 }}
                        width={60}
                        src={instance?.profile_picture}
                        alt=""
                      />
                    ) : (
                      <span style={{ color: "red" }}>No profile picture</span>
                    )}
                  </TableCell>
                  <TableCell>{instance?.name}</TableCell>
                  <TableCell>
                    +
                    {instance?.id?.slice(
                      0,
                      instance?.id?.toString()?.indexOf("@")
                    )}
                  </TableCell>
                  <TableCell>
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Active
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Instances;
