import React, { useState } from 'react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Telefon', productCount: 156, description: 'Akıllı telefonlar ve cep telefonları', color: '#3B82F6' },
    { id: 2, name: 'Bilgisayar', productCount: 89, description: 'Laptop, masaüstü ve tablet bilgisayarlar', color: '#10B981' },
    { id: 3, name: 'Kulaklık', productCount: 234, description: 'Kablolu ve kablosuz kulaklıklar', color: '#F59E0B' },
    { id: 4, name: 'Şarj Aleti', productCount: 145, description: 'Şarj cihazları ve adaptörler', color: '#EF4444' },
    { id: 5, name: 'Kılıf', productCount: 312, description: 'Telefon ve tablet kılıfları', color: '#8B5CF6' },
    { id: 6, name: 'Powerbank', productCount: 67, description: 'Taşınabilir şarj cihazları', color: '#06B6D4' },
    { id: 7, name: 'Saat', productCount: 23, description: 'Akıllı saatler ve klasik saatler', color: '#84CC16' },
    { id: 8, name: 'Tablet', productCount: 45, description: 'iPad ve Android tabletler', color: '#F97316' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#3B82F6' });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setShowModal(true);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCategory) {
      // Güncelleme
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      // Yeni ekleme
      const newCategory = {
        id: Date.now(),
        ...formData,
        productCount: 0
      };
      setCategories(prev => [...prev, newCategory]);
    }
    
    setShowModal(false);
    setFormData({ name: '', description: '', color: '#3B82F6' });
  };

  const getTotalProducts = () => {
    return categories.reduce((total, cat) => total + cat.productCount, 0);
  };

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-main mb-2">
            <i className="fas fa-tags me-2"></i>
            Kategori Yönetimi
          </h1>
          <p className="text-gray mb-0">
            Ürün kategorilerini yönetin ve düzenleyin
          </p>
        </div>
        <button className="btn btn-main" onClick={handleAddCategory}>
          <i className="fas fa-plus me-2"></i>
          Yeni Kategori
        </button>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Toplam Kategori</div>
              <div className="stat-icon">
                <i className="fas fa-tags"></i>
              </div>
            </div>
            <div className="stat-value">{categories.length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card success">
            <div className="stat-header">
              <div className="stat-title">Toplam Ürün</div>
              <div className="stat-icon success">
                <i className="fas fa-box"></i>
              </div>
            </div>
            <div className="stat-value">{getTotalProducts()}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">En Popüler</div>
              <div className="stat-icon">
                <i className="fas fa-star"></i>
              </div>
            </div>
            <div className="stat-value">
              {categories.reduce((max, cat) => cat.productCount > max.productCount ? cat : max, categories[0])?.name}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card warning">
            <div className="stat-header">
              <div className="stat-title">Boş Kategori</div>
              <div className="stat-icon warning">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
            </div>
            <div className="stat-value">
              {categories.filter(cat => cat.productCount === 0).length}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="dashboard-card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="header-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Kategori ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-outline-main btn-sm">
                  <i className="fas fa-download me-1"></i>
                  Dışa Aktar
                </button>
                <button className="btn btn-outline-main btn-sm">
                  <i className="fas fa-upload me-1"></i>
                  İçe Aktar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="row">
        {filteredCategories.map(category => (
          <div key={category.id} className="col-lg-4 col-md-6 mb-4">
            <div className="dashboard-card category-card h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="category-color-dot me-3"
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      backgroundColor: category.color 
                    }}
                  ></div>
                  <h5 className="card-title mb-0 flex-grow-1">{category.name}</h5>
                  <div className="dropdown">
                    <button 
                      className="btn btn-sm btn-outline-main dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button 
                          className="dropdown-item"
                          onClick={() => handleEditCategory(category)}
                        >
                          <i className="fas fa-edit me-2"></i>Düzenle
                        </button>
                      </li>
                      <li>
                        <button 
                          className="dropdown-item text-danger"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <i className="fas fa-trash me-2"></i>Sil
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <p className="text-gray small mb-3">{category.description}</p>
                
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge badge-main">
                      {category.productCount} ürün
                    </span>
                  </div>
                  <button className="btn btn-sm btn-outline-main">
                    <i className="fas fa-eye me-1"></i>
                    Ürünleri Gör
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-search text-gray fs-1 mb-3"></i>
          <h5 className="text-gray">Kategori bulunamadı</h5>
          <p className="text-gray">Arama kriterlerinizi değiştirin veya yeni kategori ekleyin</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
              </h5>
              <button 
                type="button" 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label className="form-label">Kategori Adı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Kategori adını girin"
                    required
                  />
                </div>
                
                <div className="form-group mb-3">
                  <label className="form-label">Açıklama</label>
                  <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Kategori açıklaması"
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Renk</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {colors.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`color-picker ${formData.color === color ? 'selected' : ''}`}
                        style={{ 
                          width: '30px', 
                          height: '30px', 
                          borderRadius: '50%', 
                          backgroundColor: color,
                          border: formData.color === color ? '3px solid #333' : '2px solid #ddd'
                        }}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-main" onClick={() => setShowModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-main">
                  <i className={`fas ${editingCategory ? 'fa-save' : 'fa-plus'} me-2`}></i>
                  {editingCategory ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;