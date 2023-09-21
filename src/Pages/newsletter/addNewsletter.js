import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";

import { useEffect } from "react";
import Loader from "../../Components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import AddNewsletter from "../../Components/newsletter/AddNewsletter";

const AddNewsLetters = () => {
  const { User, setUser, currentMode, setopenBackDrop } =
    useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    setopenBackDrop(false);
    if (User?.uid && User?.loginId) {
      setloading(false);
    } else {
      const token = localStorage.getItem("auth-token");
      if (token) {
        // FetchProfile(token);
        const user = localStorage.getItem("user");
        console.log("User in add lead: ", user);
        setUser(JSON.parse(user));
        setloading(false);
      } else {
        navigate("/", {
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className={`w-full `}>
              <div className="pl-3">

                <div className="mt-3 flex justify-between items-center"></div>
                <AddNewsletter />
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default AddNewsLetters;
