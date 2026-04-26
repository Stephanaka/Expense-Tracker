import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

// Maximum allowed amount and date for income entries
const MAX_AMOUNT = 1000000000;
const MAX_DATE = "2070-12-31";

// Form component - Collects income data (source, amount, date, icon) for adding new income
const AddIncomeForm = ({onAddIncome}) => {
    // Local form state - holds all income fields being entered by user
    const [income, setIncome] = useState({
        source: "",    // Income source (Salary, Freelance, etc.)
        amount: "",    // Income amount in currency
        date: "",      // Date of income receipt
        icon: "",      // Emoji/icon selected for visual representation
    });

    const [error, setError] = useState("");

    // Update specific form field and preserve other fields using spread operator
    const handleChange = (key, value) => setIncome({...income, [key]: value});

    // Validate income data before submitting it to parent component
    const handleSubmit = () => {
        setError("");

        if (Number(income.amount) > MAX_AMOUNT) {
            setError("Сумата не може да бъде по-голяма от 1 милиард.");
            return;
        }

        if (income.date && income.date > MAX_DATE) {
            setError("Датата не може да бъде след 31.12.2070 г.");
            return;
        }

        onAddIncome(income);
    };

    return (
        <div>

            {/* Emoji picker for selecting income icon */}
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            {/* Income source input field */}
            <Input
                value={income.source}
                onChange={({ target }) => handleChange("source", target.value)}
                label="Категория"
                placeholder="Фрилансър, Заплата и т.н."
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
                    Добави приход
                </button>
            </div>
        </div>
    )
}

export default AddIncomeForm;
