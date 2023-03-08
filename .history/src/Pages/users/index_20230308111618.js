import { Button } from "@material-tailwind/react";
import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import { GeneralInfo as GeneralInfoTab } from "../../Components/profile/GeneralInfo.jsx";
import { PersonalInfo as PersonalInfoTab } from "../../Components/profile/PersonalInfo";
import { ChangePassword as ChangePasswordTab } from "../../Components/profile/ChangePassword";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [loading, setloading] = useState(true);
  const {
    User,
    setUser,
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
  } = useStateContext();

  return (
    <>
    {/* <ToastContainer/> */}
      <div className="flex min-h-screen">
        
      </div>
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Users;
