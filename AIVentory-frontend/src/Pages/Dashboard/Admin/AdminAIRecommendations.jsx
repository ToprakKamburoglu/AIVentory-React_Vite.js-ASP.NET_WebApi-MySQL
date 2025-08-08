import React, { useState, useEffect } from 'react';

const AdminAIRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({
    priority: 'all',
    type: 'all',
    status: 'all'
  });

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setRecommendations([
        {
          id: 1,
          type: 'stock',
          priority: 'high',
          title: 'iPhone 15 Pro Stok Uyarısı',
          description: 'iPhone 15 Pro stokunuz kritik seviyeye düştü. Talep analizine göre 2 hafta içinde tükenebilir.',
          action: 'Acil tedarik yapın',
          impact: 'Yüksek',
          confidence: 94.2,
          estimatedRevenueLoss: 125000,
          recommendedAction: {
            type: 'order',
            quantity: 35,
            supplier: 'Apple Türkiye',
            estimatedCost: 2275000
          },
          insights: [
            'Son 30 günde günlük ortalama 3.2 adet satıldı',
            'Mevcut stok: 8 adet',
            'Minimum stok seviyesi: 15 adet',
            'Lead time: 7-10 gün'
          ],
          createdAt: '2024-01-15 10:30',
          status: 'active'
        },
        {
          id: 2,
          type: 'pricing',
          priority: 'medium',
          title: 'Samsung Galaxy S24 Fiyat Optimizasyonu',
          description: 'Pazar analizine göre Samsung Galaxy S24 fiyatınız rekabetten %8 yüksek.',
          action: 'Fiyat ayarlaması öneriliyor',
          impact: 'Orta',
          confidence: 87.6,
          currentPrice: 35000,
          recommendedPrice: 32500,
          estimatedSalesIncrease: '+23%',
          insights: [
            'Rakip ortalama fiyat: ₺32.200',
            'Fiyat esnekliği: Yüksek',
            'Kategori talebi: Artan',
            'Stok devir hızı artabilir'
          ],
          createdAt: '2024-01-15 09:15',
          status: 'active'
        },
        {
          id: 3,
          type: 'marketing',
          priority: 'medium',
          title: 'Kış Koleksiyonu Pazarlama Fırsatı',
          description: 'Kış ürünlerinde talep artışı bekleniyor. Pazarlama kampanyası için uygun zaman.',
          action: 'Pazarlama kampanyası başlatın',
          impact: 'Orta',
          confidence: 82.3,
          targetProducts: ['Mont', 'Bot', 'Atkı', 'Eldiven'],
          expectedROI: '340%',
          budgetSuggestion: 15000,
          insights: [
            'Hava durumu tahminleri soğuk geçeceğini gösteriyor',
            'Geçen yıl bu dönemde %45 artış yaşandı',
            'Sosyal medya trendleri kış ürünlerini destekliyor',
            'Stok seviyeleri kampanya için yeterli'
          ],
          createdAt: '2024-01-15 08:45',
          status: 'pending'
        },
        {
          id: 4,
          type: 'product',
          priority: 'low',
          title: 'Yeni Ürün Önerisi: Wireless Şarj Aleti',
          description: 'Müşteri arama trendlerine göre wireless şarj aletlerine yüksek talep var.',
          action: 'Ürün kataloğuna ekleyin',
          impact: 'Düşük',
          confidence: 79.8,
          marketDemand: 'Yüksek',
          competitorCount: 12,
          estimatedMargin: '45%',
          insights: [
            'Aylık arama hacmi: 2.400',
            'Rekabet seviyesi: Orta',
            'Profit marjı potansiyeli: Yüksek',
            'Mevcut ürünlerle uyumlu'
          ],
          createdAt: '2024-01-14 16:20',
          status: 'reviewed'
        },
        {
          id: 5,
          type: 'customer',
          priority: 'high',
          title: 'Müşteri Segmentasyonu Fırsatı',
          description: 'Premium müşteri segmentiniz büyüyor. Özel hizmet paketi sunabilirsiniz.',
          action: 'VIP müşteri programı oluşturun',
          impact: 'Yüksek',
          confidence: 91.5,
          targetSegment: 'Premium Alıcılar',
          segmentSize: 156,
          averageOrderValue: 3250,
          insights: [
            'Premium müşteriler son 3 ayda %28 arttı',
            'Ortalama sipariş değeri ₺3.250',
            'Müşteri sadakati: %87',
            'Cross-selling potansiyeli yüksek'
          ],
          createdAt: '2024-01-14 14:10',
          status: 'active'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'badge-danger';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-success';
      default:
        return 'badge-main';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Yüksek';
      case 'medium':
        return 'Orta';
      case 'low':
        return 'Düşük';
      default:
        return priority;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'stock':
        return 'fas fa-boxes text-danger';
      case 'pricing':
        return 'fas fa-tag text-warning';
      case 'marketing':
        return 'fas fa-bullhorn text-info';
      case 'product':
        return 'fas fa-plus-circle text-success';
      case 'customer':
        return 'fas fa-users text-main';
      default:
        return 'fas fa-lightbulb text-main';
    }
  };

  const getTypeText = (type) => {
    const types = {
      stock: 'Stok Yönetimi',
      pricing: 'Fiyatlandırma',
      marketing: 'Pazarlama',
      product: 'Ürün',
      customer: 'Müşteri'
    };
    return types[type] || type;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'reviewed':
        return 'badge-main';
      case 'implemented':
        return 'badge-info';
      default:
        return 'badge-main';
    }
  };

  const getStatusText = (status) => {
    const statuses = {
      active: 'Aktif',
      pending: 'Beklemede',
      reviewed: 'İncelendi',
      implemented: 'Uygulandı'
    };
    return statuses[status] || status;
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (activeCategory !== 'all' && rec.type !== activeCategory) return false;
    if (filters.priority !== 'all' && rec.priority !== filters.priority) return false;
    if (filters.status !== 'all' && rec.status !== filters.status) return false;
    return true;
  });

  const handleActionClick = (recommendation) => {
    alert(`${recommendation.action} eylemi için detaylar açılıyor...`);
  };

  const markAsImplemented = (id) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, status: 'implemented' } : rec
      )
    );
  };

  const dismissRecommendation = (id) => {
    if (window.confirm('Bu öneriyi kaldırmak istediğinizden emin misiniz?')) {
      setRecommendations(prev => prev.filter(rec => rec.id !== id));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-overlay">
          <div className="loading-spinner lg"></div>
          <p>AI önerileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-dark fw-bold mb-1">AI Önerileri</h1>
        <p className="text-gray mb-0">Yapay zeka destekli akıllı iş önerilerini görüntüleyin</p>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Aktif Öneri</span>
              <div className="stat-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
            </div>
            <div className="stat-value">{recommendations.filter(r => r.status === 'active').length}</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i>
              +3 bu hafta
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card danger">
            <div className="stat-header">
              <span className="stat-title">Yüksek Öncelik</span>
              <div className="stat-icon danger">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
            </div>
            <div className="stat-value">{recommendations.filter(r => r.priority === 'high').length}</div>
            <div className="stat-change negative">
              <i className="fas fa-arrow-up"></i>
              Dikkat gerekli
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card success">
            <div className="stat-header">
              <span className="stat-title">Uygulanan</span>
              <div className="stat-icon success">
                <i className="fas fa-check-circle"></i>
              </div>
            </div>
            <div className="stat-value">{recommendations.filter(r => r.status === 'implemented').length}</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i>
              %85 başarı
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card warning">
            <div className="stat-header">
              <span className="stat-title">Ortalama Güven</span>
              <div className="stat-icon warning">
                <i className="fas fa-percentage"></i>
              </div>
            </div>
            <div className="stat-value">%{(recommendations.reduce((acc, r) => acc + r.confidence, 0) / recommendations.length).toFixed(1)}</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i>
              Yüksek güven
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Kategori</label>
              <select
                className="form-select"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                <option value="all">Tüm Kategoriler</option>
                <option value="stock">Stok Yönetimi</option>
                <option value="pricing">Fiyatlandırma</option>
                <option value="marketing">Pazarlama</option>
                <option value="product">Ürün</option>
                <option value="customer">Müşteri</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Öncelik</label>
              <select
                className="form-select"
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({...prev, priority: e.target.value}))}
              >
                <option value="all">Tüm Öncelikler</option>
                <option value="high">Yüksek</option>
                <option value="medium">Orta</option>
                <option value="low">Düşük</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Durum</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="pending">Beklemede</option>
                <option value="reviewed">İncelendi</option>
                <option value="implemented">Uygulandı</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button 
                className="btn btn-main w-100"
                onClick={loadRecommendations}
              >
                <i className="fas fa-sync me-2"></i>
                Yenile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="row">
        {filteredRecommendations.map((recommendation) => (
          <div key={recommendation.id} className="col-12 mb-4">
            <div className="ai-card">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center gap-3">
                  <i className={getTypeIcon(recommendation.type)}></i>
                  <div>
                    <h5 className="text-dark fw-bold mb-1">{recommendation.title}</h5>
                    <div className="d-flex gap-2 align-items-center">
                      <span className={`badge ${getPriorityBadge(recommendation.priority)}`}>
                        {getPriorityText(recommendation.priority)} Öncelik
                      </span>
                      <span className="badge badge-outline badge-main">
                        {getTypeText(recommendation.type)}
                      </span>
                      <span className={`badge ${getStatusBadge(recommendation.status)}`}>
                        {getStatusText(recommendation.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ai-confidence">
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${recommendation.confidence}%` }}
                    ></div>
                  </div>
                  <span className="confidence-text">%{recommendation.confidence}</span>
                </div>
              </div>

              <p className="text-gray mb-3">{recommendation.description}</p>

              <div className="row mb-3">
                <div className="col-md-8">
                  <div className="ai-recommendation">
                    <h6 className="text-dark fw-bold mb-2">
                      <i className="fas fa-brain me-2"></i>
                      AI Öngörüleri
                    </h6>
                    <ul className="mb-0">
                      {recommendation.insights.map((insight, index) => (
                        <li key={index} className="text-gray mb-1">{insight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="recommendation-metrics">
                    <div className="metric-item mb-2">
                      <span className="text-gray">Etki:</span>
                      <span className="text-dark fw-bold ms-2">{recommendation.impact}</span>
                    </div>
                    {recommendation.estimatedRevenueLoss && (
                      <div className="metric-item mb-2">
                        <span className="text-gray">Potansiyel Kayıp:</span>
                        <span className="text-danger fw-bold ms-2">
                          {formatCurrency(recommendation.estimatedRevenueLoss)}
                        </span>
                      </div>
                    )}
                    {recommendation.expectedROI && (
                      <div className="metric-item mb-2">
                        <span className="text-gray">Beklenen ROI:</span>
                        <span className="text-success fw-bold ms-2">{recommendation.expectedROI}</span>
                      </div>
                    )}
                    {recommendation.estimatedMargin && (
                      <div className="metric-item mb-2">
                        <span className="text-gray">Kar Marjı:</span>
                        <span className="text-success fw-bold ms-2">{recommendation.estimatedMargin}</span>
                      </div>
                    )}
                    <div className="metric-item">
                      <span className="text-gray">Oluşturulma:</span>
                      <span className="text-gray ms-2">
                        {formatDateTime(recommendation.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 mt-3">
                <button 
                  className="btn btn-main"
                  onClick={() => handleActionClick(recommendation)}
                >
                  <i className="fas fa-play me-2"></i>
                  {recommendation.action}
                </button>
                <button 
                  className="btn btn-outline-main"
                  onClick={() => markAsImplemented(recommendation.id)}
                  disabled={recommendation.status === 'implemented'}
                >
                  <i className="fas fa-check me-2"></i>
                  Uygulandı
                </button>
                <button 
                  className="btn btn-outline-main"
                  onClick={() => dismissRecommendation(recommendation.id)}
                >
                  <i className="fas fa-times me-2"></i>
                  Kaldır
                </button>
                <button className="btn btn-outline-main">
                  <i className="fas fa-share me-2"></i>
                  Paylaş
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="dashboard-card text-center py-5">
          <i className="fas fa-lightbulb text-gray mb-3" style={{ fontSize: '48px' }}></i>
          <h4 className="text-gray mb-3">Öneri Bulunamadı</h4>
          <p className="text-gray mb-4">
            Seçilen filtrelere uygun AI önerisi bulunmamaktadır.
          </p>
          <button 
            className="btn btn-main"
            onClick={() => {
              setActiveCategory('all');
              setFilters({ priority: 'all', type: 'all', status: 'all' });
            }}
          >
            <i className="fas fa-filter me-2"></i>
            Filtreleri Temizle
          </button>
        </div>
      )}

      {/* AI Settings Panel */}
      <div className="dashboard-card mt-4">
        <div className="card-header">
          <h5 className="card-title">
            <i className="fas fa-cog me-2"></i>
            AI Öneri Ayarları
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Öneri Sıklığı</label>
                <select className="form-select">
                  <option value="daily">Günlük</option>
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Minimum Güven Seviyesi</label>
                <select className="form-select">
                  <option value="70">%70</option>
                  <option value="80">%80</option>
                  <option value="90">%90</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Aktif Öneri Kategorileri</label>
            <div className="row">
              <div className="col-md-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked id="stock-rec" />
                  <label className="form-check-label" htmlFor="stock-rec">
                    Stok Yönetimi Önerileri
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked id="pricing-rec" />
                  <label className="form-check-label" htmlFor="pricing-rec">
                    Fiyatlandırma Önerileri
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked id="marketing-rec" />
                  <label className="form-check-label" htmlFor="marketing-rec">
                    Pazarlama Önerileri
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked id="product-rec" />
                  <label className="form-check-label" htmlFor="product-rec">
                    Ürün Önerileri
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked id="customer-rec" />
                  <label className="form-check-label" htmlFor="customer-rec">
                    Müşteri Önerileri
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="finance-rec" />
                  <label className="form-check-label" htmlFor="finance-rec">
                    Finansal Önerileri
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-main">
              <i className="fas fa-save me-2"></i>
              Ayarları Kaydet
            </button>
            <button className="btn btn-outline-main">
              <i className="fas fa-undo me-2"></i>
              Varsayılana Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAIRecommendations;