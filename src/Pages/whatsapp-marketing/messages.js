import {useState, useEffect} from "react";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";
import LeadsTable from "../../Components/whatsapp-marketing/LeadsTable";

const Messages = () => {
  const {BACKEND_URL, currentMode} = useStateContext();
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
    <>
      <h1
        className={`font-semibold ${
          currentMode === "dark" ? "text-white" : "text-red-600"
        } text-xl ml-2 mb-3`}
      >
        Messages
      </h1>
      <LeadsTable rows={leads}/>
      </>
  );
};

export default Messages;
