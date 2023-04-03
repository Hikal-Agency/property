import { Container } from "@mui/system";
import { ImUserCheck } from "react-icons/im";
import { MdFeedback } from "react-icons/md";
import { MdOutlineFeedback } from "react-icons/md";
import { BsCalendar2EventFill, BsFillBuildingFill } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { HiUser } from "react-icons/hi";
import { useStateContext } from "../../context/ContextProvider";

const NotificationsMenu = () => {
    const { currentMode, BACKEND_URL } = useStateContext();

    const activity = [
        {
            creationDate: "2023-03-03 12:00:00",
            addedBy: "Hala Hikal",
            feedback: "Meeting",
            note: "Feedback updated to Meeting.",
            meetingDate: "2023-03-30",
            meetingTime: "12:30",
            leadId: "#123",
            leadName: "Lead Name",
            project: "Riviera Project",
            enquiryType: "1 Bedroom",
        },
        {
            creationDate: "2023-03-03 12:00:00",
            addedBy: "Hala Hikal",
            feedback: "Follow Up",
            note: "Feedback updated to Follow Up.",
            meetingDate: "",
            meetingTime: "",
            leadId: "#123",
            leadName: "Lead Name",
            project: "Riviera Project",
            enquiryType: "1 Bedroom",
        },
        {
            creationDate: "2023-03-03 12:00:00",
            addedBy: "Hala Hikal",
            feedback: "Follow Up",
            note: "Feedback updated to Follow Up.",
            meetingDate: "",
            meetingTime: "",
            leadId: "#321",
            leadName: "Lead Name 2",
            project: "Emmar Project",
            enquiryType: "3 Bedrooms",
        },
        {
            creationDate: "2023-03-03 12:00:00",
            addedBy: "Hala Hikal",
            feedback: "No Answer",
            note: "Feedback updated to No Answer.",
            meetingDate: "",
            meetingTime: "",
            leadId: "#231",
            leadName: "Lead Name 3",
            project: "Onyx Project",
            enquiryType: "3 Bedrooms",
        },
        {
            creationDate: "2023-03-03 12:00:00",
            addedBy: "Hala Hikal",
            feedback: "",
            note: "Lead assigned to Abdulrhman Makawi.",
            meetingDate: "",
            meetingTime: "",
            leadId: "#231",
            leadName: "Lead Name 3",
            project: "Onyx Project",
            enquiryType: "3 Bedrooms",
        },
    ];

    return (<>
            <Container sx={{ maxHeight: 500, width: 400}}>
                <p>Notifications Multiple</p>
                {activity.map((activity, index) => {
                return (
                    <div
                        key={index}
                        className="p-1"
                    >
                        {activity.feedback !== "" ? (
                            activity.feedback !== "Meeting" ? (
                                <>
                                    {/* <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                        <div className="h-full w-6 flex items-center justify-center">
                                            <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                        </div>
                                        <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                            <MdStickyNote2
                                                className="bg-main-red-color text-white p-2 rounded-md"
                                                size={33}
                                            />
                                        </div>
                                    </div> */}
                                    <div
                                        className={`${
                                        currentMode === "dark"
                                            ? "bg-gray-900"
                                            : "bg-gray-200"
                                        } p-3 pb-3 space-y-3 rounded-md shadow-md my-2 w-full`}
                                    >
                                        <div class="grid grid-cols-7 gap-3">
                                            <div className="col-span-1 flex items-center justify-center">
                                                <MdOutlineFeedback size={"30px"} />
                                            </div>
                                            <div className="col-span-6 flex h-full items-center">
                                                <div className="h-full w-5 flex items-center">
                                                    <div className="h-full w-0.5 bg-main-red-color pointer-events-none"></div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-sm tracking-wide">
                                                        {activity.note}
                                                    </p>
                                                    <p className="text-xs tracking-wide flex items-center">
                                                        <HiUser className="mr-2 text-main-red-color" /><span>{activity.leadName}</span>
                                                    </p>
                                                    <p className="text-xs tracking-wide flex items-center">
                                                        <BsFillBuildingFill className="mr-2 text-main-red-color" /><span>{activity.project}&nbsp;{activity.enquiryType}</span>
                                                    </p>
                                                    <p className="text-xs mt-2 tracking-wide uppercase dark:text-gray-400 italic text-right">
                                                        {activity.creationDate ||
                                                        activity.creationDate}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="w-full">
                                            <div className="col-span-1 space-4">
                                                <div className="flex">
                                                    <BiUserCircle size={"22px"} color={"#da1f26"} className="mr-2" />
                                                    <div>{activity.leadName}</div>
                                                </div>
                                                <div className="flex text-sm italic">
                                                    {activity.project}&nbsp;{activity.enquiryType}
                                                </div>
                                            </div>
                                            <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-3 space-3">
                                                <div className="flex h-full items-center">
                                                    <div className="h-full w-5 flex items-center">
                                                        <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold tracking-wide">
                                                            {activity.note}
                                                        </p>
                                                        <p className="text-xs mt-2 tracking-wide uppercase dark:text-gray-400 italic">
                                                            {activity.creationDate ||
                                                            activity.creationDate}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                        <div className="h-full w-6 flex items-center justify-center">
                                            <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                        </div>
                                        <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                            <BsCalendar2EventFill
                                                className="bg-main-red-color text-white p-2 rounded-md"
                                                size={33}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className={`${
                                        currentMode === "dark"
                                            ? "bg-gray-900"
                                            : "bg-gray-200"
                                        } px-5 pb-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                        style={{
                                        transform: "translateX(-30px)",
                                        }}
                                    >
                                        <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                                            <div className="col-span-1 space-4">
                                                <div className="flex">
                                                    <BiUserCircle size={"22px"} color={"#da1f26"} className="mr-2" />
                                                    <div>{activity.leadName}</div>
                                                </div>
                                                <div className="flex text-sm italic">
                                                    {activity.project}&nbsp;{activity.enquiryType}
                                                </div>
                                            </div>
                                            <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-3 space-3">
                                                <div className="flex h-full items-center">
                                                    <div className="h-full w-5 flex items-center">
                                                        <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold tracking-wide">
                                                            {activity.note}
                                                        </p>
                                                        <p className="font-semibold tracking-wide">
                                                            Meeting Scheduled for <span class="text-main-red-color">{activity.meetingDate} {activity.meetingTime}</span>
                                                        </p>
                                                        <p className="text-xs mt-2 tracking-wide uppercase dark:text-gray-400 italic">
                                                            {activity.creationDate ||
                                                            activity.creationDate}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        ) : (
                            <>
                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                    <div className="h-full w-6 flex items-center justify-center">
                                        <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                    </div>
                                    <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                        <ImUserCheck
                                            className="bg-main-red-color text-white p-2 rounded-md"
                                            size={33}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={`${
                                    currentMode === "dark"
                                        ? "bg-gray-900"
                                        : "bg-gray-200"
                                    } px-5 pb-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                    style={{
                                    transform: "translateX(-30px)",
                                    }}
                                >
                                    <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                                        <div className="col-span-1 space-4">
                                            <div className="flex">
                                                <BiUserCircle size={"22px"} color={"#da1f26"} className="mr-2" />
                                                <div>{activity.leadName}</div>
                                            </div>
                                            <div className="flex text-sm italic">
                                                {activity.project}&nbsp;{activity.enquiryType}
                                            </div>
                                        </div>
                                        <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-3 space-3">
                                            <div className="flex h-full items-center">
                                                <div className="h-full w-5 flex items-center">
                                                    <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold tracking-wide">
                                                        {activity.note}
                                                    </p>
                                                    <p className="text-xs mt-2 tracking-wide uppercase dark:text-gray-400 italic">
                                                        {activity.creationDate ||
                                                        activity.creationDate}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )
                })}
            </Container>
    </>);
}

export default NotificationsMenu;