const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  const search = req.query.search || '';
  const regex = new RegExp(`^${search}`, 'i'); // starts with `search`, case-insensitive

  try {
    const products = await Product.find({ name: { $regex: regex } }).limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

module.exports = router;
