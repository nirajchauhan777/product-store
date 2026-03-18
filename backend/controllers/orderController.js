const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  const { products: incomingProducts } = req.body;

  // If frontend sends products, use those; otherwise, build from cart.
  let products = [];

  if (Array.isArray(incomingProducts) && incomingProducts.length > 0) {
    products = incomingProducts;
  } else {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('products.product');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const validItems = cart.products.filter((item) => item.product && item.product._id);

    if (validItems.length === 0) {
      return res.status(400).json({ message: 'Cart contains no valid products' });
    }

    products = validItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));
  }

  if (!products.length) {
    return res.status(400).json({ message: 'No products provided for order' });
  }

  const totalPrice = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    userId: req.user._id,
    products,
    totalPrice,
    status: 'pending',
  });

  // Optionally clear cart
  await Cart.findOneAndDelete({ userId: req.user._id });

  res.status(201).json(order);
};

const getOrders = async (req, res) => {
  if (req.user.role === 'admin') {
    const orders = await Order.find().populate('userId', 'name email').populate('products.product');
    return res.json(orders);
  }

  const orders = await Order.find({ userId: req.user._id }).populate('products.product');
  res.json(orders);
};

module.exports = { createOrder, getOrders };
