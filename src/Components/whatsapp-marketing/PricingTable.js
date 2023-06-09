import {Box, Card, Button} from "@mui/material";
import { useNavigate } from "react-router-dom";

const PricingTable = ({allPlans}) => {
  const navigate = useNavigate();
  const setPlan = (plan) => {
    navigate("?plan=" + plan);
  }
    return (
        <>
            <Box className="flex justify-center items-center">

            {allPlans.map((plan) => {
         return <Card key={plan.name} sx={{ p: 5, mr: 3, height: "300px", width: "30%", borderRadius: 6 }}>
          <Box className="h-[100%] flex flex-col pt-4 relative">
                {plan.isRecommended &&
            <span
              style={{
                position: "absolute",
                top: -20,
                left: 0,
                background: "black",
                color: "white",
                borderRadius: 4,
                width: "max-content",
                padding: "0 5px",
              }}
            >
              Recommended
            </span>
                }
            <h2
              className="text-slate-600 font-bold"
              style={{ fontSize: "22px" }}
            >
              {plan.name}
            </h2>
            <Box className="flex items-center mt-2">
              <h1 className="font-black" style={{ fontSize: 40 }}>
                US${plan.price}
              </h1>
              <Box className="text-slate-400 font-light ml-2">
                <p>per</p>
                <p style={{ lineHeight: 1, fontSize: 13 }}>year</p>
              </Box>
            </Box>
            <Box className="h-[50%] flex flex-col justify-end">
              <Button
              onClick={() => setPlan(plan.name)}
                variant="contained"
                style={{ backgroundColor: "red" }}
                fullWidth
                sx={{ padding: "12px 0" }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Card>
            })}
      </Box>
        </>
    );
}

export default PricingTable;