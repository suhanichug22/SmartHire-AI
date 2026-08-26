const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

// Create Notification
router.post("/create", createNotification);

// Get Notifications of User
router.get("/:userId", getNotifications);

// Mark Notification as Read
router.put("/read/:id", markAsRead);

module.exports = router;