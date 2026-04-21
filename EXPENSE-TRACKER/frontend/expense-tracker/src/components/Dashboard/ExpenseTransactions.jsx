import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { formatDateBGFull } from "../../utils/helper";

// Component - Displays the 5 most recent expense transactions with link to view all
const ExpenseTransactions = ({transactions, onSeeMore, currencySymbol = "$"}) => {
    return(
        <div className="card">
            <div className="flex items-center justify-between ">
                <h5 className="text-lg">Разходи</h5>

                <button className="card-btn" onClick={onSeeMore}>
                    Виж всички <LuArrowRight className="text-base" />
                </button>
            </div>

            <div className="mt-6">
                {transactions?.slice(0,5)?.map((expense) => (
                    <TransactionInfoCard
                        key={expense._id}
                        title={expense.category}
                        icon={expense.icon}
                        date={formatDateBGFull(expense.date)}
                        amount={expense.amount}
                        type="expense"
                        currencySymbol={currencySymbol}
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    );
};

export default ExpenseTransactions;