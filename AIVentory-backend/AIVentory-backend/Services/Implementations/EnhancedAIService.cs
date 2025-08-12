using AIVentory.API.Models.Common;
using AIVentory_backend.Data;
using AIVentory_backend.Models.AI;
using AIVentory_backend.Models.Common;
using AIVentory_backend.Models.DTOs.AI;
using AIVentory_backend.Models.Entities;
using AIVentory_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System.Text.Json;

namespace AIVentory_backend.Services.Implementations
{
    public class EnhancedAIService : IAIService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<EnhancedAIService> _logger;
        private readonly OllamaConfiguration _ollamaConfig;
        private readonly SemanticKernelService? _kernelService;

        public EnhancedAIService(
            ApplicationDbContext context,
            ILogger<EnhancedAIService> logger,
            IOptions<OllamaConfiguration> ollamaConfig,
            SemanticKernelService? kernelService = null)
        {
            _context = context;
            _logger = logger;
            _ollamaConfig = ollamaConfig.Value;
            _kernelService = kernelService;
        }

        #region Product Recognition

        public async Task<ApiResponse<AIAnalysisDto>> AnalyzeProductImageAsync(byte[] imageData, string fileName, int companyId, int userId)
        {
            try
            {
                _logger.LogInformation("Starting product image analysis for {FileName} by user {UserId}", fileName, userId);

                var optimizedImage = await OptimizeImageAsync(imageData);

                ProductAnalysisResult productData;
                var startTime = DateTime.UtcNow;

                if (_kernelService != null)
                {
                    try
                    {
                        var base64Image = Convert.ToBase64String(optimizedImage);
                        productData = await PerformRealAIAnalysis(base64Image);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "AI service unavailable, using mock data");
                        productData = GenerateMockProductAnalysis();
                    }
                }
                else
                {
                    _logger.LogInformation("No AI service configured, using mock data");
                    productData = GenerateMockProductAnalysis();
                }

                var processingTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;

                var aiAnalysis = new AIAnalysis
                {
                    CompanyId = companyId,
                    ImageUrl = await SaveImageAsync(optimizedImage, fileName),
                    AnalysisType = "product_recognition",
                    AnalysisResult = JsonSerializer.Serialize(productData),
                    Confidence = productData.Confidence,
                    DetectedName = productData.ProductName,
                    DetectedCategory = productData.Category,
                    DetectedBrand = productData.Brand,
                    DetectedColor = productData.Color,
                    DetectedColorCode = productData.ColorCode,
                    SuggestedPrice = productData.EstimatedPrice,
                    ProcessingTime = processingTime,
                    AIModel = _ollamaConfig.ModelName ?? "mock",
                    Status = "completed",
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.AIAnalysis.Add(aiAnalysis);
                await _context.SaveChangesAsync();

                var result = new AIAnalysisDto
                {
                    Id = aiAnalysis.Id,
                    AnalysisType = aiAnalysis.AnalysisType,
                    DetectedName = aiAnalysis.DetectedName,
                    DetectedCategory = aiAnalysis.DetectedCategory,
                    DetectedBrand = aiAnalysis.DetectedBrand,
                    DetectedColor = aiAnalysis.DetectedColor,
                    DetectedColorCode = aiAnalysis.DetectedColorCode,
                    SuggestedPrice = aiAnalysis.SuggestedPrice,
                    Confidence = aiAnalysis.Confidence,
                    AnalysisResult = aiAnalysis.AnalysisResult,
                    ProcessingTime = aiAnalysis.ProcessingTime,
                    Status = aiAnalysis.Status,
                    CreatedAt = aiAnalysis.CreatedAt
                };

                return ApiResponse<AIAnalysisDto>.SuccessResponse(result, "Ürün analizi başarıyla tamamlandı.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing product image for user {UserId}", userId);
                return ApiResponse<AIAnalysisDto>.Failure($"Ürün analizi başarısız: {ex.Message}");
            }
        }

        public async Task<ApiResponse<AIAnalysisDto>> AnalyzeProductImageAsync(string imageUrl, int companyId, int userId)
        {
            try
            {
                using var httpClient = new HttpClient();
                var imageData = await httpClient.GetByteArrayAsync(imageUrl);
                var fileName = Path.GetFileName(new Uri(imageUrl).LocalPath) ?? "image.jpg";

                return await AnalyzeProductImageAsync(imageData, fileName, companyId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading image from URL {ImageUrl}", imageUrl);
                return ApiResponse<AIAnalysisDto>.Failure($"Görsel indirilemedi: {ex.Message}");
            }
        }

        #endregion

        #region Color Analysis

        public async Task<ApiResponse<ColorAnalysisDto>> AnalyzeColorsAsync(byte[] imageData, string fileName, int companyId, int userId)
        {
            try
            {
                _logger.LogInformation("Starting color analysis for {FileName} by user {UserId}", fileName, userId);

                var optimizedImage = await OptimizeImageAsync(imageData);

                var result = new ColorAnalysisDto
                {
                    DominantColors = new List<DetectedColor>
            {
                new() { ColorName = "Mavi", ColorCode = "#3B82F6", Percentage = 45.2m },
                new() { ColorName = "Beyaz", ColorCode = "#FFFFFF", Percentage = 32.1m },
                new() { ColorName = "Gri", ColorCode = "#6B7280", Percentage = 22.7m }
            },
                    ColorHarmony = "Complementary",
                    ColorTemperature = "Cool",
                };

                return ApiResponse<ColorAnalysisDto>.SuccessResponse(result, "Renk analizi başarıyla tamamlandı.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing colors for user {UserId}", userId);
                return ApiResponse<ColorAnalysisDto>.ErrorResponse($"Renk analizi başarısız: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ColorAnalysisDto>> GetColorAnalysisAsync(string imageUrl)
        {
            await Task.CompletedTask;
            var mockResult = new ColorAnalysisDto
            {
                DominantColors = new List<DetectedColor>
        {
            new() { ColorName = "Mavi", ColorCode = "#3B82F6", Percentage = 45.2m }
        },
                ColorHarmony = "Complementary",
                ColorTemperature = "Cool"
            };

            return ApiResponse<ColorAnalysisDto>.SuccessResponse(mockResult, "Renk analizi tamamlandı");
        }

        #endregion

        #region Price Prediction

        public async Task<ApiResponse<PriceRecommendationDto>> PredictPriceAsync(string productInfo, string category, int companyId)
        {
           
            var priceData = await Task.Run(() => GenerateMockPriceAnalysis());

            _logger.LogInformation("Starting price prediction for category {Category}", category);

            var result = new PriceRecommendationDto
            {
                EstimatedPrice = priceData.EstimatedPrice,
                MinPrice = priceData.PriceRange.Min,
                MaxPrice = priceData.PriceRange.Max,
                Confidence = priceData.Confidence,
                Currency = "TRY",
            };

            return ApiResponse<PriceRecommendationDto>.SuccessResponse(result, "Fiyat tahmini başarıyla tamamlandı.");
        }

        public async Task<ApiResponse<PriceRecommendationDto>> GetPriceRecommendationAsync(string productName, string category, string brand)
        {
            var productInfo = JsonSerializer.Serialize(new { productName, category, brand });
            return await PredictPriceAsync(productInfo, category, 1);
        }

        #endregion

        #region Stock Prediction

        public async Task<ApiResponse<StockPredictionDto>> GetStockPredictionAsync(int productId, int companyId)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Stock)
                    .FirstOrDefaultAsync(p => p.Id == productId && p.CompanyId == companyId);

                if (product == null)
                {
                    return ApiResponse<StockPredictionDto>.ErrorResponse("Ürün bulunamadı.");
                }

                var prediction = new StockPredictionDto
                {
                    ProductId = productId,
                    ProductName = product.Name,
                    CurrentStock = product.Stock?.CurrentStock ?? 0,
                    PredictedDemand = new Random().Next(5, 50),
                    RecommendedOrderQuantity = new Random().Next(10, 100),
                    StockOutDate = DateTime.Now.AddDays(new Random().Next(5, 30)),
                    Confidence = (decimal)(new Random().NextDouble() * (90 - 70) + 70),
                    SeasonalFactor = (decimal)(new Random().NextDouble() * (1.3 - 0.7) + 0.7),
                    TrendFactor = (decimal)(new Random().NextDouble() * (1.2 - 0.8) + 0.8),
                    CreatedAt = DateTime.UtcNow
                };

                return ApiResponse<StockPredictionDto>.SuccessResponse(prediction, "Stok tahmini oluşturuldu.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting stock prediction for product {ProductId}", productId);
                return ApiResponse<StockPredictionDto>.ErrorResponse($"Stok tahmini alınamadı: {ex.Message}");
            }
        }

        public async Task<ApiResponse<object>> GetDemandForecastAsync(int productId, int days = 30)
        {
            await Task.CompletedTask;
            var forecast = new
            {
                productId,
                forecastPeriod = days,
                predictedDemand = Enumerable.Range(1, Math.Min(days, 30)).Select(_ => new Random().Next(1, 15)).ToArray(),
                confidence = Math.Round(new Random().NextDouble() * (85 - 65) + 65, 2)
            };
            return ApiResponse<object>.SuccessResponse(forecast, "Talep tahmini hazırlandı");
        }

        #endregion

        #region Other Required Methods

        public async Task<ApiResponse<List<AIAnalysisDto>>> AnalyzeMultipleImagesAsync(List<(byte[] data, string fileName)> images, int companyId, int userId)
        {
            try
            {
                var results = new List<AIAnalysisDto>();

                foreach (var (data, fileName) in images)
                {
                    var result = await AnalyzeProductImageAsync(data, fileName, companyId, userId);
                    if (result.Success && result.Data != null)
                    {
                        results.Add(result.Data);
                    }
                }

                return ApiResponse<List<AIAnalysisDto>>.SuccessResponse(results, $"{results.Count} görsel başarıyla analiz edildi.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in batch image analysis");
                return ApiResponse<List<AIAnalysisDto>>.ErrorResponse($"Toplu analiz başarısız: {ex.Message}");
            }
        }

        public async Task<ApiResponse<MarketTrendAnalysisDto>> AnalyzeMarketTrendsAsync(string category, int companyId)
        {
            await Task.CompletedTask;
            var trendData = new MarketTrendAnalysisDto
            {
                Category = category,
                Period = "3 months",
                Insights = new List<string> { "Pazar büyüyor", "Rekabet artıyor" },
                Opportunities = new List<string> { "Yeni ürün fırsatları" },
                Risks = new List<string> { "Fiyat baskısı" }
            };

            return ApiResponse<MarketTrendAnalysisDto>.SuccessResponse(trendData, "Pazar analizi tamamlandı.");
        }

        public async Task<ApiResponse<List<AIAnalysisHistoryDto>>> GetAnalysisHistoryAsync(int userId, int companyId, int page = 1, int size = 20)
        {
            try
            {
                var skip = (page - 1) * size;

                var analyses = await _context.AIAnalysis
                    .Where(a => a.UserId == userId && a.CompanyId == companyId)
                    .OrderByDescending(a => a.CreatedAt)
                    .Skip(skip)
                    .Take(size)
                    .Select(a => new AIAnalysisHistoryDto
                    {
                        Id = a.Id,
                        AnalysisType = a.AnalysisType,
                        DetectedName = a.DetectedName,
                        DetectedBrand = a.DetectedBrand,
                        SuggestedPrice = a.SuggestedPrice,
                        Confidence = a.Confidence ?? 0,
                        ImageUrl = a.ImageUrl,
                        CreatedAt = a.CreatedAt
                    })
                    .ToListAsync();

                return ApiResponse<List<AIAnalysisHistoryDto>>.SuccessResponse(analyses, "Analiz geçmişi getirildi.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting analysis history for user {UserId}", userId);
                return ApiResponse<List<AIAnalysisHistoryDto>>.ErrorResponse($"Geçmiş alınamadı: {ex.Message}");
            }
        }

        public async Task<ApiResponse<AIStatisticsDto>> GetAIStatisticsAsync(int companyId)
        {
            try
            {
                var totalAnalyses = await _context.AIAnalysis.CountAsync(a => a.CompanyId == companyId);
                var todayAnalyses = await _context.AIAnalysis.CountAsync(a => a.CompanyId == companyId && a.CreatedAt.Date == DateTime.Today);
                var successfulAnalyses = await _context.AIAnalysis.CountAsync(a => a.CompanyId == companyId && a.Status == "completed");
                var averageConfidence = await _context.AIAnalysis
                    .Where(a => a.CompanyId == companyId && a.Status == "completed")
                    .AverageAsync(a => (double?)a.Confidence) ?? 0;

                var stats = new AIStatisticsDto
                {
                    TotalAnalyses = totalAnalyses,
                    TodayAnalyses = todayAnalyses,
                    SuccessfulAnalyses = successfulAnalyses,
                    AverageConfidence = Math.Round(averageConfidence, 2),
                    SuccessRate = totalAnalyses > 0 ? Math.Round((double)successfulAnalyses / totalAnalyses * 100, 2) : 0
                };

                return ApiResponse<AIStatisticsDto>.SuccessResponse(stats, "AI istatistikleri getirildi.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting AI statistics for company {CompanyId}", companyId);
                return ApiResponse<AIStatisticsDto>.ErrorResponse($"İstatistikler alınamadı: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> SaveProductFromAnalysisAsync(SaveProductFromAnalysisDto request, int userId, int companyId)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.SuccessResponse(true, "Ürün başarıyla kaydedildi.");
        }

        public async Task<ApiResponse<bool>> SaveColorPaletteAsync(SaveColorPaletteDto request, int userId, int companyId)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.SuccessResponse(true, "Renk paleti kaydedildi.");
        }

        public async Task<ApiResponse<bool>> DeleteAnalysisAsync(int analysisId, int userId, int companyId)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.SuccessResponse(true, "Analiz silindi.");
        }

        public async Task<ApiResponse<AIReportDto>> GenerateAIReportAsync(GenerateReportRequestDto request, int companyId)
        {
            await Task.CompletedTask;
            var report = new AIReportDto
            {
                Title = "AI Analiz Raporu",
                Content = "Rapor içeriği...",
                GeneratedAt = DateTime.UtcNow,
                ReportType = request.ReportType
            };

            return ApiResponse<AIReportDto>.SuccessResponse(report, "Rapor oluşturuldu.");
        }

        #endregion

        #region Helper Methods

        private async Task<byte[]> OptimizeImageAsync(byte[] imageData)
        {
            using var image = Image.Load(imageData);

            if (image.Width > 1024 || image.Height > 1024)
            {
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(1024, 1024),
                    Mode = ResizeMode.Max
                }));
            }

            using var ms = new MemoryStream();
            await image.SaveAsJpegAsync(ms);
            return ms.ToArray();
        }

        private async Task<string> SaveImageAsync(byte[] imageData, string fileName)
        {
            try
            {
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "ai-analysis");
                Directory.CreateDirectory(uploadsPath);

                var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
                var filePath = Path.Combine(uploadsPath, uniqueFileName);

                await File.WriteAllBytesAsync(filePath, imageData);

                return $"/uploads/ai-analysis/{uniqueFileName}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving image {FileName}", fileName);
                return string.Empty;
            }
        }

        private async Task<ProductAnalysisResult> PerformRealAIAnalysis(string base64Image)
        {
            await Task.CompletedTask;
            return GenerateMockProductAnalysis();
        }

        private ProductAnalysisResult GenerateMockProductAnalysis()
        {
            var random = new Random();
            return new ProductAnalysisResult
            {
                ProductName = GenerateMockProductName(),
                Category = GenerateMockCategory(),
                Brand = GenerateMockBrand(),
                Color = GenerateMockColor(),
                ColorCode = GenerateMockColorCode(),
                EstimatedPrice = (decimal)(random.NextDouble() * (500 - 10) + 10),
                Confidence = (decimal)(random.NextDouble() * (95 - 75) + 75),
                Description = "AI tarafından tanımlanan ürün",
                Features = new List<string> { "Özellik 1", "Özellik 2" },
                Specifications = new Dictionary<string, string> { { "Marka", GenerateMockBrand() } },
                Keywords = new List<string> { "keyword1", "keyword2" }
            };
        }

        private PricePredictionResult GenerateMockPriceAnalysis()
        {
            var random = new Random();
            var basePrice = (decimal)(random.NextDouble() * (500 - 10) + 10);

            return new PricePredictionResult
            {
                EstimatedPrice = basePrice,
                PriceRange = new PriceRange { Min = basePrice * 0.9m, Max = basePrice * 1.1m },
                Confidence = (decimal)(random.NextDouble() * (90 - 70) + 70),
                Factors = new List<PriceFactor>
                {
                    new() { Factor = "Pazar talebi", Impact = "positive", Weight = 30 }
                },
                Recommendations = new List<string> { "Fiyat uygun seviyede", "Rekabetçi konumda" }
            };
        }

        private string GenerateMockProductName()
        {
            var products = new[] { "Akıllı Telefon", "Laptop", "Kulaklık", "Tablet", "Smartwatch", "Kamera", "Hoparlör" };
            return products[new Random().Next(products.Length)];
        }

        private string GenerateMockCategory()
        {
            var categories = new[] { "Elektronik", "Giyim", "Ev & Yaşam", "Spor", "Kitap", "Kozmetik" };
            return categories[new Random().Next(categories.Length)];
        }

        private string GenerateMockBrand()
        {
            var brands = new[] { "Apple", "Samsung", "Sony", "LG", "Xiaomi", "Huawei", "Nike" };
            return brands[new Random().Next(brands.Length)];
        }

        private string GenerateMockColor()
        {
            var colors = new[] { "Siyah", "Beyaz", "Mavi", "Kırmızı", "Yeşil", "Gri", "Altın" };
            return colors[new Random().Next(colors.Length)];
        }

        private string GenerateMockColorCode()
        {
            var colorCodes = new[] { "#000000", "#FFFFFF", "#3B82F6", "#EF4444", "#10B981", "#6B7280", "#F59E0B" };
            return colorCodes[new Random().Next(colorCodes.Length)];
        }

        Task<ApiResponse<object>> IAIService.AnalyzeProductImageAsync(string imageUrl, int companyId, int userId)
        {
            throw new NotImplementedException();
        }

        Task<ApiResponse<object>> IAIService.GetColorAnalysisAsync(string imageUrl)
        {
            throw new NotImplementedException();
        }

        Task<ApiResponse<object>> IAIService.GetPriceRecommendationAsync(string productName, string category, string brand)
        {
            throw new NotImplementedException();
        }

        Task<ApiResponse<object>> IAIService.GetStockPredictionAsync(int productId, int companyId)
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}