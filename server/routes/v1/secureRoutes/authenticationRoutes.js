require('dotenv').config();
const express = require('express');
const router = express.Router();
const authController = require('../../../controllers/authenticationController');
const passport = require('passport');
const Account = require("../../../models/userAccount");
const jwt = require("jsonwebtoken");
const {authenticateToken, isUserAuthenticated} = require("../../../middlewares/auth");


// Register a new user
router.post('/register', authController.register);

// Login route for userAccountSchema
router.post('/login', authController.login);

router.put('/update-password', authController.updatePassword);
// Login route for Google OAuth
router.get(
    "/login/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route for Google OAuth
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session:false,
        failureMessage: "Cannot login to Google, please try again later!",
    }),
    async (req, res, next) => {
        console.log("User in REQUEST: ", req.user);
        // This middleware will only be called on successful authentication
        const successLoginUrl = process.env.FRONTEND_URL + "/login/success"
        const errorLoginUrl = process.env.FRONTEND_URL +"/login/error"
        try {
            console.log("User: ", req.user);
            const user = await Account.findOne({ email: req.user.emails[0].value });

            if (!user) {
                // If the user with the provided email is not found
                return res.status(404).json({ error: "User not found" });
            }

            console.log("User: ", user);
            // User found, proceed to generate the token
            const token = jwt.sign(
                { id: user._id, emailId: user.email },
                "JWT_SECRET",
                { expiresIn: "1h" }
            );

            // Redirect to success URL and send the token in the response
            return res.redirect(successLoginUrl + "?token="  + encodeURIComponent(token) + "&userId=" + encodeURIComponent(user._id));
        } catch (error) {
            console.error("Error in callback:", error);
            // Redirect to error URL with an error message
            return res.redirect(errorLoginUrl + "?error=" + error.message);
        }
    }
);

router.get('/secure-data', isUserAuthenticated, (req, res) => {
    console.log(req.user)
    res.json({ message: 'You accessed secure data!' });
});


// Example route that requires a valid token
router.get('/protected-route',isUserAuthenticated, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
// Logout route
router.post('/logout', authController.logout);

module.exports = router;
