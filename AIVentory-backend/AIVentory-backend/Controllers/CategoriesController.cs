using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AIVentory_backend.Data;
using AIVentory_backend.Models.Entities;
using AIVentory_backend.Models.DTOs.Category;

namespace AIVentory_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CategoriesController> _logger;

        public CategoriesController(ApplicationDbContext context, ILogger<CategoriesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult> GetCategories([FromQuery] int? companyId = null) 
        {
            try
            {
                var query = _context.Categories
                    .Where(c => c.IsActive);

           
                if (companyId.HasValue)
                {
                    query = query.Where(c => c.CompanyId == companyId.Value);
                }

                var categories = await query
                    .OrderBy(c => c.Name)
                    .Select(c => new
                    {
                        id = c.Id,
                        name = c.Name,
                        description = c.Description,
                        parentId = c.ParentId,
                        icon = c.Icon,
                        color = c.Color,
                        isActive = c.IsActive,
                        companyId = c.CompanyId, 
                        createdAt = c.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = $"{categories.Count} kategori bulundu",
                    data = categories
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetCategories error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kategoriler yüklenirken hata oluştu",
                    error = ex.Message
                });
            }
        }

   
        [HttpPost]
        public async Task<ActionResult> CreateCategory([FromBody] CreateCategoryDto categoryDto)
        {
            try
            {
                _logger.LogInformation("CreateCategory called with: {@CategoryDto}", categoryDto);

               
                if (categoryDto.CompanyId <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Şirket bilgisi (CompanyId) eksik veya hatalı!"
                    });
                }

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
                        message = "Geçersiz kategori bilgileri",
                        errors = errors
                    });
                }

               
                var existingCategory = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == categoryDto.Name.ToLower()
                                            && c.CompanyId == categoryDto.CompanyId
                                            && c.IsActive);

                if (existingCategory != null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Bu isimde bir kategori zaten mevcut"
                    });
                }

                var category = new Category
                {
                    CompanyId = categoryDto.CompanyId,
                    Name = categoryDto.Name.Trim(),
                    Description = categoryDto.Description?.Trim(),
                    ParentId = categoryDto.ParentId,
                    Icon = categoryDto.Icon ?? "fas fa-folder",
                    Color = categoryDto.Color ?? "#6c757d",
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Category created successfully with ID: {CategoryId}", category.Id);

                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, new
                {
                    success = true,
                    message = "Kategori başarıyla oluşturuldu",
                    data = new
                    {
                        id = category.Id,
                        name = category.Name,
                        description = category.Description,
                        icon = category.Icon,
                        color = category.Color
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreateCategory error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kategori oluşturulurken hata oluştu",
                    error = ex.Message
                });
            }
        }

       
        [HttpGet("{id}")]
        public async Task<ActionResult> GetCategory(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Where(c => c.Id == id && c.IsActive)
                    .Select(c => new
                    {
                        id = c.Id,
                        name = c.Name,
                        description = c.Description,
                        parentId = c.ParentId,
                        icon = c.Icon,
                        color = c.Color,
                        isActive = c.IsActive,
                        createdAt = c.CreatedAt,
                        updatedAt = c.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (category == null)
                {
                    return NotFound(new 
                    { 
                        success = false, 
                        message = "Kategori bulunamadı" 
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = category
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetCategory error for ID: {CategoryId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kategori yüklenirken hata oluştu",
                    error = ex.Message
                });
            }
        }

    
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto categoryDto)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null || !category.IsActive)
                {
                    return NotFound(new { success = false, message = "Kategori bulunamadı" });
                }

             
                var existingCategory = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == categoryDto.Name.ToLower() 
                                            && c.Id != id 
                                            && c.CompanyId == category.CompanyId 
                                            && c.IsActive);

                if (existingCategory != null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Bu isimde başka bir kategori zaten mevcut"
                    });
                }

                category.Name = categoryDto.Name.Trim();
                category.Description = categoryDto.Description?.Trim();
                category.ParentId = categoryDto.ParentId;
                category.Icon = categoryDto.Icon ?? category.Icon;
                category.Color = categoryDto.Color ?? category.Color;
                category.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Kategori başarıyla güncellendi",
                    data = new
                    {
                        id = category.Id,
                        name = category.Name,
                        description = category.Description
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateCategory error for ID: {CategoryId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kategori güncellenirken hata oluştu",
                    error = ex.Message
                });
            }
        }

     
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { success = false, message = "Kategori bulunamadı" });
                }

                var hasProducts = await _context.Products
                    .AnyAsync(p => p.CategoryId == id && p.IsActive);

                if (hasProducts)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Bu kategoriye ait ürünler bulunduğu için kategori silinemez"
                    });
                }

                category.IsActive = false;
                category.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Kategori başarıyla silindi"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteCategory error for ID: {CategoryId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kategori silinirken hata oluştu",
                    error = ex.Message
                });
            }
        }
    }
}