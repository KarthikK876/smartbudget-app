// routes/expenses.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Expense = require('../models/Expense');

// GET all expenses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching expenses' });
  }
});

// POST new expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, amount, category, subcategory, date } = req.body;
    const newExpense = new Expense({ title, amount, category, subcategory, date });
    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Invalid expense data' });
  }
});

// DELETE expense by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await Expense.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting expense' });
  }
});

module.exports = router;
