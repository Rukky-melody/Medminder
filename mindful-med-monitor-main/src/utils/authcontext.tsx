// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  login as authServiceLogin,
  register as authServiceRegister,
  logout as authServiceLogout,
  isAuthenticated as authServiceIsAuthenticated,
  getCurrentUser as authServiceGetCurrentUser,
} from '@/utils/authService'; // IMPORTANT: Ensure this path is correct for your 
import { LoginCredentials, RegisterCredentials, User } from '@/types';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadAuthState = useCallback(() => {
    console.log("[AuthContext] --- Starting loadAuthState ---");
    const authenticated = authServiceIsAuthenticated(); // This checks token validity and logs out if expired
    const storedUser = authServiceGetCurrentUser(); // This parses the user object from localStorage
    const storedToken = localStorage.getItem('auth_token');

    console.log("[AuthContext] authServiceIsAuthenticated() returned:", authenticated);
    console.log("[AuthContext] Stored User from authService.getCurrentUser():", storedUser);
    console.log("[AuthContext] Stored Token from localStorage:", storedToken ? 'exists' : 'null');

    if (authenticated && storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      console.log("[AuthContext] Setting authenticated state (user and token are valid).");
    } else {
      setUser(null);
      setToken(null);
      // Ensure localStorage is clean if state is not authenticated
      if (storedUser || storedToken) { // Only log out if there was something to clean up
         authServiceLogout(); // Call authServiceLogout directly to ensure full cleanup
      }
      console.log("[AuthContext] No valid authentication found or data incomplete. Clearing state.");
    }
    console.log("[AuthContext] --- Finished loadAuthState ---");
  }, []);

  useEffect(() => {
    console.log("[AuthContext] Initial useEffect triggered.");
    loadAuthState();
    setLoading(false); // Finished initial check
  }, [loadAuthState]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth_token' || event.key === 'user') {
        console.log(`[AuthContext] localStorage '${event.key}' changed. Reloading auth state.`);
        loadAuthState();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadAuthState]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    console.log("[AuthContext] Attempting login...");
    try {
      await authServiceLogin(credentials); // authService handles setting localStorage
      loadAuthState(); // Reload state immediately after login
      toast({ title: "Login Successful", description: "Welcome back!", variant: "default" });
      console.log("[AuthContext] Login successful.");
      return true;
    } catch (error: any) {
      console.error('[AuthContext] Login Error:', error);
      setUser(null);
      setToken(null);
      toast({ title: "Login Failed", description: error.message || "Invalid credentials or server error.", variant: "destructive" });
      console.log("[AuthContext] Login failed. Clearing state.");
      return false;
    } finally {
      setLoading(false);
      console.log("[AuthContext] Login attempt finished.");
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setLoading(true);
    console.log("[AuthContext] Attempting registration...");
    try {
      await authServiceRegister(credentials); // authService handles setting localStorage
      loadAuthState(); // Reload state immediately after registration
      toast({ title: "Registration Successful", description: "Your account has been created!", variant: "default" });
      console.log("[AuthContext] Registration successful.");
      return true;
    } catch (error: any) {
      console.error('[AuthContext] Register Error:', error);
      setUser(null);
      setToken(null);
      toast({ title: "Registration Failed", description: error.message || "Error creating account. Please try again.", variant: "destructive" });
      console.log("[AuthContext] Registration failed. Clearing state.");
      return false;
    } finally {
      setLoading(false);
      console.log("[AuthContext] Registration attempt finished.");
    }
  };

  const logout = useCallback(() => {
    console.log("[AuthContext] Attempting logout...");
    authServiceLogout(); // Clear localStorage via authService
    setUser(null);      // Immediately update context state
    setToken(null);     // Immediately update context state
    toast({ title: "Logged Out", description: "You have been logged out.", variant: "default" });
    console.log("[AuthContext] Logout complete.");
  }, [toast]);


  const authContextValue = {
    user,
    token,
    isLoggedIn: !!user && !!token, // Ensure both user object and token are present
    loading,
    login,
    register,
    logout,
  };

  console.log("[AuthContext] Current Context Value:", {
    user: authContextValue.user ? { id: authContextValue.user.id, email: authContextValue.user.email, fullName: authContextValue.user.fullName } : null,
    token: authContextValue.token ? 'exists' : 'null',
    isLoggedIn: authContextValue.isLoggedIn,
    loading: authContextValue.loading,
  });

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
