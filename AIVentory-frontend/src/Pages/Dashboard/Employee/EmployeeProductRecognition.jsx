import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.jsx';

const EmployeeProductRecognition = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [ollamaStatus, setOllamaStatus] = useState({ connected: false, models: [] });
  const [statistics, setStatistics] = useState({
    totalAnalyses: 0,
    todayAnalyses: 0,
    successfulAnalyses: 0,
    averageConfidence: 0
  });
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // API Base URL - ortamınıza göre güncelleyin
  const API_BASE_URL = 'http://localhost:5000/api';

  // Component mount olduğunda gerekli verileri yükle
  useEffect(() => {
    checkOllamaStatus();
    loadStatistics();
    loadAnalysisHistory();
    loadCategories();
  }, []);

  // Ollama bağlantı durumunu kontrol et
  const checkOllamaStatus = async () => {
    try {
      console.log('Checking Ollama status...'); // Debug log
      console.log('API URL:', `${API_BASE_URL}/AI/test-ollama`); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/AI/test-ollama`);
      console.log('Ollama test response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ollama test error:', errorText);
        throw new Error(`Ollama test failed (${response.status}): ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Ollama test result:', result); // Debug log
      
      if (result.success) {
        setOllamaStatus({
          connected: true,
          models: result.data.models || [],
          connectionStatus: result.data.connectionStatus
        });
        console.log('Ollama connected successfully with models:', result.data.models);
      } else {
        console.warn('Ollama test returned success=false:', result.message);
        setOllamaStatus({ 
          connected: false, 
          models: [], 
          error: result.message || 'Ollama bağlantı testi başarısız'
        });
      }
    } catch (error) {
      console.error('Ollama status check failed:', error);
      setOllamaStatus({ 
        connected: false, 
        models: [], 
        error: error.message || 'Bağlantı hatası' 
      });
    }
  };

  // İstatistikleri yükle
  const loadStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/AI/statistics`);
      const result = await response.json();
      
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('Statistics load failed:', error);
    }
  };

  // Analiz geçmişini yükle
  const loadAnalysisHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/AI/analyses?analysisType=ai_product_recognition`);
      const result = await response.json();
      
      if (result.success) {
        setAnalysisHistory(result.data.slice(0, 10)); // Son 10 analiz
      }
    } catch (error) {
      console.error('History load failed:', error);
    }
  };

  // Kategorileri yükle
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

  // Görsel yükleme işlemi
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü
      if (file.size > 10 * 1024 * 1024) {
        alert('Dosya boyutu çok büyük. Maksimum 10MB yükleyebilirsiniz.');
        return;
      }

      // Dosya tipi kontrolü
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
          type: file.type,
          base64: e.target.result.split(',')[1] // Base64 kısmını al
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

  // Drag & Drop işlemleri
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
            type: file.type,
            base64: e.target.result.split(',')[1]
          });
          setAnalysisResult(null);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Lütfen sadece görsel dosyası yükleyin.');
      }
    }
  };

  // AI ile ürün analizi
  const analyzeImage = async () => {
    if (!selectedImage) {
      alert('Lütfen önce bir görsel seçin.');
      return;
    }

    if (!ollamaStatus.connected) {
      alert('Ollama bağlantısı kurulamadı. Lütfen Ollama servisinin çalıştığından emin olun.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      console.log('Starting AI analysis...'); // Debug log
      console.log('API URL:', `${API_BASE_URL}/AI/product-recognition`); // Debug log
      console.log('Image base64 length:', selectedImage.base64?.length); // Debug log

      // API'ye analiz isteği gönder
      const response = await fetch(`${API_BASE_URL}/AI/product-recognition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: selectedImage.base64,
          imageUrl: null
        })
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response ok:', response.ok); // Debug log

      // Response'u kontrol et
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API isteği başarısız (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response:', result); // Debug log

      if (result.success) {
        // Sonucu frontend formatına uyarla
        const formattedResult = {
          productName: result.data.detectedName || 'AI Tanımlı Ürün',
          category: result.data.detectedCategory || 'Elektronik',
          subcategory: result.data.detectedCategory || 'Elektronik',
          brand: result.data.detectedBrand || 'Bilinmeyen',
          model: result.data.detectedName || 'Model Bilinmiyor',
          year: new Date().getFullYear().toString(),
          confidence: result.data.confidence || 75,
          estimatedPrice: result.data.suggestedPrice || 100,
          priceRange: {
            min: (result.data.suggestedPrice || 100) * 0.85,
            max: (result.data.suggestedPrice || 100) * 1.15
          },
          color: result.data.detectedColor || 'Çeşitli',
          colorCode: '#4A4A4A',
          features: result.data.features || ['AI Analizi', 'Otomatik Tespit'],
          description: result.data.description || 'AI analizi ile tespit edildi',
          specifications: result.data.specifications || {
            processor: 'Bilinmiyor',
            memory: 'Bilinmiyor',
            storage: 'Bilinmiyor'
          },
          aiInsights: result.data.aiInsights || [
            'AI tarafından başarıyla analiz edildi',
            'Ürün özellikleri tespit edildi',
            'Fiyat tahmini oluşturuldu'
          ],
          marketAnalysis: result.data.marketAnalysis || {
            demand: 'Orta',
            competition: 'Orta',
            profitMargin: '20%',
            turnoverRate: '6x/yıl',
            customerRating: 4.0,
            returnRate: '3%'
          },
          similarProducts: [
            { name: 'Benzer Ürün 1', similarity: 85, price: (result.data.suggestedPrice || 100) * 0.9 },
            { name: 'Benzer Ürün 2', similarity: 78, price: (result.data.suggestedPrice || 100) * 1.1 }
          ],
          suggestedCategories: [result.data.detectedCategory || 'Elektronik'],
          keywordTags: ['ai', 'analiz', 'ürün'],
          barcodeSuggestion: null,
          processingTime: (result.data.processingTime || 3000) / 1000, // ms to seconds
          analysisDate: new Date().toISOString(),
          aiModel: result.data.aiModel || 'AI Model'
        };

        console.log('Formatted result:', formattedResult); // Debug log
        setAnalysisResult(formattedResult);
        
        // İstatistikleri ve geçmişi güncelle
        loadStatistics();
        loadAnalysisHistory();
        
      } else {
        console.error('API returned success=false:', result);
        throw new Error(result.message || result.error || 'Analiz başarısız');
      }

    } catch (error) {
      console.error('Analysis error details:', error);
      
      // Hata türüne göre kullanıcı dostu mesajlar
      let userMessage = 'Analiz sırasında bir hata oluştu.';
      
      if (error.message.includes('fetch')) {
        userMessage = 'Sunucuya bağlanamadı. İnternet bağlantınızı kontrol edin.';
      } else if (error.message.includes('404')) {
        userMessage = 'AI servisi bulunamadı. Backend çalışıyor mu kontrol edin.';
      } else if (error.message.includes('500')) {
        userMessage = 'Sunucu hatası. Ollama servisi çalışıyor mu kontrol edin.';
      } else if (error.message.includes('Ollama')) {
        userMessage = 'Ollama AI servisi ile bağlantı kurulamadı. Ollama çalışıyor mu kontrol edin.';
      } else {
        userMessage = `Hata: ${error.message}`;
      }
      
      // Demo modu önerisi
      const useDemo = window.confirm(
        `${userMessage}\n\nDemo modu ile devam etmek ister misiniz?`
      );
      
      if (useDemo) {
        // Demo analiz sonucu
        const demoResult = {
          productName: 'Demo Ürün',
          category: 'Elektronik',
          subcategory: 'Elektronik',
          brand: 'Demo Marka',
          model: 'Demo Model',
          year: new Date().getFullYear().toString(),
          confidence: 85.5,
          estimatedPrice: 299.99,
          priceRange: {
            min: 254.99,
            max: 344.99
          },
          color: 'Siyah',
          colorCode: '#000000',
          features: ['Demo Özellik 1', 'Demo Özellik 2'],
          description: 'Demo modunda analiz edilmiş ürün',
          specifications: {
            processor: 'Demo İşlemci',
            memory: '8GB',
            storage: '256GB'
          },
          aiInsights: [
            'Demo modunda çalışıyor',
            'Gerçek analiz için Ollama gerekli',
            'Backend bağlantısını kontrol edin'
          ],
          marketAnalysis: {
            demand: 'Orta',
            competition: 'Orta',
            profitMargin: '20%',
            turnoverRate: '6x/yıl',
            customerRating: 4.0,
            returnRate: '3%'
          },
          similarProducts: [
            { name: 'Demo Ürün 1', similarity: 85, price: 269.99 },
            { name: 'Demo Ürün 2', similarity: 78, price: 329.99 }
          ],
          suggestedCategories: ['Elektronik'],
          keywordTags: ['demo', 'test', 'ürün'],
          barcodeSuggestion: null,
          processingTime: 2.5,
          analysisDate: new Date().toISOString(),
          aiModel: 'Demo Mode'
        };
        
        setAnalysisResult(demoResult);
      }
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Renk analizi
  const analyzeColors = async () => {
    if (!selectedImage) {
      alert('Lütfen önce bir görsel seçin.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/AI/color-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: selectedImage.base64
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Renk analizi tamamlandı! Dominant renk: ${result.data.primaryColor}`);
        console.log('Color analysis result:', result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Color analysis error:', error);
      alert(`Renk analizi hatası: ${error.message}`);
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

  // Ürün olarak kaydet - Products Controller'a gönder
  const saveToProducts = async () => {
    if (!analysisResult) {
      alert('Kaydetmek için önce bir analiz yapın.');
      return;
    }

    if (!user || !user.companyId) {
      alert('Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    setIsSaving(true);

    try {
      // Kategori ID'sini bul
      const categoryId = categories.find(cat => 
        cat.name.toLowerCase() === analysisResult.category.toLowerCase()
      )?.id || categories[0]?.id || 1;

      // Form data hazırla
      const productData = {
        companyId: user.companyId,
        name: analysisResult.productName,
        description: analysisResult.description || `AI ile tanımlanan ${analysisResult.productName}`,
        categoryId: categoryId,
        brand: analysisResult.brand || 'Bilinmeyen',
        model: analysisResult.model || '',
        color: analysisResult.color || '',
        price: analysisResult.estimatedPrice || 0,
        costPrice: analysisResult.estimatedPrice ? (analysisResult.estimatedPrice * 0.7) : 0, // %30 kar marjı varsayımı
        currentStock: 1, // Varsayılan stok
        minimumStock: 1, // Varsayılan minimum stok
        barcode: analysisResult.barcodeSuggestion || '',
        imageUrl: selectedImage.preview // Base64 görsel
      };

      console.log('Saving product to database:', productData);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (result.success) {
        alert(`${analysisResult.productName} başarıyla ürün veritabanına eklendi!`);
        
        // Kullanıcıya seçenek sun
        const goToProduct = window.confirm('Ürün başarıyla eklendi! Ürün listesine gitmek ister misiniz?');
        if (goToProduct) {
          navigate('/employee/products');
        } else {
          // Mevcut analizi temizle
          setAnalysisResult(null);
          setSelectedImage(null);
        }
      } else {
        console.error('API Error Details:', result);
        
        if (result.errors) {
          const errorMessages = Object.entries(result.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          alert(`Doğrulama hataları:\n${errorMessages}`);
        } else {
          alert(result.message || 'Ürün kaydedilirken hata oluştu!');
        }
      }
      
    } catch (error) {
      console.error('Save product error:', error);
      alert('Ürün kaydedilirken bir hata oluştu: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadReport = () => {
    if (analysisResult) {
      const report = {
        analysisDate: new Date().toLocaleString('tr-TR'),
        product: analysisResult,
        image: selectedImage.name,
        aiModel: analysisResult.aiModel,
        processingTime: analysisResult.processingTime,
        confidence: analysisResult.confidence,
        user: {
          companyId: user.companyId,
          userId: user.id
        }
      };
      
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-product-analysis-${Date.now()}.json`;
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
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="text-dark fw-bold mb-1">AI Ürün Tanıma</h1>
            <p className="text-gray mb-0">Görsel yükleyerek ürünleri otomatik olarak tanımlayın ve analiz edin</p>
          </div>
          
          {/* Ollama Status */}
          <div className="d-flex align-items-center gap-3">
            <div className={`d-flex align-items-center px-3 py-2 rounded ${ollamaStatus.connected ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
              <div className={`rounded-circle me-2 ${ollamaStatus.connected ? 'bg-success' : 'bg-danger'}`} style={{width: '8px', height: '8px'}}></div>
              <span className="small fw-medium">
                {ollamaStatus.connected ? 'Ollama Bağlı' : 'Ollama Bağlı Değil'}
              </span>
            </div>
            {ollamaStatus.models.length > 0 && (
              <div className="text-gray small">
                {ollamaStatus.models.length} model yüklü
              </div>
            )}
            <button 
              onClick={checkOllamaStatus}
              className="btn btn-sm btn-outline-main"
            >
              Durumu Kontrol Et
            </button>
          </div>
        </div>
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
                      disabled={isAnalyzing || !ollamaStatus.connected}
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
                    
                    <button 
                      className="btn btn-outline-main me-3"
                      onClick={analyzeColors}
                      disabled={isAnalyzing || !ollamaStatus.connected}
                    >
                      <i className="fas fa-palette me-2"></i>
                      Renk Analizi
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
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="loading-spinner me-2"></div>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Ürün Olarak Kaydet
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-outline-main"
                    onClick={downloadReport}
                  >
                    <i className="fas fa-download me-2"></i>
                    Raporu İndir
                  </button>
                  <button 
                    className="btn btn-outline-main"
                    onClick={() => navigate('/employee/add-product')}
                  >
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
                    Ollama AI modeli çalışıyor
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
                    AI öngörüleri oluşturuluyor
                  </div>
                </div>

                <div className="progress mt-3">
                  <div 
                    className="progress-bar"
                    style={{ width: '60%', animation: 'progress-bar-stripes 1s linear infinite' }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <small className="text-gray">AI analizi devam ediyor...</small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Tips & History */}
        <div className="col-lg-4">
          {/* Statistics */}
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-chart-bar me-2"></i>
                İstatistikler
              </h5>
            </div>
            <div className="card-body">
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Toplam Analiz</span>
                  <span className="text-main fw-bold">{statistics.totalAnalyses}</span>
                </div>
              </div>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Bugün</span>
                  <span className="text-success fw-bold">{statistics.todayAnalyses}</span>
                </div>
              </div>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Başarılı</span>
                  <span className="text-info fw-bold">{statistics.successfulAnalyses}</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-gray">Ortalama Güven</span>
                  <span className="text-warning fw-bold">%{statistics.averageConfidence.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

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
                  <strong>Ollama Gereksinimleri:</strong>
                  <ul className="mb-0 mt-2">
                    <li>LLaVA modeli önerilir</li>
                    <li>En az 8GB RAM</li>
                    <li>Port 11434 açık olmalı</li>
                  </ul>
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
              {analysisHistory.length > 0 ? (
                <>
                  {analysisHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="analysis-history-item mb-3 p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer' }}>
                      <div className="d-flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="bg-main bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                            <i className="fas fa-cube text-main"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="text-dark fw-bold mb-1">{item.detectedName || 'AI Analizi'}</h6>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="badge badge-success">%{item.confidence?.toFixed(1) || '0'}</span>
                            <small className="text-gray">
                              {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                            </small>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-gray">{item.detectedBrand || 'Bilinmeyen'}</small>
                            <span className="badge badge-outline badge-main">{item.detectedCategory || 'Genel'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-3">
                    <button 
                      className="btn btn-outline-main btn-sm"
                      onClick={() => window.open(`${API_BASE_URL}/AI/analyses`, '_blank')}
                    >
                      <i className="fas fa-eye me-1"></i>
                      Tümünü Görüntüle
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-history text-gray mb-2" style={{fontSize: '2rem'}}></i>
                  <p className="text-gray mb-0">Henüz analiz geçmişi yok</p>
                </div>
              )}
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
              <button 
                className="btn btn-outline-main w-100 mb-2"
                onClick={() => navigate('/employee/products')}
              >
                <i className="fas fa-list me-2"></i>
                Ürün Listesi
              </button>
              <button 
                className="btn btn-outline-main w-100 mb-2"
                onClick={() => navigate('/employee/add-product')}
              >
                <i className="fas fa-plus me-2"></i>
                Manuel Ürün Ekle
              </button>
              <button 
                className="btn btn-outline-main w-100 mb-2"
                onClick={checkOllamaStatus}
              >
                <i className="fas fa-cogs me-2"></i>
                Model Ayarları
              </button>
              <button 
                className="btn btn-outline-main w-100"
                onClick={loadStatistics}
              >
                <i className="fas fa-sync me-2"></i>
                İstatistikleri Yenile
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
                      <button 
                        className="btn btn-sm btn-outline-main mt-2 w-100"
                        onClick={analyzeColors}
                        disabled={!selectedImage || isAnalyzing}
                      >
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

      {/* Ollama Connection Warning */}
      {!ollamaStatus.connected && (
        <div className="position-fixed" style={{ bottom: '20px', right: '20px', zIndex: 1050 }}>
          <div className="alert alert-danger shadow d-flex align-items-center" style={{ maxWidth: '300px' }}>
            <i className="fas fa-exclamation-triangle me-2"></i>
            <div>
              <div className="fw-bold">Ollama Bağlantısı Yok</div>
              <small>AI analizi için Ollama gerekli</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProductRecognition;