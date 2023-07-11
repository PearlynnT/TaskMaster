const express = require('express');
const router = express.Router();
const chatsController = require('../../controllers/chatsController');

router.route('/')
    .get(chatsController.getAllChats)
    .post(chatsController.createNewChat);

router.route('/:id')
    .get(chatsController.getChat)
    .delete(chatsController.deleteChat);

module.exports = router;