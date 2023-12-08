// import the book_item component
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import BookStack from '../../assets/clip-reading-of-books-1.png';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import {Add, InfoOutlined} from "@mui/icons-material";
import Button from "@mui/joy/Button";
import {useState} from "react";
import {FormControl, FormHelperText, FormLabel, Stack} from "@mui/joy";
import {BACKEND_URL} from "../../../config/env.jsx";
import axios from "axios";
import {useDispatch} from "react-redux";
import {notificationStateChange} from "../../store/NotificationSlice.jsx";
import {useNavigate} from "react-router-dom";
import CSS from './Register.module.css'
export const CustomInputField = ({
                                     label,
                                     type,
                                     value,
                                     onChange,
                                     error,
                                     styleProps
                                 }) => (
    <FormControl error={Boolean(error)}>
        <FormLabel><Typography color="primary">{label}</Typography></FormLabel>
        <Input
            // placeholder={`Type in ${label.toLowerCase()}…`}
            size="md"
            variant="outlined"
            type={type}
            value={value}
            onChange={onChange}
            sx={{...styleProps}}
        />
        {Boolean(error) && (
            <FormHelperText>
                <InfoOutlined/>
                {error}
            </FormHelperText>
        )}
    </FormControl>
);

export default function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    // const [phoneNumber, setPhoneNumber] = useState('');
    // const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');

    // Real-time error messages
    const [firstNameInputError, setFirstNameInputError] = useState('');
    const [lastNameInputError, setLastNameInputError] = useState('');
    const [emailInputError, setEmailInputError] = useState('');
    // const [phoneNumberInputError, setPhoneNumberInputError] = useState('');
    // const [addressInputError, setAddressInputError] = useState('');
    const [passwordInputError, setPasswordInputError] = useState('');


    const handleRegister = async () => {
        // Check for all input validation before proceeding with registration
        if (
            validateFirstName() &&
            validateLastName() &&
            validateEmail() &&
            validatePassword()
        ) {

            const userCredentials = {
                firstName: firstName,
                lastName: lastName,
                email: email.toLowerCase(),
                password: password,
                authMode: "AUTH_MODE_EMAIL_PASSWORD"
            }
            try {
                // console.log('userCredentials:', userCredentials);
                const response = await axios.post(BACKEND_URL + "/api/v1/secure/auth/register", userCredentials, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });


                // console.log('response:', response);
                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "success",
                    notificationMessage: response.data.message
                }))
                navigate("/login");



            } catch (error) {
                // console.log('error:', error);
                dispatch(notificationStateChange({
                    notification: true,
                    notificationColor: "danger",
                    notificationMessage: error.response.data.error
                }))
            }
            // You can make an API call or perform any other registration-related tasks here
        } else {
            // Handle accordingly (display an error message, etc.)
            console.log('Invalid input(s)');
        }
    };

    const validateFirstName = () => {
        // Add your first name validation logic here
        if (firstName.trim() !== '') {
            setFirstNameInputError('');
            return true;
        } else {
            setFirstNameInputError('First Name is required');
            return false;
        }
    };

    const validateLastName = () => {
        // Add your last name validation logic here
        if (lastName.trim() !== '') {
            setLastNameInputError('');
            return true;
        } else {
            setLastNameInputError('Last Name is required');
            return false;
        }
    };
    const validateEmail = () => {
        // Add your email validation logic here
        // For example, use a simple regular expression to check if the email is in a valid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(email)) {
            setEmailInputError('');
            return true;
        } else {
            setEmailInputError('Invalid email format');
            return false;
        }
    };

    // const validatePhoneNumber = () => {
    //     // Add your phone number validation logic here
    //     // You can customize this validation based on your requirements
    //     if (phoneNumber.trim() !== '') {
    //         setPhoneNumberInputError('');
    //         return true;
    //     } else {
    //         setPhoneNumberInputError('Phone Number is required');
    //         return false;
    //     }
    // };

    // const validateAddress = () => {
    //     // Add your address validation logic here
    //     if (address.trim() !== '') {
    //         setAddressInputError('');
    //         return true;
    //     } else {
    //         setAddressInputError('Address is required');
    //         return false;
    //     }
    // };



    const validatePassword = () => {
        // Check for minimum length
        console.log(!(/[A-Z]/).test(password))
        if (password.length < 8) {
            setPasswordInputError('Password must be at least 8 characters long.');
            return false;
        }

        // Check for uppercase letter
        if (!(/[A-Z]/).test(password)) {
            setPasswordInputError('Password must contain at least one uppercase letter.');
            return false;
        }

        // Check for lowercase letter
        if (!/[a-z]/.test(password)) {
            setPasswordInputError('Password must contain at least one lowercase letter.');
            return false;
        }

        // Check for digit
        if (!/\d/.test(password)) {
            setPasswordInputError('Password must contain at least one digit.');
            return false;
        }

        // Check for special character
        if (!/[@$!%*?&]/.test(password)) {
            setPasswordInputError('Password must contain at least one special character.');
            return false;
        }

        // If all checks pass
        setPasswordInputError('');
        return true;
    };


    // return the JSX for the HomePage


    return (
        <>
            <Box className={CSS.boxContainer}>
                <Sheet color="neutral" variant="soft" className={CSS.sheetImage}>
                    <img src={BookStack} style={{
                        width: "100%", height: "max-content"
                    }
                    } alt="Logo"/>

                </Sheet>
                <Sheet color="primary" variant="soft" className={CSS.sheetForm}>

                    <Typography color="primary" level="h4">Register</Typography>
                    <Stack  spacing={2}>

                        <CustomInputField
                            label="First Name"
                            type="text"
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                                setFirstNameInputError('');
                            }}

                            error={firstNameInputError}
                        />
                        <CustomInputField
                            label="Last Name"
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                                setLastNameInputError('');
                            }}

                            error={lastNameInputError}
                        />


                        <CustomInputField
                            label="Email-ID"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailInputError('');
                            }}

                            error={emailInputError}
                        />

                        <CustomInputField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordInputError('');
                            }}
                            error={passwordInputError}
                        />
                    </Stack>
                    <Box sx={{marginTop: "30px"}}>
                        <Button color="primary" variant="solid" endDecorator={<Add/>} onClick={handleRegister}>
                            Register
                        </Button>
                    </Box>
                </Sheet>
            </Box>
        </>
    );
}
