import React from "react";

const CombinationChartTable = ({ tablData }) => {
  console.log("Table: ", tablData);

  return (
    <div className="w-full" style={{ maxHeight: "300px", overflow: "auto" }}>
      {/* <table className="w-full">
        <thead>
          <tr>
            <th className="border-b border-gray-300 py-2">Name</th>
            <th className="border-b border-gray-300 py-2">Impressions</th>
            <th className="border-b border-gray-300 py-2">Clicks</th>
          </tr>
        </thead>
        <tbody>
          {tablData?.length > 0 &&
            tablData?.map((data) => (
              <tr key={data.name}>
                <td className="border-b border-gray-300 py-2">
                  {data?.campaignName}
                </td>
                <td className="border-b border-gray-300 py-2">
                  <div
                    className="h-2 bg-blue-500 w-ful max-w-[200px]"
                    sx={{ maxWidth: "40px" }}
                  >
                    <div
                      className="h-full bg-blue-800"
                      style={{ width: `${data?.impressions}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 ml-2">
                    {data?.impressions}
                  </span>
                </td>
                <td
                  className="border-b border-gray-300 py-2 "
                  sx={{ width: "40px" }}
                >
                  <div className="h-2 bg-blue-500">
                    <div
                      className="h-full bg-blue-800"
                      style={{ width: `${data?.clicks}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 ml-2">
                    {data?.clicks}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table> */}

      <table className="w-full">
        <thead>
          <tr>
            <th className="border-b border-gray-300 py-2">Name</th>
            <th className="border-b border-gray-300 py-2">Impressions</th>
            <th className="border-b border-gray-300 py-2">Clicks</th>
          </tr>
        </thead>
        <tbody>
          {tablData?.length > 0 ? (
            tablData?.map((data) => (
              <tr key={data.name}>
                <td className="border-b border-gray-300 py-2 text-center">
                  {data?.campaignName}
                </td>
                <td className="border-b border-gray-300 py-2 text-center">
                  {data?.impressions ? `${data?.impressions}` : "No data"}
                </td>
                <td className="border-b border-gray-300 py-2 text-center">
                  {data?.clicks ? `${data?.clicks}` : "No data"}
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

export default CombinationChartTable;
