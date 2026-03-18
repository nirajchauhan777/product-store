const express = require('express');
const { getProfile, getUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.get('/', protect, admin, getUsers);

module.exports = router;
