// routes/notificationRoutes.js
import express from 'express';
import createNotification from '../utils/sendNotification.js'; // Your notification logic

const router = express.Router();

// Handle POST requests to create notifications
router.post('/', async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    if (!userId || !message || !type) {
      return res.status(400).json({ message: 'userId, message, and type are required' });
    }

    // Send notification logic
    await createNotification(userId, message, type);

    res.status(201).json({ message: 'Notification created successfully!' });
  } catch (error) {
    console.error('Error creating notification:', error.message);
    res.status(500).json({ message: 'Failed to create notification', error: error.message });
  }
});

export default router;
