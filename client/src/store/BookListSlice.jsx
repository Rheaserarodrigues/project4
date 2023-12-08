import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {BACKEND_URL} from '../../config/env';

// Async thunk to create a new book list
export const createBookList = createAsyncThunk(
    'bookLists/createBookList',
    async (bookListData, thunkAPI) => {
        try {
            const response = await axios.post(BACKEND_URL + '/api/v1/secure/book-list/create-book-list', bookListData);
            return response.data;
        } catch (error) {

            return thunkAPI.rejectWithValue(error)

        }
    }
);

// Async thunk to get all book lists for a user
export const getBookLists = createAsyncThunk(
    'bookLists/getBookLists',
    async (userId, thunkAPI) => {
        try {
            const response = await axios.get(BACKEND_URL + `/api/v1/secure/book-list/get-book-lists/${userId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
);

// Async thunk to add a book to a book list
export const addBookToBookList = createAsyncThunk(
    'bookLists/addBookToBookList',
    async (bookListData) => {
        try {
            const response = await axios.post(BACKEND_URL + `/api/v1/secure/book-list/add-book-to-list/${bookListData.bookListId}`, bookListData.bookData);
            return response.data;
        } catch (error) {
            console.error('Error adding book to book list:', error);
            throw error;
        }
    }
);

export const updateBookList = createAsyncThunk(
    'bookLists/updateBookList',
    async (bookList, thunkAPI) => {
        try {
            const response = await axios.put(BACKEND_URL + "/api/v1/secure/book-list/update-book-list-info",
                bookList
            );
            return response.data;
        } catch (error) {
            console.error('Error removing book from book list:', error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteBookList = createAsyncThunk(
    'bookLists/deleteBookList',
    async (bookListData, thunkAPI) => {
        try {
            const response = await axios.delete(BACKEND_URL + "/api/v1/secure/book-list/remove-book-list/" + bookListData.bookListId);
            return response.data;
        } catch (error) {
            console.error('Error removing book from book list:', error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteBookFromBookList = createAsyncThunk(
    'bookLists/deleteBookFromBookList',
    async (bookListData, thunkAPI) => {
        try {
            const response = await axios.delete(BACKEND_URL + "/api/v1/secure/book-list/remove-book-from-list/" + bookListData.bookListId + "/" + bookListData.bookId,
            );
            return response.data;
        } catch (error) {
            console.error('Error removing book from book list:', error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const bookListSlice = createSlice({
    name: 'bookLists',
    initialState: {
        bookLists: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createBookList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBookList.fulfilled, (state, action) => {
                state.loading = false;
                state.bookLists = action.payload;
                state.error = null;
            })
            .addCase(createBookList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getBookLists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookLists.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload)
                state.bookLists = action.payload;
                state.error = null;
            })
            .addCase(getBookLists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addBookToBookList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBookToBookList.fulfilled, (state, action) => {
                state.loading = false;
                // Update the specific book list in state with the new data
                const updatedBookList = state.bookLists.find((list) => list._id === action.payload._id);
                if (updatedBookList) {
                    Object.assign(updatedBookList, action.payload);
                }
                state.error = null;
            })
            .addCase(addBookToBookList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateBookList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBookList.fulfilled, (state, action) => {
                state.loading = false;
                // Update the specific book list in state with the new data
                const updatedBookList = state.bookLists.find((list) => list._id === action.payload._id);
                if (updatedBookList) {
                    Object.assign(updatedBookList, action.payload);
                }
                state.error = null;
            })
            .addCase(updateBookList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteBookFromBookList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBookFromBookList.fulfilled, (state, action) => {
                state.loading = false;
                // Update the specific book list in state with the new data
                const updatedBookList = state.bookLists.find((list) => list._id === action.payload._id);
                if (updatedBookList) {
                    Object.assign(updatedBookList, action.payload);
                }
                state.error = null;
            })
            .addCase(deleteBookFromBookList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteBookList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBookList.fulfilled, (state, action) => {
                state.loading = false;
                // Update the specific book list in state with the new data
                console.log("action.payload:", action.payload);
                state.bookLists = state.bookLists.filter((list) => list._id !== action.payload._id);
                state.error = null;
            })
            .addCase(deleteBookList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default bookListSlice.reducer;
