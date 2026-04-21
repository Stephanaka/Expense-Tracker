import React from "react";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { formatDateBGFull } from "../../utils/helper";

// Component - Displays list of all expenses with download button and delete functionality
// Updated to support currency symbol display for global currency conversion
const ExpenseList = ({ transactions, onDelete, onDownload, currencySymbol = "$" }) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Всички разходи</h5>

                <button className="card-btn" onClick={onDownload}>
                    <LuDownload className="text-base" /> Изтегли
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {transactions?.map((expense) => (
                    <TransactionInfoCard
                        key={expense._id}
                        title={expense.category}
                        icon={expense.icon}
                        date={formatDateBGFull(expense.date)}
                        amount={expense.amount}
                        type="expense"
                        currencySymbol={currencySymbol}
                        onDelete={() => onDelete(expense._id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ExpenseList;