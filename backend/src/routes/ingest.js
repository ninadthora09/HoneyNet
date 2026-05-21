const router = require("express").Router();

const emitter = require("../services/emitter");

const Attack = require("../models/Attack");

const auth = require("../middleware/auth");

const { getGeo } = require("../services/geoip");

const Credential = require("../models/Credential");

router.post("/", auth, async (req, res) => {
  try {
    const raw = req.body;

    const ip = raw.ip;

    if (raw.username || raw.password) {
      await Credential.findOneAndUpdate(
        {
          username: raw.username || "",
          password: raw.password || "",
        },

        {
          $inc: {
            count: 1,
          },

          $set: {
            lastSeen: new Date(),
          },

          $setOnInsert: {
            firstSeen: new Date(),
          },

          $addToSet: {
            sourceIPs: raw.ip,
          },
        },

        {
          upsert: true,
          new: true,
        },
      );
    }

    // GeoIP lookup
    const geo = await getGeo(ip);

    // Threat scoring
    let score = 25;

    // Fingerprint classification
    let fingerprint = "bot";

    // Human interaction detection
    if (raw.command && raw.command.length > 0) {
      fingerprint = "human";
      score = 45;
    }

    // Create enriched attack
    const attack = new Attack({
      ...raw,

      country: geo.country,
      city: geo.city,
      lat: geo.lat,
      lng: geo.lng,

      threatScore: score,
      fingerprint,

      timestamp: raw.timestamp ? new Date(raw.timestamp) : new Date(),
    });

    await attack.save();

    // Real-time broadcast
    emitter.broadcast("new_attack", attack.toObject());

    console.log("[ATTACK STORED]", {
      ip: attack.ip,
      username: attack.username,
      password: attack.password,
      command: attack.command,

      country: attack.country,
      city: attack.city,

      threatScore: attack.threatScore,
      fingerprint: attack.fingerprint,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("[INGEST ERROR]", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
