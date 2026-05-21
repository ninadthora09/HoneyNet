import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

import Dashboard from "./pages/Dashboard";

import Attackers from "./pages/Attackers";
import AttackerDetail from "./pages/AttackerDetail";

import Credentials from "./pages/Credentials";

import Sessions from "./pages/Sessions";
import SessionReplay from "./pages/SessionReplay";

export default function App() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Navbar */}
        <Navbar />

        {/* Pages */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          <Routes>

            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Attackers */}
            <Route path="/attackers" element={<Attackers />} />
            <Route path="/attackers/:ip" element={<AttackerDetail />} />

            {/* Credentials */}
            <Route path="/credentials" element={<Credentials />} />

            {/* Sessions */}
            <Route path="/sessions" element={<Sessions />} />
            <Route
              path="/sessions/:sessionId"
              element={<SessionReplay />}
            />

          </Routes>

        </main>
      </div>
    </div>
  );
}