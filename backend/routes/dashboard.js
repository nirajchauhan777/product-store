const express = require("express");
const x router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");

router.get("/stats", async (req, res) => {
  try {

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" }
        }
      }
    ]);

    res.json({
      totalSales: salesData[0]?.totalSales || 0,
      totalOrders,
      totalUsers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;