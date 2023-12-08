import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {BACKEND_URL} from '../../config/env';
import axios from "axios";

// Async thunk to get books for the next page
export const getNextPage = createAsyncThunk(
    'books/getNextPage',
    async ({searchQuery, filterOptions, startIndex}) => {

        try {
            const response = await axios.get(BACKEND_URL + '/api/v1/open/books/list', {
                params: {
                    searchQuery: searchQuery, // Set a default search term or remove this line if not needed
                    startIndex: startIndex + 20, // Assuming 10 items per page
                    maxResults: 20,
                    filterOptions: filterOptions,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching books for the next page:', error);
        }
    }
);

// Async thunk to get books for the previous page
export const getPreviousPage = createAsyncThunk(
    'books/getPreviousPage',
    async ({searchQuery, filterOptions, startIndex}) => {

        try {
            const response = await axios.get(BACKEND_URL + '/api/v1/open/books/list', {
                params: {
                    searchQuery: searchQuery, // Set a default search term or remove this line if not needed
                    startIndex: startIndex === 1 ? startIndex : startIndex - 20, // Assuming 10 items per page
                    maxResults: 20,
                    filterOptions: filterOptions,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching books for the previous page:', error);
        }
    }
);
export let getBooksItems = createAsyncThunk(
    'books/getBooksItems',
    async (booksParameters) => {
        const {searchQuery, filterOptions, startIndex} = booksParameters;
        try {
            const response = await axios.get(BACKEND_URL + "/api/v1/open/books/list", {
                params: {
                    searchQuery: searchQuery, // Set a default search term or remove this line if not needed
                    startIndex: startIndex, // Assuming 10 items per page
                    maxResults: 20,
                    filterOptions: filterOptions,
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    }
);

const BooksSlice = createSlice({
    name: 'books',
    initialState: {
        books: [],
        currentPage: 1,
        filterOptions: null,
        searchQuery: "",
        loading: true,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getBooksItems.pending,
            (state) => {
                state.loading = true;
                state.error = null;
            },
        ).addCase(
            getBooksItems.fulfilled,
            (state, action) => {
                state.loading = false;

                state.books = action.payload.items;
                state.currentPage = action.meta.arg.startIndex;
                state.filterOptions = action.meta.arg.filterOptions;
                state.searchQuery = action.meta.arg.searchQuery;
                state.error = null;
            },
        ).addCase(
            getBooksItems.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            },
        ).addCase(getNextPage.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(getNextPage.fulfilled, (state, action) => {
            state.loading = false;
            state.books = action.payload.items;
            state.currentPage = action.meta.arg.startIndex;
            state.filterOptions = action.meta.arg.filterOptions;
            state.searchQuery = action.meta.arg.searchQuery;
            state.error = null;
        }).addCase(getNextPage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }).addCase(getPreviousPage.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(getPreviousPage.fulfilled, (state, action) => {
            state.loading = false;
            state.books = action.payload.items;
            state.currentPage = action.meta.arg.startIndex;
            state.filterOptions = action.meta.arg.filterOptions;
            state.searchQuery = action.meta.arg.searchQuery;
            state.error = null;
        }).addCase(getPreviousPage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});
export const {
    addToBooksListPending,
    addToBooksListSuccess,
    addToBooksListFail
} = BooksSlice.actions;
// export const {loginPending,loginSuccess,loginFail,logOut} = userSlice.actions;

export default BooksSlice.reducer;