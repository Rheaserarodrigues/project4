const passport = require('passport');
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {AUTH_MODE_EMAIL_PASSWORD, AUTH_MODE_GOOGLE} = require('../models/userParameterModel');
const UserAccount = require('../models/userAccount');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_SSO_CALLBACK_URL,
    passReqToCallback: true
}, async function (req, accessToken, refreshToken, profile, done) {
    console.log(profile);
    // console.log(accessToken);
    const email = profile.emails[0].value;
    const existingUser = await UserAccount.findOne({$or: [{email}]});

    if (existingUser) {
        console.log('User already exists in the database.');
        // You may want to handle this case accordingly (e.g., return an error).
    } else {
        // Save the new user
        const newUser = new UserAccount({
            authMode: AUTH_MODE_GOOGLE,
            email,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePicture: profile.photos[0].value
        });

        try {
            await newUser.save();
            console.log('User saved successfully.');
        } catch (error) {
            console.error('Error saving user:', error);
            // Handle the error appropriately.
        }
    }
    done(null, profile);
}));


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    // const user = await Account.findOne({ where: { id } }).catch((err) => {
    //     console.log("Error deserializing", err);
    //     cb(err, null);
    // });

    done(null, user);
});