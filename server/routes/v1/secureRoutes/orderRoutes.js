const express = require('express');
const router = express.Router();
const cartController = require('../../../controllers/cartController');
// Get user's cart
router.get('/:userId', cartController.getOrderDetailsByUserId);

module.exports = router;