import { Container } from "@mui/system";

const NotificationsMenu = () => {
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
            </Container>
    </>);
}

export default NotificationsMenu;