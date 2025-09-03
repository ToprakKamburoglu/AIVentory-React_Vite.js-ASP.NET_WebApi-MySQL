import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth'; 
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const EmployeeProductList = () => {
  const { user } = useAuth(); 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6; 
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    categoryId: '',
    brand: '',
    color: '',
    price: '',
    costPrice: '',
    currentStock: '',
    minimumStock: '',
    barcode: '',
    image: null,
    imagePreview: null 
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `${API_BASE_URL}/categories`;
      
      if (user?.companyId) {
        url += `?companyId=${user.companyId}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (result.success) {
        const categoriesData = result.data;
        setCategories(categoriesData);
        
        const mapping = {};
        categoriesData.forEach(cat => {
          mapping[cat.id] = cat.name;
        });
        setCategoryMap(mapping);
        
        console.log('Kategoriler yüklendi:', categoriesData);
        console.log('Category mapping:', mapping);
      } else {
        console.error('Kategoriler yüklenirken hata:', result.message);
        
        setFallbackCategories();
      }
    } catch (error) {
      console.error('Kategori yükleme hatası:', error);
      setFallbackCategories();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditForm(prev => ({
      ...prev,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : null
    }));
  };

  const handleExportExcel = async () => {
    if (!products || products.length === 0) {
      alert('Dışa aktarılacak ürün bulunamadı');
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Ürün Listesi');

      worksheet.columns = [
        { header: 'Sıra No', key: 'siraNo', width: 15 },
        { header: 'Ürün Adı', key: 'urunAdi', width: 40 },
        { header: 'Açıklama', key: 'aciklama', width: 50 },
        { header: 'Kategori', key: 'kategori', width: 20 },
        { header: 'Marka', key: 'marka', width: 20 },
        { header: 'Renk', key: 'renk', width: 15 },
        { header: 'Satış Fiyatı (TL)', key: 'satisFiyati', width: 20 },
        { header: 'Maliyet Fiyatı (TL)', key: 'maliyetFiyati', width: 20 },
        { header: 'Kar Marjı', key: 'karMarji', width: 15 },
        { header: 'Kar Miktarı (TL)', key: 'karMiktari', width: 20 },
        { header: 'Mevcut Stok', key: 'mevcutStok', width: 15 },
        { header: 'Minimum Stok', key: 'minimumStok', width: 15 },
        { header: 'Stok Durumu', key: 'stokDurumu', width: 15 },
        { header: 'Toplam Değer (TL)', key: 'toplamDeger', width: 22 },
        { header: 'Barkod', key: 'barkod', width: 25 },
        { header: 'Oluşturulma Tarihi', key: 'olusturmaTarihi', width: 20 },
        { header: 'Güncelleme Tarihi', key: 'guncellemeTarihi', width: 20 },
        { header: 'Durum', key: 'durum', width: 12 }
      ];

      worksheet.getRow(1).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' } 
      };
      worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).height = 30;

      products.forEach((product, index) => {
        const stockStatus = getStockStatus(product.stock, product.minStock);
        const profitMargin = getProfitMargin(product.price, product.cost);
        const profitAmount = (product.price - product.cost) || 0;
        const totalValue = (product.price * product.stock) || 0;

        const row = worksheet.addRow({
          siraNo: index + 1,
          urunAdi: product.name || '',
          aciklama: product.description || '',
          kategori: product.category || '',
          marka: product.brand || '',
          renk: product.color || '',
          satisFiyati: product.price || 0,
          maliyetFiyati: product.cost || 0,
          karMarji: profitMargin,
          karMiktari: profitAmount,
          mevcutStok: product.stock || 0,
          minimumStok: product.minStock || 0,
          stokDurumu: stockStatus.text,
          toplamDeger: totalValue,
          barkod: product.barcode || '',
          olusturmaTarihi: product.createdDate || '',
          guncellemeTarihi: product.lastUpdate || '',
          durum: 'Aktif'
        });

        row.alignment = { horizontal: 'center', vertical: 'middle' };
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `urun_raporu_${new Date().toISOString().slice(0, 10)}.xlsx`);

      alert('Excel dosyası başarıyla oluşturuldu!');

    } catch (error) {
      console.error('Excel export hatası:', error);
      alert('Excel dosyası oluşturulurken hata oluştu: ' + error.message);
    }
  };

  const setFallbackCategories = () => {
    const fallbackCategories = [
      { id: 1, name: 'Elektronik' },
      { id: 2, name: 'Gıda' },
      { id: 3, name: 'Giyim' },
      { id: 4, name: 'Kozmetik' },
      { id: 5, name: 'Ev & Yaşam' }
    ];
    
    setCategories(fallbackCategories);
    
    const mapping = {};
    fallbackCategories.forEach(cat => {
      mapping[cat.id] = cat.name;
    });
    setCategoryMap(mapping);
  };

  useEffect(() => {
    const initializeData = async () => {
      
      if (!user || !user.companyId) {
        console.log('User veya companyId bekleniyor...', user);
        return;
      }
      
      console.log('User companyId:', user.companyId);
      await loadCategories(); 
      loadProducts(1);
    };
    
    initializeData();
  }, [user]); 

  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.companyId) {
        setError('Kullanıcı şirket bilgisi bulunamadı');
        setLoading(false);
        return;
      }
      
      
      let url = `${API_BASE_URL}/products?page=${page}&pageSize=${pageSize}&companyId=${user.companyId}`;
      
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      
      if (selectedCategory !== 'all') {
        const categoryId = getCategoryIdByName(selectedCategory);
        if (categoryId) {
          url += `&categoryId=${categoryId}`;
        }
      }
      
      console.log('API URL:', url); 
      
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      console.log('API Response:', result);
      
      if (result.success) {
        let productsData = [];
        
        if (result.data && result.data.data) {
          productsData = result.data.data;
          
          
          if (result.data.pagination) {
            setCurrentPage(result.data.pagination.currentPage);
            setTotalPages(result.data.pagination.totalPages);
            setTotalItems(result.data.pagination.totalItems);
          }
        } else if (Array.isArray(result.data)) {
          productsData = result.data;
        } else {
          console.error('Unexpected data structure:', result.data);
          setError('Beklenmeyen veri yapısı');
          return;
        }

        const formattedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          category: getCategoryName(product.categoryId), 
          categoryId: product.categoryId,
          brand: product.brand || '',
          price: product.price || 0,
          cost: product.costPrice || product.price * 0.8 || 0,
          stock: product.currentStock || 0,
          color: product.color || '',
          minStock: product.minimumStock || 5,
          barcode: product.barcode || '',
          status: 'active',
          companyId: product.companyId, 
          createdDate: product.createdAt ? new Date(product.createdAt).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR'),
          lastUpdate: product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR'),
          imageUrl: product.imageUrl || null
        }));
        
        setProducts(formattedProducts);
        
        
        const invalidProducts = formattedProducts.filter(p => p.companyId !== user.companyId);
        if (invalidProducts.length > 0) {
          console.warn('Farklı şirkete ait ürünler tespit edildi:', invalidProducts);
        }
        
      } else {
        setError(result.message || 'Ürünler yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Sunucuya bağlanırken hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  
  const getCategoryName = (categoryId) => {
    return categoryMap[categoryId] || 'Diğer';
  };

  
  const getCategoryIdByName = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.id : null;
  };


  const categoryNames = categories.map(cat => cat.name);
  const brands = [...new Set(products.map(p => p.brand).filter(brand => brand))];

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { status: 'out', text: 'Tükendi', color: 'danger' };
    if (stock <= minStock) return { status: 'low', text: 'Düşük', color: 'warning' };
    return { status: 'good', text: 'Normal', color: 'success' };
  };

  const getProfitMargin = (price, cost) => {
    if (price === 0) return '0';
    return ((price - cost) / price * 100).toFixed(1);
  };

  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadProducts(page);
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

  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
    loadProducts(1);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setCurrentPage(1);
    loadProducts(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  
  const handleSearch = () => {
    setCurrentPage(1);
    loadProducts(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  
  const filteredProducts = products;

  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      brand: product.brand,
      price: product.price,
      color: product.color || '',
      costPrice: product.cost,
      currentStock: product.stock,
      minimumStock: product.minStock,
      barcode: product.barcode
    });
    setShowEditModal(true);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProduct(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('name', editForm.name);
    formData.append('description', editForm.description);
    formData.append('categoryId', editForm.categoryId);
    formData.append('brand', editForm.brand);
    formData.append('color', editForm.color);
    formData.append('price', editForm.price);
    formData.append('costPrice', editForm.costPrice);
    formData.append('currentStock', editForm.currentStock);
    formData.append('minimumStock', editForm.minimumStock);
    formData.append('barcode', editForm.barcode);

    
    if (editForm.image) {
      formData.append('image', editForm.image);
    } else if (editForm.imageUrl) {
      formData.append('imageUrl', editForm.imageUrl);
    }

    const response = await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      alert('Ürün başarıyla güncellendi');
      setShowEditModal(false);
      setEditingProduct(null);
      await loadProducts(currentPage);
    } else {
      alert(result.message || 'Ürün güncellenirken hata oluştu');
    }
  } catch (err) {
    alert('Ürün güncellenirken hata oluştu: ' + err.message);
  }
};

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setEditForm({
      name: '',
      description: '',
      categoryId: '',
      brand: '',
      color: '', 
      price: '',
      costPrice: '',
      currentStock: '',
      minimumStock: '',
      barcode: ''
    });
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        const result = await response.json();
        console.log('Delete response:', result);
        
        if (result.success) {
          alert('Ürün başarıyla silindi');
          loadProducts(currentPage); 
        } else {
          alert(result.message || 'Ürün silinirken hata oluştu');
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Ürün silinirken hata oluştu');
      }
    }
  };

  const getTotalValue = () => {
    return products.reduce((total, product) => total + (product.price * product.stock), 0);
  };

  const handleRefresh = () => {
    const refreshData = async () => {
      await loadCategories(); 
      loadProducts(currentPage); 
    };
    refreshData(); 
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
      <div className="product-list-page">
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
      <div className="product-list-page">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-3 text-gray">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="product-list-page">
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

  return (
    <div className="product-list-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pt-4">
        <div>
          <h1 className="text-main mb-2">
            <i className="fas fa-box me-2"></i>
            Ürün Listesi
          </h1>
          <p className="text-gray mb-0">
            Şirketinizde kayıtlı {totalItems} ürünü görüntüleyin ve yönetin 
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={handleRefresh}>
            <i className="fas fa-sync-alt me-2"></i>
            Yenile
          </button>
          <button className="btn btn-outline-secondary" onClick={handleExportExcel}>
            <i className="fas fa-download me-2"></i>
            Dışa Aktar
          </button>
          <Link to="/employee/products/add" className="btn btn-main">
            <i className="fas fa-plus me-2"></i>
            Yeni Ürün
          </Link>
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
          <div className="stat-value">{totalItems}</div>
          <div className="stat-change positive">
            <i className="fas fa-plus"></i>
            Aktif ürün sayısı
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-title">Toplam Değer</div>
            <div className="stat-icon success">
              <i className="fa-solid fa-turkish-lira-sign"></i>
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
              <div className="header-search d-flex">
                <input
                  type="text"
                  className="search-input flex-grow-1"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                />
                <button 
                  className="btn btn-outline ms-1"
                  onClick={handleSearch}
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
            <div className="col-md-2">
              <select 
                className="form-control form-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="all">Tüm Kategoriler</option>
                {categoryNames.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select 
                className="form-control form-select"
                value={selectedBrand}
                onChange={handleBrandChange}
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
                    setCurrentPage(1);
                    loadProducts(1);
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
                <th className="text-center">Kategori</th>
                <th className="text-center">Marka</th>
                <th className="text-center">Fiyat</th>
                <th className="text-center">Stok</th>
                <th className="text-center">Durum</th>
                <th className="text-center">Kar Marjı</th>
                <th className="text-center">Son Güncelleme</th>
                <th className="text-center">İşlemler</th>
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
                          {product.imageUrl ? (
                            <img 
                              src={product.imageUrl}
                              alt={product.name}
                              className="product-thumbnail"
                              style={{ 
                                width: '50px', 
                                height: '50px', 
                                objectFit: 'cover', 
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className="product-placeholder"
                            style={{ 
                              display: product.imageUrl ? 'none' : 'flex',
                              width: '50px', 
                              height: '50px', 
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <i className="fas fa-image text-gray"></i>
                          </div>
                        </div>
                        <div>
                          <div className="fw-bold">{product.name}</div>
                          <small className="text-gray">{product.description}</small>
                          <div className="small text-gray">
                            {product.barcode ? `#${product.barcode}` : 'Barkod yok'}
                            {product.color && (
                            <span className="ms-2">
                              • <span className="fw-medium"></span> {product.color}
                            </span>
                          )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline badge-main">{product.category}</span>
                    </td>
                    <td className="fw-bold">{product.brand}</td>
                    <td>
                      <div>
                        <div className="fw-bold">₺{product.price.toLocaleString()}</div>
                        <small className="text-gray justify-content-center">Maliyet: ₺{product.cost.toLocaleString()}</small>
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
                    <td className="text-center">
                      <span className="fw-bold text-success">
                        %{getProfitMargin(product.price, product.cost)}
                      </span>
                    </td>
                    <td className="text-center">
                      <small className="fw-bold">{product.lastUpdate}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button 
                          className="btn btn-sm btn-outline-main"
                          onClick={() => handleEdit(product)}
                          title="Düzenle"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-main"
                          onClick={() => handleViewDetails(product)}
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
       /* Grid View*/
      <div className="row">
        {filteredProducts.map(product => {
          const stockInfo = getStockStatus(product.stock, product.minStock);
          return (
            <div key={product.id} className="col-xl-4 col-lg-4 col-md-6 mb-4">
              <div className="dashboard-card product-card h-100 position-relative">
                {/* Product Actions - Top Right */}
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
                        <button 
                          className="dropdown-item"
                          onClick={() => handleEdit(product)}
                        >
                          <i className="fas fa-edit me-2 text-primary"></i>Düzenle
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item"
                        onClick={() => handleViewDetails(product)}
                        title="Detaylar"
                        >
                          <i className="fas fa-eye me-2 text-info"></i>Detaylar
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

                <div className="card-body p-3">
                  {/* Product Image - Centered */}
                  <div className="text-center mb-3">
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-3 bg-light border position-relative overflow-hidden"
                      style={{ 
                        width: '100px', 
                        height: '100px',
                        margin: '0 auto'
                      }}
                    >
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-100 h-100"
                          style={{ 
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<i class="fas fa-image text-muted" style="font-size: 2rem;"></i>';
                          }}
                        />
                      ) : (
                        <i className="fas fa-image text-muted" style={{ fontSize: '2rem' }}></i>
                      )}
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="text-center mb-3">
                    <h6 className="card-title mb-1 fw-bold text-truncate justify-content-center" title={product.name}>
                      {product.name}
                    </h6>
                    <p className="text-muted small mb-2" style={{ 
                      height: '2.4em', 
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {product.description || 'Açıklama bulunmuyor'}
                    </p>
                    <div className="d-flex justify-content-center gap-2 mb-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1">
                        {product.category}
                      </span>
                      {product.brand && (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary px-2 py-1">
                          {product.brand}
                        </span>
                      )}
                      {product.color && (
                        <span className="badge bg-info bg-opacity-10 text-info px-2 py-1">
                          {product.color}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Product Details Grid */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="text-center p-2 bg-light rounded-2">
                        <div className="fw-bold text-success fs-6">
                          ₺{product.price.toLocaleString('tr-TR')}
                        </div>
                        <small className="text-muted">Fiyat</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-2 bg-light rounded-2">
                        <div className="fw-bold fs-6">
                          {product.stock}
                        </div>
                        <small className="text-muted">Stok</small>
                      </div>
                    </div>
                  </div>

                  {/* Stock Status Bar */}
                  <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Stok Durumu</small>
                      <span className={`badge badge-${stockInfo.color} px-2`}>
                        {stockInfo.text}
                      </span>
                    </div>
                    <div className="progress" style={{ height: '4px' }}>
                      <div 
                        className={`progress-bar ${
                          stockInfo.status === 'good' ? 'bg-success' : 
                          stockInfo.status === 'low' ? 'bg-warning' : 'bg-danger'
                        }`}
                        style={{ 
                          width: `${Math.min(100, Math.max(5, (product.stock / (product.minStock * 3)) * 100))}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">Kar Marjı</small>
                      <div className="fw-bold text-success">
                        %{getProfitMargin(product.price, product.cost)}
                      </div>
                    </div>
                    <div className="text-end">
                      <small className="text-muted">Barkod</small>
                        <div className="fw-bold">
                          {product.barcode ? `#${product.barcode}` : 'Barkod yok'}
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

      {/* ✅ Pagination Component eklendi */}
      {!loading && products.length > 0 && <PaginationComponent />}

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-5">
          <i className="fas fa-search text-gray fs-1 mb-3"></i>
          <h5 className="text-gray">Ürün bulunamadı</h5>
          <p className="text-gray">Arama kriterlerinizi değiştirin veya yeni ürün ekleyin</p>
          <Link to="/employee/products/add" className="btn btn-main">
            <i className="fas fa-plus me-2"></i>
            Yeni Ürün Ekle
          </Link>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg pt-5">
            <div className="modal-content ms-auto">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>
                  Ürün Düzenle: {editingProduct?.name}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseEditModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Ürün Fotoğrafı</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {editForm.imagePreview && (
                      <img
                        src={editForm.imagePreview}
                        alt="Preview"
                        style={{ width: '100px', marginTop: '10px', borderRadius: '8px' }}
                      />
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Ürün Adı</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Marka</label>
                    <input
                      type="text"
                      className="form-control"
                      name="brand"
                      value={editForm.brand}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                  <label className="form-label">Renk</label>
                  <input
                    type="text"
                    className="form-control"
                    name="color"
                    value={editForm.color}
                    onChange={handleEditFormChange}
                    placeholder="Ürün rengi"
                  />
                </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Açıklama</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={editForm.description}
                      onChange={handleEditFormChange}
                    ></textarea>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Kategori</label>
                    <select
                      className="form-control"
                      name="categoryId"
                      value={editForm.categoryId}
                      onChange={handleEditFormChange}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Barkod</label>
                    <input
                      type="text"
                      className="form-control"
                      name="barcode"
                      value={editForm.barcode}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Satış Fiyatı (₺)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={editForm.price}
                      onChange={handleEditFormChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Maliyet Fiyatı (₺)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="costPrice"
                      value={editForm.costPrice}
                      onChange={handleEditFormChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mevcut Stok</label>
                    <input
                      type="number"
                      className="form-control"
                      name="currentStock"
                      value={editForm.currentStock}
                      onChange={handleEditFormChange}
                      min="0"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Minimum Stok</label>
                    <input
                      type="number"
                      className="form-control"
                      name="minimumStock"
                      value={editForm.minimumStock}
                      onChange={handleEditFormChange}
                      min="0"
                    />
                  </div>
                </div>
                
                {/* Profit Margin Display */}
                <div className="alert alert-info">
                  <div className="d-flex justify-content-between">
                    <span>Kar Marjı:</span>
                    <strong>
                      %{getProfitMargin(parseFloat(editForm.price) || 0, parseFloat(editForm.costPrice) || 0)}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseEditModal}
                >
                  <i className="fas fa-times me-2"></i>
                  İptal
                </button>
                <button 
                  type="button" 
                  className="btn btn-main"
                  onClick={handleSaveEdit}
                >
                  <i className="fas fa-save me-2"></i>
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal - Centered Version */}
      {showDetailsModal && selectedProduct && (
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
                  <i className="fas fa-eye me-2"></i>
                  Ürün Detayları
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseDetailsModal}
                ></button>
              </div>
              <div className="modal-body p-0" style={{ overflow: 'auto', flex: 1 }}>
                {/* Product Header */}
                <div className="bg-light p-4 border-bottom">
                  <div className="row align-items-center">
                    <div className="col-md-3 text-center">
                      <div 
                        className="rounded-3 bg-white border d-flex align-items-center justify-content-center shadow-sm"
                        style={{ 
                          width: '150px', 
                          height: '150px',
                          margin: '0 auto',
                          backgroundImage: selectedProduct.imageUrl ? `url(${selectedProduct.imageUrl})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                        {!selectedProduct.imageUrl && (
                          <i className="fas fa-image text-muted" style={{ fontSize: '3rem' }}></i>
                        )}
                      </div>
                    </div>
                    <div className="col-md-9 text-end">
                      <h3 className="mb-2 text-primary">{selectedProduct.name}</h3>
                      <p className="text-muted mb-3">{selectedProduct.description || 'Açıklama bulunmuyor'}</p>
                      <div className="d-flex gap-2 mb-2 justify-content-end">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                          {selectedProduct.category}
                        </span>
                        {selectedProduct.brand && (
                          <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                            {selectedProduct.brand}
                          </span>
                        )}
                        <span className={`badge bg-${getStockStatus(selectedProduct.stock, selectedProduct.minStock).color} px-3 py-2`}>
                          {getStockStatus(selectedProduct.stock, selectedProduct.minStock).text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <div className="row">
                    {/* Pricing Information */}
                    <div className="col-md-6 mb-4">
                      <h6 className="text-primary mb-3">
                        <i className="fas fa-dollar-sign me-2"></i>
                        Fiyat Bilgileri
                      </h6>
                      <div className="bg-light rounded p-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Satış Fiyatı:</span>
                          <strong className="text-success">₺{selectedProduct.price.toLocaleString('tr-TR')}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Maliyet Fiyatı:</span>
                          <strong>₺{selectedProduct.cost.toLocaleString('tr-TR')}</strong>
                        </div>
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between">
                          <span>Kar Marjı:</span>
                          <strong className="text-success">
                            %{getProfitMargin(selectedProduct.price, selectedProduct.cost)}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                          <span>Kar Miktarı:</span>
                          <strong className="text-success">
                            ₺{(selectedProduct.price - selectedProduct.cost).toLocaleString('tr-TR')}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Stock Information */}
                    <div className="col-md-6 mb-4">
                      <h6 className="text-primary mb-3">
                        <i className="fas fa-boxes me-2"></i>
                        Stok Bilgileri
                      </h6>
                      <div className="bg-light rounded p-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Mevcut Stok:</span>
                          <strong>{selectedProduct.stock} adet</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                          <span>Minimum Stok:</span>
                          <strong>{selectedProduct.minStock} adet</strong>
                        </div>
                        
                        {/* Stock Level Bar */}
                        <div className="mb-2">
                          <small className="text-muted">Stok Seviyesi</small>
                          <div className="progress mt-1" style={{ height: '8px' }}>
                            <div 
                              className={`progress-bar ${
                                getStockStatus(selectedProduct.stock, selectedProduct.minStock).status === 'good' ? 'bg-success' : 
                                getStockStatus(selectedProduct.stock, selectedProduct.minStock).status === 'low' ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ 
                                width: `${Math.min(100, Math.max(5, (selectedProduct.stock / (selectedProduct.minStock * 3)) * 100))}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between">
                          <span>Toplam Değer:</span>
                          <strong className="text-info">
                            ₺{(selectedProduct.price * selectedProduct.stock).toLocaleString('tr-TR')}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="col-md-6 mb-4">
                      <h6 className="text-primary mb-3">
                        <i className="fas fa-info-circle me-2"></i>
                        Ürün Bilgileri
                      </h6>
                      <div className="bg-light rounded p-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Kategori:</span>
                          <strong>{selectedProduct.category}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Marka:</span>
                          <strong>{selectedProduct.brand || 'Belirtilmemiş'}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Barkod:</span>
                          <strong>{selectedProduct.barcode || 'Yok'}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Durum:</span>
                          <span className="badge bg-success">Aktif</span>
                        </div>
                        {selectedProduct.color && ( 
                          <div className="d-flex justify-content-between">
                            <span>Ürünün Rengi:</span>
                            <strong>{selectedProduct.color}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="col-md-6 mb-4">
                      <h6 className="text-primary mb-3">
                        <i className="fas fa-calendar me-2"></i>
                        Tarih Bilgileri
                      </h6>
                      <div className="bg-light rounded p-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Oluşturulma:</span>
                          <strong>{selectedProduct.createdDate}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Güncelleme:</span>
                          <strong>{selectedProduct.lastUpdate}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline-primary"
                  onClick={() => {
                    handleCloseDetailsModal();
                    handleEdit(selectedProduct);
                  }}
                >
                  <i className="fas fa-edit me-2"></i>
                  Düzenle
                </button>
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
    </div>
  );
};

export default EmployeeProductList;