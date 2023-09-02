import { useState } from "react";
import { Card, Box, Button, IconButton } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import PricingTable from "./PricingTable";
import Checkout from "./Checkout";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const allPlans = [
  {
    name: "Basic",
    price: "18",
    isRecommended: false,
  },
  {
    name: "Pro",
    price: "40",
    isRecommended: true,
  },
];

const NewPayment = () => {
  const { currentMode } = useStateContext();
  const location = useLocation();
  const [plan, setPlan] = useState(
    new URLSearchParams(location.search).get("plan") || ""
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPlan(params.get("plan"));
  }, [location.search]);

  return (
    <div
      className={`${
        currentMode === "dark" ? "text-white" : "text-black"
      } w-full h-full rounded-md p-5`}
    >
      {plan ? (
        plan.toLowerCase() === "basic" || plan.toLowerCase() === "pro" ? (
          <Box>
            <Checkout allPlans={allPlans} plan={plan} />
          </Box>
        ) : (
          <PricingTable allPlans={allPlans} />
        )
      ) : (
        <PricingTable allPlans={allPlans} />
      )}
    </div>
  );
};

export default NewPayment;
