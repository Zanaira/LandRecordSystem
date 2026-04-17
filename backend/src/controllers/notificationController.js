import Notification from '../models/Notification.js';

// CREATE Notification
export async function createNotification(req, res) {
    try {
        const { user_id, message, is_read } = req.body;

        // Validation
        if (!user_id || !message) {
            return res.status(400).json({ message: "User ID and message are required" });
        }

        const newNotification = new Notification({
            user_id,
            message,
            is_read
        });

        await newNotification.save();
        res.status(201).json({ message: "Notification created successfully", notification: newNotification });
    } catch (error) {
        console.error("Error in createNotification controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// GET All Notifications
export async function getAllNotifications(req, res) {
    try {
        const notifications = await Notification.find()
            .populate('user_id', 'full_name email');
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error in getAllNotifications controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// GET Notification by ID
export async function getNotificationById(req, res) {
    try {
        const notification = await Notification.findById(req.params.id)
            .populate('user_id', 'full_name email');

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error("Error in getNotificationById controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// UPDATE Notification (e.g., mark as read)
export async function updateNotification(req, res) {
    try {
        const { id } = req.params;

        const updatedNotification = await Notification.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification updated", notification: updatedNotification });
    } catch (error) {
        console.error("Error in updateNotification controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE Notification
export async function deleteNotification(req, res) {
    try {
        const { id } = req.params;

        const deletedNotification = await Notification.findByIdAndDelete(id);

        if (!deletedNotification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error in deleteNotification controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
