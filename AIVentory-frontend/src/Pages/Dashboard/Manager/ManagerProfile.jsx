import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import axios from 'axios';

const ManagerProfile = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    avatar: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({});

  
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const userData = response.data.data;
        setProfileData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          avatar: userData.avatar
        });
      }
    } catch (error) {
      console.error('Kullanıcı verileri alınamadı:', error);
    }
  };

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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    
    if (file.size > 2 * 1024 * 1024) {
      alert('Dosya boyutu 2MB\'dan küçük olmalıdır.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Sadece resim dosyaları yüklenebilir.');
      return;
    }

    setAvatarUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/users/${user.id}/avatar`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setProfileData(prev => ({
          ...prev,
          avatar: response.data.data.avatarPath
        }));
        alert('Profil fotoğrafı başarıyla güncellendi!');
      }
    } catch (error) {
      console.error('Avatar yükleme hatası:', error);
      alert('Profil fotoğrafı yüklenirken bir hata oluştu.');
    } finally {
      setAvatarUploading(false);
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
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/users/${user.id}`, {
        FirstName: profileData.firstName,
        LastName: profileData.lastName,
        Phone: profileData.phone
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert('Profil bilgileri başarıyla güncellendi!');
        
        
        const updatedUser = JSON.parse(localStorage.getItem('user'));
        updatedUser.firstName = profileData.firstName;
        updatedUser.lastName = profileData.lastName;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      alert('Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.');
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
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/users/${user.id}/change-password`, {
        CurrentPassword: passwordData.currentPassword,
        NewPassword: passwordData.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert('Şifre başarıyla değiştirildi!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Şifre değiştirilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
      }
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

  const getAvatarUrl = (avatarPath) => {
    if (avatarPath) {
      return `http://localhost:5000/uploads/avatars/${avatarPath}`;
    }
    return null;
  };

  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-main mb-2">  
          <i className="fas fa-user-circle me-2" style={{ fontSize: '40px' }}>
        </i>Profil Ayarları</h1>
        <p className="text-gray mb-0">Hesap bilgilerinizi görüntüleyin ve güncelleyin</p>
      </div>

      <div className="row" style={{ gap: '24px' }}>
        {/* Profile Summary */}
        <div className="col-lg-4" style={{ minWidth: '350px' }}>
          <div className="dashboard-card" style={{ marginBottom: '24px' }}>
            <div className="card-body text-center" style={{ padding: '32px 24px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {profileData.avatar ? (
                  <img 
                    src={getAvatarUrl(profileData.avatar)} 
                    alt="Profile" 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '4px solid var(--main-color)'
                    }}
                  />
                ) : (
                  <div className={`user-avatar ${user?.role}`} style={{ 
                    width: '100px', 
                    height: '100px', 
                    fontSize: '32px',
                    border: '4px solid var(--main-color)'
                  }}>
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </div>
                )}
                
                <label 
                  htmlFor="avatar-upload" 
                  style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    background: 'var(--main-color)',
                    color: 'white',
                    border: '2px solid white',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: avatarUploading ? 'not-allowed' : 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {avatarUploading ? (
                    <div className="loading-spinner" style={{ width: '12px', height: '12px' }}></div>
                  ) : (
                    <i className="fas fa-camera"></i>
                  )}
                </label>
                
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                  style={{ display: 'none' }}
                />
              </div>
              
              <h4 className="text-dark fw-bold mb-1 mt-3">
                {profileData.firstName} {profileData.lastName}
              </h4>
              <p className="text-gray mb-3">{profileData.email}</p>
              <span className={`badge ${getRoleBadge(user?.role)}`}>
                {getRoleText(user?.role)}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card">
            <div className="card-header" style={{ padding: '20px 24px' }}>
              <h5 className="card-title">
                <i className="fas fa-chart-line me-2"></i>
                Hesap İstatistikleri
              </h5>
            </div>
            <div className="card-body" style={{ padding: '24px' }}>
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
        <div className="col-lg-8" style={{ flex: '1' }}>
          {/* Tab Navigation */}
          <div className="dashboard-card">
            <div className="card-header" style={{ padding: '20px 24px' }}>
              <div className="nav nav-tabs" role="tablist">
                <button
                  className={`btn ${activeTab === 'profile' ? 'btn-main' : 'btn-outline'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="fas fa-user me-2"></i>
                  Profil Bilgileri
                </button>
                <button
                  className={`btn ${activeTab === 'password' ? 'btn-main' : 'btn-outline'}`}
                  onClick={() => setActiveTab('password')}
                >
                  <i className="fas fa-lock me-2"></i>
                  Şifre Değiştir
                </button>
              </div>
            </div>

            <div className="card-body" style={{ padding: '32px' }}>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit}>
                  <div className="row" style={{ marginBottom: '20px' }}>
                    <div className="col-md-6" style={{ paddingRight: '16px' }}>
                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label" style={{ marginBottom: '8px', fontWeight: '500' }}>Ad *</label>
                        <input
                          type="text"
                          name="firstName"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          placeholder="Adınız"
                          style={{ padding: '12px', borderRadius: '8px' }}
                        />
                        {errors.firstName && (
                          <div className="invalid-feedback">{errors.firstName}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6" style={{ paddingLeft: '16px' }}>
                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label" style={{ marginBottom: '8px', fontWeight: '500' }}>Soyad *</label>
                        <input
                          type="text"
                          name="lastName"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          placeholder="Soyadınız"
                          style={{ padding: '12px', borderRadius: '8px' }}
                        />
                        {errors.lastName && (
                          <div className="invalid-feedback">{errors.lastName}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label" style={{ marginBottom: '8px', fontWeight: '500' }}>E-posta Adresi *</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="email@example.com"
                      disabled={true}
                      style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f8f9fa' }}
                    />
                    <small className="text-muted">E-posta adresi değiştirilemez.</small>
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: '32px' }}>
                    <label className="form-label" style={{ marginBottom: '8px', fontWeight: '500' }}>Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="+90 555 123 4567"
                      style={{ padding: '12px', borderRadius: '8px' }}
                    />
                  </div>

                  <div className="d-flex gap-3">
                    <button
                      type="submit"
                      className="btn btn-main"
                      disabled={loading}
                      style={{ padding: '12px 24px' }}
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
                    <button 
                      type="button" 
                      className="btn btn-outline-main"
                      onClick={fetchUserData}
                      style={{ padding: '12px 24px' }}
                    >
                      <i className="fas fa-undo me-2"></i>
                      Sıfırla
                    </button>
                  </div>
                </form>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="alert alert-info" style={{ padding: '16px', marginBottom: '24px', borderRadius: '8px' }}>
                    <i className="fas fa-info-circle alert-icon"></i>
                    <div>
                      Güvenliğiniz için düzenli olarak şifrenizi değiştirin. Yeni şifreniz en az 6 karakter olmalıdır.
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label" style={{ marginBottom: '8px', fontWeight: '500' }}>Mevcut Şifre *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.currentPassword ? "text" : "password"}
                        name="currentPassword"
                        className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Mevcut şifreniz"
                        style={{ padding: '12px', paddingRight: '45px', borderRadius: '8px' }}
                      />
                      <i 
                        className={`fas ${showPasswords.currentPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                        onClick={() => togglePasswordVisibility('currentPassword')}
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
                    {errors.currentPassword && (
                      <div className="invalid-feedback">{errors.currentPassword}</div>
                    )}
                  </div>

                  <div className="row" style={{ marginBottom: '32px' }}>
                    <div className="col-md-6" style={{ paddingRight: '16px' }}>
                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label" style={{ marginBottom: '8px', fontWeight: '500' }}>Yeni Şifre *</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPasswords.newPassword ? "text" : "password"}
                            name="newPassword"
                            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Yeni şifreniz"
                            style={{ padding: '12px', paddingRight: '45px', borderRadius: '8px' }}
                          />
                          <i 
                            className={`fas ${showPasswords.newPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                            onClick={() => togglePasswordVisibility('newPassword')}
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
                        {errors.newPassword && (
                          <div className="invalid-feedback">{errors.newPassword}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6" style={{ paddingLeft: '16px' }}>
                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label" style={{ marginBottom: '8px', fontWeight: '500' }}>Yeni Şifre Tekrar *</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPasswords.confirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Yeni şifre tekrar"
                            style={{ padding: '12px', paddingRight: '45px', borderRadius: '8px' }}
                          />
                          <i 
                            className={`fas ${showPasswords.confirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                            onClick={() => togglePasswordVisibility('confirmPassword')}
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
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-3">
                    <button
                      type="submit"
                      className="btn btn-main"
                      disabled={loading}
                      style={{ padding: '12px 24px' }}
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
                      onClick={() => {
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setErrors({});
                      }}
                      style={{ padding: '12px 24px' }}
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