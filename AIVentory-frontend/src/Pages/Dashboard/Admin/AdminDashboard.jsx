
import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats] = useState({
    totalProducts: 1247,
    criticalStock: 23,
    dailySales: 12450,
    totalUsers: 8,
    monthlyRevenue: 185300,
    aiAnalyses: 156
  });

  const [recentActivities] = useState([
    { id: 1, user: 'Ayşe Kaya', action: 'iPhone 15 Pro ürününü ekledi', time: '5 dakika önce', type: 'product' },
    { id: 2, user: 'Mehmet Yılmaz', action: 'Stok sayımı yaptı', time: '12 dakika önce', type: 'stock' },
    { id: 3, user: 'AI Sistemi', action: 'Samsung Galaxy için fiyat önerisi', time: '18 dakika önce', type: 'ai' },
    { id: 4, user: 'Fatma Demir', action: '15 adet Coca Cola satışı', time: '23 dakika önce', type: 'sale' }
  ]);

  const [criticalProducts] = useState([
    { id: 1, name: 'iPhone 15 Pro', currentStock: 3, minStock: 5, status: 'critical' },
    { id: 2, name: 'Samsung Galaxy S24', currentStock: 2, minStock: 3, status: 'low' },
    { id: 3, name: 'AirPods Pro', currentStock: 0, minStock: 10, status: 'out' },
    { id: 4, name: 'MacBook Air M2', currentStock: 1, minStock: 2, status: 'critical' }
  ]);

  const [topProducts] = useState([
    { id: 1, name: 'iPhone 15', sales: 45, revenue: 2025000 },
    { id: 2, name: 'Samsung Galaxy S24', sales: 38, revenue: 1330000 },
    { id: 3, name: 'AirPods', sales: 67, revenue: 469000 },
    { id: 4, name: 'PowerBank', sales: 89, revenue: 267000 }
  ]);

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'danger';
      case 'low': return 'warning';
      case 'out': return 'danger';
      default: return 'success';
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case 'critical': return 'Kritik';
      case 'low': return 'Düşük';
      case 'out': return 'Tükendi';
      default: return 'Normal';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'product': return 'fas fa-box';
      case 'stock': return 'fas fa-warehouse';
      case 'ai': return 'fas fa-robot';
      case 'sale': return 'fas fa-shopping-cart';
      default: return 'fas fa-info-circle';
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="text-main mb-2">
              Hoş geldin, {user?.firstName}! 👋
            </h1>
            <p className="text-gray mb-0">
              İşte AIVentory sisteminizin bugünkü özeti. Tüm operasyonları buradan yönetebilirsiniz.
            </p>
          </div>
          <div className="col-md-4 text-end">
            <div className="date-info">
              <div className="text-main fw-bold">{new Date().toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
              <div className="text-gray small">Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}</div>
            </div>
          </div>
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
          <div className="stat-value">{stats.totalProducts.toLocaleString()}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            +12% bu ay
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-title">Kritik Stok</div>
            <div className="stat-icon warning">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="stat-value">{stats.criticalStock}</div>
          <div className="stat-change negative">
            <i className="fas fa-arrow-down"></i>
            -3 bu hafta
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-title">Günlük Satış</div>
            <div className="stat-icon success">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <div className="stat-value">₺{stats.dailySales.toLocaleString()}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            +8% dün
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Toplam Kullanıcı</div>
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            +2 bu ay
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Aylık Ciro</div>
            <div className="stat-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="stat-value">₺{stats.monthlyRevenue.toLocaleString()}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            +15% geçen ay
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">AI Analizleri</div>
            <div className="stat-icon">
              <i className="fas fa-robot"></i>
            </div>
          </div>
          <div className="stat-value">{stats.aiAnalyses}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            +24% bu hafta
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

        <Link to="/admin/ai/recognition" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-camera"></i>
          </div>
          <div className="quick-action-text">AI Analizi</div>
        </Link>

        <Link to="/admin/stock" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-warehouse"></i>
          </div>
          <div className="quick-action-text">Stok Kontrolü</div>
        </Link>

        <Link to="/admin/users/add" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-user-plus"></i>
          </div>
          <div className="quick-action-text">Kullanıcı Ekle</div>
        </Link>

        <Link to="/admin/reports/sales" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="quick-action-text">Raporlar</div>
        </Link>

        <Link to="/admin/settings" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-cog"></i>
          </div>
          <div className="quick-action-text">Ayarlar</div>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="row">
        {/* Critical Stock Alert */}
        <div className="col-lg-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                Kritik Stok Uyarıları
              </h3>
              <Link to="/admin/stock" className="btn btn-sm btn-outline-main">
                Tümünü Gör
              </Link>
            </div>
            <div className="card-body">
              {criticalProducts.map(product => (
                <div key={product.id} className="d-flex align-items-center justify-content-between py-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="fas fa-box text-main"></i>
                    </div>
                    <div>
                      <div className="fw-bold">{product.name}</div>
                      <div className="small text-gray">
                        Mevcut: {product.currentStock} | Min: {product.minStock}
                      </div>
                    </div>
                  </div>
                  <span className={`badge badge-${getStockStatusColor(product.status)}`}>
                    {getStockStatusText(product.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="col-lg-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-history text-main me-2"></i>
                Son Aktiviteler
              </h3>
              <Link to="/admin/activities" className="btn btn-sm btn-outline-main">
                Tümünü Gör
              </Link>
            </div>
            <div className="card-body">
              {recentActivities.map(activity => (
                <div key={activity.id} className="d-flex align-items-start py-3 border-bottom">
                  <div className="me-3 mt-1">
                    <i className={`${getActivityIcon(activity.type)} text-main`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold small">{activity.user}</div>
                    <div className="text-gray small">{activity.action}</div>
                    <div className="text-muted small">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="col-lg-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-star text-warning me-2"></i>
                En Çok Satan Ürünler
              </h3>
              <Link to="/admin/reports/sales" className="btn btn-sm btn-outline-main">
                Detaylı Rapor
              </Link>
            </div>
            <div className="card-body">
              {topProducts.map((product, index) => (
                <div key={product.id} className="d-flex align-items-center justify-content-between py-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <span className={`badge badge-${index === 0 ? 'success' : index === 1 ? 'main' : 'warning'} rounded-pill`}>
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="fw-bold">{product.name}</div>
                      <div className="small text-gray">{product.sales} adet satış</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-success">₺{product.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="col-lg-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-robot text-main me-2"></i>
                AI Önerileri
              </h3>
              <Link to="/admin/ai/recommendations" className="btn btn-sm btn-outline-main">
                Tüm Öneriler
              </Link>
            </div>
            <div className="card-body">
              <div className="ai-recommendation">
                <div className="recommendation-text">
                  iPhone 15 Pro stoğu 3 gün içinde tükenecek. 20 adet sipariş vermenizi öneriyoruz.
                </div>
                <div className="mt-2">
                  <button className="btn btn-sm btn-main me-2">Sipariş Ver</button>
                  <button className="btn btn-sm btn-outline-main">Daha Sonra</button>
                </div>
              </div>

              <div className="ai-recommendation">
                <div className="recommendation-text">
                  PowerBank satışları %35 arttı. Stok artırımı düşünebilirsiniz.
                </div>
                <div className="mt-2">
                  <button className="btn btn-sm btn-secondary me-2">Stok Artır</button>
                  <button className="btn btn-sm btn-outline-main">Analiz Et</button>
                </div>
              </div>

              <div className="ai-recommendation">
                <div className="recommendation-text">
                  Kış ürünleri için hazırlık zamanı. Sezonluk ürün analizini görüntüleyin.
                </div>
                <div className="mt-2">
                  <Link to="/admin/ai/recommendations" className="btn btn-sm btn-main">
                    Analizi Gör
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;