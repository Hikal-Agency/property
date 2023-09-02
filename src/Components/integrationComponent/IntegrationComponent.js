import React from "react";
import FbIntegration from "./FbIntegration";
import GoogleCalendarIntegration from "./GoogleCalendarIntegration";

const IntegrationComponent = () => {
  return (
    <div className=" grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
      <div>
        <FbIntegration />
      </div>
      <div>
        <GoogleCalendarIntegration />
      </div>
    </div>
  );
};

export default IntegrationComponent;
