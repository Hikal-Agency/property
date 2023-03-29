import {useState, useEffect} from "react";
import axios from "axios";
import Base64 from "Base64";
import { useStateContext } from "../../context/ContextProvider";
import LeadsTable from "../../Components/whatsapp-marketing/LeadsTable";

const Messages = () => {
  const {BACKEND_URL} = useStateContext();
  const [leads, setLeads] = useState(null);

const fetchLeads = () => {
  const token = localStorage.getItem("auth-token");
  axios
    .get(`${BACKEND_URL}/leads`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((result) => {
      setLeads(result.data.posts.data);
    })
    .catch((error) => {
      console.log(error);
    })
}

  useEffect(() => {
    fetchLeads();
  }, []);
  return (
      <LeadsTable rows={leads}/>
  );
};

export default Messages;
