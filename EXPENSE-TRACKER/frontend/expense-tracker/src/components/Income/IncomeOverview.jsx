import React, { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData } from "../../utils/helper";

// Component - Displays bar chart visualization of income over time with button to add new income
const IncomeOverview = ({ transactions, onAddIncome, currencySymbol = "$" }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions);
        setChartData(result);

        return () => {};
    }, [transactions]);

  return( 
        <div className="card">
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg">Обзор на приходите</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Проследи своите приходи и анализирай тенденциите на пестене.
                    </p>
                </div>

                <button className="add-btn" onClick={onAddIncome}>
                    <LuPlus className="text-lg" />
                    Добави приход
                </button>
            </div>

            <div className="mt-10">
                <CustomBarChart data={chartData} currencySymbol={currencySymbol} />
            </div>
                 
        </div>
   );
};

export default IncomeOverview;