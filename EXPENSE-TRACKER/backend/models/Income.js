const mongoose = require("mongoose");

// Income Schema - Stores income transaction data linked to a user with source, amount, and date
const IncomeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String },
    source: { type: String, required: true }, // Examples: Salary, Freelance, Investment, Bonus, Gift
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Income", IncomeSchema);