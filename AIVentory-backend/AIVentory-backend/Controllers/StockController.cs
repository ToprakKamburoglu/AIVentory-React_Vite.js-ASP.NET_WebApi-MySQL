using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AIVentory_backend.Data;
using AIVentory_backend.Models.Entities;

namespace AIVentory_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<StockController> _logger;

        public StockController(ApplicationDbContext context, ILogger<StockController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult> GetStocks(
        [FromQuery] string? search = null,
        [FromQuery] string? stockStatus = null,
        [FromQuery] string? category = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? companyId = null) 
            {
            try
            {
                _logger.LogInformation("GetStocks endpoint called with CompanyId: {CompanyId}", companyId);

                var query = _context.Products
                    .Include(p => p.Stock)
                    .Include(p => p.Category)
                    .Where(p => p.IsActive);

               
                if (companyId.HasValue)
                {
                    query = query.Where(p => p.CompanyId == companyId.Value);
                }
                else
                {
                   
                    return BadRequest(new
                    {
                        success = false,
                        message = "CompanyId gerekli"
                    });
                }

          
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(p => p.Name.Contains(search) ||
                                           (p.Brand != null && p.Brand.Contains(search)) ||
                                           (p.Barcode != null && p.Barcode.Contains(search)));
                }

              
                if (!string.IsNullOrEmpty(category) && category != "all")
                {
                    query = query.Where(p => p.Category != null && p.Category.Name == category);
                }

                var totalItems = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

                var stocks = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new
                    {
                        id = p.Id,
                        productName = p.Name,
                        brand = p.Brand,
                        barcode = p.Barcode,
                        category = p.Category != null ? p.Category.Name : "Diğer",

                      
                        currentStock = p.CurrentStock, 
                        minimumStock = p.MinimumStock, 
                        price = p.Price,

                        reservedStock = p.Stock != null ? p.Stock.ReservedStock : 0,
                        availableStock = p.CurrentStock - (p.Stock != null ? p.Stock.ReservedStock : 0), 

                      
                        stockStatus = p.CurrentStock == 0 ? "out_of_stock" :
                                     p.CurrentStock <= p.MinimumStock ? "low_stock" :
                                     p.CurrentStock <= (p.MinimumStock * 1.5) ? "critical" : "in_stock",

                        lastStockUpdate = p.Stock != null ? p.Stock.LastStockUpdate : p.UpdatedAt,

                     
                        companyId = p.CompanyId
                    })
                    .ToListAsync();

              
                if (!string.IsNullOrEmpty(stockStatus))
                {
                    stocks = stocks.Where(s => s.stockStatus == stockStatus).ToList();
                }

                return Ok(new
                {
                    success = true,
                    message = $"{stocks.Count} stok kaydı bulundu (Company: {companyId})",
                    data = new
                    {
                        data = stocks,
                        pagination = new
                        {
                            currentPage = page,
                            totalPages = totalPages,
                            totalItems = totalItems,
                            pageSize = pageSize
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetStocks error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }


      
        [HttpPost("update-current-stock")]
        public async Task<ActionResult> UpdateCurrentStock([FromBody] UpdateCurrentStockRequest request)
        {
            try
            {
                if (request.ProductId <= 0 || request.NewCurrentStock < 0)
                {
                    return BadRequest(new { success = false, message = "Geçersiz ürün ID veya stok miktarı" });
                }

               
                var product = await _context.Products
                    .Include(p => p.Stock)
                    .FirstOrDefaultAsync(p => p.Id == request.ProductId && p.IsActive);

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Ürün bulunamadı" });
                }

               
                if (request.CompanyId.HasValue && product.CompanyId != request.CompanyId.Value)
                {
                    return Forbid("Bu ürüne erişim yetkiniz yok");
                }

                var previousStock = product.CurrentStock;
                var newStock = request.NewCurrentStock;

                var reservedStock = product.Stock?.ReservedStock ?? 0;
                if (newStock < reservedStock)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = $"Current stock ({newStock}) reserved stock'tan ({reservedStock}) az olamaz"
                    });
                }

              
                product.CurrentStock = newStock;
                product.UpdatedAt = DateTime.Now;

                if (product.Stock != null)
                {
                    product.Stock.CurrentStock = newStock; 
                    product.Stock.LastStockUpdate = DateTime.Now;
                }

               
                var stockMovement = new StockMovement
                {
                    ProductId = request.ProductId,
                    MovementType = newStock > previousStock ? "in" :
                                  newStock < previousStock ? "out" : "adjustment",
                    Quantity = Math.Abs(newStock - previousStock),
                    PreviousStock = previousStock,
                    NewStock = newStock,
                    UnitCost = product.Price,
                    TotalCost = product.Price * Math.Abs(newStock - previousStock),
                    Reason = request.Reason ?? "Current Stock güncelleme",
                    UserId = 1, 
                    Notes = $"Current Stock {previousStock}'den {newStock}'e güncellendi",
                    CreatedAt = DateTime.Now
                };

                _context.StockMovements.Add(stockMovement);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Current stock başarıyla güncellendi",
                    data = new
                    {
                        productId = product.Id,
                        productName = product.Name,
                        previousCurrentStock = previousStock,
                        newCurrentStock = newStock,
                        reservedStock = reservedStock,
                        newAvailableStock = newStock - reservedStock
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateCurrentStock error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Current stock güncellenirken bir hata oluştu",
                    error = ex.Message
                });
            }
        }


       
        [HttpGet("product/{productId}")]
        public async Task<ActionResult> GetStockByProductId(int productId)
        {
            try
            {
                var productStock = await _context.Products
                    .Include(p => p.Stock)
                    .Include(p => p.Category)
                    .Where(p => p.Id == productId && p.IsActive)
                    .FirstOrDefaultAsync();

                if (productStock == null)
                {
                    return NotFound(new { success = false, message = "Ürün bulunamadı" });
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        productId = productStock.Id,
                        productName = productStock.Name,
                        currentStock = productStock.Stock?.CurrentStock ?? 0,
                        reservedStock = productStock.Stock?.ReservedStock ?? 0,
                        availableStock = (productStock.Stock?.CurrentStock ?? 0) - (productStock.Stock?.ReservedStock ?? 0),
                        minimumStock = productStock.MinimumStock,
                        lastStockUpdate = productStock.Stock?.LastStockUpdate ?? productStock.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetStockByProductId error for ProductId: {ProductId}", productId);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }


        [HttpPost("movement")]
        public async Task<ActionResult> CreateStockMovement([FromBody] CreateStockMovementRequest request)
        {
            try
            {
                if (request.ProductId <= 0 || request.Quantity == 0)
                {
                    return BadRequest(new { success = false, message = "Geçersiz ürün ID veya miktar" });
                }

              
                var product = await _context.Products
                    .Include(p => p.Stock)
                    .FirstOrDefaultAsync(p => p.Id == request.ProductId && p.IsActive);

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Ürün bulunamadı" });
                }

          
                if (product.Stock == null)
                {
                    product.Stock = new Stock
                    {
                        ProductId = product.Id,
                        CurrentStock = 0,
                        ReservedStock = 0
                    };
                    _context.Stock.Add(product.Stock);
                }

                var previousStock = product.Stock.CurrentStock;
                var newStock = previousStock;

         
                switch (request.MovementType.ToLower())
                {
                    case "in": 
                        newStock = previousStock + Math.Abs(request.Quantity);
                        break;
                    case "out": 
                        newStock = previousStock - Math.Abs(request.Quantity);
                        if (newStock < 0) newStock = 0;
                        break;
                    case "adjustment": 
                        newStock = Math.Abs(request.Quantity);
                        break;
                    default:
                        return BadRequest(new { success = false, message = "Geçersiz hareket türü (in, out, adjustment)" });
                }

             
                var stockMovement = new StockMovement
                {
                    ProductId = request.ProductId,
                    MovementType = request.MovementType.ToLower(),
                    Quantity = Math.Abs(request.Quantity),
                    PreviousStock = previousStock,
                    NewStock = newStock,
                    UnitCost = request.UnitCost,
                    TotalCost = request.UnitCost * Math.Abs(request.Quantity),
                    Reason = request.Reason,
                    UserId = 1, 
                    Notes = request.Notes,
                    CreatedAt = DateTime.Now
                };

                _context.StockMovements.Add(stockMovement);

               
                product.Stock.CurrentStock = newStock;
                product.Stock.LastStockUpdate = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Stok hareketi başarıyla kaydedildi",
                    data = new
                    {
                        id = stockMovement.Id,
                        previousStock = previousStock,
                        newStock = newStock,
                        quantity = stockMovement.Quantity,
                        movementType = stockMovement.MovementType
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreateStockMovement error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Stok hareketi oluşturulurken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

      

        [HttpGet("movements")]
        public async Task<ActionResult> GetStockMovements([FromQuery] int? productId = null, [FromQuery] string? movementType = null)
        {
            try
            {
                var query = _context.StockMovements
                    .Include(sm => sm.Product)
                    .AsQueryable();

                if (productId.HasValue)
                {
                    query = query.Where(sm => sm.ProductId == productId.Value);
                }

                if (!string.IsNullOrEmpty(movementType))
                {
                    query = query.Where(sm => sm.MovementType == movementType.ToLower());
                }

                var movements = await query
                    .OrderByDescending(sm => sm.CreatedAt)
                    .Take(100)
                    .Select(sm => new
                    {
                        id = sm.Id,
                        productId = sm.ProductId,
                        productName = sm.Product.Name,
                        movementType = sm.MovementType,
                        quantity = sm.Quantity,
                        previousStock = sm.PreviousStock,
                        newStock = sm.NewStock,
                        unitCost = sm.UnitCost,
                        totalCost = sm.TotalCost,
                        reason = sm.Reason,
                        notes = sm.Notes,
                        createdAt = sm.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = $"{movements.Count} stok hareketi bulundu",
                    data = movements
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetStockMovements error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

      
        [HttpGet("critical")]
        public async Task<ActionResult> GetCriticalStockProducts()
        {
            try
            {
                var criticalProducts = await _context.Products
                    .Include(p => p.Stock)
                    .Where(p => p.IsActive && p.Stock.CurrentStock <= p.MinimumStock)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        brand = p.Brand,
                        currentStock = p.Stock.CurrentStock,
                        minimumStock = p.MinimumStock,
                        stockStatus = p.Stock.CurrentStock == 0 ? "out_of_stock" : "low_stock"
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = $"{criticalProducts.Count} kritik stok ürünü bulundu",
                    data = criticalProducts
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetCriticalStockProducts error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

       
        [HttpGet("statistics")]
        public async Task<ActionResult> GetStockStatistics()
        {
            try
            {
                var totalProducts = await _context.Products.CountAsync(p => p.IsActive);
                var totalStockValue = await _context.Products
                    .Include(p => p.Stock)
                    .Where(p => p.IsActive)
                    .SumAsync(p => (p.Stock != null ? p.Stock.CurrentStock : 0) * p.Price);

                var lowStockProducts = await _context.Products
                    .Include(p => p.Stock)
                    .CountAsync(p => p.IsActive && p.Stock.CurrentStock <= p.MinimumStock && p.Stock.CurrentStock > 0);

                var outOfStockProducts = await _context.Products
                    .Include(p => p.Stock)
                    .CountAsync(p => p.IsActive && p.Stock.CurrentStock == 0);

                var totalMovementsToday = await _context.StockMovements
                    .CountAsync(sm => sm.CreatedAt.Date == DateTime.Today);

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        totalProducts,
                        totalStockValue,
                        lowStockProducts,
                        outOfStockProducts,
                        totalMovementsToday
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetStockStatistics error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }


     
        [HttpPut("update-reserved")]
        public async Task<ActionResult> UpdateReservedStock([FromBody] UpdateReservedStockRequest request)
        {
            try
            {
                if (request.ProductId <= 0)
                {
                    return BadRequest(new { success = false, message = "Geçersiz ürün ID" });
                }

            
                var product = await _context.Products
                    .Include(p => p.Stock)
                    .FirstOrDefaultAsync(p => p.Id == request.ProductId && p.IsActive);

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Ürün bulunamadı" });
                }

                if (request.CompanyId.HasValue && product.CompanyId != request.CompanyId.Value)
                {
                    return Forbid("Bu ürüne erişim yetkiniz yok");
                }

            
                if (product.Stock == null)
                {
                    product.Stock = new Stock
                    {
                        ProductId = product.Id,
                        CurrentStock = product.CurrentStock, 
                        ReservedStock = 0
                    };
                    _context.Stock.Add(product.Stock);
                }

          
                if (request.NewReservedStock > product.CurrentStock)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = $"Rezerve stok ({request.NewReservedStock}) current stock'tan ({product.CurrentStock}) fazla olamaz"
                    });
                }

                if (request.NewReservedStock < 0)
                {
                    return BadRequest(new { success = false, message = "Rezerve stok negatif olamaz" });
                }

                var previousReservedStock = product.Stock.ReservedStock;

              
                product.Stock.ReservedStock = request.NewReservedStock;
                product.Stock.LastStockUpdate = DateTime.Now;

                await _context.SaveChangesAsync();

             
                var newAvailableStock = product.CurrentStock - product.Stock.ReservedStock;

                return Ok(new
                {
                    success = true,
                    message = "Rezerve stok başarıyla güncellendi",
                    data = new
                    {
                        productId = product.Id,
                        productName = product.Name,
                        previousReservedStock = previousReservedStock,
                        newReservedStock = request.NewReservedStock,
                        currentStock = product.CurrentStock,
                        newAvailableStock = newAvailableStock
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateReservedStock error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Rezerve stok güncellenirken bir hata oluştu",
                    error = ex.Message
                });
            }
        }


        [HttpPut("bulk-update-reserved")]
        public async Task<ActionResult> BulkUpdateReservedStock([FromBody] BulkUpdateReservedStockRequest request)
        {
            try
            {
                if (request.Updates == null || request.Updates.Count == 0)
                {
                    return BadRequest(new { success = false, message = "Güncellenecek ürün bulunamadı" });
                }

                var successCount = 0;
                var errors = new List<string>();

                foreach (var update in request.Updates)
                {
                    try
                    {
                        var product = await _context.Products
                            .Include(p => p.Stock)
                            .FirstOrDefaultAsync(p => p.Id == update.ProductId && p.IsActive);

                        if (product?.Stock == null)
                        {
                            errors.Add($"Ürün ID {update.ProductId} için stok kaydı bulunamadı");
                            continue;
                        }

                        if (update.NewReservedStock > product.Stock.CurrentStock)
                        {
                            errors.Add($"Ürün ID {update.ProductId}: Rezerve stok mevcut stoktan fazla olamaz");
                            continue;
                        }

                        if (update.NewReservedStock < 0)
                        {
                            errors.Add($"Ürün ID {update.ProductId}: Rezerve stok negatif olamaz");
                            continue;
                        }

                        product.Stock.ReservedStock = update.NewReservedStock;
                        product.Stock.LastStockUpdate = DateTime.Now;
                        successCount++;
                    }
                    catch (Exception ex)
                    {
                        errors.Add($"Ürün ID {update.ProductId}: {ex.Message}");
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = $"{successCount} ürünün rezerve stoğu güncellendi",
                    data = new
                    {
                        successCount = successCount,
                        errorCount = errors.Count,
                        errors = errors
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "BulkUpdateReservedStock error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Toplu rezerve stok güncellenirken bir hata oluştu",
                    error = ex.Message
                });
            }
        }



        [HttpPut("update-minimum-stock")]
        public async Task<ActionResult> UpdateMinimumStock([FromBody] UpdateMinimumStockRequest request)
        {
            try
            {
                var product = await _context.Products
                    .FirstOrDefaultAsync(p => p.Id == request.ProductId && p.IsActive);

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Ürün bulunamadı" });
                }

                // Company kontrolü
                if (request.CompanyId.HasValue && product.CompanyId != request.CompanyId.Value)
                {
                    return Forbid("Bu ürüne erişim yetkiniz yok");
                }

                var previousMinStock = product.MinimumStock;
                product.MinimumStock = request.NewMinimumStock;
                product.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Minimum stok başarıyla güncellendi",
                    data = new
                    {
                        productId = product.Id,
                        productName = product.Name,
                        previousMinimumStock = previousMinStock,
                        newMinimumStock = request.NewMinimumStock
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateMinimumStock error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Minimum stok güncellenirken hata oluştu",
                    error = ex.Message
                });
            }
        }


    
        [HttpGet("summary")]
        public async Task<ActionResult> GetStockSummary([FromQuery] int? companyId = null)
        {
            try
            {
                var query = _context.Products
                    .Include(p => p.Stock)
                    .Where(p => p.IsActive);

                if (companyId.HasValue)
                {
                    query = query.Where(p => p.CompanyId == companyId.Value);
                }

                var summary = await query
                    .Select(p => new
                    {
                        currentStock = p.Stock != null ? p.Stock.CurrentStock : 0,
                        reservedStock = p.Stock != null ? p.Stock.ReservedStock : 0,
                        minimumStock = p.MinimumStock,
                        price = p.Price,
                        isLowStock = p.Stock != null && p.Stock.CurrentStock <= p.MinimumStock,
                        isOutOfStock = p.Stock != null && p.Stock.CurrentStock == 0
                    })
                    .ToListAsync();

                var totalCurrentStock = summary.Sum(s => s.currentStock);
                var totalReservedStock = summary.Sum(s => s.reservedStock);
                var totalAvailableStock = totalCurrentStock - totalReservedStock;
                var totalValue = summary.Sum(s => s.currentStock * s.price);
                var lowStockCount = summary.Count(s => s.isLowStock && !s.isOutOfStock);
                var outOfStockCount = summary.Count(s => s.isOutOfStock);
                var totalProducts = summary.Count;

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        totalProducts = totalProducts,
                        totalCurrentStock = totalCurrentStock,
                        totalReservedStock = totalReservedStock,
                        totalAvailableStock = totalAvailableStock,
                        totalStockValue = totalValue,
                        lowStockProducts = lowStockCount,
                        outOfStockProducts = outOfStockCount,
                        stockHealthScore = totalProducts > 0 ?
                            Math.Round((double)(totalProducts - outOfStockCount - lowStockCount) / totalProducts * 100, 1) : 100
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetStockSummary error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Stok özeti alınırken hata oluştu",
                    error = ex.Message
                });
            }
        }

    }

    // Request DTOs
    public class CreateStockMovementRequest
    {
        public int ProductId { get; set; }
        public string MovementType { get; set; } 
        public int Quantity { get; set; }
        public decimal? UnitCost { get; set; }
        public string? Reason { get; set; }
        public string? Notes { get; set; }
    }


    public class UpdateReservedStockRequest
    {
        public int ProductId { get; set; }
        public int NewReservedStock { get; set; }
        public int? CompanyId { get; set; }
    }

    public class BulkUpdateReservedStockRequest
    {
        public List<ReservedStockUpdate> Updates { get; set; } = new();
    }

    public class ReservedStockUpdate
    {
        public int ProductId { get; set; }
        public int NewReservedStock { get; set; }
    }


    public class UpdateCurrentStockRequest
    {
        public int ProductId { get; set; }
        public int NewCurrentStock { get; set; }
        public int? CompanyId { get; set; } 
        public string? Reason { get; set; }
    }
    public class UpdateMinimumStockRequest
    {
        public int ProductId { get; set; }
        public int NewMinimumStock { get; set; }
        public int? CompanyId { get; set; } 
    }


}