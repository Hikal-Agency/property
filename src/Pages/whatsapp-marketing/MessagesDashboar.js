import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BookedDeals from "../../Components/Leads/BookedDeals";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import MessagesComponent from "../../Components/whatsapp-marketing/MessageComponent";

const MessagesDashboar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setloading] = useState(true);
  const { currentMode, setopenBackDrop, BACKEND_URL, pageState } =
    useStateContext();

  const campaignCount = [
    {
      text: "Sent SMS",
      count: "1234",
    },
    {
      text: "SMS Campaign",
      count: "1234",
    },
    {
      text: "Sent Whatsapp",
      count: "1",
    },
    {
      text: "Whatsapp Campaign",
      count: "1",
    },
    {
      text: "Credits Used",
      count: "100",
    },
  ];

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full pl-3 ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="w-full flex items-center py-1">
              <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                Campaigns Dashboard{" "}
                <span className="bg-main-red-color text-white px-3 py-1 rounded-sm my-auto">
                  {pageState?.total}
                </span>
              </h1>
            </div>

            <div className="w-full my-4 mb-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-6">
              {campaignCount && campaignCount?.length > 0
                ? campaignCount?.map((campaign, index) => (
                    <div
                      className={`p-6  rounded-md ${
                        currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"
                      }  flex flex-col justify-center items-center w-64`}
                      key={index}
                    >
                      <h2 className="text-2xl text-center font-bold text-[#DA1F26] mb-2 break-words w-full">
                        {campaign?.count}
                      </h2>
                      <p
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-dark"
                        }`}
                      >
                        {campaign?.text}
                      </p>
                    </div>
                  ))
                : null}

              {/* <div>1</div>
              <div>1</div>
              <div>1</div> */}
            </div>

            <MessagesComponent BACKEND_URL={BACKEND_URL} lead_type={"booked"} />
          </div>
        )}
      </div>
    </>
  );
};

export default MessagesDashboar;
