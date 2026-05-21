const router = require("express").Router();
const Attack = require("../models/Attack");

router.get("/", async (req, res) => {
  try {
    const sessions = await Attack.aggregate([
      {
        $match: {
          sessionId: {
            $exists: true,
            $ne: null,
            $ne: "",
          },
        },
      },
      {
        $group: {
          _id: "$sessionId",

          ip: {
            $first: "$ip",
          },

          fingerprint: {
            $max: "$fingerprint",
          },

          startTime: {
            $min: "$timestamp",
          },

          endTime: {
            $max: "$timestamp",
          },

          totalEvents: {
            $sum: 1,
          },

          commands: {
            $sum: {
              $cond: [{ $ne: ["$command", ""] }, 1, 0],
            },
          },
        },
      },

      {
        $sort: {
          startTime: -1,
        },
      },
    ]);

    res.json(sessions);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
});

router.get("/:sessionId", async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const events = await Attack.find({
      sessionId,
    }).sort({ timestamp: 1 });

    if (events.length === 0) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const replay = {
      sessionId,

      ip: events[0].ip,

      fingerprint: events[0].fingerprint,

      startTime: events[0].timestamp,

      endTime: events[events.length - 1].timestamp,

      timeline: events.map((e) => ({
        timestamp: e.timestamp,
        username: e.username,
        password: e.password,
        command: e.command,
      })),
    };

    res.json(replay);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
});

module.exports = router;
