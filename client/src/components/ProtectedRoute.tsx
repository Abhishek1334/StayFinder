import { ReactNode } from "react";
import AuthRedirect from "./AuthRedirect";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  return (
    <>
      <AuthRedirect requireAuth />
      {children}
    </>
  );
};

export default ProtectedRoute; 