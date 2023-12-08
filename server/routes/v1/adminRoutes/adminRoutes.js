const express = require('express');
const router = express.Router();
const adminController = require('../../../controllers/adminController/index');
const bookListController = require('../../../controllers/bookListController');

router.get('/reviews/:bookListId', bookListController.getReviewsByBookList);

router.put('/hide-review/:bookListId/:reviewId', bookListController.hideReview);

// Route to get all users (admin only)
router.get('/users',  adminController.getAllUsers);

// Route to grant site manager privilege to a user (admin only)
router.put('/grant-site-manager/:userId',  adminController.grantSiteManagerPrivilege);

// Route to mark a review as hidden or clear the "hidden" flag (admin only)
router.put('/mark-review',  adminController.markReview);

// Route to mark a user as "deactivated" or "active" (admin only)
router.put('/mark-user-status',  adminController.markUserStatus);


module.exports = router;