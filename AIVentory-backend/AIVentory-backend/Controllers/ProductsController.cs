using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AIVentory_backend.Data;
using AIVentory_backend.Models.Entities;
using AIVentory_backend.Models.Common;
using AIVentory_backend.Models.DTOs.Product;
using System.Text.Json;

namespace AIVentory_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(ApplicationDbContext context, ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
        }

      
        [HttpGet]
        public async Task<ActionResult> GetProducts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] int? companyId = null) 
        {
            try
            {
                _logger.LogInformation("GetProducts endpoint called");
                var query = _context.Products
                    .Include(p => p.Stock)
                    .Include(p => p.Category) 
                    .Where(p => p.IsActive);

                if (companyId.HasValue)
                {
                    query = query.Where(p => p.CompanyId == companyId.Value);
                }

                // Arama filtresi (mevcut kod aynı)
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(p => p.Name.Contains(search) ||
                                       p.Brand.Contains(search) ||
                                       p.Barcode.Contains(search));
                }

                if (categoryId.HasValue)
                {
                    query = query.Where(p => p.CategoryId == categoryId.Value);
                }

                var totalItems = await query.CountAsync();

                var productsFromDb = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        description = p.Description,
                        price = p.Price,
                        costPrice = p.CostPrice,
                        brand = p.Brand,
                        model = p.Model,
                        color = p.Color,
                        barcode = p.Barcode,
                        categoryId = p.CategoryId,
                        categoryName = p.Category != null ? p.Category.Name : null,
                        imageUrl = p.ImageUrl,
                        minimumStock = p.MinimumStock,
                        currentStock = p.CurrentStock,
                        companyId = p.CompanyId, 
                        createdAt = p.CreatedAt,
                        updatedAt = p.UpdatedAt
                    })
                    .ToListAsync();

                var products = productsFromDb.Select(p => new
                {
                    id = p.id,
                    name = p.name,
                    description = p.description,
                    price = p.price,
                    costPrice = p.costPrice,
                    brand = p.brand,
                    model = p.model,
                    color = p.color,
                    barcode = p.barcode,
                    categoryId = p.categoryId,
                    categoryName = p.categoryName,
                    imageUrl = ProcessImageUrl(p.imageUrl),
                    minimumStock = p.minimumStock,
                    currentStock = p.currentStock,
                    companyId = p.companyId, 
                    createdAt = p.createdAt,
                    updatedAt = p.updatedAt
                }).ToList();

                return Ok(new
                {
                    success = true,
                    message = $"{products.Count} ürün bulundu",
                    data = new
                    {
                        data = products,
                        pagination = new
                        {
                            currentPage = page,
                            pageSize = pageSize,
                            totalItems = totalItems,
                            totalPages = (int)Math.Ceiling((double)totalItems / pageSize)
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetProducts error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

      
        [HttpGet("{id}")]
        public async Task<ActionResult> GetProduct(int id)
        {
            try
            {
                var productFromDb = await _context.Products
                    .Include(p => p.Stock)
                    .Include(p => p.Category)
                    .Where(p => p.Id == id && p.IsActive)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        description = p.Description,
                        price = p.Price,
                        costPrice = p.CostPrice,
                        brand = p.Brand,
                        model = p.Model,
                        color = p.Color,
                        barcode = p.Barcode,
                        categoryId = p.CategoryId,
                        categoryName = p.Category != null ? p.Category.Name : null,
                        minimumStock = p.MinimumStock,
                        currentStock = p.CurrentStock,
                        imageUrl = p.ImageUrl,
                        createdAt = p.CreatedAt,
                        updatedAt = p.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (productFromDb == null)
                {
                    return NotFound(new { success = false, message = "Ürün bulunamadı" });
                }

                var product = new
                {
                    id = productFromDb.id,
                    name = productFromDb.name,
                    description = productFromDb.description,
                    price = productFromDb.price,
                    costPrice = productFromDb.costPrice,
                    brand = productFromDb.brand,
                    model = productFromDb.model,
                    color = productFromDb.color,
                    barcode = productFromDb.barcode,
                    categoryId = productFromDb.categoryId,
                    categoryName = productFromDb.categoryName,
                    minimumStock = productFromDb.minimumStock,
                    currentStock = productFromDb.currentStock,
                    imageUrl = ProcessImageUrl(productFromDb.imageUrl),
                    createdAt = productFromDb.createdAt,
                    updatedAt = productFromDb.updatedAt
                };

                return Ok(new
                {
                    success = true,
                    data = product
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetProduct error for ID: {ProductId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

        [HttpGet("barcode/{barcode}")]
        public async Task<ActionResult> GetProductByBarcode(string barcode)
        {
            try
            {
                var productFromDb = await _context.Products
                    .Include(p => p.Stock)
                    .Include(p => p.Category)
                    .Where(p => p.Barcode == barcode && p.IsActive)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        price = p.Price,
                        brand = p.Brand,
                        barcode = p.Barcode,
                        currentStock = p.CurrentStock,
                        imageUrl = p.ImageUrl
                    })
                    .FirstOrDefaultAsync();

                if (productFromDb == null)
                {
                    return NotFound(new { success = false, message = "Barkoda ait ürün bulunamadı" });
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        id = productFromDb.id,
                        name = productFromDb.name,
                        price = productFromDb.price,
                        brand = productFromDb.brand,
                        barcode = productFromDb.barcode,
                        currentStock = productFromDb.currentStock,
                        imageUrl = ProcessImageUrl(productFromDb.imageUrl)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetProductByBarcode error: {Barcode}", barcode);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

     
        [HttpPost]
        public async Task<ActionResult> CreateProduct([FromBody] CreateProductDto productDto)
        {
            try
            {
                _logger.LogInformation("CreateProduct called with: {@ProductDto}", productDto);
                _logger.LogInformation("CurrentStock value: {CurrentStock}", productDto.CurrentStock);

                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value.Errors.Count > 0)
                        .ToDictionary(
                            kvp => kvp.Key,
                            kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                        );

                    return BadRequest(new
                    {
                        success = false,
                        message = "Geçersiz ürün bilgileri",
                        errors = errors
                    });
                }

                if (!string.IsNullOrEmpty(productDto.Barcode))
                {
                    var existingProduct = await _context.Products
                        .FirstOrDefaultAsync(p => p.Barcode == productDto.Barcode);

                    if (existingProduct != null)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Bu barkod zaten kullanılıyor"
                        });
                    }
                }

                var product = new Product
                {
                    CompanyId = productDto.CompanyId ?? 0,
                    Name = productDto.Name,
                    Description = productDto.Description,
                    Price = productDto.Price,
                    CostPrice = productDto.CostPrice ?? 0,
                    Brand = productDto.Brand,
                    Model = productDto.Model,
                    Color = productDto.Color,
                    Barcode = productDto.Barcode,
                    CategoryId = productDto.CategoryId,
                    MinimumStock = productDto.MinimumStock ?? 0,
                    CurrentStock = productDto.CurrentStock ?? 0,
                    ImageUrl = productDto.ImageUrl,
                    IsActive = true,
                    CreatedBy = 1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _logger.LogInformation("Adding product to database...");
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Product created successfully with ID: {ProductId}, CurrentStock: {CurrentStock}",
                    product.Id, product.CurrentStock);

             

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, new
                {
                    success = true,
                    message = "Ürün başarıyla oluşturuldu",
                    data = new
                    {
                        id = product.Id,
                        name = product.Name,
                        currentStock = product.CurrentStock
                    }
                });
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database update exception");
                _logger.LogError("Inner exception: {InnerException}", dbEx.InnerException?.Message);

                return StatusCode(500, new
                {
                    success = false,
                    message = "Veritabanı hatası",
                    error = dbEx.InnerException?.Message ?? dbEx.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreateProduct error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Ürün oluşturulurken hata oluştu",
                    error = ex.Message
                });
            }
        }

       
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(int id, [FromForm] UpdateProductDto productDto, IFormFile? image)
        {
            try
            {
                _logger.LogInformation("UpdateProduct called for ID: {ProductId} with data: {@ProductDto}", id, productDto);

                var product = await _context.Products
                    .Include(p => p.Stock)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Ürün bulunamadı" });
                }

               
                if (!string.IsNullOrEmpty(productDto.Barcode) && productDto.Barcode != product.Barcode)
                {
                    var existingProduct = await _context.Products
                        .FirstOrDefaultAsync(p => p.Barcode == productDto.Barcode && p.Id != id);

                    if (existingProduct != null)
                    {
                        return BadRequest(new { success = false, message = "Bu barkod zaten başka bir ürün tarafından kullanılıyor" });
                    }
                }

          
                if (!string.IsNullOrEmpty(productDto.Name))
                    product.Name = productDto.Name;

                if (productDto.Description != null)
                    product.Description = productDto.Description;

                if (productDto.Price.HasValue)
                    product.Price = productDto.Price.Value;

                if (productDto.CostPrice.HasValue)
                    product.CostPrice = productDto.CostPrice.Value;

                if (!string.IsNullOrEmpty(productDto.Brand))
                    product.Brand = productDto.Brand;

                if (!string.IsNullOrEmpty(productDto.Model))
                    product.Model = productDto.Model;

                if (!string.IsNullOrEmpty(productDto.Color))
                    product.Color = productDto.Color;

                if (!string.IsNullOrEmpty(productDto.Barcode))
                    product.Barcode = productDto.Barcode;

                if (productDto.CategoryId.HasValue)
                    product.CategoryId = productDto.CategoryId.Value;

                if (productDto.MinimumStock.HasValue)
                    product.MinimumStock = productDto.MinimumStock.Value;

                if (productDto.MaximumStock.HasValue)
                    product.MaximumStock = productDto.MaximumStock.Value;

                if (image != null && image.Length > 0)
                {
                 
                    var uploadsFolder = Path.Combine("wwwroot", "uploads", "products");
                    Directory.CreateDirectory(uploadsFolder);
                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                 
                    product.ImageUrl = $"/uploads/products/{fileName}";
                }
                else if (!string.IsNullOrEmpty(productDto.ImageUrl))
                {
                    product.ImageUrl = productDto.ImageUrl;
                }

              
                if (productDto.CurrentStock.HasValue)
                {
                    product.CurrentStock = productDto.CurrentStock.Value; 

                  
                    if (product.Stock == null)
                    {
                        product.Stock = new Stock
                        {
                            ProductId = product.Id,
                            CurrentStock = productDto.CurrentStock.Value,
                            ReservedStock = 0,
                            LastStockUpdate = DateTime.Now
                        };
                        _context.Stock.Add(product.Stock);
                    }
                    else
                    {
                        product.Stock.CurrentStock = productDto.CurrentStock.Value;
                        product.Stock.LastStockUpdate = DateTime.Now;
                    }

                    _logger.LogInformation("CurrentStock updated to: {CurrentStock} for ProductId: {ProductId}",
                        productDto.CurrentStock.Value, product.Id);
                }

                product.UpdatedAt = DateTime.Now;

                _logger.LogInformation("Saving changes to database...");
                await _context.SaveChangesAsync();
                _logger.LogInformation("Changes saved successfully");

                return Ok(new
                {
                    success = true,
                    message = "Ürün başarıyla güncellendi",
                    data = new
                    {
                        id = product.Id,
                        name = product.Name,
                        price = product.Price,
                        currentStock = product.CurrentStock, 
                        minimumStock = product.MinimumStock,
                        imageUrl = product.ImageUrl
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateProduct error for ID: {ProductId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Ürün güncellenirken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

      
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { success = false, message = "Ürün bulunamadı" });
                }

                product.IsActive = false;
                product.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Ürün başarıyla silindi"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteProduct error for ID: {ProductId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Ürün silinirken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

     
        [HttpGet("low-stock")]
        public async Task<ActionResult> GetLowStockProducts()
        {
            try
            {
                var productsFromDb = await _context.Products
                    .Where(p => p.IsActive && p.CurrentStock <= p.MinimumStock) 
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        brand = p.Brand,
                        currentStock = p.CurrentStock,
                        minimumStock = p.MinimumStock,
                        imageUrl = p.ImageUrl
                    })
                    .ToListAsync();

                var products = productsFromDb.Select(p => new
                {
                    id = p.id,
                    name = p.name,
                    brand = p.brand,
                    currentStock = p.currentStock,
                    minimumStock = p.minimumStock,
                    imageUrl = ProcessImageUrl(p.imageUrl)
                }).ToList();

                return Ok(new
                {
                    success = true,
                    message = $"{products.Count} düşük stoklu ürün bulundu",
                    data = products
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetLowStockProducts error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

     
        [HttpGet("recent")]
        public async Task<ActionResult> GetRecentProducts([FromQuery] int limit = 5)
        {
            try
            {
                var productsFromDb = await _context.Products
                    .Where(p => p.IsActive)
                    .OrderByDescending(p => p.CreatedAt)
                    .Take(limit)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        brand = p.Brand,
                        price = p.Price,
                        currentStock = p.CurrentStock, 
                        imageUrl = p.ImageUrl,
                        createdAt = p.CreatedAt
                    })
                    .ToListAsync();

                var products = productsFromDb.Select(p => new
                {
                    id = p.id,
                    name = p.name,
                    brand = p.brand,
                    price = p.price,
                    currentStock = p.currentStock,
                    imageUrl = ProcessImageUrl(p.imageUrl),
                    createdAt = p.createdAt
                }).ToList();

                return Ok(new
                {
                    success = true,
                    message = $"{products.Count} son ürün bulundu",
                    data = products
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetRecentProducts error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

        [HttpGet("brands")]
        public async Task<ActionResult> GetBrands()
        {
            try
            {
                var brands = await _context.Products
                    .Where(p => p.IsActive && !string.IsNullOrEmpty(p.Brand))
                    .GroupBy(p => p.Brand)
                    .Select(g => new
                    {
                        brand = g.Key,
                        productCount = g.Count()
                    })
                    .OrderByDescending(b => b.productCount)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = $"{brands.Count} marka bulundu",
                    data = brands
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetBrands error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

        [HttpGet("statistics")]
        public async Task<ActionResult> GetStatistics()
        {
            try
            {
                var totalProducts = await _context.Products.CountAsync(p => p.IsActive);
                var lowStockProducts = await _context.Products
                    .CountAsync(p => p.IsActive && p.CurrentStock <= p.MinimumStock);
                var outOfStockProducts = await _context.Products
                    .CountAsync(p => p.IsActive && p.CurrentStock == 0); 
                var totalBrands = await _context.Products
                    .Where(p => p.IsActive && !string.IsNullOrEmpty(p.Brand))
                    .Select(p => p.Brand)
                    .Distinct()
                    .CountAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        totalProducts,
                        lowStockProducts,
                        outOfStockProducts,
                        totalBrands
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetStatistics error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

       
        [HttpPatch("{id}/status")]
        public async Task<ActionResult> UpdateProductStatus(int id, [FromBody] bool isActive)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { success = false, message = "Ürün bulunamadı" });
                }

                product.IsActive = isActive;
                product.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                var statusText = isActive ? "aktif" : "pasif";
                return Ok(new
                {
                    success = true,
                    message = $"Ürün başarıyla {statusText} yapıldı"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateProductStatus error for ID: {ProductId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Durum güncellenirken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

        private string? ProcessImageUrl(string? imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return null;

            if (imageUrl.Contains("google.com/url?"))
                return null;

            if (!IsValidImageUrl(imageUrl))
                return null;

            if (imageUrl.StartsWith("http://") || imageUrl.StartsWith("https://"))
                return imageUrl.Trim('\'', '"');

            return $"{Request.Scheme}://{Request.Host}/{imageUrl.TrimStart('/')}";
        }

        private static bool IsValidImageUrl(string url)
        {
            return url.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                   url.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
                   url.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
                   url.EndsWith(".gif", StringComparison.OrdinalIgnoreCase) ||
                   url.EndsWith(".webp", StringComparison.OrdinalIgnoreCase);
        }
    }
}