const router = require("express").Router();

const Credential = require("../models/Credential");

router.get("/", async (req, res) => {

  try {

    const credentials = await Credential.find()
      .sort({ count: -1 })
      .limit(100);

    res.json(credentials);

  } catch (err) {

    console.error("[credentials]", err.message);

    res.status(500).json({
      error: err.message,
    });

  }

});

module.exports = router;