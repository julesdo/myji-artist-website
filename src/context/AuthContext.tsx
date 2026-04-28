import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface AuthContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() => localStorage.getItem("admin_token"));
  const adminInfo = useQuery(api.auth.checkSession, { token: token || undefined });
  const loginMutation = useMutation(api.auth.login);
  const logoutMutation = useMutation(api.auth.logout);

  const login = async (email: string, password: string) => {
    const result = await loginMutation({ email, password });
    if (result.token) {
      setToken(result.token);
      localStorage.setItem("admin_token", result.token);
    }
  };

  const logout = async () => {
    if (token) {
      await logoutMutation({ token });
      setToken(null);
      localStorage.removeItem("admin_token");
    }
  };

  const isLoading = token !== null && adminInfo === undefined;

  return (
    <AuthContext.Provider value={{ 
      isAdmin: !!adminInfo, 
      adminEmail: adminInfo?.email || null, 
      login, 
      logout,
      token,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
