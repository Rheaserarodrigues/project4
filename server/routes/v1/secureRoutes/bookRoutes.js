const express = require('express');
const router = express.Router();
const booksController = require('../../../controllers/booksController');

router.get('/list', booksController.getBookData);
router.get('/:volumeId', booksController.getBookByVolumeId);

module.exports = router;