// routes/shipping.js
import express from 'express';
import Shipping from '../models/Shipping.js';

const router = express.Router();

// Get all shipping options
router.get('/', async (req, res) => {
  try {
    const shippingOptions = await Shipping.find();
    res.status(200).json(shippingOptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single shipping option by ID
router.get('/:id', async (req, res) => {
  try {
    const shippingOption = await Shipping.findById(req.params.id);
    if (!shippingOption) {
      return res.status(404).json({ message: 'Shipping option not found' });
    }
    res.status(200).json(shippingOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new shipping option
router.post('/', async (req, res) => {
  try {
    const { method, deliveryTime, charge } = req.body;
    const newShippingOption = new Shipping({ method, deliveryTime, charge });
    await newShippingOption.save();
    res.status(201).json(newShippingOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a shipping option by ID
router.put('/:id', async (req, res) => {
  try {
    const { method, deliveryTime, charge } = req.body;
    const updatedShippingOption = await Shipping.findByIdAndUpdate(
      req.params.id,
      { method, deliveryTime, charge },
      { new: true }
    );
    if (!updatedShippingOption) {
      return res.status(404).json({ message: 'Shipping option not found' });
    }
    res.status(200).json(updatedShippingOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a shipping option by ID
router.delete('/:id', async (req, res) => {
  try {
    const shippingOption = await Shipping.findByIdAndDelete(req.params.id);
    if (!shippingOption) {
      return res.status(404).json({ message: 'Shipping option not found' });
    }
    res.status(200).json({ message: 'Shipping option deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
