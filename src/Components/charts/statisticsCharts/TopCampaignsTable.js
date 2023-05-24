import React from "react";

const TopCampaignsTable = ({ tablData }) => {
  console.log("Top Campaigns", tablData);
  return (
    <div className="w-full" style={{ maxHeight: "300px", overflow: "auto" }}>
      <table className="w-full">
        <thead>
          <tr>
            <th className="border-b border-gray-300 py-2">id</th>
            <th className="border-b border-gray-300 py-2">Name</th>
            <th className="border-b border-gray-300 py-2">Ads</th>
          </tr>
        </thead>
        <tbody>
          {tablData?.length > 0 ? (
            tablData?.map((data) => (
              <tr key={data.name}>
                <td className="border-b border-gray-300 py-2 text-center">
                  {data?.id}
                </td>
                <td className="border-b border-gray-300 py-2 text-center">
                  {data?.name ? `${data?.name}` : "No data"}
                </td>
                <td className="border-b border-gray-300 py-2 text-center">
                  {data?.ads?.data ? `${data?.ads?.data.length}` : "No data"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border-b border-gray-300 py-2 text-center"
                colSpan="3"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopCampaignsTable;
