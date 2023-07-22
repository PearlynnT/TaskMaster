const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');

router.post('/', notificationsController.createNotification);

module.exports = router;

