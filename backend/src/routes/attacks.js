const router = require('express').Router();
const Attack = require('../models/Attack');

router.get('/', async (req, res) => {
  try {

    // Query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const skip = (page - 1) * limit;

    // Filters
    const filter = {};

    if (req.query.ip) {
      filter.ip = req.query.ip;
    }

    if (req.query.sensor) {
      filter.sensor = req.query.sensor;
    }

    // Fetch attacks
    const attacks = await Attack.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    // Total count
    const total = await Attack.countDocuments(filter);

    res.json({
      page,
      limit,
      total,
      attacks
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Server Error'
    });

  }
});

module.exports = router;