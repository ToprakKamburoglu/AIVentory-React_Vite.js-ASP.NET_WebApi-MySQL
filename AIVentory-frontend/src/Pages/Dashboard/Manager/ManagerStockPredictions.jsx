import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ManagerStockPredictions = () => {
  const [predictions] = useState([
    {
      id: 1,
      productName: 'iPhone 15 Pro',
      currentStock: 3,
      predictedStock: 0,
      daysToEmpty: 2,
      recommendedOrder: 15,
      confidence: 95,
      trend: 'decreasing',
      averageSales: 1.5,
      category: 'Telefon'
    },
    {
      id: 2,
      productName: 'Samsung Galaxy S24',
      currentStock: 12,
      predictedStock: 8,
      daysToEmpty: 15,
      recommendedOrder: 10,
      confidence: 87,
      trend: 'stable',
      averageSales: 0.8,
      category: 'Telefon'
    },
    {
      id: 3,
      productName: 'PowerBank 20000mAh',
      currentStock: 8,
      predictedStock: 15,
      daysToEmpty: -1,
      recommendedOrder: 25,
      confidence: 92,
      trend: 'increasing',
      averageSales: 2.3,
      category: 'Powerbank'
    },
    {
      id: 4,
      productName: 'AirPods Pro',
      currentStock: 0,
      predictedStock: 0,
      daysToEmpty: 0,
      recommendedOrder: 20,
      confidence: 98,
      trend: 'critical',
      averageSales: 3.2,
      category: 'Kulaklık'
    },
    {
      id: 5,
      productName: 'MacBook Air M2',
      currentStock: 1,
      predictedStock: 0,
      daysToEmpty: 3,
      recommendedOrder: 5,
      confidence: 89,
      trend: 'decreasing',
      averageSales: 0.3,
      category: 'Bilgisayar'
    }
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState('7');
  const [sortBy, setSortBy] = useState('priority');

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return 'fas fa-arrow-up text-success';
      case 'decreasing':
        return 'fas fa-arrow-down text-danger';
      case 'stable':
        return 'fas fa-minus text-warning';
      case 'critical':
        return 'fas fa-exclamation-triangle text-danger';
      default:
        return 'fas fa-question text-gray';
    }
  };

  const getTrendText = (trend) => {
    switch (trend) {
      case 'increasing':
        return 'Artış Trendi';
      case 'decreasing':
        return 'Azalış Trendi';
      case 'stable':
        return 'Stabil';
      case 'critical':
        return 'Kritik';
      default:
        return 'Bilinmiyor';
    }
  };

  const getPriorityLevel = (prediction) => {
    if (prediction.daysToEmpty <= 0) return { level: 'critical', text: 'Kritik', color: 'danger' };
    if (prediction.daysToEmpty <= 3) return { level: 'high', text: 'Yüksek', color: 'danger' };
    if (prediction.daysToEmpty <= 7) return { level: 'medium', text: 'Orta', color: 'warning' };
    return { level: 'low', text: 'Düşük', color: 'success' };
  };

  const sortedPredictions = [...predictions].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        return a.daysToEmpty - b.daysToEmpty;
      case 'confidence':
        return b.confidence - a.confidence;
      case 'name':
        return a.productName.localeCompare(b.productName);
      default:
        return 0;
    }
  });

  const getOverallStats = () => {
    const critical = predictions.filter(p => p.daysToEmpty <= 3).length;
    const needOrder = predictions.filter(p => p.recommendedOrder > 0).length;
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
    
    return { critical, needOrder, avgConfidence: Math.round(avgConfidence) };
  };

  const stats = getOverallStats();

  return (
    <div className="stock-predictions-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-main mb-2">
            <i className="fas fa-crystal-ball me-2"></i>
            Stok Tahminleri
          </h1>
          <p className="text-gray mb-0">
            AI destekli stok tahminleri ve sipariş önerileri
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/manager/stock" className="btn btn-outline-main">
            <i className="fas fa-warehouse me-2"></i>
            Stok Durumu
          </Link>
          <button className="btn btn-main">
            <i className="fas fa-sync-alt me-2"></i>
            Tahminleri Yenile
          </button>
        </div>
      </div>

      {/* AI Analysis Alert */}
      <div className="alert alert-info mb-4">
        <div className="d-flex align-items-center">
          <i className="fas fa-robot alert-icon"></i>
          <div className="flex-grow-1">
            <strong>AI Analizi Aktif</strong>
            <p className="mb-0">
              Tahminler, son 30 günlük satış verilerine ve mevsimsel trendlere dayanmaktadır. 
              Güvenilirlik oranı: <strong>%{stats.avgConfidence}</strong>
            </p>
          </div>
          <Link to="/manager/ai/recommendations" className="btn btn-outline-info">
            Detaylı Analiz
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-title">Kritik Ürünler</div>
            <div className="stat-icon danger">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="stat-value">{stats.critical}</div>
          <div className="stat-change negative">
            <i className="fas fa-clock"></i>
            3 gün içinde tükenecek
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-title">Sipariş Gerekli</div>
            <div className="stat-icon warning">
              <i className="fas fa-shopping-cart"></i>
            </div>
          </div>
          <div className="stat-value">{stats.needOrder}</div>
          <div className="stat-change neutral">
            <i className="fas fa-box"></i>
            Ürün çeşidi
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-title">Ortalama Güvenilirlik</div>
            <div className="stat-icon success">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="stat-value">%{stats.avgConfidence}</div>
          <div className="stat-change positive">
            <i className="fas fa-chart-line"></i>
            AI tahmin doğruluğu
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Toplam Ürün</div>
            <div className="stat-icon">
              <i className="fas fa-cubes"></i>
            </div>
          </div>
          <div className="stat-value">{predictions.length}</div>
          <div className="stat-change neutral">
            <i className="fas fa-eye"></i>
            İzlenen ürün
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="dashboard-card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4">
              <label className="form-label">Tahmin Periyodu</label>
              <select 
                className="form-control form-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="7">7 Günlük Tahmin</option>
                <option value="14">14 Günlük Tahmin</option>
                <option value="30">30 Günlük Tahmin</option>
                <option value="60">60 Günlük Tahmin</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Sıralama</label>
              <select 
                className="form-control form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="priority">Önceliğe Göre</option>
                <option value="confidence">Güvenilirliğe Göre</option>
                <option value="name">İsme Göre</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">İşlemler</label>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-main">
                  <i className="fas fa-download me-1"></i>
                  Rapor
                </button>
                <button className="btn btn-outline-main">
                  <i className="fas fa-cog me-1"></i>
                  Ayarlar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="table-container">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Mevcut Stok</th>
              <th>Tahmini Stok</th>
              <th>Tükenme Süresi</th>
              <th>Trend</th>
              <th>Önerilen Sipariş</th>
              <th>Güvenilirlik</th>
              <th>Öncelik</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {sortedPredictions.map(prediction => {
              const priority = getPriorityLevel(prediction);
              return (
                <tr key={prediction.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <i className="fas fa-box text-main"></i>
                      </div>
                      <div>
                        <div className="fw-bold">{prediction.productName}</div>
                        <small className="text-gray">{prediction.category}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="fw-bold">{prediction.currentStock}</span>
                  </td>
                  <td>
                    <span className={`fw-bold ${prediction.predictedStock < prediction.currentStock ? 'text-danger' : 'text-success'}`}>
                      {prediction.predictedStock}
                    </span>
                  </td>
                  <td>
                    {prediction.daysToEmpty <= 0 ? (
                      <span className="badge badge-danger">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Tükendi
                      </span>
                    ) : (
                      <span className={`fw-bold ${prediction.daysToEmpty <= 3 ? 'text-danger' : prediction.daysToEmpty <= 7 ? 'text-warning' : 'text-success'}`}>
                        {prediction.daysToEmpty} gün
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-outline`}>
                      <i className={`${getTrendIcon(prediction.trend)} me-1`}></i>
                      {getTrendText(prediction.trend)}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="fw-bold me-2">{prediction.recommendedOrder}</span>
                      <small className="text-gray">adet</small>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="confidence-bar me-2" style={{ width: '50px' }}>
                        <div 
                          className={`confidence-fill ${prediction.confidence >= 90 ? 'high' : prediction.confidence >= 70 ? 'medium' : 'low'}`}
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                      <span className="small fw-bold">%{prediction.confidence}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${priority.color}`}>
                      {priority.text}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-main" title="Sipariş Ver">
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-main" title="Detaylar">
                        <i className="fas fa-chart-line"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-main" title="Ayarlar">
                        <i className="fas fa-cog"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* AI Insights */}
      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-brain text-main me-2"></i>
                AI Öngörüleri ve Öneriler
              </h5>
            </div>
            <div className="card-body">
              <div className="ai-insights">
                <div className="insight-item mb-4 p-3 border rounded">
                  <div className="d-flex align-items-start">
                    <div className="insight-icon me-3">
                      <i className="fas fa-exclamation-triangle text-danger fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="text-danger mb-2">Kritik Durum</h6>
                      <p className="mb-2">
                        <strong>iPhone 15 Pro</strong> stoğu 2 gün içinde tükenecek. 
                        Günlük ortalama 1.5 adet satış yapılıyor.
                      </p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-danger">
                          <i className="fas fa-shopping-cart me-1"></i>
                          Acil Sipariş Ver (15 adet)
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-bell me-1"></i>
                          Müşteriyi Bilgilendir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="insight-item mb-4 p-3 border rounded">
                  <div className="d-flex align-items-start">
                    <div className="insight-icon me-3">
                      <i className="fas fa-chart-line text-success fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="text-success mb-2">Fırsat</h6>
                      <p className="mb-2">
                        <strong>PowerBank</strong> kategorisinde %35 artış trendi gözlemleniyor. 
                        Stok artırımı kar marjınızı yükseltebilir.
                      </p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-success">
                          <i className="fas fa-plus me-1"></i>
                          Stok Artır (25 adet)
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          <i className="fas fa-chart-bar me-1"></i>
                          Trend Analizi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="insight-item mb-4 p-3 border rounded">
                  <div className="d-flex align-items-start">
                    <div className="insight-icon me-3">
                      <i className="fas fa-snowflake text-info fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="text-info mb-2">Mevsimsel Trend</h6>
                      <p className="mb-2">
                        Kış ayları yaklaşıyor. Powerbank ve şarj aleti satışlarında artış bekleniyor.
                        Hazırlık yapmanız önerilir.
                      </p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-info">
                          <i className="fas fa-calendar me-1"></i>
                          Sezonluk Plan Yap
                        </button>
                        <button className="btn btn-sm btn-outline-info">
                          <i className="fas fa-history me-1"></i>
                          Geçmiş Veriler
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="insight-item p-3 border rounded">
                  <div className="d-flex align-items-start">
                    <div className="insight-icon me-3">
                      <i className="fas fa-lightbulb text-warning fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="text-warning mb-2">Optimizasyon Önerisi</h6>
                      <p className="mb-2">
                        MacBook Air M2 için minimum stok seviyesi çok yüksek görünüyor. 
                        Satış hızına göre 1 adet yeterli olabilir.
                      </p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-warning">
                          <i className="fas fa-cog me-1"></i>
                          Min. Stok Ayarla
                        </button>
                        <button className="btn btn-sm btn-outline-warning">
                          <i className="fas fa-calculator me-1"></i>
                          Detaylı Hesaplama
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-cog text-main me-2"></i>
                Tahmin Ayarları
              </h5>
            </div>
            <div className="card-body">
              <div className="form-group mb-3">
                <label className="form-label">Tahmin Algoritması</label>
                <select className="form-control form-select">
                  <option>Linear Regression</option>
                  <option>ARIMA Model</option>
                  <option>Neural Network</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Veri Periyodu</label>
                <select className="form-control form-select">
                  <option>Son 30 gün</option>
                  <option>Son 60 gün</option>
                  <option>Son 90 gün</option>
                  <option>Son 6 ay</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Mevsimsel Faktör</label>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" checked />
                  <label className="form-check-label">Mevsimsel trendleri dahil et</label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Güvenilirlik Eşiği</label>
                <input type="range" className="form-range" min="50" max="100" defaultValue="80" />
                <div className="d-flex justify-content-between small text-gray">
                  <span>%50</span>
                  <span>%80</span>
                  <span>%100</span>
                </div>
              </div>

              <button className="btn btn-main w-100 mt-3">
                <i className="fas fa-save me-2"></i>
                Ayarları Kaydet
              </button>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-chart-pie text-main me-2"></i>
                Tahmin Doğruluğu
              </h5>
            </div>
            <div className="card-body">
              <div className="accuracy-stats">
                <div className="stat-item mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Geçen Hafta</span>
                    <span className="badge badge-success">%94</span>
                  </div>
                  <div className="progress mt-1">
                    <div className="progress-bar success" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div className="stat-item mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Geçen Ay</span>
                    <span className="badge badge-main">%89</span>
                  </div>
                  <div className="progress mt-1">
                    <div className="progress-bar" style={{ width: '89%' }}></div>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Ortalama</span>
                    <span className="badge badge-secondary">%91</span>
                  </div>
                  <div className="progress mt-1">
                    <div className="progress-bar" style={{ width: '91%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-center">
                <small className="text-gray">
                  AI modeliniz sürekli öğreniyor ve iyileşiyor
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerStockPredictions;