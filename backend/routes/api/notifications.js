const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notificationsController');

router.route('/')
    .get(notificationsController.getAllNotifications)
    .post(notificationsController.createNotification);

router.route('/:id')
    .delete(notificationsController.deleteNotificationById);

module.exports = router;