const AUTH_MODE_EMAIL_PASSWORD = 'AUTH_MODE_EMAIL_PASSWORD';
const AUTH_MODE_GOOGLE = 'AUTH_MODE_GOOGLE';

const emailParameter = {
    type: String,
    required: true,
    unique: true,
    validate: {
        validator: function (value) {
            // Add your custom validation logic for the email address
            return /\S+@\S+\.\S+/.test(value); // Basic email format validation
        },
        message: 'Please enter a valid email address.'
    }
};

const phoneNoParameter = {
    type: String,
    required: false,
    validate: {
        validator: function (value) {
            // Add your custom validation logic for the phone number
            return /^\d{3}-\d{3}-\d{4}$/.test(value);
        },
        message: 'Phone number must be in the format xxx-xxx-xxxx.'
    }
};



const addressParameter = {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 100,
    validate: {
        validator: function (value) {
            // Add your custom validation logic for the address
            return /^[a-zA-Z0-9\s,.'-]+$/i.test(value);
        },
        message: 'Invalid address format.'
    }
}

module.exports = {
    AUTH_MODE_EMAIL_PASSWORD,
    AUTH_MODE_GOOGLE,
    emailParameter,
    phoneNoParameter,
    addressParameter
}