import React, { useState, useRef } from 'react';

const AdminColorAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [testingOllama, setTestingOllama] = useState(false);
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
  const API_BASE_URL = 'http://localhost:5000';

 
  const testOllamaConnection = async () => {
    setTestingOllama(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/test-ollama`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      setOllamaStatus(result);
      
      if (result.success) {
        alert(`✅ Ollama çalışıyor!\n\nMevcut modeller: ${result.data.models.join(', ')}\n\nTest cevabı: ${result.data.testResponse}`);
      } else {
        alert(`❌ Ollama bağlantı problemi:\n${result.message}\n\nÖneriler:\n${result.suggestions?.join('\n')}`);
      }
    } catch (error) {
      setOllamaStatus({
        success: false,
        message: 'Ollama bağlantısı kurulamadı',
        error: error.message
      });
      alert(`❌ Bağlantı hatası: ${error.message}`);
    } finally {
      setTestingOllama(false);
    }
  };

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

  const analyzeColorsWithAI = async () => {
    if (!selectedImage) {
      alert('Lütfen önce bir görsel seçin.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
     
      const base64Data = selectedImage.preview.split(',')[1]; 

      const requestBody = {
        imageUrl: selectedImage.preview,
        imageBase64: base64Data,
        productId: null
      };

      const response = await fetch(`${API_BASE_URL}/api/ai/color-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (result.success) {
        setAnalysisResult(result.data);

       
        const newHistoryItem = {
          id: Date.now(),
          date: new Date().toLocaleString('tr-TR'),
          image: selectedImage.preview,
          result: result.data,
          productName: 'AI Renk Analizi',
          status: 'completed'
        };
        setAnalysisHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);

      
        alert(`✅ Renk analizi tamamlandı!\n\nBulunan ${result.data.dominantColors?.length || 0} baskın renk\nAI Model: ${result.data.aiModel}\nİşlem Süresi: ${result.data.processingTime}ms`);
      } else {
        alert(`❌ Renk analizi başarısız: ${result.message}`);
      }
    } catch (error) {
      console.error('Color analysis error:', error);
      alert(`❌ Renk analizi sırasında bir hata oluştu: ${error.message}`);
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
      const palette = {
        analysisDate: new Date().toLocaleString('tr-TR'),
        dominantColors: analysisResult.dominantColors,
        colorHarmony: analysisResult.colorHarmony,
        colorTemperature: analysisResult.colorTemperature,
        brightness: analysisResult.brightness,
        saturation: analysisResult.saturation,
        suggestions: analysisResult.suggestions,
        aiModel: analysisResult.aiModel,
        image: selectedImage.name
      };
      
      const dataStr = JSON.stringify(palette, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-color-palette-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      alert('✅ Renk paleti kaydedildi!');
    }
  };

  const downloadColorCodes = () => {
    if (analysisResult && analysisResult.dominantColors) {
      const colorCodes = analysisResult.dominantColors.map(color => 
        `${color.name}: ${color.color} (${color.percentage}%)`
      ).join('\n');
      
      const content = `AI Renk Analizi - Renk Kodları\n\nTarih: ${new Date().toLocaleString('tr-TR')}\nAI Model: ${analysisResult.aiModel}\n\nBaskın Renkler:\n${colorCodes}\n\nRenk Harmonisi: ${analysisResult.colorHarmony}\nSıcaklık: ${analysisResult.colorTemperature}\nParlaklık: ${analysisResult.brightness}%\nDoygunluk: ${analysisResult.saturation}%`;
      
      const dataBlob = new Blob([content], {type: 'text/plain;charset=utf-8'});
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `renk-kodlari-${Date.now()}.txt`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
  };

  const shareColorPalette = () => {
    if (analysisResult) {
      const colors = analysisResult.dominantColors?.map(c => c.color).join(', ') || '';
      const shareText = `🎨 AI Renk Analizi Sonucu:\n\nBaskın Renkler: ${colors}\nHarmoni: ${analysisResult.colorHarmony}\nAI Model: ${analysisResult.aiModel}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'AI Renk Analizi',
          text: shareText,
        });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        alert('Renk paleti bilgileri panoya kopyalandı!');
      }
    }
  };

  const editColorPalette = () => {
   
    alert('Renk paleti düzenleme özelliği yakında eklenecek!');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const retryAnalysis = () => {
    analyzeColorsWithAI();
  };

  const generateColorGradient = () => {
    if (analysisResult && analysisResult.dominantColors) {
      const colors = analysisResult.dominantColors.slice(0, 3).map(c => c.color);
      const gradient = `linear-gradient(45deg, ${colors.join(', ')})`;
      
     
      const gradientDiv = document.createElement('div');
      gradientDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 200px;
        background: ${gradient};
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        cursor: pointer;
      `;
      
      gradientDiv.onclick = () => {
        document.body.removeChild(gradientDiv);
        navigator.clipboard.writeText(`background: ${gradient};`);
        alert('CSS gradient kodu panoya kopyalandı!');
      };
      
      document.body.appendChild(gradientDiv);
      
      setTimeout(() => {
        if (document.body.contains(gradientDiv)) {
          document.body.removeChild(gradientDiv);
        }
      }, 3000);
    }
  };

  const testContrast = () => {
    if (analysisResult && analysisResult.dominantColors?.length >= 2) {
      const color1 = analysisResult.dominantColors[0].color;
      const color2 = analysisResult.dominantColors[1].color;
      
     
      const contrast = calculateContrast(color1, color2);
      
      alert(`Kontrast Oranı: ${contrast.toFixed(2)}\n\n${contrast >= 4.5 ? '✅ WCAG AA uyumlu' : '❌ Kontrast yetersiz'}\n\nRenkler: ${color1} ve ${color2}`);
    }
  };

  const calculateContrast = (color1, color2) => {
   
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const getLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    
    const rsRGB = rgb.r/255;
    const gsRGB = rgb.g/255;
    const bsRGB = rgb.b/255;

    const r = rsRGB <= 0.03928 ? rsRGB/12.92 : Math.pow((rsRGB + 0.055)/1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB/12.92 : Math.pow((gsRGB + 0.055)/1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB/12.92 : Math.pow((bsRGB + 0.055)/1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const simulateColorBlindness = () => {
    if (analysisResult) {
      alert('Renk körlüğü simülasyonu özelliği yakında eklenecek!\n\nBu özellik deuteranopia, protanopia ve tritanopia simülasyonları içerecek.');
    }
  };

  const exportCSS = () => {
    if (analysisResult && analysisResult.dominantColors) {
      const cssVars = analysisResult.dominantColors.map((color, index) => 
        `  --color-${index + 1}: ${color.color}; /* ${color.name} */`
      ).join('\n');

      const cssClasses = analysisResult.dominantColors.map((color, index) => 
        `.color-${index + 1} {\n  background-color: ${color.color};\n  color: ${index === 0 ? '#ffffff' : '#000000'};\n}`
      ).join('\n\n');

      const cssCode = `:root {\n${cssVars}\n}\n\n${cssClasses}`;
      
      const dataBlob = new Blob([cssCode], {type: 'text/css'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `color-palette-${Date.now()}.css`;
      link.click();
      URL.revokeObjectURL(url);
      
      alert('CSS dosyası indirildi!');
    }
  };

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="text-main mb-2"> 
              <i className="fa-solid fa-palette me-2"></i>
              AI Renk Analizi
            </h1>
            <p className="text-gray mb-0">Ollama AI ile görsellerden renk paletleri çıkarın ve analiz edin</p>
          </div>
          <button
            onClick={testOllamaConnection}
            disabled={testingOllama}
            className={`btn ${
              ollamaStatus?.success 
                ? 'btn-success' 
                : ollamaStatus?.success === false
                ? 'btn-danger'
                : 'btn-primary'
            }`}
          >
            {testingOllama ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Test Ediliyor...
              </>
            ) : ollamaStatus?.success ? (
              <>✅ Ollama Aktif</>
            ) : ollamaStatus?.success === false ? (
              <>❌ Ollama Pasif</>
            ) : (
              <>🔍 Ollama Test Et</>
            )}
          </button>
        </div>
      </div>

      <div className="row">
        {/* Image Upload & Analysis */}
        <div className="col-lg-8">
          {/* Upload Area */}
          <div className="dashboard-card mb-4">
            
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
                  <i className="fas fa-image text-main mb-3" style={{ fontSize: '48px' }}></i>
                  <h4 className="text-dark mb-3">AI Renk Analizi İçin Görsel Yükleyin</h4>
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
                      Kamera
                    </button>
                  </div>
                </div>
              ) : (
                <div className="selected-image p-3">
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
                        height: '400px', 
                        borderRadius: 'var(--border-radius)',
                        boxShadow: 'var(--shadow)',
                        paddingTop: '0px',
                      }}
                    />
                  </div>
                  <div className="text-center mt-3">
                    <button 
                      className="btn btn-main btn-lg me-3"
                      onClick={analyzeColorsWithAI}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="loading-spinner me-2"></div>
                          AI ile Renkler Analiz Ediliyor...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-palette me-2"></i>
                          🤖 Ollama AI ile Renkleri Analiz Et
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

          {/* Color Analysis Results */}
          {analysisResult && (
            <div className="dashboard-card mb-4 p-3">
              <div className="card-header pb-3">
                <h5 className="card-title">
                  <i className="fas fa-eye-dropper me-2"></i>
                  AI Renk Analizi Sonuçları
                  <span className="badge badge-success ms-2">
                    %{analysisResult.confidence} Güven
                  </span>
                </h5>
              </div>
              <div className="card-body">
                {/* Dominant Colors */}
                <div className="mb-4">
                  <h6 className="text-dark fw-bold mb-3">🎯 Baskın Renkler</h6>
                  <div className="row g-3">
                    {analysisResult.dominantColors?.map((colorData, index) => (
                      <div key={index} className="col-md-6">
                        <div 
                          className="color-card p-3"
                          style={{ 
                            backgroundColor: 'white',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-sm)',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
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
                      <h6 className="text-dark fw-bold mb-3">📊 Renk Özellikleri</h6>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="text-gray">Parlaklık</span>
                          <span className="text-dark fw-bold">{analysisResult.brightness}%</span>
                        </div>
                        <div className="progress">
                          <div 
                            className="progress-bar bg-warning"
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
                            className="progress-bar bg-info"
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
                      <h6 className="text-dark fw-bold mb-3">🤖 AI Model Bilgisi</h6>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span className="text-gray">AI Model:</span>
                          <span className="text-dark fw-bold">{analysisResult.aiModel}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span className="text-gray">İşlem Süresi:</span>
                          <span className="text-dark fw-bold">{analysisResult.processingTime}ms</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span className="text-gray">Analiz Türü:</span>
                          <span className="text-dark fw-bold">{analysisResult.analysisType}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span className="text-gray">Güven Oranı:</span>
                          <span className="text-success fw-bold">%{analysisResult.confidence}</span>
                        </div>
                      </div>

                      {analysisResult.marketTrends && (
                        <div className="mt-3 pt-3 border-top">
                          <h6 className="text-dark fw-bold mb-2">📈 Pazar Trendi</h6>
                          <div className="mb-2">
                            <div className="d-flex justify-content-between">
                              <span className="text-gray">Popülerlik:</span>
                              <span className="text-dark fw-bold">{analysisResult.marketTrends.popularity}%</span>
                            </div>
                          </div>
                          <div className="mb-2">
                            <div className="d-flex justify-content-between">
                              <span className="text-gray">Hedef Kitle:</span>
                              <span className="text-dark fw-bold">{analysisResult.marketTrends.demographic}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray d-block">Duygusal Etki:</span>
                            <span className="text-main">{analysisResult.marketTrends.emotion}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Color Suggestions */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="ai-card">
                      <h6 className="text-dark fw-bold mb-3">💡 Önerilen Renk Adları</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {analysisResult.suggestions?.map((suggestion, index) => (
                          <span key={index} className="badge badge-outline badge-main">
                            {suggestion}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="ai-card">
                      <h6 className="text-dark fw-bold mb-3">🎨 Birincil Renk</h6>
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: analysisResult.primaryColor,
                            borderRadius: '8px',
                            border: '2px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                          }}
                        ></div>
                        <div>
                          <div className="text-dark fw-bold">{analysisResult.primaryColor}</div>
                          <small className="text-gray">Ana Renk</small>
                        </div>
                      </div>
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
                  <button 
                    className="btn btn-outline-main"
                    onClick={downloadColorCodes}
                  >
                    <i className="fas fa-download me-2"></i>
                    Renk Kodlarını İndir
                  </button>
                  <button 
                    className="btn btn-outline-main"
                    onClick={editColorPalette}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Düzenle
                  </button>
                  <button 
                    className="btn btn-outline-main"
                    onClick={shareColorPalette}
                  >
                    <i className="fas fa-share me-2"></i>
                    Paylaş
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="dashboard-card p-3">
              <div className="card-header pb-3">
                <h5 className="card-title ">
                  <i className="fas fa-cog fa-spin me-2"></i>
                  AI Renk Analizi Süreci
                </h5>
              </div>
              <div className="card-body">
                <div className="ai-status processing mb-3">
                  <i className="fas fa-palette me-2"></i>
                  Ollama AI ile renkler analiz ediliyor...
                </div>
                
                <div className="analysis-steps">
                  <div className="step completed mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Görsel yüklendi ve işlendi
                  </div>
                  <div className="step processing mb-2">
                    <div className="loading-spinner me-2"></div>
                    AI ile renk paleti çıkarılıyor
                  </div>
                  <div className="step pending mb-2">
                    <i className="fas fa-clock text-gray me-2"></i>
                    Renk harmonisi hesaplanıyor
                  </div>
                  <div className="step pending mb-2">
                    <i className="fas fa-clock text-gray me-2"></i>
                    Pazar analizi yapılıyor
                  </div>
                  <div className="step pending">
                    <i className="fas fa-clock text-gray me-2"></i>
                    AI raporu hazırlanıyor
                  </div>
                </div>

                <div className="progress mt-3">
                  <div 
                    className="progress-bar bg-gradient"
                    style={{ width: '70%', animation: 'progress-bar-stripes 1s linear infinite' }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <small className="text-gray">Tahmini süre: 15-30 saniye</small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Tools & History */}
        <div className="col-lg-4">
          {/* Ollama Status */}
          <div className="dashboard-card mb-4 p-3">
            <div className="card-header pb-3">
              <h5 className="card-title">
                <i className="fas fa-robot me-2"></i>
                Ollama AI Durumu
              </h5>
            </div>
            <div className="card-body">
              {ollamaStatus ? (
                <div className={`alert ${
                  ollamaStatus.success ? 'alert-success' : 'alert-danger'
                }`}>
                  <div className="d-flex align-items-center mb-2">
                    <i className={`fas ${ollamaStatus.success ? 'fa-check-circle' : 'fa-times-circle'} me-2`}></i>
                    <strong>
                      {ollamaStatus.success ? 'Bağlantı Başarılı' : 'Bağlantı Başarısız'}
                    </strong>
                  </div>
                  <p className="mb-2">{ollamaStatus.message}</p>
                  {ollamaStatus.data?.models && (
                    <div>
                      <small className="fw-bold">Mevcut Modeller:</small>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {ollamaStatus.data.models.map((model, index) => (
                          <span key={index} className="badge bg-primary text-white">
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {ollamaStatus.suggestions && (
                    <div className="mt-2">
                      <small className="fw-bold">Öneriler:</small>
                      <ul className="mb-0 mt-1">
                        {ollamaStatus.suggestions.map((suggestion, index) => (
                          <li key={index}><small>{suggestion}</small></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="alert alert-secondary">
                  <i className="fas fa-info-circle me-2"></i>
                  Ollama bağlantı durumu henüz test edilmedi.
                </div>
              )}
            </div>
          </div>

          {/* Color Tools */}
          <div className="dashboard-card mb-4 p-3">
            <div className="card-header pb-3">
              <h5 className="card-title">
                <i className="fas fa-tools me-2"></i>
                Renk Araçları
              </h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="fas fa-info-circle alert-icon"></i>
                <div>
                  <strong>AI Renk Analizi İpuçları:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Yüksek çözünürlük kullanın</li>
                    <li>İyi ışık koşulları sağlayın</li>
                    <li>Renklerin net görünür olması</li>
                    <li>Gölge ve yansımalardan kaçının</li>
                    <li>Ollama'da uygun model yüklü olsun</li>
                  </ul>
                </div>
              </div>

              <div className="alert alert-success">
                <i className="fas fa-star alert-icon"></i>
                <div>
                  <strong>Desteklenen Özellikler:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Gerçek AI renk çıkarımı</li>
                    <li>Renk harmonisi analizi</li>
                    <li>Pazar trend analizi</li>
                    <li>Renk öneriler</li>
                    <li>Otomatik palet oluşturma</li>
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
          <div className="dashboard-card mb-4 p-3">
            <div className="card-header pb-3">
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
                  <span className="text-gray">AI Başarı Oranı</span>
                  <span className="text-warning fw-bold">%92.4</span>
                </div>
              </div>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Ortalama İşlem Süresi</span>
                  <span className="text-info fw-bold">1.8s</span>
                </div>
              </div>
              <div className="stat-item">
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
                    <span className="text-primary fw-bold">Mavi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Analysis */}
          <div className="dashboard-card mb-4 p-3">
            <div className="card-header pb-3">
              <h5 className="card-title">
                <i className="fas fa-history me-2"></i>
                Son Analizler
              </h5>
            </div>
            <div className="card-body">
              {analysisHistory.slice(0, 4).map((item) => (
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
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="text-dark fw-bold mb-1">{item.productName}</h6>
                      <div className="d-flex gap-1 mb-2">
                        {item.result.dominantColors?.slice(0, 4).map((color, colorIndex) => (
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
                            title={`${color.name}: ${color.color}`}
                          ></div>
                        ))}
                        {item.result.dominantColors?.length > 4 && (
                          <small className="text-gray ms-1">+{item.result.dominantColors.length - 4}</small>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-gray">{item.date}</small>
                        <span className="badge badge-success">
                          {item.result.dominantColors?.length || 0} renk
                        </span>
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
          <div className="dashboard-card mt-4 p-3">
            <div className="card-header pb-3">
              <h5 className="card-title">
                <i className="fas fa-rocket me-2"></i>
                Hızlı İşlemler
              </h5>
            </div>
            <div className="card-body">
              <button className="btn btn-outline-main w-100 mb-2">
                <i className="fas fa-plus me-2"></i>
                Toplu Renk Analizi
              </button>
              <button className="btn btn-outline-main w-100 mb-2">
                <i className="fas fa-cogs me-2"></i>
                AI Model Ayarları
              </button>
              <button className="btn btn-outline-main w-100 mb-2">
                <i className="fas fa-download me-2"></i>
                Analiz Geçmişi İndir
              </button>
              <button className="btn btn-outline-main w-100 mb-2">
                <i className="fas fa-palette me-2"></i>
                Renk Paleti Kütüphanesi
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
            <div className="dashboard-card p-3">
              <div className="card-header pb-3">
                <h5 className="card-title">
                  <i className="fas fa-magic me-2"></i>
                  Gelişmiş Renk Araçları
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="feature-card text-center p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)' }}>
                      <i className="fas fa-paint-brush text-primary mb-2" style={{ fontSize: '24px' }}></i>
                      <h6 className="text-dark fw-bold">Renk Gradyanı</h6>
                      <small className="text-gray">Otomatik gradyan oluştur</small>
                      <button 
                        className="btn btn-sm btn-outline-main mt-2 w-100"
                        onClick={generateColorGradient}
                      >
                        Oluştur
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card text-center p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)' }}>
                      <i className="fas fa-adjust text-warning mb-2" style={{ fontSize: '24px' }}></i>
                      <h6 className="text-dark fw-bold">Kontrast Kontrol</h6>
                      <small className="text-gray">Erişilebilirlik testi</small>
                      <button 
                        className="btn btn-sm btn-outline-main mt-2 w-100"
                        onClick={testContrast}
                      >
                        Test Et
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card text-center p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)' }}>
                      <i className="fas fa-eye text-success mb-2" style={{ fontSize: '24px' }}></i>
                      <h6 className="text-dark fw-bold">Renk Körlüğü</h6>
                      <small className="text-gray">Simülasyon ve test</small>
                      <button 
                        className="btn btn-sm btn-outline-main mt-2 w-100"
                        onClick={simulateColorBlindness}
                      >
                        Simüle Et
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card text-center p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)' }}>
                      <i className="fas fa-code text-info mb-2" style={{ fontSize: '24px' }}></i>
                      <h6 className="text-dark fw-bold">CSS Export</h6>
                      <small className="text-gray">Web için CSS kodu</small>
                      <button 
                        className="btn btn-sm btn-outline-main mt-2 w-100"
                        onClick={exportCSS}
                      >
                        Export Et
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      <div className="modal fade" id="helpModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-question-circle me-2"></i>
                AI Renk Analizi Yardımı
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-bold">Nasıl Kullanılır?</h6>
                  <ol>
                    <li>Ollama AI'ın çalıştığını test edin</li>
                    <li>Renk analizi yapılacak görseli yükleyin</li>
                    <li>"AI ile Renkleri Analiz Et" butonuna tıklayın</li>
                    <li>AI analiz sonuçlarını inceleyin</li>
                    <li>Renk paletini kaydedin veya paylaşın</li>
                  </ol>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold">Sık Sorulan Sorular</h6>
                  <p><strong>S:</strong> Hangi AI modeller desteklenir?<br />
                  <strong>C:</strong> Ollama ile uyumlu tüm modeller.</p>
                  
                  <p><strong>S:</strong> Renk analizi ne kadar sürer?<br />
                  <strong>C:</strong> Genellikle 15-30 saniye arası.</p>
                  
                  <p><strong>S:</strong> Sonuçlar ne kadar doğru?<br />
                  <strong>C:</strong> AI güven oranı %80-95 arası değişir.</p>
                  
                  <p><strong>S:</strong> Hangi dosya formatları desteklenir?<br />
                  <strong>C:</strong> JPG, PNG, GIF (maks 10MB).</p>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <h6 className="fw-bold">Gelişmiş Özellikler</h6>
                  <ul>
                    <li><strong>Gradyan Oluşturucu:</strong> Baskın renklerden otomatik CSS gradyanı</li>
                    <li><strong>Kontrast Testi:</strong> WCAG erişilebilirlik standartları</li>
                    <li><strong>Renk Körlüğü:</strong> Deuteranopia, Protanopia simülasyonu</li>
                    <li><strong>CSS Export:</strong> Web projeleriniz için hazır kod</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
              <button type="button" className="btn btn-primary">Daha Fazla Yardım</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminColorAnalysis;