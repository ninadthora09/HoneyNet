import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const BACKEND = import.meta.env.VITE_API_URL;

export default function useSocket(eventName, maxItems = 50) {

  const [items, setItems] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {

    socketRef.current = io(BACKEND, {
      transports: ["websocket"],
    });

    socketRef.current.on(eventName, (data) => {

      setItems(prev =>
        [data, ...prev].slice(0, maxItems)
      );

    });

    return () => {
      socketRef.current.disconnect();
    };

  }, [eventName, maxItems]);

  return items;
}