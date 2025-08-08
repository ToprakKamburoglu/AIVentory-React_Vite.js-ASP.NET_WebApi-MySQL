import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const AddUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    phone: '',
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
     
      setLoading(true);
      setTimeout(() => {
       
        setFormData({
          firstName: 'Mehmet',
          lastName: 'Yılmaz',
          email: 'mehmet@demo.com',
          password: '',
          confirmPassword: '',
          role: 'employee',
          phone: '+90 555 345 6789',
          isActive: true
        });
        setLoading(false);
      }, 500);
    }
  }, [isEdit, id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

   
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad gereklidir';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad gereklidir';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!isEdit && !formData.password) {
      newErrors.password = 'Şifre gereklidir';
    }

    if (!isEdit && formData.password && formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    if (!isEdit && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon numarası gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true); 

    try {
     
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form data:', formData);
      
      
      alert(isEdit ? 'Kullanıcı başarıyla güncellendi!' : 'Kullanıcı başarıyla oluşturuldu!');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({
      ...prev,
      password: password,
      confirmPassword: password
    }));
  };

  if (loading && isEdit) {
    return (
      <div className="dashboard-content">
        <div className="loading-overlay">
          <div className="loading-spinner lg"></div>
          <p>Kullanıcı bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-dark fw-bold mb-1">
            {isEdit ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
          </h1>
          <p className="text-gray mb-0">
            {isEdit ? 'Kullanıcı bilgilerini güncelleyin' : 'Sisteme yeni kullanıcı ekleyin'}
          </p>
        </div>
        <Link to="/admin/users" className="btn btn-outline-main">
          <i className="fas fa-arrow-left me-2"></i>
          Geri Dön
        </Link>
      </div>

      {/* Form */}
      <div className="row">
        <div className="col-lg-8">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-user me-2"></i>
                Kullanıcı Bilgileri
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Ad *</label>
                      <input
                        type="text"
                        name="firstName"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Kullanıcının adı"
                      />
                      {errors.firstName && (
                        <div className="invalid-feedback">{errors.firstName}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Soyad *</label>
                      <input
                        type="text"
                        name="lastName"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Kullanıcının soyadı"
                      />
                      {errors.lastName && (
                        <div className="invalid-feedback">{errors.lastName}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">E-posta Adresi *</label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="kullanici@email.com"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Telefon *</label>
                      <input
                        type="tel"
                        name="phone"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+90 555 123 4567"
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Rol *</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="employee">Çalışan</option>
                    <option value="manager">Müdür</option>
                    <option value="admin">Yönetici</option>
                  </select>
                </div>

                {!isEdit && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Şifre *</label>
                          <div className="input-group">
                            <input
                              type="password"
                              name="password"
                              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="En az 6 karakter"
                            />
                            <button
                              type="button"
                              className="btn btn-outline-main"
                              onClick={generatePassword}
                              title="Rastgele şifre oluştur"
                            >
                              <i className="fas fa-random"></i>
                            </button>
                          </div>
                          {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Şifre Tekrar *</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Şifre tekrar"
                          />
                          {errors.confirmPassword && (
                            <div className="invalid-feedback">{errors.confirmPassword}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="form-check">
                  <input
                    type="checkbox"
                    name="isActive"
                    className="form-check-input"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    id="isActive"
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    Kullanıcı aktif olsun
                  </label>
                </div>

                <div className="d-flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="btn btn-main"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner me-2"></div>
                        {isEdit ? 'Güncelleniyor...' : 'Kaydediliyor...'}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        {isEdit ? 'Güncelle' : 'Kaydet'}
                      </>
                    )}
                  </button>
                  <Link to="/admin/users" className="btn btn-outline-main">
                    <i className="fas fa-times me-2"></i>
                    İptal
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="col-lg-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-info-circle me-2"></i>
                Bilgilendirme
              </h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="fas fa-lightbulb alert-icon"></i>
                <div>
                  <strong>İpuçları:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Güçlü şifre kullanın</li>
                    <li>E-posta adresi benzersiz olmalı</li>
                    <li>Rol dikkatli seçin</li>
                    <li>Telefon formatına dikkat edin</li>
                  </ul>
                </div>
              </div>

              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle alert-icon"></i>
                <div>
                  <strong>Roller:</strong>
                  <ul className="mb-0 mt-2">
                    <li><strong>Yönetici:</strong> Tüm yetkilere sahip</li>
                    <li><strong>Müdür:</strong> Sınırlı yönetim yetkisi</li>
                    <li><strong>Çalışan:</strong> Temel işlemler</li>
                  </ul>
                </div>
              </div>

              {isEdit && (
                <div className="alert alert-success">
                  <i className="fas fa-shield-alt alert-icon"></i>
                  <div>
                    <strong>Güvenlik:</strong>
                    <p className="mb-0 mt-2">
                      Şifre değiştirmek için kullanıcı profil sayfasını kullanın.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;