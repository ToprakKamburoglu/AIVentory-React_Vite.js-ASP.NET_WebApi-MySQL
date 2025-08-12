import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const EmployeeStockOverview = () => {
  
  const { user } = useAuth();
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  
 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6;
  
  
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [movementForm, setMovementForm] = useState({
    movementType: 'in',
    quantity: '',
    unitCost: '',
    reason: '',
    notes: ''
  });

 
  const API_BASE_URL = 'http://localhost:5000/api';

 
  useEffect(() => {
    if (user && user.companyId) {
      loadStockData(1);
    }
  }, [user]);

 
  const loadStockData = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
     
      if (!user || !user.companyId) {
        setError('Kullanıcı şirket bilgisi bulunamadı');
        return;
      }
      
      
      let url = `${API_BASE_URL}/stock?page=${page}&pageSize=${pageSize}&companyId=${user.companyId}`;
      
     
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      
      if (filter !== 'all') {
        url += `&stockStatus=${filter}`;
      }
      
      console.log('Stock API URL:', url);
      
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      console.log('Stock API Response:', result);
      
      if (result.success) {
        let stocksData = [];
        
        
        if (result.data && result.data.data && Array.isArray(result.data.data)) {
          stocksData = result.data.data;
          
          
          if (result.data.pagination) {
            setCurrentPage(result.data.pagination.currentPage);
            setTotalPages(result.data.pagination.totalPages);
            setTotalItems(result.data.pagination.totalItems);
          }
        } else if (result.data && Array.isArray(result.data)) {
          stocksData = result.data;
          
          
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedData = stocksData.slice(startIndex, endIndex);
          
          setCurrentPage(page);
          setTotalItems(stocksData.length);
          setTotalPages(Math.ceil(stocksData.length / pageSize));
          stocksData = paginatedData;
        }

        const formattedStocks = stocksData.map(stock => ({
          id: stock.id,
          name: stock.productName,
          category: stock.category,
          currentStock: stock.currentStock || 0,
          reservedStock: stock.reservedStock || 0,
          availableStock: stock.availableStock || 0,
          minStock: stock.minimumStock || 0,
          status: stock.stockStatus,
          lastUpdate: stock.lastStockUpdate ? new Date(stock.lastStockUpdate).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR'),
          price: stock.price || 0,
          totalValue: (stock.price || 0) * (stock.currentStock || 0),
          brand: stock.brand || '',
          barcode: stock.barcode || '',
          companyId: stock.companyId
        }));
        
        setStockData(formattedStocks);
      } else {
        setError(result.message || 'Stok verileri yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Stock API Error:', err);
      setError('Sunucuya bağlanırken hata oluştu. Backend server çalışıyor mu?');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatusInfo = (status) => {
    switch (status) {
      case 'critical':
      case 'low_stock':
        return { color: 'warning', text: 'Düşük', icon: 'fas fa-exclamation-circle' };
      case 'out_of_stock':
        return { color: 'danger', text: 'Tükendi', icon: 'fas fa-times-circle' };
      case 'in_stock':
        return { color: 'success', text: 'Normal', icon: 'fas fa-check-circle' };
      default:
        return { color: 'secondary', text: 'Bilinmiyor', icon: 'fas fa-question-circle' };
    }
  };

  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadStockData(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
    loadStockData(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadStockData(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredData = stockData;

  

  const handleViewDetails = (stock) => {
    setSelectedStock(stock);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedStock(null);
  };

  const handleMovementFormChange = (e) => {
    const { name, value } = e.target;
    setMovementForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleSaveMovement = async () => {
    try {
      const movementData = {
        productId: selectedProduct.id,
        movementType: movementForm.movementType,
        quantity: parseInt(movementForm.quantity),
        unitCost: parseFloat(movementForm.unitCost) || 0,
        reason: movementForm.reason,
        notes: movementForm.notes
      };

      console.log('Stok hareketi verileri:', movementData);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/stock/movement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movementData)
      });
      
      const result = await response.json();
      console.log('Movement API Response:', result);
      
      if (result.success) {
        alert('Stok hareketi başarıyla kaydedildi');
        setShowMovementModal(false);
        setSelectedProduct(null);
        await loadStockData(currentPage);
      } else {
        alert(result.message || 'Stok hareketi kaydedilirken hata oluştu');
      }
    } catch (err) {
      console.error('Movement error:', err);
      alert('Stok hareketi kaydedilirken hata oluştu: ' + err.message);
    }
  };

  const handleCloseMovementModal = () => {
    setShowMovementModal(false);
    setSelectedProduct(null);
    setMovementForm({
      movementType: 'in',
      quantity: '',
      unitCost: '',
      reason: '',
      notes: ''
    });
  };

  const getTotalValue = () => {
    return stockData.reduce((total, item) => total + item.totalValue, 0);
  };

  const getStatusCounts = () => {
    return {
      critical: stockData.filter(item => item.status === 'critical' || item.status === 'low_stock').length,
      out: stockData.filter(item => item.status === 'out_of_stock').length,
      good: stockData.filter(item => item.status === 'in_stock').length
    };
  };

  const handleRefresh = () => {
    loadStockData(currentPage);
  };

 
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;
      
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    };

    return (
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="text-muted">
          Toplam {totalItems} ürünün {Math.min((currentPage - 1) * pageSize + 1, totalItems)}-{Math.min(currentPage * pageSize, totalItems)} arası gösteriliyor
        </div>
        
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </li>
            
            {getPageNumbers().map(pageNum => (
              <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  
  if (!user) {
    return (
      <div className="stock-overview-page">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Kullanıcı bilgileri yükleniyor...</span>
          </div>
          <p className="mt-3 text-gray">Kullanıcı bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

 
  if (loading) {
    return (
      <div className="stock-overview-page">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-3 text-gray">Stok verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

 
  if (error) {
    return (
      <div className="stock-overview-page">
        <div className="alert alert-danger text-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <div className="mt-3">
            <button className="btn btn-outline-danger" onClick={handleRefresh}>
              <i className="fas fa-redo me-2"></i>
              Tekrar Dene
            </button>
          </div>
          <div className="mt-2">
            <small className="text-muted">
              Backend server'ınızın çalıştığından emin olun: http://localhost:5000
            </small>
          </div>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="stock-overview-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pt-4">
        <div>
          <h1 className="text-main mb-2">
            <i className="fas fa-warehouse me-2"></i>
            Stok Durumu
          </h1>
          <p className="text-gray mb-0">
            {user.companyName || 'Şirketinizde'} kayıtlı {totalItems} ürünün stok durumunu görüntüleyin ve yönetin
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={handleRefresh}>
            <i className="fas fa-sync-alt me-2"></i>
            Yenile
          </button>
          <button className="btn btn-outline-secondary">
            <i className="fa-solid fa-file-export me-2"></i>
            Stok Raporu
          </button>
          <Link to="/employee/stock/update" className="btn btn-main">
            <i className="fas fa-edit me-2"></i>
            Stok Güncelle
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
          <div className="stat-value">{totalItems}</div>
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

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-title">Normal Stok</div>
            <div className="stat-icon success">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="stat-value">{statusCounts.good}</div>
          <div className="stat-change positive">
            <i className="fas fa-check"></i>
            İyi durumda
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-title">Toplam Değer</div>
            <div className="stat-icon warning">
              <i className="fa-solid fa-turkish-lira-sign"></i>
            </div>
          </div>
          <div className="stat-value">₺{getTotalValue().toLocaleString()}</div>
          <div className="stat-change positive">
            <i className="fas fa-chart-line"></i>
            Stok değeri
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="header-search d-flex">
                <input
                  type="text"
                  className="search-input flex-grow-1"
                  placeholder="Ürün veya kategori ara..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                />
                <button 
                  className="btn btn-primary ms-2"
                  onClick={handleSearch}
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-control form-select"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="critical">Kritik Stok</option>
                <option value="low_stock">Düşük Stok</option>
                <option value="out_of_stock">Tükendi</option>
                <option value="in_stock">Normal</option>
              </select>
            </div>
            <div className="col-md-4">
              <div className="d-flex gap-2">
                <select 
                  className="form-control form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">İsme Göre Sırala</option>
                  <option value="stock">Stok Miktarına Göre</option>
                  <option value="status">Duruma Göre</option>
                </select>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${viewMode === 'table' ? 'btn-main' : 'btn-outline-main'}`}
                    onClick={() => setViewMode('table')}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                  <button
                    type="button"
                    className={`btn ${viewMode === 'grid' ? 'btn-main' : 'btn-outline-main'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <i className="fas fa-th"></i>
                  </button>
                </div>
                <button 
                  className="btn btn-outline-main"
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                    setSortBy('name');
                    setCurrentPage(1);
                    loadStockData(1);
                  }}
                >
                  <i className="fas fa-undo"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Display */}
      {viewMode === 'table' ? (
        /* Table View */
        <div className="table-container">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Ürün</th>
                <th style={{ textAlign: 'center' }}>Kategori</th>
                <th style={{ textAlign: 'center' }}>Current Stock</th>
                <th style={{ textAlign: 'center' }}>Reserved Stock</th>
                <th style={{ textAlign: 'center' }}>Available Stock</th>
                <th style={{ textAlign: 'center' }}>Minimum Stock</th>
                <th style={{ textAlign: 'center' }}>Durum</th>
                <th style={{ textAlign: 'center' }}>Birim Fiyat</th>
                <th style={{ textAlign: 'center' }}>Toplam Değer</th>
                <th style={{ textAlign: 'center' }}>Son Güncelleme</th>
                <th style={{ textAlign: 'center' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => {
                const statusInfo = getStockStatusInfo(item.status);
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="fw-bold">{item.name}</div>
                          <div className="small text-gray">ID: #{item.id}</div>
                          {item.brand && (
                            <div className="small text-gray">Marka: {item.brand}</div>
                          )}
                          {item.barcode && (
                            <div className="small text-gray">Barkod: {item.barcode}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge badge-outline badge-main">{item.category}</span>
                    </td>
                    <td className="text-center">
                      <span className="fw-bold fs-5 text-primary">{item.currentStock}</span>
                    </td>
                    <td className="text-center">
                      <span className="fw-bold fs-5 text-warning">{item.reservedStock}</span>
                    </td>
                    <td className="text-center">
                      <span className="fw-bold fs-5 text-success">{item.availableStock}</span>
                    </td>
                    <td className="text-center fs-5">{item.minStock}</td>
                    <td>
                      <span className={`badge badge-${statusInfo.color}`}>
                        <i className={`${statusInfo.icon} me-1`}></i>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="text-center">₺{item.price.toLocaleString()}</td>
                    <td className="fw-bold text-center">₺{item.totalValue.toLocaleString()}</td>
                    <td>
                      <div className="small text-center">{item.lastUpdate}</div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link 
                          to="/employee/stock/update"
                          className="btn btn-sm btn-outline-main" 
                          title="Stok Güncelle"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button 
                          className="btn btn-sm btn-outline-main" 
                          title="Detaylar"
                          onClick={() => handleViewDetails(item)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="row">
          {filteredData.map(item => {
            const statusInfo = getStockStatusInfo(item.status);
            return (
              <div key={item.id} className="col-xl-4 col-lg-4 col-md-6 mb-4">
                <div className="dashboard-card product-card h-100 position-relative">
                  {/* Stock Actions - Top Right */}
                  <div className="position-absolute" style={{ top: '12px', right: '12px', zIndex: 10 }}>
                    <div className="dropdown">
                      <button 
                        className="btn btn-sm btn-light shadow-sm dropdown-toggle"
                        data-bs-toggle="dropdown"
                        style={{ border: 'none' }}
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <Link 
                            to="/employee/stock/update"
                            className="dropdown-item"
                          >
                            <i className="fas fa-edit me-2 text-primary"></i>Stok Güncelle
                          </Link>
                        </li>
                        <li>
                          <button 
                            className="dropdown-item"
                            onClick={() => handleViewDetails(item)}
                          >
                            <i className="fas fa-eye me-2 text-info"></i>Detaylar
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="card-body p-3">
                    {/* Product Info */}
                    <div className="text-center mb-3">
                      <h6 className="card-title mb-1 fw-bold text-truncate justify-content-center" title={item.name}>
                        {item.name}
                      </h6> 
                      <p className="text-muted small mb-2">
                        ID: #{item.id}
                      </p>
                      <div className="d-flex justify-content-center gap-2 mb-2">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1">
                          {item.category}
                        </span>
                        {item.brand && (
                          <span className="badge bg-secondary bg-opacity-10 text-secondary px-2 py-1">
                            {item.brand}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Stock Details Grid */}
                    <div className="row g-2 mb-3 justify-content-center">
                      <div className="col-4">
                        <div className="text-center p-2 bg-light rounded-2">
                          <div className="fw-bold text-success fs-6">
                            {item.availableStock}
                          </div>
                          <small className="text-muted">Available</small>
                        </div>
                      </div>
                    </div>

                    {/* Stock Status Bar */}
                    <div className="mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Stok Durumu</small>
                        <span className={`badge badge-${statusInfo.color} px-2`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      <div className="progress" style={{ height: '4px' }}>
                        <div 
                          className={`progress-bar ${
                            item.status === 'in_stock' ? 'bg-success' : 
                            item.status === 'low_stock' ? 'bg-warning' : 'bg-danger'
                          }`}
                          style={{ 
                            width: `${Math.min(100, Math.max(5, (item.currentStock / (item.minStock * 3)) * 100))}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">Birim Fiyat</small>
                        <div className="fw-bold text-success">
                          ₺{item.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">Toplam Değer</small>
                        <div className="fw-bold">
                          ₺{item.totalValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && stockData.length > 0 && <PaginationComponent />}

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-5">
          <i className="fas fa-search text-gray fs-1 mb-3"></i>
          <h5 className="text-gray">Stok verisi bulunamadı</h5>
          <p className="text-gray">Arama kriterlerinizi değiştirin</p>
          <button 
            className="btn btn-main"
            onClick={() => {
              setSearchTerm('');
              setFilter('all');
              setCurrentPage(1);
              loadStockData(1);
            }}
          >
            <i className="fas fa-undo me-2"></i>
            Filtreleri Temizle
          </button>
        </div>
      )}

      {/* Stock Movement Modal */}
      {showMovementModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg pt-5">
            <div className="modal-content ms-auto">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>
                  Stok Güncelle: {selectedProduct?.name}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseMovementModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <div className="alert alert-info">
                      <strong>Mevcut Stok:</strong> {selectedProduct?.currentStock} adet
                      <br />
                      <strong>Minimum Stok:</strong> {selectedProduct?.minStock} adet
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Hareket Türü</label>
                    <select
                      className="form-control"
                      name="movementType"
                      value={movementForm.movementType}
                      onChange={handleMovementFormChange}
                    >
                      <option value="in">Stok Girişi (+)</option>
                      <option value="out">Stok Çıkışı (-)</option>
                      <option value="adjustment">Stok Düzeltme (=)</option>
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      {movementForm.movementType === 'adjustment' ? 'Yeni Stok Miktarı' : 'Miktar'}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={movementForm.quantity}
                      onChange={handleMovementFormChange}
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Birim Maliyet (₺)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="unitCost"
                      value={movementForm.unitCost}
                      onChange={handleMovementFormChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Sebep</label>
                    <select
                      className="form-control"
                      name="reason"
                      value={movementForm.reason}
                      onChange={handleMovementFormChange}
                    >
                      <option value="">Sebep Seçin</option>
                      <option value="purchase">Satın Alma</option>
                      <option value="sale">Satış</option>
                      <option value="return">İade</option>
                      <option value="damage">Hasar</option>
                      <option value="loss">Kayıp</option>
                      <option value="correction">Düzeltme</option>
                      <option value="transfer">Transfer</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">Notlar</label>
                    <textarea
                      className="form-control"
                      name="notes"
                      rows="3"
                      value={movementForm.notes}
                      onChange={handleMovementFormChange}
                      placeholder="İsteğe bağlı açıklama..."
                    ></textarea>
                  </div>
                </div>
                
                {/* Preview */}
                {movementForm.quantity && (
                  <div className="alert alert-warning">
                    <div className="d-flex justify-content-between">
                      <span>
                        {movementForm.movementType === 'in' && `Yeni Stok: ${selectedProduct?.currentStock + parseInt(movementForm.quantity || 0)} adet`}
                        {movementForm.movementType === 'out' && `Yeni Stok: ${Math.max(0, selectedProduct?.currentStock - parseInt(movementForm.quantity || 0))} adet`}
                        {movementForm.movementType === 'adjustment' && `Yeni Stok: ${movementForm.quantity} adet`}
                      </span>
                      {movementForm.unitCost && (
                        <strong>
                          Toplam Maliyet: ₺{(parseFloat(movementForm.unitCost) * parseInt(movementForm.quantity || 0)).toLocaleString()}
                        </strong>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseMovementModal}
                >
                  <i className="fas fa-times me-2"></i>
                  İptal
                </button>
                <button 
                  type="button" 
                  className="btn btn-main"
                  onClick={handleSaveMovement}
                  disabled={!movementForm.quantity}
                >
                  <i className="fas fa-save me-2"></i>
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Details Modal */}
      {showDetailsModal && selectedStock && (
        <div 
          className="modal fade show d-block" 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            overflow: 'auto',
            paddingTop: '130px',
            paddingRight: '30px',
          }}
          onClick={handleCloseDetailsModal}
        >
          <div 
            className="modal-dialog modal-lg"
            style={{
              margin: '20px auto',
              maxWidth: '90vw',
              width: '800px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content ms-auto" style={{ maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-warehouse me-2"></i>
                  Stok Detayları
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseDetailsModal}
                ></button>
              </div>
              <div className="modal-body p-0" style={{ overflow: 'auto', flex: 1 }}>
                {/* Stock Header */}
                <div className="bg-light p-4 border-bottom">
                  <div className="row align-items-center">
                    <div className="col-md-3 text-center">
                      <div 
                        className="rounded-3 bg-white border d-flex align-items-center justify-content-center shadow-sm"
                        style={{ 
                          width: '150px', 
                          height: '150px',
                          margin: '0 auto'
                        }}
                      >
                        <i className="fas fa-box text-main" style={{ fontSize: '3rem' }}></i>
                      </div>
                    </div>
                    <div className="col-md-9 text-end">
                      <h3 className="mb-2 text-primary">{selectedStock.name}</h3>
                      <p className="text-muted mb-3">ID: #{selectedStock.id}</p>
                      <div className="d-flex gap-2 mb-2 justify-content-end">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                          {selectedStock.category}
                        </span>
                        {selectedStock.brand && (
                          <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                            {selectedStock.brand}
                          </span>
                        )}
                        <span className={`badge bg-${getStockStatusInfo(selectedStock.status).color} px-3 py-2`}>
                          {getStockStatusInfo(selectedStock.status).text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Details */}
                <div className="p-4">
                  <div className="row">
                    {/* Stock Information */}
                    <div className="col-md-6 mb-4">
                      <h6 className="text-primary mb-3">
                        <i className="fas fa-boxes me-2"></i>
                        Stok Bilgileri
                      </h6>
                      <div className="bg-light rounded p-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Current Stock:</span>
                          <strong className="text-primary">{selectedStock.currentStock} adet</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Reserved Stock:</span>
                          <strong className="text-warning">{selectedStock.reservedStock} adet</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Available Stock:</span>
                          <strong className="text-success">{selectedStock.availableStock} adet</strong>
                        </div>
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between">
                          <span>Minimum Stok:</span>
                          <strong className="text-warning">{selectedStock.minStock} adet</strong>
                        </div>
                        
                        {/* Stock Level Bar */}
                        <div className="mt-3">
                          <small className="text-muted">Stok Seviyesi</small>
                          <div className="progress mt-1" style={{ height: '8px' }}>
                            <div 
                              className={`progress-bar ${
                                selectedStock.status === 'in_stock' ? 'bg-success' : 
                                selectedStock.status === 'low_stock' ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ 
                                width: `${Math.min(100, Math.max(5, (selectedStock.currentStock / (selectedStock.minStock * 3)) * 100))}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Value Information */}
                    <div className="col-md-6 mb-4">
                      <h6 className="text-primary mb-3">
                        <i className="fas fa-dollar-sign me-2"></i>
                        Değer Bilgileri
                      </h6>
                      <div className="bg-light rounded p-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Birim Fiyat:</span>
                          <strong className="text-success">₺{selectedStock.price.toLocaleString('tr-TR')}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Toplam Değer:</span>
                          <strong className="text-success">₺{selectedStock.totalValue.toLocaleString('tr-TR')}</strong>
                        </div>
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between">
                          <span>Kategori:</span>
                          <strong>{selectedStock.category}</strong>
                        </div>
                        {selectedStock.brand && (
                          <div className="d-flex justify-content-between mt-2">
                            <span>Marka:</span>
                            <strong>{selectedStock.brand}</strong>
                          </div>
                        )}
                        {selectedStock.barcode && (
                          <div className="d-flex justify-content-between mt-2">
                            <span>Barkod:</span>
                            <strong>{selectedStock.barcode}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline Information */}
                    <div className="col-md-12 mb-4">
                      <h6 className="text-primary mb-3">
                        <i className="fas fa-calendar me-2"></i>
                        Tarih Bilgileri
                      </h6>
                      <div className="bg-light rounded p-3">
                        <div className="d-flex justify-content-between">
                          <span>Son Güncelleme:</span>
                          <strong>{selectedStock.lastUpdate}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link 
                  to="/employee/stock/update"
                  className="btn btn-outline-primary"
                  onClick={handleCloseDetailsModal}
                >
                  <i className="fas fa-edit me-2"></i>
                  Stok Güncelle
                </Link>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseDetailsModal}
                >
                  <i className="fas fa-times me-2"></i>
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style>{`
        .table-custom tbody tr:hover {
          background-color: var(--bg-light-a);
        }
        
        .fs-5 {
          font-size: 1.25rem !important;
        }
        
        .alert-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
        }
        
        .product-card {
          transition: transform 0.2s ease-in-out;
        }
        
        .product-card:hover {
          transform: translateY(-2px);
        }
        
        .stock-level-bar {
          height: 4px;
          background-color: #e9ecef;
          border-radius: 2px;
          overflow: hidden;
        }
        
        .stock-level-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        
        .stock-level-fill.high {
          background-color: #28a745;
        }
        
        .stock-level-fill.medium {
          background-color: #ffc107;
        }
        
        .stock-level-fill.low {
          background-color: #dc3545;
        }
        
        .ai-recommendation {
          padding: 0.75rem;
          background-color: rgba(59, 130, 246, 0.05);
          border-left: 3px solid var(--primary-color);
          border-radius: 0.25rem;
        }
        
        .recommendation-text {
          font-size: 0.875rem;
          margin: 0;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .table-container {
            overflow-x: auto;
          }
          
          .modal-dialog {
            margin: 10px;
            max-width: calc(100vw - 20px);
            width: auto;
          }
        }
        
        @media (max-width: 480px) {
          .dashboard-stats {
            grid-template-columns: 1fr;
          }
          
          .btn-group {
            flex-direction: column;
          }
          
          .btn-group .btn {
            border-radius: var(--border-radius-sm) !important;
            margin-bottom: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeStockOverview;