import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
