import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

// Maximum allowed amount and date for expense entries
const MAX_AMOUNT = 1000000000000;
const MAX_DATE = "2070-12-31";

// Form component - Collects expense data (category, amount, date, icon) for adding new expense
const AddExpenseForm = ({ onAddExpense }) => {
    // Local form state - holds all expense fields being entered by user
    const [income, setIncome] = useState({
        category: "",  // Expense type (Food, Transport, etc.)
        amount: "",    // Expense amount in currency
        date: "",      // Date of expense
        icon: "",      // Emoji/icon selected for visual representation
    });

    const [error, setError] = useState("");

    // Update specific form field and preserve other fields using spread operator
    const handleChange = (key, value) => setIncome({ ...income, [key]: value });

    // Validate expense data before submitting it to parent component
    const handleSubmit = () => {
        setError("");

        if (Number(income.amount) > MAX_AMOUNT) {
            setError("Сумата не може да бъде по-голяма от 1 трилион.");
            return;
        }

        if (income.date && income.date > MAX_DATE) {
            setError("Датата не може да бъде след 31.12.2070 г.");
            return;
        }

        onAddExpense(income);
    };

    return <div>
        {/* Emoji picker for selecting expense icon */}
        <EmojiPickerPopup
            icon={income.icon}
            onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />

        {/* Expense category input field */}
        <Input
            value={income.category}
            onChange={({ target }) => handleChange("category", target.value)}
            label="Категория"
            placeholder="Наем, Хранителни стоки и т.н."
            type="text"
        />

        <Input
            value={income.amount}
            onChange={({ target }) => handleChange("amount", target.value)}
            label="Сума"
            placeholder=""
            type="number"
            max={MAX_AMOUNT}
        />

        <Input
            value={income.date}
            onChange={({ target }) => handleChange("date", target.value)}
            label="Дата"
            placeholder=""
            type="date"
            max={MAX_DATE}
        />

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <div className="flex justify-end mt-6">
            <button
                type="button"
                className="add-btn add-btn-fill"
                onClick={handleSubmit}
            >
                Добави разход
            </button>
        </div>
    </div>;
};

export default AddExpenseForm;
