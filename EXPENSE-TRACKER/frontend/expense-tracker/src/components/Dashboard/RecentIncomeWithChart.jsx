// Component - Displays pie chart of income sources for the last 60 days with total amount
import React, {useState,useEffect} from "react";
import CustomPieChart from "../Charts/CustomPieChart";
import { translateSource } from "../../utils/helper";

// Color palette for pie chart - Kept colorful as requested, not changed to blue theme
const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomeWithChart = ({data, totalIncome, currencySymbol = "$"}) => {

    const [chartData, setChartData] = useState([]);

    const prepareChartData = () => {
        const dataArr = data?.map((item) => ({
            name: translateSource(item?.source),
            amount: item?.amount,
            currencySymbol,
        }));

        setChartData(dataArr);
    };

    useEffect(() => {
        prepareChartData();

        return () => {};
    }, [data, currencySymbol]);


    return (
        <div className="card">
            <div className="flex items-center justify-between ">
                <h5 className="text-lg">Приходи за последните 60 дни</h5>
            </div>

            <CustomPieChart
                data={chartData}
                label="Общо приходи"
                totalAmount={`${currencySymbol}${totalIncome}`}
                showTextAnchor
                colors={COLORS}
                currencySymbol={currencySymbol}
            />
        </div>
    )
}

export default RecentIncomeWithChart;