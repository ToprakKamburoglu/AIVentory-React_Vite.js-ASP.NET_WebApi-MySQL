/* eslint-disable no-unused-vars */
import React, { useState } from 'react';


const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    subject: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      
      setTimeout(() => {
        setSubmitStatus('success');
        setIsSubmitting(false);
        setFormData({
          firstName: '',
          lastName: '', 
          email: '',
          phone: '',
          company: '',
          message: '',
          subject: 'general'
        });
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <section className="bg-light-custom py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center pt-5 mb-4">
              <h1 className="display-4 fw-bold text-dark pt-5 mb-4">
                Bizimle <span className="text-main">İletişime</span> Geçin
              </h1>
              <p className="lead text-third">
                Sorularınız mı var? Demo mu istiyorsunuz? 
                Size yardımcı olmaktan mutluluk duyarız.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="form-container">
                <h3 className="fw-bold text-dark mb-4">Mesaj Gönderin</h3>
                
                {submitStatus === 'success' && (
                  <div className="alert alert-success-custom mb-4">
                    <i className="fas fa-check-circle me-2"></i>
                    Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="alert alert-error-custom mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Bir hata oluştu. Lütfen tekrar deneyiniz.
                  </div>
                )}

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
                  
                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
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
                    <div className="col-md-6">
                      <label className="form-label">Telefon</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={{borderRadius: '8px', padding: '12px'}}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Şirket</label>
                    <input
                      type="text"
                      className="form-control"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      style={{borderRadius: '8px', padding: '12px'}}
                    />
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Konu</label>
                    <select
                      className="form-control"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      style={{borderRadius: '8px', padding: '12px'}}
                    >
                      <option value="general">Genel Bilgi</option>
                      <option value="demo">Demo Talebi</option>
                      <option value="support">Teknik Destek</option>
                      <option value="sales">Satış</option>
                      <option value="partnership">İş Ortaklığı</option>
                    </select>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Mesajınız</label>
                    <textarea
                      className="form-control"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      style={{borderRadius: '8px', padding: '12px'}}
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="btn btn-main"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="loading-spinner me-2"></div>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Gönder
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="contact-info">
                <h5 className="fw-bold text-dark mb-4">İletişim Bilgileri</h5>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">E-posta</div>
                    <div className="text-third">info@aiventory.com</div>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Çalışma Saatleri</div>
                    <div className="text-third">
                      Pazartesi - Cuma: 08:00 - 20:00
                    </div>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Konum</div>
                    <div className="text-third">
                      Bağdat Cd. No:85, Kadıköy
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="contact-info mt-4">
                <h5 className="fw-bold text-dark mb-4">Hızlı İletişim</h5>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="d-flex flex-column">
                    <div className="fw-bold text-dark">Telefon</div>
                    <a
                      href="tel:+902125550123"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none text-third"
                    >
                      +90 (212) 555 01 23
                    </a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fa-brands fa-linkedin"></i>
                  </div>
                  <div className="d-flex flex-column">
                    <div className="fw-bold text-dark">LinkedIn</div>
                    <a
                      href="https://linkedin.com/company/AIVentory"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none text-third"
                    >
                      AIVentory
                    </a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div className="d-flex flex-column">
                    <div className="fw-bold text-dark">WhatsApp</div>
                    <a
                      href="https://wa.me/905551112233"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none text-third"
                    >
                      +90 (555) 111 22 33
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
    </div>
  );
};

export default Contact;