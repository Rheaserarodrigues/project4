const express = require('express');
const router = express.Router();
const cartController = require('../../../controllers/cartController');
// Get user's cart
router.get('/:userId', cartController.getCart);

// Add item to user's cart
router.post('/:userId/addToCart', cartController.addToCart);

// Remove item from user's cart
router.delete('/:userId/removeFromCart/:bookId', cartController.removeFromCart);

// Update item quantity in user's cart
router.put('/:userId/updateQuantity/:itemId', cartController.updateQuantity);

router.post("/create-checkout-session", cartController.checkOutSession);

// Remove item from user's cart
router.post('/deleteCart/:userId', cartController.createOrderAndEmptyCart);



module.exports = router;