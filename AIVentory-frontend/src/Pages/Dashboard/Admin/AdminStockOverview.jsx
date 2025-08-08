import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminStockOverview = () => {
  const [stockData] = useState([
    { 
      id: 1, 
      name: 'iPhone 15 Pro', 
      category: 'Telefon', 
      currentStock: 3, 
      minStock: 5, 
      status: 'critical',
      lastUpdate: '2024-01-15',
      price: 45000,
      totalValue: 135000
    },
    { 
      id: 2, 
      name: 'Samsung Galaxy S24', 
      category: 'Telefon', 
      currentStock: 12, 
      minStock: 10, 
      status: 'good',
      lastUpdate: '2024-01-14',
      price: 35000,
      totalValue: 420000
    },
    { 
      id: 3, 
      name: 'AirPods Pro', 
      category: 'Kulaklık', 
      currentStock: 0, 
      minStock: 8, 
      status: 'out',
      lastUpdate: '2024-01-13',
      price: 7000,
      totalValue: 0
    },
    { 
      id: 4, 
      name: 'MacBook Air M2', 
      category: 'Bilgisayar', 
      currentStock: 1, 
      minStock: 2, 
      status: 'critical',
      lastUpdate: '2024-01-15',
      price: 32000,
      totalValue: 32000
    },
    { 
      id: 5, 
      name: 'PowerBank 20000mAh', 
      category: 'Powerbank', 
      currentStock: 8, 
      minStock: 5, 
      status: 'low',
      lastUpdate: '2024-01-12',
      price: 300,
      totalValue: 2400
    },
    { 
      id: 6, 
      name: 'iPhone Kılıfı', 
      category: 'Kılıf', 
      currentStock: 45, 
      minStock: 20, 
      status: 'good',
      lastUpdate: '2024-01-14',
      price: 150,
      totalValue: 6750
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const getStockStatusInfo = (status) => {
    switch (status) {
      case 'critical':
        return { color: 'danger', text: 'Kritik', icon: 'fas fa-exclamation-triangle' };
      case 'low':
        return { color: 'warning', text: 'Düşük', icon: 'fas fa-exclamation-circle' };
      case 'out':
        return { color: 'danger', text: 'Tükendi', icon: 'fas fa-times-circle' };
      case 'good':
        return { color: 'success', text: 'Normal', icon: 'fas fa-check-circle' };
      default:
        return { color: 'secondary', text: 'Bilinmiyor', icon: 'fas fa-question-circle' };
    }
  };

  const filteredData = stockData
    .filter(item => {
      if (filter !== 'all' && item.status !== filter) return false;
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !item.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return a.currentStock - b.currentStock;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const getTotalValue = () => {
    return stockData.reduce((total, item) => total + item.totalValue, 0);
  };

  const getStatusCounts = () => {
    return {
      critical: stockData.filter(item => item.status === 'critical').length,
      low: stockData.filter(item => item.status === 'low').length,
      out: stockData.filter(item => item.status === 'out').length,
      good: stockData.filter(item => item.status === 'good').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="stock-overview-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-main mb-2">
            <i className="fas fa-warehouse me-2"></i>
            Stok Durumu
          </h1>
          <p className="text-gray mb-0">
            Tüm ürünlerin stok durumunu görüntüleyin ve yönetin
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/update" className="btn btn-secondary">
            <i className="fas fa-edit me-2"></i>
            Stok Güncelle
          </Link>
          <Link to="/admin/stock/movements" className="btn btn-outline-main">
            <i className="fas fa-history me-2"></i>
            Hareketler
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Toplam Ürün</div>
            <div className="stat-icon">
              <i className="fas fa-box"></i>
            </div>
          </div>
          <div className="stat-value">{stockData.length}</div>
          <div className="stat-change neutral">
            <i className="fas fa-equals"></i>
            Aktif ürün sayısı
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-title">Kritik Stok</div>
            <div className="stat-icon danger">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="stat-value">{statusCounts.critical + statusCounts.out}</div>
          <div className="stat-change negative">
            <i className="fas fa-arrow-up"></i>
            Acil müdahale gerekli
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-title">Düşük Stok</div>
            <div className="stat-icon warning">
              <i className="fas fa-exclamation-circle"></i>
            </div>
          </div>
          <div className="stat-value">{statusCounts.low}</div>
          <div className="stat-change neutral">
            <i className="fas fa-eye"></i>
            İzlenmeli
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-title">Toplam Değer</div>
            <div className="stat-icon success">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="stat-value">₺{getTotalValue().toLocaleString()}</div>
          <div className="stat-change positive">
            <i className="fas fa-chart-line"></i>
            Stok değeri
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(statusCounts.critical > 0 || statusCounts.out > 0) && (
        <div className="alert alert-danger mb-4">
          <div className="d-flex align-items-center">
            <i className="fas fa-exclamation-triangle alert-icon"></i>
            <div className="flex-grow-1">
              <strong>Kritik Stok Uyarısı!</strong>
              <p className="mb-0">
                {statusCounts.out > 0 && `${statusCounts.out} ürün tükendi. `}
                {statusCounts.critical > 0 && `${statusCounts.critical} ürün kritik seviyede.`}
                Acil sipariş vermeniz önerilir.
              </p>
            </div>
            <Link to="/admin/stock/predictions" className="btn btn-outline-danger">
              AI Önerilerini Gör
            </Link>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="dashboard-card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="header-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Ürün veya kategori ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-control form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="critical">Kritik Stok</option>
                <option value="low">Düşük Stok</option>
                <option value="out">Tükendi</option>
                <option value="good">Normal</option>
              </select>
            </div>
            <div className="col-md-4">
              <select 
                className="form-control form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">İsme Göre Sırala</option>
                <option value="stock">Stok Miktarına Göre</option>
                <option value="status">Duruma Göre</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="table-container">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Kategori</th>
              <th>Mevcut Stok</th>
              <th>Min. Stok</th>
              <th>Durum</th>
              <th>Birim Fiyat</th>
              <th>Toplam Değer</th>
              <th>Son Güncelleme</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => {
              const statusInfo = getStockStatusInfo(item.status);
              return (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <i className="fas fa-box text-main"></i>
                      </div>
                      <div>
                        <div className="fw-bold">{item.name}</div>
                        <div className="small text-gray">ID: #{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline badge-main">{item.category}</span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="fw-bold me-2">{item.currentStock}</span>
                      <div className="stock-level-bar" style={{ width: '50px' }}>
                        <div 
                          className={`stock-level-fill ${item.status === 'good' ? 'high' : item.status === 'low' ? 'medium' : 'low'}`}
                          style={{ width: `${Math.min(100, (item.currentStock / (item.minStock * 2)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>{item.minStock}</td>
                  <td>
                    <span className={`badge badge-${statusInfo.color}`}>
                      <i className={`${statusInfo.icon} me-1`}></i>
                      {statusInfo.text}
                    </span>
                  </td>
                  <td>₺{item.price.toLocaleString()}</td>
                  <td className="fw-bold">₺{item.totalValue.toLocaleString()}</td>
                  <td>
                    <div className="small text-gray">{item.lastUpdate}</div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-main" title="Stok Güncelle">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-main" title="Geçmiş">
                        <i className="fas fa-history"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-main" title="Sipariş Ver">
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-search text-gray fs-1 mb-3"></i>
          <h5 className="text-gray">Ürün bulunamadı</h5>
          <p className="text-gray">Arama kriterlerinizi değiştirin</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-bolt text-warning me-2"></i>
                Hızlı İşlemler
              </h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/admin/stock/update" className="btn btn-outline-main">
                  <i className="fas fa-edit me-2"></i>
                  Toplu Stok Güncelle
                </Link>
                <button className="btn btn-outline-main">
                  <i className="fas fa-download me-2"></i>
                  Stok Raporu İndir
                </button>
                <button className="btn btn-outline-main">
                  <i className="fas fa-bell me-2"></i>
                  Stok Uyarılarını Ayarla
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-robot text-main me-2"></i>
                AI Önerileri
              </h5>
            </div>
            <div className="card-body">
              <div className="ai-recommendation mb-3">
                <div className="recommendation-text">
                  <strong>Kritik:</strong> iPhone 15 Pro stoğu 2 gün içinde tükenecek. 15 adet sipariş öneriliyor.
                </div>
              </div>
              <div className="ai-recommendation mb-3">
                <div className="recommendation-text">
                  <strong>Öneri:</strong> PowerBank satışları %20 arttı. Stok artırımı düşünebilirsiniz.
                </div>
              </div>
              <Link to="/admin/ai/recommendations" className="btn btn-main btn-sm">
                <i className="fas fa-magic me-1"></i>
                Tüm Önerileri Gör
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStockOverview;