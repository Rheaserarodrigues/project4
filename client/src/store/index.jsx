import {configureStore} from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import cartReducer from './CartSlice.jsx';
import bookReducer from './BooksSlice.jsx';
import openBookReducer from './OpenBooksSlice.jsx';
import notificationReducer from './NotificationSlice.jsx';
import bookListReducer from './BookListSlice.jsx';

const Store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        // So we can later use slice-specific selectors
        user: userReducer,
        cart: cartReducer,
        books: bookReducer,
        openBooks: openBookReducer,
        bookList: bookListReducer,
        notification: notificationReducer
    },
});

export default Store;