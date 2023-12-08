const mongoose = require('mongoose');

// Define the schema for the "orders" collection
const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    orderedItems: {
        type: [{
            id: String,
            name: String,
            price: Number,
            cartQuantity: Number,
            // Add other properties as needed
        }],
        required: true,
    },
    totalBill: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Mongoose model for the "orders" collection
const Order = mongoose.model('order_schema', orderSchema);

module.exports = Order;
