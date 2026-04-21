import React, { useEffect, useState }  from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import InfoCard from "../../components/Cards/InfoCard";
import { useCurrency } from "../../context/CurrencyContext";

import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard} from "react-icons/io";
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinancialOverview from "../../components/Dashboard/FinancialOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

// Dashboard Home page - Displays financial overview with income, expenses, balance, and recent transactions
const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const {
    currencyOptions,
    activeCurrency,
    currencySymbol,
    applyCurrency,
    convertDashboardData,
  } = useCurrency();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(activeCurrency.code);

  const selectedCurrency = currencyOptions.find(
    (currency) => currency.code === selectedCurrencyCode
  );

  // Handle currency conversion - Apply selected currency globally
  // New functionality: Global currency conversion menu on home page
  const handleConvert = () => {
    if (selectedCurrency) {
      applyCurrency(selectedCurrency.code);
      setCurrencyMenuOpen(false);
    }
  };

  // Fetch all dashboard statistics and transaction data from API
  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  const convertedDashboardData = convertDashboardData(dashboardData);

  const incomeTransactions = convertedDashboardData?.recentTransactions
    ?.filter((tx) => tx.source)
    .slice(0, 4) || [];

  const incomeTransactionsForCard = convertedDashboardData?.recentTransactions
    ?.filter((tx) => tx.type === "income" || tx.source)
    .slice(0, 5) || [];

  const recentTransactions = convertedDashboardData?.recentTransactions || [];
  const last30DaysExpensesData = convertedDashboardData?.last30DaysExpenses?.transactions || [];

  return (
     <DashboardLayout activeMenu="Начало">
       <div className="my-5 mx-auto">
         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
           <div />

           <div className="relative">
             <button
               className="btn-primary inline-flex items-center gap-2"
               onClick={() => setCurrencyMenuOpen((prev) => !prev)}
             >
               Превалутиране на валута
             </button>

             {currencyMenuOpen && (
               <div className="absolute right-0 z-20 mt-3 w-72 rounded-3xl border border-blue-100 bg-white p-4 shadow-xl shadow-blue-200/20">
                 <p className="text-sm font-semibold text-gray-700 mb-3">Избери валута</p>
                 <div className="grid gap-2">
                   {currencyOptions.map((currency) => (
                     <button
                       key={currency.code}
                       type="button"
                       className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                         selectedCurrencyCode === currency.code
                           ? "border-blue-500 bg-blue-50 text-blue-700"
                           : "border-gray-200 bg-white text-gray-700 hover:border-blue-400"
                       }`}
                       onClick={() => setSelectedCurrencyCode(currency.code)}
                     >
                       <span className="font-medium">{currency.label}</span>
                       <span className="ml-2 text-xs text-gray-500">{currency.symbol}</span>
                     </button>
                   ))}
                 </div>
                 <button
                   type="button"
                   className="btn-primary mt-4 w-full"
                   onClick={handleConvert}
                 >
                   Превалутиране
                 </button>
               </div>
             )}
           </div>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard/>}
            label="Общо баланс"
            value={addThousandsSeparator(convertedDashboardData?.totalBalance || 0)}
            currencySymbol={activeCurrency.symbol}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal/>}
            label="Общо приходи"
            value={addThousandsSeparator(convertedDashboardData?.totalIncome || 0)}
            currencySymbol={activeCurrency.symbol}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LuHandCoins/>}
            label="Общо разходи"
            value={addThousandsSeparator(convertedDashboardData?.totalExpense || 0)}
            currencySymbol={activeCurrency.symbol}
            color="bg-red-500"
          />
        </div> 

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={recentTransactions}
            currencySymbol={activeCurrency.symbol}
            onSeeMore={() => navigate("/expense")}
          />

          <FinancialOverview
            totalBalance={convertedDashboardData?.totalBalance || 0}
            totalIncome={convertedDashboardData?.totalIncome || 0}
            totalExpense={convertedDashboardData?.totalExpense || 0}
            currencySymbol={activeCurrency.symbol}
          />

          <ExpenseTransactions
            transactions={last30DaysExpensesData}
            currencySymbol={activeCurrency.symbol}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpenses
            data={last30DaysExpensesData}
            currencySymbol={activeCurrency.symbol}
          />

          <RecentIncomeWithChart
            data={incomeTransactions}
            totalIncome={convertedDashboardData?.totalIncome || 0}
            currencySymbol={activeCurrency.symbol}
          />

          <RecentIncome
            transactions={incomeTransactionsForCard}
            currencySymbol={activeCurrency.symbol}
            onSeeMore={() => navigate("/income")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Home;