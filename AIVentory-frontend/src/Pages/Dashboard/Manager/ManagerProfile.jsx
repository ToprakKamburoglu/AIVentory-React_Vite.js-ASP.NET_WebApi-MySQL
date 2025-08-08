import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

const ManagerProfile = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'Admin',
    lastName: user?.lastName || 'User',
    email: user?.email || 'admin@demo.com',
    phone: '+90 555 123 4567',
    avatar: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'Ad gereklidir';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Soyad gereklidir';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Mevcut şifre gereklidir';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Yeni şifre gereklidir';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Şifre en az 6 karakter olmalıdır';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      return;
    }

    setLoading(true);

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Profil bilgileri başarıyla güncellendi!');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
    
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Şifre başarıyla değiştirildi!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'badge-danger',
      manager: 'badge-main',
      employee: 'badge-success'
    };
    return badges[role] || 'badge-main';
  };

  const getRoleText = (role) => {
    const roles = {
      admin: 'Yönetici',
      manager: 'Müdür',
      employee: 'Çalışan'
    };
    return roles[role] || role;
  };

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-dark fw-bold mb-1">Profil Ayarları</h1>
        <p className="text-gray mb-0">Hesap bilgilerinizi görüntüleyin ve güncelleyin</p>
      </div>

      <div className="row">
        {/* Profile Summary */}
        <div className="col-lg-4">
          <div className="dashboard-card">
            <div className="card-body text-center">
              <div className={`user-avatar ${user?.role} mx-auto mb-3`} style={{ width: '80px', height: '80px', fontSize: '24px' }}>
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </div>
              <h4 className="text-dark fw-bold mb-1">
                {profileData.firstName} {profileData.lastName}
              </h4>
              <p className="text-gray mb-3">{profileData.email}</p>
              <span className={`badge ${getRoleBadge(user?.role)}`}>
                {getRoleText(user?.role)}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card mt-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-chart-line me-2"></i>
                Hesap İstatistikleri
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-gray">Hesap Oluşturma</span>
                <span className="text-dark fw-bold">01.01.2024</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-gray">Son Giriş</span>
                <span className="text-dark fw-bold">Bugün</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-gray">Toplam Oturum</span>
                <span className="text-dark fw-bold">247</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-gray">Hesap Durumu</span>
                <span className="badge badge-success">Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Forms */}
        <div className="col-lg-8">
          {/* Tab Navigation */}
          <div className="dashboard-card">
            <div className="card-header">
              <div className="nav nav-tabs" role="tablist">
                <button
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                  style={{ background: activeTab === 'profile' ? 'var(--main-color)' : 'transparent', color: activeTab === 'profile' ? 'white' : 'var(--gray-color)', border: 'none', borderRadius: 'var(--border-radius-sm)', marginRight: '8px' }}
                >
                  <i className="fas fa-user me-2"></i>
                  Profil Bilgileri
                </button>
                <button
                  className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                  style={{ background: activeTab === 'password' ? 'var(--main-color)' : 'transparent', color: activeTab === 'password' ? 'white' : 'var(--gray-color)', border: 'none', borderRadius: 'var(--border-radius-sm)' }}
                >
                  <i className="fas fa-lock me-2"></i>
                  Şifre Değiştir
                </button>
              </div>
            </div>

            <div className="card-body">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Ad *</label>
                        <input
                          type="text"
                          name="firstName"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          placeholder="Adınız"
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
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          placeholder="Soyadınız"
                        />
                        {errors.lastName && (
                          <div className="invalid-feedback">{errors.lastName}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">E-posta Adresi *</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="+90 555 123 4567"
                    />
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
                          Güncelleniyor...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Kaydet
                        </>
                      )}
                    </button>
                    <button type="button" className="btn btn-outline-main">
                      <i className="fas fa-undo me-2"></i>
                      Sıfırla
                    </button>
                  </div>
                </form>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle alert-icon"></i>
                    <div>
                      Güvenliğiniz için düzenli olarak şifrenizi değiştirin. Yeni şifreniz en az 6 karakter olmalıdır.
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mevcut Şifre *</label>
                    <input
                      type="password"
                      name="currentPassword"
                      className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Mevcut şifreniz"
                    />
                    {errors.currentPassword && (
                      <div className="invalid-feedback">{errors.currentPassword}</div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Yeni Şifre *</label>
                        <input
                          type="password"
                          name="newPassword"
                          className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Yeni şifreniz"
                        />
                        {errors.newPassword && (
                          <div className="invalid-feedback">{errors.newPassword}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Yeni Şifre Tekrar *</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Yeni şifre tekrar"
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                      </div>
                    </div>
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
                          Değiştiriliyor...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-key me-2"></i>
                          Şifreyi Değiştir
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-main"
                      onClick={() => setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      })}
                    >
                      <i className="fas fa-times me-2"></i>
                      Temizle
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;