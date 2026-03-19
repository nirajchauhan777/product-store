const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");

function formatDate(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getPastDays(days) {
  const result = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    result.push(formatDate(day));
  }

  return result;
}

router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json({
      totalSales: salesData[0]?.totalSales || 0,
      totalOrders,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/analytics", async (req, res) => {
  try {
    const salesDays = 7;
    const userDays = 30;

    const rangeStart = new Date();
    rangeStart.setHours(0, 0, 0, 0);
    rangeStart.setDate(rangeStart.getDate() - (salesDays - 1));

    const ordersByDay = await Order.aggregate([
      { $match: { createdAt: { $gte: rangeStart } } },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const userRangeStart = new Date();
    userRangeStart.setHours(0, 0, 0, 0);
    userRangeStart.setDate(userRangeStart.getDate() - (userDays - 1));

    const usersByDay = await User.aggregate([
      { $match: { createdAt: { $gte: userRangeStart } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const ordersMap = Object.fromEntries(ordersByDay.map((o) => [o._id, o]));
    const usersMap = Object.fromEntries(usersByDay.map((u) => [u._id, u]));

    const salesDates = getPastDays(salesDays);
    const userDates = getPastDays(userDays);

    const salesTrend = salesDates.map((date) => ({
      date,
      totalSales: ordersMap[date]?.totalSales || 0,
    }));

    const ordersTrend = salesDates.map((date) => ({
      date,
      count: ordersMap[date]?.count || 0,
    }));

    const usersTrend = userDates.map((date) => ({
      date,
      count: usersMap[date]?.count || 0,
    }));

    res.json({
      sales: salesTrend,
      orders: ordersTrend,
      users: usersTrend,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
