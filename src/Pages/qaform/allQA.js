import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import ListQa from "../../Components/addQA/ListQa";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";

const AllQA = () => {
  const {  t, currentMode, setopenBackDrop, BACKEND_URL } =
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
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className={`w-full `}>
            <div className="pl-3">
              {/* <Navbar /> */}
              <h4
                className={`font-semibold p-7 text-center text-2xl ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                {t("all_qa")}
              </h4>
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-[#1c1c1c] text-white"
                    : "bg-gray-200 text-black"
                } p-5 rounded-md my-5 mb-10`}
              >
                <ListQa />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default AllQA;
