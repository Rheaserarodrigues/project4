import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import BookStack from '../../assets/booksStacked.png';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from "@mui/joy/Button";
import {useState} from "react";
import GoogleLoginButton from "../../components/GoogleLoginButtonComponent.jsx";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../../store/UserSlice.jsx";
import {useNavigate} from "react-router-dom";
import {notificationStateChange} from "../../store/NotificationSlice.jsx";
import {getCartItems} from "../../store/CartSlice.jsx";
import {getBookLists} from "../../store/BookListSlice.jsx";
import {BACKEND_URL} from "../../../config/env.jsx";


export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Real-time error messages
    const [emailInputError, setEmailInputError] = useState('');
    const [passwordInputError, setPasswordInputError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.user.refreshToken !== "");

    const handleLogin = async () => {

        if (validateEmail() && validatePassword()) {
            const userCredentials = {email: email, password: password};
            dispatch(loginUser(userCredentials)).then((response) => {
                console.log('loginUserResponse:', response);
                if (response.type === "user/loginUser/rejected") {
                    // console.log("Error:", response.payload.response.data.error);

                    dispatch(notificationStateChange({
                        notification: true,
                        notificationColor: "danger",
                        notificationMessage: response.payload.response.data.error
                    }));

                } else {
                    dispatch(getBookLists(response.payload.id)).then((data) => {
                        console.log('data getCartItems Login:', data);
                    });
                    dispatch(getCartItems(response.payload.id)).then((data) => {
                        console.log('data getCartItems Login:', data);
                    });
                    dispatch(notificationStateChange({
                        notification: true,
                        notificationColor: "success",
                        notificationMessage: "Login successful!"
                    }));
                    navigate("/");
                }

            }, (error) => {
                console.log("Official error:", error)

            });

        } else {
            console.log('Invalid email or password');
        }
    };

    const validateEmail = () => {
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
    const validatePassword = () => {
        // Add your password validation logic here
        // For example, check if the password has a minimum length of 8 characters
        if (password.length >= 8) {
            setPasswordInputError('');
            return true;
        } else {
            setPasswordInputError('Password must be at least 8 characters long.');
            return false;
        }
    };
    const redirectToGoogleSSO = async () => {
        try {
            const googleLoginURL = BACKEND_URL + "/api/v1/secure/auth/login/google";
            window.location.href = googleLoginURL;

            // Optional: You can fetch user data or perform other actions after redirection.
            // await fetchAuthUser();
            console.log("Redirecting to Google SSO...");
            const urlParams = new URLSearchParams(window.location.search);

            // Check if the token is present in the URL
            const token = urlParams.get("token");
            console.log("Token SUCCESS:", token)
            // Check if there's an error message in the URL
            const error = urlParams.get("error");
            console.log("Error:", error);
        } catch (error) {
            console.error("Error redirecting to Google SSO:", error);
        }
    };


// Assuming fetchAuthUser is defined somewhere in your code


    // return the JSX for the HomePage
    return (
        <>
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh'}}>
                <Sheet color="neutral" variant="soft" sx={{
                    width:{sm:"50%",md:"25%"},
                    height: "75%",
                    borderRadius: {sm:"20px",md:"20px"},
                    padding: "20px",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Typography
                        color="primary"
                        level="h3"
                        noWrap
                        variant="plain"
                    >
                        Login Here
                    </Typography>
                    <Box sx={{marginTop: "30px"}}/>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',

                    }}>
                        <Typography
                            color="primary"
                            level="title-lg"
                            noWrap
                            variant="plain"
                            style={{marginBottom: "10px"}}
                        >
                            Email-ID
                        </Typography>
                        <Input
                            color="primary"
                            disabled={false}
                            placeholder=""
                            size="lg"
                            variant="outlined"
                            style={{marginBottom: "10px"}}
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailInputError('');
                            }}
                            error={Boolean(emailInputError)}
                        />
                        {
                            Boolean(emailInputError) &&
                            <Typography color="danger" level="body-sm">{emailInputError}</Typography>
                        }
                    </Box>
                    <Box sx={{marginTop: "15px"}}/>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}>
                        <Typography
                            color="primary"
                            level="title-lg"
                            noWrap
                            variant="plain"
                        >
                            Password
                        </Typography>
                        <Input
                            color="primary"
                            disabled={false}
                            placeholder=""
                            size="lg"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordInputError('');
                            }}
                            error={Boolean(passwordInputError)}

                        />
                        {
                            Boolean(passwordInputError) &&
                            <Typography color="danger" level="body-sm">{passwordInputError}</Typography>
                        }
                    </Box>
                    {isAuthenticated === false ?
                        <Box sx={{
                            marginTop: "30px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>

                            <Button color="primary" variant="solid" onClick={handleLogin}>
                                Login
                            </Button>
                            <Typography
                                sx={{marginTop: "10px", marginBottom: "10px"}}
                                color="primary"
                                level="h5"
                                noWrap
                                variant="plain"
                            >
                                OR
                            </Typography>
                            <GoogleLoginButton onClick={() => redirectToGoogleSSO()}/>
                        </Box> : <>Loading...</>}
                </Sheet>
                <Sheet color="primary" variant="soft" sx={{
                    width: "25%",
                    height: "75%",
                    borderRadius: {sm:"20px",md:"20px"},
                    padding: "20px",
                    display: {sm:'none',md:'flex'},

                    alignItems: 'center'
                }}>
                    <img src={BookStack} style={{
                        width: "100%", height: "auto"
                    }
                    } alt="Logo"/>

                </Sheet>
            </Box>
        </>
    );
}
