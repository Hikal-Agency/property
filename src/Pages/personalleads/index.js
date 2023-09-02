import React, { 
  useEffect, 
  useState 
} from "react";
import { 
  useLocation 
} from "react-router-dom";
import { 
  useStateContext 
} from "../../context/ContextProvider";
import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";

const PersonaLeads = () => {
  const location = useLocation();
  const lead_type2 = location.pathname.split("/")[2];
  var lead_type = lead_type2.replace(/%20/g, " ");
  const pathname2 = location.pathname.split("/")[1];
  console.log("PathName: ", pathname2);
  const [loading, setloading] = useState(true);
  const { currentMode, pageState, setopenBackDrop, BACKEND_URL } =
    useStateContext();

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, [lead_type]);
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
            <div className="w-full pl-3">
              <div className="w-full flex items-center py-1">
                <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  {/* ●  */}
                  Personal Leads {" "}
                  <span className="capitalize">({lead_type})</span>{" "}
                  <span className="bg-main-red-color text-white px-3 py-1 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>
              </div>
              <AllLeads
                BACKEND_URL={BACKEND_URL}
                lead_type={lead_type}
                lead_origin={pathname2}
                leadCategory="hot"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PersonaLeads;
