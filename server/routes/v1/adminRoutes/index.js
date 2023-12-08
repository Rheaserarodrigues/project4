const express = require('express');
const router = express.Router();

router.use('/control', require('./adminRoutes'));

module.exports = router;