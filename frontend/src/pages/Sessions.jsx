import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  async function fetchSessions() {
    try {
      const res = await axios.get("http://localhost:5000/api/sessions");

      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function loadData() {
      await fetchSessions();
    }

    loadData();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Session Replay</h1>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session._id}
            onClick={() => navigate(`/sessions/${session._id}`)}
            className="bg-[#111827] border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-cyan-500 transition-all"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-mono text-lg">{session.ip}</p>

                <p className="text-sm text-slate-400">
                  Session ID: {session._id}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm">Events: {session.totalEvents}</p>

                <p className="text-sm">Commands: {session.commands}</p>

                <p className="text-sm text-cyan-400">{session.fingerprint}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
