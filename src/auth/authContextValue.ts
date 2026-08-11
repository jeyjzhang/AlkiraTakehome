import { createContext } from 'react';
import type { AuthResult, AuthState, LoginCredentials } from './types';

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  verifyMfa: (code: string) => Promise<AuthResult>;
  cancelMfa: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
