import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "AI Destekli Ürün Tanıma",
      description: "Ürün fotoğrafını çekin, AI otomatik olarak ürün adı, kategori, marka ve model bilgilerini tanısın",
      icon: "fas fa-robot",
      benefits: [
        "15 dakikalık manuel giriş → 2 dakikada tamamla",
        "%95 doğruluk oranı ile hatasız kayıt",
        "Barkod olmayan ürünler için ideal",
        "Çok dilli ürün tanıma desteği"
      ]
    },
    {
      title: "Akıllı Renk Analizi",
      description: "RGB renk kodları ile otomatik renk tespit ve sınıflandırma yaparak renk bazlı arama imkanı",
      icon: "fas fa-palette",
      benefits: [
        "Otomatik RGB renk kodu çıkarımı",
        "Renk bazlı filtreleme ve arama",
        "Benzer renkteki ürünleri gruplandırma",
        "Müşteri sorguları için hızlı sonuç"
      ]
    },
    {
      title: "Stok Tahmin Sistemi",
      description: "Geçmiş satış verilerini analiz ederek gelecekteki stok ihtiyaçlarını önceden tahmin eder",
      icon: "fas fa-chart-line",
      benefits: [
        "3-30 gün arası stok tahmini",
        "Sezonlık trend analizi",
        "Otomatik sipariş önerileri",
        "Stok tükenmesi uyarıları"
      ]
    },
    {
      title: "Fiyat Optimizasyonu",
      description: "Pazar analizi yaparak rekabetçi ve sürdürülebilir kârlı fiyat önerileri sunar",
      icon: "fas fa-tags",
      benefits: [
        "Rekabetçi fiyat analizi",
        "Kar marjı optimizasyonu",
        "Dinamik fiyat önerileri",
        "Trend bazlı fiyat ayarlaması"
      ]
    }
  ];

  return (
    <div>
      {/* Header Section */}
      <section className="bg-bg py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center pt-5 mb-4">
              <h1 className="display-5 fw-bold text-dark pt-5 mb-4">
                AIVentory <span className="text-main">Özellikleri</span>
              </h1>
              <p className="lead text-third">
                Yapay zeka teknolojisi ile stok yönetiminizi bir üst seviyeye taşıyın
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="nav flex-column nav-pills" role="tablist">
                {features.map((feature, index) => (
                  <button
                    key={index}
                    className={`nav-link text-start p-3 mb-3 ${activeFeature === index ? 'active' : ''}`}
                    onClick={() => setActiveFeature(index)}
                    style={{
                      border: activeFeature === index ? '2px solid var(--main-color)' : '1px solid var(--border-color)',
                      borderRadius: '12px',
                      background: activeFeature === index ? 'var(--main-color)' : 'white'
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div className={`me-3 ${activeFeature === index ? 'text-white' : 'text-main'}`}>
                        <i className={feature.icon} style={{fontSize: '1.5rem'}}></i>
                      </div>
                      <div>
                        <div className={`fw-bold ${activeFeature === index ? 'text-white' : 'text-dark'}`}>
                          {feature.title}
                        </div>
                        <small className={activeFeature === index ? 'text-white' : 'text-third'}>
                          {feature.description.substring(0, 120)}
                        </small>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="col-lg-8">
              <div className="feature-card">
                <div className="d-flex align-items-center mb-4">
                  <div className="feature-icon me-4">
                    <i className={features[activeFeature].icon}></i>
                  </div>
                  <div>
                    <h3 className="fw-bold text-dark mb-2">
                      {features[activeFeature].title}
                    </h3>
                    <p className="text-third mb-0">
                      {features[activeFeature].description}
                    </p>
                  </div>
                </div>
                
                <h5 className="fw-bold text-dark mb-3">Faydalar:</h5>
                <div className="row">
                  {features[activeFeature].benefits.map((benefit, index) => (
                    <div key={index} className="col-md-6 mb-3">
                      <div className="d-flex align-items-start">
                        <div className="text-secondary me-2">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <span className="text-third">{benefit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Link to="/register" className="btn btn-main me-2">
                    <i className="fas fa-rocket me-2"></i>
                    Hemen Başla
                  </Link>
                  <Link to="/contact" className="btn btn-main">
                    <i className="fas fa-phone me-2"></i>
                    Demo Talep Et
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-bg py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center mb-5">
              <h2 className="display-5 fw-bold text-dark mb-4">
                Nasıl <span className="text-main">Çalışır?</span>
              </h2>
              <p className="lead text-third mb-4">
                AIVentory ile Tanışmanın En Kolay Yolu: 3 Adımda Keşfedin!
              </p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
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
                    1
                  </div>
                </div>
                <h5 className="fw-bold text-dark">Fotoğraf Çek</h5>
                <p className="text-third">
                  Telefonunuzla ürünün fotoğrafını çekin; temiz, net ve anlaşılır bir çekim yapmanız yeterlidir.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
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
                    2
                  </div>
                </div>
                <h5 className="fw-bold text-dark">AI Analiz Etsin</h5>
                <p className="text-third">
                  Yapay zeka, yalnızca 3 saniye içinde ürünü tanır, ilgili kategori ve renk bilgilerini otomatik olarak çıkarır.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
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
                    3
                  </div>
                </div>
                <h5 className="fw-bold text-dark">Kaydet ve Yönet</h5>
                <p className="text-third">
                  Sadece ürünün fiyatını ve stok miktarını girin, sistem bu bilgileri otomatik olarak algılar ve kaydeder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center mb-5">
              <h2 className="display-5 fw-bold text-dark">
                 Teknik <span className="text-main">Özellikler</span>
              </h2>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="feature-card">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="fas fa-brain text-main me-2"></i>
                  AI Teknolojileri
                </h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fas fa-check text-secondary me-2"></i>
                    YOLO v8 Object Detection
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-secondary me-2"></i>
                    OpenCV Renk Analizi
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-secondary me-2"></i>
                    TensorFlow Machine Learning
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-secondary me-2"></i>
                    Natural Language Processing
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="feature-card">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="fas fa-shield-alt text-main me-2"></i>
                  Güvenlik & Performans
                </h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fas fa-check text-secondary me-2"></i>
                    256-bit SSL Şifreleme
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-secondary me-2"></i>
                    GDPR Uyumlu Veri Koruma
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-secondary me-2"></i>
                    99.9% Uptime Garantisi
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-secondary me-2"></i>
                    Otomatik Yedekleme
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bg stats-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center py-5">
              <h2 className="display-5 fw-bold text-dark mb-4">
                AIVentory ile <span className="text-main">Farkı Yaşayın</span>
              </h2>
              <p className="lead text-third">
                14 gün ücretsiz deneyin. Kredi kartı gerekmez.
              </p>
              <Link to="/register" className="btn btn-main">
                <i className="fas fa-rocket me-2"></i>
                Hemen Başla
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;