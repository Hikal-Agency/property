import { Box, Card, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

const PricingTable = ({ allPlans }) => {
  const navigate = useNavigate();
  const { currentMode, primaryColor } = useStateContext();
  const setPlan = (plan) => {
    navigate("?plan=" + plan);
  };
  const borderColorClass = currentMode !== "dark" && "border-black";

  return (
    <>
      <Box className="flex justify-center items-center">
        {allPlans.map((plan) => {
          return (
            <Card
              className={`shadow-md border border-1 ${borderColorClass}`}
              key={plan.name}
              sx={{
                p: 5,
                mr: 3,
                height: "300px",
                width: "25%",
                borderRadius: 4,
                background: currentMode === "dark" && "#2C2A2C",
                backdropFilter: "blur(15px)",
                "&:hover": {
                  boxShadow: `0 0 30px 5px ${primaryColor}`,
                },
              }}
            >
              <Box className="h-[100%] flex justify-between flex-col pt-4 relative">
                {plan.isRecommended && (
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
                )}
                <h2
                  className="text-slate-600 font-bold"
                  style={{
                    fontSize: "22px",
                    color: currentMode === "dark" && "#ffffff",
                  }}
                >
                  {plan.name}
                </h2>
                <Box className="flex items-center mt-2">
                  <h1
                    className="font-black text-primary"
                    style={{ fontSize: 40 }}
                  >
                    US${plan.price}
                  </h1>
                  <Box className="text-slate-400 font-light ml-2">
                    <p>per</p>
                    <p style={{ lineHeight: 1, fontSize: 13 }}>year</p>
                  </Box>
                </Box>
                {currentMode === "dark" ? (
                  <Box className="h-[45%] flex flex-col justify-end">
                    <Button
                      component="a"
                      href="#"
                      onClick={() => setPlan(plan.name)}
                      fullWidth
                      className="subscribe_btn"
                      sx={{
                        position: "relative",
                        backgroundColor: "#444",
                        color: "#fff",
                        textDecoration: "none",
                        textTransform: "uppercase",
                        fontSize: "1.5rem",
                        letterSpacing: "0.1rem",
                        padding: "0.75rem 1.5rem",
                        overflow: "hidden",
                        transition: "0.5s",
                        "&:hover": {
                          letterSpacing: "0.25rem",
                          backgroundColor: "#B10044",
                          // color: "#B10044",
                          // boxShadow: "0 0 50px 10px #DA1F26",
                        },
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        Subscribe
                      </span>
                      <i
                        style={{
                          position: "absolute",
                          content: '""',
                          inset: 0,
                          background: primaryColor,
                          zIndex: 0,
                          transition: "0.5s",
                        }}
                      ></i>
                      <i
                        className="btn_i_right"
                        style={{
                          position: "absolute",
                          content: '""',
                          top: "-3.5px",
                          left: "80%",
                          width: "10px",
                          height: "5px",
                          border: "2px solid black",
                          background: primaryColor,
                          transform: "translateX(-50%)",
                          zIndex: 0,
                          transition: "0.5s",
                        }}
                      ></i>
                      <i
                        className="btn_i_left"
                        style={{
                          position: "absolute",
                          content: '""',
                          bottom: "-3.5px",
                          left: "20%",
                          width: "10px",
                          height: "5px",
                          border: "2px solid black",
                          background: primaryColor,
                          transform: "translateX(-50%)",
                          zIndex: 0,
                          transition: "0.5s",
                        }}
                      ></i>
                    </Button>
                  </Box>
                ) : (
                  <Box className="h-[45%] flex flex-col justify-end">
                    {/* <Button
                      onClick={() => setPlan(plan.name)}
                      variant="contained"
                      // style={{ backgroundColor: "#da1f26" }}
                      fullWidth
                      sx={{
                        padding: "12px 0",
                        borderRadius: "5%",
                        // backgroundColor: "#da1f26",
                        backgroundColor: "#0B0A0B",
                      }}
                    >
                      Subscribe
                    </Button> */}
                    <Button
                      component="a"
                      href="#"
                      className="subscribe_btn"
                      onClick={() => setPlan(plan.name)}
                      fullWidth
                      sx={{
                        position: "relative",
                        backgroundColor: "#444",
                        color: "#fff",
                        textDecoration: "none",
                        textTransform: "uppercase",
                        fontSize: "1.5rem",
                        letterSpacing: "0.1rem",
                        padding: "0.75rem 1.5rem",
                        overflow: "hidden",
                        transition: "0.5s",
                        "&:hover": {
                          letterSpacing: "0.25rem",
                          backgroundColor: "#B10044",
                          // color: "#B10044",
                          // boxShadow: "0 0 40px 10px #2C2A2C",
                        },
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        Subscribe
                      </span>
                      <i
                        className="btn_i bg-primary"
                        style={{
                          position: "absolute",
                          content: '""',
                          inset: 0,
                          zIndex: 0,
                          transition: "0.5s",
                        }}
                      ></i>
                      <i
                        className="btn_i_right"
                        style={{
                          position: "absolute",
                          content: '""',
                          top: "-3.5px",
                          left: "80%",
                          width: "10px",
                          height: "5px",
                          border: "4px solid #2C2A2C",
                          background: "#27282c",
                          transform: "translateX(-50%)",
                          zIndex: 0,
                          transition: "0.5s",
                        }}
                      ></i>
                      <i
                        className="btn_i_left"
                        style={{
                          position: "absolute",
                          content: '""',
                          bottom: "-3.5px",
                          left: "20%",
                          width: "10px",
                          height: "5px",
                          border: "4px solid #2C2A2C",
                          background: "#27282c",
                          transform: "translateX(-50%)",
                          zIndex: 0,
                          transition: "0.5s",
                        }}
                      ></i>
                    </Button>
                  </Box>
                )}
              </Box>
            </Card>
          );
        })}
      </Box>
    </>
  );
};

export default PricingTable;
