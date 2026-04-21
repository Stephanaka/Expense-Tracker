const mongoose = require("mongoose");

// Expense Schema - Stores expense transaction data linked to a user with category, amount, and date
const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String },
    category: { type: String, required: true }, // Examples: Food, Transport, Rent, Entertainment
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Expense", ExpenseSchema);