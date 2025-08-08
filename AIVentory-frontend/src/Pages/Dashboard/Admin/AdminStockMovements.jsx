import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminStockMovements = () => {
  const [movements] = useState([
    {
      id: 1,
      productName: 'iPhone 15 Pro',
      type: 'in',
      quantity: 10,
      user: 'Ayşe Kaya',
      date: '2024-01-15 14:30',
      reason: 'Yeni sipariş geldi',
      oldStock: 5,
      newStock: 15,
      reference: 'SIP-001'
    },
    {
      id: 2,
      productName: 'Samsung Galaxy S24',
      type: 'out',
      quantity: 3,
      user: 'Mehmet Yılmaz',
      date: '2024-01-15 11:45',
      reason: 'Satış',
      oldStock: 15,
      newStock: 12,
      reference: 'SAT-156'
    },
    {
      id: 3,
      productName: 'AirPods Pro',
      type: 'out',
      quantity: 8,
      user: 'Fatma Demir',
      date: '2024-01-14 16:20',
      reason: 'Toplu satış',
      oldStock: 8,
      newStock: 0,
      reference: 'SAT-155'
    },
    {
      id: 4,
      productName: 'MacBook Air M2',
      type: 'adjustment',
      quantity: -1,
      user: 'Admin',
      date: '2024-01-14 09:15',
      reason: 'Hasar düzeltmesi',
      oldStock: 2,
      newStock: 1,
      reference: 'DUZ-001'
    },
    {
      id: 5,
      productName: 'PowerBank 20000mAh',
      type: 'in',
      quantity: 20,
      user: 'Ayşe Kaya',
      date: '2024-01-13 13:00',
      reason: 'Tedarikçi teslimatı',
      oldStock: 5,
      newStock: 25,
      reference: 'SIP-002'
    },
    {
      id: 6,
      productName: 'iPhone Kılıfı',
      type: 'in',
      quantity: 50,
      user: 'Mehmet Yılmaz',
      date: '2024-01-12 10:30',
      reason: 'Yeni model geldi',
      oldStock: 10,
      newStock: 60,
      reference: 'SIP-003'
    }
  ]);

  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getMovementIcon = (type) => {
    switch (type) {
      case 'in':
        return 'fas fa-arrow-up text-success';
      case 'out':
        return 'fas fa-arrow-down text-danger';
      case 'adjustment':
        return 'fas fa-edit text-warning';
      default:
        return 'fas fa-question text-gray';
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
        return 'Bilinmiyor';
    }
  };

  const getMovementColor = (type) => {
    switch (type) {
      case 'in':
        return 'success';
      case 'out':
        return 'danger';
      case 'adjustment':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const filteredMovements = movements.filter(movement => {
    if (filterType !== 'all' && movement.type !== filterType) return false;
    if (filterDate && !movement.date.includes(filterDate)) return false;
    if (searchTerm && !movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !movement.user.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !movement.reference.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getMovementStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayMovements = movements.filter(m => m.date.includes(today));
    
    return {
      total: movements.length,
      today: todayMovements.length,
      in: movements.filter(m => m.type === 'in').length,
      out: movements.filter(m => m.type === 'out').length,
      adjustments: movements.filter(m => m.type === 'adjustment').length
    };
  };

  const stats = getMovementStats();

  return (
    <div className="stock-movements-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-main mb-2">
            <i className="fas fa-history me-2"></i>
            Stok Hareketleri
          </h1>
          <p className="text-gray mb-0">
            Tüm stok giriş, çıkış ve düzeltme işlemlerini görüntüleyin
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/stock" className="btn btn-outline-main">
            <i className="fas fa-warehouse me-2"></i>
            Stok Durumu
          </Link>
          <button className="btn btn-main">
            <i className="fas fa-download me-2"></i>
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Toplam Hareket</div>
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-change neutral">
            <i className="fas fa-calendar"></i>
            Tüm zamanlar
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-title">Stok Girişi</div>
            <div className="stat-icon success">
              <i className="fas fa-arrow-up"></i>
            </div>
          </div>
          <div className="stat-value">{stats.in}</div>
          <div className="stat-change positive">
            <i className="fas fa-plus"></i>
            Toplam giriş
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-title">Stok Çıkışı</div>
            <div className="stat-icon danger">
              <i className="fas fa-arrow-down"></i>
            </div>
          </div>
          <div className="stat-value">{stats.out}</div>
          <div className="stat-change negative">
            <i className="fas fa-minus"></i>
            Toplam çıkış
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Bugünkü Hareket</div>
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div className="stat-value">{stats.today}</div>
          <div className="stat-change positive">
            <i className="fas fa-calendar-day"></i>
            Bugün yapılan
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <div className="header-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Ürün, kullanıcı veya referans ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-control form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Tüm Hareketler</option>
                <option value="in">Sadece Girişler</option>
                <option value="out">Sadece Çıkışlar</option>
                <option value="adjustment">Sadece Düzeltmeler</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <button 
                className="btn btn-outline-main w-100"
                onClick={() => {
                  setFilterType('all');
                  setFilterDate('');
                  setSearchTerm('');
                }}
              >
                <i className="fas fa-undo me-2"></i>
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="table-container">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Hareket Tipi</th>
              <th>Ürün</th>
              <th>Miktar</th>
              <th>Önceki Stok</th>
              <th>Yeni Stok</th>
              <th>Kullanıcı</th>
              <th>Sebep</th>
              <th>Referans</th>
              <th>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovements.map(movement => (
              <tr key={movement.id}>
                <td>
                  <span className={`badge badge-${getMovementColor(movement.type)}`}>
                    <i className={`${getMovementIcon(movement.type)} me-1`}></i>
                    {getMovementText(movement.type)}
                  </span>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="fas fa-box text-main"></i>
                    </div>
                    <div>
                      <div className="fw-bold">{movement.productName}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`fw-bold ${movement.type === 'in' ? 'text-success' : movement.type === 'out' ? 'text-danger' : 'text-warning'}`}>
                    {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}
                    {Math.abs(movement.quantity)}
                  </span>
                </td>
                <td>{movement.oldStock}</td>
                <td>
                  <span className="fw-bold">{movement.newStock}</span>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="user-avatar-sm me-2">
                      {movement.user.charAt(0)}
                    </div>
                    {movement.user}
                  </div>
                </td>
                <td>
                  <small className="text-gray">{movement.reason}</small>
                </td>
                <td>
                  <code className="small">{movement.reference}</code>
                </td>
                <td>
                  <div className="small">
                    <div>{movement.date.split(' ')[0]}</div>
                    <div className="text-gray">{movement.date.split(' ')[1]}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredMovements.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-search text-gray fs-1 mb-3"></i>
          <h5 className="text-gray">Hareket bulunamadı</h5>
          <p className="text-gray">Arama kriterlerinizi değiştirin</p>
        </div>
      )}

      {/* Movement Analysis */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-chart-pie text-main me-2"></i>
                Hareket Analizi
              </h5>
            </div>
            <div className="card-body">
              <div className="movement-analysis">
                <div className="analysis-item mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-arrow-up text-success me-2"></i>
                      <span>Stok Girişleri</span>
                    </div>
                    <span className="badge badge-success">{stats.in}</span>
                  </div>
                  <div className="progress mt-2">
                    <div 
                      className="progress-bar success" 
                      style={{ width: `${(stats.in / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="analysis-item mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-arrow-down text-danger me-2"></i>
                      <span>Stok Çıkışları</span>
                    </div>
                    <span className="badge badge-danger">{stats.out}</span>
                  </div>
                  <div className="progress mt-2">
                    <div 
                      className="progress-bar danger" 
                      style={{ width: `${(stats.out / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="analysis-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-edit text-warning me-2"></i>
                      <span>Düzeltmeler</span>
                    </div>
                    <span className="badge badge-warning">{stats.adjustments}</span>
                  </div>
                  <div className="progress mt-2">
                    <div 
                      className="progress-bar warning" 
                      style={{ width: `${(stats.adjustments / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-users text-main me-2"></i>
                En Aktif Kullanıcılar
              </h5>
            </div>
            <div className="card-body">
              {/* User activity analysis */}
              <div className="user-activity">
                <div className="activity-item d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <div className="user-avatar-sm me-3">A</div>
                    <div>
                      <div className="fw-bold">Ayşe Kaya</div>
                      <small className="text-gray">En son: 2 saat önce</small>
                    </div>
                  </div>
                  <span className="badge badge-main">12 hareket</span>
                </div>

                <div className="activity-item d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <div className="user-avatar-sm me-3">M</div>
                    <div>
                      <div className="fw-bold">Mehmet Yılmaz</div>
                      <small className="text-gray">En son: 5 saat önce</small>
                    </div>
                  </div>
                  <span className="badge badge-secondary">8 hareket</span>
                </div>

                <div className="activity-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="user-avatar-sm me-3">F</div>
                    <div>
                      <div className="fw-bold">Fatma Demir</div>
                      <small className="text-gray">En son: 1 gün önce</small>
                    </div>
                  </div>
                  <span className="badge badge-success">6 hareket</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStockMovements;