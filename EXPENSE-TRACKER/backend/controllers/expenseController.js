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

// Maximum allowed amount and date for expense records
const MAX_AMOUNT = 1000000000000;
const MAX_DATE = new Date("2070-12-31");

// Add Expense - Validates input and creates a new expense record with category, amount, date, and icon
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;
        
        // Validate all required fields are present
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate amount does not exceed the allowed maximum value
        if (Number(amount) > MAX_AMOUNT) {
            return res.status(400).json({
                message: "Сумата не може да бъде по-голяма от 1 трилион.",
            });
        }

        // Validate date does not exceed the allowed maximum date
        if (new Date(date) > MAX_DATE) {
            return res.status(400).json({
                message: "Датата не може да бъде след 31.12.2070 г.",
            });
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
        console.error("addExpense error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get All Expenses - Retrieves all expenses for the authenticated user sorted by date (newest first)
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        console.error("getAllExpense error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Expense - Removes an expense record by ID
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("deleteExpense error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Download Expense Excel - Generates expense data as an Excel file in memory and sends it directly to the client
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    // Translation map for expense categories
    const categoryTranslations = {
        "Rent": "Наем",
        "Groceries": "Хранителни стоки",
        "Transport": "Транспорт",
        "Food": "Храна",
        "Entertainment": "Развлечение",
        "Utilities": "Комунални услуги",
        "Health": "Здраве",
        "Travel": "Пътуване",
        "Music Subscription": "Музикален абонамент",
        "Loan": "Заем",
    };

    // Format date in Bulgarian readable form
    const formatDateBG = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const monthNames = ["янв.", "февр.", "март", "апр.", "май", "юни", "юли", "авг.", "сеп.", "окт.", "ное.", "дек."];
        const monthShort = monthNames[d.getMonth()];
        const year = d.getFullYear();

        let ordinal = "-ти";
        if (day === 1 || day === 21 || day === 31) ordinal = "-ви";
        else if (day === 2 || day === 22) ordinal = "-ри";

        return `${day}${ordinal} ${monthShort} ${year}`;
    };

    try {
        const currencyCode = req.query.currency;

        // Select requested currency or fallback to USD
        const selectedCurrency =
            currencyOptions.find((currency) => currency.code === currencyCode) ||
            currencyOptions[0];

        const { symbol, rate, code } = selectedCurrency;

        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel with Bulgarian translations and converted values
        const data = expense.map((item) => {
            const convertedAmount = Number((item.amount * rate).toFixed(2));
            return {
                Категория: categoryTranslations[item.category] || item.category,
                [`Сума (${symbol} / ${code})`]: convertedAmount,
                Дата: formatDateBG(item.date),
            };
        });

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);

        // Set column widths
        ws["!cols"] = [
            { wch: 22 }, // Категория
            { wch: 18 }, // Сума
            { wch: 20 }, // Дата
        ];

        xlsx.utils.book_append_sheet(wb, ws, "Expenses");

        // Generate Excel file in memory instead of writing to disk
        const buffer = xlsx.write(wb, {
            type: "buffer",
            bookType: "xlsx",
        });

        // Send Excel file directly to client
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="expense_details.xlsx"'
        );

        return res.status(200).send(buffer);
    } catch (error) {
        console.error("downloadExpenseExcel error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
