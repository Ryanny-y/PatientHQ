import { API_URL } from "../config/env";
import { setGlobalAccessToken } from "../context/AuthContext";
import type { ApiResponse } from "../types/api";

interface AuthUser {
  accessToken: string;
  username: string;
  role: "ADMIN" | "DOCTOR" | "NURSE";
  permissions: string[];
}

type AuthResponseType = ApiResponse<AuthUser>;

export const refreshToken = async (): Promise<AuthResponseType | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data: AuthResponseType = await response.json();

    if (!response.ok) {
      throw new Error(data.message || response.statusText);
    }

    setGlobalAccessToken(data.data.accessToken);

    return data;
  } catch (error) {
    return null;
  }
};