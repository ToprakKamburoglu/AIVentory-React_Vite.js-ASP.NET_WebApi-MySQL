import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth.jsx'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  const { user, isAuthenticated, checkAuth } = useAuth();

  
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Zaten giriş yapılmış, yönlendiriliyor:', user.role);
      navigate(`/${user.role}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (error) setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const data = response.data;

      if (data.success) {
        const user = data.data.user;
        const token = data.data.token;
        
     
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log("Gelen kullanıcı:", user);

        checkAuth(); 

        setTimeout(() => {
          
          if (user.role === 'admin') {
            navigate('/admin');
          } else if (user.role === 'manager') {
            navigate('/manager');
          } else {
            navigate('/employee');
          }
        }, 100); 

      } else {
        setError(data.message || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Sunucu hatası veya hatalı giriş bilgileri.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light-custom">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="form-container">
              <div className="text-center mb-4">
                <img 
                  src="/images/AIVentory LogoGradient.png" 
                  alt="AIVentory" 
                  style={{height: '60px'}}
                  className="mb-3"
                />
                <h2 className="fw-bold text-dark">Giriş Yapın</h2>
                <p className="text-third">AIVentory hesabınıza erişin</p>
              </div>

              {error && (
                <div className="alert alert-danger mb-4">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">E-posta Adresi</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    style={{borderRadius: '8px', padding: '12px'}}
                    placeholder="ornek@email.com"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Şifre</label>
                  <div style={{position: 'relative'}}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      style={{borderRadius: '8px', padding: '12px', paddingRight: '45px'}}
                      placeholder="••••••••"
                    />
                    <i 
                      className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#6c757d',
                        pointerEvents: isLoading ? 'none' : 'auto' 
                      }}
                    ></i>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <label className="form-check-label text-third">
                        Beni hatırla
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-main text-decoration-none">
                      Şifremi unuttum
                    </Link>
                  </div>
                </div>

                <div className="d-grid mb-4">
                  <button
                    type="submit"
                    className="btn btn-main position-relative"
                    disabled={isLoading}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    
                    {isLoading && (
                      <span className="loading-spinner me-2"></span>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-third">Hesabınız yok mu? </span>
                  <Link to="/register" className="text-main text-decoration-none fw-bold">
                    Kayıt olun
                  </Link>
                </div>
              </form>

              {/* Demo Accounts */}
              <div className="mt-4 pt-4" style={{borderTop: '1px solid var(--border-color)'}}>
                <p className="text-center text-third mb-3">
                  <small>Demo hesapları ile deneyin:</small>
                </p>
                <div className="row g-2">
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-main btn-sm w-100"
                      disabled={isLoading}
                      onClick={() => setFormData({
                        email: 'admin@demo.com',
                        password: 'demo123',
                        rememberMe: false
                      })}
                    >
                      <i className="fas fa-user-tie me-1"></i>
                      Admin
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-main btn-sm w-100"
                      disabled={isLoading}
                      onClick={() => setFormData({
                        email: 'manager@demo.com',
                        password: 'demo123',
                        rememberMe: false
                      })}
                    >
                      <i className="fas fa-user-cog me-1"></i>
                      Müdür
                    </button>
                  </div>
                  <div className="col-12 mt-2">
                    <button
                      type="button"
                      className="btn btn-outline-main btn-sm w-100"
                      disabled={isLoading}
                      onClick={() => setFormData({
                        email: 'employee@demo.com',
                        password: 'demo123',
                        rememberMe: false
                      })}
                    >
                      <i className="fas fa-user me-1"></i>
                      Çalışan
                    </button>
                  </div>
                </div>
              </div>

              {/* Debug Info */}
              <div className="mt-3 text-center">
                <small style={{ color: '#666' }}>
                  Debug: {isAuthenticated ? 'Authenticated' : 'Not authenticated'} 
                  {user && ` | Role: ${user.role} | Name: ${user.firstName}`}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;