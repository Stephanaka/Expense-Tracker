import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

// Component - Displays pie chart showing breakdown of total balance, income, and expenses
const FinancialOverview = ({totalBalance, totalIncome, totalExpense, currencySymbol = "$"}) => {
    const balanceData = [
        {name: "Общо баланс", amount: totalBalance, currencySymbol},
        {name: "Общо разходи", amount: totalExpense, currencySymbol},
        {name: "Общо приходи", amount: totalIncome, currencySymbol},
    ];

    return <div className="card">
        <div className="flex items-center justify-between">
            <h5 className="text-lg">Финансов обзор</h5>
        </div>

        <CustomPieChart
            data={balanceData}
            label="Общо баланс"
            totalAmount={`${currencySymbol}${totalBalance}`}
            colors={COLORS}
            showTextAnchor
            currencySymbol={currencySymbol}
        />
    </div>
};

export default FinancialOverview;