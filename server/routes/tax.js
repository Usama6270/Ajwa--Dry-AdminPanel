// routes/tax.js
import express from 'express';
import Tax from '../models/Tax.js';

const router = express.Router();

// Get all tax settings
router.get('/', async (req, res) => {
  try {
    const taxSettings = await Tax.find();
    res.status(200).json(taxSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single tax setting by region
router.get('/:region', async (req, res) => {
  try {
    const { region } = req.params;
    const taxSetting = await Tax.findOne({ region });
    if (!taxSetting) {
      return res.status(404).json({ message: 'Tax rate not found for this region' });
    }
    res.status(200).json(taxSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new tax setting
router.post('/', async (req, res) => {
  try {
    const { region, taxRate } = req.body;
    const newTaxSetting = new Tax({ region, taxRate });
    await newTaxSetting.save();
    res.status(201).json(newTaxSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a tax setting by region
router.put('/:region', async (req, res) => {
  try {
    const { taxRate } = req.body;
    const updatedTaxSetting = await Tax.findOneAndUpdate(
      { region: req.params.region },
      { taxRate },
      { new: true }
    );
    if (!updatedTaxSetting) {
      return res.status(404).json({ message: 'Tax setting not found' });
    }
    res.status(200).json(updatedTaxSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a tax setting by region
router.delete('/:region', async (req, res) => {
  try {
    const deletedTaxSetting = await Tax.findOneAndDelete({ region: req.params.region });
    if (!deletedTaxSetting) {
      return res.status(404).json({ message: 'Tax setting not found' });
    }
    res.status(200).json({ message: 'Tax setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
