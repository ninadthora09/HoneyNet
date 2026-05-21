import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const BACKEND = "http://localhost:5000";

export default function useSocket(eventName, maxItems = 50) {

  const [items, setItems] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {

    socketRef.current = io(BACKEND);

    socketRef.current.on(eventName, (data) => {

      setItems(prev =>
        [data, ...prev].slice(0, maxItems)
      );

    });

    return () => {
      socketRef.current.disconnect();
    };

  }, []);

  return items;
}