import React from "react";
import { BsStarFill } from "react-icons/bs";
import { useStateContext } from "../../context/ContextProvider";
  
const ProgressBar = ({
    bgcolor,
    progress,
    height,
    progresswidth
}) => {
    const { 
        currentMode
    } = useStateContext();
     
    const Parentdiv = {
        height: height,
        width: '100%',
        backgroundColor: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
        borderRadius: 40,
    }
      
    const Childdiv = {
        height: '100%',
        width: `${progresswidth}%`,
        // backgroundColor: progress >= 100 ? "#269144" : "#DA1F26",
        backgroundColor: bgcolor,
        borderRadius: 40,
        textAlign: 'right',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
    }
      
    const progresstext = {
        padding: 10,
        color: 'white',
        fontWeight: 900,
    }
        
    return (
        <div style={Parentdiv}>
            <div style={Childdiv}>
                {progress <= 0 ? (
                    <></>
                ) : progress >= 100 ? (
                    <span className="w-full flex justify-between items-center" style={progresstext}>
                        <div className="flex items-center gap-x-3">
                            <BsStarFill size={14} />
                            <BsStarFill size={14} />
                            <BsStarFill size={14} />
                        </div>
                        {`${progress}%`}
                    </span>
                ) : progress >= 75 ? (
                    <span className="w-full flex justify-between items-center" style={progresstext}>
                        <div className="flex items-center gap-x-3">
                            <BsStarFill size={14} />
                            <BsStarFill size={14} />
                        </div>
                        {`${progress}%`}
                    </span>
                ) : progress >= 50 ? (
                    <span className="w-full flex justify-between items-center" style={progresstext}>
                        <div className="flex items-center gap-x-3">
                            <BsStarFill size={14} />
                        </div>
                        {`${progress}%`}
                    </span>
                ) : (
                    <span style={progresstext}>{`${progress}%`}</span>
                )}
            </div>
        </div>
    )
}
  
export default ProgressBar;