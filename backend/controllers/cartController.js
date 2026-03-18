const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('products.product');
  if (!cart) {
    return res.json({ products: [] });
  }
  res.json(cart);
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'productId and quantity are required' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  let cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, products: [] });
  }

  const existingIndex = cart.products.findIndex((item) => item.product.toString() === productId);

  if (existingIndex >= 0) {
    cart.products[existingIndex].quantity += quantity;
  } else {
    cart.products.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate('products.product');

  res.json(cart);
};

const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: 'productId is required' });
  }

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  cart.products = cart.products.filter((item) => item.product.toString() !== productId);
  await cart.save();
  await cart.populate('products.product');

  res.json(cart);
};

const getAllCarts = async (req, res) => {
  const carts = await Cart.find()
    .populate('userId', 'name email role')
    .populate('products.product');
  res.json(carts);
};

const getCartById = async (req, res) => {
  const { id } = req.params;
  const cart = await Cart.findById(id)
    .populate('userId', 'name email role')
    .populate('products.product');

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  res.json(cart);
};

const adminAddToCart = async (req, res) => {
  const { id } = req.params;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'productId and quantity are required' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const cart = await Cart.findById(id);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const existingIndex = cart.products.findIndex((item) => item.product.toString() === productId);

  if (existingIndex >= 0) {
    cart.products[existingIndex].quantity += quantity;
  } else {
    cart.products.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate({ path: 'userId', select: 'name email role' });
  await cart.populate('products.product');

  res.json(cart);
};

const adminRemoveFromCart = async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'productId is required' });
  }

  const cart = await Cart.findById(id);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  cart.products = cart.products.filter((item) => item.product.toString() !== productId);
  await cart.save();
  await cart.populate({ path: 'userId', select: 'name email role' });
  await cart.populate('products.product');

  res.json(cart);
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  getAllCarts,
  getCartById,
  adminAddToCart,
  adminRemoveFromCart,
};
