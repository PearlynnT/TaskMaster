// not used

const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chatsController');

router.post('/', chatsController.createNewChat);

module.exports = router;