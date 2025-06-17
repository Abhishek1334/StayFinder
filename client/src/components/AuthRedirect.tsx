import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AuthRedirectProps {
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthRedirect = ({ requireAuth = false, redirectTo = "/" }: AuthRedirectProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !user) {
      // Redirect to login if trying to access protected route while not authenticated
      navigate("/login");
    } else if (!requireAuth && user) {
      // Redirect to home if trying to access auth pages while authenticated
      navigate(redirectTo);
    }
  }, [user, requireAuth, navigate, redirectTo]);

  return null;
};

export default AuthRedirect; 