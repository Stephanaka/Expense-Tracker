import React from 'react';

// Card component - Displays financial info (income, expenses, balance) with icon and formatted value
// Updated to support currency symbol display for global currency conversion
const InfoCard = ({ icon, label, value, currencySymbol = "$", color }) => {
    return <div className="flex gap-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
        <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full dropshadow-xl`}>
            {icon}
        </div>
        <div>
            <h6 className="text-sm text-gray-500 mb-1">{label}</h6>
            <span className="text-[22px]">{currencySymbol}{value}</span>
        </div>
    </div>;
};

export default InfoCard;