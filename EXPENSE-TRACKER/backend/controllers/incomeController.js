
const xlsx = require("xlsx");
const Income = require("../models/Income");

const currencyOptions = [
    { code: "USD", symbol: "$", rate: 1 },
    { code: "EUR", symbol: "€", rate: 0.93 },
    { code: "JPY", symbol: "¥", rate: 149.46 },
    { code: "GBP", symbol: "£", rate: 0.81 },
    { code: "TRY", symbol: "₺", rate: 34.21 },
    { code: "INR", symbol: "₹", rate: 83.74 },
];

// Add Income - Validates input and creates a new income record with source, amount, date, and icon
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;
        
        // Validate all required fields are present
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

// Get All Income - Retrieves all income records for the authenticated user sorted by date (newest first)
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

// Delete Income - Removes an income record by ID
exports.deleteIncome = async (req, res) => {


    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }

}

// Download Income Excel - Generates and downloads income data as an Excel file with Bulgarian translations
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    // Translation map for income sources
    const sourceTranslations = {
        "Salary": "Заплата",
        "Freelance": "Фрилансерски работи",
        "Investment": "Инвестиции",
        "Bonus": "Бонус",
        "Gift": "Подарък",
        "Other": "Други",
        "Stake": "Залози",
    };

    const formatDateBG = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const monthNames = ['янв.', 'февр.', 'март', 'апр.', 'май', 'юни', 'юли', 'авг.', 'сеп.', 'окт.', 'ное.', 'дек.'];
        const monthShort = monthNames[d.getMonth()];
        const year = d.getFullYear();
        
        let ordinal = '-ти';
        if (day === 1 || day === 21 || day === 31) ordinal = '-ви';
        else if (day === 2 || day === 22) ordinal = '-ри';
        
        return `${day}${ordinal} ${monthShort} ${year}`;
    };

    try {
        const currencyCode = req.query.currency;
        const selectedCurrency = currencyOptions.find((currency) => currency.code === currencyCode) || currencyOptions[0];
        const { symbol, rate } = selectedCurrency;

        const income = await Income.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel with Bulgarian translations
        const data = income.map((item) => {
            const convertedAmount = Number((item.amount * rate).toFixed(2));
            return {
                Източник: sourceTranslations[item.source] || item.source,
                [`Сума (${symbol})`]: convertedAmount,
                Дата: formatDateBG(item.date),
            };
        });

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        
        // Set column widths
        ws['!cols'] = [
            { wch: 20 }, // Източник
            { wch: 12 }, // Сума
            { wch: 18 }  // Дата
        ];
        
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, 'income_details.xlsx');
        res.download('income_details.xlsx');
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}