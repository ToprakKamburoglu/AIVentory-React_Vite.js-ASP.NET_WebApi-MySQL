import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const ChangePassword = ({ onClose, showAsModal = true }) => {
  const { changePassword, user, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

 
  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Mevcut şifre gereklidir';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Yeni şifre gereklidir';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Yeni şifre en az 6 karakter olmalıdır';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Şifre en az 1 küçük harf, 1 büyük harf ve 1 rakam içermelidir';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'Yeni şifre mevcut şifreden farklı olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    
    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      
      if (result.success) {
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
      
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 2000);
      } else {
        setErrors({
          submit: result.error || 'Şifre değiştirme işlemi başarısız oldu'
        });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrors({
        submit: 'Bir hata oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

 
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    let text = '';
    let color = '';

    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z\d]/.test(password)) strength += 1;

    if (strength < 3) {
      text = 'Zayıf';
      color = 'danger';
    } else if (strength < 5) {
      text = 'Orta';
      color = 'warning';
    } else {
      text = 'Güçlü';
      color = 'success';
    }

    return { strength: (strength / 6) * 100, text, color };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);


  const content = (
    <div className={showAsModal ? 'modal-content' : 'dashboard-card'}>
      {showAsModal && (
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fas fa-key text-main"></i>
            Şifre Değiştir
          </h3>
          <button 
            type="button" 
            className="modal-close"
            onClick={onClose}
            disabled={submitLoading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className={showAsModal ? 'modal-body' : 'card-body'}>
        {!showAsModal && (
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-key text-main"></i>
              Şifre Değiştir
            </h3>
            <p className="card-subtitle">
              Güvenliğiniz için güçlü bir şifre seçin
            </p>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle alert-icon"></i>
            Şifreniz başarıyla değiştirildi!
          </div>
        )}

        {errors.submit && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle alert-icon"></i>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kullanıcı Bilgisi */}
          <div className="user-info-card bg-light-custom p-3 rounded">
            <div className="d-flex align-items-center gap-3">
              <div className="user-avatar">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div>
                <div className="fw-bold text-dark-text">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-gray small">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Mevcut Şifre */}
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-lock text-gray me-2"></i>
              Mevcut Şifre
            </label>
            <div className="position-relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                placeholder="Mevcut şifrenizi girin"
                disabled={submitLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                onClick={() => togglePasswordVisibility('current')}
                disabled={submitLoading}
                style={{ border: 'none', background: 'none' }}
              >
                <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'} text-gray`}></i>
              </button>
            </div>
            {errors.currentPassword && (
              <div className="text-danger small mt-1">
                <i className="fas fa-exclamation-circle me-1"></i>
                {errors.currentPassword}
              </div>
            )}
          </div>

          {/* Yeni Şifre */}
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-key text-main me-2"></i>
              Yeni Şifre
            </label>
            <div className="position-relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                placeholder="Yeni şifrenizi girin"
                disabled={submitLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                onClick={() => togglePasswordVisibility('new')}
                disabled={submitLoading}
                style={{ border: 'none', background: 'none' }}
              >
                <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'} text-gray`}></i>
              </button>
            </div>
            
            {/* Şifre Gücü Göstergesi */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-gray">Şifre Gücü:</small>
                  <small className={`text-${passwordStrength.color} fw-bold`}>
                    {passwordStrength.text}
                  </small>
                </div>
                <div className="progress" style={{ height: '4px' }}>
                  <div 
                    className={`progress-bar bg-${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  ></div>
                </div>
              </div>
            )}

            {errors.newPassword && (
              <div className="text-danger small mt-1">
                <i className="fas fa-exclamation-circle me-1"></i>
                {errors.newPassword}
              </div>
            )}

            {/* Şifre Kuralları */}
            <div className="password-rules mt-2">
              <small className="text-gray">Şifre Kuralları:</small>
              <ul className="small text-gray mt-1" style={{ fontSize: '0.75rem' }}>
                <li className={formData.newPassword.length >= 6 ? 'text-success' : ''}>
                  En az 6 karakter
                </li>
                <li className={/[a-z]/.test(formData.newPassword) ? 'text-success' : ''}>
                  En az 1 küçük harf
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'text-success' : ''}>
                  En az 1 büyük harf
                </li>
                <li className={/\d/.test(formData.newPassword) ? 'text-success' : ''}>
                  En az 1 rakam
                </li>
              </ul>
            </div>
          </div>

          {/* Şifre Tekrarı */}
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-check-circle text-secondary me-2"></i>
              Yeni Şifre (Tekrar)
            </label>
            <div className="position-relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Yeni şifrenizi tekrar girin"
                disabled={submitLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                onClick={() => togglePasswordVisibility('confirm')}
                disabled={submitLoading}
                style={{ border: 'none', background: 'none' }}
              >
                <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'} text-gray`}></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="text-danger small mt-1">
                <i className="fas fa-exclamation-circle me-1"></i>
                {errors.confirmPassword}
              </div>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <div className="text-success small mt-1">
                <i className="fas fa-check-circle me-1"></i>
                Şifreler eşleşiyor
              </div>
            )}
          </div>
        </form>
      </div>

      <div className={showAsModal ? 'modal-footer' : 'card-footer'}>
        <div className="d-flex gap-2 justify-content-end">
          {onClose && (
            <button
              type="button"
              className="btn btn-outline-main"
              onClick={onClose}
              disabled={submitLoading}
            >
              <i className="fas fa-times me-2"></i>
              İptal
            </button>
          )}
          <button
            type="submit"
            className="btn btn-main"
            onClick={handleSubmit}
            disabled={submitLoading || loading}
          >
            {submitLoading ? (
              <>
                <div className="loading-spinner me-2"></div>
                Değiştiriliyor...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Şifreyi Değiştir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (showAsModal) {
    return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {content}
      </div>
    );
  }

  return content;
};

export default ChangePassword;