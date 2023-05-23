import React from "react";

const CombinationChartTable = ({ tablData }) => {
  console.log("Table: ", tablData);
  // Sample data for the table
  // const tableData = [
  //   { name: "John", sales: 50, revenue: 80 },
  //   { name: "Alice", sales: 70, revenue: 60 },
  //   { name: "Bob", sales: 60, revenue: 70 },
  //   { name: "Jane", sales: 80, revenue: 50 },
  // ];

  // Calculate the maximum value for impressions and clicks
  // const maxImpressions = Math.max(...tablData?.map((data) => data.impressions));
  // const maxClicks = Math.max(...tablData?.map((data) => data.clicks));

  return (
    <div className="w-full" style={{ maxHeight: "300px", overflow: "auto" }}>
      <table className="w-full">
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
                <td className="border-b border-gray-300 py-2 ">
                  <div
                    className="h-2 bg-blue-500  w-[90px]"
                    sx={{ maxWidth: "40px" }}
                  >
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
      </table>

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
                  <div className="h-2 bg-blue-500 w-full max-w-[200px]">
                    <div
                      className="h-full bg-blue-800"
                      style={{
                        width: `${(data?.impressions / maxImpressions) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 ml-2">
                    {`${((data?.impressions / maxImpressions) * 100).toFixed(
                      2
                    )}%`}
                  </span>
                </td>
                <td className="border-b border-gray-300 py-2">
                  <div className="h-2 bg-blue-500 w-full max-w-[200px]">
                    <div
                      className="h-full bg-blue-800"
                      style={{ width: `${(data?.clicks / maxClicks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 ml-2">
                    {`${((data?.clicks / maxClicks) * 100).toFixed(2)}%`}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default CombinationChartTable;
