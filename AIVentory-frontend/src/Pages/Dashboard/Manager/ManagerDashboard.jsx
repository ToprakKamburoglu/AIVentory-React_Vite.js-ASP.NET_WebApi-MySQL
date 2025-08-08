import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats] = useState({
    totalProducts: 1247,
    criticalStock: 23,
    dailySales: 12450,
    weeklyTarget: 85000,
    completedTasks: 12,
    pendingTasks: 8
  });

  const [todaysTasks] = useState([
    { id: 1, title: 'Stok sayımı yap', priority: 'high', completed: false, dueTime: '10:00' },
    { id: 2, title: 'Yeni ürün fiyatlarını kontrol et', priority: 'medium', completed: true, dueTime: '11:30' },
    { id: 3, title: 'Tedarikçi ile görüşme', priority: 'high', completed: false, dueTime: '14:00' },
    { id: 4, title: 'Haftalık raporu hazırla', priority: 'medium', completed: false, dueTime: '16:00' },
    { id: 5, title: 'AI analiz sonuçlarını incele', priority: 'low', completed: true, dueTime: '17:00' }
  ]);

  const [stockAlerts] = useState([
    { id: 1, product: 'iPhone 15 Pro', currentStock: 3, minStock: 5, urgency: 'critical' },
    { id: 2, product: 'Samsung Galaxy S24', currentStock: 2, minStock: 3, urgency: 'high' },
    { id: 3, product: 'AirPods Pro', currentStock: 0, minStock: 10, urgency: 'critical' },
    { id: 4, product: 'MacBook Air M2', currentStock: 1, minStock: 2, urgency: 'high' }
  ]);

  const [salesTargets] = useState({
    daily: { target: 15000, achieved: 12450, percentage: 83 },
    weekly: { target: 85000, achieved: 67200, percentage: 79 },
    monthly: { target: 350000, achieved: 185300, percentage: 53 }
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'success';
    }
  }; 

  const toggleTaskComplete = (taskId) => {
    console.log('Toggle task:', taskId);
  };
  
  return (
    <div className="manager-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="text-main mb-2">
              Merhaba {user?.firstName}! 📊
            </h1>
            <p className="text-gray mb-0">
              Bugünkü operasyonlara genel bakış. Öncelikli görevleriniz ve kritik stok durumları aşağıda.
            </p>
          </div>
          <div className="col-md-4 text-end">
            <div className="quick-stats">
              <div className="text-main fw-bold">Bugünkü Hedef</div>
              <div className="text-gray">₺{salesTargets.daily.target.toLocaleString()}</div>
              <div className="progress progress-sm mt-2">
                <div 
                  className="progress-bar bg-main" 
                  style={{ width: `${salesTargets.daily.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Günlük Satış</div>
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <div className="stat-value">₺{stats.dailySales.toLocaleString()}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            {salesTargets.daily.percentage}% tamamlandı
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
            <i className="fas fa-arrow-up"></i>
            Acil aksyon gerekli
          </div>
        </div>

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
            +12 bu hafta
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-title">Tamamlanan Görevler</div>
            <div className="stat-icon success">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="stat-value">{stats.completedTasks}</div>
          <div className="stat-change positive">
            <i className="fas fa-tasks"></i>
            {stats.pendingTasks} beklemede
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/manager/products/add" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-plus"></i>
          </div>
          <div className="quick-action-text">Ürün Ekle</div>
        </Link>

        <Link to="/manager/stock" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-warehouse"></i>
          </div>
          <div className="quick-action-text">Stok Kontrolü</div>
        </Link>

        <Link to="/manager/ai/recognition" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-camera"></i>
          </div>
          <div className="quick-action-text">AI Analizi</div>
        </Link>

        <Link to="/manager/reports/sales" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="quick-action-text">Satış Raporu</div>
        </Link>

        <Link to="/manager/categories" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-tags"></i>
          </div>
          <div className="quick-action-text">Kategoriler</div>
        </Link>

        <Link to="/manager/stock/predictions" className="quick-action-btn">
          <div className="quick-action-icon">
            <i className="fas fa-crystal-ball"></i>
          </div>
          <div className="quick-action-text">Stok Tahminleri</div>
        </Link>
      </div>

      <div className="row">
        {/* Today's Tasks */}
        <div className="col-lg-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-tasks text-main me-2"></i>
                Bugünkü Görevler
              </h3>
              <span className="badge badge-main">{todaysTasks.filter(t => !t.completed).length} beklemede</span>
            </div>
            <div className="card-body">
              {todaysTasks.map(task => (
                <div key={task.id} className="d-flex align-items-center py-3 border-bottom">
                  <div className="me-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={task.completed}
                      onChange={() => toggleTaskComplete(task.id)}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className={`fw-bold ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                      {task.title}
                    </div>
                    <div className="small text-gray">
                      <i className="fas fa-clock me-1"></i>
                      {task.dueTime}
                    </div>
                  </div>
                  <span className={`badge badge-${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </span>
                </div>
              ))}
              <div className="text-center mt-3">
                <Link to="/manager/tasks" className="btn btn-outline-main btn-sm">
                  Tüm Görevleri Gör
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Stock Alerts */}
        <div className="col-lg-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-exclamation-triangle text-danger me-2"></i>
                Kritik Stok Uyarıları
              </h3>
              <Link to="/manager/stock" className="btn btn-sm btn-outline-main">
                Stok Yönetimine Git
              </Link>
            </div>
            <div className="card-body">
              {stockAlerts.map(alert => (
                <div key={alert.id} className="d-flex align-items-center justify-content-between py-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className={`fas fa-exclamation-circle text-${getUrgencyColor(alert.urgency)}`}></i>
                    </div>
                    <div>
                      <div className="fw-bold">{alert.product}</div>
                      <div className="small text-gray">
                        Mevcut: {alert.currentStock} | Min: {alert.minStock}
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <button className="btn btn-sm btn-main">
                      Sipariş Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Targets */}
        <div className="col-lg-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-target text-main me-2"></i>
                Satış Hedefleri
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold">Günlük Hedef</div>
                    <div className="text-main fw-bold">{salesTargets.daily.percentage}%</div>
                  </div>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar bg-main" 
                      style={{ width: `${salesTargets.daily.percentage}%` }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between small text-gray">
                    <span>₺{salesTargets.daily.achieved.toLocaleString()}</span>
                    <span>₺{salesTargets.daily.target.toLocaleString()}</span>
                  </div>
                </div>

                <div className="col-12 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold">Haftalık Hedef</div>
                    <div className="text-secondary fw-bold">{salesTargets.weekly.percentage}%</div>
                  </div>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar bg-secondary" 
                      style={{ width: `${salesTargets.weekly.percentage}%` }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between small text-gray">
                    <span>₺{salesTargets.weekly.achieved.toLocaleString()}</span>
                    <span>₺{salesTargets.weekly.target.toLocaleString()}</span>
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold">Aylık Hedef</div>
                    <div className="text-warning fw-bold">{salesTargets.monthly.percentage}%</div>
                  </div>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar bg-warning" 
                      style={{ width: `${salesTargets.monthly.percentage}%` }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between small text-gray">
                    <span>₺{salesTargets.monthly.achieved.toLocaleString()}</span>
                    <span>₺{salesTargets.monthly.target.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="col-lg-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-robot text-main me-2"></i>
                AI Öngörüleri
              </h3>
              <Link to="/manager/ai/recommendations" className="btn btn-sm btn-outline-main">
                Detaylar
              </Link>
            </div>
            <div className="card-body">
              <div className="ai-recommendation mb-3">
                <div className="d-flex align-items-start">
                  <div className="me-3 mt-1">
                    <i className="fas fa-chart-line text-success"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-success small">Satış Artışı Tahmini</div>
                    <div className="small text-gray">
                      PowerBank kategorisinde %35 artış bekleniyor. Stok artırımı öneriliyor.
                    </div>
                  </div>
                </div>
              </div>

              <div className="ai-recommendation mb-3">
                <div className="d-flex align-items-start">
                  <div className="me-3 mt-1">
                    <i className="fas fa-clock text-warning"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-warning small">Stok Tükenme Uyarısı</div>
                    <div className="small text-gray">
                      iPhone 15 Pro stoğu 3-4 gün içinde tükenecek.
                    </div>
                  </div>
                </div>
              </div>

              <div className="ai-recommendation">
                <div className="d-flex align-items-start">
                  <div className="me-3 mt-1">
                    <i className="fas fa-snowflake text-info"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-info small">Sezonluk Trend</div>
                    <div className="small text-gray">
                      Kış ürünleri için hazırlık zamanı yaklaşıyor.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="col-lg-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-plus-circle text-success me-2"></i>
                Son Eklenen Ürünler
              </h3>
              <Link to="/manager/products" className="btn btn-sm btn-outline-main">
                Tüm Ürünler
              </Link>
            </div>
            <div className="card-body">
              <div className="recent-product mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="fas fa-box text-main"></i>
                    </div>
                    <div>
                      <div className="fw-bold small">iPhone 15 Pro Max</div>
                      <div className="text-gray small">2 saat önce eklendi</div>
                    </div>
                  </div>
                  <Link to="/manager/products/edit/1" className="btn btn-sm btn-outline-main">
                    <i className="fas fa-edit"></i>
                  </Link>
                </div>
              </div>

              <div className="recent-product mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="fas fa-box text-main"></i>
                    </div>
                    <div>
                      <div className="fw-bold small">Samsung S24 Ultra</div>
                      <div className="text-gray small">5 saat önce eklendi</div>
                    </div>
                  </div>
                  <Link to="/manager/products/edit/2" className="btn btn-sm btn-outline-main">
                    <i className="fas fa-edit"></i>
                  </Link>
                </div>
              </div>

              <div className="recent-product">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="fas fa-box text-main"></i>
                    </div>
                    <div>
                      <div className="fw-bold small">MacBook Pro M3</div>
                      <div className="text-gray small">1 gün önce eklendi</div>
                    </div>
                  </div>
                  <Link to="/manager/products/edit/3" className="btn btn-sm btn-outline-main">
                    <i className="fas fa-edit"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reports */}
        <div className="col-lg-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-chart-pie text-main me-2"></i>
                Hızlı Raporlar
              </h3>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/manager/reports/sales" className="btn btn-outline-main">
                  <i className="fas fa-chart-line me-2"></i>
                  Satış Raporu
                </Link>
                <Link to="/manager/reports/stock" className="btn btn-outline-main">
                  <i className="fas fa-warehouse me-2"></i>
                  Stok Raporu
                </Link>
                <Link to="/manager/reports/ai" className="btn btn-outline-main">
                  <i className="fas fa-robot me-2"></i>
                  AI Analiz Raporu
                </Link>
                <Link to="/manager/stock/movements" className="btn btn-outline-main">
                  <i className="fas fa-history me-2"></i>
                  Stok Hareketleri
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;