const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectCreation');

router.post('/', projectController.addProject);

module.exports = router;

