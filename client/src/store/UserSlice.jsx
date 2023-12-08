import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {BACKEND_URL} from '../../config/env';
import axios from "axios";

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (userCredentials,thunkAPI) => {
        try {
            console.log('userCredentials:', userCredentials);
            const loginURL = BACKEND_URL + "/api/v1/secure/auth/login";
            const response = await axios.post(loginURL, userCredentials, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseData = response.data;
            console.log('responseData:', responseData);
            if (!response.ok) {
                // return thunkAPI.rejectWithValue(responseData);
            }
            // console.log('responseData:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error:', error);
            return thunkAPI.rejectWithValue(error)
        }
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        user: null,
        role: null,
        loading: false,
        refreshToken: "",
        error: null
    },
    reducers: {
        loginPending: (state) => {
            state.loading = true;
            state.user = null;
            state.refreshToken = "";
            state.role = null;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.refreshToken = action.payload.token;
            state.error = null
            // console.log('action.payload:', action.payload);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('role', action.payload.role);
            localStorage.setItem('token', action.payload.token);
        },
        logOut: (state) => {
            // Clear items from localStorage on logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');

            // Optionally, reset other parts of the state to their initial values
            state.loading = false;
            state.role = null;
            state.user = null;
            state.refreshToken = "";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.id = action.payload.id;
            state.user = action.payload;
            state.role = action.payload.role;
            state.refreshToken = action.payload.token;
            state.error = null
            console.log('action.payload:', action.payload.id);
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('role', action.payload.role);
            localStorage.setItem('token', action.payload.token);
        }).addCase(loginUser.rejected, (state, action) => {
            console.log('action.payload:', action.payload);
            state.loading = false;
            state.error = action.payload;
        });
    },

});

export const {loginPending, loginSuccess, loginFail, logOut} = userSlice.actions;

export default userSlice.reducer;