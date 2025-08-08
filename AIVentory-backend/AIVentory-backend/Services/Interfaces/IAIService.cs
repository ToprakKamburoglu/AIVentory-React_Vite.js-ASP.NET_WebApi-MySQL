using AIVentory.API.Models.Common;
using AIVentory_backend.Models.Common;
using AIVentory_backend.Models.DTOs.AI;

namespace AIVentory_backend.Services.Interfaces
{
    public interface IAIService
    {
        Task<ApiResponse<object>> AnalyzeProductImageAsync(string imageUrl, int companyId, int userId);
        Task<ApiResponse<object>> GetColorAnalysisAsync(string imageUrl);
        Task<ApiResponse<object>> GetPriceRecommendationAsync(string productName, string category, string brand);
        Task<ApiResponse<object>> GetStockPredictionAsync(int productId, int companyId);
    }
}