// controllers/notificationController.js
import Notification from '../models/Notification.js';

// Get all notifications for a specific user
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.query;

    // Fetch notifications for the user and sort them by createdAt in descending order
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    // Find the notification and update its read status
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error.message);
    res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
  }
};
