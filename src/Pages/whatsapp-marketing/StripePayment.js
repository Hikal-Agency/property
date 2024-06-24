import { Box } from "@mui/material";
const Stripe = () => {
  return (
    <>
      <Box className="py-5 min-h-[70vh]">
          <stripe-pricing-table 
          style={{height: "100%"}}
            pricing-table-id={process.env.REACT_APP_PRICING_TABLE_ID}
            publishable-key={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
          ></stripe-pricing-table>
      </Box>
    </>
  );
};

export default Stripe;
