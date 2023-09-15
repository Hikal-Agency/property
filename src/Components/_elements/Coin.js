
import { useStateContext } from "../../context/ContextProvider";

const Coin = () => {
    const {
        currentMode
    } = useStateContext();

    return (
        <div className="coin">
            <div className="front jump">
            <div className="star"></div>
            <span className="currency">hi</span>
            <div className="shapes">
            </div>
            </div>
            <div className={`shadow ${currentMode === "dark" ? "shadow-dark-mode" : "shadow-light-mode" }`}></div>
        </div>
    );
};

export default Coin;