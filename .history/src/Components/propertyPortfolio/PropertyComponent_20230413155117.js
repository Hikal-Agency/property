// import Image from "next/image";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
// import UserImage from "../../public/favicon.png";
import { useStateContext } from "../../context/ContextProvider";

const PropertyComponent = ({ dev_pro }) => {
  const { currentMode } = useStateContext();

//   const position = [51.505, -0.09];

    useEffect(() => {
        console.log("dev pro are");
        console.log(dev_pro);
    }, []);

  return (
    <>
        <div className="mt-5 md:mt-2">
            
        </div>
    </>
  );
};

export default PropertyComponent;
