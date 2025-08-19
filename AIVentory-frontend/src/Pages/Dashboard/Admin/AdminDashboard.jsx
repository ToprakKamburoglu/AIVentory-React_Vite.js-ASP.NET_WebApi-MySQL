import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    todaysStats: {
      totalProducts: 0,
      lowStockProducts: 0,
      totalCategories: 0,
      totalValue: 0
    },
    recentProducts: [],
    stockAlerts: [],
    productsByCategory: []
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (user?.companyId) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/products?companyId=${user.companyId}&pageSize=50`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/categories?companyId=${user.companyId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const products = productsResponse.data.data?.data || [];
      const categories = categoriesResponse.data.data || [];

      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => 
        p.currentStock <= p.minimumStock
      );
      const totalValue = products.reduce((sum, p) => 
        sum + (p.price * p.currentStock), 0
      );

      const recentProducts = products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const stockAlerts = products
        .filter(p => p.currentStock === 0 || p.currentStock <= p.minimumStock)
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          product: p.name,
          stock: p.currentStock,
          minStock: p.minimumStock,
          status: p.currentStock === 0 ? 'out' : 'low'
        }));

      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.id] = { name: cat.name, count: 0 };
      });
      
      products.forEach(product => {
        if (categoryMap[product.categoryId]) {
          categoryMap[product.categoryId].count++;
        }
      });

      const productsByCategory = Object.values(categoryMap)
        .filter(cat => cat.count > 0)
        .sort((a, b) => b.count - a.count);

      setDashboardData({
        todaysStats: {
          totalProducts,
          lowStockProducts: lowStockProducts.length,
          totalCategories: categories.length,
          totalValue
        },
        recentProducts,
        stockAlerts,
        productsByCategory
      });

    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'out': return 'danger';
      case 'low': return 'warning';
      default: return 'success';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="employee-dashboard">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-3 text-gray">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome mb-4 pt-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="text-main mb-2">
              Merhaba {user?.firstName}! 👨‍💻
            </h1>
            <p className="text-gray mb-0">
              Şirketinizde toplam {dashboardData.todaysStats.totalProducts} ürün bulunuyor. İşte güncel durumun özeti.
            </p>
          </div>
          <div className="col-md-4 text-end">
            <div className="work-time-info">
              <div className="text-main fw-bold">Toplam Değer</div>
              <div className="text-gray">{formatPrice(dashboardData.todaysStats.totalValue)}</div>
              <div className="small text-success">
                <i className="fas fa-chart-line me-1"></i>
                Stok değeri
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Data Stats */}
      <div className="dashboard-stats">
        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-title">Toplam Ürün</div>
            <div className="stat-icon success">
              <i className="fas fa-box"></i>
            </div>
          </div>
          <div className="stat-value">{dashboardData.todaysStats.totalProducts}</div>
          <div className="stat-change positive">
            <i className="fas fa-cubes"></i>
            Aktif ürün sayısı
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-title">Düşük Stok</div>
            <div className="stat-icon warning">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="stat-value">{dashboardData.todaysStats.lowStockProducts}</div>
          <div className="stat-change negative">
            <i className="fas fa-arrow-down"></i>
            Dikkat gerekiyor
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Kategoriler</div>
            <div className="stat-icon">
              <i className="fas fa-tags"></i>
            </div>
          </div>
          <div className="stat-value">{dashboardData.todaysStats.totalCategories}</div>
          <div className="stat-change positive">
            <i className="fas fa-layer-group"></i>
            Farklı kategori
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Stok Değeri</div>
            <div className="stat-icon">
              <i className="fa-solid fa-turkish-lira-sign"></i>
            </div>
          </div>
          <div className="stat-value">₺{dashboardData.todaysStats.totalValue.toLocaleString('tr-TR')}</div>
          <div className="stat-change positive">
            <i className="fas fa-chart-line"></i>
            Toplam değer
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/admin/products/add" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-plus"></i>
          </div>
          <div className="quick-action-text">Ürün Ekle</div>
        </Link>

        <Link to="/admin/products" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-search"></i>
          </div>
          <div className="quick-action-text">Ürün Ara</div>
        </Link>

        <Link to="/admin/stock/update" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-edit"></i>
          </div>
          <div className="quick-action-text">Stok Güncelle</div>
        </Link>

        <Link to="/admin/profile" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-user"></i>
          </div>
          <div className="quick-action-text">Profil</div>
        </Link>
      </div>

      {/* Güzelleştirilmiş Dashboard Kartları */}
      <div className="row" style={{ margin: '0 -12px' }}>
        {/* İlk Satır - Sol: Son Eklenen Ürünler, Sağ: Kategori Dağılımı */}
        <div className="col-lg-6 col-md-6 mb-4" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="dashboard-card shadow-lg border-0" style={{ height: '100%', borderRadius: '15px', overflow: 'hidden' }}>
            <div className="card-header bg-gradient-primary text-white" style={{ padding: '20px 24px', border: 'none' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <span className="fw-bold">Son Eklenen Ürünler</span>
                </h5>
                <span className="fw-bold text-white">
                  {dashboardData.recentProducts.length} ürün
                </span>
              </div>
            </div>
            <div className="card-body" style={{ padding: '24px' }}>
              {dashboardData.recentProducts.length > 0 ? (
                dashboardData.recentProducts.map((product) => (
                  <div key={product.id} className="product-item bg-white rounded-3 shadow-sm p-3 mb-3 hover-lift" 
                       style={{ transition: 'all 0.3s ease', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="d-flex align-items-center">
                      <div className="product-image me-3">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="rounded-circle border"
                            style={{ 
                              width: '50px', 
                              height: '50px', 
                              objectFit: 'cover',
                              border: '3px solid #e9ecef !important'
                            }}
                          />
                        ) : (
                          <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center border"
                               style={{ 
                                 width: '50px', 
                                 height: '50px',
                                 border: '3px solid #e9ecef !important'
                               }}>
                            <i className="fas fa-image text-primary"></i>
                          </div>
                        )}
                      </div>
                      <div className="product-info flex-grow-1">
                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>{product.name}</div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-success fw-semibold" style={{ fontSize: '13px' }}>
                            <i className="fas fa-lira-sign me-1"></i>
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-muted" style={{ fontSize: '12px' }}>•</span>
                          <span className="text-primary fw-semibold" style={{ fontSize: '13px' }}>
                            <i className="fas fa-boxes me-1"></i>
                            {product.currentStock} adet
                          </span>
                        </div>
                      </div>
                      <div className="product-date text-end">
                        <div className="badge bg-secondary bg-opacity-10 text-secondary">
                          <i className="fas fa-calendar-alt me-1"></i>
                          {formatDate(product.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state text-center py-5">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-box text-primary fs-1"></i>
                  </div>
                  <h6 className="text-muted mb-3">Henüz ürün eklenmemiş</h6>
                  <Link to="/admin/products/add" className="btn btn-primary btn-sm px-4">
                    <i className="fas fa-plus me-2"></i>
                    İlk Ürünü Ekle
                  </Link>
                </div>
              )}
              
              {dashboardData.recentProducts.length > 0 && (
                <div className="text-center mt-4">
                  <Link to="/admin/products" className="btn btn-outline-primary btn-sm px-4">
                    <i className="fas fa-arrow-right me-2"></i>
                    Tüm Ürünleri Gör
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 mb-4" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="dashboard-card shadow-lg border-0" style={{ height: '100%', borderRadius: '15px', overflow: 'hidden' }}>
            <div className="card-header bg-gradient-primary text-white" style={{ padding: '20px 24px', border: 'none' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <span className="fw-bold">Kategori Dağılımı</span>
                </h5>
                <span className="fw-bold text-white">
                  {dashboardData.productsByCategory.length} kategori
                </span>
              </div>
            </div>
            <div className="card-body" style={{ padding: '24px' }}> 
              {dashboardData.productsByCategory.length > 0 ? (
                dashboardData.productsByCategory.slice(0, 5).map((category, index) => (
                  <div key={index} className="category-item bg-white rounded-3 shadow-sm p-3 mb-3 hover-lift"
                       style={{ transition: 'all 0.3s ease', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center flex-grow-1">
                        <div className="category-icon bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                             style={{ width: '50px', height: '50px' }}>
                          <i className="fas fa-tag text-success fs-5"></i>
                        </div>
                        <div className="category-info">
                          <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>{category.name}</div>
                          <div className="text-muted" style={{ fontSize: '13px' }}>
                            <i className="fas fa-cube me-1"></i> 
                            {category.count} ürün 
                          </div>
                        </div>
                      </div>
                      <div className="category-progress text-end">
                        <div className="text-success fw-bold mb-1" style={{ fontSize: '14px' }}>
                          %{Math.round((category.count / dashboardData.todaysStats.totalProducts) * 100)}
                        </div>
                        <div className="progress" style={{ width: '80px', height: '8px', borderRadius: '10px' }}>
                          <div 
                            className="progress-bar bg-gradient-success" 
                            style={{ 
                              width: `${(category.count / dashboardData.todaysStats.totalProducts) * 100}%`,
                              borderRadius: '10px'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state text-center py-5">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-tags text-success fs-1"></i>
                  </div>
                  <h6 className="text-muted">Kategori bulunamadı</h6>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* İkinci Satır - Sol: Stok Uyarıları, Sağ: Özet Bilgiler */}
        <div className="col-lg-6 col-md-6 mb-4" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="dashboard-card shadow-lg border-0" style={{ height: '100%', borderRadius: '15px', overflow: 'hidden' }}>
            <div className="card-header bg-gradient-primary text-dark" style={{ padding: '20px 24px', border: 'none' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <span className="fw-bold text-white">Stok Uyarıları</span>
                </h5>
                <span className="fw-bold text-white">
                  {dashboardData.stockAlerts.length} uyarı
                </span>
              </div>
            </div>
            <div className="card-body" style={{ padding: '24px' }}>
              {dashboardData.stockAlerts.length > 0 ? (
                dashboardData.stockAlerts.map(alert => (
                  <div key={alert.id} className="alert-item bg-white rounded-3 shadow-sm p-3 mb-3 hover-lift"
                       style={{ transition: 'all 0.3s ease', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center flex-grow-1">
                        <div className={`alert-icon bg-${getStockStatusColor(alert.status)} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3`}
                             style={{ width: '50px', height: '50px' }}>
                          <i className={`fas fa-exclamation-circle text-${getStockStatusColor(alert.status)} fs-5`}></i>
                        </div>
                        <div className="">
                          <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>{alert.product}</div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>
                              {alert.status === 'out' ? (
                                <span className="text-danger">
                                  <i className="fas fa-times-circle me-1"></i>
                                  Stok tükendi
                                </span>
                              ) : (
                                <span className="text-warning">
                                  <i className="fas fa-exclamation-triangle me-1"></i>
                                  {alert.stock} / {alert.minStock} adet kaldı
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      <div className="alert-badge">
                        <span className={`badge bg-${getStockStatusColor(alert.status)} px-3 py-2 fw-bold`}>
                          {alert.status === 'out' ? 'Tükendi' : 'Düşük'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state text-center py-5">
                  <div className="bg-gradient-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-check-circle text-success fs-1"></i>
                  </div>
                  <h6 className="text-success mb-3">Tüm ürünlerin stoku yeterli!</h6>
                  <p className="text-muted small">Herhangi bir stok uyarısı bulunmuyor</p>
                </div>
              )}
              
              {dashboardData.stockAlerts.length > 0 && (
                <div className="text-center mt-4">
                  <Link to="/admin/stock" className="btn btn-outline-warning btn-sm px-4">
                    <i className="fas fa-warehouse me-2"></i>
                    Stok Durumunu Gör
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 mb-4" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="dashboard-card shadow-lg border-0" style={{ height: '100%', borderRadius: '15px', overflow: 'hidden' }}>
            <div className="card-header bg-gradient-primary text-white" style={{ padding: '20px 24px', border: 'none' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <span className="fw-bold">Özet Bilgiler</span>
                </h5>
                <span className="fw-bold text-white">
                  Genel Durum
                </span>
              </div>
            </div>
            <div className="card-body" style={{ padding: '24px' }}>
              <div className="row g-3">
                <div className="col-6">
                  <div className="summary-card bg-white rounded-3 shadow-sm p-3 text-center hover-lift"
                       style={{ transition: 'all 0.3s ease', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                         style={{ width: '50px', height: '50px' }}>
                      <i className="fas fa-check text-success fs-5"></i>
                    </div>
                    <div className="metric-value text-success fw-bold fs-4">
                      {dashboardData.todaysStats.totalProducts - dashboardData.todaysStats.lowStockProducts}
                    </div>
                    <div className="metric-label text-muted small fw-semibold">Normal Stok</div>
                    <div className="metric-change text-success small mt-1">
                      <i className="fas fa-thumbs-up me-1"></i>
                      İyi durumda
                    </div>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="summary-card bg-white rounded-3 shadow-sm p-3 text-center hover-lift"
                       style={{ transition: 'all 0.3s ease', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                         style={{ width: '50px', height: '50px' }}>
                      <i className="fas fa-exclamation text-warning fs-5"></i>
                    </div>
                    <div className="metric-value text-warning fw-bold fs-4">
                      {dashboardData.todaysStats.lowStockProducts}
                    </div>
                    <div className="metric-label text-muted small fw-semibold">Düşük Stok</div>
                    <div className="metric-change text-warning small mt-1">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      Dikkat gerekli
                    </div>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="summary-card bg-white rounded-3 shadow-sm p-3 text-center hover-lift"
                       style={{ transition: 'all 0.3s ease', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                         style={{ width: '50px', height: '50px' }}>
                      <i className="fas fa-tags text-primary fs-5"></i>
                    </div>
                    <div className="metric-value text-primary fw-bold fs-4">
                      {dashboardData.todaysStats.totalCategories}
                    </div>
                    <div className="metric-label text-muted small fw-semibold">Kategori</div>
                    <div className="metric-change text-primary small mt-1">
                      <i className="fas fa-layer-group me-1"></i>
                      Çeşitlilik
                    </div>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="summary-card bg-white rounded-3 shadow-sm p-3 text-center hover-lift"
                       style={{ transition: 'all 0.3s ease', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                         style={{ width: '50px', height: '50px' }}>
                      <i className="fas fa-clock text-secondary fs-5"></i>
                    </div>
                    <div className="metric-value text-secondary fw-bold fs-4">
                      {dashboardData.recentProducts.length}
                    </div>
                    <div className="metric-label text-muted small fw-semibold">Son Eklenen</div>
                    <div className="metric-change text-secondary small mt-1">
                      <i className="fas fa-history me-1"></i>
                      Güncel
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <button 
                  onClick={loadDashboardData}
                  className="btn btn-outline-info btn-sm px-4"
                  disabled={loading}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Verileri Yenile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .bg-gradient-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .bg-gradient-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .bg-gradient-info {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .product-item:hover, .category-item:hover, .alert-item:hover, .summary-card:hover {
          border-color: rgba(0,123,255,0.3) !important;
        }
        
        .progress-bar {
          transition: width 0.6s ease;
        }
        
        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .empty-state {
          padding: 2rem 1rem;
        }
        
        @media (max-width: 768px) {
          .dashboard-card {
            margin-bottom: 1rem;
          }
          
          .card-header {
            padding: 15px 20px !important;
          }
          
          .card-body {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;