using AIVentory.API.Models.Common;
using AIVentory_backend.Models.Common;
using AIVentory_backend.Models.DTOs.Category;

namespace AIVentory_backend.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<ApiResponse<object>> GetCategoriesAsync(int companyId);
        Task<ApiResponse<object>> GetCategoryByIdAsync(int id, int companyId);
        Task<ApiResponse<object>> CreateCategoryAsync(CreateCategoryDto categoryDto, int companyId);
        Task<ApiResponse<object>> UpdateCategoryAsync(int id, UpdateCategoryDto categoryDto, int companyId);
        Task<ApiResponse<object>> DeleteCategoryAsync(int id, int companyId);
    }
}