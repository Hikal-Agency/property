
import React, { 
  useEffect, 
  useState 
} from "react";
import { 
  useLocation, 
  useNavigate 
} from "react-router-dom";
import { 
  useStateContext 
} from "../../context/ContextProvider";
import { 
  Box 
} from "@mui/material";

import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import usePermission from "../../utils/usePermission";


const AllLiveLeads = () => {
  const {
    currentMode,
    setopenBackDrop,
    pageState,
    BACKEND_URL,
  } = useStateContext();
  const location = useLocation();
  const {hasPermission} = usePermission();
  const lead_type2 = location.pathname.split("/")[2];
  var lead_type = lead_type2.replace(/%20/g, " ");
  const pathname2 = location.pathname.split("/")[1];
  const [loading, setloading] = useState(true);
  

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
            className={`w-full p-4 ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="grid-cols-1 md:grid-cols-1 lg:grid-cols-2 w-full lg:flex lg:items-center lg:justify-between">
              <div className="flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  Live Call Leads{" "}
                  <span className="capitalize">({lead_type})</span>{" "}
                  <span className="bg-primary text-white px-3 py-1 ml-2 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>
              </div>

            </div>
            <AllLeads
              BACKEND_URL={BACKEND_URL}
              lead_type={lead_type}
              lead_origin={pathname2}
              leadCategory="live"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllLiveLeads;
