import { Container } from "@mui/system";
import { ImUserCheck } from "react-icons/im";
import { MdFeedback } from "react-icons/md";
import { MdOutlineFeedback, MdCalendarMonth } from "react-icons/md";
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

    return (
        <>
            <Container sx={{ maxHeight: 500, width: 400}}>
                {activity.map((activity, index) => {
                return (
                    <div
                        key={index}
                        className="pb-1"
                    >
                        {activity.feedback !== "" ? (
                            activity.feedback !== "Meeting" ? (
                                <div
                                    className={`${
                                    currentMode === "dark"
                                        ? "bg-gray-900"
                                        : "bg-gray-200"
                                    } p-2 pb-3 space-y-3 rounded-md shadow-md my-2 w-full`}
                                >
                                    <div class="grid grid-cols-7 gap-2 w-full">
                                        <div className="col-span-1 flex items-center justify-center">
                                            <MdOutlineFeedback size={"25px"} />
                                        </div>
                                        <div className="col-span-6 flex h-full w-full items-center">
                                            <div className="h-full w-5 flex items-center">
                                                <div className="h-full w-0.5 bg-main-red-color pointer-events-none"></div>
                                            </div>
                                            <div className="space-y-1 w-full">
                                                <p className="font-semibold text-sm tracking-wide">
                                                    {activity.note}
                                                </p>
                                                <p className="text-xs tracking-wide flex items-center">
                                                    <HiUser className="mr-2 text-main-red-color" /><span>{activity.leadName}</span>
                                                </p>
                                                <p className="text-xs tracking-wide flex items-center">
                                                    <BsFillBuildingFill className="mr-2 text-main-red-color" /><span>{activity.project}&nbsp;{activity.enquiryType}</span>
                                                </p>
                                                <p className="text-xs mt-2 dark:text-gray-300 italic text-right w-full">
                                                    {activity.creationDate ||
                                                    activity.creationDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`${
                                    currentMode === "dark"
                                        ? "bg-gray-900"
                                        : "bg-gray-200"
                                    } p-2 pb-3 space-y-3 rounded-md shadow-md my-2 w-full`}
                                >
                                    <div class="grid grid-cols-7 gap-2 w-full">
                                        <div className="col-span-1 flex items-center justify-center">
                                            <MdCalendarMonth size={"25px"} />
                                        </div>
                                        <div className="col-span-6 flex h-full w-full items-center">
                                            <div className="h-full w-5 flex items-center">
                                                <div className="h-full w-0.5 bg-main-red-color pointer-events-none"></div>
                                            </div>
                                            <div className="space-y-1 w-full">
                                                <p className="font-semibold text-sm tracking-wide">
                                                    {activity.note} Meeting Scheduled for <span class="text-main-red-color">{activity.meetingDate} {activity.meetingTime}.</span>
                                                </p>
                                                <p className="text-xs tracking-wide flex items-center">
                                                    <HiUser className="mr-2 text-main-red-color" /><span>{activity.leadName}</span>
                                                </p>
                                                <p className="text-xs tracking-wide flex items-center">
                                                    <BsFillBuildingFill className="mr-2 text-main-red-color" /><span>{activity.project} {activity.enquiryType}</span>
                                                </p>
                                                <p className="text-xs mt-2 dark:text-gray-300 italic text-right w-full">
                                                    {activity.creationDate ||
                                                    activity.creationDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div
                                className={`${
                                currentMode === "dark"
                                    ? "bg-gray-900"
                                    : "bg-gray-200"
                                } p-2 pb-3 space-y-3 rounded-md shadow-md my-2 w-full`}
                            >
                                <div class="grid grid-cols-7 gap-2 w-full">
                                    <div className="col-span-1 flex items-center justify-center">
                                        <ImUserCheck size={"25px"} />
                                    </div>
                                    <div className="col-span-6 flex h-full w-full items-center">
                                        <div className="h-full w-5 flex items-center">
                                            <div className="h-full w-0.5 bg-main-red-color pointer-events-none"></div>
                                        </div>
                                        <div className="space-y-1 w-full">
                                            <p className="font-semibold text-sm tracking-wide">
                                                {activity.note}
                                            </p>
                                            <p className="text-xs tracking-wide flex items-center">
                                                <HiUser className="mr-2 text-main-red-color" /><span>{activity.leadName}</span>
                                            </p>
                                            <p className="text-xs tracking-wide flex items-center">
                                                <BsFillBuildingFill className="mr-2 text-main-red-color" /><span>{activity.project}&nbsp;{activity.enquiryType}</span>
                                            </p>
                                            <p className="text-xs mt-2 dark:text-gray-300 italic text-right w-full">
                                                {activity.creationDate ||
                                                activity.creationDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
                })}
            </Container>
    </>);
}

export default NotificationsMenu;