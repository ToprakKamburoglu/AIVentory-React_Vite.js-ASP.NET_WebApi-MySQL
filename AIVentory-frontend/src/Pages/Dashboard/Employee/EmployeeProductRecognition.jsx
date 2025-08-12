import React, { useState, useRef } from 'react';

const EmployeeProductRecognition = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([
    {
      id: 1,
      date: '2024-01-15 14:30',
      image: '/images/demo-product-1.jpg',
      result: {
        productName: 'iPhone 17 Pro',
        category: 'Elektronik',
        brand: 'Apple', 
        confidence: 94.7,
        estimatedPrice: 67500.00,
        color: 'Titanyum Doğal',
        features: ['128GB', '6.1 inç', 'Pro Kamera Sistemi']
      },
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-01-15 13:45',
      image: '/images/demo-product-2.jpg',
      result: {
        productName: 'Samsung Galaxy S24',
        category: 'Elektronik',
        brand: 'Samsung',
        confidence: 89.3,
        estimatedPrice: 35000.00,
        color: 'Phantom Black',
        features: ['256GB', '6.2 inç', 'Triple Kamera']
      },
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-01-15 12:30',
      image: '/images/demo-product-3.jpg',
      result: {
        productName: 'MacBook Air M2',
        category: 'Elektronik',
        brand: 'Apple',
        confidence: 96.1,
        estimatedPrice: 54900.00,
        color: 'Space Gray',
        features: ['M2 Chip', '13.6 inç', '8GB RAM']
      },
      status: 'completed'
    }
  ]);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
     
      if (file.size > 10 * 1024 * 1024) {
        alert('Dosya boyutu çok büyük. Maksimum 10MB yükleyebilirsiniz.');
        return;
      }

      
      if (!file.type.startsWith('image/')) {
        alert('Lütfen sadece görsel dosyası seçin.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          file: file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type
        });
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        
        if (file.size > 10 * 1024 * 1024) {
          alert('Dosya boyutu çok büyük. Maksimum 10MB yükleyebilirsiniz.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage({
            file: file,
            preview: e.target.result,
            name: file.name,
            size: file.size,
            type: file.type
          });
          setAnalysisResult(null);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Lütfen sadece görsel dosyası yükleyin.');
      }
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      alert('Lütfen önce bir görsel seçin.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
     
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      await new Promise(resolve => setTimeout(resolve, 500));  

      
      const demoResult = {
        productName: 'MacBook Air M2',
        category: 'Elektronik',
        subcategory: 'Laptop',
        brand: 'Apple',
        model: 'MacBook Air',
        year: '2024',
        confidence: 92.4,
        estimatedPrice: 54900.00,
        priceRange: {
          min: 52000.00,
          max: 58000.00
        },
        color: 'Space Gray',
        colorCode: '#4A4A4A',
        features: ['M2 Chip', '13.6 inç', '8GB RAM', '256GB SSD'],
        description: 'Apple MacBook Air 13" M2 çip ile güçlendirilmiş, hafif ve taşınabilir laptop.',
        specifications: {
          processor: 'Apple M2',
          memory: '8GB Unified Memory',
          storage: '256GB SSD',
          display: '13.6" Liquid Retina Display',
          graphics: '8-core GPU',
          connectivity: 'Wi-Fi 6, Bluetooth 5.0',
          ports: '2x Thunderbolt/USB 4, 3.5mm Jack',
          battery: '18 saate kadar pil ömrü',
          weight: '1.24 kg',
          dimensions: '30.41 x 21.5 x 1.13 cm'
        },
        aiInsights: [
          'Ürün yeni nesil M2 işlemci ile donatılmış',
          'Pazar değeri son 3 ayda %8 artmış',
          'Bu modelin stok tükenmesi 2-3 hafta içinde bekleniyor',
          'Benzer ürünlere göre %15 daha rekabetçi fiyatlı',
          'Müşteri memnuniyeti %94 oranında yüksek',
          'Cross-selling potansiyeli: Aksesuar ve kılıf'
        ],
        marketAnalysis: {
          demand: 'Yüksek',
          competition: 'Orta',
          profitMargin: '23%',
          turnoverRate: '8.5x/yıl',
          customerRating: 4.7,
          returnRate: '2.1%'
        },
        similarProducts: [
          { name: 'MacBook Air M1', similarity: 89, price: 45900 },
          { name: 'MacBook Pro 13"', similarity: 76, price: 67900 },
          { name: 'Surface Laptop 5', similarity: 64, price: 42900 }
        ],
        suggestedCategories: ['Laptop', 'Apple Ürünleri', 'Premium Elektronik'],
        keywordTags: ['macbook', 'apple', 'laptop', 'm2', 'portable', 'premium'],
        barcodeSuggestion: null,
        processingTime: 3.2,
        analysisDate: new Date().toISOString()
      };

      setAnalysisResult(demoResult);

      
      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleString('tr-TR'),
        image: selectedImage.preview,
        result: demoResult,
        status: 'completed'
      };

      setAnalysisHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); 

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const saveToProducts = () => {
    if (analysisResult) {
      
      const productData = {
        name: analysisResult.productName,
        category: analysisResult.category,
        brand: analysisResult.brand,
        price: analysisResult.estimatedPrice,
        description: analysisResult.description,
        specifications: analysisResult.specifications,
        image: selectedImage.preview
      };
      
      console.log('Saving product:', productData);
      alert(`${analysisResult.productName} ürün veritabanına ekleniyor...`);
      
    }
  };

  const downloadReport = () => {
    if (analysisResult) {
      const report = {
        analysisDate: new Date().toLocaleString('tr-TR'),
        product: analysisResult,
        image: selectedImage.name
      };
      
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `product-analysis-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
  };

  const retryAnalysis = () => {
    analyzeImage();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-dark fw-bold mb-1">AI Ürün Tanıma</h1>
        <p className="text-gray mb-0">Görsel yükleyerek ürünleri otomatik olarak tanımlayın ve analiz edin</p>
      </div>

      <div className="row">
        {/* Image Upload & Analysis */}
        <div className="col-lg-8">
          {/* Upload Area */}
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-camera me-2"></i>
                Görsel Yükleme
              </h5>
            </div>
            <div className="card-body">
              {!selectedImage ? (
                <div 
                  className="upload-area text-center p-5"
                  style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--light-bg)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleFileSelect}
                >
                  <i className="fas fa-cloud-upload-alt text-main mb-3" style={{ fontSize: '48px' }}></i>
                  <h4 className="text-dark mb-3">Ürün Görseli Yükleyin</h4>
                  <p className="text-gray mb-4">
                    Dosyayı buraya sürükleyin veya tıklayarak seçin<br />
                    <small>JPG, PNG, GIF formatları desteklenir (Maks. 10MB)</small>
                  </p>
                  <div className="d-flex gap-3 justify-content-center">
                    <button 
                      type="button" 
                      className="btn btn-main"
                      onClick={(e) => { e.stopPropagation(); handleFileSelect(); }}
                    >
                      <i className="fas fa-folder-open me-2"></i>
                      Dosya Seç
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-main"
                      onClick={(e) => { e.stopPropagation(); handleCameraCapture(); }}
                    >
                      <i className="fas fa-camera me-2"></i>
                      Kamera Kullan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="selected-image">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="text-dark mb-0">Seçilen Görsel: {selectedImage.name}</h6>
                      <small className="text-gray">
                        {formatFileSize(selectedImage.size)} • {selectedImage.type}
                      </small>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-main"
                      onClick={clearImage}
                    >
                      <i className="fas fa-times me-1"></i>
                      Temizle
                    </button>
                  </div>
                  <div className="text-center">
                    <img 
                      src={selectedImage.preview} 
                      alt="Selected"
                      className="img-fluid"
                      style={{ 
                        maxHeight: '400px', 
                        borderRadius: 'var(--border-radius)',
                        boxShadow: 'var(--shadow)'
                      }}
                    />
                  </div>
                  <div className="text-center mt-3">
                    <button 
                      className="btn btn-main btn-lg me-3"
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="loading-spinner me-2"></div>
                          Analiz Ediliyor...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-brain me-2"></i>
                          AI ile Analiz Et
                        </>
                      )}
                    </button>
                    {analysisResult && (
                      <button 
                        className="btn btn-outline-main"
                        onClick={retryAnalysis}
                        disabled={isAnalyzing}
                      >
                        <i className="fas fa-redo me-2"></i>
                        Tekrar Analiz Et
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-search me-2"></i>
                  Analiz Sonuçları
                  <span className="badge badge-success ms-2">
                    %{analysisResult.confidence} Güven
                  </span>
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="ai-card">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-dark fw-bold mb-0">Tanımlanan Ürün</h6>
                        <div className="ai-confidence">
                          <div className="confidence-bar">
                            <div 
                              className="confidence-fill"
                              style={{ width: `${analysisResult.confidence}%` }}
                            ></div>
                          </div>
                          <span className="confidence-text">%{analysisResult.confidence}</span>
                        </div>
                      </div>

                      <div className="product-info">
                        <h4 className="text-dark fw-bold mb-2">{analysisResult.productName}</h4>
                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <span className="badge badge-main">{analysisResult.category}</span>
                          </div>
                          <div className="col-6">
                            <span className="badge badge-outline badge-main">{analysisResult.brand}</span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <strong className="text-dark">Tahmini Fiyat:</strong>
                          <div className="mt-1">
                            <span className="text-success fw-bold fs-5">
                              {formatCurrency(analysisResult.estimatedPrice)}
                            </span>
                            <div className="text-gray mt-1">
                              <small>
                                Aralık: {formatCurrency(analysisResult.priceRange.min)} - {formatCurrency(analysisResult.priceRange.max)}
                              </small>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <strong className="text-dark">Renk:</strong>
                          <div className="d-flex align-items-center gap-2 mt-1">
                            <div 
                              style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: analysisResult.colorCode,
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                              }}
                            ></div>
                            <span className="text-gray">{analysisResult.color}</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <strong className="text-dark">Özellikler:</strong>
                          <div className="mt-2">
                            {analysisResult.features.map((feature, index) => (
                              <span key={index} className="badge badge-outline badge-success me-2 mb-1">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <p className="text-gray">{analysisResult.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="ai-card">
                      <h6 className="text-dark fw-bold mb-3">Teknik Özellikler</h6>
                      {Object.entries(analysisResult.specifications).map(([key, value], index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                          <span className="text-gray text-capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-dark fw-bold text-end" style={{ maxWidth: '60%' }}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="ai-card mt-3">
                      <h6 className="text-dark fw-bold mb-3">Pazar Analizi</h6>
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-main fw-bold">{analysisResult.marketAnalysis.demand}</div>
                            <small className="text-gray">Talep</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-warning fw-bold">{analysisResult.marketAnalysis.profitMargin}</div>
                            <small className="text-gray">Kar Marjı</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-success fw-bold">{analysisResult.marketAnalysis.customerRating}</div>
                            <small className="text-gray">Müşteri Puanı</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-info fw-bold">{analysisResult.marketAnalysis.turnoverRate}</div>
                            <small className="text-gray">Devir Hızı</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="ai-card mt-4">
                  <h6 className="text-dark fw-bold mb-3">
                    <i className="fas fa-lightbulb me-2"></i>
                    AI Öngörüleri
                  </h6>
                  <div className="row">
                    {analysisResult.aiInsights.map((insight, index) => (
                      <div key={index} className="col-md-6 mb-2">
                        <div className="ai-recommendation">
                          <p className="recommendation-text mb-1">{insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Similar Products */}
                <div className="ai-card mt-4">
                  <h6 className="text-dark fw-bold mb-3">
                    <i className="fas fa-clone me-2"></i>
                    Benzer Ürünler
                  </h6>
                  <div className="row">
                    {analysisResult.similarProducts.map((product, index) => (
                      <div key={index} className="col-md-4 mb-2">
                        <div className="p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                          <div className="text-dark fw-bold">{product.name}</div>
                          <div className="d-flex justify-content-between">
                            <small className="text-gray">%{product.similarity} benzer</small>
                            <small className="text-success">{formatCurrency(product.price)}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-3 mt-4">
                  <button 
                    className="btn btn-main"
                    onClick={saveToProducts}
                  >
                    <i className="fas fa-save me-2"></i>
                    Ürün Olarak Kaydet
                  </button>
                  <button 
                    className="btn btn-outline-main"
                    onClick={downloadReport}
                  >
                    <i className="fas fa-download me-2"></i>
                    Raporu İndir
                  </button>
                  <button className="btn btn-outline-main">
                    <i className="fas fa-edit me-2"></i>
                    Düzenle
                  </button>
                  <button className="btn btn-outline-main">
                    <i className="fas fa-share me-2"></i>
                    Paylaş
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-cog fa-spin me-2"></i>
                  AI Analiz Süreci
                </h5>
              </div>
              <div className="card-body">
                <div className="ai-status processing mb-3">
                  <i className="fas fa-brain me-2"></i>
                  İşleniyor...
                </div>
                
                <div className="analysis-steps">
                  <div className="step completed mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Görsel yüklendi ve işlendi
                  </div>
                  <div className="step processing mb-2">
                    <div className="loading-spinner me-2"></div>
                    Ürün tanıma algoritması çalışıyor
                  </div>
                  <div className="step pending mb-2">
                    <i className="fas fa-clock text-gray me-2"></i>
                    Özellikler analiz ediliyor
                  </div>
                  <div className="step pending mb-2">
                    <i className="fas fa-clock text-gray me-2"></i>
                    Fiyat tahmini hesaplanıyor
                  </div>
                  <div className="step pending">
                    <i className="fas fa-clock text-gray me-2"></i>
                    Pazar analizi yapılıyor
                  </div>
                </div>

                <div className="progress mt-3">
                  <div 
                    className="progress-bar"
                    style={{ width: '60%', animation: 'progress-bar-stripes 1s linear infinite' }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <small className="text-gray">Tahmini süre: 30 saniye</small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Tips & History */}
        <div className="col-lg-4">
          {/* Analysis Tips */}
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-info-circle me-2"></i>
                İpuçları
              </h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="fas fa-lightbulb alert-icon"></i>
                <div>
                  <strong>Daha İyi Sonuçlar İçin:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Ürünü net ve tam çekin</li>
                    <li>İyi ışık koşulları sağlayın</li>
                    <li>Ürün merkezi konumda olsun</li>
                    <li>Arka plan karışık olmasın</li>
                    <li>Marka logoları görünür olsun</li>
                  </ul>
                </div>
              </div>

              <div className="alert alert-success">
                <i className="fas fa-star alert-icon"></i>
                <div>
                  <strong>Desteklenen Ürünler:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Elektronik cihazlar</li>
                    <li>Giyim ve aksesuar</li>
                    <li>Ev eşyaları</li>
                    <li>Kozmetik ürünleri</li>
                    <li>Spor malzemeleri</li>
                  </ul>
                </div>
              </div>

              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle alert-icon"></i>
                <div>
                  <strong>Dikkat:</strong>
                  <p className="mb-0 mt-2">
                    AI tahminleri %100 doğru olmayabilir. Sonuçları kontrol edin ve gerekirse düzenleyin.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-chart-bar me-2"></i>
                Analiz İstatistikleri
              </h5>
            </div>
            <div className="card-body">
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Bu Ay Toplam</span>
                  <span className="text-main fw-bold">156</span>
                </div>
              </div>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Başarı Oranı</span>
                  <span className="text-success fw-bold">%94.2</span>
                </div>
              </div>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Ortalama Güven</span>
                  <span className="text-warning fw-bold">%87.8</span>
                </div>
              </div>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Ortalama Süre</span>
                  <span className="text-info fw-bold">2.3s</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Tasarruf</span>
                  <span className="text-danger fw-bold">2.5 saat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Analysis */}
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-history me-2"></i>
                Son Analizler
              </h5>
            </div>
            <div className="card-body">
              {analysisHistory.map((item) => (
                <div key={item.id} className="analysis-history-item mb-3 p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer' }}>
                  <div className="d-flex gap-3">
                    <img 
                      src={item.image} 
                      alt="Analysis"
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: 'var(--border-radius-xs)'
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="text-dark fw-bold mb-1">{item.result.productName}</h6>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge badge-success">%{item.result.confidence}</span>
                        <small className="text-gray">{item.date}</small>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-gray">{formatCurrency(item.result.estimatedPrice)}</small>
                        <span className="badge badge-outline badge-main">{item.result.brand}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center mt-3">
                <button className="btn btn-outline-main btn-sm">
                  <i className="fas fa-eye me-1"></i>
                  Tümünü Görüntüle
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card mt-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-rocket me-2"></i>
                Hızlı İşlemler
              </h5>
            </div>
            <div className="card-body">
              <button className="btn btn-outline-main w-100 mb-2">
                <i className="fas fa-plus me-2"></i>
                Toplu Analiz
              </button>
              <button className="btn btn-outline-main w-100 mb-2">
                <i className="fas fa-cogs me-2"></i>
                Model Ayarları
              </button>
              <button className="btn btn-outline-main w-100 mb-2">
                <i className="fas fa-download me-2"></i>
                Geçmiş İndir
              </button>
              <button className="btn btn-outline-main w-100">
                <i className="fas fa-question-circle me-2"></i>
                Yardım & Destek
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      {analysisResult && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-tools me-2"></i>
                  Ek Özellikler
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="feature-card text-center p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)' }}>
                      <i className="fas fa-barcode text-main mb-2" style={{ fontSize: '24px' }}></i>
                      <h6 className="text-dark fw-bold">Barkod Oluştur</h6>
                      <small className="text-gray">Ürün için otomatik barkod</small>
                      <button className="btn btn-sm btn-outline-main mt-2 w-100">
                        Oluştur
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card text-center p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)' }}>
                      <i className="fas fa-tags text-warning mb-2" style={{ fontSize: '24px' }}></i>
                      <h6 className="text-dark fw-bold">Etiket Yazdır</h6>
                      <small className="text-gray">Ürün etiketi hazırla</small>
                      <button className="btn btn-sm btn-outline-main mt-2 w-100">
                        Hazırla
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card text-center p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)' }}>
                      <i className="fas fa-search-plus text-success mb-2" style={{ fontSize: '24px' }}></i>
                      <h6 className="text-dark fw-bold">Detaylı Analiz</h6>
                      <small className="text-gray">Gelişmiş özellik çıkarımı</small>
                      <button className="btn btn-sm btn-outline-main mt-2 w-100">
                        Başlat
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card text-center p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)' }}>
                      <i className="fas fa-chart-line text-info mb-2" style={{ fontSize: '24px' }}></i>
                      <h6 className="text-dark fw-bold">Trend Analizi</h6>
                      <small className="text-gray">Pazar trend raporu</small>
                      <button className="btn btn-sm btn-outline-main mt-2 w-100">
                        Görüntüle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      <div className="modal fade" id="helpModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-question-circle me-2"></i>
                AI Ürün Tanıma Yardımı
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-bold">Nasıl Kullanılır?</h6>
                  <ol>
                    <li>Ürün görselini yükleyin</li>
                    <li>"AI ile Analiz Et" butonuna tıklayın</li>
                    <li>Sonuçları inceleyin</li>
                    <li>Gerekirse düzenleyip kaydedin</li>
                  </ol>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold">Sık Sorulan Sorular</h6>
                  <p><strong>S:</strong> Hangi formatlar desteklenir?<br />
                  <strong>C:</strong> JPG, PNG, GIF formatları.</p>
                  
                  <p><strong>S:</strong> Maksimum dosya boyutu?<br />
                  <strong>C:</strong> 10 MB'a kadar dosya yükleyebilirsiniz.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProductRecognition;