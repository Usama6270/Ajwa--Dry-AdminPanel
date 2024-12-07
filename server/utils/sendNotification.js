// utils/sendNotification.js
import Notification from '../models/Notification.js'; // Make sure this model exists

const createNotification = async (userId, message, type) => {
  try {
    const notification = new Notification({
      userId,
      message,
      type,
    });

    // Save the notification to the database
    await notification.save();
    console.log('Notification sent to user', userId);
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};

export default createNotification;
