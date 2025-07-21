require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas for bulk upload');
    uploadProducts();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

async function uploadProducts() {
  try {
    const data = fs.readFileSync('products.json', 'utf-8');
    const products = JSON.parse(data);

    await Product.deleteMany(); // Optional: clears existing products
    await Product.insertMany(products);

    console.log('Products inserted successfully');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error uploading products:', err);
    mongoose.disconnect();
  }
}
