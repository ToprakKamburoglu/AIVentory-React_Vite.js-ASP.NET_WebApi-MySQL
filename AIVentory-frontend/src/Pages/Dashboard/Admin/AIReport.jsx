import React, { useState, useEffect } from 'react';

const AIReport = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setAiData({
        overview: {
          totalAnalyses: 1247,
          successfulAnalyses: 1089,
          averageConfidence: 87.4,
          processingTime: 2.3,
          costSavings: 45600.00,
          accuracyRate: 94.2
        },
        analysisTypes: [
          { type: 'Ürün Tanıma', count: 567, success: 534, confidence: 89.2, avgTime: 1.8 },
          { type: 'Renk Analizi', count: 342, success: 325, confidence: 92.1, avgTime: 1.2 },
          { type: 'Fiyat Tahmini', count: 223, success: 198, confidence: 81.5, avgTime: 3.1 },
          { type: 'Talep Tahmini', count: 115, success: 102, confidence: 88.7, avgTime: 4.2 }
        ],
        recentAnalyses: [
          {
            id: 1,
            date: '2024-01-15 14:30',
            type: 'Ürün Tanıma',
            product: 'iPhone 15 Pro',
            confidence: 95.8,
            result: 'Başarılı',
            processingTime: 1.4,
            user: 'Mehmet Y.'
          },
          {
            id: 2,
            date: '2024-01-15 13:45',
            type: 'Renk Analizi',
            product: 'Samsung Galaxy S24',
            confidence: 88.3,
            result: 'Başarılı',
            processingTime: 0.9,
            user: 'Fatma D.'
          },
          {
            id: 3,
            date: '2024-01-15 12:20',
            type: 'Fiyat Tahmini',
            product: 'MacBook Air M2',
            confidence: 76.2,
            result: 'Düşük Güven',
            processingTime: 2.8,
            user: 'Admin'
          },
          {
            id: 4,
            date: '2024-01-15 11:15',
            type: 'Talep Tahmini',
            product: 'AirPods Pro',
            confidence: 91.5,
            result: 'Başarılı',
            processingTime: 3.6,
            user: 'Ayşe K.'
          }
        ],
        predictions: [
          {
            product: 'iPhone 15 Pro',
            currentStock: 45,
            predictedDemand: 67,
            recommendedOrder: 35,
            confidence: 89.4,
            stockOutDate: '2024-02-15'
          },
          {
            product: 'Samsung Galaxy S24',
            currentStock: 23,
            predictedDemand: 41,
            recommendedOrder: 25,
            confidence: 85.7,
            stockOutDate: '2024-02-08'
          },
          {
            product: 'MacBook Air M2',
            currentStock: 12,
            predictedDemand: 18,
            recommendedOrder: 15,
            confidence: 92.1,
            stockOutDate: '2024-02-12'
          }
        ],
        insights: [
          {
            type: 'success',
            title: 'Yüksek Performans',
            message: 'Son 30 günde AI analizlerinizin %94.2 doğruluk oranına ulaştı.',
            action: 'Devam edin'
          },
          {
            type: 'warning',
            title: 'Model Güncellemesi',
            message: 'Fiyat tahmin modeliniz güncellenmeli, doğruluk oranı %81.5.',
            action: 'Modeli güncelleyin'
          },
          {
            type: 'info',
            title: 'Yeni Özellik',
            message: 'Kategori bazlı analiz özelliği kullanıma hazır.',
            action: 'Özelliği inceleyin'
          }
        ],
        performance: {
          daily: [
            { date: '2024-01-10', analyses: 42, success: 39, avgConfidence: 88.5 },
            { date: '2024-01-11', analyses: 38, success: 35, avgConfidence: 87.2 },
            { date: '2024-01-12', analyses: 45, success: 43, avgConfidence: 89.8 },
            { date: '2024-01-13', analyses: 52, success: 48, avgConfidence: 86.4 },
            { date: '2024-01-14', analyses: 48, success: 46, avgConfidence: 90.1 },
            { date: '2024-01-15', analyses: 55, success: 52, avgConfidence: 91.3 }
          ]
        }
      });
      setLoading(false);
    }, 1000);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getResultBadge = (result) => {
    switch (result.toLowerCase()) {
      case 'başarılı':
        return 'badge-success';
      case 'düşük güven':
        return 'badge-warning';
      case 'başarısız':
        return 'badge-danger';
      default:
        return 'badge-main';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-success';
      case 'warning':
        return 'fas fa-exclamation-triangle text-warning';
      case 'info':
        return 'fas fa-info-circle text-info';
      default:
        return 'fas fa-lightbulb text-main';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const exportReport = (format) => {
    alert(`AI raporu ${format.toUpperCase()} formatında dışa aktarılıyor...`);
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-overlay">
          <div className="loading-spinner lg"></div>
          <p>AI raporu oluşturuluyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-dark fw-bold mb-1">AI Analiz Raporu</h1>
          <p className="text-gray mb-0">Yapay zeka performansını ve analizlerini inceleyin</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-main"
            onClick={() => exportReport('pdf')}
          >
            <i className="fas fa-file-pdf me-2"></i>
            PDF
          </button>
          <button 
            className="btn btn-outline-main"
            onClick={() => exportReport('excel')}
          >
            <i className="fas fa-file-excel me-2"></i>
            Excel
          </button>
          <button 
            className="btn btn-main"
            onClick={generateReport}
          >
            <i className="fas fa-sync me-2"></i>
            Yenile
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Başlangıç Tarihi</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={dateRange.startDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Bitiş Tarihi</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={dateRange.endDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button 
                className="btn btn-main w-100"
                onClick={generateReport}
              >
                <i className="fas fa-chart-line me-2"></i>
                Rapor Oluştur
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Overview Stats */}
      {aiData && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Toplam Analiz</span>
                <div className="stat-icon">
                  <i className="fas fa-brain"></i>
                </div>
              </div>
              <div className="stat-value">{aiData.overview.totalAnalyses.toLocaleString()}</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                +15.3% bu ay
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-header">
                <span className="stat-title">Başarı Oranı</span>
                <div className="stat-icon success">
                  <i className="fas fa-check-circle"></i>
                </div>
              </div>
              <div className="stat-value">%{aiData.overview.accuracyRate}</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                +2.1% iyileşme
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Ortalama Güven</span>
                <div className="stat-icon">
                  <i className="fas fa-percentage"></i>
                </div>
              </div>
              <div className="stat-value">%{aiData.overview.averageConfidence}</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                Yüksek güven
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-header">
                <span className="stat-title">İşlem Süresi</span>
                <div className="stat-icon warning">
                  <i className="fas fa-clock"></i>
                </div>
              </div>
              <div className="stat-value">{aiData.overview.processingTime}s</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-down"></i>
                %8.4 daha hızlı
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-title">Maliyet Tasarrufu</span>
                  <div className="stat-icon">
                    <i className="fas fa-piggy-bank"></i>
                  </div>
                </div>
                <div className="stat-value">{formatCurrency(aiData.overview.costSavings)}</div>
                <div className="stat-change positive">
                  <i className="fas fa-arrow-up"></i>
                  Manuel işleme göre
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-title">Başarılı Analiz</span>
                  <div className="stat-icon">
                    <i className="fas fa-trophy"></i>
                  </div>
                </div>
                <div className="stat-value">{aiData.overview.successfulAnalyses.toLocaleString()}</div>
                <div className="stat-change positive">
                  <i className="fas fa-arrow-up"></i>
                  %{((aiData.overview.successfulAnalyses / aiData.overview.totalAnalyses) * 100).toFixed(1)} başarı
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Analysis Types Performance */}
            <div className="col-lg-8">
              <div className="dashboard-card">
                <div className="card-header">
                  <h5 className="card-title">
                    <i className="fas fa-chart-bar me-2"></i>
                    Analiz Türleri Performansı
                  </h5>
                </div>
                <div className="card-body">
                  {aiData.analysisTypes.map((analysis, index) => (
                    <div key={index} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-dark fw-bold">{analysis.type}</span>
                        <div className="d-flex gap-3">
                          <span className="text-gray">
                            <i className="fas fa-clock me-1"></i>
                            {analysis.avgTime}s
                          </span>
                          <span className="text-main fw-bold">
                            %{analysis.confidence}
                          </span>
                        </div>
                      </div>
                      
                      <div className="row g-2 mb-2">
                        <div className="col-3">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-main fw-bold">{analysis.count}</div>
                            <small className="text-gray">Toplam</small>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-success fw-bold">{analysis.success}</div>
                            <small className="text-gray">Başarılı</small>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-danger fw-bold">{analysis.count - analysis.success}</div>
                            <small className="text-gray">Başarısız</small>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-warning fw-bold">%{((analysis.success / analysis.count) * 100).toFixed(1)}</div>
                            <small className="text-gray">Başarı</small>
                          </div>
                        </div>
                      </div>

                      <div className="progress">
                        <div 
                          className="progress-bar success"
                          style={{ width: `${(analysis.success / analysis.count) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="col-lg-4">
              <div className="dashboard-card">
                <div className="card-header">
                  <h5 className="card-title">
                    <i className="fas fa-lightbulb me-2"></i>
                    AI Öngörüleri
                  </h5>
                </div>
                <div className="card-body">
                  {aiData.insights.map((insight, index) => (
                    <div key={index} className="alert" style={{ 
                      background: insight.type === 'success' ? 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)' :
                                 insight.type === 'warning' ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' :
                                 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                      color: insight.type === 'success' ? '#065F46' :
                             insight.type === 'warning' ? '#92400E' : '#1E40AF',
                      border: 'none',
                      borderLeft: `4px solid ${insight.type === 'success' ? 'var(--success-color)' :
                                               insight.type === 'warning' ? 'var(--warning-color)' : 'var(--main-color)'}`
                    }}>
                      <div className="d-flex align-items-start gap-2">
                        <i className={getInsightIcon(insight.type)}></i>
                        <div className="flex-grow-1">
                          <strong>{insight.title}</strong>
                          <p className="mb-2 mt-1">{insight.message}</p>
                          <button className="btn btn-sm btn-outline-main">
                            {insight.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stock Predictions */}
          <div className="dashboard-card mt-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-crystal-ball me-2"></i>
                AI Stok Tahminleri
              </h5>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th>Mevcut Stok</th>
                      <th>Tahmini Talep</th>
                      <th>Önerilen Sipariş</th>
                      <th>Güven Oranı</th>
                      <th>Tükenme Tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiData.predictions.map((prediction, index) => (
                      <tr key={index}>
                        <td>
                          <span className="text-dark fw-bold">{prediction.product}</span>
                        </td>
                        <td>
                          <span className="badge badge-outline badge-main">{prediction.currentStock} adet</span>
                        </td>
                        <td>
                          <span className="text-warning fw-bold">{prediction.predictedDemand} adet</span>
                        </td>
                        <td>
                          <span className="text-success fw-bold">{prediction.recommendedOrder} adet</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress" style={{ width: '60px', height: '8px' }}>
                              <div 
                                className={`progress-bar ${prediction.confidence > 90 ? 'success' : prediction.confidence > 80 ? 'warning' : 'danger'}`}
                                style={{ width: `${prediction.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-gray">%{prediction.confidence}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-danger">{formatDate(prediction.stockOutDate)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent AI Analyses */}
          <div className="dashboard-card mt-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-history me-2"></i>
                Son AI Analizleri
              </h5>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>Tarih/Saat</th>
                      <th>Analiz Türü</th>
                      <th>Ürün</th>
                      <th>Güven Oranı</th>
                      <th>Sonuç</th>
                      <th>İşlem Süresi</th>
                      <th>Kullanıcı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiData.recentAnalyses.map((analysis, index) => (
                      <tr key={index}>
                        <td>
                          <span className="text-gray">{formatDateTime(analysis.date)}</span>
                        </td>
                        <td>
                          <span className="badge badge-main">{analysis.type}</span>
                        </td>
                        <td>
                          <span className="text-dark fw-bold">{analysis.product}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress" style={{ width: '50px', height: '6px' }}>
                              <div 
                                className={`progress-bar ${analysis.confidence > 90 ? 'success' : analysis.confidence > 80 ? 'warning' : 'danger'}`}
                                style={{ width: `${analysis.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-gray">%{analysis.confidence}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getResultBadge(analysis.result)}`}>
                            {analysis.result}
                          </span>
                        </td>
                        <td>
                          <span className="text-gray">{analysis.processingTime}s</span>
                        </td>
                        <td>
                          <span className="text-gray">{analysis.user}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="dashboard-card mt-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-trending-up me-2"></i>
                Günlük Performans Trendi
              </h5>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Toplam Analiz</th>
                      <th>Başarılı</th>
                      <th>Başarı Oranı</th>
                      <th>Ortalama Güven</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiData.performance.daily.map((day, index) => (
                      <tr key={index}>
                        <td>
                          <span className="text-dark">{formatDate(day.date)}</span>
                        </td>
                        <td>
                          <span className="badge badge-outline badge-main">{day.analyses}</span>
                        </td>
                        <td>
                          <span className="text-success fw-bold">{day.success}</span>
                        </td>
                        <td>
                          <span className="text-main fw-bold">%{((day.success / day.analyses) * 100).toFixed(1)}</span>
                        </td>
                        <td>
                          <span className="text-warning fw-bold">%{day.avgConfidence}</span>
                        </td>
                        <td>
                          {index > 0 && (
                            <span className={`badge ${day.avgConfidence > aiData.performance.daily[index-1].avgConfidence ? 'badge-success' : 'badge-danger'}`}>
                              <i className={`fas fa-arrow-${day.avgConfidence > aiData.performance.daily[index-1].avgConfidence ? 'up' : 'down'} me-1`}></i>
                              {(day.avgConfidence - aiData.performance.daily[index-1].avgConfidence).toFixed(1)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIReport;