const express = require('express');
const router = express.Router();
const Cart = require('../../models/cartModel');

const Stripe = require("stripe");
const Order = require("../../models/orderSchema");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// Get user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        let userCart = await Cart.findOne({userId});

        // If cart not found, create an empty cart
        if (!userCart) {
            userCart = await Cart.create({userId, items: [], totalBill: 0});
        }

        res.status(200).json(userCart);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};


// Add item to user's cart
const addToCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const {bookId, bookName, bookPicture, price} = req.body;
        const quantity = 1;
        const existingCartItem = await Cart.findOneAndUpdate(
            {userId, 'items.bookId': bookId},
            {
                $inc: {
                    'items.$.quantity': quantity,
                    'items.$.totalPrice': quantity * price,
                    totalBill: quantity * price,
                },
            },
            {new: true}
        );

        if (existingCartItem) {
            return res.status(200).json(existingCartItem);
        }

        const newItem = {
            bookId: bookId,
            bookName: bookName,
            quantity: quantity,
            bookPicture: bookPicture,
            price: price,
            totalPrice: quantity * price,
        };

        const userCart = await Cart.findOneAndUpdate(
            {userId},
            {
                $push: {items: newItem},
                $inc: {totalBill: newItem.totalPrice},
            },
            {new: true}
        );

        if (!userCart) {
            return res.status(404).json({message: 'Cart not found for this user.'});
        }

        res.status(200).json(userCart);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};


const createOrderAndEmptyCart = async (req, res) => {
    const userId = req.params.userId; // Assuming user ID is in the request parameters

    try {
        // Get cart details
        const cartDetails = await Cart.findOne({ userId });

        // Check if the cart is empty
        if (!cartDetails || cartDetails.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty.' });
        }

        // Create a new order with cart details
        // Create a new order with cart details
        const newOrder = new Order({
            userId: userId,
            orderedItems: cartDetails.items.map(item => ({
                id: item.bookId,
                name: item.bookName,
                price: item.price,
                cartQuantity: item.quantity,
                // Add other properties as needed
            })),
            totalBill: cartDetails.totalBill,
            createdAt: new Date(),
        });

        await newOrder.save();

        // Empty the cart
        await Cart.findOneAndUpdate(
            { userId },
            {
                $set: {
                    items: [], // Empty the items array
                    totalBill: 0, // Reset the total bill
                },
            },
            { new: true }
        );


        // Find orders for the given user
        const orders = await Order.find({ userId: userId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the user.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getOrderDetailsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find orders for the given user
        const orders = await Order.find({ userId: userId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the user.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Remove item from user's cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookId = req.params.bookId;

        const existingCartItem = await Cart.findOne({userId, 'items.bookId': bookId});

        if (!existingCartItem) {
            return res.status(200).json(existingCartItem);
        }

        const itemToUpdate = existingCartItem.items.find(item => item.bookId === bookId);

        if (!itemToUpdate) {
            return res.status(404).json({message: 'Item not found in the cart.'});
        }
        // Store the total price and total bill before updating
        const previousTotalPrice = itemToUpdate.totalPrice;
        const previousTotalBill = existingCartItem.totalBill;

        // Decrement quantity and update total price
        itemToUpdate.quantity = Math.max(0, itemToUpdate.quantity - 1);
        itemToUpdate.totalPrice = itemToUpdate.quantity * itemToUpdate.price;
        existingCartItem.totalBill = previousTotalBill - previousTotalPrice + itemToUpdate.totalPrice;
        // Update the cart with the modified item
        await existingCartItem.save();

        // If quantity becomes zero after decrementing, remove the item from the cart
        if (itemToUpdate.quantity === 0) {
            const finalCartItem = await Cart.findOneAndUpdate(
                {userId},
                {
                    $pull: {items: {bookId}},
                    $inc: {totalBill: -1 * itemToUpdate.totalPrice},
                },
                {new: true}
            );
            return res.status(200).json(finalCartItem);
        }

        res.status(200).json(existingCartItem);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};


// Update item quantity in user's cart
const updateQuantity = async (req, res) => {
    try {
        const userId = req.params.userId;
        const itemId = req.params.itemId;
        const {quantity, price} = req.body;

        // Find the user's cart
        let userCart = await Cart.findOne({userId});

        if (!userCart) {
            return res.status(404).json({message: 'Cart not found for this user.'});
        }

        // Update the quantity and total price
        userCart = await Cart.findOneAndUpdate(
            {userId, 'items._id': itemId},
            {
                $set: {
                    'items.$.quantity': quantity,
                    'items.$.totalPrice': quantity * price,
                },
                $inc: {totalBill: (quantity * price) - userCart.items.id(itemId).totalPrice},
            },
            {new: true}
        );

        res.status(200).json(userCart);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const checkOutSession = async (req, res) => {
    console.log("Request body: ", req.body);
    const customer = await stripe.customers.create({
        metadata: {
            userId: req.body.userId,
            cart: JSON.stringify(req.body.cartItems),
        },
    });

    const line_items = req.body.cartItems.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    metadata: {
                        id: item.id,
                    },
                },
                unit_amount: Math.round((parseFloat(item.price) * 100).toFixed(2)),
            },
            quantity: item.cartQuantity,
        };
    });

    // const paymentIntent = await stripe.

    const session = await ((
        await stripe.checkout.sessions.create({
            payment_method_types: ["card"],

            shipping_options: [
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 0,
                            currency: "usd",
                        },
                        display_name: "Free shipping",
                        // Delivers between 5-7 business days
                        delivery_estimate: {
                            minimum: {
                                unit: "business_day",
                                value: 5,
                            },
                            maximum: {
                                unit: "business_day",
                                value: 7,
                            },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 1500,
                            currency: "usd",
                        },
                        display_name: "Next day air",
                        // Delivers in exactly 1 business day
                        delivery_estimate: {
                            minimum: {
                                unit: "business_day",
                                value: 1,
                            },
                            maximum: {
                                unit: "business_day",
                                value: 1,
                            },
                        },
                    },
                },
            ],
            phone_number_collection: {
                enabled: true,
            },
            line_items,
            mode: "payment",
            automatic_tax: {
                enabled: true,
            },
            customer: customer.id,
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "KE"],
            },
            customer_update: {
                shipping: "auto",
                name:'auto'
            },
            tax_id_collection: {
                enabled: true,
            },
            success_url: `${process.env.FRONTEND_URL}/orders?id=${req.body.userId}`,

            cancel_url: `${process.env.FRONTEND_URL}/cart`,

        })


    ));


    console.log("Session: ", session.payment_status);

    res.send({url: session.url});
    // res.redirect(303, session.url);
    // res.send({url: session.url});
}


module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkOutSession,
    getOrderDetailsByUserId,
    createOrderAndEmptyCart
};