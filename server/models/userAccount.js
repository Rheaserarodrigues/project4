const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {emailParameter, phoneNoParameter, addressParameter, AUTH_MODE_EMAIL_PASSWORD} = require('./userParameterModel');
const saltRounds = 10;
const Schema = mongoose.Schema;

const userAccountSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        validate: {
            validator: function(v) {
                // Regular expression to check if the name only contains letters
                return /^[A-Za-z]+$/.test(v);
            },
            message: props => `${props.value} is not a valid first name!`
        }
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        validate: {
            validator: function(v) {
                // Regular expression to check if the name only contains letters
                return /^[A-Za-z]+$/.test(v);
            },
            message: props => `${props.value} is not a valid last name!`
        }
    },
    password: {
        type: String,
        required: false,
        minlength: 8,
        maxlength: 100,
        validate: {
            validator: function (value) {
                // Add your custom validation logic for the password
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value);
            },
            message: 'Password must contain at least one digit, one lowercase and one uppercase letter.'
        }
    },
    email: emailParameter,
    phoneNumber: phoneNoParameter,
    address: addressParameter,
    authMode: {
        required:true,
        type: String,
        default: AUTH_MODE_EMAIL_PASSWORD,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
    },
    status: {
        type: String,
        required: true,
        default: 'active',
    },
}, {
    timestamps: true,
});

const userAccount = mongoose.model('user_account_schema', userAccountSchema);

module.exports = userAccount;