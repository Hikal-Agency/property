import React from "react";

const CombinationChartTable = () => {
  // Sample data for the table
  const tableData = [
    { name: "John", sales: 50, revenue: 80 },
    { name: "Alice", sales: 70, revenue: 60 },
    { name: "Bob", sales: 60, revenue: 70 },
    { name: "Jane", sales: 80, revenue: 50 },
  ];

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th className="border-b border-gray-300 py-2">Name</th>
            <th className="border-b border-gray-300 py-2">Sales</th>
            <th className="border-b border-gray-300 py-2">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data) => (
            <tr key={data.name}>
              <td className="border-b border-gray-300 py-2">{data.name}</td>
              <td className="border-b border-gray-300 py-2">
                <div className="h-2 bg-blue-500 w-full">
                  <div
                    className="h-full bg-blue-800"
                    style={{ width: `${data.sales}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 ml-2">{data.sales}</span>
              </td>
              <td className="border-b border-gray-300 py-2">
                <div className="h-2 bg-blue-500 w-full">
                  <div
                    className="h-full bg-blue-800"
                    style={{ width: `${data.revenue}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 ml-2">
                  {data.revenue}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CombinationChartTable;
