import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  authenticateWithPassword,
  verifyMfaCode,
} from './mockAuthService';
import type {
  AuthResult,
  AuthState,
  AuthenticatedUser,
  LoginCredentials,
} from './types';
import { AuthContext, type AuthContextValue } from './authContextValue';

const SESSION_KEY = 'alkira-auth-session';

function readStoredUser(): AuthenticatedUser | null {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? (JSON.parse(stored) as AuthenticatedUser) : null;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const user = readStoredUser();
    return {
      status: user ? 'authenticated' : 'anonymous',
      user,
      pendingUser: null,
    };
  });

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResult> => {
      const user = await authenticateWithPassword(credentials);

      if (!user) {
        return {
          success: false,
          message: 'The email or password you entered is incorrect.',
        };
      }

      setState({ status: 'mfa-required', user: null, pendingUser: user });
      return { success: true };
    },
    [],
  );

  const verifyMfa = useCallback(
    async (code: string): Promise<AuthResult> => {
      if (!state.pendingUser) {
        return { success: false, message: 'Your sign-in session has expired.' };
      }

      const isValid = await verifyMfaCode(code);
      if (!isValid) {
        return {
          success: false,
          message: 'That verification code is incorrect. Please try again.',
        };
      }

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state.pendingUser));
      setState({
        status: 'authenticated',
        user: state.pendingUser,
        pendingUser: null,
      });
      return { success: true };
    },
    [state.pendingUser],
  );

  const cancelMfa = useCallback(() => {
    setState({ status: 'anonymous', user: null, pendingUser: null });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setState({ status: 'anonymous', user: null, pendingUser: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, verifyMfa, cancelMfa, logout }),
    [state, login, verifyMfa, cancelMfa, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
