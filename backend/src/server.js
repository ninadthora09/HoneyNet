const express = require("express");
const cors = require("cors");
require("dotenv").config();

const emitter = require("./services/emitter");

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

const allowedOrigin =
  "https://honey-a0mnjkbfs-ninads-projects-5f39b854.vercel.app";

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

emitter.init(io);

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);
app.use(express.json());

connectDB();

app.use("/api/ingest", require("./routes/ingest"));
app.use("/api/attacks", require("./routes/attacks"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/credentials", require("./routes/credentials"));
app.use("/api/attackers", require("./routes/attackers"));
app.use("/api/sessions", require("./routes/sessions"));

app.get("/", (req, res) => {
  res.send("HoneyNet Backend Running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[HoneyNet Backend] Running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("[SOCKET CONNECTED]", socket.id);

  socket.on("test", (data) => {
    console.log("[SOCKET TEST EVENT]", data);
  });

  socket.on("disconnect", () => {
    console.log("[SOCKET DISCONNECTED]", socket.id);
  });
});
