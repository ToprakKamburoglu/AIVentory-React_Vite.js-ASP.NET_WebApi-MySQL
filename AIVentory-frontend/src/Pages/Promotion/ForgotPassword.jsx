import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-vh-100 d-flex align-items-center bg-light-custom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="form-container text-center">
                <div className="mb-4">
                  <div 
                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'var(--secondary-color)',
                      color: 'white',
                      fontSize: '2rem'
                    }}
                  >
                    <i className="fas fa-check"></i>
                  </div>
                  <h3 className="fw-bold text-dark">E-posta Gönderildi!</h3>
                  <p className="text-third">
                    Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi.
                  </p>
                </div>
                <Link to="/login" className="btn btn-main">
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Giriş Sayfasına Dön
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <h2 className="fw-bold text-dark">Şifremi Unuttum</h2>
                <p className="text-third">
                  E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">E-posta Adresi</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{borderRadius: '8px', padding: '12px'}}
                    placeholder="ornek@email.com"
                  />
                </div>

                <div className="d-grid mb-4">
                  <button
                    type="submit"
                    className="btn btn-main"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner me-2"></div>
                         <i className="fas fa-paper-plane me-2"></i>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Sıfırlama Bağlantısı Gönder
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <Link to="/login" className="text-main text-decoration-none">
                    <i className="fas fa-arrow-left me-2"></i>
                    Giriş sayfasına dön
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

export default ForgotPassword;