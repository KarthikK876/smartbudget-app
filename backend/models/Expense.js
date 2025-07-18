const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Uncategorized' },
  subcategory: { type: String, default: 'General' }, // ✅ Subcategory support
  date: { type: Date, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // ✅ enforce user association
  }
});

module.exports = mongoose.model('Expense', expenseSchema);
