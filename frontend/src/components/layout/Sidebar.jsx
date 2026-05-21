import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ShieldAlert,
  KeyRound,
  Terminal,
  Activity,
  Wifi,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {

  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Attackers",
      path: "/attackers",
      icon: ShieldAlert,
    },
    {
      name: "Credentials",
      path: "/credentials",
      icon: KeyRound,
    },
    {
      name: "Sessions",
      path: "/sessions",
      icon: Terminal,
    },
  ];

  return (
    <aside
      className={`
        relative hidden md:flex flex-col
        min-h-screen
        bg-[#060B16]/95
        backdrop-blur-xl
        border-r border-cyan-500/10
        transition-all duration-300 ease-in-out

        ${collapsed ? "w-24" : "w-72"}
      `}
    >

      {/* Background Glow */}
      <div className="
        absolute inset-0
        bg-[radial-gradient(circle_at_top,#0ea5e910,transparent_45%)]
        pointer-events-none
      " />

      {/* Header */}
      <div className="
        relative z-10
        flex items-center
        px-5 h-20
        border-b border-slate-800
      ">

        {/* Logo */}
        <div className={`
          flex items-center w-full
          ${collapsed ? "justify-center" : "justify-between"}
        `}>

          {!collapsed ? (
            <>
              <div className="flex items-center gap-3">

                <div className="
                  w-11 h-11 rounded-2xl
                  bg-cyan-500/10
                  border border-cyan-400/20
                  flex items-center justify-center
                  shadow-[0_0_30px_rgba(34,211,238,0.15)]
                ">
                  <Activity className="text-cyan-400" size={22} />
                </div>

                <div>
                  <h1 className="text-xl font-black tracking-wider text-cyan-400">
                    HONEYNET
                  </h1>

                  <p className="text-[10px] tracking-[0.3em] text-slate-500">
                    SOC PLATFORM
                  </p>
                </div>

              </div>

              {/* Toggle */}
              <button
                onClick={() => setCollapsed(true)}
                className="
                  w-9 h-9 rounded-xl
                  bg-slate-900/70
                  border border-slate-700
                  flex items-center justify-center
                  text-slate-400
                  hover:text-cyan-400
                  hover:border-cyan-400/30
                  transition-all
                "
              >
                <ChevronLeft size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              className="
                w-11 h-11 rounded-2xl
                bg-cyan-500/10
                border border-cyan-400/20
                flex items-center justify-center
                text-cyan-400
                shadow-[0_0_30px_rgba(34,211,238,0.15)]
              "
            >
              <ChevronRight size={20} />
            </button>
          )}

        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 px-3 py-6 space-y-3">

        {navItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center
                rounded-2xl
                transition-all duration-300
                group overflow-hidden

                ${collapsed
                  ? "justify-center h-14"
                  : "gap-3 px-4 h-14"
                }

                ${
                  isActive
                    ? `
                      bg-cyan-500/10
                      border border-cyan-400/20
                      text-cyan-400
                      shadow-[0_0_25px_rgba(34,211,238,0.12)]
                    `
                    : `
                      border border-transparent
                      text-slate-400
                      hover:bg-slate-900/80
                      hover:border-slate-700
                      hover:text-white
                    `
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Active Glow */}
                  {isActive && (
                    <div className="
                      absolute left-0 top-3 bottom-3
                      w-1 rounded-full
                      bg-cyan-400
                    " />
                  )}

                  <Icon
                    size={20}
                    className={`
                      shrink-0 transition-all duration-300
                      ${
                        isActive
                          ? "text-cyan-400"
                          : "text-slate-500 group-hover:text-white"
                      }
                    `}
                  />

                  {!collapsed && (
                    <span className="text-sm font-medium tracking-wide">
                      {item.name}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="relative z-10 p-4">

          <div className="
            rounded-2xl
            border border-slate-800
            bg-slate-900/60
            p-4 space-y-4
          ">

            <h3 className="text-[11px] font-bold tracking-[0.2em] text-slate-500">
              SYSTEM STATUS
            </h3>

            <div className="space-y-3">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Wifi size={14} />
                  Sensors
                </div>

                <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  ONLINE
                </div>

              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Database size={14} />
                  MongoDB
                </div>

                <span className="text-cyan-400 text-xs font-semibold">
                  CONNECTED
                </span>

              </div>

            </div>

          </div>

        </div>
      )}
    </aside>
  );
}