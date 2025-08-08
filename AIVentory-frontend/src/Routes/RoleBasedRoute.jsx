import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="loading-spinner lg"></div>
        <p className="mt-3 text-gray">Yetki kontrolü yapılıyor...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role?.toLowerCase())) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger">
          <h3 className="text-danger mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Yetkisiz Erişim
          </h3>
          <p className="mb-3">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <p className="small text-gray">
            Gerekli yetki: {allowedRoles.join(', ')} | 
            Mevcut yetki: {user?.role || 'Belirsiz'}
          </p>
          <div className="mt-4">
            <a href="/dashboard" className="btn btn-main">
              <i className="fas fa-home me-2"></i>
              Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleBasedRoute;