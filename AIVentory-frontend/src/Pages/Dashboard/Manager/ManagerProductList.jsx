import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ManagerProductList = () => {
  const [products] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro',
      description: 'Apple iPhone 15 Pro 256GB Space Black',
      category: 'Telefon',
      brand: 'Apple',
      price: 45000,
      cost: 40000,
      stock: 3,
      minStock: 5,
      barcode: '1234567890123',
      status: 'active',
      createdDate: '2024-01-10',
      lastUpdate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      description: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
      category: 'Telefon',
      brand: 'Samsung',
      price: 35000,
      cost: 30000,
      stock: 12,
      minStock: 10,
      barcode: '1234567890124',
      status: 'active',
      createdDate: '2024-01-08',
      lastUpdate: '2024-01-14'
    },
    {
      id: 3,
      name: 'AirPods Pro 2',
      description: 'Apple AirPods Pro 2nd Generation with MagSafe',
      category: 'Kulaklık',
      brand: 'Apple',
      price: 7000,
      cost: 6000,
      stock: 0,
      minStock: 8,
      barcode: '1234567890125',
      status: 'active',
      createdDate: '2024-01-05',
      lastUpdate: '2024-01-13'
    },
    {
      id: 4,
      name: 'MacBook Air M2',
      description: 'Apple MacBook Air 13" M2 Chip 8GB 256GB',
      category: 'Bilgisayar',
      brand: 'Apple',
      price: 32000,
      cost: 28000,
      stock: 1,
      minStock: 2,
      barcode: '1234567890126',
      status: 'active',
      createdDate: '2024-01-03',
      lastUpdate: '2024-01-12'
    },
    {
      id: 5,
      name: 'PowerBank 20000mAh',
      description: 'Xiaomi PowerBank 20000mAh Fast Charging',
      category: 'Powerbank',
      brand: 'Xiaomi',
      price: 300,
      cost: 200,
      stock: 25,
      minStock: 5,
      barcode: '1234567890127',
      status: 'active',
      createdDate: '2024-01-01',
      lastUpdate: '2024-01-10'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table');

  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { status: 'out', text: 'Tükendi', color: 'danger' };
    if (stock <= minStock) return { status: 'low', text: 'Düşük', color: 'warning' };
    return { status: 'good', text: 'Normal', color: 'success' };
  };

  const getProfitMargin = (price, cost) => {
    return ((price - cost) / price * 100).toFixed(1);
  };

  const filteredProducts = products
    .filter(product => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;
      if (searchTerm && 
          !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.barcode.includes(searchTerm)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        case 'stock':
          return a.stock - b.stock;
        case 'date':
          return new Date(b.createdDate) - new Date(a.createdDate);
        default:
          return 0;
      }
    });

  const handleDelete = (productId) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      console.log('Deleting product:', productId);
    }
  };

  const getTotalValue = () => {
    return products.reduce((total, product) => total + (product.price * product.stock), 0);
  };

  return (
    <div className="product-list-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-main mb-2">
            <i className="fas fa-box me-2"></i>
            Ürün Listesi
          </h1>
          <p className="text-gray mb-0">
            Sisteminizde kayıtlı {products.length} ürünü görüntüleyin ve yönetin
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/manager/products/add" className="btn btn-main">
            <i className="fas fa-plus me-2"></i>
            Yeni Ürün
          </Link>
          <button className="btn btn-outline-main">
            <i className="fas fa-download me-2"></i>
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Toplam Ürün</div>
            <div className="stat-icon">
              <i className="fas fa-cubes"></i>
            </div>
          </div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-change positive">
            <i className="fas fa-plus"></i>
            Aktif ürün sayısı
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

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-title">Düşük Stok</div>
            <div className="stat-icon warning">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="stat-value">
            {products.filter(p => p.stock <= p.minStock).length}
          </div>
          <div className="stat-change negative">
            <i className="fas fa-arrow-down"></i>
            Ürün dikkat gerektiriyor
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Kategoriler</div>
            <div className="stat-icon">
              <i className="fas fa-tags"></i>
            </div>
          </div>
          <div className="stat-value">{categories.length}</div>
          <div className="stat-change neutral">
            <i className="fas fa-layer-group"></i>
            Farklı kategori
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <div className="header-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
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
            <div className="col-md-2">
              <select 
                className="form-control form-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="all">Tüm Markalar</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select 
                className="form-control form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">İsme Göre</option>
                <option value="price">Fiyata Göre</option>
                <option value="stock">Stoka Göre</option>
                <option value="date">Tarihe Göre</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="d-flex gap-2">
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
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSortBy('name');
                  }}
                >
                  <i className="fas fa-undo"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'table' ? (
        /* Table View */
        <div className="table-container">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Kategori</th>
                <th>Marka</th>
                <th>Fiyat</th>
                <th>Stok</th>
                <th>Durum</th>
                <th>Kar Marjı</th>
                <th>Son Güncelleme</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const stockInfo = getStockStatus(product.stock, product.minStock);
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="product-image me-3">
                          <div className="product-placeholder">
                            <i className="fas fa-image text-gray"></i>
                          </div>
                        </div>
                        <div>
                          <div className="fw-bold">{product.name}</div>
                          <small className="text-gray">{product.description}</small>
                          <div className="small text-gray">#{product.barcode}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline badge-main">{product.category}</span>
                    </td>
                    <td>{product.brand}</td>
                    <td>
                      <div>
                        <div className="fw-bold">₺{product.price.toLocaleString()}</div>
                        <small className="text-gray">Maliyet: ₺{product.cost.toLocaleString()}</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="fw-bold me-2">{product.stock}</span>
                        <div className="stock-level-bar" style={{ width: '40px' }}>
                          <div 
                            className={`stock-level-fill ${stockInfo.status === 'good' ? 'high' : stockInfo.status === 'low' ? 'medium' : 'low'}`}
                            style={{ width: `${Math.min(100, (product.stock / (product.minStock * 2)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${stockInfo.color}`}>
                        {stockInfo.text}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-success">
                        %{getProfitMargin(product.price, product.cost)}
                      </span>
                    </td>
                    <td>
                      <small className="text-gray">{product.lastUpdate}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link 
                          to={`/manager/products/edit/${product.id}`}
                          className="btn btn-sm btn-outline-main"
                          title="Düzenle"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button 
                          className="btn btn-sm btn-outline-main"
                          title="Detaylar"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(product.id)}
                          title="Sil"
                        >
                          <i className="fas fa-trash"></i>
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
          {filteredProducts.map(product => {
            const stockInfo = getStockStatus(product.stock, product.minStock);
            return (
              <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                <div className="dashboard-card product-card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="product-image">
                        <div className="product-placeholder-lg">
                          <i className="fas fa-image text-gray fs-2"></i>
                        </div>
                      </div>
                      <div className="product-actions">
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm btn-outline-main dropdown-toggle"
                            data-bs-toggle="dropdown"
                          >
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link 
                                className="dropdown-item" 
                                to={`/manager/products/edit/${product.id}`}
                              >
                                <i className="fas fa-edit me-2"></i>Düzenle
                              </Link>
                            </li>
                            <li>
                              <button className="dropdown-item">
                                <i className="fas fa-eye me-2"></i>Detaylar
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button 
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(product.id)}
                              >
                                <i className="fas fa-trash me-2"></i>Sil
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <h6 className="card-title">{product.name}</h6>
                    <p className="small text-gray mb-3">{product.description}</p>
                    
                    <div className="product-details">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small">Kategori:</span>
                        <span className="badge badge-outline badge-main">{product.category}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small">Marka:</span>
                        <span className="small fw-bold">{product.brand}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small">Fiyat:</span>
                        <span className="fw-bold">₺{product.price.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small">Stok:</span>
                        <div className="d-flex align-items-center">
                          <span className="fw-bold me-2">{product.stock}</span>
                          <span className={`badge badge-${stockInfo.color}`}>
                            {stockInfo.text}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="small">Kar Marjı:</span>
                        <span className="fw-bold text-success">
                          %{getProfitMargin(product.price, product.cost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-search text-gray fs-1 mb-3"></i>
          <h5 className="text-gray">Ürün bulunamadı</h5>
          <p className="text-gray">Arama kriterlerinizi değiştirin veya yeni ürün ekleyin</p>
          <Link to="/manager/products/add" className="btn btn-main">
            <i className="fas fa-plus me-2"></i>
            Yeni Ürün Ekle
          </Link>
        </div>
      )}

      {/* Pagination would go here if needed */}
    </div>
  );
};

export default ManagerProductList;