export type UserRole = 'read-only' | 'read-write';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type AuthStatus = 'anonymous' | 'mfa-required' | 'authenticated';

export interface AuthState {
  status: AuthStatus;
  user: AuthenticatedUser | null;
  pendingUser: AuthenticatedUser | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
}
