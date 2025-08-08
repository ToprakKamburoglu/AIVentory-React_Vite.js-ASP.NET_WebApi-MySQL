using AIVentory.API.Models.Common;
using AIVentory_backend.Models.Common;
using AIVentory_backend.Models.DTOs.Stock;

namespace AIVentory_backend.Services.Interfaces
{
    public interface IStockService
    {
        Task<ApiResponse<object>> GetStockOverviewAsync(int companyId);
        Task<ApiResponse<object>> UpdateStockAsync(int productId, int quantity, string movementType, int userId, string? reason = null);
        Task<ApiResponse<object>> GetStockMovementsAsync(int companyId, int? productId = null, int page = 1, int pageSize = 10);
        Task<ApiResponse<object>> GetStockPredictionsAsync(int companyId);
    }
}