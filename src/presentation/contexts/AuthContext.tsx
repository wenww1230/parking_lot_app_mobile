import React, {createContext, useState, useEffect, useCallback} from 'react';
import {User} from '../../domain/entities/User';
import {authUseCase} from '../../di/UseCaseContainer';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredSession = useCallback(async () => {
    try {
      const stored = await authUseCase.getStoredSession();
      setUser(stored);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredSession();
  }, [loadStoredSession]);

  const login = useCallback(async (username: string, password: string) => {
    const loggedUser = await authUseCase.login(username, password);
    setUser(loggedUser);
  }, []);

  const logout = useCallback(async () => {
    await authUseCase.logout();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
