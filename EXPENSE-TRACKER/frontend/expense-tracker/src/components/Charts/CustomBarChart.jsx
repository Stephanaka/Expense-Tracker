import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

// Custom bar chart component - Displays income/expense data with alternating color bars and custom tooltip
const CustomBarChart = ({data, currencySymbol = "$"}) => {

    // Function to alternate bar colors for visual distinction
    // Updated to blue theme instead of purple for consistent design
    const getBarColor = (index) => {
        return index % 2 === 0 ? "#3b82f6" : "#bfdbfe";
    };

    // Determine which key to use for labels - month or category
    const labelKey = data?.[0]?.month ? "month" : "category";

    const CustomTooltip = ({ active, payload }) => {
        if(active && payload && payload.length) {
            return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                    <p className="text-xs font-semibold text-blue-800 mb-1">{payload[0].payload[labelKey]}</p>
                    <p className="text-sm text-gray-600">
                        Сума: <span className="text-sm font-medium text-gray-900">{currencySymbol}{payload[0].payload.amount}</span>
                    </p>
                </div>
            );
        }
        return null;
    };
    return (
    <div className=" bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
            <CartesianGrid stroke="none"/>

          <XAxis dataKey={labelKey} tick={{ fontSize: 12, fill: "#555" }} axisLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#555"}} stroke= "none" />

          <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />

          <Bar
           dataKey="amount"
           fill="#3b82f6"
           radius={[10, 10, 0, 0]}
           activeDot={{r: 8, fill: "#1d4ed8"}}
           activesStyle={{fill: "#2563eb"}}
           >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

};

export default CustomBarChart;