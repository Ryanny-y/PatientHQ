import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";
import { API_URL } from "../config/env";
import type { ApiResponse } from "../types/api";
import { toast } from "sonner";
import { refreshToken as refreshTokenService } from "../service/authService";

type UserRole = "ADMIN" | "DOCTOR" | "NURSE";

interface AuthUser {
  accessToken: string;
  username: string;
  role: UserRole;
  permissions: string[];
}

type AuthResponseType = ApiResponse<AuthUser>;

interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  refreshToken: () => Promise<AuthResponseType | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

let globalAccessToken: string | null = null;
export const getAccessToken = () => globalAccessToken;
export const setGlobalAccessToken = (token: string | null) => {
  globalAccessToken = token;
};

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data: AuthResponseType = await response.json();

      if (!response.ok) {
        throw new Error(data.message || response.statusText);
      }

      console.log(data);

      setUser(data.data);
      setGlobalAccessToken(data.data.accessToken);
      return true;
    } catch (error: any) {
      setUser(null);
      throw error;
    }
  };

  const refreshToken = async (): Promise<AuthResponseType | null> => {
    const data = await refreshTokenService();

    if (!data) {
      toast.error("Session expired. Please log in again.");
      setUser(null);
      return null;
    }

    setUser(data.data);
    return data;
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      toast.success("Logged out.");
    } catch (error: any) {
      toast.error(error.message || "Session expired. Please log in again.");
    } finally {
      setUser(null);
      setGlobalAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, refreshToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
