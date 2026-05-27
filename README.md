# HoneyNet — Real-Time Honeypot Intelligence Platform

https://honey-a0mnjkbfs-ninads-projects-5f39b854.vercel.app/

A full-stack honeypot intelligence platform built entirely using the **MERN stack + Node.js sensors** that captures, analyzes, fingerprints, and visualizes real-world cyber attacks in real time.

HoneyNet deploys fake vulnerable services such as SSH servers, admin panels, exposed APIs, and sensitive file endpoints to attract attackers and collect threat intelligence data.

The system:

- Captures attacker activity
- Logs credentials and commands
- Calculates threat scores
- Fingerprints attackers
- Streams attacks live to a dashboard
- Visualizes attacks on a world map
- Tracks attacker sessions
- Generates real-time threat analytics

This project is inspired by real threat intelligence and deception platforms used in cybersecurity operations.

---

# Table of Contents

1. What this project does
2. How it works — the big picture
3. System architecture
4. Tech stack
5. File structure
6. Database schemas
7. The sensors — Node.js honeypots
8. The backend — Node.js + Express
9. The frontend — React dashboard
10. Key algorithms
11. Real-time event pipeline
12. Session replay system
13. Credential intelligence system
14. Building order
15. How to run
16. API reference
17. Key features that make this project stand out
18. What's simulated vs real
19. Interview answers
20. License

---

# 1. What this project does

```text
Internet Attackers
       │
       │ probe SSH port 2222
       │ probe /wp-login.php
       │ probe /.env
       │ probe /admin
       │
       ▼
┌──────────────────────────────────────┐
│         NODE.JS HONEYPOT SENSORS    │
│                                      │
│  ssh_honeypot.js                     │
│  http_honeypot.js                    │
│                                      │
│  Captures:                           │
│  - IP address                        │
│  - Username/password attempts        │
│  - User agents                       │
│  - Commands typed                    │
│  - Paths requested                   │
└────────────────┬─────────────────────┘
                 │
                 │ POST /api/ingest
                 ▼
┌──────────────────────────────────────┐
│        EXPRESS + SOCKET.IO BACKEND  │
│                                      │
│  1. GeoIP lookup                     │
│  2. Threat scoring                   │
│  3. Attacker fingerprinting          │
│  4. Credential aggregation           │
│  5. MongoDB storage                  │
│  6. Real-time event broadcasting     │
└────────────────┬─────────────────────┘
                 │
                 │ WebSocket
                 ▼
┌──────────────────────────────────────┐
│          REACT DASHBOARD             │
│                                      │
│  - Live attack feed                  │
│  - World attack map                  │
│  - Threat leaderboard                │
│  - Credential intelligence           │
│  - Session replay                    │
│  - Per-attacker dossier              │
└──────────────────────────────────────┘
```

---

# 2. How it works — the big picture

Every day, automated scanners and attackers probe public servers searching for:

- Weak SSH credentials
- Exposed admin panels
- Vulnerable APIs
- Leaked configuration files
- Backup files
- Misconfigured services

HoneyNet deploys fake vulnerable services designed to attract those attackers.

Instead of giving access, every action is:

- Captured
- Logged
- Analyzed
- Scored
- Visualized

---

## Example attack flow

```text
Attacker attempts SSH login
        │
        ▼
ssh_honeypot.js captures:
- IP
- Username
- Password
- Timestamp
        │
        ▼
POST /api/ingest
        │
        ▼
Backend receives attack event
        │
        ├── GeoIP lookup
        ├── Threat score calculation
        ├── Attacker fingerprinting
        ├── Credential aggregation
        ├── MongoDB persistence
        └── Socket.io broadcast
        │
        ▼
Dashboard updates instantly
```

---

# 3. System architecture

```text
                ATTACKERS
                     │
                     ▼
        ┌────────────────────────┐
        │   NODE.JS SENSORS      │
        │                        │
        │  SSH Honeypot          │
        │  HTTP Honeypot         │
        └──────────┬─────────────┘
                   │
                   ▼
        ┌────────────────────────┐
        │  EXPRESS API BACKEND   │
        │                        │
        │  /api/ingest           │
        │  Threat Engine         │
        │  Fingerprinting        │
        │  GeoIP Analysis        │
        └──────────┬─────────────┘
                   │
                   ▼
        ┌────────────────────────┐
        │      MONGODB           │
        │                        │
        │  Attacks               │
        │  Credentials           │
        │  Sessions              │
        └──────────┬─────────────┘
                   │
                   ▼
        ┌────────────────────────┐
        │      SOCKET.IO         │
        └──────────┬─────────────┘
                   │
                   ▼
        ┌────────────────────────┐
        │    REACT DASHBOARD     │
        └────────────────────────┘
```

---

# 4. Tech stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Tailwind CSS | Dashboard UI |
| Backend | Node.js + Express | API server |
| Real-time | Socket.io | Live attack streaming |
| Database | MongoDB | Event storage |
| SSH Sensor | ssh2 | Fake SSH server |
| HTTP Sensor | Express | Fake vulnerable HTTP endpoints |
| Maps | Leaflet.js | World attack map |
| Charts | Recharts | Threat analytics |
| GeoIP | MaxMind GeoLite2 | IP geolocation |
| Containerization | Docker | Isolation |

---

# 5. File structure

```text
honeynet/
│
├── sensors/
│   ├── ssh_honeypot.js
│   ├── http_honeypot.js
│   ├── config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── models/
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── docker-compose.yml
├── GeoLite2-City.mmdb
└── README.md
```

---

# 6. Database schemas

## Attack Schema

Stores every attack event.

```javascript
const AttackSchema = new mongoose.Schema({
  ip: String,
  sensor: String,
  username: String,
  password: String,
  command: String,
  path: String,
  userAgent: String,
  country: String,
  city: String,
  lat: Number,
  lng: Number,
  threatScore: Number,
  fingerprint: String,
  sessionId: String,
  timestamp: Date
});
```

---

## Credential Schema

Aggregates credentials used by attackers.

```javascript
const CredentialSchema = new mongoose.Schema({
  username: String,
  password: String,
  count: Number,
  sourceIPs: [String],
  firstSeen: Date,
  lastSeen: Date
});
```

---

## Session Schema

Tracks complete attacker sessions.

```javascript
const SessionSchema = new mongoose.Schema({
  sessionId: String,
  ip: String,
  commands: [],
  credentialsTried: [],
  threatScore: Number,
  fingerprint: String
});
```

---

# 7. The sensors — Node.js honeypots

HoneyNet uses pure Node.js honeypot sensors.

No Python required.

---

## SSH Honeypot

Built using:

```text
ssh2 npm package
```

Features:

- Fake SSH login server
- Captures credentials
- Captures commands
- Fake Linux shell
- Session tracking

---

## HTTP Honeypot

Built using:

```text
Express.js
```

Features:

- Fake admin panels
- Fake APIs
- Fake sensitive files
- Credential capture
- Probe logging

---

## Fake vulnerable routes

```text
/admin
/login
/wp-login.php
/phpmyadmin
/.env
/config.php
/api/v1/users
/graphql
```

---

# 8. The backend — Node.js + Express

The backend acts as the intelligence pipeline.

Responsibilities:

- Receive attack events
- Perform GeoIP lookups
- Calculate threat scores
- Fingerprint attackers
- Save events into MongoDB
- Broadcast live events

---

## Core API Endpoint

```http
POST /api/ingest
```

All sensors submit attack events here.

---

## Backend pipeline

```text
Sensor Event
      │
      ▼
API Ingest Route
      │
      ├── GeoIP Lookup
      ├── Threat Scoring
      ├── Fingerprinting
      ├── Session Tracking
      ├── MongoDB Storage
      └── Socket.io Broadcast
```

---

# 9. The frontend — React dashboard

The dashboard visualizes live attack intelligence.

---

## Dashboard Features

### Live Attack Feed

Displays:

- Attacker IP
- Country
- Sensor type
- Credentials
- Threat score

---

### World Attack Map

Shows:

- Attack origin countries
- Live attack markers
- Threat color coding

---

### Threat Leaderboard

Ranks attackers based on:

- Number of attempts
- Credentials used
- Attack patterns

---

### Credential Intelligence

Shows:

- Most used usernames
- Most used passwords
- Credential stuffing patterns

---

### Session Replay

Replays attacker shell sessions command-by-command.

---

# 10. Key algorithms

## Threat scoring

Threat score ranges:

```text
0 → 100
```

Factors:

| Condition | Points |
|-----------|--------|
| Many attempts | +40 |
| Credential stuffing | +20 |
| Port scanning | +15 |
| Weak passwords | +25 |
| Multi-sensor activity | +10 |

---

## Attacker fingerprinting

Classifications:

| Fingerprint | Meaning |
|-------------|---------|
| scanner | Automated scanning |
| bruteforce | Password attacks |
| human | Interactive operator |
| bot | Generic automation |

---

# 11. Real-time event pipeline

```text
Sensor detects attack
        │
        ▼
POST /api/ingest
        │
        ▼
MongoDB write
        │
        ▼
Socket.io broadcast
        │
        ▼
Dashboard updates instantly
```

No polling required.

---

# 12. Session replay system

The SSH honeypot records commands typed by attackers.

Example:

```text
whoami
ls
pwd
cat /etc/passwd
wget malware.sh
```

These commands are replayed inside a fake terminal UI.

This simulates commercial threat intelligence systems.

---

# 13. Credential intelligence system

Every credential attempt is aggregated.

Examples:

```text
root/root
admin/admin
admin/password
root/toor
```

The platform builds a credential intelligence database over time.

---

# 14. Building order

```text
Step 1  Build SSH sensor
Step 2  Build HTTP sensor
Step 3  Setup backend API
Step 4  MongoDB integration
Step 5  GeoIP lookups
Step 6  Threat scoring
Step 7  Fingerprinting
Step 8  React dashboard
Step 9  Socket.io integration
Step 10 Attack map
Step 11 Session replay
Step 12 Dashboard polish
```

---

# 15. How to run

## Prerequisites

- Node.js 18+
- MongoDB
- GeoLite2-City.mmdb

---

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/honeynet.git

cd honeynet
```

---

## Install Dependencies

### Backend

```bash
cd backend

npm install
```

---

### Frontend

```bash
cd frontend

npm install
```

---

### Sensors

```bash
cd sensors

npm install
```

---

## Environment Variables

Create:

```text
backend/.env
```

```env
PORT=5000

MONGODB_URI=mongodb://localhost:27017/honeynet

SENSOR_API_KEY=your-secret-key
```

---

## Start Backend

```bash
cd backend

npm run dev
```

---

## Start Frontend

```bash
cd frontend

npm run dev
```

---

## Start SSH Sensor

```bash
cd sensors

npm run ssh
```

---

## Start HTTP Sensor

```bash
cd sensors

npm run http
```

---

# 16. API reference

| Method | Route | Description |
|--------|------|-------------|
| POST | `/api/ingest` | Receive attack events |
| GET | `/api/attacks` | Get attack feed |
| GET | `/api/stats` | Get analytics |
| GET | `/api/credentials` | Credential intelligence |
| GET | `/api/attackers/:ip` | Attacker dossier |

---

# 17. Key features that make this project stand out

## Real-time cyber attack visualization

The dashboard updates live as attacks happen.

---

## Session replay

Replay attacker shell sessions like a movie.

---

## Threat intelligence

Collect real attacker credentials and attack patterns.

---

## Attacker fingerprinting

Classify attackers based on behavior.

---

## World attack map

Visualize attack origins globally.

---

# 18. What's simulated vs real

| Current Project | Production Equivalent |
|----------------|----------------------|
| Local MongoDB | Distributed databases |
| Local Socket.io | Redis pub/sub |
| Manual sensors | Auto-scaled sensors |
| Basic alerting | SIEM integrations |
| Simple deployment | Kubernetes clusters |

---
