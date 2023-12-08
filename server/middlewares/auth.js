require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require("passport");

const app = express();
const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key


module.exports.isUserAuthenticated = passport.authenticate('jwt', { session: false })

