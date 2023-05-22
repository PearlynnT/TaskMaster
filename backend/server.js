const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');

// middleware
app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
