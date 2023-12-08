
const BookList = require("../../models/bookList");
const mongoose = require("mongoose");
const getRecentBookListsLimit10 = async (req, res) => {
    try {
        // Fetch the top 10 book lists ordered by last modified date
        const topBookLists = await BookList
            .find({sharingOption: 'public'}, 'bookListName bookListDescription creatorName totalPagesOfBooksInList totalBooks bookList lastModifiedDate')
            .sort({updatedAt: -1})
            .limit(10);

        res.json(topBookLists);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const getRecentBookListsLimit20 = async (req, res) => {
    try {
        // Fetch the top 10 book lists ordered by last modified date
        const topBookLists = await BookList
            .find({sharingOption: 'public'}, 'bookListName bookListDescription creatorName totalPagesOfBooksInList totalBooks bookList lastModifiedDate')
            .sort({updatedAt: -1})
            .limit(20);

        res.json(topBookLists);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const getBookListsByUserId = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find all book lists for the user by user ID
        const bookLists = await BookList.find({userId});

        if (bookLists.length === 0) {
            return res.status(404).json({message: 'No book lists found for the user'});
        }

        res.json(bookLists);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}
const createBookList = async (req, res) => {
    const {userId, creatorName, bookListName, bookListDescription, sharingOption} = req.body;

    try {


        // Create a new book list
        const newBookList = new BookList({
            userId,
            creatorName,
            bookListName,
            bookListDescription,
            sharingOption: sharingOption || 'private', // Set default to private if not provided
        });

        // Save the new book list to the database
        await newBookList.save();

        const bookLists = await BookList.find({userId})

        res.json(bookLists);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
const addBookToList = async (req, res) => {
    const {bookId, bookName, bookPicture, bookAuthor, totalPages} = req.body;
    const bookListId = req.params.bookListId;

    try {
        // Check if the book with the same ID already exists in the list
        const existingBookList = await BookList.findOne(
            {
                _id: bookListId,
                "bookList.bookId": bookId
            },
            {
                "bookList.$": 1 // Projection to retrieve only the matching book in the array
            }
        );
        console.log(existingBookList);
        if (existingBookList) {
            return res.status(400).json({error: 'Book already added to the list'});
        }

        // If the book doesn't exist in the list, proceed to update the book list
        const updatedBookList = await BookList.findByIdAndUpdate(
            bookListId,
            {
                $push: {
                    bookList: {
                        bookId,
                        bookName,
                        bookPicture,
                        bookAuthor,
                        totalPages,
                    }
                },
                $inc: {
                    totalPagesOfBooksInList: totalPages,
                    totalBooks: 1
                }
            },
            {new: true} // Returns the updated document
        );

        if (!updatedBookList) {
            return res.status(404).json({error: 'Book list not found'});
        }

        res.json(updatedBookList);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}
const updateBookListInfo = async (req, res) => {
    const {bookListId, bookListName, bookListDescription, sharingOption} = req.body;

    try {
        // Check if the book list with the specified ID exists
        const existingBookList = await BookList.findById(bookListId);

        if (!existingBookList) {
            return res.status(404).json({error: 'Book list not found'});
        }

        // Update the book list information
        existingBookList.bookListName = bookListName || existingBookList.bookListName;
        existingBookList.bookListDescription = bookListDescription || existingBookList.bookListDescription;
        existingBookList.sharingOption = sharingOption || existingBookList.sharingOption;

        // Save the updated book list to the database
        await existingBookList.save();

        // Fetch and return the updated book list
        const updatedBookList = await BookList.findById(bookListId);
        res.json(updatedBookList);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}



const removeBookFromBookList = async (req, res) => {

    const bookListId = req.params.bookListId;
    const bookId = req.params.bookId;

    console.log("bookId: ", bookId);
    console.log("bookListId: ", bookListId);
    try {
        // Check if the book with the specified ID exists in the list
        const existingBookList = await BookList.findOne(
            {
                _id: bookListId,
                "bookList.bookId": bookId
            },
            {
                "bookList.$": 1 // Projection to retrieve only the matching book in the array
            }
        );

        if (!existingBookList) {
            return res.status(404).json({error: 'Book not found in the list'});
        }

        // If the book exists in the list, proceed to update the book list
        const updatedBookList = await BookList.findByIdAndUpdate(
            bookListId,
            {
                $pull: {
                    bookList: {
                        bookId
                    }
                },
                $inc: {
                    totalPagesOfBooksInList: -existingBookList.bookList[0].totalPages,
                    totalBooks: -1
                }
            },
            {new: true} // Returns the updated document
        );

        if (!updatedBookList) {
            return res.status(404).json({error: 'Book list not found'});
        }

        res.json(updatedBookList);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

const removeBookList = async (req, res) => {
    const bookListId = req.params.bookListId;

    try {
        // Check if the book list with the specified ID exists
        const existingBookList = await BookList.findById(bookListId);

        if (!existingBookList) {
            return res.status(404).json({error: 'Book list not found'});
        }

        console.log("existingBookList: ", existingBookList);

        // Remove the entire book list
        const removedBookList = await BookList.findByIdAndDelete({_id: bookListId});

        if (!removedBookList) {
            return res.status(404).json({error: 'Book list not found'});
        }

        res.json({_id: bookListId, message: 'Book list removed successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

const addReviewToBookList = async (req, res) => {
    try {
        const { bookListId, userId,userName, rating, comment } = req.body;

        // Validate that the required parameters are present
        if (!bookListId || !userId || !rating || !userName) {
            return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
        }

        // Check if the book list exists
        const bookList = await BookList.findById(bookListId);

        if (!bookList) {
            return res.status(404).json({ error: 'Book list not found.' });
        }

        // Create a new review
        const newReview = {
            userId,
            rating,
            userName,
        };

        // Add the comment to the review if provided
        if (comment !== undefined) {
            newReview.comment = comment;
        }

        // Add the review to the book list
        bookList.reviews.push(newReview);

        // Save the updated book list with the new review
        const updatedBookList = await bookList.save();

        res.status(201).json(updatedBookList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getReviewsByBookList = async (req, res) => {
    try {
        const { bookListId } = req.params;

        // Check if the book list ID is provided
        if (!bookListId) {
            return res.status(400).json({ error: 'Invalid request. Missing book list ID.' });
        }

        // Check if the book list exists
        const bookList = await BookList.findById(bookListId);

        if (!bookList) {
            return res.status(404).json({ error: 'Book list not found.' });
        }

        // Retrieve reviews from the book list
        const reviews = bookList.reviews;

        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to hide a review
const hideReview = async (req, res) => {
    const { bookListId, reviewId } = req.params;
    const { hide } = req.query;

    try {
        // Find the book list by ID
        const bookList = await BookList.findById(bookListId);

        if (!bookList) {
            return res.status(404).json({ error: 'Book list not found' });
        }

        // Find the review within the book list
        const reviewIndex = bookList.reviews.findIndex((review) => review._id.toString() === reviewId);

        if (reviewIndex === -1) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Toggle the review's 'hidden' property based on the 'hide' query parameter
        bookList.reviews[reviewIndex].hidden = hide === 'true';

        // Save the updated book list
        await bookList.save();

        // Return the updated book list as a response
        res.json(bookList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getHiddenReviews = async (req, res) => {
    try {
        const { bookListId } = req.params;

        // Check if the book list ID is provided
        if (!bookListId) {
            return res.status(400).json({ error: 'Invalid request. Missing book list ID.' });
        }

        // Check if the book list exists
        const bookList = await BookList.findById(bookListId);

        if (!bookList) {
            return res.status(404).json({ error: 'Book list not found.' });
        }

        // Retrieve only the hidden reviews from the book list
        const hiddenReviews =  bookList.reviews.filter((review) => !review.hidden);

        res.status(200).json(hiddenReviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getRecentBookListsLimit10,
    getRecentBookListsLimit20,
    getBookListsByUserId,
    createBookList,
    updateBookListInfo,
    removeBookList,
    addBookToList,
    removeBookFromBookList,
    addReviewToBookList,
    getReviewsByBookList,
    hideReview,
    getHiddenReviews

};