import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.jsx';

const AdminProductRecognition = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [testingOllama, setTestingOllama] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([
    {
      id: 1,
      date: '2025-08-22 14:30',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
      result: {
        productName: 'iPhone 15 Pro',
        category: 'Elektronik',
        brand: 'Apple',
        confidence: 92.5,
        estimatedPrice: 45000,
        aiModel: 'LLaVA 7B'
      },
      status: 'completed'
    },
    {
      id: 2,
      date: '2025-08-22 13:15',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      result: {
        productName: 'Nike Air Max',
        category: 'Spor Ayakkabısı',
        brand: 'Nike',
        confidence: 87.2,
        estimatedPrice: 2500,
        aiModel: 'LLaVA 7B'
      },
      status: 'completed'
    },
    {
      id: 3,
      date: '2025-08-22 12:45',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      result: {
        productName: 'Klasik Saat',
        category: 'Aksesuar',
        brand: 'Rolex',
        confidence: 89.8,
        estimatedPrice: 15000,
        aiModel: 'LLaVA 7B'
      },
      status: 'completed'
    },
    {
      id: 4,
      date: '2025-08-22 11:30',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
      result: {
        productName: 'Drahtlose Kopfhörer',
        category: 'Elektronik',
        brand: 'Sony',
        confidence: 91.3,
        estimatedPrice: 3500,
        aiModel: 'LLaVA 7B'
      },
      status: 'completed'
    }
  ]);
  const [statistics, setStatistics] = useState({
    totalAnalyses: 156,
    todayAnalyses: 12,
    successfulAnalyses: 142,
    averageConfidence: 89.2
  });
  const [categories, setCategories] = useState([
    { id: 1, name: 'Elektronik' },
    { id: 2, name: 'Giyim' },
    { id: 3, name: 'Spor' },
    { id: 4, name: 'Ev & Yaşam' },
    { id: 5, name: 'Kozmetik' }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    loadStatistics();
    loadAnalysisHistory();
    loadCategories();
  }, []);

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

  const loadStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/statistics`);
      const result = await response.json();
      
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('Statistics load failed:', error);
    }
  };

  const loadAnalysisHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/analyses?analysisType=product_recognition`);
      const result = await response.json();
      
      if (result.success) {
        setAnalysisHistory(result.data.slice(0, 10)); 
      }
    } catch (error) {
      console.error('History load failed:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
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
      }
    } catch (error) {
      console.error('Kategori yükleme hatası:', error);
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
          type: file.type,
          base64: e.target.result.split(',')[1] 
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

  const analyzeProduct = async () => {
    if (!selectedImage) {
      alert('Lütfen önce bir görsel seçin.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      console.log('Starting AI product analysis...');

      const requestBody = {
        imageBase64: selectedImage.base64,
        imageUrl: null
      };

      const response = await fetch(`${API_BASE_URL}/api/ai/product-recognition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API isteği başarısız (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        const formattedResult = {
          productName: result.data.detectedName || 'AI Tanımlı Ürün',
          category: result.data.detectedCategory || 'Elektronik',
          subcategory: result.data.detectedSubcategory || 'Genel',
          brand: result.data.detectedBrand || 'Bilinmeyen',
          model: result.data.detectedModel || 'Model Bilinmiyor',
          year: result.data.detectedYear || new Date().getFullYear().toString(),
          confidence: result.data.confidence || 75,
          estimatedPrice: result.data.suggestedPrice || 100,
          priceRange: {
            min: (result.data.suggestedPrice || 100) * 0.85,
            max: (result.data.suggestedPrice || 100) * 1.15
          },
          color: result.data.detectedColor || 'Çeşitli',
          colorCode: result.data.colorCode || '#4A4A4A',
          features: result.data.features || ['AI Analizi', 'Güçlü Model'],
          description: result.data.description || 'Güçlü AI modeli ile analiz edildi',
          specifications: result.data.specifications || {
            'Analiz Modeli': result.data.modelUsed || 'Powerful AI',
            'VRAM Kullanımı': result.data.powerMetrics?.vramUsage || '5.5-5.8GB',
            'Model Gücü': result.data.powerMetrics?.modelPower || 'Maximum'
          },
          aiInsights: result.data.aiInsights || [
            'Güçlü AI modeli ile analiz edildi',
            'Professional grade sonuçlar',
            'Yüksek doğruluk oranı'
          ],
          marketAnalysis: result.data.marketAnalysis || {
            demand: 'Yüksek',
            competition: 'Orta',
            profitMargin: '25%',
            turnoverRate: '8x/yıl',
            customerRating: 4.2,
            returnRate: '2.5%'
          },
          similarProducts: result.data.similarProducts || [
            { name: 'Benzer Ürün 1', similarity: 85, price: (result.data.suggestedPrice || 100) * 0.9 },
            { name: 'Benzer Ürün 2', similarity: 78, price: (result.data.suggestedPrice || 100) * 1.1 }
          ],
          suggestedCategories: result.data.suggestedCategories || [result.data.detectedCategory || 'Elektronik'],
          keywordTags: result.data.keywordTags || ['ai', 'analiz', 'ürün'],
          barcodeSuggestion: result.data.barcodeSuggestion || null,
          processingTime: (result.data.processingTime || 3000) / 1000,
          analysisDate: new Date().toISOString(),
          aiModel: result.data.modelUsed || result.data.modelCategory || 'Powerful AI Model'
        };

        console.log('Formatted analysis result:', formattedResult);
        setAnalysisResult(formattedResult);
        
        // Geçmişe ekle
        const newHistoryItem = {
          id: Date.now(),
          date: new Date().toLocaleString('tr-TR'),
          image: selectedImage.preview, 
          result: formattedResult,
          status: 'completed'
        };
        setAnalysisHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
        
       
        loadStatistics();
        
      } else {
        console.error('API returned success=false:', result);
        throw new Error(result.message || result.error || 'Analiz başarısız');
      }

    } catch (error) {
      console.error('Analysis error details:', error);
      
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
      
      const useDemo = window.confirm(
        `${userMessage}\n\nDemo modu ile devam etmek ister misiniz?`
      );
      
      if (useDemo) {
       
        const demoResult = {
          productName: 'Demo Ürün',
          category: 'Elektronik',
          subcategory: 'Genel',
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
          features: ['Demo Özellik 1', 'Demo Özellik 2', 'Yüksek Kalite'],
          description: 'Demo modunda analiz edilmiş ürün',
          specifications: {
            'İşlemci': 'Demo İşlemci',
            'Bellek': '8GB',
            'Depolama': '256GB'
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
          suggestedCategories: ['Elektronik', 'Teknoloji'],
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
      const categoryId = categories.find(cat => 
        cat.name.toLowerCase() === analysisResult.category.toLowerCase()
      )?.id || categories[0]?.id || 1;

      const productData = {
        companyId: user.companyId,
        name: analysisResult.productName,
        description: analysisResult.description || `AI ile tanımlanan ${analysisResult.productName}`,
        categoryId: categoryId,
        brand: analysisResult.brand || 'Bilinmeyen',
        model: analysisResult.model || '',
        color: analysisResult.color || '',
        price: analysisResult.estimatedPrice || 0,
        costPrice: analysisResult.estimatedPrice ? (analysisResult.estimatedPrice * 0.7) : 0, 
        currentStock: 1, 
        minimumStock: 1, 
        barcode: analysisResult.barcodeSuggestion || '',
        imageUrl: selectedImage.preview.length > 500 
        ? selectedImage.preview.substring(0, 500) 
        : selectedImage.preview
      };

      console.log('Saving product to database:', productData);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/products`, {
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
        
        const goToProduct = window.confirm('Ürün başarıyla eklendi! Ürün listesine gitmek ister misiniz?');
        if (goToProduct) {
          navigate('/admin/products');
        } else {
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
          companyId: user?.companyId,
          userId: user?.id
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
    analyzeProduct();
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

  const shareAnalysis = () => {
    if (analysisResult) {
      const shareText = `🤖 AI Ürün Analizi Sonucu:\n\nÜrün: ${analysisResult.productName}\nMarka: ${analysisResult.brand}\nKategori: ${analysisResult.category}\nTahmini Fiyat: ${formatCurrency(analysisResult.estimatedPrice)}\nGüven: %${analysisResult.confidence}\nAI Model: ${analysisResult.aiModel}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'AI Ürün Analizi',
          text: shareText,
        });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        alert('Analiz bilgileri panoya kopyalandı!');
      }
    }
  };

  const generateBarcode = () => {
    if (analysisResult) {
      const timestamp = Date.now().toString();
      const productCode = analysisResult.productName.substring(0, 3).toUpperCase();
      const barcode = `${productCode}${timestamp.slice(-8)}`;
      
      alert(`Önerilen Barkod: ${barcode}\n\nBu barkod panoya kopyalandı.`);
      navigator.clipboard.writeText(barcode);
    }
  };

  const createLabel = () => {
    if (analysisResult) {
      const labelData = {
        productName: analysisResult.productName,
        brand: analysisResult.brand,
        price: formatCurrency(analysisResult.estimatedPrice),
        category: analysisResult.category,
        barcode: '1234567890123'
      };
      
      alert(`Etiket Hazırlandı:\n\n${labelData.productName}\n${labelData.brand}\n${labelData.price}\n\nEtiket yazdırma özelliği geliştirilme aşamasında.`);
    }
  };

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="text-main mb-2">
              <i className="fas fa-brain me-2"></i>
              AI Ürün Tanıma
            </h1>
            <p className="text-gray mb-0">Ollama AI ile görsellerden ürünleri otomatik tanımlayın ve analiz edin</p>
          </div>
          <button
            onClick={testOllamaConnection}
            disabled={testingOllama}
            className={`btn ${
              ollamaStatus?.success 
                ? 'btn-success' 
                : ollamaStatus?.success === false
                ? 'btn-danger'
                : 'btn btn-main'
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
                  <i className="fas fa-cloud-upload-alt text-main mb-3" style={{ fontSize: '48px' }}></i>
                  <h4 className="text-dark mb-3">AI Ürün Tanıma İçin Görsel Yükleyin</h4>
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
                      className="btn btn-main me-3"
                      onClick={analyzeProduct}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="loading-spinner me-2"></div>
                          AI ile Ürün Analiz Ediliyor...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-brain me-2"></i>
                          Ollama AI ile Ürünü Analiz Et
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
            <div className="dashboard-card mb-4 p-3">
              <div className="card-header pb-3">
                <h5 className="card-title">
                  <i className="fas fa-search me-2"></i>
                  AI Analiz Sonuçları
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
                            <div className="text-info fw-bold">{analysisResult.marketAnalysis.demand}</div>
                            <small className="text-gray">Talep</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-warning fw-bold">{analysisResult.marketAnalysis.competition}</div>
                            <small className="text-gray">Rekabet</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-success fw-bold">{analysisResult.marketAnalysis.profitMargin}</div>
                            <small className="text-gray">Kar Marjı</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-2" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-xs)' }}>
                            <div className="text-primary fw-bold">{analysisResult.marketAnalysis.turnoverRate}</div>
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
                    onClick={shareAnalysis}
                  >
                    <i className="fas fa-share me-2"></i>
                    Paylaş
                  </button>
                  <button 
                    className="btn btn-outline-main"
                    onClick={() => navigate('/admin/add-product')}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Manuel Düzenle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="dashboard-card mb-4 p-3">
              <div className="card-header pb-3">
                <h5 className="card-title">
                  <i className="fas fa-cog fa-spin me-2"></i>
                  AI Ürün Analizi Süreci
                </h5>
              </div>
              <div className="card-body">
                <div className="ai-status processing mb-3">
                  <i className="fas fa-brain me-2"></i>
                  Ollama AI ile ürün analiz ediliyor...
                </div>
                
                <div className="analysis-steps">
                  <div className="step completed mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Görsel yüklendi ve işlendi
                  </div>
                  <div className="step processing mb-2">
                    <div className="loading-spinner me-2"></div>
                    AI ile ürün tanımlanıyor
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
                    className="progress-bar bg-gradient"
                    style={{ width: '60%', animation: 'progress-bar-stripes 1s linear infinite' }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <small className="text-gray">Tahmini süre: 20-45 saniye</small>
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

          {/* Statistics */}
          <div className="dashboard-card mb-4 p-3">
            <div className="card-header pb-3">
              <h5 className="card-title">
                <i className="fas fa-chart-bar me-2"></i>
                Analiz İstatistikleri
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
          <div className="dashboard-card mb-4 p-3">
            <div className="card-header pb-3">
              <h5 className="card-title">
                <i className="fas fa-info-circle me-2"></i>
                Analiz İpuçları
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
                    <li>Etiket ve yazılar okunabilir olsun</li>
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
                    <li>Kitap ve medya</li>
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
                    <li>İnternet bağlantısı stabil olsun</li>
                  </ul>
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
              {analysisHistory.length > 0 ? (
                <>
                  {analysisHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="analysis-history-item mb-3 p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer' }}>
                      <div className="d-flex gap-3">
                        <div className="flex-shrink-0">
                          {item.image ? (
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
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="text-dark fw-bold mb-1">{item.result?.productName || 'AI Analizi'}</h6>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="badge badge-success">%{item.result?.confidence?.toFixed(1) || '0'}</span>
                            <small className="text-gray">
                              {item.date}
                            </small>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-gray">{item.result?.brand || 'Bilinmeyen'}</small>
                            <span className="badge badge-outline badge-main">{item.result?.category || 'Genel'}</span>
                          </div>
                          {item.result?.estimatedPrice && (
                            <div className="mt-1">
                              <small className="text-success fw-bold">{formatCurrency(item.result.estimatedPrice)}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-3">
                    <button 
                      className="btn btn-outline-main btn-sm"
                      onClick={() => navigate('/admin/analysis-history')}
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
          <div className="dashboard-card mb-4 p-3">
            <div className="card-header pb-3">
              <h5 className="card-title">
                <i className="fas fa-rocket me-2"></i>
                Hızlı İşlemler
              </h5>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-outline-main w-100 mb-2"
                onClick={() => navigate('/admin/products')}
              >
                <i className="fas fa-list me-2"></i>
                Ürün Listesi
              </button>
              <button 
                className="btn btn-outline-main w-100 mb-2"
                onClick={() => navigate('/admin/products/add')}
              >
                <i className="fas fa-plus me-2"></i>
                Manuel Ürün Ekle
              </button>
              <button 
                className="btn btn-outline-main w-100"
                onClick={() => navigate('/admin/ai/colors')}
              >
                <i className="fas fa-palette me-2"></i>
                Renk Analizi
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
                      <button 
                        className="btn btn-sm btn-outline-main mt-2 w-100"
                        onClick={generateBarcode}
                      >
                        Oluştur
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card text-center p-3" style={{ backgroundColor: 'var(--light-bg)', borderRadius: 'var(--border-radius-sm)' }}>
                      <i className="fas fa-tags text-warning mb-2" style={{ fontSize: '24px' }}></i>
                      <h6 className="text-dark fw-bold">Etiket Yazdır</h6>
                      <small className="text-gray">Ürün etiketi hazırla</small>
                      <button 
                        className="btn btn-sm btn-outline-main mt-2 w-100"
                        onClick={createLabel}
                      >
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
                        onClick={() => navigate('/admin/color-analysis')}
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
                      <button 
                        className="btn btn-sm btn-outline-main mt-2 w-100"
                        onClick={() => alert('Trend analizi özelliği yakında aktif olacak!')}
                      >
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

      {/* Help Modal */}
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
                    <li>Ollama AI'ın çalıştığını test edin</li>
                    <li>Ürün görselini yükleyin</li>
                    <li>"AI ile Ürünü Analiz Et" butonuna tıklayın</li>
                    <li>AI analiz sonuçlarını inceleyin</li>
                    <li>Ürünü veritabanına kaydedin</li>
                  </ol>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold">Sık Sorulan Sorular</h6>
                  <p><strong>S:</strong> Hangi AI modeller desteklenir?<br />
                  <strong>C:</strong> LLaVA, Moondream gibi vision modeller.</p>
                  
                  <p><strong>S:</strong> Ürün analizi ne kadar sürer?<br />
                  <strong>C:</strong> Genellikle 20-45 saniye arası.</p>
                  
                  <p><strong>S:</strong> Sonuçlar ne kadar doğru?<br />
                  <strong>C:</strong> AI güven oranı %75-95 arası değişir.</p>
                  
                  <p><strong>S:</strong> Hangi dosya formatları desteklenir?<br />
                  <strong>C:</strong> JPG, PNG, GIF (maks 10MB).</p>
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

export default AdminProductRecognition;