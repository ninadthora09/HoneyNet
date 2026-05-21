const router = require("express").Router();
const Attack = require("../models/Attack");

router.get("/", async (req, res) => {
  try {
    const attackers = await Attack.aggregate([
      {
        $sort: {
          timestamp: 1,
        },
      },

      {
        $group: {
          _id: "$ip",

          attacks: {
            $sum: 1,
          },

          maxThreat: {
            $max: "$threatScore",
          },

          country: {
            $last: "$country",
          },

          fingerprint: {
            $first: "$fingerprint",
          },

          latestAttack: {
            $max: "$timestamp",
          },
        },
      },

      {
        $sort: {
          attacks: -1,
        },
      },

      {
        $limit: 100,
      },
    ]);

    res.json(attackers);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
});

router.get("/:ip", async (req, res) => {
  try {
    const ip = req.params.ip;

    // Fetch all attacks from this IP
    const attacks = await Attack.find({ ip }).sort({ timestamp: -1 });

    if (attacks.length === 0) {
      return res.status(404).json({
        error: "Attacker not found",
      });
    }

    // Extract unique credentials
    const credentials = [];

    const credSet = new Set();

    attacks.forEach((a) => {
      if (a.username || a.password) {
        const combo = `${a.username}:${a.password}`;

        if (!credSet.has(combo)) {
          credSet.add(combo);

          credentials.push({
            username: a.username,
            password: a.password,
          });
        }
      }
    });

    // Extract commands
    const commands = attacks
      .filter((a) => a.command)
      .map((a) => ({
        command: a.command,
        timestamp: a.timestamp,
      }));

    // Build dossier
    const dossier = {
      ip,

      country: attacks[0].country,

      fingerprint: attacks[0].fingerprint,

      stats: {
        totalAttacks: attacks.length,

        maxThreat: Math.max(...attacks.map((a) => a.threatScore || 0)),
      },

      credentials,

      commands,

      timeline: attacks,
    };

    res.json(dossier);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
});

module.exports = router;
