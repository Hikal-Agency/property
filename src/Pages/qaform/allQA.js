import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import ListQa from "../../Components/addQA/ListQa";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";

const AllQA = () => {
  const {  t, currentMode, themeBgImg, setopenBackDrop, BACKEND_URL } =
    useStateContext();
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState([]);

  const [loading, setloading] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Users: ", response);
      setUsers(response?.data?.managers?.data);
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch users.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (value === 2) {
      console.log("Tab 2");
      fetchUsers();
    }
  }, [value]);

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      
      <div className="flex min-h-screen">
        <div
          className={`w-full p-4 ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="w-full flex items-center pb-3">
            <div className="bg-primary h-10 w-1 rounded-full"></div>
            <h1
              className={`text-lg font-semibold mx-2 uppercase ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              {t("all_qa")}
            </h1>
          </div>
          
          <div
            className={` p-4 mb-5`}
          >
            <ListQa />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default AllQA;
