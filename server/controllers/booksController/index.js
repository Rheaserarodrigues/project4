require("dotenv").config();
const axios = require('axios');

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY; // Replace with your actual API key

const getBookDataLimitTo10 = async (req, res) => {
    const { searchQuery, startIndex,maxResults,filterOptions } = req.query;

    try {

        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q:searchQuery,
                key: API_KEY,
                startIndex: startIndex,
                maxResults: 10,
                filter: filterOptions,
            },
        });

        // Process the retrieved book data as needed
        return res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getBookData = async (req, res) => {
    const { searchQuery, startIndex,maxResults,filterOptions } = req.query;

    try {

        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q:searchQuery,
                key: API_KEY,
                startIndex: startIndex,
                maxResults: maxResults,
                filter: filterOptions,
            },
        });

        // Process the retrieved book data as needed
        return res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to get book details by volume ID from Google Books API
const getBookByVolumeId = async (req, res) => {
    const { volumeId } = req.params;

    try {
        // Make a request to Google Books API with the provided volume ID
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${volumeId}`);



        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching book details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getBookData,
    getBookDataLimitTo10,
    getBookByVolumeId
};
