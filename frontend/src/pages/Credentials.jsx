import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  KeyRound,
  ShieldAlert,
  Globe,
  Activity,
  Search,
  Database,
} from "lucide-react";

export default function Credentials() {
  const [credentials, setCredentials] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchCredentials() {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/credentials"
        );

        setCredentials(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCredentials();
  }, []);

  const filteredCredentials = useMemo(() => {
    return credentials.filter((cred) => {
      const value = `${cred.username} ${cred.password}`.toLowerCase();

      return value.includes(search.toLowerCase());
    });
  }, [credentials, search]);

  const totalAttempts = credentials.reduce(
    (acc, curr) => acc + curr.count,
    0
  );

  const totalIPs = new Set(
    credentials.flatMap((c) => c.sourceIPs || [])
  ).size;

  return (
    <div className="min-h-screen bg-[#030712] p-6 text-white space-y-6">

      {/* HEADER */}

      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#081120] to-[#030712] p-8 shadow-2xl">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_30%)]"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="flex items-center gap-4 mb-4">

              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <KeyRound className="text-cyan-400" size={28} />
              </div>

              <div>

                <p className="text-slate-500 uppercase tracking-[0.2em] text-sm">
                  Threat Intelligence
                </p>

                <h1 className="text-4xl font-black">
                  Credential Intelligence
                </h1>

              </div>
            </div>

            <p className="text-slate-400 text-lg max-w-2xl">
              Aggregated attacker credential combinations captured
              from live SSH and HTTP honeypot activity.
            </p>

          </div>

          {/* SEARCH */}

          <div className="w-full lg:w-[320px]">

            <div className="relative">

              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                type="text"
                placeholder="Search username or password..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-500/40 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-[#080f1a] border border-slate-800 rounded-2xl p-5">

          <div className="flex items-center gap-3 mb-4">
            <Database className="text-cyan-400" size={22} />
            <h3 className="text-slate-400">
              Credential Pairs
            </h3>
          </div>

          <p className="text-4xl font-black">
            {credentials.length}
          </p>
        </div>

        <div className="bg-[#080f1a] border border-slate-800 rounded-2xl p-5">

          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-cyan-400" size={22} />
            <h3 className="text-slate-400">
              Total Attempts
            </h3>
          </div>

          <p className="text-4xl font-black">
            {totalAttempts}
          </p>
        </div>

        <div className="bg-[#080f1a] border border-slate-800 rounded-2xl p-5">

          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-cyan-400" size={22} />
            <h3 className="text-slate-400">
              Unique Attackers
            </h3>
          </div>

          <p className="text-4xl font-black">
            {totalIPs}
          </p>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-[#080f1a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/40">

          <div className="flex items-center gap-3">

            <ShieldAlert className="text-cyan-400" />

            <div>
              <h2 className="text-xl font-bold">
                Captured Credentials
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Ranked by frequency across honeypot sensors
              </p>
            </div>
          </div>

          <div className="text-slate-500 text-sm">
            {filteredCredentials.length} Results
          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-slate-900/70 border-b border-slate-800">

              <tr className="text-left text-slate-400 text-xs uppercase tracking-[0.18em]">

                <th className="px-6 py-5">Username</th>
                <th className="px-6 py-5">Password</th>
                <th className="px-6 py-5">Attempts</th>
                <th className="px-6 py-5">Unique IPs</th>
                <th className="px-6 py-5">First Seen</th>
                <th className="px-6 py-5">Last Seen</th>

              </tr>
            </thead>

            <tbody>

              {filteredCredentials.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-20 text-slate-500"
                  >
                    No credentials found
                  </td>
                </tr>

              ) : (

                filteredCredentials.map((cred, index) => (

                  <tr
                    key={index}
                    className="border-b border-slate-800 hover:bg-cyan-500/[0.03] transition-all duration-300"
                  >

                    {/* USERNAME */}

                    <td className="px-6 py-5">

                      <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl px-4 py-2 font-mono">

                        <span>
                          {cred.username || "unknown"}
                        </span>
                      </div>
                    </td>

                    {/* PASSWORD */}

                    <td className="px-6 py-5">

                      <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-2 font-mono">

                        <span>
                          {cred.password || "empty"}
                        </span>
                      </div>
                    </td>

                    {/* COUNT */}

                    <td className="px-6 py-5">

                      <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2">

                        <span className="text-white font-black text-lg">
                          {cred.count}
                        </span>
                      </div>
                    </td>

                    {/* UNIQUE IPS */}

                    <td className="px-6 py-5 text-slate-300 font-semibold">
                      {cred.sourceIPs?.length || 0}
                    </td>

                    {/* FIRST SEEN */}

                    <td className="px-6 py-5 text-slate-400 text-sm whitespace-nowrap">
                      {new Date(
                        cred.firstSeen
                      ).toLocaleString()}
                    </td>

                    {/* LAST SEEN */}

                    <td className="px-6 py-5 text-slate-400 text-sm whitespace-nowrap">
                      {new Date(
                        cred.lastSeen
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))

              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}