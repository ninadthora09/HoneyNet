import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import StatsStrip from "../components/dashboard/StatsStrip";
import LiveFeed from "../components/dashboard/LiveFeed";
import AttackMap from "../components/dashboard/AttackMap";
import AttackTable from "../components/dashboard/AttackTable";

export default function Dashboard() {
  const [attacks, setAttacks] = useState([]);

  useEffect(() => {
    async function fetchAttacks() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/attacks`,
        );

        setAttacks(Array.isArray(res.data) ? res.data : res.data.attacks || []);
      } catch (err) {
        console.error("Failed to fetch attacks", err);
      }
    }

    fetchAttacks();
  }, []);
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    socket.on("new_attack", (attack) => {
      setAttacks((prev) => [attack, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Glow */}
        <div
          className="
        absolute top-0 left-1/3
        w-[500px] h-[500px]
        bg-cyan-500/5
        blur-[120px]
        rounded-full
      "
        />

        <div
          className="
        absolute bottom-0 right-0
        w-[400px] h-[400px]
        bg-purple-500/5
        blur-[120px]
        rounded-full
      "
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 space-y-6">
        {/* Stats */}
        <StatsStrip />

        {/* Main Grid */}
        <div
          className="
        grid grid-cols-1
        2xl:grid-cols-12
        gap-6
      "
        >
          {/* Left Side */}
          <div className="2xl:col-span-8 space-y-6">
            {/* Map */}
            <div
              className="
            h-[420px]
            rounded-3xl
            overflow-hidden
            border border-slate-800
            bg-[#0B1220]/70
            backdrop-blur-xl
            shadow-[0_10px_40px_rgba(0,0,0,0.35)]
          "
            >
              <AttackMap />
            </div>

            {/* Attack Table */}
            <div
              className="
            rounded-3xl
            border border-slate-800
            bg-[#0B1220]/70
            backdrop-blur-xl
            p-4
            shadow-[0_10px_40px_rgba(0,0,0,0.35)]
          "
            >
              <AttackTable attacks={attacks} />
            </div>
          </div>

          {/* Right Side */}
          <div className="2xl:col-span-4">
            <div
              className="
            h-full
            rounded-3xl
            border border-slate-800
            bg-[#0B1220]/70
            backdrop-blur-xl
            p-4
            shadow-[0_10px_40px_rgba(0,0,0,0.35)]
          "
            >
              <LiveFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
