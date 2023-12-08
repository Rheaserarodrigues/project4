const UserAccount = require('../../models/userAccount');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        // Check if the user making the request is an administrator
        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ error: 'Permission denied' });
        // }

        // Fetch all users from the database
        const users = await UserAccount.find();

        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Grant site manager privilege
const grantSiteManagerPrivilege = async (req, res) => {
    try {
        // Check if the user making the request is an administrator
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Permission denied' });
        }

        // Get the user ID to grant site manager privilege
        const { userId } = req.params;

        // Find the user by ID and update their role to 'siteManager'
        await UserAccount.findByIdAndUpdate(userId, { role: 'siteManager' });

        res.json({ message: 'Site manager privilege granted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Mark a review as hidden or clear the "hidden" flag
const markReview = async (req, res) => {
    try {
        // Check if the user making the request is an administrator
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Permission denied' });
        }

        // Get the review ID and action ('hide' or 'clear') from the request body
        const { reviewId, action } = req.body;

        // Find the review by ID and update its hidden flag based on the action
        await UserAccount.findByIdAndUpdate(reviewId, { hidden: action === 'hide' });

        res.json({ message: 'Review action completed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Mark a user as "deactivated" or "active"
const markUserStatus = async (req, res) => {
    try {
        // Get the user ID and status ('deactivate' or 'activate') from the request body
        const { userId } = req.body;

        // Find the user by ID to get the current status
        const user = await UserAccount.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Toggle the user status
        const newStatus = user.status === 'active' ? 'inactive' : 'active';

        // Update the user status in the database
        await UserAccount.findByIdAndUpdate(userId, { status: newStatus });

        res.json({ message: 'User status updated successfully', newStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getAllUsers,
    grantSiteManagerPrivilege,
    markReview,
    markUserStatus,

}
