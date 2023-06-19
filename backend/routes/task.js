const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

router.post('/', tasksController.createNewTask);

module.exports = router;