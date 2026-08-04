import axios from "axios";

import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  StoredAuthData,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
} from "../types/auth";

const API_URL = "http://localhost:5028/api/Auth";

const AUTH_STORAGE_KEY = "barmaster_auth";

export async function login(
  request: LoginRequest
): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/login`,
    request
  );

  return response.data;
}

export async function forgotPassword(
  request: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  const response =
    await axios.post<ForgotPasswordResponse>(
      `${API_URL}/forgot-password`,
      request
    );

  return response.data;
}

export async function verifyResetCode(
  request: VerifyResetCodeRequest
): Promise<VerifyResetCodeResponse> {
  const response =
    await axios.post<VerifyResetCodeResponse>(
      `${API_URL}/verify-reset-code`,
      request
    );

  return response.data;
}

export async function resetPassword(
  request: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  const response =
    await axios.post<ResetPasswordResponse>(
      `${API_URL}/reset-password`,
      request
    );

  return response.data;
}

export function saveAuthData(
  authData: StoredAuthData,
  rememberMe: boolean
): void {
  const storage = rememberMe
    ? localStorage
    : sessionStorage;

  clearAuthData();

  storage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(authData)
  );
}

export function getStoredAuthData():
  | StoredAuthData
  | null {
  const rawValue =
    localStorage.getItem(AUTH_STORAGE_KEY) ??
    sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue =
      JSON.parse(rawValue) as StoredAuthData;

    if (
      !parsedValue.token ||
      !parsedValue.worker ||
      !parsedValue.expiresAt
    ) {
      clearAuthData();
      return null;
    }

    if (
      new Date(parsedValue.expiresAt).getTime() <=
      Date.now()
    ) {
      clearAuthData();
      return null;
    }

    return parsedValue;
  } catch {
    clearAuthData();
    return null;
  }
}

export function getAuthToken(): string | null {
  return getStoredAuthData()?.token ?? null;
}

export function clearAuthData(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}