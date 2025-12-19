export type AuthUser = {
  email: string;
  name: string;
  role: string;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function getAuthToken(): string | null {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  const token = raw.trim();
  if (!token) return null;
  if (token === "null" || token === "undefined") return null;
  return token;
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("auth_changed"));
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("auth_changed"));
}

export function isLoggedIn(): boolean {
  return Boolean(getAuthToken());
}

export function getAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth_changed"));
}
