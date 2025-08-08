import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyid: '',
    role: '', 
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Şifreler eşleşmiyor.');
      return;
    }

    if (!formData.acceptTerms) {
      alert('Lütfen kullanım şartlarını kabul edin.');
      return;
    }

    if (formData.password.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (!formData.role) {
      alert('Lütfen bir rol seçin.');
      return;
    }

    setIsLoading(true);

    try {
     
      let roleValue;
      switch (formData.role) {
        case 'admin':
          roleValue = 0; 
          break;
        case 'manager':
          roleValue = 1; 
          break;
        case 'employee':
          roleValue = 2; 
          break;
        default:
          alert('Geçersiz rol seçimi.');
          return;
      }

      const response = await axios.post('http://localhost:5000/api/auth/register', {
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Email: formData.email,
        Password: formData.password,
        CompanyId: parseInt(formData.companyid, 10),
        Role: roleValue 
      });

      const data = response.data;

      if (data.success) {
        if (data.data?.token) {
          localStorage.setItem('token', data.data.token);
        }
        navigate('/login');
      } else {
        alert(data.message || 'Kayıt başarısız.');
      }
    } catch (error) {
      console.error('Backend Hatası:', error.response?.data);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const messages = Object.values(errors).flat().join('\n');
        alert(messages);
      } else {
        alert(error.response?.data?.message || 'Sunucu hatası veya geçersiz giriş.');
      }
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
                <h2 className="fw-bold text-dark">Hesap Oluşturun</h2>
                <p className="text-third">14 gün ücretsiz deneme başlatın</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Ad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      style={{borderRadius: '8px', padding: '12px'}}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Soyad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      style={{borderRadius: '8px', padding: '12px'}}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label">E-posta</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{borderRadius: '8px', padding: '12px'}}
                  />
                </div>

                <div className="mt-3">
                  <label className="form-label">Şifre</label>
                  <div style={{position: 'relative'}}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      style={{borderRadius: '8px', padding: '12px', paddingRight: '45px'}}
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
                        color: '#6c757d'
                      }}
                    ></i>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label">Şifre Tekrar</label>
                  <div style={{position: 'relative'}}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      style={{borderRadius: '8px', padding: '12px', paddingRight: '45px'}}
                    />
                    <i 
                      className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#6c757d'
                      }}
                    ></i>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label">Şirket Id</label>
                  <input
                    type="number"           
                    className="form-control"
                    name="companyid"      
                    value={formData.companyid}
                    onChange={handleInputChange}
                    required
                    style={{borderRadius: '8px', padding: '12px'}}
                  />
                </div>

                {/* Yeni Role seçimi alanı */}
                <div className="mt-3">
                  <label className="form-label">Rol</label>
                  <select
                    className="form-control"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    style={{borderRadius: '8px', padding: '12px'}}
                  >
                    <option value="">Rol seçin</option>
                    <option value="employee">Çalışan</option>
                    <option value="manager">Müdür</option>
                    <option value="admin">Yönetici</option>
                  </select>
                </div>

                <div className="mt-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      required
                    />
                    <label className="form-check-label text-third">
                      Kullanım şartlarını kabul ediyorum
                    </label>
                  </div>
                </div>

                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-main"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <i className="fas fa-user-plus me-2"></i>
                        Hesap oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Hesap Oluştur
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center mt-4">
                  <span className="text-third">Zaten hesabınız var mı? </span>
                  <Link to="/login" className="text-main text-decoration-none fw-bold">
                    Giriş yapın
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;