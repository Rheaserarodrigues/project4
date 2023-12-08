import {useEffect, useState} from 'react';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
// Provide a path to a default profile image
import {useDispatch, useSelector} from 'react-redux';
// import { loginSuccess } from '../store/UserSlice.jsx';
import {BACKEND_URL} from "../../../config/env.jsx";
import {Stack} from "@mui/joy";
import CustomAvatar from "../../components/avatar/Avatar.jsx";

const LabelComponent = ({label}) => {
    return (
        <Typography
            color="primary"
            level="title-md"
            noWrap
            variant="plain"
        >
            {label}
        </Typography>
    );
};
const ProfilePage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const userDataState = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    // const { user } = useSelector((state) => state.user);

    useEffect(() => {

        // const user = localStorage.getItem('user');
        // console.log('user:', userDataState);
        const fetchUser = async (userDataState) => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/v1/secure/user/get/${userDataState.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include any additional headers if needed, such as authorization headers
                        // For example, if you have a token stored in localStorage
                        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    // You can include additional options here, such as credentials: 'include'
                });

                if (!response.ok) {
                    // Handle error if the response is not ok (status code other than 2xx)
                    throw new Error(`Error fetching user data: ${response.statusText}`);
                }

                const userData = await response.json();
                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                setProfilePicture(userData.profilePicture);
                setEmail(userData.email);
                setPhoneNumber(userData.phoneNumber);
                setAddress(userData.address);


                // return userData;
            } catch (error) {
                // Handle any network errors or exceptions
                console.error('Error fetching user data:', error.message);
                throw error; // Propagate the error for the caller to handle if needed
            }

        };

        // Call the fetchUser function when the component mounts
        fetchUser(userDataState);
    }, []); // Ensure the effect runs when the userId changes

    // Assuming you have user data available after login
    // const userData = {
    //     profilePicture: user.profilePicture || defaultProfileImage,
    //     firstName: user.firstName || '',
    //     lastName: user.lastName || '',
    //     email: user.email || '',
    //     phoneNumber: user.phoneNumber || '',
    //     address: user.address || '',
    // };

    const handleSaveProfile = () => {
        // Implement your logic to save the profile changes
        // For demonstration purposes, update the user data in the Redux store
        // dispatch(
        //     loginSuccess({
        //         loading: false,
        //         user: {
        //             ...user,
        //             firstName,
        //             lastName,
        //             email,
        //             phoneNumber,
        //             address,
        //         },
        //         role: user.role,
        //         token: user.token,
        //         error: null,
        //     })
        // );
        // You can make an API call or perform any other profile-related tasks here
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                marginTop: '20px',
                marginBottom: '20px',

            }}
        >
            <Sheet
                color="neutral"
                variant="soft"
                sx={{
                    width: {xs: '80%', md: '50%'},
                    height: '75%',
                    marginTop: '30px',
                    padding: {xs: '10px', sm: '15px', md: '20px'},
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px',
                }}
            >
                <Typography color="primary" level="h4" noWrap variant="plain">
                        Profile
                </Typography>
                <Box sx={{marginTop: '30px'}}/>
                <CustomAvatar toggleDrawer={null} size="lg" sx={{
                    width: '100px',
                    height: '100px',
                    fontWeight: 'bold',
                    fontsize: '30px',
                    borderRadius: '50%',

                }}/>
                <Box sx={{marginTop: '20px'}}/>
                <Stack gap={0}>
                    <LabelComponent label="First Name"/>
                    <Input
                        color="primary"
                        disabled={false}
                        placeholder="First Name"
                        size="lg"
                        variant="outlined"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Stack>

                <Box sx={{marginTop: '10px'}}/>
                <Stack gap={0}>
                    <LabelComponent label="Last Name"/>

                    <Input
                        color="primary"
                        disabled={false}
                        placeholder="Last Name"
                        size="lg"
                        variant="outlined"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Stack>
                <Box sx={{marginTop: '10px'}}/>
                <Stack gap={0}>
                    <LabelComponent label="Email-ID"/>
                    <Input
                        color="primary"
                        disabled={false}
                        placeholder="Email"
                        size="lg"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Stack>
                <Box sx={{marginTop: '10px'}}/>

            </Sheet>
        </Box>
    );
};

export default ProfilePage;
