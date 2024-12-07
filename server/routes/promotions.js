import express from 'express';
import Promotion from '../models/Promotion.js';

const router = express.Router();

// Create a new promotion
router.post('/', async (req, res) => {
    try {
        const { title, description, startDate, endDate, discountPercentage } = req.body;
        const promotion = new Promotion({
            title,
            description,
            startDate,
            endDate,
            discountPercentage,
        });
        await promotion.save();
        res.status(201).json({ message: 'Promotion created successfully', promotion });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create promotion', error: error.message });
    }
});

// Get all promotions
router.get('/', async (req, res) => {
    try {
        const promotions = await Promotion.find();
        res.status(200).json(promotions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch promotions', error: error.message });
    }
});

// Update an existing promotion by ID (PUT)
router.put('/:id', async (req, res) => {
    try {
        const { title, description, startDate, endDate, discountPercentage } = req.body;

        // Find the promotion by ID and update it
        const updatedPromotion = await Promotion.findByIdAndUpdate(
            req.params.id,  // Use the ID from the URL
            {
                title,
                description,
                startDate,
                endDate,
                discountPercentage,
            },
            { new: true }  // This option returns the updated document
        );

        // If promotion not found, return 404 error
        if (!updatedPromotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        // Return the updated promotion in the response
        res.status(200).json({ message: 'Promotion updated successfully', promotion: updatedPromotion });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update promotion', error: error.message });
    }
});
// Delete a promotion by ID
router.delete('/:id', async (req, res) => {
    try {
        // Use the ID from the request parameters to find and delete the promotion
        const deletedPromotion = await Promotion.findByIdAndDelete(req.params.id);

        // If no promotion found, return 404 error
        if (!deletedPromotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        // Return success message and the deleted promotion
        res.status(200).json({ message: 'Promotion deleted successfully', promotion: deletedPromotion });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete promotion', error: error.message });
    }
});


export default router;
