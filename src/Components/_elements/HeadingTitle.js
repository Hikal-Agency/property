import { useStateContext } from "../../context/ContextProvider";

const HeadingTitle = ({
    title,
    subtitle,
    counter,
    additional
}) => {
    const {
        currentMode,
        themeBgImg,
        isArabic
    } = useStateContext();

    return (
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between pb-5 gap-4">
            <div className="flex items-center gap-2">
                <div className="bg-primary h-8 w-1 rounded-full"></div>
                <h1
                    className={`text-lg font-semibold uppercase ${currentMode === "dark"
                            ? "text-white"
                            : "text-black"
                        }`}
                    style={{
                        fontFamily: isArabic(title)
                            ? "Noto Kufi Arabic"
                            : "inherit",
                    }}
                >
                    {title}
                    {subtitle && (
                        <span className="capitalize">
                            {" "}({subtitle}){" "}
                        </span>
                    )}
                </h1>
                {counter !== null && counter !== undefined && (
                    <div className={`${themeBgImg
                        ? "blur-bg-primary"
                        : currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
                        } text-white px-3 py-1 rounded-sm my-auto`}>
                        {counter}
                    </div>
                )}
            </div>
            <div className="flex justify-end">
                {additional && additional}
            </div>
        </div>
    );
};

export default HeadingTitle;