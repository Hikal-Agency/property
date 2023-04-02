// import moment from "moment";
// import React, { useEffect, useState } from "react";
// import Navbar from "../../Components/Navbar/Navbar";
// import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
// import Footer from "../../Components/Footer/Footer";
// import { useStateContext } from "../../context/ContextProvider";
// import { ImUserCheck } from "react-icons/im";
// import { MdFeedback } from "react-icons/md";
// import { MdStickyNote2 } from "react-icons/md";
// import { BsCalendar2EventFill } from "react-icons/bs";
// import { BiUserCircle } from "react-icons/bi";

// import { useLocation, useNavigate } from "react-router-dom";

// const Tour360 = (props) => {
//     const { currentMode } = useStateContext();
//     const location = useLocation();
//     // const devproid = location.pathname.split("/")[2];

//     // const devproid = location.pathname.split("/")[2].replace(/%20/g, " ");
//     // const devproid = location.substring(location.lastIndexOf('/') + 1);
//     const devproid = 4;

//     const tour = [
//         {
//             dpid: 1,
//             tourlink: "",
//         },
//         {
//             dpid: 2,
//             tourlink: "",
//         },
//         {
//             dpid: 3,
//             tourlink: "https://kuula.co/share/collection/792Wy?logo=-1&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1",
//         },
//         {
//             dpid: 4,
//             tourlink: "https://kuula.co/share/collection/7FDYx?logo=-1&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1",
//         },
//         {
//             dpid: 5,
//             tourlink: "",
//         },
//         {
//             dpid: 6,
//             tourlink: "",
//         },
//         {
//             dpid: 7,
//             tourlink: "",
//         },
//         {
//             dpid: 8,
//             tourlink: "https://kuula.co/share/collection/7Fmty?logo=-1&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1",
//         },
//     ];

//     return (
//         <>
//             <div className="min-h-screen">
//                 <div className="flex">
//                     <Sidebarmui />
//                     <div
//                         className={`w-full  ${
//                         currentMode === "dark" ? "bg-black" : "bg-white"
//                         }`}
//                     >
//                         <div className="px-5">
//                             <Navbar />
                            
//                             <div className="mt-5 md:mt-2">
//                                 <h1
//                                 className={`font-semibold ${
//                                     currentMode === "dark" ? "text-white" : "text-red-600"
//                                 } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
//                                 >
//                                     Arada {'>'} Masaar------- PROJECT NAME
//                                 </h1>

//                                 <div>
//                                     <iframe width="100%" height="640" frameborder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen scrolling="no" src={tour[4-1].tourlink}></iframe>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <Footer />
//             </div>
//         </>
//     );
// };

// export default Tour360;



import axios from "axios";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import LeadNotes from "../../Components/LeadNotes/LeadNotes";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";

const Tour360 = (props) => {
  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });
  const [loading, setloading] = useState(true);
  const { User, setUser, currentMode, setopenBackDrop, BACKEND_URL } =
    useStateContext();
  const navigate = useNavigate(); 
  const location = useLocation();
  const FetchProfile = async (token) => {
    await axios
      .get(`${BACKEND_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setUser(result.data.user[0]);
        setloading(false);
      })
      .catch((err) => {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again " },
        });
      });
  };
  useEffect(() => {
    setopenBackDrop(false);
    if (User?.uid && User?.loginId) {
      setloading(false);
    } else {
      const token = localStorage.getItem("auth-token");
      if (token) {
        FetchProfile(token);
      } else {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
        });
      }
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Lead Notes</title>
        <meta name="description" content="Meetings - HIKAL CRM" />
      </Head> */}
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="flex">
              <Sidebarmui />
              <div className={`w-full `}>
                <div className="px-5">
                  <Navbar />
                  <div className="mt-3">
                    <h1
                      className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-red-600 font-bold border-red-600"
                      }`}
                    >
                      Lead notes{" "}
                      <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                        <span>{pageState?.total}</span>
                      </span>
                    </h1>
                    <LeadNotes
                      pageState={pageState}
                      setpageState={setpageState}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        )}
      </div>
    </>
  );
};

export default Tour360;

