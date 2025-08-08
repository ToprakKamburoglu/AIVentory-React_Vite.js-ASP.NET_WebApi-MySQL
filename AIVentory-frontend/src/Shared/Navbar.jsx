import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Ana Sayfa', path: '/', icon: 'fas fa-home' },
    { name: 'Özellikler', path: '/features', icon: 'fas fa-star' },
    { name: 'Fiyatlandırma', path: '/pricing', icon: 'fas fa-tags' },
    { name: 'İletişim', path: '/contact', icon: 'fas fa-envelope' }
  ];

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="fw-bold">AIVentory</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-expanded={isNavOpen}
        >
          <i className={`fas ${isNavOpen ? 'fa-times' : 'fa-bars'} text-main`}></i>
        </button>

        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {navItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link
                  className={`nav-link px-3 ${isActiveLink(item.path) ? 'active' : ''}`}
                  to={item.path}
                  onClick={() => setIsNavOpen(false)}
                >
                  <i className={`${item.icon} me-2 d-lg-none`}></i>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-flex gap-2 mt-3 mt-lg-0 ms-lg-3">
            <Link 
              to="/login" 
              className="btn btn-main"
              onClick={() => setIsNavOpen(false)}
            >
              <i className="fas fa-sign-in-alt me-2"></i>
              Giriş
            </Link>
            <Link 
              to="/register" 
              className="btn btn-main"
              onClick={() => setIsNavOpen(false)}
            >
              <i className="fa-solid fa-address-card me-2"></i>
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;