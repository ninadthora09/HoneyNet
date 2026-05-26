const { io } = require("socket.io-client");

const socket = io("https://honeynet.onrender.com");

socket.on("connect", () => {
  console.log("[CONNECTED TO SOCKET SERVER]");

  socket.emit("test", {
    message: "Hello from client"
  });
});

socket.on("new_attack", (data) => {
  console.log("[LIVE ATTACK RECEIVED]");
  console.log(data);
});