import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

// Form component - Collects expense data (category, amount, date, icon) for adding new expense
const AddExpenseForm = ({ onAddExpense }) => {
    // Local form state - holds all expense fields being entered by user
    const [income, setIncome] = useState({
        category: "",  // Expense type (Food, Transport, etc.)
        amount: "",    // Expense amount in currency
        date: "",      // Date of expense
        icon: "",      // Emoji/icon selected for visual representation
    });

    // Update specific form field and preserve other fields using spread operator
    const handleChange = (key, value) => setIncome({...income, [key]: value});

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
        />

        <Input
            value={income.date}
            onChange={({ target }) => handleChange("date", target.value)}
            label="Дата"
            placeholder=""
            type="date"
        />

        <div className="flex justify-end mt-6">
            <button
                type="button"
                className="add-btn add-btn-fill"
                onClick={() => onAddExpense(income)}
            >
                Добави разход
            </button>
        </div>
    </div>;
};

export default AddExpenseForm;