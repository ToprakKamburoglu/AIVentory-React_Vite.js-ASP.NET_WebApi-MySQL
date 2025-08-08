import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { usePermissions } from '../hooks/usePermissions.jsx';
import '../styles/Dashboard/dashboard.css';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { allowedMenus } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userAvatar, setUserAvatar] = useState(null); 
  const [notifications] = useState([
    { id: 1, title: 'Stok Uyarısı', message: 'iPhone 15 stoku tükenmek üzere', type: 'warning', unread: true },
    { id: 2, title: 'AI Analizi', message: 'Yeni ürün analizi tamamlandı', type: 'info', unread: true },
    { id: 3, title: 'Sipariş', message: 'Samsung Galaxy sipariş edildi', type: 'success', unread: false }
  ]);

 
  useEffect(() => {
    if (user?.id) {
      fetchUserAvatar();
    }
  }, [user?.id]);

  const fetchUserAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.data.avatar) {
        setUserAvatar(response.data.data.avatar);
      }
    } catch (error) {
      console.error('Avatar bilgisi alınamadı:', error);
    }
  };


  const getAvatarUrl = (avatarPath) => {
    if (avatarPath) {
      return `http://localhost:5000/uploads/avatars/${avatarPath}`;
    }
    return null;
  };

 
  const AvatarComponent = ({ className, size = 'normal' }) => {
    const avatarUrl = getAvatarUrl(userAvatar);
    
    if (avatarUrl) {
      return (
        <img 
          src={avatarUrl} 
          alt="Profile" 
          className={className}
          style={{ 
            width: size === 'small' ? '32px' : '40px',
            height: size === 'small' ? '32px' : '40px',
            borderRadius: '50%', 
            objectFit: 'cover'
          }}
          onError={() => setUserAvatar(null)} 
        />
      );
    } else {
     
      return (
        <div className={`${className} ${user?.role}`}>
          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
        </div>
      );
    }
  };

 
  const getBaseUrl = () => {
    switch (user?.role) {
      case 'admin': return '/admin';
      case 'manager': return '/manager';
      case 'employee': return '/employee';
      default: return '/dashboard';
    }
  };

  const baseUrl = getBaseUrl();

 
  const updatedMenus = useMemo(() => {
    return allowedMenus.map(menu => {
      if (menu.submenus) {
        return {
          ...menu,
          submenus: menu.submenus.map(submenu => ({
            ...submenu,
            path: submenu.path.replace('/dashboard', baseUrl)
          }))
        };
      } else {
        return {
          ...menu,
          path: menu.path.replace('/dashboard', baseUrl)
        };
      }
    });
  }, [allowedMenus, baseUrl]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleSubmenu = (menuTitle) => {
    setActiveSubmenu(activeSubmenu === menuTitle ? null : menuTitle);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbMap = {
      admin: 'Admin',
      manager: 'Manager',
      employee: 'Employee',
      dashboard: user ? user.firstName :'Dashboard',
      products: 'Ürünler',
      add: 'Ekle',
      edit: 'Düzenle',
      stock: 'Stok',
      movements: 'Hareketler',
      predictions: 'Tahminler',
      update: 'Güncelle',
      users: 'Kullanıcılar',
      profile: 'Profil',
      settings: 'Ayarlar',
      reports: 'Raporlar',
      sales: 'Satış',
      ai: 'AI Analizi',
      recognition: 'Ürün Tanıma',
      colors: 'Renk Analizi',
      recommendations: 'Öneriler',
      categories: 'Kategoriler'
    };

    return segments.map((segment, index) => ({
      name: breadcrumbMap[segment] || segment,
      path: '/' + segments.slice(0, index + 1).join('/')
    }));
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;
  
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Link to={baseUrl} className="sidebar-logo">
            <div className="logo-icon">🤖</div>
            <span className="logo-text">AIVentory</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {updatedMenus.map((menu, index) => (
            <div key={index} className="nav-item">
              {menu.submenus ? (
                <>
                  <button
                    className="nav-link"
                    onClick={() => toggleSubmenu(menu.title)}
                  >
                    <i className={`${menu.icon} nav-icon`}></i>
                    <span className="nav-text">{menu.title}</span>
                    <i className={`${activeSubmenu === menu.title ? 'rotate-90' : ''}`}></i>
                  </button>
                  <div className={`nav-submenu ${activeSubmenu === menu.title ? 'show' : ''}`}>
                    {menu.submenus.map((submenu, subIndex) => (
                      <Link
                        key={subIndex}
                        to={submenu.path}
                        className={`nav-link ${isActiveRoute(submenu.path) ? 'active' : ''}`}
                      >
                        <span className="nav-text">{submenu.title}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={menu.path}
                  className={`nav-link ${isActiveRoute(menu.path) ? 'active' : ''}`}
                >
                  <i className={`${menu.icon} nav-icon`}></i>
                  <span className="nav-text">{menu.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-info">
            <AvatarComponent className="user-avatar" />
            <div className="user-details">
              <div className="user-name">{user?.firstName} {user?.lastName}</div>
              <div className={`user-role ${user?.role}`}>{user?.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
            
            <div className="breadcrumb">
              {getBreadcrumb().map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="breadcrumb-separator">/</span>}
                  <div className="breadcrumb-item">
                    <Link to={item.path}>{item.name}</Link>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="header-right">
            <div className="header-search">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Ürün, kategori veya stok ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="header-notifications">
              <div className="notification-bell">
                <i className="fas fa-bell"></i>
                {unreadNotifications > 0 && (
                  <span className="notification-badge">{unreadNotifications}</span>
                )}
              </div>
            </div>

            <div className="header-profile" onClick={() => navigate(`${baseUrl}/profile`)}>
              <AvatarComponent className="profile-avatar" size="small" />
              <div className="profile-info">
                <div className="profile-name">{user?.firstName} {user?.lastName}</div>
                <div className="profile-role">{user?.role}</div>
              </div>
              <i className="fas fa-chevron-down ms-2"></i>
            </div>

            <button className="btn btn-outline-main btn-sm" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-2"></i>
              Çıkış
            </button>
          </div>
        </header>
        

        {/* Content */}
        <main className="dashboard-content">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;