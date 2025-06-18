import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/axios";
import { User } from "@/types/user";
import { AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      console.log('Checking auth state...');
      const response = await api.get("/auth/me");
      
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
      }
    } catch (error: any) {
      console.error('Auth check error:', error);
      setUser(null);
      
      // Don't try to refresh here, let axios interceptor handle it
      if (window.location.pathname !== '/login') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login...');
      
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      
      if (response.data.success && response.data.data) {
        const { user } = response.data.data;
        
        if (!user) {
          toast.error("Invalid response from server");
          return null;
        }

        setUser(user);
        toast.success(response.data.message || "Login successful");
        return user;
      } else {
        toast.error(response.data.message || "Login failed");
        return null;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      
      if (response.data.success && response.data.data) {
        const { user } = response.data.data;
        
        if (!user) {
          toast.error("Invalid response from server");
          return null;
        }

        setUser(user);
        toast.success(response.data.message || "Registration successful");
        return user;
      } else {
        toast.error(response.data.message || "Registration failed");
        return null;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      await api.post("/auth/logout");
      
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      // Still clear local state even if server logout fails
      setUser(null);
      toast.error("Logout failed");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Check auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Add error handling for network issues
  useEffect(() => {
    const handleOffline = () => {
      toast.error("You are offline. Please check your internet connection.");
    };

    const handleOnline = () => {
      checkAuth();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [checkAuth]);

  // Check auth state periodically
  useEffect(() => {
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [checkAuth]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 