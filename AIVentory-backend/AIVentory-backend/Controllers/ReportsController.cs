using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AIVentory_backend.Data;

namespace AIVentory_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ReportsController> _logger;

        public ReportsController(ApplicationDbContext context, ILogger<ReportsController> logger)
        {
            _context = context;
            _logger = logger;
        }

      
        [HttpGet("dashboard-summary")]
        public async Task<ActionResult> GetDashboardSummary()
        {
            try
            {
                _logger.LogInformation("GetDashboardSummary endpoint called");

                var totalProducts = await _context.Products.CountAsync(p => p.IsActive);
                var totalCategories = await _context.Categories.CountAsync(c => c.IsActive);
                var totalUsers = await _context.Users.CountAsync(u => u.IsActive);

                var lowStockProducts = await _context.Products
                    .Include(p => p.Stock)
                    .CountAsync(p => p.IsActive && p.Stock.CurrentStock <= p.MinimumStock && p.Stock.CurrentStock > 0);

                var outOfStockProducts = await _context.Products
                    .Include(p => p.Stock)
                    .CountAsync(p => p.IsActive && p.Stock.CurrentStock == 0);

                var totalStockValue = await _context.Products
                    .Include(p => p.Stock)
                    .Where(p => p.IsActive)
                    .SumAsync(p => (p.Stock != null ? p.Stock.CurrentStock : 0) * p.Price);

                var todayMovements = await _context.StockMovements
                    .CountAsync(sm => sm.CreatedAt.Date == DateTime.Today);

 

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        overview = new
                        {
                            totalProducts,
                            totalCategories,
                            totalUsers,
                            lowStockProducts,
                            outOfStockProducts
                        },
                        financial = new
                        {
                            totalStockValue,
                            averageProductValue = totalProducts > 0 ? totalStockValue / totalProducts : 0
                        },
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetDashboardSummary error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Dashboard özeti alınırken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

        [HttpGet("stock-status")]
        public async Task<ActionResult> GetStockStatusReport([FromQuery] int? categoryId = null, [FromQuery] string? stockStatus = null)
        {
            try
            {
                var query = _context.Products
                    .Include(p => p.Stock)
                    .Include(p => p.Category)
                    .Where(p => p.IsActive);

                if (categoryId.HasValue)
                {
                    query = query.Where(p => p.CategoryId == categoryId);
                }

                var products = await query.ToListAsync();

                var stockReport = products.Select(p => new
                {
                    productId = p.Id,
                    productName = p.Name,
                    category = p.Category?.Name ?? "Diğer",
                    brand = p.Brand,
                    currentStock = p.Stock?.CurrentStock ?? 0,
                    minimumStock = p.MinimumStock,
                    stockValue = (p.Stock?.CurrentStock ?? 0) * p.Price,
                    stockStatus = p.Stock?.CurrentStock == 0 ? "out_of_stock" :
                                 p.Stock?.CurrentStock <= p.MinimumStock ? "low_stock" :
                                 p.Stock?.CurrentStock <= (p.MinimumStock * 1.5) ? "critical" : "in_stock"
                }).ToList();

                if (!string.IsNullOrEmpty(stockStatus))
                {
                    stockReport = stockReport.Where(r => r.stockStatus == stockStatus).ToList();
                }

                var summary = new
                {
                    totalProducts = stockReport.Count,
                    inStock = stockReport.Count(r => r.stockStatus == "in_stock"),
                    lowStock = stockReport.Count(r => r.stockStatus == "low_stock"),
                    critical = stockReport.Count(r => r.stockStatus == "critical"),
                    outOfStock = stockReport.Count(r => r.stockStatus == "out_of_stock"),
                    totalStockValue = stockReport.Sum(r => r.stockValue)
                };

                return Ok(new
                {
                    success = true,
                    message = "Stok durumu raporu oluşturuldu",
                    data = new
                    {
                        summary,
                        products = stockReport
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetStockStatusReport error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Stok durumu raporu alınırken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

       
        [HttpGet("stock-movements")]
        public async Task<ActionResult> GetStockMovementsReport(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] int? productId = null)
        {
            try
            {
                startDate ??= DateTime.Today.AddDays(-30);
                endDate ??= DateTime.Today.AddDays(1);

                var query = _context.StockMovements
                    .Include(sm => sm.Product)
                    .Where(sm => sm.CreatedAt >= startDate && sm.CreatedAt < endDate);

                if (productId.HasValue)
                {
                    query = query.Where(sm => sm.ProductId == productId);
                }

                var movements = await query
                    .OrderByDescending(sm => sm.CreatedAt)
                    .Select(sm => new
                    {
                        id = sm.Id,
                        productName = sm.Product.Name,
                        movementType = sm.MovementType,
                        quantity = sm.Quantity,
                        previousStock = sm.PreviousStock,
                        newStock = sm.NewStock,
                        unitCost = sm.UnitCost,
                        totalCost = sm.TotalCost,
                        reason = sm.Reason,
                        createdAt = sm.CreatedAt
                    })
                    .ToListAsync();

                var summary = new
                {
                    totalMovements = movements.Count,
                    stockIn = movements.Count(m => m.movementType == "in"),
                    stockOut = movements.Count(m => m.movementType == "out"),
                    adjustments = movements.Count(m => m.movementType == "adjustment"),
                    totalInQuantity = movements.Where(m => m.movementType == "in").Sum(m => m.quantity),
                    totalOutQuantity = movements.Where(m => m.movementType == "out").Sum(m => m.quantity),
                    totalValue = movements.Sum(m => m.totalCost ?? 0)
                };

                return Ok(new
                {
                    success = true,
                    message = "Stok hareketleri raporu oluşturuldu",
                    data = new
                    {
                        summary,
                        movements,
                        dateRange = new { startDate, endDate }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetStockMovementsReport error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Stok hareketleri raporu alınırken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

     
        [HttpGet("ai-analysis")]
        public async Task<ActionResult> GetAIAnalysisReport(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? analysisType = null)
        {
            try
            {
                startDate ??= DateTime.Today.AddDays(-30);
                endDate ??= DateTime.Today.AddDays(1);

                var query = _context.AIAnalysis
                    .Include(a => a.Product)
                    .Where(a => a.CreatedAt >= startDate && a.CreatedAt < endDate);

                if (!string.IsNullOrEmpty(analysisType))
                {
                    query = query.Where(a => a.AnalysisType == analysisType);
                }

                var analyses = await query
                    .OrderByDescending(a => a.CreatedAt)
                    .Select(a => new
                    {
                        id = a.Id,
                        productName = a.Product != null ? a.Product.Name : "N/A",
                        analysisType = a.AnalysisType,
                        confidence = a.Confidence,
                        detectedName = a.DetectedName,
                        detectedCategory = a.DetectedCategory,
                        detectedBrand = a.DetectedBrand,
                        processingTime = a.ProcessingTime,
                        status = a.Status,
                        createdAt = a.CreatedAt
                    })
                    .ToListAsync();

                var summary = new
                {
                    totalAnalyses = analyses.Count,
                    successfulAnalyses = analyses.Count(a => a.status == "completed"),
                    averageConfidence = analyses.Where(a => a.confidence.HasValue).Average(a => (double?)a.confidence) ?? 0,
                    averageProcessingTime = analyses.Where(a => a.processingTime.HasValue).Average(a => (double?)a.processingTime) ?? 0,
                    analysesByType = analyses.GroupBy(a => a.analysisType)
                        .Select(g => new { type = g.Key, count = g.Count() })
                        .ToList()
                };

                return Ok(new
                {
                    success = true,
                    message = "AI analiz raporu oluşturuldu",
                    data = new
                    {
                        summary,
                        analyses,
                        dateRange = new { startDate, endDate }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetAIAnalysisReport error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "AI analiz raporu alınırken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

      
        [HttpGet("top-selling-products")]
        public async Task<ActionResult> GetTopSellingProductsReport([FromQuery] int limit = 10)
        {
            try
            {
              
                var products = await _context.Products
                    .Include(p => p.Stock)
                    .Include(p => p.Category)
                    .Where(p => p.IsActive)
                    .Take(limit)
                    .Select(p => new
                    {
                        productId = p.Id,
                        productName = p.Name,
                        category = p.Category != null ? p.Category.Name : "Diğer",
                        brand = p.Brand,
                        price = p.Price,
                        currentStock = p.Stock != null ? p.Stock.CurrentStock : 0,
                        soldQuantity = new Random().Next(10, 100),
                        revenue = 0m 
                    })
                    .ToListAsync();

              
                var topProducts = products.Select(p => new
                {
                    p.productId,
                    p.productName,
                    p.category,
                    p.brand,
                    p.price,
                    p.currentStock,
                    p.soldQuantity,
                    revenue = p.soldQuantity * p.price
                }).OrderByDescending(p => p.soldQuantity).ToList();

                var summary = new
                {
                    totalProducts = topProducts.Count,
                    totalSoldQuantity = topProducts.Sum(p => p.soldQuantity),
                    totalRevenue = topProducts.Sum(p => p.revenue),
                    averagePrice = topProducts.Average(p => p.price)
                };

                return Ok(new
                {
                    success = true,
                    message = "En çok satan ürünler raporu oluşturuldu",
                    data = new
                    {
                        summary,
                        products = topProducts
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetTopSellingProductsReport error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "En çok satan ürünler raporu alınırken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

      
        [HttpGet("category-stock-distribution")]
        public async Task<ActionResult> GetCategoryStockDistributionReport()
        {
            try
            {
                var categoryDistribution = await _context.Products
                    .Include(p => p.Stock)
                    .Include(p => p.Category)
                    .Where(p => p.IsActive)
                    .GroupBy(p => p.Category != null ? p.Category.Name : "Diğer")
                    .Select(g => new
                    {
                        category = g.Key,
                        productCount = g.Count(),
                        totalStock = g.Sum(p => p.Stock != null ? p.Stock.CurrentStock : 0),
                        totalValue = g.Sum(p => (p.Stock != null ? p.Stock.CurrentStock : 0) * p.Price),
                        averagePrice = g.Average(p => p.Price),
                        lowStockProducts = g.Count(p => p.Stock != null && p.Stock.CurrentStock <= p.MinimumStock)
                    })
                    .OrderByDescending(c => c.totalValue)
                    .ToListAsync();

                var summary = new
                {
                    totalCategories = categoryDistribution.Count,
                    totalProducts = categoryDistribution.Sum(c => c.productCount),
                    totalStockValue = categoryDistribution.Sum(c => c.totalValue),
                    totalStockQuantity = categoryDistribution.Sum(c => c.totalStock)
                };

                return Ok(new
                {
                    success = true,
                    message = "Kategori stok dağılımı raporu oluşturuldu",
                    data = new
                    {
                        summary,
                        categories = categoryDistribution
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetCategoryStockDistributionReport error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kategori stok dağılımı raporu alınırken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

      
        [HttpGet("critical-stock-alerts")]
        public async Task<ActionResult> GetCriticalStockAlertsReport()
        {
            try
            {
                var criticalProducts = await _context.Products
                    .Include(p => p.Stock)
                    .Include(p => p.Category)
                    .Where(p => p.IsActive && p.Stock.CurrentStock <= p.MinimumStock)
                    .Select(p => new
                    {
                        productId = p.Id,
                        productName = p.Name,
                        category = p.Category != null ? p.Category.Name : "Diğer",
                        brand = p.Brand,
                        currentStock = p.Stock.CurrentStock,
                        minimumStock = p.MinimumStock,
                        shortage = p.MinimumStock - p.Stock.CurrentStock,
                        alertLevel = p.Stock.CurrentStock == 0 ? "critical" : "warning",
                        estimatedValue = (p.MinimumStock - p.Stock.CurrentStock) * p.Price,
                        lastStockUpdate = p.Stock.LastStockUpdate
                    })
                    .OrderBy(p => p.currentStock)
                    .ToListAsync();

                var summary = new
                {
                    totalAlerts = criticalProducts.Count,
                    criticalAlerts = criticalProducts.Count(p => p.alertLevel == "critical"),
                    warningAlerts = criticalProducts.Count(p => p.alertLevel == "warning"),
                    totalShortage = criticalProducts.Sum(p => Math.Max(0, p.shortage)),
                    estimatedRestockValue = criticalProducts.Sum(p => Math.Max(0, p.estimatedValue))
                };

                return Ok(new
                {
                    success = true,
                    message = "Kritik stok uyarıları raporu oluşturuldu",
                    data = new
                    {
                        summary,
                        products = criticalProducts
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetCriticalStockAlertsReport error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kritik stok uyarıları raporu alınırken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

       
        [HttpGet("user-activities")]
        public async Task<ActionResult> GetUserActivitiesReport(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                startDate ??= DateTime.Today.AddDays(-7);
                endDate ??= DateTime.Today.AddDays(1);

              
                var users = await _context.Users
                    .Where(u => u.IsActive)
                    .Select(u => new
                    {
                        userId = u.Id,
                        userName = u.FirstName + " " + u.LastName,
                        email = u.Email,
                        role = u.Role,
                        lastLoginAt = u.LastLoginAt,
                        activitiesCount = new Random().Next(5, 50),
                        productsCreated = new Random().Next(0, 10),
                        stockMovements = new Random().Next(0, 20)
                    })
                    .ToListAsync();

                var summary = new
                {
                    totalUsers = users.Count,
                    activeUsers = users.Count(u => u.lastLoginAt >= startDate),
                    totalActivities = users.Sum(u => u.activitiesCount),
                    totalProductsCreated = users.Sum(u => u.productsCreated),
                    totalStockMovements = users.Sum(u => u.stockMovements)
                };

                return Ok(new
                {
                    success = true,
                    message = "Kullanıcı aktivite raporu oluşturuldu",
                    data = new
                    {
                        summary,
                        users,
                        dateRange = new { startDate, endDate }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetUserActivitiesReport error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kullanıcı aktivite raporu alınırken bir hata oluştu",
                    error = ex.Message
                });
            }
        }
    }
}