const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: process.env.SEED_ADMIN_EMAIL });
    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const hashed = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'admin123', 10);

    const admin = await User.create({
      name: 'Admin',
      email: process.env.SEED_ADMIN_EMAIL,
      password: hashed,
      role: 'admin',
    });

    console.log('Created admin user:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
