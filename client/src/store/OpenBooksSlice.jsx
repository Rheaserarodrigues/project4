import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {BACKEND_URL} from '../../config/env';
import axios from "axios";

export let getOpenBooksItems = createAsyncThunk(
    'openBooks/getOpenBooksItems',
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

const OpenBooksSlice = createSlice({
    name: 'openBooks',
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
            getOpenBooksItems.pending,
            (state) => {
                state.loading = true;
                state.error = null;
            },
        ).addCase(
            getOpenBooksItems.fulfilled,
            (state, action) => {
                state.loading = false;
                state.books = action.payload.items;
                state.currentPage = action.meta.arg.startIndex;
                state.filterOptions = action.meta.arg.filterOptions;
                state.searchQuery = action.meta.arg.searchQuery;
                state.error = null;
            },
        ).addCase(
            getOpenBooksItems.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            },
        );
    }
});
export const {
    addToBooksListPending,
    addToBooksListSuccess,
    addToBooksListFail
} = OpenBooksSlice.actions;
// export const {loginPending,loginSuccess,loginFail,logOut} = userSlice.actions;

export default OpenBooksSlice.reducer;