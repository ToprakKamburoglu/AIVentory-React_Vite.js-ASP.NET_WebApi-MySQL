import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ManagerStockUpdate = () => {
  const [products] = useState([
    { 
      id: 1, 
      name: 'iPhone 15 Pro', 
      category: 'Telefon', 
      currentStock: 3, 
      minStock: 5,
      barcode: '1234567890123',
      price: 45000
    },
    { 
      id: 2, 
      name: 'Samsung Galaxy S24', 
      category: 'Telefon', 
      currentStock: 12, 
      minStock: 10,
      barcode: '1234567890124',
      price: 35000
    },
    { 
      id: 3, 
      name: 'AirPods Pro', 
      category: 'Kulaklık', 
      currentStock: 0, 
      minStock: 8,
      barcode: '1234567890125',
      price: 7000
    },
    { 
      id: 4, 
      name: 'MacBook Air M2', 
      category: 'Bilgisayar', 
      currentStock: 1, 
      minStock: 2,
      barcode: '1234567890126',
      price: 32000
    },
    { 
      id: 5, 
      name: 'PowerBank 20000mAh', 
      category: 'Powerbank', 
      currentStock: 8, 
      minStock: 5,
      barcode: '1234567890127',
      price: 300
    },
    { 
      id: 6, 
      name: 'iPhone Kılıfı Şeffaf', 
      category: 'Kılıf', 
      currentStock: 45, 
      minStock: 20,
      barcode: '1234567890128',
      price: 150
    },
    { 
      id: 7, 
      name: 'Samsung Şarj Aleti', 
      category: 'Şarj Aleti', 
      currentStock: 15, 
      minStock: 10,
      barcode: '1234567890129',
      price: 250
    },
    { 
      id: 8, 
      name: 'Apple Watch Series 9', 
      category: 'Saat', 
      currentStock: 2, 
      minStock: 3,
      barcode: '1234567890130',
      price: 12000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [updateMode, setUpdateMode] = useState('single'); 
  const [stockUpdates, setStockUpdates] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkOperation, setBulkOperation] = useState('add');
  const [bulkAmount, setBulkAmount] = useState('');
  const [updateReason, setUpdateReason] = useState('');
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');

  const categories = ['Telefon', 'Bilgisayar', 'Kulaklık', 'Powerbank', 'Kılıf', 'Şarj Aleti', 'Saat'];

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.barcode.includes(searchTerm)) return false;
    return true;
  });

  const handleStockChange = (productId, newStock) => {
    setStockUpdates(prev => ({
      ...prev,
      [productId]: parseInt(newStock) || 0
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
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleSingleUpdate = (productId) => {
    const newStock = stockUpdates[productId];
    const product = products.find(p => p.id === productId);
    
    if (newStock !== undefined && newStock !== product.currentStock) {
      const movement = {
        productId,
        productName: product.name,
        oldStock: product.currentStock,
        newStock: newStock,
        difference: newStock - product.currentStock,
        type: newStock > product.currentStock ? 'in' : 'out',
        reason: 'Manuel güncelleme',
        timestamp: new Date().toISOString()
      };
      
      console.log('Single update:', movement);
      
     
      alert(`${product.name} stoğu ${product.currentStock}'den ${newStock}'e güncellendi`);
      
    
      setStockUpdates(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }
  };

  const handleBulkUpdate = () => {
    if (selectedProducts.length === 0 || !bulkAmount || !updateReason) {
      alert('Lütfen ürün seçin, miktar girin ve sebep belirtin');
      return;
    }

    const amount = parseInt(bulkAmount);
    const updates = selectedProducts.map(productId => {
      const product = products.find(p => p.id === productId);
      let newStock;
      
      switch (bulkOperation) {
        case 'add':
          newStock = product.currentStock + amount;
          break;
        case 'subtract':
          newStock = Math.max(0, product.currentStock - amount);
          break;
        case 'set':
          newStock = amount;
          break;
        default:
          newStock = product.currentStock;
      }

      return {
        productId,
        productName: product.name,
        oldStock: product.currentStock,
        newStock,
        difference: newStock - product.currentStock,
        type: newStock > product.currentStock ? 'in' : newStock < product.currentStock ? 'out' : 'adjustment',
        reason: updateReason,
        timestamp: new Date().toISOString()
      };
    });

    console.log('Bulk update:', updates);
    
    alert(`${selectedProducts.length} ürünün stoğu güncellendi`);
   
    setSelectedProducts([]);
    setBulkAmount('');
    setUpdateReason('');
  };

  const handleBarcodeUpdate = () => {
    if (!barcodeInput.trim()) {
      alert('Lütfen barkod girin');
      return;
    }

    const product = products.find(p => p.barcode === barcodeInput.trim());
    if (!product) {
      alert('Barkod bulunamadı');
      return;
    }

 
    const productElement = document.getElementById(`product-${product.id}`);
    if (productElement) {
      productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      productElement.classList.add('highlight');
      setTimeout(() => productElement.classList.remove('highlight'), 2000);
    }

    setShowBarcodeModal(false);
    setBarcodeInput('');
  };

  const getStockStatusColor = (current, min) => {
    if (current === 0) return 'danger';
    if (current <= min) return 'warning';
    return 'success';
  };

  const getStockStatusText = (current, min) => {
    if (current === 0) return 'Tükendi';
    if (current <= min) return 'Düşük';
    return 'Normal';
  };

  const getTotalSelectedValue = () => {
    return selectedProducts.reduce((total, productId) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * product.currentStock : 0);
    }, 0);
  };

  return (
    <div className="stock-update-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-main mb-2">
            <i className="fas fa-edit me-2"></i>
            Stok Güncelleme
          </h1>
          <p className="text-gray mb-0">
            Ürün stoklarını tek tek veya toplu olarak güncelleyin
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/manager/stock" className="btn btn-outline-main">
            <i className="fas fa-warehouse me-2"></i>
            Stok Durumu
          </Link>
          <Link to="/manager/stock/movements" className="btn btn-outline-main">
            <i className="fas fa-history me-2"></i>
            Hareketler
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Toplam Ürün</div>
            <div className="stat-icon">
              <i className="fas fa-cubes"></i>
            </div>
          </div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-change neutral">
            <i className="fas fa-list"></i>
            Güncelleme için hazır
          </div>
        </div>

        {updateMode === 'bulk' && (
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Seçili Ürün</div>
              <div className="stat-icon">
                <i className="fas fa-check-square"></i>
              </div>
            </div>
            <div className="stat-value">{selectedProducts.length}</div>
            <div className="stat-change positive">
              <i className="fas fa-mouse-pointer"></i>
              Toplu işlem için
            </div>
          </div>
        )}

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-title">Bekleyen Güncelleme</div>
            <div className="stat-icon warning">
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div className="stat-value">{Object.keys(stockUpdates).length}</div>
          <div className="stat-change neutral">
            <i className="fas fa-save"></i>
            Kaydedilmemiş
          </div>
        </div>

        {updateMode === 'bulk' && selectedProducts.length > 0 && (
          <div className="stat-card success">
            <div className="stat-header">
              <div className="stat-title">Seçili Değer</div>
              <div className="stat-icon success">
                <i className="fas fa-dollar-sign"></i>
              </div>
            </div>
            <div className="stat-value">₺{getTotalSelectedValue().toLocaleString()}</div>
            <div className="stat-change positive">
              <i className="fas fa-calculator"></i>
              Toplam değer
            </div>
          </div>
        )}
      </div>

      {/* Update Mode Selector */}
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
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Ürün Ara</label>
              <div className="header-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Ürün adı veya barkod ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
              Toplu Güncelleme
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

      {/* Products Table */}
      <div className="dashboard-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            <i className="fas fa-box text-main me-2"></i>
            Ürünler ({filteredProducts.length})
          </h5>
          {updateMode === 'bulk' && filteredProducts.length > 0 && (
            <button 
              className="btn btn-sm btn-outline-main"
              onClick={handleSelectAll}
            >
              <i className="fas fa-check-square me-1"></i>
              {selectedProducts.length === filteredProducts.length ? 'Hiçbirini Seçme' : 'Tümünü Seç'}
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
                  <th>Mevcut Stok</th>
                  <th>Min. Stok</th>
                  <th>Durum</th>
                  <th>Birim Fiyat</th>
                  {updateMode === 'single' && <th>Yeni Stok</th>}
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} id={`product-${product.id}`}>
                    {updateMode === 'bulk' && (
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleProductSelect(product.id)}
                        />
                      </td>
                    )}
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="fas fa-box text-main"></i>
                        </div>
                        <div>
                          <div className="fw-bold">{product.name}</div>
                          <small className="text-gray">#{product.barcode}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline badge-main">{product.category}</span>
                    </td>
                    <td>
                      <span className="fw-bold fs-5">{product.currentStock}</span>
                    </td>
                    <td>{product.minStock}</td>
                    <td>
                      <span className={`badge badge-${getStockStatusColor(product.currentStock, product.minStock)}`}>
                        {getStockStatusText(product.currentStock, product.minStock)}
                      </span>
                    </td>
                    <td>₺{product.price.toLocaleString()}</td>
                    {updateMode === 'single' && (
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: '80px' }}
                            value={stockUpdates[product.id] !== undefined ? stockUpdates[product.id] : ''}
                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                            placeholder={product.currentStock.toString()}
                            min="0"
                          />
                          {stockUpdates[product.id] !== undefined && stockUpdates[product.id] !== product.currentStock && (
                            <span className={`badge badge-sm ${stockUpdates[product.id] > product.currentStock ? 'badge-success' : 'badge-danger'}`}>
                              {stockUpdates[product.id] > product.currentStock ? '+' : ''}
                              {stockUpdates[product.id] - product.currentStock}
                            </span>
                          )}
                        </div>
                      </td>
                    )}
                    <td>
                      <div className="d-flex gap-1">
                        {updateMode === 'single' && (
                          <button 
                            className="btn btn-sm btn-main"
                            onClick={() => handleSingleUpdate(product.id)}
                            disabled={stockUpdates[product.id] === undefined || stockUpdates[product.id] === product.currentStock}
                            title="Stoğu Güncelle"
                          >
                            <i className="fas fa-save"></i>
                          </button>
                        )}
                        <button className="btn btn-sm btn-outline-main" title="Geçmiş">
                          <i className="fas fa-history"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-main" title="Detaylar">
                          <i className="fas fa-info"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 && (
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
                <button 
                  className="btn btn-outline-main"
                  onClick={() => setShowBarcodeModal(true)}
                >
                  <i className="fas fa-barcode me-2"></i>
                  Barkod ile Stok Güncelle
                </button>
                <button className="btn btn-outline-main">
                  <i className="fas fa-upload me-2"></i>
                  Excel'den Toplu Yükle
                </button>
                <button className="btn btn-outline-main">
                  <i className="fas fa-camera me-2"></i>
                  AI ile Stok Sayımı
                </button>
                <button className="btn btn-outline-main">
                  <i className="fas fa-download me-2"></i>
                  Stok Raporu İndir
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-info-circle text-main me-2"></i>
                Güncelleme İpuçları
              </h5>
            </div>
            <div className="card-body">
              <div className="tips-list">
                <div className="tip-item mb-3">
                  <i className="fas fa-lightbulb text-warning me-2"></i>
                  <small>Toplu güncellemede sebep belirtmek zorunludur</small>
                </div>
                <div className="tip-item mb-3">
                  <i className="fas fa-shield-alt text-success me-2"></i>
                  <small>Tüm stok değişiklikleri otomatik olarak kaydedilir</small>
                </div>
                <div className="tip-item mb-3">
                  <i className="fas fa-history text-info me-2"></i>
                  <small>Stok geçmişini "Hareketler" sayfasından görüntüleyebilirsiniz</small>
                </div>
                <div className="tip-item mb-3">
                  <i className="fas fa-bell text-danger me-2"></i>
                  <small>Minimum stokun altına düşen ürünler otomatik uyarı verir</small>
                </div>
                <div className="tip-item">
                  <i className="fas fa-barcode text-main me-2"></i>
                  <small>Barkod okutarak hızlı ürün bulabilirsiniz</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Modal */}
      {showBarcodeModal && (
        <div className="modal-overlay" onClick={() => setShowBarcodeModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-barcode text-main me-2"></i>
                Barkod ile Ürün Bul
              </h5>
              <button 
                type="button" 
                className="modal-close"
                onClick={() => setShowBarcodeModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
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
                  onKeyPress={(e) => e.key === 'Enter' && handleBarcodeUpdate()}
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
                className="btn btn-outline-main" 
                onClick={() => setShowBarcodeModal(false)}
              >
                İptal
              </button>
              <button 
                type="button" 
                className="btn btn-main"
                onClick={handleBarcodeUpdate}
                disabled={!barcodeInput.trim()}
              >
                <i className="fas fa-search me-2"></i>
                Ürünü Bul
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for highlight effect */}
      <style jsx>{`
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
        
        .product-placeholder {
          width: 40px;
          height: 40px;
          background: var(--light-bg);
          border: 2px dashed var(--border-color);
          border-radius: var(--border-radius-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        
        .user-avatar-sm {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: 600;
        }
        
        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        
        .tip-item i {
          margin-top: 2px;
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
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          opacity: 0;
          animation: fadeIn 0.3s ease forwards;
        }
        
        .modal-content {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-lg);
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          transform: scale(0.9);
          animation: modalScale 0.3s ease forwards;
        }
        
        .modal-header {
          padding: 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .modal-title {
          font-size: var(--font-lg);
          font-weight: 700;
          color: var(--dark-text);
          margin: 0;
        }
        
        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--gray-color);
          transition: var(--transition-fast);
          padding: 4px;
          border-radius: var(--border-radius-xs);
        }
        
        .modal-close:hover {
          color: var(--danger-color);
          background: var(--light-bg);
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border-color);
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        
        @keyframes modalScale {
          to {
            transform: scale(1);
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .table-container {
            overflow-x: auto;
          }
          
          .modal-content {
            width: 95%;
            margin: 20px;
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

export default ManagerStockUpdate;