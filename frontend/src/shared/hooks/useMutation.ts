import { useState } from "react";
import useAuthFetch from "./useAuthFetch";

const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authFetch = useAuthFetch();

  const execute = async <T>(
    url: string,
    options: RequestInit
  ): Promise<T> => {
    try {
      setLoading(true);
      setError(null);

      const result = await authFetch(url, options);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useMutation;