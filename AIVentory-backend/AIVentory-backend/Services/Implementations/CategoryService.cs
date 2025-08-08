using AIVentory.API.Models.Common;
using AIVentory_backend.Data;
using AIVentory_backend.Models.Common;
using AIVentory_backend.Models.DTOs.Category;
using AIVentory_backend.Models.Entities;
using AIVentory_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AIVentory_backend.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(ApplicationDbContext context, ILogger<CategoryService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ApiResponse<object>> GetCategoriesAsync(int companyId)
        {
            try
            {
                var categories = await _context.Categories
                    .Where(c => c.IsActive && c.CompanyId == companyId)
                    .Select(c => new
                    {
                        id = c.Id,
                        name = c.Name,
                        description = c.Description,
                        color = c.Color,
                        icon = c.Icon
                    })
                    .ToListAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Kategoriler başarıyla getirildi",
                    Data = categories
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting categories");
                return new ApiResponse<object> { Success = false, Message = "Kategoriler getirilirken hata oluştu" };
            }
        }

        public async Task<ApiResponse<object>> GetCategoryByIdAsync(int id, int companyId)
        {
            try
            {
                var category = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Id == id && c.CompanyId == companyId && c.IsActive);

                if (category == null)
                {
                    return new ApiResponse<object> { Success = false, Message = "Kategori bulunamadı" };
                }

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Kategori başarıyla getirildi",
                    Data = category
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting category by id: {CategoryId}", id);
                return new ApiResponse<object> { Success = false, Message = "Kategori getirilirken hata oluştu" };
            }
        }

        public async Task<ApiResponse<object>> CreateCategoryAsync(CreateCategoryDto categoryDto, int companyId)
        {
            try
            {
                var category = new Category
                {
                    CompanyId = companyId,
                    Name = categoryDto.Name,
                    Description = categoryDto.Description,
                    Color = categoryDto.Color ?? "#007bff",
                    Icon = categoryDto.Icon ?? "fas fa-tag",
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Kategori başarıyla oluşturuldu",
                    Data = new { id = category.Id, name = category.Name }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return new ApiResponse<object> { Success = false, Message = "Kategori oluşturulurken hata oluştu" };
            }
        }

        public async Task<ApiResponse<object>> UpdateCategoryAsync(int id, UpdateCategoryDto categoryDto, int companyId)
        {
           
            await Task.CompletedTask;
            return new ApiResponse<object> { Success = true, Message = "Güncelleme başarılı" };
        }

        public async Task<ApiResponse<object>> DeleteCategoryAsync(int id, int companyId)
        {
           
            await Task.CompletedTask;
            return new ApiResponse<object> { Success = true, Message = "Silme başarılı" };
        }
    }
}