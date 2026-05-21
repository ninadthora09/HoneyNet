const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

// Fake pages attackers usually probe
const fakePages = [
  "/admin",
  "/login",
  "/phpmyadmin",
  "/.env",
  "/config",
];

app.use(async (req, res) => {

  const ip =
    req.headers["cf-connecting-ip"] || req.ip;

  // Detect login POST
  const isLoginPost =
    fakePages.includes(req.path) &&
    req.method === "POST";

  // -----------------------------
  // GENERIC ATTACK LOGGING
  // -----------------------------
  // Skip generic logging for login POST
  // because login attempts are handled separately
  // to avoid duplicate credential logs
  // -----------------------------

  if (!isLoginPost) {

    const attack = {

      ip,

      method: req.method,

      path: req.originalUrl,

      userAgent:
        req.headers["user-agent"],

      sensor: "http",

      timestamp: new Date(),

    };

    console.log("[HTTP ATTACK]", attack);

    try {

      await axios.post(
        "http://localhost:5000/api/ingest",
        attack,
        {
          headers: {
            "x-api-key":
              "my-super-secret-key",
          },
        }
      );

    } catch (err) {

      console.log(
        "Backend ingest failed"
      );

      console.log(
        err.response?.data ||
        err.message
      );

    }

  }

  // -----------------------------
  // FAKE LOGIN PAGE
  // -----------------------------

  if (
    fakePages.includes(req.path) &&
    req.method === "GET"
  ) {

    return res.status(200).send(`

      <html>

        <body style="
          background:black;
          color:lime;
          font-family:monospace;
          padding:40px;
        ">

          <h1>Admin Login</h1>

          <form
            method="POST"
            action="${req.path}"
          >

            <input
              name="username"
              placeholder="Username"
              style="
                margin:10px;
                padding:8px;
              "
            />

            <br/>

            <input
              type="password"
              name="password"
              placeholder="Password"
              style="
                margin:10px;
                padding:8px;
              "
            />

            <br/>

            <button type="submit">
              Login
            </button>

          </form>

        </body>

      </html>

    `);

  }

  // -----------------------------
  // CREDENTIAL CAPTURE
  // -----------------------------

  if (isLoginPost) {

    const loginAttack = {

      ip,

      method: req.method,

      path: req.originalUrl,

      username:
        req.body.username || "",

      password:
        req.body.password || "",

      userAgent:
        req.headers["user-agent"],

      sensor: "http",

      timestamp: new Date(),

    };

    console.log(
      "[HTTP LOGIN ATTEMPT]",
      loginAttack
    );

    try {

      await axios.post(
        "http://localhost:5000/api/ingest",
        loginAttack,
        {
          headers: {
            "x-api-key":
              "my-super-secret-key",
          },
        }
      );

    } catch (err) {

      console.log(
        "Backend ingest failed"
      );

      console.log(
        err.response?.data ||
        err.message
      );

    }

    return res
      .status(401)
      .send("Invalid credentials");

  }

  // -----------------------------
  // DEFAULT RESPONSE
  // -----------------------------

  res.status(404).send("Not Found");

});

app.listen(PORT, () => {

  console.log(
    `HTTP Honeypot running on port ${PORT}`
  );

});