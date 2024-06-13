import { useStateContext } from "../../context/ContextProvider";

const HeadingTitle = ({
    title,
    additional
}) => {
    const {
        currentMode,
        themeBgImg
    } = useStateContext();

    return (
        <div className="w-full flex items-center justify-between pb-4 gap-4">
            <div className="flex items-center gap-2">
                <div className="bg-primary h-8 w-1 rounded-full"></div>
                <h1
                    className={`text-lg font-semibold uppercase ${!themeBgImg
                        ? "text-primary"
                        : currentMode === "dark"
                            ? "text-white"
                            : "text-black"
                        }`}
                >
                    {title}
                </h1>
            </div>
            {additional && additional}
        </div>
    );
};

export default HeadingTitle;