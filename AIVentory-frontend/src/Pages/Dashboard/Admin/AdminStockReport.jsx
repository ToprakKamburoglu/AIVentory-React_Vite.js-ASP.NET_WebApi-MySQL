import React, { useState, useEffect } from 'react';

const AdminStockReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('overview');
  const [filterCategory, setFilterCategory] = useState('');
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setStockData({
        overview: {
          totalProducts: 1247,
          inStock: 856,
          lowStock: 234,
          outOfStock: 157,
          totalValue: 2847650.00,
          averageStockDays: 45,
          turnoverRate: 8.3
        },
        categories: [
          { name: 'Elektronik', total: 456, inStock: 298, lowStock: 89, outOfStock: 69, value: 1847500.00 },
          { name: 'Giyim', total: 324, inStock: 245, lowStock: 56, outOfStock: 23, value: 456780.00 },
          { name: 'Ev & Yaşam', total: 267, inStock: 189, lowStock: 45, outOfStock: 33, value: 345670.00 },
          { name: 'Kozmetik', total: 200, inStock: 124, lowStock: 44, outOfStock: 32, value: 197700.00 }
        ],
        criticalProducts: [
          { id: 1, name: 'iPhone 15 Pro Max', category: 'Elektronik', currentStock: 2, minStock: 5, status: 'critical', value: 67500.00 },
          { id: 2, name: 'Samsung 4K TV', category: 'Elektronik', currentStock: 0, minStock: 3, status: 'out', value: 0 },
          { id: 3, name: 'Nike Air Max', category: 'Giyim', currentStock: 1, minStock: 10, status: 'critical', value: 2500.00 },
          { id: 4, name: 'Dyson V15', category: 'Ev & Yaşam', currentStock: 3, minStock: 8, status: 'low', value: 18750.00 },
          { id: 5, name: 'MacBook Pro M3', category: 'Elektronik', currentStock: 0, minStock: 2, status: 'out', value: 0 }
        ],
        movements: [
          { date: '2024-01-15', type: 'in', product: 'iPhone 15 Pro', quantity: 25, user: 'Mehmet Y.' },
          { date: '2024-01-15', type: 'out', product: 'Samsung Galaxy S24', quantity: 3, user: 'Fatma D.' },
          { date: '2024-01-14', type: 'in', product: 'MacBook Air M2', quantity: 10, user: 'Admin' },
          { date: '2024-01-14', type: 'out', product: 'iPad Pro', quantity: 2, user: 'Ayşe K.' },
          { date: '2024-01-13', type: 'adjustment', product: 'AirPods Pro', quantity: -1, user: 'Admin' }
        ],
        topValue: [
          { name: 'iPhone 15 Pro Max', stock: 45, unitPrice: 67500.00, totalValue: 3037500.00 },
          { name: 'MacBook Pro M3', stock: 12, unitPrice: 89900.00, totalValue: 1078800.00 },
          { name: 'Samsung 85" QLED', stock: 8, unitPrice: 124900.00, totalValue: 999200.00 },
          { name: 'Dyson V15 Detect', stock: 23, unitPrice: 18750.00, totalValue: 431250.00 },
          { name: 'iPad Pro 12.9"', stock: 34, unitPrice: 12499.00, totalValue: 424966.00 }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'critical':
        return 'badge-danger';
      case 'low':
        return 'badge-warning';
      case 'out':
        return 'badge-danger';
      default:
        return 'badge-success';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'critical':
        return 'Kritik';
      case 'low':
        return 'Düşük';
      case 'out':
        return 'Tükendi';
      default:
        return 'Normal';
    }
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case 'in':
        return 'fas fa-arrow-down text-success';
      case 'out':
        return 'fas fa-arrow-up text-danger';
      case 'adjustment':
        return 'fas fa-edit text-warning';
      default:
        return 'fas fa-exchange-alt text-info';
    }
  };

  const getMovementText = (type) => {
    switch (type) {
      case 'in':
        return 'Giriş';
      case 'out':
        return 'Çıkış';
      case 'adjustment':
        return 'Düzeltme';
      default:
        return 'Transfer';
    }
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

  const exportReport = (format) => {
    alert(`Stok raporu ${format.toUpperCase()} formatında dışa aktarılıyor...`);
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-overlay">
          <div className="loading-spinner lg"></div>
          <p>Stok raporu oluşturuluyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-dark fw-bold mb-1">Stok Raporu</h1>
          <p className="text-gray mb-0">Stok durumunu ve hareketlerini analiz edin</p>
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
              <label className="form-label">Rapor Türü</label>
              <select
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="overview">Genel Bakış</option>
                <option value="critical">Kritik Stoklar</option>
                <option value="movements">Stok Hareketleri</option>
                <option value="value">Değer Analizi</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Kategori Filtresi</label>
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Tüm Kategoriler</option>
                <option value="elektronik">Elektronik</option>
                <option value="giyim">Giyim</option>
                <option value="ev">Ev & Yaşam</option>
                <option value="kozmetik">Kozmetik</option>
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button 
                className="btn btn-main w-100"
                onClick={generateReport}
              >
                <i className="fas fa-search me-2"></i>
                Filtrele
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Overview Stats */}
      {stockData && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Toplam Ürün</span>
                <div className="stat-icon">
                  <i className="fas fa-boxes"></i>
                </div>
              </div>
              <div className="stat-value">{stockData.overview.totalProducts.toLocaleString()}</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                +5.2% bu ay
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-header">
                <span className="stat-title">Stokta Var</span>
                <div className="stat-icon success">
                  <i className="fas fa-check-circle"></i>
                </div>
              </div>
              <div className="stat-value">{stockData.overview.inStock.toLocaleString()}</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                %{((stockData.overview.inStock / stockData.overview.totalProducts) * 100).toFixed(1)}
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-header">
                <span className="stat-title">Düşük Stok</span>
                <div className="stat-icon warning">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
              </div>
              <div className="stat-value">{stockData.overview.lowStock.toLocaleString()}</div>
              <div className="stat-change negative">
                <i className="fas fa-arrow-down"></i>
                Dikkat gerekli
              </div>
            </div>

            <div className="stat-card danger">
              <div className="stat-header">
                <span className="stat-title">Tükenen</span>
                <div className="stat-icon danger">
                  <i className="fas fa-times-circle"></i>
                </div>
              </div>
              <div className="stat-value">{stockData.overview.outOfStock.toLocaleString()}</div>
              <div className="stat-change negative">
                <i className="fas fa-arrow-up"></i>
                Acil tedarik
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-title">Toplam Stok Değeri</span>
                  <div className="stat-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                </div>
                <div className="stat-value">{formatCurrency(stockData.overview.totalValue)}</div>
                <div className="stat-change positive">
                  <i className="fas fa-arrow-up"></i>
                  +8.7% değer artışı
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-title">Ortalama Stok Süresi</span>
                  <div className="stat-icon">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                </div>
                <div className="stat-value">{stockData.overview.averageStockDays} gün</div>
                <div className="stat-change neutral">
                  <i className="fas fa-minus"></i>
                  Normal seviye
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-title">Devir Hızı</span>
                  <div className="stat-icon">
                    <i className="fas fa-sync-alt"></i>
                  </div>
                </div>
                <div className="stat-value">{stockData.overview.turnoverRate}x</div>
                <div className="stat-change positive">
                  <i className="fas fa-arrow-up"></i>
                  İyi performans
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Category Breakdown */}
            <div className="col-lg-6">
              <div className="dashboard-card">
                <div className="card-header">
                  <h5 className="card-title">
                    <i className="fas fa-tags me-2"></i>
                    Kategori Bazlı Stok Durumu
                  </h5>
                </div>
                <div className="card-body">
                  {stockData.categories.map((category, index) => (
                    <div key={index} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-dark fw-bold">{category.name}</span>
                        <span className="text-main fw-bold">{formatCurrency(category.value)}</span>
                      </div>
                      
                      <div className="row g-2 mb-2">
                        <div className="col-4">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-success fw-bold">{category.inStock}</div>
                            <small className="text-gray">Stokta</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-warning fw-bold">{category.lowStock}</div>
                            <small className="text-gray">Düşük</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-danger fw-bold">{category.outOfStock}</div>
                            <small className="text-gray">Tükenen</small>
                          </div>
                        </div>
                      </div>

                      <div className="progress">
                        <div 
                          className="progress-bar success"
                          style={{ width: `${(category.inStock / category.total) * 100}%` }}
                        ></div>
                        <div 
                          className="progress-bar warning"
                          style={{ width: `${(category.lowStock / category.total) * 100}%` }}
                        ></div>
                        <div 
                          className="progress-bar danger"
                          style={{ width: `${(category.outOfStock / category.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Critical Products */}
            <div className="col-lg-6">
              <div className="dashboard-card">
                <div className="card-header">
                  <h5 className="card-title">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Kritik Stok Durumu
                  </h5>
                </div>
                <div className="card-body">
                  {stockData.criticalProducts.map((product, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)', borderLeft: `4px solid ${product.status === 'out' ? 'var(--danger-color)' : product.status === 'critical' ? 'var(--warning-color)' : 'var(--success-color)'}` }}>
                      <div>
                        <div className="fw-bold text-dark">{product.name}</div>
                        <small className="text-gray">{product.category}</small>
                        <div className="mt-1">
                          <small className="text-gray">
                            Mevcut: {product.currentStock} | Min: {product.minStock}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className={`badge ${getStatusBadge(product.status)} mb-1`}>
                          {getStatusText(product.status)}
                        </span>
                        <div className="text-gray fw-bold">
                          {formatCurrency(product.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Stock Movements */}
          <div className="dashboard-card mt-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-exchange-alt me-2"></i>
                Son Stok Hareketleri
              </h5>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Hareket</th>
                      <th>Ürün</th>
                      <th>Miktar</th>
                      <th>Kullanıcı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.movements.map((movement, index) => (
                      <tr key={index}>
                        <td>
                          <span className="text-dark">{formatDate(movement.date)}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <i className={getMovementIcon(movement.type)}></i>
                            <span className="text-dark">{getMovementText(movement.type)}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-dark fw-bold">{movement.product}</span>
                        </td>
                        <td>
                          <span className={`fw-bold ${movement.type === 'in' ? 'text-success' : movement.type === 'out' ? 'text-danger' : 'text-warning'}`}>
                            {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}{movement.quantity}
                          </span>
                        </td>
                        <td>
                          <span className="text-gray">{movement.user}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Value Products */}
          <div className="dashboard-card mt-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-gem me-2"></i>
                En Değerli Stoklar
              </h5>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th>Stok Adedi</th>
                      <th>Birim Fiyat</th>
                      <th>Toplam Değer</th>
                      <th>Oran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.topValue.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="badge bg-main" style={{ minWidth: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '12px' }}>
                              {index + 1}
                            </div>
                            <span className="text-dark fw-bold">{product.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-outline badge-main">{product.stock} adet</span>
                        </td>
                        <td>
                          <span className="text-gray">{formatCurrency(product.unitPrice)}</span>
                        </td>
                        <td>
                          <span className="text-success fw-bold">{formatCurrency(product.totalValue)}</span>
                        </td>
                        <td>
                          <span className="text-main">
                            %{((product.totalValue / stockData.overview.totalValue) * 100).toFixed(1)}
                          </span>
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

export default AdminStockReport;