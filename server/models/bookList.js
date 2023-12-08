// Assuming you have already set up Mongoose and connected to a MongoDB database

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: false, default: "" },
    timestamp: { type: Date, default: Date.now },
    hidden: { type: Boolean, default: false },
});

// Define a Book Schema
const bookSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    creatorName: {type: String, required: true},
    bookListName: {type: String, required: true},
    bookListDescription: {type: String, required: false, default: ""},
    totalPagesOfBooksInList: {type: Number, required: false, default: 0},
    totalBooks: {type: Number, required: false, default: 0},
    bookList: {
        type: [{
            bookId: {type: String, required: true},
            bookName: {type: String, required: true},
            bookPicture: {type: String, required: true},
            bookAuthor: {type: String, required: true},
            totalPages: {type: Number, required: true},
        }],
        default: [],
    },
    sharingOption: {type: String, enum: ['public', 'private'], default: 'private'},
    reviews: [reviewSchema],
}, {
    timestamps: true,
});

// Create the models
const BookList = mongoose.model('book_list_schema', bookSchema);

module.exports = BookList;
// Now, in your route handler where you fetch the book data and want to add it to the user's list:


