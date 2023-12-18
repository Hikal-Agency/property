import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import OnBoardingForm from "../../Components/OnBoardingComp/OnBoardingForm";
import ClientsListComp from "../../Components/OnBoardingComp/ClientsListComp";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";

const ClientsList = () => {
  const {
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
    themeBgImg,
    t,
  } = useStateContext();

  const [loading, setLoading] = useState(false);
  const [clientsList, setClientsList] = useState([]);
  const token = localStorage.getItem("auth-token");

  console.log("clients list state::: ", clientsList);
  const fetchCrmClients = async () => {
    setLoading(true);
    try {
      const getClients = await axios.get(`${BACKEND_URL}/onboarding`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setClientsList(getClients?.data?.data?.data);
      console.log("clients list::: ", getClients);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log("onboarding clients error::::: ", error);
      toast.error("Unable to fetch clients.", {
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
    setopenBackDrop(false);
    fetchCrmClients();
  }, []);

  return (
    <>
      <div className="flex relative min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              !themeBgImg & (currentMode === "dark" ? "bg-black" : "bg-white")
            }
            ${currentMode === "dark" ? "text-white" : "text-black"}`}
          >
            <div className="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full"></div>
              <h1
                className={`text-lg font-semibold mx-2 uppercase ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("menu_clientsList")}
              </h1>
            </div>

            <div className="mt-3 pb-3">
              {clientsList?.length > 0 ? (
                clientsList?.map((client) => (
                  <ClientsListComp isLoading={loading} client={client} />
                ))
              ) : (
                <p
                  className={`${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  }`}
                >
                  No data available
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientsList;
