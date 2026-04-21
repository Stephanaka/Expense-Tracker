// Custom tooltip component - Displays transaction details on chart hover with amount and name
import React from "react";

const CustomTooltip = ({active, payload, currencySymbol}) => {
    if(active && payload && payload.length) {
        const symbol = currencySymbol || payload[0]?.payload?.currencySymbol || "$";
        return(
            <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                <p className="text-xs font-semibold text-blue-800 mb-1">
                    {payload[0].name}
                </p>
                <p className="text-sm text-gray-600">
                    Сума:{" "}
                    <span className="text-sm font-medium text-gray-900">
                        {symbol}{payload[0].value}
                    </span>
                </p>
            </div>
        );
    }
    return null;
}

export default CustomTooltip;