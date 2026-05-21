const router = require("express").Router();
const Attack = require("../models/Attack");


router.get("/", async (req, res) => {
  try {
    const totalAttacks = await Attack.countDocuments();

    const sshAttacks = await Attack.countDocuments({
      sensor: "ssh",
    });

    const httpAttacks = await Attack.countDocuments({
      sensor: "http",
    });
    const activeSessions = await Attack.distinct("sessionId");

    const uniqueIPs = await Attack.distinct("ip");

    const topCountries = await Attack.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const topAttackers = await Attack.aggregate([
      {
        $group: {
          _id: "$ip",
          attacks: { $sum: 1 },
          maxThreat: { $max: "$threatScore" },
        },
      },
      {
        $sort: { attacks: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const highThreat = await Attack.countDocuments({
      threatScore: { $gte: 70 },
    });

    res.json({
      totalAttacks,

      sshAttacks,
      httpAttacks,

      uniqueIPs: uniqueIPs.length,

      uniqueAttackers: uniqueIPs.length,

      highThreat,

      activeSessions: activeSessions.length,

      topCountries,

      topAttackers,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
});

module.exports = router;
