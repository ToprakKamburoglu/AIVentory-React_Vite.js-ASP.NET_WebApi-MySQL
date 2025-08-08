import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AdminAddProduct = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    model: '',
    price: '',
    cost: '',
    stock: '',
    minStock: '',
    barcode: '',
    image: null
  });

  const [categories] = useState([
    'Telefon',
    'Bilgisayar',
    'Kulaklık',
    'Şarj Aleti',
    'Kılıf',
    'Powerbank',
    'Tablet',
    'Saat'
  ]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && id) {
      
      loadProductData(id);
    }
  }, [id, isEditMode]);

  const loadProductData = async (productId) => {
    setLoading(true);
    try {
      
      const mockProducts = {
        '1': {
          name: 'iPhone 15 Pro',
          description: 'Apple iPhone 15 Pro 256GB Space Black',
          category: 'Telefon',
          brand: 'Apple',
          model: 'iPhone 15 Pro',
          price: '45000',
          cost: '40000',
          stock: '15',
          minStock: '5',
          barcode: '1234567890123',
          image: null
        },
        '2': {
          name: 'Samsung Galaxy S24',
          description: 'Samsung Galaxy S24 Ultra 512GB',
          category: 'Telefon',
          brand: 'Samsung',
          model: 'Galaxy S24',
          price: '35000',
          cost: '30000',
          stock: '12',
          minStock: '10',
          barcode: '1234567890124',
          image: null
        },
        '3': {
          name: 'AirPods Pro 2',
          description: 'Apple AirPods Pro 2nd Generation',
          category: 'Kulaklık',
          brand: 'Apple',
          model: 'AirPods Pro 2',
          price: '7000',
          cost: '6000',
          stock: '8',
          minStock: '5',
          barcode: '1234567890125',
          image: null
        }
      };

      const productData = mockProducts[productId] || mockProducts['1'];
      setFormData(productData);
      
    } catch (error) {
      console.error('Ürün yükleme hatası:', error);
      
      alert('Ürün bilgileri yüklenirken hata oluştu!');
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır!');
        return;
      }
      
     
      if (!file.type.startsWith('image/')) {
        alert('Lütfen sadece resim dosyası seçin!');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

   
    if (!formData.name.trim()) newErrors.name = 'Ürün adı gereklidir';
    if (!formData.category) newErrors.category = 'Kategori seçilmelidir';
    if (!formData.brand.trim()) newErrors.brand = 'Marka gereklidir';
    
   
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
    }
    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'Geçerli bir maliyet giriniz';
    }
    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Geçerli bir stok miktarı giriniz';
    }
    if (formData.minStock === '' || parseInt(formData.minStock) < 0) {
      newErrors.minStock = 'Geçerli bir minimum stok giriniz';
    }


    if (formData.price && formData.cost && parseFloat(formData.cost) >= parseFloat(formData.price)) {
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
     
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (isEditMode) {
       
        console.log('Ürün güncellendi:', formData);
        alert('Ürün başarıyla güncellendi!');
      } else {
       
        console.log('Yeni ürün eklendi:', formData);
        alert('Ürün başarıyla eklendi!');
      }

      navigate('/admin/products');
      
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Kaydetme işlemi sırasında hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfit = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.cost) || 0;
    return price - cost;
  };

  const calculateProfitMargin = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.cost) || 0;
    if (price === 0) return 0;
    return ((price - cost) / price * 100).toFixed(2);
  };


  if (loading && isEditMode) {
    return (
      <div className="text-center py-5">
        <div className="loading-spinner lg"></div>
        <p className="mt-3 text-gray">Ürün bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
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
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-info-circle text-main me-2"></i>
                Ürün Bilgileri
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
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
                        className={`form-control form-select ${errors.category ? 'is-invalid' : ''}`}
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="">Kategori seçin</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                    </div>
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
                      />
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
                        rows="3"
                        placeholder="Ürün hakkında detaylı bilgi..."
                        maxLength="500"
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
                        className={`form-control ${errors.cost ? 'is-invalid' : ''}`}
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                      {errors.cost && <div className="invalid-feedback">{errors.cost}</div>}
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
                        className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0"
                      />
                      {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
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
                        className={`form-control ${errors.minStock ? 'is-invalid' : ''}`}
                        name="minStock"
                        value={formData.minStock}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0"
                      />
                      {errors.minStock && <div className="invalid-feedback">{errors.minStock}</div>}
                    </div>
                  </div>

                  {/* Barkod */}
                  <div className="col-md-12">
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
                      />
                      {errors.barcode && <div className="invalid-feedback">{errors.barcode}</div>}
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="d-flex gap-3 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-main"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner me-2"></div>
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
                          category: '',
                          brand: '',
                          model: '',
                          price: '',
                          cost: '',
                          stock: '',
                          minStock: '',
                          barcode: '',
                          image: null
                        });
                        setErrors({});
                      }}
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
          {/* Image Upload */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-image text-main me-2"></i>
                Ürün Fotoğrafı
              </h3>
            </div>
            <div className="card-body">
              <div className="text-center">
                <div className="product-image-upload">
                  {formData.image ? (
                    <div className="uploaded-image">
                      <img 
                        src={URL.createObjectURL(formData.image)} 
                        alt="Ürün" 
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px', maxWidth: '100%' }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-sm btn-danger mt-2"
                        onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Kaldır
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder p-4 border-2 border-dashed border-gray rounded text-center">
                      <i className="fas fa-cloud-upload-alt text-gray fs-1 mb-3"></i>
                      <p className="text-gray mb-3">Ürün fotoğrafı yükleyin</p>
                      <input
                        type="file"
                        className="d-none"
                        id="productImage"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="productImage" className="btn btn-outline-main">
                        <i className="fas fa-upload me-2"></i>
                        Fotoğraf Seç
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  <small>
                    <strong>İpucu:</strong> En iyi sonuç için ürünün net ve tamamen görünür olduğu fotoğraflar kullanın. 
                    Maksimum dosya boyutu: 5MB
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Profit Calculation */}
          {formData.price && formData.cost && (
            <div className="dashboard-card mt-4">
              <div className="card-header">
                <h3 className="card-title">
                  <i className="fas fa-calculator text-main me-2"></i>
                  Kar Hesaplama
                </h3>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Satış Fiyatı:</span>
                  <span className="fw-bold">₺{parseFloat(formData.price || 0).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Maliyet:</span>
                  <span className="fw-bold">₺{parseFloat(formData.cost || 0).toLocaleString()}</span>
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

          {/* Quick Tips */}
          <div className="dashboard-card mt-4">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-lightbulb text-warning me-2"></i>
                İpuçları
              </h3>
            </div>
            <div className="card-body">
              <div className="tips-list">
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