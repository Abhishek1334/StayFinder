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
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await api.get("/auth/me");
      
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
        localStorage.removeItem("token");
        toast.error(response.data.message || "Session expired");
      }
    } catch (error: any) {
      setUser(null);
      localStorage.removeItem("token");
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Please login again.");
      } else {
        toast.error("Failed to verify authentication. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        
        if (!user) {
          toast.error("Invalid response from server");
          return null;
        }

        if (!token) {
          toast.error("Authentication failed");
          return null;
        }

        localStorage.setItem("token", token);
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
        const { user, token } = response.data.data;
        
        if (!user) {
          toast.error("Invalid response from server");
          return null;
        }

        if (!token) {
          toast.error("Authentication failed");
          return null;
        }

        localStorage.setItem("token", token);
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
      
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      // Still clear local state even if server logout fails
      localStorage.removeItem("token");
      setUser(null);
      toast.error("Logout failed");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Check auth state on mount and when token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [checkAuth]);

  // Add error handling for network issues
  useEffect(() => {
    const handleOffline = () => {
      toast.error("You are offline. Please check your internet connection.");
    };

    const handleOnline = () => {
      const token = localStorage.getItem("token");
      if (token) {
        checkAuth();
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [checkAuth]);

  // Check token expiration periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token) {
        checkAuth();
      }
    };

    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000); // Check every 5 minutes

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