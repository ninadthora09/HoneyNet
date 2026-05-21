import { useEffect, useRef } from "react";
import useSocket from "../../hooks/useSocket";

import {
  Globe,
  Radar,
} from "lucide-react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function AttackMap() {

  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Keep latest 20 attacks on map
  const attacks = useSocket("new_attack", 20);

  // Store markers to prevent memory leak
  const markersRef = useRef([]);

  /* Initialize Map */
  useEffect(() => {

    mapInstance.current = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([20, 0], 2);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap & CartoDB",
      }
    ).addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
    };

  }, []);

  /* Add Markers */
  useEffect(() => {

    if (!attacks.length || !mapInstance.current) {
      return;
    }

    const attack = attacks[0];

    console.log("MAP ATTACK:", attack);

    // Ignore if no coordinates
    if (
      attack.lat == null ||
      attack.lng == null
    ) {
      return;
    }

    // Threat color
    let color = "#22d3ee";

    if (attack.threatScore >= 70) {
      color = "#f87171";
    } else if (attack.threatScore >= 40) {
      color = "#facc15";
    }

    // Create marker
    const marker = L.circleMarker(
      [attack.lat, attack.lng],
      {
        radius: 8,
        fillColor: color,
        color,
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }
    );

    // Popup
    marker.bindPopup(`
      <div style="
        background:#0B1220;
        color:white;
        padding:10px;
        border-radius:10px;
        min-width:180px;
        font-family:sans-serif;
      ">

        <div style="
          font-weight:bold;
          color:#22d3ee;
          margin-bottom:6px;
        ">
          ${attack.ip}
        </div>

        <div style="
          font-size:12px;
          color:#94a3b8;
          margin-bottom:8px;
        ">
          ${attack.country || "Unknown"}
        </div>

        <div style="font-size:12px">
          <b>Sensor:</b> ${attack.sensor}
        </div>

        <div style="font-size:12px">
          <b>Threat:</b> ${attack.threatScore}
        </div>

        <div style="font-size:12px">
          <b>Fingerprint:</b> ${attack.fingerprint || "bot"}
        </div>

      </div>
    `);

    marker.addTo(mapInstance.current);

    // Store marker
    markersRef.current.push(marker);

    // Limit markers
    if (markersRef.current.length > 20) {

      const oldMarker =
        markersRef.current.shift();

      oldMarker?.remove();

    }

  }, [attacks]);

  return (
    <div className="
      relative overflow-hidden
      h-full
      rounded-2xl
      border border-slate-800
      bg-[#0B1220]
    ">

      {/* Header */}
      <div className="
        absolute top-0 left-0 right-0
        z-[500]
        flex items-center justify-between
        px-5 py-4
        bg-gradient-to-b
        from-[#0B1220]
        to-transparent
      ">

        <div>

          <h2 className="
            text-lg font-bold text-white
          ">
            Global Threat Map
          </h2>

          <p className="
            text-xs text-slate-500 mt-1
          ">
            Real-time hostile traffic visualization
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

      {/* Bottom Left */}
      <div className="
        absolute bottom-4 left-4
        z-[500]
      ">

        <div className="
          flex items-center gap-3
          px-4 py-3 rounded-xl
          bg-slate-900/90
          border border-slate-800
        ">

          <div className="
            w-9 h-9 rounded-xl
            bg-cyan-500/10
            border border-cyan-500/20
            flex items-center justify-center
          ">

            <Radar className="
              w-4 h-4 text-cyan-400
            " />

          </div>

          <div>

            <p className="
              text-xs text-slate-500
            ">
              Sensor Network
            </p>

            <p className="
              text-sm font-semibold text-white
            ">
              HoneyNet Active
            </p>

          </div>

        </div>

      </div>

      {/* Bottom Right */}
      <div className="
        absolute bottom-4 right-4
        z-[500]
      ">

        <div className="
          w-12 h-12 rounded-xl
          bg-slate-900/90
          border border-slate-800
          flex items-center justify-center
        ">

          <Globe className="
            w-5 h-5 text-cyan-400
          " />

        </div>

      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-full"
      />

    </div>
  );
}