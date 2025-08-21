import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminStockMovements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    in: 0,
    out: 0,
    adjustments: 0
  });

  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6); 

 
  const API_BASE_URL = 'http://localhost:5000/api';

 
  const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) return { success: false, message: 'Empty response' };
      
      return JSON.parse(text);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };


  const fetchStockMovements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint = '/stock/movements';
      const params = new URLSearchParams();
      
      if (selectedProduct) {
        params.append('productId', selectedProduct);
      }
      
      if (filterType !== 'all') {
        params.append('movementType', filterType);
      }
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      console.log('Fetching stock movements:', endpoint);
      
      const result = await apiRequest(endpoint);
      console.log('Stock movements API Response:', result);
      
      if (result.success) {
        setMovements(result.data || []);
        calculateStats(result.data || []);
      } else {
        setError(result.message || 'Stok hareketleri yüklenemedi');
      }
    } catch (err) {
      console.error('Fetch stock movements error:', err);
      setError('Stok hareketleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  
  const fetchProducts = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      const result = await apiRequest(`/stock?companyId=${companyId}`);
      
      if (result.success && result.data && result.data.data) {
        const uniqueProducts = result.data.data.reduce((acc, item) => {
          if (!acc.find(p => p.id === item.id)) {
            acc.push({
              id: item.id,
              name: item.productName
            });
          }
          return acc;
        }, []);
        setProducts(uniqueProducts);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  };

 
  const calculateStats = (movementsData) => {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
      total: movementsData.length,
      today: movementsData.filter(m => m.createdAt && m.createdAt.includes(today)).length,
      in: movementsData.filter(m => m.movementType === 'in').length,
      out: movementsData.filter(m => m.movementType === 'out').length,
      adjustments: movementsData.filter(m => m.movementType === 'adjustment').length
    };
    
    setStats(stats);
  };

 
  useEffect(() => {
    fetchStockMovements();
    fetchProducts();
  }, [selectedProduct, filterType]);

 
  const filteredMovements = movements.filter(movement => {
   
    if (filterDate && movement.createdAt) {
      const movementDate = movement.createdAt.split('T')[0];
      if (movementDate !== filterDate) return false;
    }
    
  
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!movement.productName?.toLowerCase().includes(searchLower) &&
          !movement.reason?.toLowerCase().includes(searchLower) &&
          !movement.notes?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });

 
  const totalPages = Math.ceil(filteredMovements.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMovements = filteredMovements.slice(startIndex, endIndex);


  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterDate, searchTerm, selectedProduct]);

 
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Bilinmiyor';
    
    try {
      const date = new Date(dateString);
      const dateStr = date.toLocaleDateString('tr-TR');
      const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      return { date: dateStr, time: timeStr };
    } catch {
      return { date: 'Geçersiz tarih', time: '' };
    }
  };





  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <p className="mt-3 text-gray">Stok hareketleri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="stock-movements-page">
      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

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
          <button className="btn btn-main" onClick={() => window.print()}>
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
      <div className="dashboard-card mb-4 p-1">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <div className="header-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Ürün veya sebep ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
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
              <select
                className="form-control form-select"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Tüm Ürünler</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={fetchStockMovements}
              >
                <i className="fas fa-sync me-2"></i>
                Yenile
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
              <th className="text-center">Hareket Tipi</th>
              <th className="text-center">Ürün</th>
              <th className="text-center">Miktar</th>
              <th className="text-center">Önceki Stok</th>
              <th className="text-center">Yeni Stok</th>
              <th className="text-center">Birim Maliyet</th>
              <th className="text-center">Toplam Maliyet</th>
              <th className="text-center">Sebep</th>
              <th className="text-center">Notlar</th>
              <th className="text-center">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMovements.map(movement => {
              const { date, time } = formatDate(movement.createdAt);
              return (
                <tr key={movement.id}>
                  <td>
                    <span className={`badge badge-${getMovementColor(movement.movementType)}`}>
                      <i className={`${getMovementIcon(movement.movementType)} me-1`}></i>
                      {getMovementText(movement.movementType)}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="fw-bold">{movement.productName || 'Bilinmiyor'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className={`fw-bold ${
                      movement.movementType === 'in' ? 'text-success' : 
                      movement.movementType === 'out' ? 'text-danger' : 
                      'text-warning'
                    }`}>
                      {movement.movementType === 'in' ? '+' : 
                       movement.movementType === 'out' ? '-' : '±'}
                      {movement.quantity || 0}
                    </span>
                  </td>
                  <td className="text-center">{movement.previousStock || 0}</td>
                  <td className="text-center">
                    <span className="fw-bold">{movement.newStock || 0}</span>
                  </td>
                  <td className="text-center">
                    {movement.unitCost ? `₺${movement.unitCost.toFixed(2)}` : '-'}
                  </td>
                  <td className="text-center">
                    {movement.totalCost ? `₺${movement.totalCost.toFixed(2)}` : '-'}
                  </td>
                  <td className="text-center">
                    <small className="text-center fw-bold">{movement.reason || 'Belirtilmemiş'}</small>
                  </td>
                  <td className="text-center">
                    <small className="text-center">{movement.notes || '-'}</small>
                  </td>
                  <td>
                    <div className="small">
                      <div>{date}</div>
                      <div className="text-center">{time}</div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination ve Info */}
      {filteredMovements.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <small className="text-gray">
            Toplam {filteredMovements.length} kayıttan {startIndex + 1}-{Math.min(endIndex, filteredMovements.length)} arası gösteriliyor
          </small>
          
          {totalPages > 1 && (
            <nav aria-label="Stok hareketleri pagination">
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                </li>
                
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}

      {paginatedMovements.length === 0 && !loading && (
        <div className="text-center py-5">
          <i className="fas fa-search text-gray fs-1 mb-3"></i>
          <h5 className="text-gray">Hareket bulunamadı</h5>
          <p className="text-gray">
            {searchTerm || filterDate || selectedProduct || filterType !== 'all' 
              ? 'Arama kriterlerinizi değiştirin' 
              : 'Henüz stok hareketi kaydı yok'}
          </p>
        </div>
      )}


    </div>
  );
};

export default AdminStockMovements;