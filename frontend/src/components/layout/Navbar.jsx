import {
  Shield,
  Activity,
  Bell,
  Globe,
  Search,
  Clock3,
} from "lucide-react";

export default function Navbar() {

  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header
      className="
        sticky top-0 z-50
        h-20
        border-b border-cyan-500/10
        bg-[#060B16]/80
        backdrop-blur-2xl
        px-6
        flex items-center justify-between
        shadow-[0_10px_30px_rgba(0,0,0,0.25)]
      "
    >

      {/* Left Section */}
      <div className="flex items-center gap-5">

        {/* Logo */}
        <div
          className="
            relative
            h-12 w-12 rounded-2xl
            bg-cyan-500/10
            border border-cyan-400/20
            flex items-center justify-center
            shadow-[0_0_30px_rgba(34,211,238,0.15)]
          "
        >
          <Shield className="text-cyan-400 w-5 h-5" />

          <div className="
            absolute inset-0 rounded-2xl
            border border-cyan-400/10
            animate-pulse
          " />
        </div>

        {/* Title */}
        <div>

          <h2 className="text-xl font-black tracking-wide text-white">
            Threat Intelligence Dashboard
          </h2>

          <p className="text-xs text-slate-500 tracking-wide">
            Real-time honeypot monitoring & attack analysis
          </p>

        </div>

      </div>

      {/* Center Search */}
      <div className="hidden lg:flex flex-1 justify-center px-10">

        <div
          className="
            w-full max-w-xl
            h-12
            rounded-2xl
            bg-slate-900/70
            border border-slate-800
            flex items-center gap-3
            px-4
            transition-all duration-300
            hover:border-cyan-400/20
            focus-within:border-cyan-400/30
            focus-within:shadow-[0_0_20px_rgba(34,211,238,0.08)]
          "
        >

          <Search className="w-4 h-4 text-slate-500" />

          <input
            type="text"
            placeholder="Search attackers, IPs, sessions..."
            className="
              bg-transparent
              outline-none
              border-none
              w-full
              text-sm text-white
              placeholder:text-slate-500
            "
          />

        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Global Status */}
        <div
          className="
            hidden md:flex
            items-center gap-2
            px-4 py-2.5
            rounded-2xl
            bg-slate-900/70
            border border-slate-800
          "
        >

          <Globe className="w-4 h-4 text-cyan-400" />

          <span className="text-xs text-slate-300 font-medium">
            Global Monitoring
          </span>

        </div>

        {/* Clock */}
        <div
          className="
            hidden xl:flex
            items-center gap-2
            px-4 py-2.5
            rounded-2xl
            bg-slate-900/70
            border border-slate-800
          "
        >

          <Clock3 className="w-4 h-4 text-slate-400" />

          <span className="text-xs text-slate-300 font-medium">
            {time}
          </span>

        </div>

        {/* Alerts */}
        <button
          className="
            relative
            h-12 w-12 rounded-2xl
            bg-slate-900/70
            border border-slate-800
            flex items-center justify-center
            transition-all duration-300
            hover:border-red-400/30
            hover:bg-red-500/5
          "
        >

          <Bell className="w-4 h-4 text-slate-300" />

          <span className="
            absolute top-3 right-3
            h-2.5 w-2.5 rounded-full
            bg-red-500
            shadow-[0_0_10px_rgba(239,68,68,0.9)]
          " />

        </button>

        {/* Live Status */}
        <div
          className="
            flex items-center gap-3
            px-5 py-2.5
            rounded-2xl
            bg-green-500/10
            border border-green-500/20
            shadow-[0_0_20px_rgba(34,197,94,0.08)]
          "
        >

          <span className="relative flex h-2.5 w-2.5">

            <span className="
              animate-ping absolute inline-flex
              h-full w-full rounded-full
              bg-green-400 opacity-60
            " />

            <span className="
              relative inline-flex rounded-full
              h-2.5 w-2.5 bg-green-400
            " />

          </span>

          <Activity className="w-4 h-4 text-green-400" />

          <span className="
            text-xs font-black tracking-[0.2em]
            text-green-400
          ">
            LIVE
          </span>

        </div>

      </div>

    </header>
  );
}