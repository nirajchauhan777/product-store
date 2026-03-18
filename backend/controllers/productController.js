const Product = require('../models/Product');

const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

const getImageUrl = (req) => {
  if (req.file) {
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  return req.body.image || '';
};

const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  const product = new Product({
    name,
    description,
    price,
    image: getImageUrl(req),
    category: category || 'General',
    stock: stock ?? 0,
  });

  const created = await product.save();
  res.status(201).json(created);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, description, price, category, stock } = req.body;

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.image = getImageUrl(req) || product.image;
  product.category = category ?? product.category;
  product.stock = stock ?? product.stock;

  const updated = await product.save();
  res.json(updated);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await product.deleteOne();
  res.json({ message: 'Product deleted' });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
