const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const BACKEND_URL = "http://localhost:5000";
const API_KEY = "my-super-secret-key";

const { Server } = require("ssh2");
const fs = require("fs");

async function reportAttack(data) {
  try {
    await axios.post(`${BACKEND_URL}/api/ingest`, data, {
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    console.log("[+] Attack sent to backend");
  } catch (err) {
    console.log("[!] Backend error:", err.message);
  }
}

const server = new Server(
  {
    hostKeys: [fs.readFileSync("host.key")],
  },
  (client) => {
    const sessionId = uuidv4();
    console.log("New attacker connected");
    console.log("Session ID:", sessionId);

    client.on("authentication", (ctx) => {
      console.log("--- LOGIN ATTEMPT ---");
      console.log("Session:", sessionId);
      console.log("IP:", client._sock.remoteAddress);
      console.log("Auth Method:", ctx.method);
      console.log("Username:", ctx.username);

      if (ctx.method === "password") {
        console.log("Password:", ctx.password);

        reportAttack({
          ip: client._sock.remoteAddress,
          sensor: "ssh",
          port: 2222,
          username: ctx.username,
          password: ctx.password,
          sessionId: sessionId,
          timestamp: new Date(),
        });

        ctx.accept();
      } else {
        ctx.reject(["password"]);
      }
    });

    client.on("ready", () => {
      console.log("Attacker authenticated");

      client.on("session", (accept) => {
        const session = accept();
        session.on("pty", (accept) => {
          accept();
        });

        session.on("shell", (accept) => {
          const stream = accept();

          stream.write("Welcome to Ubuntu 22.04 LTS\n");
          stream.write("root@prod-server-01:~#");

          let commandBuffer = "";

          stream.on("data", (data) => {
            const input = data.toString();

            // Echo typed characters back
            stream.write(input);

            commandBuffer += input;

            // ENTER key pressed
            if (input.includes("\r")) {
              const command = commandBuffer.trim();

              console.log(`[${sessionId}] COMMAND:`, command);

              reportAttack({
                ip: client._sock.remoteAddress,
                sensor: "ssh",
                port: 2222,
                command: command,
                sessionId: sessionId,
                timestamp: new Date(),
              });

              const fakeResponses = {
                ls: "server.js  passwords.txt  secret_folder",
                pwd: "/root",
                whoami: "root",
                uname: "Linux ubuntu-server 5.15.0-91-generic x86_64 GNU/Linux",
                hostname: "prod-server-01",
                ifconfig: `
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
inet 192.168.1.10  netmask 255.255.255.0
`,
              };

              if (command === "exit") {
                stream.end("\nlogout\n");
                return;
              }

              if (fakeResponses[command]) {
                stream.write(`\n${fakeResponses[command]}\n`);
              } else {
                stream.write(`\nbash: ${command}: command not found\n`);
              }

              commandBuffer = "";
              stream.write("\nroot@prod-server-01:~# ");
            }
          });
        });
      });
    });

    client.on("end", () => {
      console.log("Attacker disconnected");
    });
  },
);

server.listen(2222, "0.0.0.0", () => {
  console.log("Fake SSH Honeypot running on port 2222");
});
