import {useState} from "react";
import { Card, Box, Button, IconButton } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import PricingTable from "./PricingTable";
import Checkout from "./Checkout";

const allPlans = [{
  name: "Basic",
  price: "18",
  isRecommended: false,
},{
  name: "Pro",
  price: "40",
  isRecommended: true,
}
];

const NewPayment = () => {
  const { currentMode } = useStateContext();
  const [plan, setPlan] = useState("");

  return (
    <div
      className={`${
        currentMode === "dark" ? "text-white" : "text-black"
      } w-full h-full rounded-md p-5`}
    >
    {plan ? <Box>
      <Checkout allPlans={allPlans} plan={plan} setPlan={setPlan}/>
    </Box> :
      <PricingTable allPlans={allPlans} setPlan={setPlan}/>
    }
    </div>
  );
};

export default NewPayment;
