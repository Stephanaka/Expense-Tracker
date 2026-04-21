import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addThousandsSeparator } from "../utils/helper";

export const CurrencyContext = createContext();

// Currency Options - Available currencies with exchange rates relative to USD
// Added for global currency conversion functionality
const currencyOptions = [
  { code: "USD", label: "Щатски долар", symbol: "$", rate: 1 },
  { code: "EUR", label: "Евро", symbol: "€", rate: 0.93 },
  { code: "JPY", label: "Японска йена", symbol: "¥", rate: 149.46 },
  { code: "GBP", label: "Британска лира", symbol: "£", rate: 0.81 },
  { code: "TRY", label: "Турска лира", symbol: "₺", rate: 34.21 },
  { code: "INR", label: "Индийска рупия", symbol: "₹", rate: 83.74 },
];

// Get saved currency from localStorage or default to USD
const getSavedCurrency = () => {
  try {
    const raw = window.localStorage.getItem("selectedCurrency");
    if (!raw) return currencyOptions[0];
    const parsed = JSON.parse(raw);
    return currencyOptions.find((currency) => currency.code === parsed.code) || currencyOptions[0];
  } catch (error) {
    return currencyOptions[0];
  }
};

// CurrencyProvider - Global context for currency conversion and symbol management
const CurrencyProvider = ({ children }) => {
  const [activeCurrency, setActiveCurrency] = useState(getSavedCurrency);

  // Save currency selection to localStorage
  useEffect(() => {
    window.localStorage.setItem("selectedCurrency", JSON.stringify(activeCurrency));
  }, [activeCurrency]);

  const currencySymbol = activeCurrency.symbol;

  // Get currency by code
  const getCurrency = (code) => currencyOptions.find((currency) => currency.code === code) || activeCurrency;

  // Apply new currency selection
  const applyCurrency = (code) => {
    const currency = getCurrency(code);
    setActiveCurrency(currency);
  };

  // Convert value to active currency
  const convertValue = (value) => {
    if (value == null || isNaN(value)) return 0;
    return Number((value * activeCurrency.rate).toFixed(2));
  };

  // Format currency value with thousands separator
  const formatCurrencyValue = (value) => {
    return addThousandsSeparator(convertValue(value));
  };

  // Convert array of transactions to active currency
  const convertTransactions = (transactions = []) => {
    return transactions?.map((tx) => ({
      ...tx,
      amount: convertValue(tx.amount),
    })) || [];
  };

  // Convert dashboard data (balance, income, expense, transactions)
  const convertDashboardData = (data) => {
    if (!data) return null;

    return {
      ...data,
      totalBalance: convertValue(data.totalBalance),
      totalIncome: convertValue(data.totalIncome),
      totalExpense: convertValue(data.totalExpense),
      recentTransactions: convertTransactions(data.recentTransactions),
      last30DaysExpenses: {
        ...(data.last30DaysExpenses || {}),
        transactions: convertTransactions(data.last30DaysExpenses?.transactions),
      },
    };
  };

  const value = useMemo(
    () => ({
      currencyOptions,
      activeCurrency,
      currencySymbol,
      applyCurrency,
      convertValue,
      formatCurrencyValue,
      convertTransactions,
      convertDashboardData,
    }),
    [activeCurrency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => useContext(CurrencyContext);

export default CurrencyProvider;
