// Import necessary components and libraries
import {useState} from 'react';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import {InfoOutlined} from '@mui/icons-material';
import Button from '@mui/joy/Button';
import {FormControl, FormHelperText, FormLabel, Stack} from '@mui/joy';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {notificationStateChange} from '../../store/NotificationSlice.jsx';
import {useNavigate} from 'react-router-dom';
import {BACKEND_URL} from "../../../config/env.jsx";

// CustomInputField component (similar to the one in RegisterPage)
const CustomInputField = ({
                              label,
                              type,
                              value,
                              onChange,
                              error,
                              styleProps,
                          }) => (
    <FormControl error={Boolean(error)}>
        <FormLabel>
            <Typography color="primary">{label}</Typography>
        </FormLabel>
        <Input
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

// UpdatePasswordPage component
const UpdatePasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDataState = useSelector((state) => state.user.user);

    console.log('user:', userDataState)

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Real-time error messages
    const [oldPasswordInputError, setOldPasswordInputError] = useState('');
    const [newPasswordInputError, setNewPasswordInputError] = useState('');

    const handleUpdatePassword = async () => {
        // Check for all input validation before proceeding with password update
        if (validateOldPassword() && validateNewPassword()) {
            console.log("Passed Password")

            console.log(userDataState.id,oldPassword,newPassword)
            try {
                // Make an API call to update the password
                const response = await axios.put(
                    BACKEND_URL +'/api/v1/secure/auth/update-password',
                    {
                        userId: userDataState.id, // Replace with the actual userId
                        oldPassword: oldPassword,     // Replace with the actual old password
                        newPassword: newPassword      // Replace with the desired new password
                    }
                );


                // Handle success response
                dispatch(
                    notificationStateChange({
                        notification: true,
                        notificationColor: 'success',
                        notificationMessage: response.data.message,
                    })
                );

                // Navigate to another page or handle accordingly
                // navigate('/dashboard');
            } catch (error) {
                // Handle error response
                console.log(error);
                dispatch(
                    notificationStateChange({
                        notification: true,
                        notificationColor: 'danger',
                        notificationMessage: error.response.data.error,
                    })
                );
            }
        } else {
            // Handle accordingly (display an error message, etc.)
            console.log('Invalid input(s)');
        }
    };

    const validateOldPassword = () => {
        // Check for minimum length
        console.log(!(/[A-Z]/).test(oldPassword))
        if (oldPassword.length < 8) {
            setOldPasswordInputError('Password must be at least 8 characters long.');
            return false;
        }

        // Check for uppercase letter
        if (!(/[A-Z]/).test(oldPassword)) {
            setOldPasswordInputError('Password must contain at least one uppercase letter.');
            return false;
        }

        // Check for lowercase letter
        if (!/[a-z]/.test(oldPassword)) {
            setOldPasswordInputError('Password must contain at least one lowercase letter.');
            return false;
        }

        // Check for digit
        if (!/\d/.test(oldPassword)) {
            setOldPasswordInputError('Password must contain at least one digit.');
            return false;
        }

        // Check for special character
        if (!/[@$!%*?&]/.test(oldPassword)) {
            setOldPasswordInputError('Password must contain at least one special character.');
            return false;
        }

        // If all checks pass
        setOldPasswordInputError('');
        return true;
    };

    const validateNewPassword = () => {
        // Check for minimum length
        console.log(!(/[A-Z]/).test(newPassword))
        if (newPassword.length < 8) {
            setNewPasswordInputError('Password must be at least 8 characters long.');
            return false;
        }

        // Check for uppercase letter
        if (!(/[A-Z]/).test(newPassword)) {
            setNewPasswordInputError('Password must contain at least one uppercase letter.');
            return false;
        }

        // Check for lowercase letter
        if (!/[a-z]/.test(newPassword)) {
            setNewPasswordInputError('Password must contain at least one lowercase letter.');
            return false;
        }

        // Check for digit
        if (!/\d/.test(newPassword)) {
            setNewPasswordInputError('Password must contain at least one digit.');
            return false;
        }

        // Check for special character
        if (!/[@$!%*?&]/.test(newPassword)) {
            setNewPasswordInputError('Password must contain at least one special character.');
            return false;
        }

        // If all checks pass
        setNewPasswordInputError('');
        return true;
    };

    // JSX for the UpdatePasswordPage
    return (
        <>
            <Box sx={{
                mt: 10
            }}>
                <Stack direction={"row"} justifyContent={"center"}>
                    <Sheet color="primary" variant="soft" sx={{
                        width: "400px",
                        height: "auto",
                        padding: 3,
                        borderRadius: 'lg',
                    }}>
                        <Stack direction={"row"} justifyContent={"center"}>
                            <Typography color="primary" level="h4">
                                Update Password
                            </Typography>
                        </Stack>
                        <Stack spacing={2}>
                            <CustomInputField
                                label="Old Password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => {
                                    setOldPassword(e.target.value);
                                    setOldPasswordInputError('');
                                }}
                                error={oldPasswordInputError}
                            />
                            <CustomInputField
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setNewPasswordInputError('');
                                }}
                                error={newPasswordInputError}
                            />
                        </Stack>
                        <Box sx={{marginTop: '30px'}}>
                            <Button
                                color="primary"
                                variant="solid"

                                onClick={handleUpdatePassword}
                            >
                                Update Password
                            </Button>
                        </Box>
                    </Sheet>
                </Stack>

            </Box>
        </>
    );
};

export default UpdatePasswordPage;
