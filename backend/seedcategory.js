// Run once: `node seedCategories.js`
const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Category.deleteMany();
  await Category.insertMany([
    { name: "Groceries", subcategories: ["Vegetables","Snacks","Dairy"] },
    { name: "Fuel", subcategories: ["Petrol","Diesel","Toll"] },
    { name: "Entertainment", subcategories: ["Movies","Concerts","Games"] },
    { name: "Dining Out", subcategories: ["Restaurants","Cafes","Takeaway"] },
    { name: "Rent", subcategories: ["Home","Office"] }
  ]);
  console.log("✅ Categories seeded");
  mongoose.disconnect();
});
