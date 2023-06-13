const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');

router.post('/', projectsController.createNewProject);

module.exports = router;

