// Expense Tracker - Backend
// Express API + PostgreSQL

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = 3000;

// =========================
// PostgreSQL Connection
// =========================

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// =========================
// Middleware
// =========================

app.use(cors());
app.use(express.json());

// =========================
// GET - All Expenses
// =========================

app.get("/api/expenses", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            FROM expenses
        `);

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// =========================
// GET - Expense by ID
// =========================

app.get("/api/expenses/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        const result = await pool.query(
            `
            SELECT
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            FROM expenses
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// =========================
// POST - Add Expense
// =========================

app.post("/api/expenses", async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        if (!title || !amount || !category || !date) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        const allowedCategories = [
            "Food",
            "Transport",
            "Bills",
            "Entertainment",
            "Other"
        ];

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                message: "Invalid category"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO expenses (title, amount, category, date)
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            `,
            [title, amount, category, date]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// =========================
// PUT - Update Expense
// =========================

app.put("/api/expenses/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, amount, category, date } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        if (!title || !amount || !category || !date) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        const allowedCategories = [
            "Food",
            "Transport",
            "Bills",
            "Entertainment",
            "Other"
        ];

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                message: "Invalid category"
            });
        }

        const result = await pool.query(
            `
            UPDATE expenses
            SET
                title = $1,
                amount = $2,
                category = $3,
                date = $4
            WHERE id = $5
            RETURNING
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            `,
            [title, amount, category, date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// =========================
// DELETE - Expense
// =========================

app.delete("/api/expenses/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        const result = await pool.query(
            `
            DELETE FROM expenses
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// =========================
// Start Server
// =========================

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});