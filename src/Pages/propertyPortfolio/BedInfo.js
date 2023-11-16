import React from "react";
import { FaCheck, FaMinus } from "react-icons/fa";
import { FaBed } from "react-icons/fa";

const BedInfo = ({ value, label, t }) => (
  <div className="flex items-center gap-3 my-2">
    {/* {value === 1 ? (
      <FaBed size={14} className="text-green-600" />
    ) : (
      <FaMinus size={14} className="text-red-600" />
    )} */}

    <p>{value === 1 ? `${t(label)},` : ""}</p>
  </div>
);

export default BedInfo;
