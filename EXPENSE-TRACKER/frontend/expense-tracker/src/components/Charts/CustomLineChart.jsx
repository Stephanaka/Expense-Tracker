import React from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";

// Custom area chart component - Displays expense/income trends over time with gradient fill and tooltip
const CustomLineChart = ({ data, currencySymbol = "$" }) => {

    const CustomToolTip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                    <p className="text-xs font-semibold text-blue-800 mb-1">{payload[0].payload.category}</p>
                    <p className="text-sm text-gray-600">
                        Сума: <span className="text-sm font-medium text-gray-900">{currencySymbol}{payload[0].payload.amount}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return <div className="bg-white">
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                    {/* Linear gradient for area chart fill - Updated to blue theme for consistency */}
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid stroke="none"/>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                <Tooltip content={<CustomToolTip currencySymbol={currencySymbol} />} />

                <Area type="monotone" dataKey="amount" stroke="#1d4ed8" fill="url(#incomeGradient)" strokeWidth={3} dot={{ r: 3, fill: "#60a5fa" }}  />
            </AreaChart>
        </ResponsiveContainer>
    </div>;
};

export default CustomLineChart;