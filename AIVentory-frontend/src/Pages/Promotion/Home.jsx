import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-99">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title fade-in-up">
                  AI Destekli
                  <br />
                  <span className="text-secondary">Stok Yönetimi</span>
                </h1>
                <p className="lead text-third mb-4 fade-in-up" style={{animationDelay: '0.2s'}}>
                  Ürününüzün fotoğrafını çekin, AI otomatik tanısın. 
                  Stok yönetiminizi yapay zeka ile kolaylaştırın.
                </p>
                <div className="d-flex gap-2 flex-wrap fade-in-up" style={{animationDelay: '0.4s'}}>
                  <Link to="/register" className="btn btn-main">
                    <i className="fas fa-rocket me-2"></i>
                    Hemen Başla
                  </Link>
                  <Link to="/features" className="btn btn-main">
                    <i className="fas fa-play me-2"></i>
                    Demo İzle
                  </Link>
                </div>
                <div className="row mt-5 fade-in-up" style={{animationDelay: '0.6s'}}>
                  <div className="col-auto">
                    <div className="d-flex align-items-center gap-2">
                      <div className="text-warning">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <small className="text-third">4.9/5 (200+ değerlendirme)</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center fade-in-up" style={{animationDelay: '0.8s'}}>
                <img 
                  src="/images/AIVentory LogoGradient.png" 
                  alt="AIVentory Demo" 
                  className="img-fluid"
                  style={{maxHeight: '500px'}}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Features Preview */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold text-dark mb-4">
                Neden <span className="text-main">AIVentory</span>?
              </h2>
              <p className="lead text-third pb-4">
                Geleneksel stok yönetimini AI teknolojisi ile birleştiren 
                ilk Türk çözümü
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon mx-auto">
                  <i className="fas fa-camera"></i>
                </div>
                <h5 className="fw-bold">Fotoğraf Çek, AI Tanısın</h5>
                <p className="text-third">
                  Ürün fotoğrafını çekmeniz yeterli. AI otomatik olarak 
                  ürün adı, kategori ve rengi tanır.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon mx-auto">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h5 className="fw-bold">Akıllı Tahminler</h5>
                <p className="text-third">
                  Geçmiş verileri analiz ederek stok tükenmeden önce 
                  uyarır ve sipariş önerisi verir.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon mx-auto">
                  <i className="fas fa-palette"></i>
                </div>
                <h5 className="fw-bold">Renk Analizi</h5>
                <p className="text-third">
                  RGB renk kodlarını otomatik çıkararak renk bazlı 
                  arama ve filtreleme imkanı sunar.
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <Link to="/features" className="btn btn-main">
              <i className="fas fa-arrow-right me-2"></i>
              Tüm Özellikleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bg stats-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h3 className="fw-bold text-dark">
                AIVentory ile stok yönetiminizi kolaylaştırın
              </h3>
              <p className="text-third mb-0">
                14 gün boyunca ücretsiz deneyin. Kredi kartı gerekmez.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <Link to="/register" className="btn btn-main">
                <i className="fas fa-user-plus me-2"></i>
                Ücretsiz Başla
              </Link>
            </div>
          </div>
        </div>
      </section>


          {/* Stats Section */}
          <section className="bg-light stats-section">
            <div className="container py-5">
              <div className="row">
                <div className="col-md-3 col-6 mb-4 feature-card-stat">
                  <div className="stat-item">
                     <div className="position-relative mb-4">
                  <div 
                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    <i className="fas fa-users"></i>
                  </div>
                </div>
                    <div className="hero-title fade-in-up">500+</div>
                    <div className="fw-bold text-dark mb-4 fade-in-up">Mutlu İşletme</div>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-4 feature-card-stat">
                  <div className="stat-item">
                     <div className="position-relative mb-4">
                  <div 
                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    <i className="fa-solid fa-calendar-days"></i>
                  </div>
                </div>
                    <div className="hero-title fade-in-up">%87</div>
                    <div className="fw-bold text-dark mb-4 fade-in-up">Zaman Tasarrufu</div>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-4 feature-card-stat">
                  <div className="stat-item">
                     <div className="position-relative mb-4">
                  <div 
                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    <i className="fa-solid fa-check"></i>
                  </div>
                </div>
                    <div className="hero-title fade-in-up">%95</div>
                    <div className="fw-bold text-dark mb-4 fade-in-up">Doğruluk Oranı</div>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-4 feature-card-stat">
                  <div className="stat-item">
                     <div className="position-relative mb-4">
                  <div 
                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    <i className="fa-solid fa-phone-volume"></i>
                  </div>
                </div>
                    <div className="hero-title fade-in-up">24/7</div>
                    <div className="fw-bold text-dark mb-4 fade-in-up">Müşteri Desteği</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </div>
  );
};

export default Home;