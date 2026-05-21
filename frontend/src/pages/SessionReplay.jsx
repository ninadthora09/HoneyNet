import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SessionReplay() {
  const { sessionId } = useParams();

  const [session, setSession] = useState(null);

  const [visibleTimeline, setVisibleTimeline] = useState([]);

  const terminalRef = useRef(null);

  async function fetchReplay() {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/sessions/${sessionId}`,
      );

      setSession(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function loadData() {
      await fetchReplay();
    }

    loadData();
  }, []);
  useEffect(() => {
    if (!session) return;

    let index = 0;

    const interval = setInterval(() => {
      setVisibleTimeline((prev) => {
        if (index >= session.timeline.length) {
          clearInterval(interval);
          return prev;
        }

        const updated = [...prev, session.timeline[index]];

        index++;

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleTimeline]);

  if (!session) {
    return <div className="text-white p-6">Loading replay...</div>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">Session Replay</h1>

      <p className="text-slate-400 mb-6">IP: {session.ip}</p>

      <div
        ref={terminalRef}
        className="bg-black border border-green-500 rounded-xl p-4 font-mono h-[500px] overflow-y-auto"
      >
        {visibleTimeline.map((event, index) => (
          <div key={index} className="mb-4">
            {event.username && (
              <p className="text-yellow-400">
                Login Attempt: {event.username}/{event.password}
              </p>
            )}

            {event.command && (
              <p className="text-green-400">
                root@prod-server-01:~# {event.command}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
