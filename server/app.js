require("dotenv").config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require("body-parser");
const app = express();





const middlewares = require("./middlewares/auth");
const passport = require("passport");
require("./auth/passport")(passport);
require('./auth/passportGoogleSSO')

// const booksRoute = require('./routes/v1/openRoutes/bookRoutes');
// const authRoute = require('./routes/v1/secureRoutes/authenticationRoutes');


// Middleware for parsing JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Middleware for CORS
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionSuccessStatus: 200,
}));




function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
    /* eslint-enable no-unused-vars */
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
}


// Routes
// app.use('/api/open',booksRoute);
// app.use('/api/secure', authRoute);
app.use('/api', require('./routes/index'));

app.use(
    session({
        secret: "JWT_SECRET",
        resave: true,
        saveUninitialized: true

    })
);
app.use(passport.initialize());
app.use(passport.session());


// // Routes
// app.use('/api/books', booksRoute);
// app.use('/api/auth', authRoute);

app.use(notFound);
app.use(errorHandler);

module.exports = app;