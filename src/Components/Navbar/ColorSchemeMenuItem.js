import {useState} from "react";
import {BiChevronDown, BiChevronUp} from "react-icons/bi";
import { useStateContext } from "../../context/ContextProvider";
import {VscSymbolColor} from "react-icons/vsc";
import ColorsPopup from "./ColorsPopup";

const ColorSchemeMenuItem = () => {
    const {currentMode, primaryColor} = useStateContext();
    const [toggleThemeColors, setToggleThemeColors] = useState(false);

    const handleShowColors = (e) => {
        e.stopPropagation();
        setToggleThemeColors(!toggleThemeColors);
    }
    
    return <div
      className={`cursor-pointer card-hover ${
        currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]"
      } mb-3 p-3 rounded-xl shadow-sm w-full`}
    >
      <div onClick={handleShowColors} className="flex items-center justify-start">
        <div className={`${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"} p-2 rounded-full mr-2`}>
          <VscSymbolColor size={18} color={"#AAAAAA"} />
        </div>
        <div className="flex justify-between items-center w-full h-full">
          <div className="flex items-center">
            <p className="font-semibold mx-1 mr-2">Theme</p>
            <div 
            style={{
              background: primaryColor, 
              fontSize: "0.5rem"
            }} 
            className="rounded-full text-white px-2 py-1 font-bold"
          >
            BETA
          </div>
            {/* <VscLock size={14} color={primaryColor} className="mr-2" /> */}
          </div>
          {toggleThemeColors ? <BiChevronUp size={18}/> : 
          <BiChevronDown size={18}/>
          }
        </div>
      </div>

    {toggleThemeColors &&
      <div className="pt-2">
        <ColorsPopup/>
      </div>
    }
    </div>
}

export default ColorSchemeMenuItem;