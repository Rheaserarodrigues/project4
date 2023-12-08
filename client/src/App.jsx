import './App.css'
import {createBrowserRouter, RouterProvider, Navigate,} from 'react-router-dom';
import RootLayout from "./RootLayout.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import RegisterPage from "./pages/register_page/RegisterPage.jsx";
import LoginPage from "./pages/login_page/LoginPage.jsx";
import SuccessLogin from "./pages/login_page/LoginSuccess.jsx";
import Profile from "./pages/profile_page/Profile.jsx";
import {useEffect} from "react";
import {loginSuccess, logOut} from "./store/UserSlice.jsx";
import {useDispatch, useSelector} from "react-redux";
import {AdminPanel} from "./pages/admin/AdminPanel.jsx";
import {CartPage} from "./pages/cart_page/CartPage.jsx";
import axios from 'axios';
import {BACKEND_URL} from "../config/env.jsx";
import PaymentPage from "./pages/payment_page/PaymentPage.jsx";
import {Snackbar} from "@mui/joy";
import {notificationStateChange} from "./store/NotificationSlice.jsx";
import BooksPage from "./pages/books/BooksPage.jsx";
import MyBookList from "./pages/my_book_list/MyBookList.jsx";
import UpdatePasswordPage from "./pages/update_passsword_page/UpdatePassword.jsx";
import {getBookLists} from "./store/BookListSlice.jsx";
import PublicBookList from "./pages/public_book_list/PublicBookList.jsx";
import OrdersPage from "./pages/orders_page/OrdersPage.jsx";

export function PublicRoute() {
    return {
        element: <RootLayout/>,
        children: [
            {path: "/", element: <HomePage/>},
            {path: "/login", element: <LoginPage/>},
            {path: "/login/success", element: <SuccessLogin/>},
            {path: "/books", element: <BooksPage/>},
            {path: "/register", element: <RegisterPage/>},
            {path: "/public-book-list", element: <PublicBookList/>},
            {path: "/orders", element: <OrdersPage/>},
            {path: "*", element: <Navigate to="/login" replace/>},
        ]
    };
}

export function AdminRoute() {
    return {
        element: <RootLayout/>,
        children: [
            {path: "/", element: <HomePage/>},
            {path: "/admin", element: <AdminPanel/>},
            {path: "/books", element: <BooksPage/>},
            {path: "/book-list", element: <MyBookList/>},
            {path: "/public-book-list", element: <PublicBookList/>},

            {path: "/profile", element: <Profile/>},
            {path: "/update-password", element: <UpdatePasswordPage/>},
            {path: "/cart", element: <CartPage/>},
            {path: "/orders", element: <OrdersPage/>},
            {path: "/payment", element: <PaymentPage/>},
            {path: "*", element: <Navigate to="/" replace/>},
        ],
    };
}

export function PrivateRoute() {
    return {
        element: <RootLayout/>,
        children: [
            {path: "/", element: <HomePage/>},
            {path: "/admin", element: <AdminPanel/>},

            {path: "/books", element: <BooksPage/>},
            {path: "/book-list", element: <MyBookList/>},
            {path: "/public-book-list", element: <PublicBookList/>},
            {path: "/orders", element: <OrdersPage/>},
            {path: "/profile", element: <Profile/>},
            {path: "/update-password", element: <UpdatePasswordPage/>},

            {path: "/cart", element: <CartPage/>},
            {path: "/payment", element: <PaymentPage/>},
            {path: "*", element: <Navigate to="/" replace/>},
        ],
    };
}

function App() {

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.user.refreshToken !== "");
    const notificationState = useSelector(state => state.notification);
    const isAdmin = useSelector(state => state.user.role === "admin");
    // console.log("errorState:", notificationState);
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Auto user login on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const validateToken = async (token) => {
            try {
                const response = await axios.get(BACKEND_URL + "/api/v1/secure/auth/protected-route", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                console.log('APP JSX:', response.data);
                const user = localStorage.getItem('user');

                // console.log('user:', user)

                if (response.data) {
                    // console.log('response.data:', response.data);
                    // dispatch(getCartItems(response.data.user._id));
                    // Dispatch login success action to update the Redux state
                    dispatch(
                        loginSuccess({
                            loading: false,
                            id: response.data.user._id,
                            user: JSON.parse(user),
                            role: response.data.role,
                            token: token,
                            error: null,
                        })
                    );
                    dispatch(getBookLists(response.data.user._id));

                } else {

                    dispatch(logOut());
                }
                return response.data;
            } catch (error) {
                console.error('Error validating token:', error);
                return false;
            }
        };
        validateToken(token)
    }, []);


    const router = createBrowserRouter(
        [
            isAuthenticated ? (isAdmin ? AdminRoute(): PrivateRoute()) : PublicRoute(),
        ]
    );

    function handleClose() {
        dispatch(notificationStateChange({
            notification: false, notificationColor: "neutral",
            notificationMessage: ""
        }));
    }

    const vertical = 'bottom';
    const horizontal = 'right';

    return (
        <>
            <RouterProvider router={router}/>
            <Snackbar
                anchorOrigin={{vertical, horizontal}}
                color={notificationState.notificationColor}
                variant={"solid"}
                open={notificationState.notification}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                {notificationState.notificationMessage}
            </Snackbar>
        </>
    )
}

export default App
