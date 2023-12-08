const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        bookId: { type:String, required: true },
        bookName: { type: String, required: true },
        bookPicture: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
    }],
    totalBill: { type: Number, default: 0 },
});

const Cart = mongoose.model('cart_schema', cartSchema);

module.exports = Cart;
