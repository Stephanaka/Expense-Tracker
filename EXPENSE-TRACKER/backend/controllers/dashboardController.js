const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Dashboard Data - Aggregates financial overview including totals, recent transactions, and 60-day/30-day summaries
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        // Convert userId to MongoDB ObjectId for aggregation pipeline compatibility
        const userObjectId = new Types.ObjectId(String(userId));

        // Calculate total income across ALL user transactions using aggregation pipeline
        // $match: filter by user, $group: sum all amounts
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        // Calculate total expenses across ALL user transactions using aggregation pipeline
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        // Fetch all income transactions from the last 60 days for charts and analysis
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            // Filter: date must be within last 60 days (current time - 60*24*60*60*1000 milliseconds)
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });
        
        // Calculate sum of all income in the last 60 days using reduce function
        const IncomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Fetch all expense transactions from the last 30 days for dashboard overview
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            // Filter: date must be within last 30 days
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        // Calculate sum of all expenses in the last 30 days
        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Combine last 5 income and last 5 expense transactions for recent activity feed
        // Add type field to identify transaction source, then sort all by date (newest first)
        const lastTransactions = [
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a, b) => b.date - a.date); // Sort latest transactions first

        // Return comprehensive dashboard data
        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: IncomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}
        