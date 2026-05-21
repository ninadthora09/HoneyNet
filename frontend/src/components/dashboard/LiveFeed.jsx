import useSocket from "../../hooks/useSocket";

import {
  ShieldAlert,
  Terminal,
  Radar,
  Globe,
  Activity,
} from "lucide-react";

const getThreatStyles = (score) => {

  if (score >= 70) {
    return {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      label: "CRITICAL",
    };
  }

  if (score >= 40) {
    return {
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      label: "HIGH",
    };
  }

  return {
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    label: "LOW",
  };
};

export default function LiveFeed() {

  // Only latest 10 attacks
  const attacks = useSocket("new_attack", 10);

  return (
    <div className="
      h-full flex flex-col
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
            Live Attack Feed
          </h2>

          <p className="
            text-xs text-slate-500 mt-1
          ">
            Streaming real-time malicious activity
          </p>

        </div>

        {/* Status */}
        <div className="
          flex items-center gap-2
          px-3 py-1.5 rounded-xl
          bg-green-500/10
          border border-green-500/20
        ">

          <span className="
            w-2 h-2 rounded-full
            bg-green-400
          " />

          <span className="
            text-[11px]
            font-bold tracking-wider
            text-green-400
          ">
            LIVE
          </span>

        </div>

      </div>

      {/* Feed */}
      <div className="
        flex-1 overflow-y-auto
        px-4 py-4
        space-y-3
        scrollbar-thin
        scrollbar-thumb-slate-700
        scrollbar-track-transparent
      ">

        {attacks.map((attack, i) => {

          const threat = getThreatStyles(attack.threatScore);

          return (
            <div
              key={i}
              className="
                border border-slate-800
                bg-slate-900/40
                rounded-xl
                p-4
                hover:border-slate-700
                transition-colors
              "
            >

              <div className="
                flex items-start justify-between
                gap-4
              ">

                {/* Left */}
                <div className="flex items-start gap-3">

                  {/* Sensor Icon */}
                  <div className={`
                    w-10 h-10 rounded-xl
                    border flex items-center justify-center

                    ${
                      attack.sensor === "ssh"
                        ? "bg-cyan-500/10 border-cyan-500/20"
                        : "bg-purple-500/10 border-purple-500/20"
                    }
                  `}>

                    {attack.sensor === "ssh" ? (
                      <Terminal className="
                        w-4 h-4 text-cyan-400
                      " />
                    ) : (
                      <Radar className="
                        w-4 h-4 text-purple-400
                      " />
                    )}

                  </div>

                  {/* Main Info */}
                  <div>

                    {/* IP + Threat */}
                    <div className="
                      flex items-center gap-2
                      flex-wrap
                    ">

                      <p className="
                        text-sm font-semibold
                        text-white font-mono
                      ">
                        {attack.ip}
                      </p>

                      <span className={`
                        px-2 py-1 rounded-md
                        text-[10px] font-bold
                        border
                        ${threat.bg}
                        ${threat.border}
                        ${threat.color}
                      `}>
                        {threat.label}
                      </span>

                    </div>

                    {/* Country */}
                    <div className="
                      mt-1 flex items-center gap-2
                      text-xs text-slate-500
                    ">

                      <Globe className="w-3 h-3" />

                      {attack.country || "Unknown"}

                    </div>

                    {/* Credentials */}
                    {attack.username && (
                      <div className="
                        mt-3 text-xs
                        font-mono text-slate-300
                      ">

                        <span className="text-slate-500">
                          credentials:
                        </span>

                        <span className="ml-2 text-red-400">
                          {attack.username}
                        </span>

                        <span className="mx-1 text-slate-600">
                          /
                        </span>

                        <span className="text-yellow-400">
                          {attack.password}
                        </span>

                      </div>
                    )}

                    {/* Command */}
                    {attack.command && (
                      <div className="
                        mt-2 text-xs
                        font-mono text-green-400
                        truncate
                      ">
                        $ {attack.command}
                      </div>
                    )}

                  </div>

                </div>

                {/* Threat Score */}
                <div className="text-right shrink-0">

                  <p className={`
                    text-2xl font-black
                    ${threat.color}
                  `}>
                    {attack.threatScore}
                  </p>

                  <div className="
                    flex items-center justify-end gap-1
                    text-[10px] text-slate-500
                    mt-1
                  ">

                    <Activity className="w-3 h-3" />

                    LIVE

                  </div>

                </div>

              </div>

            </div>
          );
        })}

        {/* Empty */}
        {attacks.length === 0 && (
          <div className="
            h-full flex flex-col
            items-center justify-center
            text-center
            py-20
          ">

            <ShieldAlert className="
              w-12 h-12 text-slate-700 mb-4
            " />

            <p className="
              text-slate-400 font-semibold
            ">
              Waiting for attacks...
            </p>

            <p className="
              text-xs text-slate-600 mt-2
            ">
              HoneyNet sensors are actively monitoring
            </p>

          </div>
        )}

      </div>

    </div>
  );
}