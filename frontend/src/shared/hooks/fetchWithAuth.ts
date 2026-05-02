import { API_URL } from "../config/env";
import { getAccessToken } from "../context/AuthContext";
import { refreshToken } from "../service/authService";

export const fetchWithAuth = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {

  const doFetch = (token: string | null) =>
    fetch(`${API_URL}/${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      credentials: "include",
    });

  let res = await doFetch(getAccessToken());

  if (res.status === 401) {
    const newToken = await refreshToken();

    if (!newToken) {
      throw new Error("Session expired");
    }

    res = await doFetch(newToken.data.accessToken);
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};