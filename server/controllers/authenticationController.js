require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {AUTH_MODE_EMAIL_PASSWORD} = require('../models/userParameterModel');
const Account = require('../models/userAccount');
const nodemailer = require('nodemailer');
// Register a new user
// Register a new user
const register = async (req, res) => {
    console.log("Request: ", req.body);
    try {
        const { firstName, lastName, password, email, authMode } = req.body;

        if (authMode === AUTH_MODE_EMAIL_PASSWORD) {
            // Check if the email already exists
            const existingUser = await Account.findOne({ email });
            console.log("Existing user: ", existingUser);

            if (existingUser !== null) {
                return res.status(400).json({ status: false, error: 'Email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new Account({
                firstName,
                lastName,
                password: hashedPassword,
                email,
                authMode
            });

            await newUser.save();
            res.status(201).json({ status: true, message: 'User registered successfully' });
        } else {
            return res.status(400).json({ status: false, error: 'Invalid authentication mode' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: error, errorMessage: error.message });
    }
};


// Login route for userAccountSchema
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await Account.findOne({ email });
        console.log("User: ", user);

        if (user === null) {
            // If the user with the provided email is not found
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.status === 'inactive') {
            // If the user account is inactive
            return res.status(401).json({ error: 'Account is inactive. Please contact the administrator.' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            // If the passwords do not match
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Password is correct, proceed to generate the token
        const token = jwt.sign({ id: user._id, emailId: user.email }, "JWT_SECRET", { expiresIn: '1h' });

        res.status(200).json({
            id: user._id,
            emailId: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture ?? null,
            role: user.role,
            token: token
        });
    } catch (error) {
        res.status(500).json({ error: error, errorMessage: error.message });
    }
};



const updatePassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;

        // Find user by userId
        const user = await Account.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided old password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid old password' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error, errorMessage: error.message });
    }
};


// Logout route
const logout = (req, res) => {
    // Perform logout logic if needed
    res.status(200).json({message: 'Logout successful'});
};

module.exports = {
    register,
    login,
    logout,
    updatePassword
};
