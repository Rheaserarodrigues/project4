const express = require('express');
const router = express.Router();
const booksController = require('../../../controllers/booksController');
const bookListController = require('../../../controllers/bookListController');

router.get('/list', booksController.getBookDataLimitTo10);

router.get('/top-book-lists', bookListController.getRecentBookListsLimit10);

module.exports = router;