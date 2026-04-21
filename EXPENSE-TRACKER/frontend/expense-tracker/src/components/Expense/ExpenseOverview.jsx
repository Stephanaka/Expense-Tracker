import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";

// Component - Displays line chart visualization of expenses over time with button to add new expense
const ExpenseOverview = ({transactions, onExpenseIncome, currencySymbol = "$"}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions);
        setChartData(result);

        return () => {};
    }, [transactions]);

    return <div className="card">
        <div className="flex items-center justify-between">
            <div className="">
                <h5 className="text-lg">Обзор на разходите</h5>
                <p className="text-xs text-gray-400 mt-0.5">Проследи своите разходи и анализирай тенденциите на харчене.
                </p>
            </div>

            <button className="add-btn" onClick={onExpenseIncome}>
                <LuPlus className="text-lg"/>
                Добави разход
            </button>
        </div>

        <div className="mt-10">
            <CustomLineChart data={chartData} currencySymbol={currencySymbol} />
        </div>
    </div>;
};

export default ExpenseOverview;