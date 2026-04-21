import React from "react";
import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

// Custom pie chart component - Displays data distribution in circular chart with custom legend and tooltip
// Updated to support currency symbols in tooltips for global currency conversion
const CustomPieChart = ({
    data,
    label,
    totalAmount,
    colors,
    showTextAnchor,
    currencySymbol = "$",
}) => {
    // Prepare chart data with currency symbol for tooltip display
    // New functionality: Currency symbol propagation to chart data
    const chartData = data?.map((entry) => ({
        ...entry,
        currencySymbol,
    })) || [];

    // Render tooltip function to ensure currency symbol is passed correctly
    // Fixes tooltip currency display in pie charts
    const renderTooltip = (props) => <CustomTooltip {...props} currencySymbol={currencySymbol} />;

    return <ResponsiveContainer width="100%" height={380}>
        <PieChart>
            <Pie
                data={chartData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                innerRadius={100}
                labelLine={false}
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
            </Pie>
            <Tooltip content={renderTooltip} />
            <Legend content={CustomLegend}/>

            {showTextAnchor && (
                <>
                    <text
                        x="50%"
                        y="50%"
                        dy={-25}
                        textAnchor="middle"
                        fill="#666"
                        fontSize="14px"
                    >
                        {label}
                    </text>
                    <text
                        x="50%"
                        y="50%"
                        dy={8}
                        textAnchor="middle"
                        fill="#333"
                        fontSize="24px"
                        fontWeight="semi-bold"
                    >
                        {totalAmount}
                    </text>
                </>
            )}
        </PieChart>
    </ResponsiveContainer>
};

export default CustomPieChart;