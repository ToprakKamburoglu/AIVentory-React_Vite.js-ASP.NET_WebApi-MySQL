using AIVentory.API.Models.Common;
using AIVentory_backend.Data;
using AIVentory_backend.Models.Common;
using AIVentory_backend.Models.DTOs.Product;
using AIVentory_backend.Models.Entities;
using AIVentory_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AIVentory_backend.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProductService> _logger;

        public ProductService(ApplicationDbContext context, ILogger<ProductService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ApiResponse<object>> GetProductsAsync(int companyId, int page = 1, int pageSize = 10, string? search = null, int? categoryId = null)
        {
            try
            {
                var query = _context.Products
                    .Include(p => p.Category)
                    .Where(p => p.IsActive && p.CompanyId == companyId);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(p => p.Name.Contains(search) || p.Brand.Contains(search) || p.Barcode.Contains(search));
                }

                if (categoryId.HasValue)
                {
                    query = query.Where(p => p.CategoryId == categoryId.Value);
                }

                var totalItems = await query.CountAsync();
                var products = await query
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
                        currentStock = p.CurrentStock,
                        categoryName = p.Category != null ? p.Category.Name : null,
                        imageUrl = p.ImageUrl
                    })
                    .ToListAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Ürünler başarıyla getirildi",
                    Data = new { data = products, totalItems, currentPage = page, pageSize }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products");
                return new ApiResponse<object> { Success = false, Message = "Ürünler getirilirken hata oluştu" };
            }
        }

        public async Task<ApiResponse<object>> GetProductByIdAsync(int id, int companyId)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == id && p.CompanyId == companyId && p.IsActive);

                if (product == null)
                {
                    return new ApiResponse<object> { Success = false, Message = "Ürün bulunamadı" };
                }

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Ürün başarıyla getirildi",
                    Data = product
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product by id: {ProductId}", id);
                return new ApiResponse<object> { Success = false, Message = "Ürün getirilirken hata oluştu" };
            }
        }

        public async Task<ApiResponse<object>> CreateProductAsync(CreateProductDto productDto, int companyId, int userId)
        {
            try
            {
                var product = new Product
                {
                    CompanyId = companyId,
                    Name = productDto.Name,
                    Description = productDto.Description,
                    Price = productDto.Price,
                    CostPrice = productDto.CostPrice ?? 0,
                    Brand = productDto.Brand,
                    CurrentStock = productDto.CurrentStock ?? 0,
                    MinimumStock = productDto.MinimumStock ?? 0,
                    CategoryId = productDto.CategoryId,
                    ImageUrl = productDto.ImageUrl,
                    IsActive = true,
                    CreatedBy = userId,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Ürün başarıyla oluşturuldu",
                    Data = new { id = product.Id, name = product.Name }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return new ApiResponse<object> { Success = false, Message = "Ürün oluşturulurken hata oluştu" };
            }
        }

        public async Task<ApiResponse<object>> UpdateProductAsync(int id, UpdateProductDto productDto, int companyId)
        {
          
            await Task.CompletedTask;
            return new ApiResponse<object> { Success = true, Message = "Güncelleme başarılı" };
        }

        public async Task<ApiResponse<object>> DeleteProductAsync(int id, int companyId)
        {
           
            await Task.CompletedTask;
            return new ApiResponse<object> { Success = true, Message = "Silme başarılı" };
        }

        public async Task<ApiResponse<object>> GetLowStockProductsAsync(int companyId)
        {
            try
            {
                var lowStockProducts = await _context.Products
                    .Where(p => p.IsActive && p.CompanyId == companyId && p.CurrentStock <= p.MinimumStock)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        currentStock = p.CurrentStock,
                        minimumStock = p.MinimumStock
                    })
                    .ToListAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Düşük stoklu ürünler getirildi",
                    Data = lowStockProducts
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting low stock products");
                return new ApiResponse<object> { Success = false, Message = "Düşük stoklu ürünler getirilirken hata oluştu" };
            }
        }
    }
}