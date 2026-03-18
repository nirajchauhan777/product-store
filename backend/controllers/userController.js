const User = require('../models/User');

const getProfile = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

const getUsers = async (req, res) => {
  // Admin only
  const users = await User.find().select('-password');
  res.json(users);
};

module.exports = { getProfile, getUsers };
