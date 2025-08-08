using AIVentory.API.Models.Common;
using AIVentory_backend.Models.Common;

namespace AIVentory_backend.Services.Interfaces
{
    public interface IReportService
    {
        Task<ApiResponse<object>> GetSalesReportAsync(int companyId, DateTime? startDate = null, DateTime? endDate = null);
        Task<ApiResponse<object>> GetStockReportAsync(int companyId);
        Task<ApiResponse<object>> GetFinancialReportAsync(int companyId, DateTime? startDate = null, DateTime? endDate = null);
        Task<ApiResponse<object>> ExportProductsToExcelAsync(int companyId);
        Task<ApiResponse<object>> GetDashboardStatsAsync(int companyId);
    }
}