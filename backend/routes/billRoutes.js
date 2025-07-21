const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// Save bill
router.post('/', async (req, res) => {
  try {
    const bill = new Bill(req.body);
    await bill.save();
    res.status(201).json({ message: 'Bill saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving bill', error });
  }
});

// Get all saved bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error });
  }

});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Bill.findByIdAndDelete(id);
    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bill', error });
  }
});

module.exports = router;
