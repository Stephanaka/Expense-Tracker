import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

// Form component - Collects income data (source, amount, date, icon) for adding new income
const AddIncomeForm = ({onAddIncome}) => {
    // Local form state - holds all income fields being entered by user
    const [income, setIncome] = useState({
        source: "",    // Income source (Salary, Freelance, etc.)
        amount: "",    // Income amount in currency
        date: "",      // Date of income receipt
        icon: "",      // Emoji/icon selected for visual representation
    });

    // Update specific form field and preserve other fields using spread operator
    const handleChange = (key, value) => setIncome({...income, [key]: value});
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
                    onClick={() => onAddIncome(income)}
                >
                    Добави приход
                </button>
            </div>
        </div>
    )
}

export default AddIncomeForm;