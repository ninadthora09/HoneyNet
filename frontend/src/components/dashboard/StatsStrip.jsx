import API from "../../services/api";
import useApi from "../../hooks/useApi";

import {
  ShieldAlert,
  Users,
  RadioTower,
  TrendingUp,
} from "lucide-react";

export default function StatsStrip() {

  const { data, loading } = useApi(
    () => API.get("/stats"),
    5000
  );

  const cards = [
    {
      title: "Total Attacks",
      value: data?.totalAttacks || 0,
      icon: ShieldAlert,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      title: "Unique Attackers",
      value: data?.uniqueAttackers || 0,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "High Threat",
      value: data?.highThreat || 0,
      icon: TrendingUp,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      title: "Active Sessions",
      value: data?.activeSessions || 0,
      icon: RadioTower,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
  ];

  return (
    <div className="
      grid grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-4
      gap-4
    ">

      {cards.map((card, i) => {

        const Icon = card.icon;

        return (
          <div
            key={i}
            className={`
              rounded-2xl
              border ${card.border}
              bg-[#0B1220]
              p-5
              transition-colors
              hover:border-slate-700
            `}
          >

            <div className="
              flex items-start justify-between
            ">

              <div>

                <p className="
                  text-sm text-slate-400
                ">
                  {card.title}
                </p>

                <div className="mt-3">

                  {loading ? (
                    <div className="
                      h-8 w-20 rounded-md
                      bg-slate-800 animate-pulse
                    " />
                  ) : (
                    <h2 className="
                      text-3xl font-bold text-white
                    ">
                      {card.value.toLocaleString()}
                    </h2>
                  )}

                </div>

              </div>

              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-xl
                flex items-center justify-center
                ${card.bg}
                border ${card.border}
              `}>

                <Icon className={`
                  w-5 h-5
                  ${card.color}
                `} />

              </div>

            </div>

            {/* Bottom */}
            <div className="
              mt-5 flex items-center gap-2
            ">

              <span className={`
                w-2 h-2 rounded-full
                ${card.bg}
              `} />

              <span className="
                text-xs text-slate-500
              ">
                Live monitoring
              </span>

            </div>

          </div>
        );
      })}
    </div>
  );
}