import React from "react";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { formatDateBGFull } from "../../utils/helper";

// Component - Displays list of all income entries with download button and delete functionality
// Updated to support currency symbol display for global currency conversion
const IncomeList = ({transactions, onDelete, onDownload, currencySymbol = "$"}) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Източници на приход</h5>

                <button className="card-btn" onClick={onDownload}>
                    <LuDownload className="text-base" /> Изтегли
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {transactions?.map((income) => (
                    <TransactionInfoCard
                        key={income._id}
                        title={income.source}
                        icon={income.icon}
                        date={formatDateBGFull(income.date)}
                        amount={income.amount}
                        type="income"
                        currencySymbol={currencySymbol}
                        onDelete={() => onDelete(income._id)}
                    />
                ))}
            </div> 
        </div>   
    )
}

export default IncomeList;