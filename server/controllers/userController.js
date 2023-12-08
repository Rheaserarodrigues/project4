const {AUTH_MODE_EMAIL_PASSWORD} = require("../models/userParameterModel");
const UserAccount = require("../models/userAccount");
require("dotenv").config();
const getUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch user data from the database based on userId
        const user = await UserAccount.findById(userId);

        if (!user) {
            // If no user is found, return a 404 Not Found response
            return res.status(404).json({ message: 'User not found' });
        }

        // If the user is found, send the user data as a JSON response
        res.status(200).json(user);
    } catch (error) {
        // Handle errors (e.g., database error)
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Internal Server Error',error: error });
    }
};

module.exports = {
    getUserById,
};
