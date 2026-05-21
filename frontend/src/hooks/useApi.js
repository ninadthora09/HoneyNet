import { useEffect, useState } from "react";

export default function useApi(apiCall, refreshMs = null) {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function fetchData() {
    try {
      const res = await apiCall();

      setData(res.data);
    } catch (err) {
      setError(err.message || "API Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let interval;

    const init = async () => {
      await fetchData();

      if (refreshMs) {
        interval = setInterval(() => {
          fetchData();
        }, refreshMs);
      }
    };

    init();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}
