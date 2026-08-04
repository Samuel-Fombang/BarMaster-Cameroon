import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearAuthData,
  getStoredAuthData,
  login as loginRequest,
  saveAuthData,
} from "../services/authService";
import type {
  LoginRequest,
  StoredAuthData,
} from "../types/auth";
import type { Worker } from "../types/worker";

type AuthContextValue = {
  worker: Worker | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (
    request: LoginRequest,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [authData, setAuthData] =
    useState<StoredAuthData | null>(() =>
      getStoredAuthData()
    );

  const login = async (
    request: LoginRequest,
    rememberMe: boolean
  ) => {
    const response =
      await loginRequest(request);

    const newAuthData: StoredAuthData = {
      token: response.token,
      expiresAt: response.expiresAt,
      worker: response.worker,
    };

    saveAuthData(
      newAuthData,
      rememberMe
    );

    setAuthData(newAuthData);
  };

  const logout = () => {
    clearAuthData();
    setAuthData(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      worker: authData?.worker ?? null,
      token: authData?.token ?? null,
      isAuthenticated: Boolean(
        authData?.token &&
        authData.worker
      ),
      login,
      logout,
    }),
    [authData]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}