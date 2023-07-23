const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

router.put('/:id', tasksController.updateTask);

module.exports = router;
