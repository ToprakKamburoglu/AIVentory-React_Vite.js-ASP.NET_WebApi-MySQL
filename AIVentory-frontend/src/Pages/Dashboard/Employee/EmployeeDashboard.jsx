import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeDashboard = () => {
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
              <i className="fas fa-lira-sign"></i>
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
        <Link to="/employee/products/add" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-plus"></i>
          </div>
          <div className="quick-action-text">Ürün Ekle</div>
        </Link>

        <Link to="/employee/products" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-search"></i>
          </div>
          <div className="quick-action-text">Ürün Ara</div>
        </Link>

        <Link to="/employee/stock/update" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-edit"></i>
          </div>
          <div className="quick-action-text">Stok Güncelle</div>
        </Link>

        <Link to="/employee/profile" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-user"></i>
          </div>
          <div className="quick-action-text">Profil</div>
        </Link>
      </div>

      <div className="row" style={{ margin: '0 -12px' }}>
        {/* İlk Satır - Sol: Son Eklenen Ürünler, Sağ: Kategori Dağılımı */}
        <div className="col-lg-6 col-md-6 mb-4" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="dashboard-card" style={{ height: '100%' }}>
            <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 className="card-title">
                <i className="fas fa-clock text-main me-2"></i>
                Son Eklenen Ürünler
              </h3>
              <span className="badge badge-main">
                {dashboardData.recentProducts.length} ürün
              </span>
            </div>
            <div className="card-body" style={{ padding: '24px' }}>
              {dashboardData.recentProducts.length > 0 ? (
                dashboardData.recentProducts.map(product => (
                  <div key={product.id} className="d-flex align-items-center py-3 border-bottom" style={{ marginBottom: '16px', paddingBottom: '16px' }}>
                    <div className="me-3">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'cover', 
                            borderRadius: '8px' 
                          }}
                        />
                      ) : (
                        <div 
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <i className="fas fa-image text-gray"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold small" style={{ marginBottom: '4px' }}>{product.name}</div>
                      <div className="text-gray small">
                        {formatPrice(product.price)} • {product.currentStock} adet
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="small text-gray">
                        {formatDate(product.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4" style={{ padding: '32px 16px' }}>
                  <i className="fas fa-box text-gray fs-1 mb-3"></i>
                  <p className="text-gray" style={{ marginBottom: '16px' }}>Henüz ürün eklenmemiş</p>
                  <Link to="/employee/products/add" className="btn btn-sm btn-main">
                    İlk Ürünü Ekle
                  </Link>
                </div>
              )}
              
              {dashboardData.recentProducts.length > 0 && (
                <div className="text-center mt-3" style={{ marginTop: '20px' }}>
                  <Link to="/employee/products" className="btn btn-outline-main btn-sm">
                    Tüm Ürünler
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 mb-4" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="dashboard-card" style={{ height: '100%' }}>
            <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 className="card-title">
                <i className="fas fa-chart-pie text-main me-2"></i>
                Kategori Dağılımı
              </h3>
            </div>
            <div className="card-body" style={{ padding: '24px' }}>
              {dashboardData.productsByCategory.length > 0 ? (
                dashboardData.productsByCategory.slice(0, 5).map((category, index) => (
                  <div key={index} className="d-flex align-items-center justify-content-between py-3 border-bottom" style={{ marginBottom: '16px', paddingBottom: '16px' }}>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <i className="fas fa-tag text-main"></i>
                      </div>
                      <div>
                        <div className="fw-bold" style={{ marginBottom: '4px' }}>{category.name}</div>
                        <div className="small text-gray">{category.count} ürün</div>
                      </div>
                    </div>
                    <div className="progress" style={{ width: '60px', height: '6px' }}>
                      <div 
                        className="progress-bar bg-main" 
                        style={{ 
                          width: `${(category.count / dashboardData.todaysStats.totalProducts) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4" style={{ padding: '32px 16px' }}>
                  <i className="fas fa-tags text-gray fs-1 mb-3"></i>
                  <p className="text-gray">Kategori bulunamadı</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* İkinci Satır - Sol: Stok Uyarıları, Sağ: Özet Bilgiler */}
        <div className="col-lg-6 col-md-6 mb-4" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="dashboard-card" style={{ height: '100%' }}>
            <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 className="card-title">
                <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                Stok Uyarıları
              </h3>
              <span className="badge badge-warning">
                {dashboardData.stockAlerts.length} uyarı
              </span>
            </div>
            <div className="card-body" style={{ padding: '24px' }}>
              {dashboardData.stockAlerts.length > 0 ? (
                dashboardData.stockAlerts.map(alert => (
                  <div key={alert.id} className="d-flex align-items-center justify-content-between py-3 border-bottom" style={{ marginBottom: '16px', paddingBottom: '16px' }}>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <i className={`fas fa-exclamation-circle text-${getStockStatusColor(alert.status)}`}></i>
                      </div>
                      <div>
                        <div className="fw-bold" style={{ marginBottom: '4px' }}>{alert.product}</div>
                        <div className="small text-gray">
                          {alert.status === 'out' ? 'Stok tükendi' : `${alert.stock} / ${alert.minStock} adet`}
                        </div>
                      </div>
                    </div>
                    <span className={`badge badge-${getStockStatusColor(alert.status)}`}>
                      {alert.status === 'out' ? 'Tükendi' : 'Düşük'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4" style={{ padding: '32px 16px' }}>
                  <i className="fas fa-check-circle text-success fs-1 mb-3"></i>
                  <p className="text-success">Tüm ürünlerin stoku yeterli!</p>
                </div>
              )}
              
              {dashboardData.stockAlerts.length > 0 && (
                <div className="text-center mt-3" style={{ marginTop: '20px' }}>
                  <Link to="/employee/products?filter=lowStock" className="btn btn-outline-warning btn-sm">
                    Stok Durumunu Gör
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 mb-4" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="dashboard-card" style={{ height: '100%' }}>
            <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 className="card-title">
                <i className="fas fa-info-circle text-main me-2"></i>
                Özet Bilgiler
              </h3>
            </div>
            <div className="card-body" style={{ padding: '24px' }}>
              <div className="row text-center">
                <div className="col-6 mb-3" style={{ marginBottom: '20px' }}>
                  <div className="performance-metric">
                    <div className="metric-value text-success">
                      {dashboardData.todaysStats.totalProducts - dashboardData.todaysStats.lowStockProducts}
                    </div>
                    <div className="metric-label" style={{ marginTop: '8px', marginBottom: '4px' }}>Normal Stok</div>
                    <div className="metric-change text-success small">
                      <i className="fas fa-check"></i> İyi durumda
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3" style={{ marginBottom: '20px' }}>
                  <div className="performance-metric">
                    <div className="metric-value text-warning">
                      {dashboardData.todaysStats.lowStockProducts}
                    </div>
                    <div className="metric-label" style={{ marginTop: '8px', marginBottom: '4px' }}>Düşük Stok</div>
                    <div className="metric-change text-warning small">
                      <i className="fas fa-exclamation"></i> Dikkat
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3" style={{ marginBottom: '20px' }}>
                  <div className="performance-metric">
                    <div className="metric-value text-main">
                      {dashboardData.todaysStats.totalCategories}
                    </div>
                    <div className="metric-label" style={{ marginTop: '8px', marginBottom: '4px' }}>Kategori</div>
                    <div className="metric-change text-main small">
                      <i className="fas fa-tags"></i> Çeşitlilik
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3" style={{ marginBottom: '20px' }}>
                  <div className="performance-metric">
                    <div className="metric-value text-secondary">
                      {dashboardData.recentProducts.length}
                    </div>
                    <div className="metric-label" style={{ marginTop: '8px', marginBottom: '4px' }}>Son Eklenen</div>
                    <div className="metric-change text-secondary small">
                      <i className="fas fa-clock"></i> Güncel
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-3" style={{ marginTop: '24px' }}>
                <button 
                  onClick={loadDashboardData}
                  className="btn btn-outline-main btn-sm"
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
    </div>
  );
};

export default EmployeeDashboard;