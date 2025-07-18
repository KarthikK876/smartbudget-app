const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const Expense = require('./models/Expense');
const Category = require('./models/Category');
const authRoutes = require('./routes/auth');
const authenticateToken = require('./middleware/auth');

const app = express();

// ✅ CORS setup
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB connection
mongoose.set('strictQuery', true);
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb+srv://smartbudgetuser:abcdeFGH456@karthikcluster.gbmaecc.mongodb.net/smartbudget2?retryWrites=true&w=majority&appName=KarthikCluster'
)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Auth routes
app.use('/api/auth', authRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('SmartBudget API is running');
});

// ✅ Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Working!' });
});

// ✅ Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get user's expenses (protected)
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenses = await Expense.find({ userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create expense (protected)
app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const cleanedCategory = req.body.category?.trim() || 'Uncategorized';
    const cleanedSubcategory = req.body.subcategory?.trim() || 'General';

    const expense = new Expense({
      ...req.body,
      userId: req.user.userId,
      category: cleanedCategory,
      subcategory: cleanedSubcategory
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Update expense (protected & user-scoped)
app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const cleanedCategory = req.body.category?.trim() || 'Uncategorized';
    const cleanedSubcategory = req.body.subcategory?.trim() || 'General';

    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        ...req.body,
        category: cleanedCategory,
        subcategory: cleanedSubcategory
      },
      { new: true }
    );

    if (!updated) {
      return res.status(403).json({ error: 'Unauthorized or not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete expense (protected & user-scoped)
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!deleted) {
      return res.status(403).json({ error: 'Unauthorized or not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
