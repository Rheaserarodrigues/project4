import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {BACKEND_URL} from '../../config/env';
import axios from "axios";

export const getCartItems = createAsyncThunk(
    'cart/getCartItems',
    async (userId,thunkAPI) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/secure/cart/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            // console.error('Error:', error);
            return thunkAPI.rejectWithValue(error.response.data);

        }
    }
);

export const addToCartAsyncThunk = createAsyncThunk(
    'cart/addToCart',
    async (cartItem,thunkAPI) => {
        try {
            const response = await axios.post(BACKEND_URL + "/api/v1/secure/cart/" + cartItem.userId + "/addToCart", cartItem.data, {});

            // console.log("response:", response);
            const responseData = response.data;
            return responseData;
        } catch (error) {
            // console.error('Error:', error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deleteFromCartAsyncThunk = createAsyncThunk(
    'cart/deleteFromCart',
    async (cartItem,thunkAPI) => {
        try {
            const response = await axios.delete(BACKEND_URL + "/api/v1/secure/cart/" + cartItem.userId + "/removeFromCart/"+cartItem.bookId, {});

            // console.log("response:", response);
            const responseData = response.data;
            return responseData;
        } catch (error) {
            // console.error('Error:', error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        cartTotal: null,
        loading: false,
        error: null
    },
    reducers: {
        addToCartPending: (state) => {
            state.loading = true;
            state.error = null;
        },
        addToCartSuccess: (state, action) => {
            state.loading = false;
            state.cart = action.payload.cartItems;

            state.cartTotal = action.payload.cartTotal;
            state.error = null;
        },
        addToCartFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        removeFromCartPending: (state) => {
            state.loading = true;
            state.error = null;
        },
        removeFromCartSuccess: (state, action) => {
            state.loading = false;
            const updatedCart = action.payload.map(item => ({
                ...item,
                totalPrice: item.quantity * item.price
            }));
            state.cart = updatedCart;
            state.error = null;
        },
        removeFromCartFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateCartItemQuantityPending: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateCartItemQuantitySuccess: (state, action) => {
            state.loading = false;
            const updatedCart = action.payload.map(item => ({
                ...item,
                totalPrice: item.quantity * item.price
            }));
            state.cart = updatedCart;
            state.error = null;
        },
        updateCartItemQuantityFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCartItems.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(getCartItems.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload.items;
            state.cartTotal = action.payload.totalBill;
            state.error = null

        }).addCase(getCartItems.rejected, (state, action) => {
            // console.log('action.payload:', action.payload);
            state.loading = false;
            state.error = action.payload;
        }).addCase(addToCartAsyncThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(addToCartAsyncThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload.items;
            state.cartTotal = action.payload.totalBill;
            state.error = null

        }).addCase(addToCartAsyncThunk.rejected, (state, action) => {
            // console.log('action.payload:', action.payload);
            state.loading = false;
            state.error = action.payload;
        }).addCase(deleteFromCartAsyncThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(deleteFromCartAsyncThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload.items;
            state.cartTotal = action.payload.totalBill;
            state.error = null

        }).addCase(deleteFromCartAsyncThunk.rejected, (state, action) => {
            console.log('action.payload:', action.payload);
            state.loading = false;
            state.error = action.payload;
        });
    },

});
export const {
    addToCartPending,
    addToCartSuccess,
    addToCartFail,
    removeFromCartPending,
    removeFromCartSuccess,
    removeFromCartFail,
    updateCartItemQuantityPending,
    updateCartItemQuantitySuccess,
    updateCartItemQuantityFail
} = cartSlice.actions;
// export const {loginPending,loginSuccess,loginFail,logOut} = userSlice.actions;

export default cartSlice.reducer;