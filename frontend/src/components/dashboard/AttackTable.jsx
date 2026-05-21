import { useNavigate } from "react-router-dom";

import {
  ShieldAlert,
  Radar,
  Bot,
  User,
  Skull,
} from "lucide-react";

const getThreatStyles = (score) => {

  if (score >= 70) {
    return {
      text: "CRITICAL",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    };
  }

  if (score >= 40) {
    return {
      text: "HIGH",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    };
  }

  return {
    text: "LOW",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  };
};

const getFingerprintStyles = (type) => {

  switch (type) {

    case "human":
      return {
        icon: User,
        className: "bg-red-500/10 text-red-400 border-red-500/20",
      };

    case "scanner":
      return {
        icon: Radar,
        className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      };

    case "bruteforce":
      return {
        icon: ShieldAlert,
        className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      };

    default:
      return {
        icon: Bot,
        className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      };
  }
};

export default function AttackTable({ attacks = [] }) {

  const navigate = useNavigate();

  // Keep table lightweight
  const latestAttacks = attacks.slice(0, 20);

  return (
    <div className="
      rounded-2xl
      border border-slate-800
      bg-[#0B1220]
      overflow-hidden
    ">

      {/* Header */}
      <div className="
        flex items-center justify-between
        px-5 py-4
        border-b border-slate-800
        bg-slate-900/40
      ">

        <div>

          <h2 className="
            text-lg font-bold text-white
          ">
            Live Attack Intelligence
          </h2>

          <p className="
            text-xs text-slate-500 mt-1
          ">
            Real-time malicious activity detected by HoneyNet
          </p>

        </div>

        {/* Status */}
        <div className="
          flex items-center gap-2
          px-3 py-1.5 rounded-xl
          bg-red-500/10
          border border-red-500/20
        ">

          <span className="
            w-2 h-2 rounded-full
            bg-red-400
          " />

          <span className="
            text-[11px]
            font-bold tracking-wider
            text-red-400
          ">
            LIVE
          </span>

        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          {/* Head */}
          <thead className="
            bg-slate-900/60
            border-b border-slate-800
          ">

            <tr>

              <th className="
                px-5 py-3 text-left
                text-[11px] font-bold
                tracking-widest text-slate-500
              ">
                ATTACKER
              </th>

              <th className="
                px-5 py-3 text-left
                text-[11px] font-bold
                tracking-widest text-slate-500
              ">
                SENSOR
              </th>

              <th className="
                px-5 py-3 text-left
                text-[11px] font-bold
                tracking-widest text-slate-500
              ">
                COUNTRY
              </th>

              <th className="
                px-5 py-3 text-left
                text-[11px] font-bold
                tracking-widest text-slate-500
              ">
                THREAT
              </th>

              <th className="
                px-5 py-3 text-left
                text-[11px] font-bold
                tracking-widest text-slate-500
              ">
                FINGERPRINT
              </th>

              <th className="
                px-5 py-3 text-left
                text-[11px] font-bold
                tracking-widest text-slate-500
              ">
                DETECTED
              </th>

            </tr>

          </thead>

          {/* Body */}
          <tbody>

            {latestAttacks.map((attack, index) => {

              const threat = getThreatStyles(attack.threatScore);

              const fp = getFingerprintStyles(
                attack.fingerprint
              );

              const FingerprintIcon = fp.icon;

              return (
                <tr
                  key={index}
                  className="
                    border-b border-slate-800/60
                    hover:bg-slate-900/30
                    transition-colors
                  "
                >

                  {/* IP */}
                  <td className="px-5 py-4">

                    <button
                      onClick={() =>
                        navigate(`/attackers/${attack.ip}`)
                      }
                      className="
                        flex items-center gap-3
                      "
                    >

                      <div className="
                        w-9 h-9 rounded-xl
                        bg-cyan-500/10
                        border border-cyan-500/20
                        flex items-center justify-center
                      ">

                        <Skull className="
                          w-4 h-4 text-cyan-400
                        " />

                      </div>

                      <div className="text-left">

                        <p className="
                          text-sm font-medium
                          text-cyan-400 font-mono
                        ">
                          {attack.ip}
                        </p>

                        <p className="
                          text-[11px] text-slate-500
                        ">
                          Inspect attacker
                        </p>

                      </div>

                    </button>

                  </td>

                  {/* Sensor */}
                  <td className="px-5 py-4">

                    <span className={`
                      inline-flex items-center
                      px-2.5 py-1 rounded-md
                      text-[10px] font-bold
                      border

                      ${
                        attack.sensor === "ssh"
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                          : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      }
                    `}>

                      {attack.sensor?.toUpperCase()}

                    </span>

                  </td>

                  {/* Country */}
                  <td className="
                    px-5 py-4
                    text-sm text-slate-300
                  ">

                    {attack.country || "Unknown"}

                  </td>

                  {/* Threat */}
                  <td className="px-5 py-4">

                    <div className="
                      flex items-center gap-2
                    ">

                      <span className={`
                        text-sm font-bold
                        ${threat.color}
                      `}>
                        {attack.threatScore}
                      </span>

                      <span className={`
                        px-2 py-1 rounded-md
                        text-[10px] font-bold
                        border
                        ${threat.bg}
                        ${threat.border}
                        ${threat.color}
                      `}>

                        {threat.text}

                      </span>

                    </div>

                  </td>

                  {/* Fingerprint */}
                  <td className="px-5 py-4">

                    <div className={`
                      inline-flex items-center gap-2
                      px-2.5 py-1 rounded-md
                      border text-[11px] font-medium
                      ${fp.className}
                    `}>

                      <FingerprintIcon size={12} />

                      <span className="uppercase">
                        {attack.fingerprint || "bot"}
                      </span>

                    </div>

                  </td>

                  {/* Time */}
                  <td className="px-5 py-4">

                    <div>

                      <p className="
                        text-sm text-slate-300
                      ">
                        {new Date(
                          attack.timestamp
                        ).toLocaleTimeString()}
                      </p>

                      <p className="
                        text-[11px] text-slate-500
                      ">
                        {new Date(
                          attack.timestamp
                        ).toLocaleDateString()}
                      </p>

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}