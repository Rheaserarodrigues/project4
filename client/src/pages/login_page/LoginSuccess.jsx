import {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {loginSuccess} from "../../store/UserSlice.jsx";
import {BACKEND_URL} from "../../../config/env.jsx";
import {useNavigate} from "react-router-dom";
import {getBookLists} from "../../store/BookListSlice.jsx";
import {getCartItems} from "../../store/CartSlice.jsx";

const SuccessLogin = () => {
    // const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchUser = async (userId,refreshToken) => {
        try {
            const response = await fetch(BACKEND_URL+"/api/v1/secure/user/get/"+userId, {
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
            const newUserData = {
                ...userData,
                id: userData._id
            }
            console.log('userData:', userData);
            dispatch(loginSuccess({
                id: userData._id,
                user: newUserData,
                token: refreshToken,
                role: userData.role,
                loading: false,
            }));
            dispatch(getBookLists(userData._id)).then((data) => {
                console.log('data getCartItems Login:', data);
            });
            dispatch(getCartItems(userData._id)).then((data) => {
                console.log('data getCartItems Login:', data);
            });
            // return userData;
        } catch (error) {
            // Handle any network errors or exceptions
            console.error('Error fetching user data:', error.message);
            throw error; // Propagate the error for the caller to handle if needed
        }

    };

    useEffect(() => {
        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);

        // Check if the token is present in the URL
        const token = urlParams.get('token');
        const userId = urlParams.get('userId');

        if (token) {
                      // Token is present, you can use it as needed (e.g., store it in state or local storage)
            console.log('Received token:', token);
            // setToken(token);
            setUserId(userId);

            fetchUser(userId,token);
            // Perform actions with the token as needed
            navigate('/',);
        } else {
            console.error('Token not found in URL parameters');
        }
    }, []);

    return (
        <div>
            {/* You can render any additional content for the success page if needed */}
            <p>Login Successful! Token: </p>
            <p>Login Successful! User ID: {userId}</p>
        </div>
    );
};

export default SuccessLogin;
