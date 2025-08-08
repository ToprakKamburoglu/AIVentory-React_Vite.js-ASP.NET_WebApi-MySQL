import { useState } from 'react';
import { Link } from 'react-router-dom';


const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Küçük işletmeler için",
      monthlyPrice: 299,
      annualPrice: 2390, 
      features: [
        "1 Mağaza",
        "1000 Ürüne kadar",
        "Temel AI analizi", 
        "3 Kullanıcı",
        "Email destek",
        "Mobil uygulama",
        "Temel raporlar"
      ],
      popular: false,
      color: "border-secondary"
    },
    {
      name: "Professional", 
      description: "Büyüyen işletmeler için",
      monthlyPrice: 599,
      annualPrice: 4792, 
      features: [
        "3 Mağaza",
        "5000 Ürüne kadar", 
        "Gelişmiş AI (fiyat tahmini)",
        "10 Kullanıcı",
        "Telefon + Email destek",
        "Gelişmiş raporlar",
        "API erişimi",
        "Tedarikçi yönetimi"
      ],
      popular: true,
      color: "border-primary"
    },
    {
      name: "Enterprise",
      description: "Büyük şirketler için", 
      monthlyPrice: 1299,
      annualPrice: 10392, 
      features: [
        "Sınırsız mağaza",
        "Sınırsız ürün",
        "Tüm AI özellikleri",
        "Sınırsız kullanıcı", 
        "7/24 öncelikli destek",
        "Özel entegrasyonlar",
        "Dedicated hesap yöneticisi",
        "Özel eğitim"
      ],
      popular: false,
      color: "border-warning"
    }
  ];

  const getPrice = (plan) => {
    return isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const annualCost = plan.annualPrice;
    return monthlyCost - annualCost;
  };

  return (
    <div>
      {/* Header Section */}
      <section className="bg-bg py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center pt-5">
              <h1 className="display-4 fw-bold text-dark pt-5 mb-4">
                Basit ve <span className="text-main">Şeffaf</span> Fiyatlandırma
              </h1>
              <p className="lead text-third mb-4">
                İşletmenizin boyutuna uygun planı seçin. İstediğiniz zaman değiştirebilirsiniz.
              </p>
              
              {/* Annual/Monthly Toggle */}
              <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
                <span className={`fw-bold ${!isAnnual ? 'text-main' : 'text-third'}`}>
                  Aylık
                </span>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={isAnnual}
                    onChange={(e) => setIsAnnual(e.target.checked)}
                    style={{transform: 'scale(1.5)'}}
                  />
                </div>
                <span className={`fw-bold ${isAnnual ? 'text-main' : 'text-third'}`}>
                  Yıllık
                </span>
                {isAnnual && (
                  <span className="badge bg-secondary">2 ay bedava!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row g-4">
            {plans.map((plan, index) => (
              <div key={index} className="col-lg-4">
                <div className={`pricing-card ${plan.popular ? 'featured' : ''}`}>
                  {plan.popular && (
                    <div className="price-badge">En Popüler</div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h4 className="fw-bold text-dark">{plan.name}</h4>
                    <p className="text-third">{plan.description}</p>
                    
                    <div className="mt-3">
                      <span className="display-4 fw-bold text-main">
                        ₺{getPrice(plan).toLocaleString('tr-TR')}
                      </span>
                      <span className="text-third">/ay</span>
                    </div>
                    
                    {isAnnual && (
                      <div className="mt-2">
                        <small className="text-secondary">
                          Yıllık ₺{getSavings(plan).toLocaleString('tr-TR')} tasarruf
                        </small>
                      </div>
                    )}
                  </div>

                  <ul className="list-unstyled mb-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="mb-3">
                        <i className="fas fa-check text-secondary me-2"></i>
                        <span className="text-third">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-center">
                    <Link 
                      to="/register" 
                      className={`btn w-100 ${plan.popular ? 'btn-main' : 'btn-main'}`}
                    >
                      <i className="fas fa-rocket me-2"></i>
                      14 Gün Ücretsiz Dene
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-bg py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold text-center text-dark mb-5">
                Sıkça Sorulan <span className="text-main">Sorular</span>
              </h2>
              
              <div className="accordion" id="pricingFAQ">
                <div className="accordion-item mb-3" style={{border: 'none', borderRadius: '12px'}}>
                  <h2 className="accordion-header">
                    <button className="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      Ücretsiz deneme süresi nasıl çalışır?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#pricingFAQ">
                    <div className="accordion-body text-third">
                      14 gün boyunca tüm özellikleri ücretsiz kullanabilirsiniz. Kredi kartı bilgisi gerekmez. 
                      Deneme süresi sonunda istediğiniz planı seçebilir veya hesabınızı iptal edebilirsiniz.
                    </div>
                  </div>
                </div>

                <div className="accordion-item mb-3" style={{border: 'none', borderRadius: '12px'}}>
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      Planımı istediğim zaman değiştirebilir miyim?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#pricingFAQ">
                    <div className="accordion-body text-third">
                      Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. 
                      Değişiklik anında geçerli olur ve ödeme pro-rata olarak hesaplanır.
                    </div>
                  </div>
                </div>

                <div className="accordion-item mb-3" style={{border: 'none', borderRadius: '12px'}}>
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      Verilerim güvende mi?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#pricingFAQ">
                    <div className="accordion-body text-third">
                      Verileriniz 256-bit SSL şifreleme ile korunur. GDPR uyumlu veri işleme politikamız vardır. 
                      Günlük otomatik yedekleme ile verileriniz her zaman güvende.
                    </div>
                  </div>
                </div>

                <div className="accordion-item mb-3" style={{border: 'none', borderRadius: '12px'}}>
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                      Özel entegrasyon gereksinimlerim var, yardım alabilir miyim?
                    </button>
                  </h2>
                  <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#pricingFAQ">
                    <div className="accordion-body text-third">
                      Enterprise planında özel entegrasyonlar mevcuttur. 
                      Mevcut sistemlerinizle entegrasyon için teknik ekibimiz size destek verir.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stats-section-pricing bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold text-dark mb-4">
                Hemen 
                <span className="text-main"> Başlayın!</span>
              </h2>
              <p className="lead opacity-75 mb-4">
                Hangi plan olursa olsun, 14 gün ücretsiz deneme hakkınız var.
              </p>
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Link to="/register" className="btn btn-main">
                  <i className="fas fa-rocket me-2"></i>
                  Ücretsiz Başla
                </Link>
                <Link to="/contact" className="btn btn-main">
                  <i className="fas fa-phone me-2"></i>
                  Demo Talep Et
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;