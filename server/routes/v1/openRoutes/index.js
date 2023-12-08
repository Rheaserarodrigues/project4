const express = require('express');
const router = express.Router();

router.use('/books', require('./bookRoutes'));

module.exports = router;