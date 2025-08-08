import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light-custom">
        <div className="text-center">
          <div className="loading-spinner lg"></div>
          <p className="mt-3 text-gray">Yetki kontrolü yapılıyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
   
    const userDashboard = `/${user.role}/dashboard`;
    return <Navigate to={userDashboard} replace />;
  }

 
  if (user && location.pathname !== '/') {
    const currentPath = location.pathname;
    const userRole = user.role;
    

    if (!currentPath.startsWith(`/${userRole}`)) {
     
      const correctDashboard = `/${userRole}/dashboard`;
      return <Navigate to={correctDashboard} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;