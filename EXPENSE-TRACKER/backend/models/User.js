const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

// User Schema - Defines the structure for user documents with authentication and profile data
const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileImageUrl: { type: String, default: null },
    },
    { timestamps: true }
);

// Middleware - Hash password before saving user to database using bcrypt
// Automatically runs before each save() operation if password field changed
UserSchema.pre("save", async function () {
    // Skip hashing if password wasn't modified (e.g., updating other fields only)
    if (!this.isModified("password")) return;
    // Hash password using bcrypt with 10 salt rounds for security
    this.password = await bcrypt.hash(this.password, 10);
});

// Method - Compare provided password with hashed password for login verification
// Used during login to verify user's entered password matches stored hash
UserSchema.methods.comparePassword = async function (candidatePassword) {
    // bcrypt.compare handles secure comparison of plain text vs hashed password
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);