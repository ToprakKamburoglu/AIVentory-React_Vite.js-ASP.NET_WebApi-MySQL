import React, { useState, useRef } from 'react';

const ManagerColorAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([
    {
      id: 1,
      date: '2024-01-15 14:30',
      image: '/images/demo-color-1.jpg',
      result: {
        dominantColors: [
          { color: '#1E40AF', name: 'Deep Blue', percentage: 45.2, hex: '#1E40AF' },
          { color: '#FFFFFF', name: 'White', percentage: 28.7, hex: '#FFFFFF' },
          { color: '#374151', name: 'Gray', percentage: 16.8, hex: '#374151' },
          { color: '#DC2626', name: 'Red', percentage: 9.3, hex: '#DC2626' }
        ],
        primaryColor: '#1E40AF',
        colorHarmony: 'Complementary',
        suggestions: ['Navy Blue', 'Royal Blue', 'Midnight Blue']
      },
      productName: 'iPhone 15 Pro',
      status: 'completed'
    }
  ]);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          file: file,
          preview: e.target.result,
          name: file.name
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
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage({
            file: file,
            preview: e.target.result,
            name: file.name
          });
          setAnalysisResult(null);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const analyzeColors = async () => {
    if (!selectedImage) {
      alert('Lütfen önce bir görsel seçin.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
    
      await new Promise(resolve => setTimeout(resolve, 2500));

      const demoColors = [
        { color: '#3B82F6', name: 'Bright Blue', percentage: 42.5 },
        { color: '#10B981', name: 'Emerald Green', percentage: 28.3 },
        { color: '#F59E0B', name: 'Amber', percentage: 15.7 },
        { color: '#EF4444', name: 'Red', percentage: 8.9 },
        { color: '#6B7280', name: 'Gray', percentage: 4.6 }
      ];

      const demoResult = {
        dominantColors: demoColors,
        primaryColor: demoColors[0].color,
        colorHarmony: 'Triadic',
        colorTemperature: 'Cool',
        brightness: 72,
        saturation: 68,
        contrast: 'High',
        suggestions: [
          'Ocean Blue',
          'Sky Blue', 
          'Electric Blue',
          'Cerulean',
          'Azure'
        ],
        complementaryColors: ['#F59E0B', '#EF4444'],
        similarProducts: [
          'Samsung Galaxy S24 - Similar Blue',
          'MacBook Air - Sky Blue',
          'iPad Pro - Ocean Blue'
        ],
        marketTrends: {
          popularity: 85,
          season: 'All Season',
          demographic: 'Young Adults',
          emotion: 'Trust, Calm, Professional'
        }
      };

      setAnalysisResult(demoResult);

      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleString('tr-TR'),
        image: selectedImage.preview,
        result: demoResult,
        productName: 'Analiz Edilen Ürün',
        status: 'completed'
      };

      setAnalysisHistory(prev => [newHistoryItem, ...prev]);

    } catch (error) {
      console.error('Color analysis error:', error);
      alert('Renk analizi sırasında bir hata oluştu.');
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

  const copyColorCode = (hex) => {
    navigator.clipboard.writeText(hex);
    alert(`Renk kodu ${hex} panoya kopyalandı!`);
  };

  const saveColorPalette = () => {
    if (analysisResult) {
      alert('Renk paleti kaydediliyor...');
    }
  };

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-dark fw-bold mb-1">AI Renk Analizi</h1>
        <p className="text-gray mb-0">Görsellerden renk paletleri çıkarın ve analiz edin</p>
      </div>

      <div className="row">
        {/* Image Upload & Analysis */}
        <div className="col-lg-8">
          {/* Upload Area */}
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-palette me-2"></i>
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
                    transition: 'var(--transition)'
                  }}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleFileSelect}
                >
                  <i className="fas fa-image text-main mb-3" style={{ fontSize: '48px' }}></i>
                  <h4 className="text-dark mb-3">Renk Analizi İçin Görsel Yükleyin</h4>
                  <p className="text-gray mb-4">
                    Dosyayı buraya sürükleyin veya tıklayarak seçin
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
                      Kamera
                    </button>
                  </div>
                  <small className="text-gray mt-3 d-block">
                    Desteklenen formatlar: JPG, PNG, GIF (Maks. 10MB)
                  </small>
                </div>
              ) : (
                <div className="selected-image">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-dark mb-0">Seçilen Görsel: {selectedImage.name}</h6>
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
                      className="btn btn-main btn-lg"
                      onClick={analyzeColors}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="loading-spinner me-2"></div>
                          Renkler Analiz Ediliyor...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-palette me-2"></i>
                          Renkleri Analiz Et
                        </>
                      )}
                    </button>
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

          {/* Color Analysis Results */}
          {analysisResult && (
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-eye-dropper me-2"></i>
                  Renk Analizi Sonuçları
                </h5>
              </div>
              <div className="card-body">
                {/* Dominant Colors */}
                <div className="mb-4">
                  <h6 className="text-dark fw-bold mb-3">Baskın Renkler</h6>
                  <div className="row g-3">
                    {analysisResult.dominantColors.map((colorData, index) => (
                      <div key={index} className="col-md-6">
                        <div 
                          className="color-card p-3"
                          style={{ 
                            backgroundColor: 'white',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-sm)',
                            cursor: 'pointer'
                          }}
                          onClick={() => copyColorCode(colorData.color)}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div 
                              className="color-swatch"
                              style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: colorData.color,
                                borderRadius: 'var(--border-radius-xs)',
                                border: '2px solid #fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                            ></div>
                            <div className="flex-grow-1">
                              <h6 className="text-dark fw-bold mb-1">{colorData.name}</h6>
                              <div className="text-gray mb-1">{colorData.color}</div>
                              <div className="d-flex align-items-center gap-2">
                                <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                  <div 
                                    className="progress-bar"
                                    style={{ 
                                      width: `${colorData.percentage}%`,
                                      backgroundColor: colorData.color
                                    }}
                                  ></div>
                                </div>
                                <span className="text-main fw-bold">{colorData.percentage}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Properties */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="ai-card">
                      <h6 className="text-dark fw-bold mb-3">Renk Özellikleri</h6>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="text-gray">Parlaklık</span>
                          <span className="text-dark fw-bold">{analysisResult.brightness}%</span>
                        </div>
                        <div className="progress">
                          <div 
                            className="progress-bar success"
                            style={{ width: `${analysisResult.brightness}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="text-gray">Doygunluk</span>
                          <span className="text-dark fw-bold">{analysisResult.saturation}%</span>
                        </div>
                        <div className="progress">
                          <div 
                            className="progress-bar warning"
                            style={{ width: `${analysisResult.saturation}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="property-item mb-2">
                        <div className="d-flex justify-content-between">
                          <span className="text-gray">Sıcaklık:</span>
                          <span className="badge badge-main">{analysisResult.colorTemperature}</span>
                        </div>
                      </div>

                      <div className="property-item mb-2">
                        <div className="d-flex justify-content-between">
                          <span className="text-gray">Kontrast:</span>
                          <span className="badge badge-success">{analysisResult.contrast}</span>
                        </div>
                      </div>

                      <div className="property-item">
                        <div className="d-flex justify-content-between">
                          <span className="text-gray">Harmoni:</span>
                          <span className="badge badge-warning">{analysisResult.colorHarmony}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="ai-card">
                      <h6 className="text-dark fw-bold mb-3">Pazar Analizi</h6>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="text-gray">Popülerlik</span>
                          <span className="text-dark fw-bold">{analysisResult.marketTrends.popularity}%</span>
                        </div>
                        <div className="progress">
                          <div 
                            className="progress-bar"
                            style={{ width: `${analysisResult.marketTrends.popularity}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="property-item mb-2">
                        <div className="d-flex justify-content-between">
                          <span className="text-gray">Sezon:</span>
                          <span className="text-dark fw-bold">{analysisResult.marketTrends.season}</span>
                        </div>
                      </div>

                      <div className="property-item mb-2">
                        <div className="d-flex justify-content-between">
                          <span className="text-gray">Hedef Kitle:</span>
                          <span className="text-dark fw-bold">{analysisResult.marketTrends.demographic}</span>
                        </div>
                      </div>

                      <div className="property-item">
                        <span className="text-gray d-block mb-1">Duygusal Etki:</span>
                        <span className="text-main">{analysisResult.marketTrends.emotion}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Suggestions */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="ai-card">
                      <h6 className="text-dark fw-bold mb-3">Önerilen Renk Adları</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <span key={index} className="badge badge-outline badge-main">
                            {suggestion}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="ai-card">
                      <h6 className="text-dark fw-bold mb-3">Benzer Ürünler</h6>
                      {analysisResult.similarProducts.map((product, index) => (
                        <div key={index} className="mb-2 p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                          <small className="text-dark">{product}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-4">
                  <button 
                    className="btn btn-main"
                    onClick={saveColorPalette}
                  >
                    <i className="fas fa-save me-2"></i>
                    Paleti Kaydet
                  </button>
                  <button className="btn btn-outline-main">
                    <i className="fas fa-download me-2"></i>
                    Renk Kodlarını İndir
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
                  Renk Analizi Süreci
                </h5>
              </div>
              <div className="card-body">
                <div className="ai-status processing mb-3">
                  <i className="fas fa-palette me-2"></i>
                  Renkler analiz ediliyor...
                </div>
                
                <div className="analysis-steps">
                  <div className="step completed">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Görsel yüklendi ve işlendi
                  </div>
                  <div className="step processing">
                    <div className="loading-spinner me-2"></div>
                    Renk paleti çıkarılıyor
                  </div>
                  <div className="step pending">
                    <i className="fas fa-clock text-gray me-2"></i>
                    Renk harmonisi hesaplanıyor
                  </div>
                  <div className="step pending">
                    <i className="fas fa-clock text-gray me-2"></i>
                    Pazar analizi yapılıyor
                  </div>
                </div>

                <div className="progress mt-3">
                  <div 
                    className="progress-bar warning"
                    style={{ width: '70%', animation: 'progress-bar-stripes 1s linear infinite' }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <small className="text-gray">Tahmini süre: 25 saniye</small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Tools & History */}
        <div className="col-lg-4">
          {/* Color Tools */}
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-tools me-2"></i>
                Renk Araçları
              </h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="fas fa-info-circle alert-icon"></i>
                <div>
                  <strong>İpuçları:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Yüksek çözünürlük kullanın</li>
                    <li>İyi ışık koşulları sağlayın</li>
                    <li>Renklerin net görünür olması</li>
                    <li>Gölge ve yansımalardan kaçının</li>
                  </ul>
                </div>
              </div>

              <div className="quick-tools">
                <button className="btn btn-outline-main w-100 mb-2">
                  <i className="fas fa-eye-dropper me-2"></i>
                  Renk Seçici
                </button>
                <button className="btn btn-outline-main w-100 mb-2">
                  <i className="fas fa-adjust me-2"></i>
                  Renk Harmonisi
                </button>
                <button className="btn btn-outline-main w-100">
                  <i className="fas fa-palette me-2"></i>
                  Palet Oluşturucu
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-chart-pie me-2"></i>
                Analiz İstatistikleri
              </h5>
            </div>
            <div className="card-body">
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Bu Ay Toplam</span>
                  <span className="text-main fw-bold">89</span>
                </div>
              </div>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Kaydedilen Palet</span>
                  <span className="text-success fw-bold">23</span>
                </div>
              </div>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Popüler Renk</span>
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#3B82F6',
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    ></div>
                    <span className="text-warning fw-bold">Mavi</span>
                  </div>
                </div>
              </div>
              <div className="stat-item">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Ortalama Renk</span>
                  <span className="text-danger fw-bold">4.2</span>
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
                <div key={item.id} className="analysis-history-item mb-3 p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)' }}>
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
                      <h6 className="text-dark fw-bold mb-1">{item.productName}</h6>
                      <div className="d-flex gap-1 mb-2">
                        {item.result.dominantColors.slice(0, 3).map((color, colorIndex) => (
                          <div 
                            key={colorIndex}
                            style={{
                              width: '15px',
                              height: '15px',
                              backgroundColor: color.color,
                              borderRadius: '50%',
                              border: '1px solid white',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                          ></div>
                        ))}
                      </div>
                      <small className="text-gray">{item.date}</small>
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
        </div>
      </div>
    </div>
  );
};

export default ManagerColorAnalysis;