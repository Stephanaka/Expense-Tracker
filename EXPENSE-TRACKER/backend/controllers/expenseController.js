
const xlsx = require("xlsx");
const Expense = require("../models/Expense");

const currencyOptions = [
    { code: "USD", symbol: "$", rate: 1 },
    { code: "EUR", symbol: "€", rate: 0.93 },
    { code: "JPY", symbol: "¥", rate: 149.46 },
    { code: "GBP", symbol: "£", rate: 0.81 },
    { code: "TRY", symbol: "₺", rate: 34.21 },
    { code: "INR", symbol: "₹", rate: 83.74 },
];

// Add Expense - Validates input and creates a new expense record with category, amount, date, and icon
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;
        
        // Validate all required fields are present
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        console.error('addExpense error:', error);
        res.status(500).json({ message: "Server Error" });
    }
}

// Get All Expenses - Retrieves all expenses for the authenticated user sorted by date (newest first)
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        console.error('getAllExpense error:', error);
        res.status(500).json({ message: "Server Error" });
    }
}

// Delete Expense - Removes an expense record by ID
exports.deleteExpense = async (req, res) => {

    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error('deleteExpense error:', error);
        res.status(500).json({ message: "Server Error" });
    }

}

// Download Expense Excel - Generates and downloads expense data as an Excel file with Bulgarian translations
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    // Translation map for expense categories
    const categoryTranslations = {
        "Rent": "Наем",
        "Groceries": "Хранителни стоки",
        "Transport": "Транспорт",
        "Food": "Храна",
        "Entertainment": "Развлечение",
        "Utilities": "Коммунални услуги",
        "Health": "Здравство",
        "Travel": "Пътуване",
        "Music Subscription": "Музикален абонамент",
        "Loan": "Заем",
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

        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel with Bulgarian translations
        const data = expense.map((item) => {
            const convertedAmount = Number((item.amount * rate).toFixed(2));
            return {
                Категория: categoryTranslations[item.category] || item.category,
                [`Сума (${symbol})`]: convertedAmount,
                Дата: formatDateBG(item.date),
            };
        });

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        
        // Set column widths
        ws['!cols'] = [
            { wch: 20 }, // Категория
            { wch: 12 }, // Сума
            { wch: 18 }  // Дата
        ];
        
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    } catch (error) {
        console.error('downloadExpenseExcel error:', error);
        res.status(500).json({ message: "Server Error" });
    }
}