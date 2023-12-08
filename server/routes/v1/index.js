const express = require('express');
const router = express.Router();

router.use('/open', require('./openRoutes/index'));
router.use('/secure', require('./secureRoutes/index'));
router.use('/admin', require('./adminRoutes/index'));

module.exports = router;