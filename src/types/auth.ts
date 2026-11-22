export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthSession {
  user: AuthUser;
}

export interface LoginResponse {
  user: AuthUser;
  message?: string;
}
