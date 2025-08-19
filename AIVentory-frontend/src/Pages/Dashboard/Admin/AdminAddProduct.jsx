import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUpload from '../../../components/ImageUpload'; 
import {useAuth} from '../../../hooks/useAuth.jsx'; 

const AdminAddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    companyId: user.companyId,
    name: '',
    description: '',
    categoryId: '1',
    brand: '',
    model: '',
    color: '',
    price: '',
    costPrice: '',
    currentStock: '',
    minimumStock: '',
    barcode: '',
    imageUrl: '' 
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    loadCategories();
    if (isEditMode && id) {
      loadProductData(id);
    }
  }, [id, isEditMode]);

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data);
      } else {
        console.error('Kategoriler yüklenirken hata:', result.message);
        setFallbackCategories();
      }
    } catch (error) {
      console.error('Kategori yükleme hatası:', error);
      setFallbackCategories();
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
  };

  const loadProductData = async (productId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      console.log('Load Product Response:', result);
      
      if (result.success) {
        const product = result.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          categoryId: product.categoryId?.toString() || '1',
          brand: product.brand || '',
          model: product.model || '',
          color: product.color || '',
          price: product.price?.toString() || '',
          costPrice: product.costPrice?.toString() || '',
          currentStock: product.currentStock?.toString() || '',
          minimumStock: product.minimumStock?.toString() || '',
          barcode: product.barcode || '',
          imageUrl: product.imageUrl || '' 
        });
        
        console.log('Loaded product data:', product);
      } else {
        alert('Ürün bilgileri yüklenirken hata oluştu!');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Ürün yükleme hatası:', error);
      alert('Ürün bilgileri yüklenirken hata oluştu!');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  
  const handleImageUpload = (relativePath, fullUrl) => {
    console.log('Image uploaded:', { relativePath, fullUrl });
    setFormData(prev => ({
      ...prev,
      imageUrl: relativePath 
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    
    if (value === 'new') {
      setShowNewCategoryInput(true);
      setFormData(prev => ({ ...prev, categoryId: '' }));
    } else {
      setShowNewCategoryInput(false);
      setFormData(prev => ({ ...prev, categoryId: value }));
    }
  };

  const handleAddNewCategory = async () => {
  if (!newCategoryName.trim()) {
    alert('Kategori adı boş olamaz!');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newCategoryName.trim(),
        description: `${newCategoryName} kategorisi`,
        companyId: user.companyId 
      })
    });

    const result = await response.json();

    if (result.success) {
      await loadCategories();
      setFormData(prev => ({
        ...prev,
        categoryId: result.data.id.toString()
      }));
      setNewCategoryName('');
      setShowNewCategoryInput(false);
      alert('Yeni kategori başarıyla eklendi!');
    } else {
      alert(result.message || 'Kategori eklenirken hata oluştu!');
    }
  } catch (error) {
    console.error('Kategori ekleme hatası:', error);
    alert('Kategori eklenirken hata oluştu!');
  }
};

console.log('user.companyId:', user.companyId); 

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Ürün adı gereklidir';
    
    if (showNewCategoryInput) {
      if (!newCategoryName.trim()) {
        newErrors.categoryId = 'Yeni kategori adı gereklidir';
      }
    } else {
      if (!formData.categoryId) {
        newErrors.categoryId = 'Kategori seçilmelidir'; 
      }
    }
    
    if (!formData.brand.trim()) newErrors.brand = 'Marka gereklidir';
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
    }
    if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) {
      newErrors.costPrice = 'Geçerli bir maliyet giriniz';
    }
    if (formData.currentStock === '' || parseInt(formData.currentStock) < 0) {
      newErrors.currentStock = 'Geçerli bir stok miktarı giriniz';
    }
    if (formData.minimumStock === '' || parseInt(formData.minimumStock) < 0) {
      newErrors.minimumStock = 'Geçerli bir minimum stok giriniz';
    }

    if (formData.price && formData.costPrice && parseFloat(formData.costPrice) >= parseFloat(formData.price)) {
      newErrors.price = 'Satış fiyatı maliyetten büyük olmalıdır';
    }

    if (formData.barcode && formData.barcode.length < 8) {
      newErrors.barcode = 'Barkod en az 8 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (showNewCategoryInput && newCategoryName.trim()) {
      try {
        const token = localStorage.getItem('token');
        const categoryResponse = await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newCategoryName.trim(),
            description: `${newCategoryName} kategorisi`,
            companyId: user.companyId
          })
        });

        const categoryResult = await categoryResponse.json();
        
        if (categoryResult.success) {
          setFormData(prev => ({
            ...prev,
            categoryId: categoryResult.data.id.toString()
          }));
          await loadCategories();
        } else {
          alert('Kategori eklenirken hata oluştu: ' + categoryResult.message);
          return;
        }
      } catch (error) {
        console.error('Kategori ekleme hatası:', error);
        alert('Kategori eklenirken hata oluştu!');
        return;
      }
    }
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        name: formData.name,
        description: formData.description,
        categoryId: parseInt(formData.categoryId),
        companyId: user.companyId,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        price: parseFloat(formData.price),
        costPrice: parseFloat(formData.costPrice),
        currentStock: parseInt(formData.currentStock),
        minimumStock: parseInt(formData.minimumStock),
        barcode: formData.barcode || null,
        imageUrl: formData.imageUrl || null 
      };

      console.log('Gönderilecek veri:', dataToSend);

      const token = localStorage.getItem('token');
      let response;
      if (isEditMode) {
        response = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend)
        });
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        alert(isEditMode ? 'Ürün başarıyla güncellendi!' : 'Ürün başarıyla eklendi!');
        navigate('/admin/products');
      } else {
        console.error('API Error Details:', result);
        
        if (result.errors) {
          const errorMessages = Object.entries(result.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          alert(`Doğrulama hataları:\n${errorMessages}`);
        } else {
          alert(result.message || 'İşlem sırasında hata oluştu!');
        }
      }
      
    } catch (error) {
      console.error('API Error:', error);
      alert('Sunucuya bağlanırken hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfit = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.costPrice) || 0;
    return price - cost;
  };

  const calculateProfitMargin = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.costPrice) || 0;
    if (price === 0) return 0;
    return ((price - cost) / price * 100).toFixed(2);
  };

  if (loading && isEditMode) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <p className="mt-3 text-gray">Ürün bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pt-4">
        <div>
          <h1 className="text-main mb-2">
            <i className={`fas ${isEditMode ? 'fa-edit' : 'fa-plus-circle'} me-2`}></i>
            {isEditMode ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
          </h1>
          <p className="text-gray mb-0">
            {isEditMode ? `Ürün bilgilerini güncelleyin (ID: ${id})` : 'Sisteme yeni ürün ekleyin'}
          </p>
        </div>
        <button 
          type="button" 
          className="btn btn-outline-main"
          onClick={() => navigate('/admin/products')}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Geri Dön
        </button>
      </div>

      <div className="row">
        {/* Form Section */}
        <div className="col-lg-8">
          <div className="dashboard-card">
            <div className="card-body" style={{ padding: '2.5rem' }}>
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* ✅ Image Upload Component */}
                  <div className="col-12">
                    <ImageUpload 
                      onImageUpload={handleImageUpload}
                      currentImage={formData.imageUrl ? `${API_BASE_URL.replace('/api', '')}${formData.imageUrl}` : null}
                      folder="products"
                    />
                  </div>

                  {/* Ürün Adı */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        Ürün Adı <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Örn: iPhone 15 Pro"
                        maxLength="100"
                        style={{ padding: '0.75rem', fontSize: '1rem' }}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </div>

                  {/* Kategori */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        Kategori <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-control form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                        name="categoryId"
                        value={showNewCategoryInput ? 'new' : formData.categoryId}
                        onChange={handleCategoryChange}
                        style={{ padding: '0.75rem', fontSize: '1rem' }}
                      >
                        <option value="">Kategori seçin</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        <option value="new" style={{ color: '#28a745', fontWeight: 'bold' }}>+ Yeni Kategori Ekle</option>
                      </select>
                      {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                    </div>
                    
                    {/* Yeni kategori input'u */}
                    {showNewCategoryInput && (
                      <div className="form-group mt-3">
                        <label className="form-label">
                          Yeni Kategori Adı <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Kategori adını girin..."
                            maxLength="100"
                            style={{ padding: '0.75rem', fontSize: '1rem' }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddNewCategory();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleAddNewCategory}
                            disabled={!newCategoryName.trim()}
                          >
                            <i className="fas fa-plus me-1"></i>
                            Ekle
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setShowNewCategoryInput(false);
                              setNewCategoryName('');
                              setFormData(prev => ({ ...prev, categoryId: categories[0]?.id?.toString() || '1' }));
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        <small className="text-muted">
                          Enter tuşuna basarak da kategori ekleyebilirsiniz
                        </small>
                      </div>
                    )}
                  </div>

                  {/* Marka */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        Marka <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Örn: Apple"
                        maxLength="50"
                        style={{ padding: '0.75rem', fontSize: '1rem' }}
                      />
                      {errors.brand && <div className="invalid-feedback">{errors.brand}</div>}
                    </div>
                  </div>

                  {/* Model */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Model</label>
                      <input
                        type="text"
                        className="form-control"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder="Örn: iPhone 15 Pro"
                        maxLength="50"
                        style={{ padding: '0.75rem', fontSize: '1rem' }}
                      />
                    </div>
                  </div>

                  {/* Renk */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Renk</label>
                      <input
                        type="text"
                        className="form-control"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder="Örn: Siyah, Beyaz, Mavi"
                        maxLength="30"
                        style={{ padding: '0.75rem', fontSize: '1rem' }}
                      />
                    </div>
                  </div>

                  {/* Barkod */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Barkod</label>
                      <input
                        type="text"
                        className={`form-control ${errors.barcode ? 'is-invalid' : ''}`}
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleInputChange}
                        placeholder="Barkod numarası"
                        maxLength="20"
                        style={{ padding: '0.75rem', fontSize: '1rem' }}
                      />
                      {errors.barcode && <div className="invalid-feedback">{errors.barcode}</div>}
                    </div>
                  </div>

                  {/* Açıklama */}
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Açıklama</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Ürün hakkında detaylı bilgi..."
                        maxLength="500"
                        style={{ padding: '0.75rem', fontSize: '1rem' }}
                      />
                      <small className="text-gray">
                        {formData.description.length}/500 karakter
                      </small>
                    </div>
                  </div>

                  {/* Satış Fiyatı */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        Satış Fiyatı (₺) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        style={{ padding: '0.75rem', fontSize: '1rem' }}
                      />
                      {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>
                  </div>

                  {/* Maliyet */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        Maliyet (₺) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${errors.costPrice ? 'is-invalid' : ''}`}
                        name="costPrice"
                        value={formData.costPrice}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        style={{ padding: '0.75rem', fontSize: '1rem' }}
                      />
                      {errors.costPrice && <div className="invalid-feedback">{errors.costPrice}</div>}
                    </div>
                  </div>

                  {/* Stok Miktarı */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        Stok Miktarı <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${errors.currentStock ? 'is-invalid' : ''}`}
                        name="currentStock"
                        value={formData.currentStock}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0"
                        style={{ padding: '0.75rem', fontSize: '1rem' }}
                      />
                      {errors.currentStock && <div className="invalid-feedback">{errors.currentStock}</div>}
                    </div>
                  </div>

                  {/* Minimum Stok */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        Minimum Stok <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${errors.minimumStock ? 'is-invalid' : ''}`}
                        name="minimumStock"
                        value={formData.minimumStock}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0"
                        style={{ padding: '0.75rem', fontSize: '1rem' }}
                      />
                      {errors.minimumStock && <div className="invalid-feedback">{errors.minimumStock}</div>}
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="d-flex gap-3 mt-5 pt-4" style={{ borderTop: '1px solid #dee2e6' }}>
                  <button 
                    type="submit" 
                    className="btn btn-main"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        {isEditMode ? 'Güncelleniyor...' : 'Kaydediliyor...'}
                      </>
                    ) : (
                      <>
                        <i className={`fas ${isEditMode ? 'fa-save' : 'fa-plus'} me-2`}></i>
                        {isEditMode ? 'Güncelle' : 'Kaydet'}
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-main"
                    onClick={() => navigate('/admin/products')}
                    disabled={loading}
                  >
                    İptal
                  </button>
                  {!isEditMode && (
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setFormData({
                          name: '',
                          description: '',
                          categoryId: '1',
                          brand: '',
                          model: '',
                          color: '',
                          price: '',
                          costPrice: '',
                          currentStock: '',
                          minimumStock: '',
                          barcode: '',
                          imageUrl: ''
                        });
                        setErrors({});
                      }}
                      disabled={loading}
                    >
                      <i className="fas fa-undo me-2"></i>
                      Temizle
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Stok Bilgisi */}
          {formData.currentStock && (
            <div className="dashboard-card p-3 mb-3">
              <div className="card-header">
                <h3 className="card-title">
                  <i className="fas fa-boxes text-info me-2"></i>
                  Stok Bilgisi
                </h3>
              </div>
              <div className="card-body pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Mevcut Stok:</span>
                  <span className="fw-bold text-primary">{formData.currentStock} adet</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Minimum Stok:</span>
                  <span className="fw-bold">{formData.minimumStock || '0'} adet</span>
                </div>
                {formData.currentStock && formData.minimumStock && (
                  <div className="progress mt-2" style={{ height: '6px' }}>
                    <div 
                      className={`progress-bar ${
                        parseInt(formData.currentStock) <= parseInt(formData.minimumStock) ? 'bg-danger' : 
                        parseInt(formData.currentStock) <= parseInt(formData.minimumStock) * 1.5 ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ 
                        width: `${Math.min(100, Math.max(10, (parseInt(formData.currentStock) / (parseInt(formData.minimumStock) * 3)) * 100))}%` 
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Kar Hesaplama */}
          {formData.price && formData.costPrice && (
            <div className="dashboard-card p-3 mb-3">
              <div className="card-header">
                <h3 className="card-title">
                  <i className="fas fa-calculator text-main me-2"></i>
                  Kar Hesaplama
                </h3>
              </div>
              <div className="card-body pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Satış Fiyatı:</span>
                  <span className="fw-bold">₺{parseFloat(formData.price || 0).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Maliyet:</span>
                  <span className="fw-bold">₺{parseFloat(formData.costPrice || 0).toLocaleString()}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold">Kar:</span>
                  <span className={`fw-bold ${calculateProfit() >= 0 ? 'text-success' : 'text-danger'}`}>
                    ₺{calculateProfit().toLocaleString()}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Kar Marjı:</span>
                  <span className={`fw-bold ${calculateProfitMargin() >= 0 ? 'text-success' : 'text-danger'}`}>
                    %{calculateProfitMargin()}
                  </span>
                </div>
                
                {calculateProfit() < 0 && (
                  <div className="alert alert-warning mt-3">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <small>Maliyet satış fiyatından yüksek!</small>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* İpuçları */}
          <div className="dashboard-card p-3">
            <div className="card-header pb-3">
              <h3 className="card-title">
                <i className="fas fa-lightbulb text-warning me-2"></i>
                İpuçları
              </h3>
            </div>
            <div className="card-body">
              <div className="tips-list">
                <div className="tip-item mb-3">
                  <i className="fas fa-check text-success me-2"></i>
                  <small>Resim yüklemek ürün tanıtımını geliştirir</small>
                </div>
                <div className="tip-item mb-3">
                  <i className="fas fa-check text-success me-2"></i>
                  <small>Ürün adını net ve açık yazın</small>
                </div>
                <div className="tip-item mb-3">
                  <i className="fas fa-check text-success me-2"></i>
                  <small>Doğru kategori seçimi önemlidir</small>
                </div>
                <div className="tip-item mb-3">
                  <i className="fas fa-check text-success me-2"></i>
                  <small>Minimum stok seviyesini dikkatli belirleyin</small>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check text-success me-2"></i>
                  <small>Barkod girişi opsiyonel ama önerilir</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;