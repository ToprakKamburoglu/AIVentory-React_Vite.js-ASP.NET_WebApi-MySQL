using AIVentory.API.Models.Common;
using AIVentory_backend.Models.Common;
using AIVentory_backend.Models.DTOs.Category;
using AIVentory_backend.Models.DTOs.Product;

namespace AIVentory_backend.Services.Interfaces
{
    public interface IProductService
    {
        Task<ApiResponse<object>> GetProductsAsync(int companyId, int page = 1, int pageSize = 10, string? search = null, int? categoryId = null);
        Task<ApiResponse<object>> GetProductByIdAsync(int id, int companyId);
        Task<ApiResponse<object>> CreateProductAsync(CreateProductDto productDto, int companyId, int userId);
        Task<ApiResponse<object>> UpdateProductAsync(int id, UpdateProductDto productDto, int companyId);
        Task<ApiResponse<object>> DeleteProductAsync(int id, int companyId);
        Task<ApiResponse<object>> GetLowStockProductsAsync(int companyId);
    }
}

