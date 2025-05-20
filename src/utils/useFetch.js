import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null); // your API data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error state

  useEffect(() => {
    const controller = new AbortController(); // to cancel fetch if needed
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data); // you only need "data" part, not "meta"
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort(); // cleanup if the component unmounts
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
