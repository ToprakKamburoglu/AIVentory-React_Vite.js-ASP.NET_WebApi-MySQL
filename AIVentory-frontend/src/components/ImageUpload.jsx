import React, { useState, useRef } from 'react';

const ImageUpload = ({ onImageUpload, currentImage = null, folder = "products" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
  
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Sadece resim dosyaları kabul edilir (JPG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { 
      setError('Dosya boyutu 5MB\'dan büyük olamaz');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/file/upload-image?folder=${folder}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      console.log('Upload result:', result);

      if (result.success) {
        setPreview(result.data.imageUrl);
       
        onImageUpload(result.data.imagePath, result.data.imageUrl);
      } else {
        setError(result.message || 'Resim yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Resim yüklenirken hata oluştu: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const clearImage = () => {
    setPreview(null);
    onImageUpload('', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <div className="form-group">
        <label className="form-label">Ürün Resmi</label>
        
        {/* Preview Area */}
        <div 
          className={`image-upload-area ${uploading ? 'uploading' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            border: '2px dashed #ddd',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            position: 'relative',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          {preview ? (
            <div className="image-preview-container" style={{ width: '100%' }}>
              <img 
                src={preview} 
                alt="Ürün önizleme" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: '4px'
                }}
              />
              <div className="image-actions mt-2">
                <button 
                  type="button"
                  className="btn btn-sm btn-outline-danger me-2"
                  onClick={clearImage}
                >
                  <i className="fas fa-trash me-1"></i>
                  Kaldır
                </button>
                <button 
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="fas fa-edit me-1"></i>
                  Değiştir
                </button>
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              {uploading ? (
                <div>
                  <div className="spinner-border text-primary mb-2" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                  <p>Resim yükleniyor...</p>
                </div>
              ) : (
                <div>
                  <i className="fas fa-cloud-upload-alt text-muted mb-2" style={{ fontSize: '3rem' }}></i>
                  <p className="mb-2">Resim yüklemek için tıklayın veya sürükleyip bırakın</p>
                  <small className="text-muted">
                    Desteklenen formatlar: JPG, PNG, GIF, WebP (Max: 5MB)
                  </small>
                  <div className="mt-3">
                    <button 
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Resim Seç
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Error Display */}
        {error && (
          <div className="alert alert-danger mt-2">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Help Text */}
        <small className="text-muted mt-1 d-block">
          Ürün resmini yükleyerek müşterilerin ürünü daha iyi tanımasını sağlayabilirsiniz.
        </small>
      </div>
    </div>
  );
};

export default ImageUpload;