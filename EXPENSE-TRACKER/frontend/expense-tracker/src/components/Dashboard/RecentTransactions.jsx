import React from "react";
import { LuArrowRight } from "react-icons/lu";
import  TransactionInfoCard  from "../Cards/TransactionInfoCard";
import { formatDateBGFull } from "../../utils/helper";

// Component - Displays the 5 most recent income and expense transactions with link to view all
const RecentTransactions = ({ transactions, onSeeMore, currencySymbol = "$"}) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between ">
                <h5 className="text-lg">Скорошни трансакции</h5>

                <button className="card-btn" onClick={onSeeMore}>
                    Виж всички <LuArrowRight className="text-base" />
                </button>
            </div>

            <div className="mt-6">
                {transactions?.slice(0,5)?.map((item) => (
                    <TransactionInfoCard
                        key={item._id}
                        title={item.type == 'expense' ? item.category : item.source}
                        icon={item.icon}
                        date={formatDateBGFull(item.date)}
                        amount={item.amount}
                        type={item.type}
                        currencySymbol={currencySymbol}
                        hideDeleteBtn
                    />
                ))}
             </div>
        </div>
    );
};

export default RecentTransactions;
