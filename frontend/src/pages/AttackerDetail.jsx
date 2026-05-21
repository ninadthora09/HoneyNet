import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  ShieldAlert,
  Globe,
  Terminal,
  KeyRound,
  Activity,
  Radar,
} from "lucide-react";

export default function AttackerDetail() {
  const { ip } = useParams();

  const [dossier, setDossier] = useState(null);

  useEffect(() => {
    async function fetchDossier() {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attackers/${ip}`
        );

        setDossier(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDossier();
  }, [ip]);

  if (!dossier) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-5"></div>

          <h2 className="text-white text-xl font-semibold">
            Loading Attacker Dossier
          </h2>

          <p className="text-slate-500 mt-2">
            Fetching intelligence records...
          </p>
        </div>
      </div>
    );
  }

  const threatColor =
    dossier.stats.maxThreat >= 70
      ? "text-red-400"
      : dossier.stats.maxThreat >= 40
      ? "text-yellow-400"
      : "text-cyan-400";

  return (
    <div className="min-h-screen bg-[#030712] p-6 space-y-6 text-white">

      {/* HEADER */}

      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#081120] to-[#030712] p-8 shadow-2xl">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_30%)]"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <div className="flex items-center gap-3 mb-4">

              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <ShieldAlert className="text-cyan-400" size={28} />
              </div>

              <div>
                <p className="text-slate-500 text-sm uppercase tracking-[0.2em]">
                  Threat Intelligence
                </p>

                <h1 className="text-4xl font-black">
                  Attacker Dossier
                </h1>
              </div>
            </div>

            <p className="font-mono text-cyan-400 text-2xl mb-2">
              {dossier.ip}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">

              <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-sm">
                🌍 {dossier.country || "Unknown"}
              </div>

              <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-sm uppercase">
                🧠 {dossier.fingerprint}
              </div>

            </div>
          </div>

          {/* THREAT SCORE */}

          <div className="w-full lg:w-[260px] rounded-2xl border border-slate-800 bg-black/30 backdrop-blur-xl p-6">

            <p className="text-slate-500 text-sm uppercase tracking-widest mb-2">
              Maximum Threat
            </p>

            <h2 className={`text-6xl font-black ${threatColor}`}>
              {dossier.stats.maxThreat}
            </h2>

            <div className="mt-4 h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${
                  dossier.stats.maxThreat >= 70
                    ? "bg-red-500"
                    : dossier.stats.maxThreat >= 40
                    ? "bg-yellow-400"
                    : "bg-cyan-400"
                }`}
                style={{
                  width: `${dossier.stats.maxThreat}%`,
                }}
              ></div>
            </div>

            <p className="text-slate-500 text-sm mt-4">
              Based on attack frequency, credentials,
              behavior patterns, and sensor activity.
            </p>
          </div>
        </div>
      </div>

      {/* STATS GRID */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-[#080f1a] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-cyan-400" size={22} />
            <h3 className="text-slate-400 font-medium">
              Total Attacks
            </h3>
          </div>

          <p className="text-4xl font-black text-white">
            {dossier.stats.totalAttacks}
          </p>
        </div>

        <div className="bg-[#080f1a] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-cyan-400" size={22} />
            <h3 className="text-slate-400 font-medium">
              Origin Country
            </h3>
          </div>

          <p className="text-2xl font-bold text-white">
            {dossier.country || "Unknown"}
          </p>
        </div>

        <div className="bg-[#080f1a] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Radar className="text-cyan-400" size={22} />
            <h3 className="text-slate-400 font-medium">
              Fingerprint
            </h3>
          </div>

          <p className="text-2xl font-bold uppercase text-cyan-400">
            {dossier.fingerprint}
          </p>
        </div>
      </div>

      {/* CREDENTIALS */}

      <div className="bg-[#080f1a] border border-slate-800 rounded-3xl p-6">

        <div className="flex items-center gap-3 mb-6">
          <KeyRound className="text-cyan-400" />
          <h2 className="text-2xl font-bold">
            Credentials Tried
          </h2>
        </div>

        {dossier.credentials.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No credentials captured
          </div>
        ) : (
          <div className="space-y-3">

            {dossier.credentials.map((cred, index) => (
              <div
                key={index}
                className="group bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">

                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Username
                    </p>

                    <p className="text-cyan-400 font-mono text-lg">
                      {cred.username || "unknown"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Password
                    </p>

                    <p className="text-red-400 font-mono text-lg">
                      {cred.password || "empty"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMMANDS */}

      <div className="bg-[#080f1a] border border-slate-800 rounded-3xl p-6">

        <div className="flex items-center gap-3 mb-6">
          <Terminal className="text-cyan-400" />
          <h2 className="text-2xl font-bold">
            Commands Executed
          </h2>
        </div>

        {dossier.commands.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No commands executed
          </div>
        ) : (
          <div className="space-y-4">

            {dossier.commands.map((cmd, index) => (
              <div
                key={index}
                className="bg-black border border-slate-800 rounded-2xl overflow-hidden"
              >

                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/60">

                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>

                  <span className="ml-3 text-xs text-slate-500">
                    root@honeynet-terminal
                  </span>
                </div>

                <div className="p-5 font-mono">

                  <p className="text-cyan-400">
                    $ {cmd.command}
                  </p>

                  <p className="text-slate-500 text-sm mt-3">
                    {new Date(cmd.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TIMELINE */}

      <div className="bg-[#080f1a] border border-slate-800 rounded-3xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Attack Timeline
        </h2>

        <div className="relative border-l border-slate-800 ml-3 space-y-8">

          {dossier.timeline.map((attack) => (
            <div key={attack._id} className="relative pl-8">

              <div
                className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                  attack.threatScore >= 70
                    ? "bg-red-500 border-red-400"
                    : attack.threatScore >= 40
                    ? "bg-yellow-400 border-yellow-300"
                    : "bg-cyan-400 border-cyan-300"
                }`}
              ></div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">

                <div className="flex justify-between items-center flex-wrap gap-3">

                  <div className="flex items-center gap-3">

                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest ${
                        attack.sensor === "ssh"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}
                    >
                      {attack.sensor}
                    </span>

                    <span className="text-slate-500 text-sm">
                      Threat Score
                    </span>

                    <span className={threatColor}>
                      {attack.threatScore}
                    </span>
                  </div>

                  <p className="text-slate-500 text-sm">
                    {new Date(
                      attack.timestamp
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}