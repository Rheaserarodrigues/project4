require('dotenv').config();
const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/userController');

router.get('/get/:userId',userController.getUserById);

module.exports = router;
