# 🍯 HoneyNet — Real-Time Honeypot Intelligence Platform

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0%2B-green)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.2%2B-blue)](https://reactjs.org/)

> **A full-stack honeypot platform built entirely on the MERN stack + Node.js sensors (no Python required)** that attracts real internet attackers, fingerprints their behavior, scores their threat level, and streams everything live to a React dashboard.

![HoneyNet Dashboard Preview](https://via.placeholder.com/1200x600/0a0f1a/22d3ee?text=HoneyNet+Live+Dashboard)

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗 Architecture Overview](#-architecture-overview)
- [🚀 Quick Start](#-quick-start)
- [📦 Tech Stack](#-tech-stack)
- [🔧 Installation](#-installation)
- [🎯 How It Works](#-how-it-works)
- [📊 Dashboard Features](#-dashboard-features)
- [🔌 API Reference](#-api-reference)
- [🧪 Testing Your Deployment](#-testing-your-deployment)
- [📈 Real-World Results](#-real-world-results)
- [🛠 Production Considerations](#-production-considerations)
- [🤔 FAQ](#-faq)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 Core Capabilities

| Feature | Description |
|---------|-------------|
| **Pure Node.js Sensors** | SSH honeypot using `ssh2` npm package — no Python runtime needed |
| **Real-Time Attack Feed** | Live updates via Socket.io as attackers probe your systems |
| **Threat Scoring (0-100)** | Automated scoring based on behavior patterns and attempt volume |
| **Attacker Fingerprinting** | Classify as scanner, bruteforce, bot, or human operator |
| **GeoIP Mapping** | Plot attack origins on an interactive world map |
| **Credential Intelligence** | Aggregated table of usernames/passwords attackers are using |
| **Session Replay** | Watch attacker keystrokes in real-time with timing preserved |
| **Per-Attacker Dossier** | Full history per IP — commands, credentials, sessions, timeline |

### 🚨 What You Can Detect

- SSH brute force attempts (`root/root`, `admin/123456`, etc.)
- Path traversal probes (`/.env`, `/wp-login.php`, `/admin`)
- API enumeration (`/api/v1/users`, `/graphql`, `/actuator/env`)
- Command injection attempts in fake shells
- Automated scanners vs human operators

---

## 🏗 Architecture Overview


┌─────────────────────────────────────────────────────────────────┐
│ INTERNET ATTACKERS │
│ Automated scanners, credential stuffers, human operators │
└────────────┬────────────────────────────┬───────────────────────┘
│ SSH (port 2222) │ HTTP (port 8080)
▼ ▼
┌────────────────────────┐ ┌────────────────────────┐
│ SSH HONEYPOT SENSOR │ │ HTTP HONEYPOT SENSOR │
│ (Node.js + ssh2) │ │ (Node.js + Express) │
│ │ │ │
│ • Fake login prompt │ │ • Fake admin panels │
│ • Fake shell with │ │ • Fake API endpoints │
│ command logging │ │ • Exposed file traps │
└────────────┬───────────┘ └────────────┬───────────┘
│ │
└───────────┬───────────────────┘
│ POST /api/ingest (with API key)
▼
┌─────────────────────────────────────────────────────────────────┐
│ NODE.JS + EXPRESS BACKEND │
│ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ GeoIP │→│ Threat │→│ Fingerprint │ │
│ │ Lookup │ │ Score (0-100)│ │ Classifier │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
│ │ │ │ │
│ └──────────────────┼──────────────────┘ │
│ ▼ │
│ ┌──────────────┐ │
│ │ MongoDB │ │
│ │ • Attacks │ │
│ │ • Sessions │ │
│ │ • Creds │ │
│ └──────────────┘ │
│ │ │
│ ▼ (Socket.io broadcast) │
└────────────────────────────┬────────────────────────────────────┘
│ WebSocket (real-time)
▼
┌─────────────────────────────────────────────────────────────────┐
│ REACT DASHBOARD │
│ │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐ │
│ │Live Attack │ │ World │ │Threat │ │ Credential │ │
│ │Feed │ │ Map │ │Leaderboard │ │ Intelligence│ │
│ └────────────┘ └────────────┘ └────────────┘ └─────────────┘ │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐ │
│ │Attack │ │ Session │ │Per-IP │ │ Protocol │ │
│ │Timeline │ │ Replay │ │Dossier │ │ Breakdown │ │
│ └────────────┘ └────────────┘ └────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘

text
