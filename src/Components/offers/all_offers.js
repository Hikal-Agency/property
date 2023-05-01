import React from "react";
import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const AllOffers = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [offers, setOffers] = useState();

  console.log("Offers: ", offers);
  const FetchOffers = async (token) => {
    try {
      const all_offers = await axios.get(`${BACKEND_URL}/offers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setOffers(all_offers?.data?.offers?.data);

      //   console.log("All Offers: ",all_offers)
    } catch (error) {
      console.log("Offers not fetched. ", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchOffers(token);
  }, []);

  const offer = [
    {
      creationDate: "2022-03-03",
      offerTitle: "Win iPad ",
      offerDescription:
        "Get a chance to win latest iPad 14 Pro Max by closing AED 7 Million plus direct deals this month.",
      valid_from: "2022-03-01",
      valid_to: "2023-03-30",
      validToManager: 1,
      validToSales: 1,
      offerBy: "Mohamed Hikal",
    },
    {
      creationDate: "2022-03-03",
      offerTitle: "Win iPhone 14 Pro Max",
      offerDescription:
        "Get a chance to win latest iPhone 14 Pro Max by closing AED 3 Million plus deals this month.",
      valid_from: "2022-03-01",
      valid_to: "2023-03-30",
      validToManager: 0,
      validToSales: 1,
      offerBy: "Belal Hikal",
    },
    {
      creationDate: "2022-03-07",
      offerTitle: "Win iPhone 14 Pro Max",
      offerDescription:
        "Get a chance to win latest iPhone 14 Pro Max by closing AED 10 Million plus deals this month.",
      valid_from: "2022-03-01",
      valid_to: "2023-03-30",
      validToManager: 1,
      validToSales: 0,
      offerBy: "Mohamed Hikal",
    },
  ];

  return (
    <div>
      <Box
        className="mt-1 p-5"
        sx={
          isLoading && {
            opacity: 0.3,
          }
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-3 gap-y-3 pb-4 text-center">
          {offers?.map((offer, index) => {
            return (
              // offer.validToManager === 1 && offer.validToSales === 1 ? (
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                } p-5 rounded-md h-fit`}
              >
                <h1 className="bg-main-red-color text-white font-semibold rounded-md p-2 mb-3">
                  {offer?.offerTitle}
                </h1>
                <h6 className="mb-3 p-2">{offer?.offerDescription}</h6>
                <hr className="mb-3"></hr>
                <h1 className="font-semibold mb-3">
                  Valid from {offer?.validFrom} to {offer?.validTill}
                </h1>
                <hr className="mb-3"></hr>
                <h6 className="mb-3 bg-main-red-color text-white p-2 rounded-md">
                  Offer from Mr. {offer?.offerFrom}
                </h6>
              </div>
              // ) : (
              //     <>l
              //     </>
              // )
            );
          })}
        </div>
      </Box>
    </div>
  );
};

export default AllOffers;
