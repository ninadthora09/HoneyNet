import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Attackers() {
  const [attackers, setAttackers] = useState([]);

  useEffect(() => {
    async function fetchAttackers() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/attackers`,
        );

        setAttackers(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchAttackers();
  }, []);

  //   const scoreColor = (score) => {
  //     if (score >= 70) return "text-red-400";
  //     if (score >= 40) return "text-yellow-400";
  //     return "text-cyan-400";
  //   };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Attackers</h1>

          <p className="text-slate-500 mt-1">Threat intelligence overview</p>
        </div>
      </div>

      <div className="bg-[#080f1a] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/70 border-b border-slate-800">
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4">IP Address</th>
              <th className="p-4">Country</th>
              <th className="p-4">Fingerprint</th>
              <th className="p-4">Threat</th>
              <th className="p-4">Attacks</th>
              <th className="p-4">Last Seen</th>
            </tr>
          </thead>

          <tbody>
            {attackers.map((attacker, index) => (
              <tr
                key={index}
                className="border-b border-slate-800 hover:bg-slate-900/40 transition"
              >
                <td className="p-4">
                  <Link
                    to={`/attackers/${attacker._id}`}
                    className="text-cyan-400 font-mono hover:underline"
                  >
                    {attacker._id}
                  </Link>
                </td>

                <td className="p-4 text-slate-300">
                  {attacker.country || "Unknown"}
                </td>

                <td className="p-4">
                  <span className="px-2 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700">
                    {attacker.fingerprint}
                  </span>
                </td>

                <td
                  className={`p-4 font-black ${
                    attacker.maxThreat >= 70
                      ? "text-red-400"
                      : attacker.maxThreat >= 40
                        ? "text-yellow-400"
                        : "text-cyan-400"
                  }`}
                >
                  {attacker.maxThreat}
                </td>

                <td className="p-4 text-white">{attacker.attacks}</td>

                <td className="p-4 text-slate-400 text-sm">
                  {new Date(attacker.latestAttack).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
