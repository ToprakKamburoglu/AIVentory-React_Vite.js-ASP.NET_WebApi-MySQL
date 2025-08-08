import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const EmployeeStockUpdate = () => {
  const { user } = useAuth();
  

  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [updateMode, setUpdateMode] = useState('single');
  const [stockUpdates, setStockUpdates] = useState({});
  const [reservedUpdates, setReservedUpdates] = useState({});
  const [minimumUpdates, setMinimumUpdates] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkOperation, setBulkOperation] = useState('add');
  const [bulkAmount, setBulkAmount] = useState('');
  const [updateReason, setUpdateReason] = useState('');
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6;

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
      
      if (selectedCategory !== 'all') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
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
        const stockItems = Array.isArray(result.data.data) ? result.data.data : 
                           Array.isArray(result.data) ? result.data : [];
        
        const formattedStockData = stockItems.map(item => ({
          id: item.id,
          productName: item.productName,
          category: item.category,
          brand: item.brand || '',
          barcode: item.barcode || '',
          currentStock: item.currentStock || 0,
          minimumStock: item.minimumStock || 0,
          price: item.price || 0,
          reservedStock: item.reservedStock || 0,
          availableStock: item.availableStock || 0,
          stockStatus: item.stockStatus || 'in_stock',
          lastStockUpdate: item.lastStockUpdate ? new Date(item.lastStockUpdate).toLocaleDateString('tr-TR') : '',
          companyId: item.companyId
        }));
        
        setStockData(formattedStockData);
        
        if (result.data && result.data.pagination) {
          setCurrentPage(result.data.pagination.currentPage);
          setTotalPages(result.data.pagination.totalPages);
          setTotalItems(result.data.pagination.totalItems);
        } else {
          setTotalItems(formattedStockData.length);
        }
        
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

 
  const handleCurrentStockUpdate = async (productId, newCurrentStock) => {
    const stockItem = stockData.find(item => item.id === productId);
    
    if (newCurrentStock === stockItem.currentStock) {
      alert('Current stock değerinde değişiklik yok');
      return;
    }
    
    try {
      const requestData = {
        productId: productId,
        newCurrentStock: newCurrentStock,
        companyId: user.companyId,
        reason: 'Manuel current stock güncelleme'
      };

      console.log('Current stock update data:', requestData);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/stock/update-current-stock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`${stockItem.productName} current stoğu başarıyla güncellendi`);
        
        setStockUpdates(prev => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });

        await loadStockData(currentPage);
      } else {
        alert(result.message || 'Current stock güncellenirken hata oluştu');
      }
    } catch (err) {
      console.error('Current stock update error:', err);
      alert('Current stock güncellenirken hata oluştu: ' + err.message);
    }
  };

  
  const handleReservedStockUpdate = async (productId, newReservedStock) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/stock/update-reserved`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          newReservedStock: newReservedStock,
          companyId: user.companyId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const stockItem = stockData.find(item => item.id === productId);
        alert(`${stockItem.productName} rezerve stoğu güncellendi`);
        
        setReservedUpdates(prev => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });

        await loadStockData(currentPage);
      } else {
        alert(result.message || 'Rezerve stok güncellenirken hata oluştu');
      }
    } catch (err) {
      console.error('Reserved stock update error:', err);
      alert('Rezerve stok güncellenirken hata oluştu: ' + err.message);
    }
  };


  const handleMinimumStockUpdate = async (productId, newMinimumStock) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/stock/update-minimum-stock`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          newMinimumStock: newMinimumStock,
          companyId: user.companyId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const stockItem = stockData.find(item => item.id === productId);
        alert(`${stockItem.productName} minimum stoğu güncellendi`);
        
        setMinimumUpdates(prev => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });

        await loadStockData(currentPage);
      } else {
        alert(result.message || 'Minimum stok güncellenirken hata oluştu');
      }
    } catch (err) {
      console.error('Minimum stock update error:', err);
      alert('Minimum stok güncellenirken hata oluştu: ' + err.message);
    }
  };

 
  const handleBulkUpdate = async () => {
    if (selectedProducts.length === 0 || !bulkAmount || !updateReason) {
      alert('Lütfen ürün seçin, miktar girin ve sebep belirtin');
      return;
    }

    try {
      const amount = parseInt(bulkAmount);
      const updates = [];

      for (const productId of selectedProducts) {
        const stockItem = stockData.find(item => item.id === productId);
        
       
        let newCurrentStock;
        switch (bulkOperation) {
          case 'add':
            newCurrentStock = stockItem.currentStock + amount;
            break;
          case 'subtract':
            newCurrentStock = Math.max(0, stockItem.currentStock - amount); 
            break;
          case 'set':
            newCurrentStock = amount;
            break;
          default:
            continue;
        }

        updates.push({
          productId: productId,
          newCurrentStock: newCurrentStock,
          companyId: user.companyId,
          reason: updateReason
        });
      }

      let successCount = 0;
      for (const update of updates) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/stock/update-current-stock`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(update)
          });
          
          const result = await response.json();
          if (result.success) {
            successCount++;
          }
        } catch (err) {
          console.error('Bulk update item error:', err);
        }
      }

      if (successCount > 0) {
        alert(`${successCount} ürünün stoğu başarıyla güncellendi`);
        
        setSelectedProducts([]);
        setBulkAmount('');
        setUpdateReason('');
        
        await loadStockData(currentPage);
      } else {
        alert('Hiçbir ürünün stoğu güncellenemedi');
      }
    } catch (err) {
      console.error('Bulk update error:', err);
      alert('Toplu güncelleme sırasında hata oluştu: ' + err.message);
    }
  };

 
  const handleBarcodeSearch = async () => {
    if (!barcodeInput.trim()) {
      alert('Lütfen barkod girin');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/products/barcode/${barcodeInput.trim()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        const product = result.data;
        
        const existingStockItem = stockData.find(item => item.id === product.id);
        if (existingStockItem) {
          const productElement = document.getElementById(`stock-${product.id}`);
          if (productElement) {
            productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            productElement.classList.add('highlight');
            setTimeout(() => productElement.classList.remove('highlight'), 2000);
          }
        } else {
          alert(`Ürün bulundu: ${product.name}\nAncak bu stok sayfasında görünmüyor. Arama yaparak bulabilirsiniz.`);
        }

        setShowBarcodeModal(false);
        setBarcodeInput('');
      } else {
        alert('Barkod bulunamadı');
      }
    } catch (err) {
      console.error('Barcode search error:', err);
      alert('Barkod arama sırasında hata oluştu');
    }
  };


  const getStockStatusColor = (stockStatus) => {
    switch (stockStatus) {
      case 'out_of_stock': return 'danger';
      case 'low_stock': return 'warning';
      case 'critical': return 'warning';
      case 'in_stock': return 'success';
      default: return 'secondary';
    }
  };

  const getStockStatusText = (stockStatus) => {
    switch (stockStatus) {
      case 'out_of_stock': return 'Tükendi';
      case 'low_stock': return 'Düşük';
      case 'critical': return 'Kritik';
      case 'in_stock': return 'Normal';
      default: return 'Bilinmiyor';
    }
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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
    loadStockData(1);
  };

  const handleStockChange = (productId, newStock) => {
    setStockUpdates(prev => ({
      ...prev,
      [productId]: parseInt(newStock) || 0
    }));
  };

  const handleReservedChange = (productId, newReserved) => {
    setReservedUpdates(prev => ({
      ...prev,
      [productId]: parseInt(newReserved) || 0
    }));
  };

  const handleMinimumChange = (productId, newMinimum) => {
    setMinimumUpdates(prev => ({
      ...prev,
      [productId]: parseInt(newMinimum) || 0
    }));
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === stockData.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(stockData.map(item => item.id));
    }
  };

  const handleRefresh = () => {
    loadStockData(currentPage);
  };

  const categories = ['Elektronik', 'Gıda', 'Giyim', 'Kozmetik', 'Ev & Yaşam'];

  
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
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    loadStockData(currentPage - 1);
                  }
                }}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </li>
            
            {getPageNumbers().map(pageNum => (
              <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => {
                    setCurrentPage(pageNum);
                    loadStockData(pageNum);
                  }}
                >
                  {pageNum}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                    loadStockData(currentPage + 1);
                  }
                }}
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
      <div className="stock-update-page">
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
      <div className="stock-update-page">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-3 text-gray">Şirket stok verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

 
  if (error) {
    return (
      <div className="stock-update-page">
        <div className="alert alert-danger text-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <div className="mt-3">
            <button className="btn btn-outline-danger" onClick={handleRefresh}>
              <i className="fas fa-redo me-2"></i>
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-update-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pt-4">
        <div>
          <h1 className="text-main mb-2">
            <i className="fas fa-edit me-2"></i>
            Stok Güncelleme
          </h1>
          <p className="text-gray mb-0">
            {user.companyName || 'Şirketinizin'} stok değerlerini güncelleyin • {totalItems} ürün
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={handleRefresh}>
            <i className="fas fa-sync-alt me-2"></i>
            Yenile
          </button>
          <Link to="/employee/stock" className="btn btn-outline-main">
            <i className="fas fa-warehouse me-2"></i>
            Stok Durumu
          </Link>
        </div>
      </div>

      {/* Stock Statistics */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Toplam Current Stock</div>
            <div className="stat-icon">
              <i className="fas fa-cubes"></i>
            </div>
          </div>
          <div className="stat-value">
            {stockData.reduce((total, item) => total + item.currentStock, 0)}
          </div>
          <div className="stat-change neutral">
            <i className="fas fa-boxes"></i>
            Mevcut stok
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-title">Toplam Reserved Stock</div>
            <div className="stat-icon warning">
              <i className="fas fa-lock"></i>
            </div>
          </div>
          <div className="stat-value">
            {stockData.reduce((total, item) => total + item.reservedStock, 0)}
          </div>
          <div className="stat-change neutral">
            <i className="fas fa-clock"></i>
            Rezerve stok
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-title">Toplam Available Stock</div>
            <div className="stat-icon success">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="stat-value">
            {stockData.reduce((total, item) => total + item.availableStock, 0)}
          </div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            Satışa hazır
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-title">Kritik Stok</div>
            <div className="stat-icon danger">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="stat-value">
            {stockData.filter(item => ['out_of_stock', 'low_stock', 'critical'].includes(item.stockStatus)).length}
          </div>
          <div className="stat-change negative">
            <i className="fas fa-arrow-down"></i>
            Dikkat gerekli
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <label className="form-label">Güncelleme Modu</label>
              <div className="btn-group w-100" role="group">
                <input 
                  type="radio" 
                  className="btn-check" 
                  name="updateMode" 
                  id="single"
                  checked={updateMode === 'single'}
                  onChange={() => setUpdateMode('single')}
                />
                <label className="btn btn-outline-main" htmlFor="single">
                  <i className="fas fa-edit me-1"></i>
                  Tekli
                </label>
                
                <input 
                  type="radio" 
                  className="btn-check" 
                  name="updateMode" 
                  id="bulk"
                  checked={updateMode === 'bulk'}
                  onChange={() => setUpdateMode('bulk')}
                />
                <label className="btn btn-outline-main" htmlFor="bulk">
                  <i className="fas fa-list me-1"></i>
                  Toplu
                </label>
              </div>
            </div>
            
            <div className="col-md-3">
              <label className="form-label">Kategori Filtresi</label>
              <select 
                className="form-control form-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Ürün Ara</label>
              <div className="header-search d-flex">
                <input
                  type="text"
                  className="search-input flex-grow-1"
                  placeholder="Ürün adı, marka veya barkod ile ara..."
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

            <div className="col-md-2">
              <label className="form-label">Hızlı İşlemler</label>
              <button 
                className="btn btn-secondary w-100"
                onClick={() => setShowBarcodeModal(true)}
              >
                <i className="fas fa-barcode me-1"></i>
                Barkod
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Update Panel */}
      {updateMode === 'bulk' && (
        <div className="dashboard-card mb-4">
          <div className="card-header">
            <h5 className="card-title">
              <i className="fas fa-list text-main me-2"></i>
              Toplu Stok Güncelleme
              {selectedProducts.length > 0 && (
                <span className="badge badge-main ms-2">{selectedProducts.length} ürün seçili</span>
              )}
            </h5>
          </div>
          <div className="card-body">
            <div className="row align-items-end">
              <div className="col-md-2">
                <label className="form-label">İşlem Tipi</label>
                <select 
                  className="form-control form-select"
                  value={bulkOperation}
                  onChange={(e) => setBulkOperation(e.target.value)}
                >
                  <option value="add">Ekle (+)</option>
                  <option value="subtract">Çıkar (-)</option>
                  <option value="set">Ayarla (=)</option>
                </select>
              </div>
              
              <div className="col-md-2">
                <label className="form-label">Miktar</label>
                <input
                  type="number"
                  className="form-control"
                  value={bulkAmount}
                  onChange={(e) => setBulkAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div className="col-md-4">
                <label className="form-label">Sebep <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  placeholder="Güncelleme sebebini girin"
                />
              </div>
              
              <div className="col-md-2">
                <button 
                  className="btn btn-main w-100"
                  onClick={handleBulkUpdate}
                  disabled={selectedProducts.length === 0 || !bulkAmount || !updateReason}
                >
                  <i className="fas fa-save me-1"></i>
                  Uygula
                </button>
              </div>
              
              <div className="col-md-2">
                <button 
                  className="btn btn-outline-main w-100"
                  onClick={() => {
                    setSelectedProducts([]);
                    setBulkAmount('');
                    setUpdateReason('');
                  }}
                >
                  <i className="fas fa-undo me-1"></i>
                  Temizle
                </button>
              </div>
            </div>

            {/* Bulk Operation Preview */}
            {selectedProducts.length > 0 && bulkAmount && (
              <div className="mt-3 p-3 bg-light-custom rounded">
                <h6 className="text-main mb-2">
                  <i className="fas fa-eye me-2"></i>
                  İşlem Önizlemesi
                </h6>
                <div className="row">
                  <div className="col-md-4">
                    <small className="text-gray">Etkilenecek Ürün Sayısı:</small>
                    <div className="fw-bold">{selectedProducts.length} ürün</div>
                  </div>
                  <div className="col-md-4">
                    <small className="text-gray">İşlem:</small>
                    <div className="fw-bold">
                      {bulkOperation === 'add' ? `+${bulkAmount} ekle` : 
                       bulkOperation === 'subtract' ? `-${bulkAmount} çıkar` : 
                       `${bulkAmount} olarak ayarla`}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <small className="text-gray">Sebep:</small>
                    <div className="fw-bold">{updateReason || 'Belirtilmedi'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stock Table */}
      <div className="dashboard-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            <i className="fas fa-warehouse text-main me-2"></i>
            Stock Kontrol Paneli ({stockData.length})
          </h5>
          {updateMode === 'bulk' && stockData.length > 0 && (
            <button 
              className="btn btn-sm btn-outline-main"
              onClick={handleSelectAll}
            >
              <i className="fas fa-check-square me-1"></i>
              {selectedProducts.length === stockData.length ? 'Hiçbirini Seçme' : 'Tümünü Seç'}
            </button>
          )}
        </div>
        <div className="card-body p-0">
          <div className="table-container">
            <table className="table-custom">
              <thead>
                <tr>
                  {updateMode === 'bulk' && <th width="50">Seç</th>}
                  <th>Ürün</th>
                  <th>Kategori</th>
                  <th>Current Stock</th>
                  <th>Reserved Stock</th>
                  <th>Available Stock</th>
                  <th>Min. Stock</th>
                  <th>Durum</th>
                  <th>Güncelleme Alanları</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map(stockItem => (
                  <tr key={stockItem.id} id={`stock-${stockItem.id}`}>
                    {updateMode === 'bulk' && (
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedProducts.includes(stockItem.id)}
                          onChange={() => handleProductSelect(stockItem.id)}
                        />
                      </td>
                    )}
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="fas fa-box text-main"></i>
                        </div>
                        <div>
                          <div className="fw-bold">{stockItem.productName}</div>
                          {stockItem.brand && (
                            <small className="text-gray">Marka: {stockItem.brand}</small>
                          )}
                          {stockItem.barcode && (
                            <small className="text-gray d-block">#{stockItem.barcode}</small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline badge-main">{stockItem.category}</span>
                    </td>
                    <td>
                      <span className="fw-bold fs-5 text-primary">{stockItem.currentStock}</span>
                    </td>
                    <td>
                      <span className="fw-bold text-warning">{stockItem.reservedStock}</span>
                    </td>
                    <td>
                      <span className="fw-bold text-success">{stockItem.availableStock}</span>
                    </td>
                    <td>
                      <span className="fw-bold text-secondary">{stockItem.minimumStock}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${getStockStatusColor(stockItem.stockStatus)}`}>
                        {getStockStatusText(stockItem.stockStatus)}
                      </span>
                    </td>
                    <td>
                      <div className="row g-2">
                        {/* Current Stock Güncelleme */}
                        <div className="col-6">
                          <label className="form-label small">Yeni Current</label>
                          <div className="d-flex align-items-center gap-1">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: '70px' }}
                              value={stockUpdates[stockItem.id] !== undefined ? stockUpdates[stockItem.id] : ''}
                              onChange={(e) => handleStockChange(stockItem.id, e.target.value)}
                              placeholder={stockItem.currentStock.toString()}
                              min="0"
                            />
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleCurrentStockUpdate(stockItem.id, stockUpdates[stockItem.id])}
                              disabled={stockUpdates[stockItem.id] === undefined || stockUpdates[stockItem.id] === stockItem.currentStock}
                              title="Current Stock Güncelle"
                            >
                              <i className="fas fa-save"></i>
                            </button>
                          </div>
                        </div>

                        {/* Reserved Stock Güncelleme */}
                        <div className="col-6">
                          <label className="form-label small">Yeni Reserved</label>
                          <div className="d-flex align-items-center gap-1">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: '70px' }}
                              value={reservedUpdates[stockItem.id] !== undefined ? reservedUpdates[stockItem.id] : ''}
                              onChange={(e) => handleReservedChange(stockItem.id, e.target.value)}
                              placeholder={stockItem.reservedStock.toString()}
                              min="0"
                              max={stockItem.currentStock}
                            />
                            <button 
                              className="btn btn-sm btn-warning"
                              onClick={() => handleReservedStockUpdate(stockItem.id, reservedUpdates[stockItem.id])}
                              disabled={reservedUpdates[stockItem.id] === undefined || reservedUpdates[stockItem.id] === stockItem.reservedStock}
                              title="Reserved Stock Güncelle"
                            >
                              <i className="fas fa-lock"></i>
                            </button>
                          </div>
                        </div>

                        {/* Minimum Stock Güncelleme */}
                        <div className="col-12">
                          <label className="form-label small">Yeni Minimum</label>
                          <div className="d-flex align-items-center gap-1">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: '70px' }}
                              value={minimumUpdates[stockItem.id] !== undefined ? minimumUpdates[stockItem.id] : ''}
                              onChange={(e) => handleMinimumChange(stockItem.id, e.target.value)}
                              placeholder={stockItem.minimumStock.toString()}
                              min="0"
                            />
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleMinimumStockUpdate(stockItem.id, minimumUpdates[stockItem.id])}
                              disabled={minimumUpdates[stockItem.id] === undefined || minimumUpdates[stockItem.id] === stockItem.minimumStock}
                              title="Minimum Stock Güncelle"
                            >
                              <i className="fas fa-chart-line"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <Link 
                          to={`/employee/stock/movements?productId=${stockItem.id}`}
                          className="btn btn-sm btn-outline-main" 
                          title="Stok Hareketleri"
                        >
                          <i className="fas fa-history me-1"></i>
                          Geçmiş
                        </Link>
                        <Link 
                          to={`/employee/products/${stockItem.id}`}
                          className="btn btn-sm btn-outline-info" 
                          title="Ürün Detayları"
                        >
                          <i className="fas fa-info me-1"></i>
                          Detay
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {!loading && stockData.length > 0 && <PaginationComponent />}

      {/* Empty state */}
      {stockData.length === 0 && !loading && (
        <div className="text-center py-5">
          <i className="fas fa-warehouse text-gray fs-1 mb-3"></i>
          <h5 className="text-gray">Stok verisi bulunamadı</h5>
          <p className="text-gray">Bu şirkette henüz stok takipli ürün yok</p>
          <Link to="/employee/products/add" className="btn btn-main">
            <i className="fas fa-plus me-2"></i>
            İlk Ürünü Ekle
          </Link>
        </div>
      )}

      {/* Quick Actions & Tips */}
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
                <button 
                  className="btn btn-outline-main"
                  onClick={() => setShowBarcodeModal(true)}
                >
                  <i className="fas fa-barcode me-2"></i>
                  Barkod ile Ürün Bul
                </button>
                <button className="btn btn-outline-main">
                  <i className="fas fa-upload me-2"></i>
                  Excel'den Toplu Yükle
                </button>
                <Link to="/employee/stock/movements" className="btn btn-outline-main">
                  <i className="fas fa-history me-2"></i>
                  Tüm Stok Hareketleri
                </Link>
                <Link to="/employee/stock" className="btn btn-outline-main">
                  <i className="fas fa-warehouse me-2"></i>
                  Stok Durumu Raporu
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-info-circle text-main me-2"></i>
                Stock Güncelleme Rehberi
              </h5>
            </div>
            <div className="card-body">
              <div className="tips-list">
                <div className="tip-item mb-3">
                  <i className="fas fa-cube text-primary me-2"></i>
                  <small><strong>Current Stock:</strong> Toplam fiziksel stok miktarı</small>
                </div>
                <div className="tip-item mb-3">
                  <i className="fas fa-lock text-warning me-2"></i>
                  <small><strong>Reserved Stock:</strong> Sipariş verilmiş, henüz çıkmamış</small>
                </div>
                <div className="tip-item mb-3">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  <small><strong>Available Stock:</strong> Satışa hazır stok (Current - Reserved)</small>
                </div>
                <div className="tip-item mb-3">
                  <i className="fas fa-chart-line text-secondary me-2"></i>
                  <small><strong>Minimum Stock:</strong> Uyarı seviyesi</small>
                </div>
                <div className="tip-item">
                  <i className="fas fa-history text-info me-2"></i>
                  <small>Tüm değişiklikler kayıt altına alınır ve izlenebilir</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stok Türleri Açıklama Kartı */}
      <div className="dashboard-card mt-4">
        <div className="card-header">
          <h5 className="card-title">
            <i className="fas fa-info-circle text-main me-2"></i>
            Stok Türleri Rehberi
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="p-3 bg-primary bg-opacity-10 rounded">
                <h6 className="text-primary mb-2">
                  <i className="fas fa-cube me-2"></i>
                  Current Stock
                </h6>
                <small className="text-muted">
                  Toplam fiziksel stok miktarı. Depoda bulunan gerçek ürün sayısı.
                </small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="p-3 bg-warning bg-opacity-10 rounded">
                <h6 className="text-warning mb-2">
                  <i className="fas fa-lock me-2"></i>
                  Reserved Stock
                </h6>
                <small className="text-muted">
                  Sipariş verilmiş ancak henüz sevk edilmemiş ürün miktarı.
                </small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="p-3 bg-success bg-opacity-10 rounded">
                <h6 className="text-success mb-2">
                  <i className="fas fa-check-circle me-2"></i>
                  Available Stock
                </h6>
                <small className="text-muted">
                  Satışa hazır stok = Current Stock - Reserved Stock (otomatik hesaplanır)
                </small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="p-3 bg-secondary bg-opacity-10 rounded">
                <h6 className="text-secondary mb-2">
                  <i className="fas fa-chart-line me-2"></i>
                  Minimum Stock
                </h6>
                <small className="text-muted">
                  Uyarı seviyesi. Bu seviyenin altına düştüğünde bildirim gelir.
                </small>
              </div>
            </div>
          </div>

          <div className="alert alert-info mt-3">
            <i className="fas fa-lightbulb me-2"></i>
            <strong>İpucu:</strong> Her stok türü için ayrı input alanları var. Değiştirmek istediğiniz alana yeni değeri girin ve yanındaki butona basın.
          </div>
        </div>
      </div>

      {/* Güvenlik Bilgisi */}
      <div className="dashboard-card mt-4">
        <div className="card-header">
          <h5 className="card-title">
            <i className="fas fa-shield-alt text-success me-2"></i>
            Güvenlik ve İzlenebilirlik
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-building text-primary me-2"></i>
                <strong>Şirket İzolasyonu</strong>
              </div>
              <small className="text-muted">
                Sadece kendi şirketinizin ({user.companyName || 'N/A'}) ürünlerini görebilir ve güncelleyebilirsiniz.
              </small>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-history text-info me-2"></i>
                <strong>Tam İzlenebilirlik</strong>
              </div>
              <small className="text-muted">
                Tüm stok değişiklikleri kayıt altına alınır ve "Geçmiş" butonundan görüntülenebilir.
              </small>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-user-shield text-success me-2"></i>
                <strong>Kullanıcı Yetkileri</strong>
              </div>
              <small className="text-muted">
                Sadece yetkili olduğunuz stok türlerini güncelleyebilirsiniz.
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Modal */}
      {showBarcodeModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg pt-5">
            <div className="modal-content ms-auto">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-barcode text-main me-2"></i>
                  Barkod ile Ürün Bul
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowBarcodeModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Barkod Numarası</label>
                  <input
                    type="text"
                    className="form-control"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Barkod numarasını girin veya okutun"
                    autoFocus
                    onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                  />
                </div>
                <div className="mt-3">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    <small>
                      Barkod okutucunuz varsa bu alana doğrudan okutabilirsiniz. 
                      Manuel olarak da girebilirsiniz.
                    </small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowBarcodeModal(false)}
                >
                  <i className="fas fa-times me-2"></i>
                  İptal
                </button>
                <button 
                  type="button" 
                  className="btn btn-main"
                  onClick={handleBarcodeSearch}
                  disabled={!barcodeInput.trim()}
                >
                  <i className="fas fa-search me-2"></i>
                  Ürünü Bul
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style>{`
        .bg-light-custom {
          background-color: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        
        .tip-item i {
          margin-top: 2px;
        }
        
        .form-label.small {
          font-size: 0.75rem;
          margin-bottom: 0.25rem;
          color: var(--text-muted);
        }
        
        .badge-sm {
          font-size: 10px;
          padding: 2px 6px;
        }
        
        .fs-5 {
          font-size: 1.25rem !important;
        }
        
        .table-custom tbody tr:hover {
          background-color: var(--bg-light-a);
        }
        
        .table-custom td {
          vertical-align: middle;
          padding: 0.75rem 0.5rem;
        }
        
        .table-container {
          overflow-x: auto;
        }
        
        .highlight {
          animation: highlightPulse 2s ease-in-out;
          background-color: rgba(59, 130, 246, 0.2) !important;
        }
        
        @keyframes highlightPulse {
          0%, 100% { 
            background-color: transparent; 
          }
          50% { 
            background-color: rgba(59, 130, 246, 0.3); 
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .table-container {
            font-size: 0.875rem;
          }
          
          .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
          
          .form-control-sm {
            width: 60px !important;
          }
          
          .row .col-md-2,
          .row .col-md-3,
          .row .col-md-4 {
            margin-bottom: 15px;
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

export default EmployeeStockUpdate;