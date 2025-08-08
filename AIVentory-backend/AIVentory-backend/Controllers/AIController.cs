using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AIVentory_backend.Data;
using AIVentory_backend.Models.Entities;

namespace AIVentory_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AIController> _logger;

        public AIController(ApplicationDbContext context, ILogger<AIController> logger)
        {
            _context = context;
            _logger = logger;
        }

       
        [HttpPost("product-recognition")]
        public async Task<ActionResult> ProductRecognition([FromBody] ProductAnalysisRequest request)
        {
            try
            {
                _logger.LogInformation("ProductRecognition endpoint called");

                if (string.IsNullOrEmpty(request.ImageUrl))
                {
                    return BadRequest(new { success = false, message = "Resim URL'si gereklidir" });
                }

         
                var mockAnalysis = new
                {
                    id = new Random().Next(1000, 9999),
                    imageUrl = request.ImageUrl,
                    analysisType = "product_recognition",
                    confidence = Math.Round(new Random().NextDouble() * (95 - 75) + 75, 2), 
                    detectedName = GenerateMockProductName(),
                    detectedCategory = GenerateMockCategory(),
                    detectedBrand = GenerateMockBrand(),
                    detectedColor = GenerateMockColor(),
                    suggestedPrice = Math.Round(new Random().NextDouble() * (500 - 10) + 10, 2),
                    processingTime = new Random().Next(800, 2500), // ms
                    aiModel = "MockVision_v1.0",
                    status = "completed",
                    createdAt = DateTime.Now
                };

             
                var aiAnalysis = new AIAnalysis
                {
                    CompanyId = 1, 
                    ImageUrl = request.ImageUrl,
                    AnalysisType = "product_recognition",
                    AnalysisResult = System.Text.Json.JsonSerializer.Serialize(mockAnalysis),
                    Confidence = (decimal)mockAnalysis.confidence,
                    DetectedName = mockAnalysis.detectedName,
                    DetectedCategory = mockAnalysis.detectedCategory,
                    DetectedBrand = mockAnalysis.detectedBrand,
                    DetectedColor = mockAnalysis.detectedColor,
                    SuggestedPrice = (decimal)mockAnalysis.suggestedPrice,
                    ProcessingTime = mockAnalysis.processingTime,
                    AIModel = mockAnalysis.aiModel,
                    Status = "completed",
                    UserId = 1, 
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Ürün tanıma analizi tamamlandı",
                    data = mockAnalysis
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ProductRecognition error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "AI analizi sırasında bir hata oluştu",
                    error = ex.Message
                });
            }
        }

        [HttpPost("color-analysis")]
        public async Task<ActionResult> ColorAnalysis([FromBody] ProductAnalysisRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.ImageUrl))
                {
                    return BadRequest(new { success = false, message = "Resim URL'si gereklidir" });
                }

               
                var mockColorAnalysis = new
                {
                    id = new Random().Next(1000, 9999),
                    imageUrl = request.ImageUrl,
                    analysisType = "color_analysis",
                    confidence = Math.Round(new Random().NextDouble() * (98 - 85) + 85, 2),
                    dominantColors = GenerateMockColors(),
                    colorPalette = GenerateMockColorPalette(),
                    processingTime = new Random().Next(500, 1500),
                    aiModel = "ColorVision_v2.1",
                    status = "completed",
                    createdAt = DateTime.Now
                };

               
                await Task.CompletedTask;

                return Ok(new
                {
                    success = true,
                    message = "Renk analizi tamamlandı",
                    data = mockColorAnalysis
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ColorAnalysis error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Renk analizi sırasında bir hata oluştu",
                    error = ex.Message
                });
            }
        }

       
        [HttpGet("price-recommendation/{productId}")]
        public async Task<ActionResult> GetPriceRecommendation(int productId)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == productId && p.IsActive);

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Ürün bulunamadı" });
                }

             
                var currentPrice = product.Price;
                var marketAnalysis = new
                {
                    productId = productId,
                    productName = product.Name,
                    currentPrice = currentPrice,
                    suggestedPrice = Math.Round(currentPrice * (decimal)(new Random().NextDouble() * (1.2 - 0.8) + 0.8), 2),
                    marketAverage = Math.Round(currentPrice * (decimal)(new Random().NextDouble() * (1.15 - 0.9) + 0.9), 2),
                    competitorPrices = GenerateMockCompetitorPrices(currentPrice),
                    priceChange = new Random().Next(-15, 20), 
                    confidence = Math.Round(new Random().NextDouble() * (90 - 70) + 70, 2),
                    recommendation = GeneratePriceRecommendation(),
                    factors = new[]
                    {
                        "Pazar ortalaması",
                        "Rakip fiyatları",
                        "Sezonsal faktörler",
                        "Stok durumu"
                    },
                    createdAt = DateTime.Now
                };

                return Ok(new
                {
                    success = true,
                    message = "Fiyat önerisi oluşturuldu",
                    data = marketAnalysis
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetPriceRecommendation error for ProductId: {ProductId}", productId);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Fiyat önerisi alınırken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

        [HttpGet("analyses")]
        public async Task<ActionResult> GetAIAnalyses([FromQuery] string? analysisType = null)
        {
            try
            {
                IQueryable<AIAnalysis> query = _context.AIAnalysis;

                if (!string.IsNullOrEmpty(analysisType))
                {
                    query = query.Where(a => a.AnalysisType == analysisType);
                }

                var analyses = await query
                    .OrderByDescending(a => a.CreatedAt)
                    .Take(50) 
                    .Select(a => new
                    {
                        id = a.Id,
                        productId = a.ProductId,
                        productName = a.Product != null ? a.Product.Name : null,
                        imageUrl = a.ImageUrl,
                        analysisType = a.AnalysisType,
                        confidence = a.Confidence,
                        detectedName = a.DetectedName,
                        detectedCategory = a.DetectedCategory,
                        detectedBrand = a.DetectedBrand,
                        detectedColor = a.DetectedColor,
                        suggestedPrice = a.SuggestedPrice,
                        processingTime = a.ProcessingTime,
                        aiModel = a.AIModel,
                        status = a.Status,
                        createdAt = a.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = $"{analyses.Count} AI analizi bulundu",
                    data = analyses
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetAIAnalyses error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

        [HttpGet("statistics")]
        public async Task<ActionResult> GetAIStatistics()
        {
            try
            {
                var totalAnalyses = await _context.AIAnalysis.CountAsync();
                var todayAnalyses = await _context.AIAnalysis.CountAsync(a => a.CreatedAt.Date == DateTime.Today);
                var successfulAnalyses = await _context.AIAnalysis.CountAsync(a => a.Status == "completed");
                var averageConfidence = await _context.AIAnalysis
                    .Where(a => a.Status == "completed")
                    .AverageAsync(a => (double?)a.Confidence) ?? 0;

                var analysesByType = await _context.AIAnalysis
                    .GroupBy(a => a.AnalysisType)
                    .Select(g => new { type = g.Key, count = g.Count() })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        totalAnalyses,
                        todayAnalyses,
                        successfulAnalyses,
                        averageConfidence = Math.Round(averageConfidence, 2),
                        analysesByType
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetAIStatistics error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

  
        [HttpGet("demand-forecast/{productId}")]
        public async Task<ActionResult> GetDemandForecast(int productId, [FromQuery] int days = 30)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Stock)
                    .FirstOrDefaultAsync(p => p.Id == productId && p.IsActive);

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Ürün bulunamadı" });
                }

                var forecast = new
                {
                    productId = productId,
                    productName = product.Name,
                    forecastPeriod = days,
                    currentStock = product.Stock?.CurrentStock ?? 0,
                    predictedDemand = GenerateMockDemandForecast(days),
                    recommendedOrderQuantity = new Random().Next(10, 100),
                    stockOutDate = DateTime.Now.AddDays(new Random().Next(5, 30)).ToString("yyyy-MM-dd"),
                    confidence = Math.Round(new Random().NextDouble() * (85 - 65) + 65, 2),
                    seasonalFactor = Math.Round(new Random().NextDouble() * (1.3 - 0.7) + 0.7, 2),
                    trendFactor = Math.Round(new Random().NextDouble() * (1.2 - 0.8) + 0.8, 2),
                    aiModel = "DemandPredictor_v1.5",
                    createdAt = DateTime.Now
                };

                return Ok(new
                {
                    success = true,
                    message = "Talep tahmini oluşturuldu",
                    data = forecast
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetDemandForecast error for ProductId: {ProductId}", productId);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Talep tahmini alınırken bir hata oluştu",
                    error = ex.Message
                });
            }
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

        private object[] GenerateMockColors()
        {
            return new object[]
            {
                new { color = "Mavi", percentage = 45.2, hex = "#1E40AF" },
                new { color = "Beyaz", percentage = 32.1, hex = "#FFFFFF" },
                new { color = "Siyah", percentage = 22.7, hex = "#000000" }
            };
        }

        private object[] GenerateMockColorPalette()
        {
            return new object[]
            {
                "#1E40AF",
                "#FFFFFF",
                "#000000",
                "#EF4444",
                "#10B981"
            };
        }

        private object[] GenerateMockCompetitorPrices(decimal basePrice)
        {
            var competitors = new[] { "Rakip A", "Rakip B", "Rakip C" };
            return competitors.Select(c => new
            {
                competitor = c,
                price = Math.Round(basePrice * (decimal)(new Random().NextDouble() * (1.25 - 0.85) + 0.85), 2)
            }).ToArray();
        }

        private string GeneratePriceRecommendation()
        {
            var recommendations = new[]
            {
                "Fiyat uygun seviyede",
                "Fiyat artırımı öneriliyor",
                "Fiyat düşürülmesi öneriliyor",
                "Pazar ortalamasında kalın"
            };
            return recommendations[new Random().Next(recommendations.Length)];
        }

        private int[] GenerateMockDemandForecast(int days)
        {
            var forecast = new int[Math.Min(days, 30)];
            var random = new Random();
            for (int i = 0; i < forecast.Length; i++)
            {
                forecast[i] = random.Next(1, 15);
            }
            return forecast;
        }
    }

    public class DummyProduct
    {
        public static DummyProduct Product { get; internal set; }
    }

    public class ProductAnalysisRequest
    {
        public string ImageUrl { get; set; }
        public int? ProductId { get; set; }
    }
}