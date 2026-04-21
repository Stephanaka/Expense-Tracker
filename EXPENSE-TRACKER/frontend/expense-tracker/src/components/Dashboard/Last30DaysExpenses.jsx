import React, { useEffect, useState } from "react";
import { prepareExpenseBarChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

// Component - Displays bar chart visualization of expenses for the last 30 days
const Last30DaysExpenses = ({data, currencySymbol = "$"}) => {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareExpenseBarChartData(data);
        setChartData(result);

        return () => {};
    }, [data]);

    return (
        <div className="card col-span-1">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Разходи за последните 30 дни</h5>
            </div>

            <CustomBarChart data={chartData} currencySymbol={currencySymbol} />
        </div>
    )
}

export default Last30DaysExpenses;

