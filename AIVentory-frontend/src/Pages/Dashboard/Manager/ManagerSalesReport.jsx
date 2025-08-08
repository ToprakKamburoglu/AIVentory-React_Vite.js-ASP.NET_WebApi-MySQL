import React, { useState, useEffect } from 'react';

const ManagerSalesReport = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  const [reportType, setReportType] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setSalesData({
        summary: {
          totalSales: 125800.50,
          totalOrders: 247,
          totalProducts: 156,
          averageOrderValue: 509.32,
          topSellingProduct: 'iPhone 15 Pro',
          bestDay: '2024-01-15',
          bestDayAmount: 8750.00
        },
        dailySales: [
          { date: '2024-01-01', amount: 2500.00, orders: 12 },
          { date: '2024-01-02', amount: 3200.00, orders: 15 },
          { date: '2024-01-03', amount: 1800.00, orders: 8 },
          { date: '2024-01-04', amount: 4100.00, orders: 18 },
          { date: '2024-01-05', amount: 5200.00, orders: 22 },
          { date: '2024-01-06', amount: 3800.00, orders: 16 },
          { date: '2024-01-07', amount: 2900.00, orders: 13 }
        ],
        topProducts: [
          { name: 'iPhone 15 Pro', sales: 45, amount: 202500.00, percentage: 16.1 },
          { name: 'Samsung Galaxy S24', sales: 32, amount: 112000.00, percentage: 8.9 },
          { name: 'MacBook Air M2', sales: 18, amount: 180000.00, percentage: 14.3 },
          { name: 'iPad Pro', sales: 25, amount: 125000.00, percentage: 9.9 },
          { name: 'AirPods Pro', sales: 67, amount: 67000.00, percentage: 5.3 }
        ],
        categoryData: [
          { category: 'Elektronik', sales: 85600.00, percentage: 68.1 },
          { category: 'Giyim', sales: 23400.00, percentage: 18.6 },
          { category: 'Ev & Yaşam', sales: 12100.00, percentage: 9.6 },
          { category: 'Kozmetik', sales: 4700.00, percentage: 3.7 }
        ]
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

  const exportReport = (format) => {
    alert(`Rapor ${format.toUpperCase()} formatında dışa aktarılıyor...`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-overlay">
          <div className="loading-spinner lg"></div>
          <p>Satış raporu oluşturuluyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-dark fw-bold mb-1">Satış Raporu</h1>
          <p className="text-gray mb-0">Satış performansınızı analiz edin</p>
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
            <div className="col-md-3">
              <label className="form-label">Başlangıç Tarihi</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={dateRange.startDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Bitiş Tarihi</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={dateRange.endDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Rapor Türü</label>
              <select
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="summary">Özet Rapor</option>
                <option value="detailed">Detaylı Rapor</option>
                <option value="product">Ürün Raporu</option>
                <option value="category">Kategori Raporu</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button 
                className="btn btn-main w-100"
                onClick={generateReport}
              >
                <i className="fas fa-search me-2"></i>
                Rapor Oluştur
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {salesData && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Toplam Satış</span>
                <div className="stat-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
              </div>
              <div className="stat-value">{formatCurrency(salesData.summary.totalSales)}</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                +12.5% geçen aya göre
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-header">
                <span className="stat-title">Toplam Sipariş</span>
                <div className="stat-icon success">
                  <i className="fas fa-shopping-cart"></i>
                </div>
              </div>
              <div className="stat-value">{salesData.summary.totalOrders}</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                +8.3% artış
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-header">
                <span className="stat-title">Ortalama Sipariş</span>
                <div className="stat-icon warning">
                  <i className="fas fa-calculator"></i>
                </div>
              </div>
              <div className="stat-value">{formatCurrency(salesData.summary.averageOrderValue)}</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                +3.8% yükseldi
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Satılan Ürün</span>
                <div className="stat-icon">
                  <i className="fas fa-box"></i>
                </div>
              </div>
              <div className="stat-value">{salesData.summary.totalProducts}</div>
              <div className="stat-change neutral">
                <i className="fas fa-minus"></i>
                Sabit kaldı
              </div>
            </div>
          </div>

          <div className="row">
            {/* Top Products */}
            <div className="col-lg-6">
              <div className="dashboard-card">
                <div className="card-header">
                  <h5 className="card-title">
                    <i className="fas fa-trophy me-2"></i>
                    En Çok Satan Ürünler
                  </h5>
                </div>
                <div className="card-body">
                  {salesData.topProducts.map((product, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)' }}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="badge bg-main" style={{ minWidth: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{product.name}</div>
                          <small className="text-gray">{product.sales} adet satıldı</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-success">{formatCurrency(product.amount)}</div>
                        <small className="text-gray">%{product.percentage}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Sales */}
            <div className="col-lg-6">
              <div className="dashboard-card">
                <div className="card-header">
                  <h5 className="card-title">
                    <i className="fas fa-tags me-2"></i>
                    Kategori Bazlı Satışlar
                  </h5>
                </div>
                <div className="card-body">
                  {salesData.categoryData.map((category, index) => (
                    <div key={index} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-dark fw-bold">{category.category}</span>
                        <span className="text-success fw-bold">{formatCurrency(category.sales)}</span>
                      </div>
                      <div className="progress mb-2">
                        <div 
                          className="progress-bar"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-end">
                        <small className="text-gray">%{category.percentage} toplam satış</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Sales Chart */}
          <div className="dashboard-card mt-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-chart-bar me-2"></i>
                Günlük Satış Trendi
              </h5>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Satış Tutarı</th>
                      <th>Sipariş Sayısı</th>
                      <th>Ortalama</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.dailySales.map((day, index) => (
                      <tr key={index}>
                        <td>
                          <span className="text-dark fw-bold">{formatDate(day.date)}</span>
                        </td>
                        <td>
                          <span className="text-success fw-bold">{formatCurrency(day.amount)}</span>
                        </td>
                        <td>
                          <span className="badge badge-main">{day.orders}</span>
                        </td>
                        <td>
                          <span className="text-gray">{formatCurrency(day.amount / day.orders)}</span>
                        </td>
                        <td>
                          {index > 0 && (
                            <span className={`badge ${day.amount > salesData.dailySales[index-1].amount ? 'badge-success' : 'badge-danger'}`}>
                              <i className={`fas fa-arrow-${day.amount > salesData.dailySales[index-1].amount ? 'up' : 'down'} me-1`}></i>
                              {((day.amount - salesData.dailySales[index-1].amount) / salesData.dailySales[index-1].amount * 100).toFixed(1)}%
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

          {/* Key Insights */}
          <div className="dashboard-card mt-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-lightbulb me-2"></i>
                Önemli Bulgular
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="alert alert-success">
                    <i className="fas fa-star alert-icon"></i>
                    <div>
                      <strong>En İyi Performans:</strong>
                      <p className="mb-0 mt-2">
                        {formatDate(salesData.summary.bestDay)} tarihinde {formatCurrency(salesData.summary.bestDayAmount)} satış gerçekleştirdiniz.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="alert alert-info">
                    <i className="fas fa-chart-line alert-icon"></i>
                    <div>
                      <strong>En Popüler Ürün:</strong>
                      <p className="mb-0 mt-2">
                        {salesData.summary.topSellingProduct} en çok satan ürününüz oldu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle alert-icon"></i>
                <div>
                  <strong>Öneri:</strong>
                  <p className="mb-0 mt-2">
                    Elektronik kategorisindeki yüksek performansı diğer kategorilerde de tekrarlamak için pazarlama stratejilerinizi gözden geçirebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerSalesReport;