const express = require('express');
const router = express.Router();
const bookListController = require('../../../controllers/bookListController');

router.get('/top-book-lists', bookListController.getRecentBookListsLimit20);

router.get('/get-book-lists/:userId', bookListController.getBookListsByUserId);

router.post('/create-book-list', bookListController.createBookList);

router.post('/add-book-to-list/:bookListId', bookListController.addBookToList);

router.put('/update-book-list-info', bookListController.updateBookListInfo);

router.delete('/remove-book-list/:bookListId', bookListController.removeBookList);


router.delete('/remove-book-from-list/:bookListId/:bookId', bookListController.removeBookFromBookList);

router.post('/add-review', bookListController.addReviewToBookList);

router.get('/reviews/:bookListId', bookListController.getHiddenReviews);

module.exports = router;