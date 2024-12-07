import express from 'express';
import Voucher from '../models/Voucher.js'; // Assuming you have a Voucher model

const router = express.Router();

// Create a new voucher
router.post('/', async (req, res) => {
    try {
        const { code, discount, expirationDate } = req.body;
        const voucher = new Voucher({
            code,
            discount,
            expirationDate,
        });
        await voucher.save();
        res.status(201).json({ message: 'Voucher created successfully', voucher });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create voucher', error: error.message });
    }
});

// Redeem a voucher
router.post('/redeem', async (req, res) => {
    try {
        const { code } = req.body;
        const voucher = await Voucher.findOne({ code, redeemed: false });

        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found or already redeemed' });
        }

        voucher.redeemed = true;
        await voucher.save();

        res.status(200).json({ message: 'Voucher redeemed successfully', voucher });
    } catch (error) {
        res.status(500).json({ message: 'Failed to redeem voucher', error: error.message });
    }
});

// Get all vouchers
router.get('/', async (req, res) => {
    try {
        const vouchers = await Voucher.find();
        res.status(200).json(vouchers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch vouchers', error: error.message });
    }
});

// Update an existing voucher
router.put('/:id', async (req, res) => {
    try {
        const { code, discount, expirationDate } = req.body;
        const updatedVoucher = await Voucher.findByIdAndUpdate(
            req.params.id,
            { code, discount, expirationDate },
            { new: true } // Return the updated voucher
        );

        if (!updatedVoucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }

        res.status(200).json({ message: 'Voucher updated successfully', updatedVoucher });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update voucher', error: error.message });
    }
});

// Delete a voucher
router.delete('/:id', async (req, res) => {
    try {
        const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id);

        if (!deletedVoucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }

        res.status(200).json({ message: 'Voucher deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete voucher', error: error.message });
    }
});

export default router;
