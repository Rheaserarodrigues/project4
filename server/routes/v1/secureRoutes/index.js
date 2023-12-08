const express = require('express');
const router = express.Router();

router.use('/auth', require('./authenticationRoutes'));
router.use('/user', require('./userRoutes'));
router.use('/cart', require('./cartRoutes'));
router.use('/order', require('./orderRoutes'));
router.use('/book-list', require('./bookListRoutes'));
router.use('/book', require('./bookRoutes'));

module.exports = router;