const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Initialize express app
const app = express();

// Middlewares
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.set('strictQuery', true);
mongoose.connect(
  process.env.MONGODB_URI ||
  'mongodb+srv://smartbudgetuser:abcdeFGH456@karthikcluster.gbmaecc.mongodb.net/smartbudget2?retryWrites=true&w=majority&appName=KarthikCluster'
)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const Expense = require('./models/Expense.js');

app.get('/', (req, res) => {
  res.send('SmartBudget API is running');
});

// Expense routes
app.post('/api/expenses', async (req, res) => {
  try {
    const cleanedCategory = req.body.category?.trim() || 'Uncategorized';
    const cleanedSubcategory = req.body.subcategory?.trim() || 'General';
    const expense = new Expense({
      ...req.body,
      category: cleanedCategory,
      subcategory: cleanedSubcategory
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const cleanedCategory = req.body.category?.trim() || 'Uncategorized';
    const cleanedSubcategory = req.body.subcategory?.trim() || 'General';
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        category: cleanedCategory,
        subcategory: cleanedSubcategory
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
