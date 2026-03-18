const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  getAllCarts,
  getCartById,
  adminAddToCart,
  adminRemoveFromCart,
} = require('../controllers/cartController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// User cart endpoints
router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/remove', removeFromCart);

// Admin cart management
router.get('/admin', admin, getAllCarts);
router.get('/admin/:id', admin, getCartById);
router.post('/admin/:id/add', admin, adminAddToCart);
router.delete('/admin/:id/remove', admin, adminRemoveFromCart);

module.exports = router;
