using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AIVentory_backend.Data;
using AIVentory_backend.Models.Entities;

namespace AIVentory_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(ApplicationDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

      
        [HttpGet]
        public async Task<ActionResult> GetUsers([FromQuery] string? search = null, [FromQuery] string? role = null)
        {
            try
            {
                _logger.LogInformation("GetUsers endpoint called");

                var query = _context.Users
                    .Include(u => u.Company)
                    .Where(u => u.IsActive);

               
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(u => u.FirstName.Contains(search) ||
                                           u.LastName.Contains(search) ||
                                           u.Email.Contains(search));
                }

                var users = await query
                    .Select(u => new
                    {
                        id = u.Id,
                        firstName = u.FirstName,
                        lastName = u.LastName,
                        email = u.Email,
                        role = u.Role,
                        phone = u.Phone,
                        avatar = u.Avatar,
                        isActive = u.IsActive,
                        emailVerified = u.EmailVerified,
                        lastLoginAt = u.LastLoginAt,
                        companyName = u.Company.Name,
                        createdAt = u.CreatedAt,
                        updatedAt = u.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = $"{users.Count} kullanıcı bulundu",
                    data = users
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetUsers error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult> GetUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Company)
                    .Where(u => u.Id == id)
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound(new { success = false, message = "Kullanıcı bulunamadı" });
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        id = user.Id,
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        email = user.Email,
                        role = user.Role,
                        phone = user.Phone,
                        avatar = user.Avatar,
                        isActive = user.IsActive,
                        emailVerified = user.EmailVerified,
                        lastLoginAt = user.LastLoginAt,
                        companyName = user.Company?.Name,
                        createdAt = user.CreatedAt,
                        updatedAt = user.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetUser error for ID: {UserId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }

        
        [HttpPost]
        public async Task<ActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.FirstName))
                {
                    return BadRequest(new { success = false, message = "Email ve ad alanları gereklidir" });
                }

             
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { success = false, message = "Bu email adresi zaten kullanımda" });
                }

                var user = new User
                {
                    CompanyId = 1, 
                    FirstName = request.FirstName,
                    LastName = request.LastName ?? "",
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password ?? "123456"), 
                    Phone = request.Phone,
                    IsActive = true,
                    EmailVerified = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new
                {
                    success = true,
                    message = "Kullanıcı başarıyla oluşturuldu",
                    data = new { id = user.Id, email = user.Email }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreateUser error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kullanıcı oluşturulurken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

      
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "Kullanıcı bulunamadı" });
                }

                if (!string.IsNullOrEmpty(request.FirstName))
                    user.FirstName = request.FirstName;
                if (!string.IsNullOrEmpty(request.LastName))
                    user.LastName = request.LastName;
                if (!string.IsNullOrEmpty(request.Phone))
                    user.Phone = request.Phone;

                user.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Kullanıcı başarıyla güncellendi",
                    data = new { id = user.Id, email = user.Email }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateUser error for ID: {UserId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kullanıcı güncellenirken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

     
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "Kullanıcı bulunamadı" });
                }

                user.IsActive = false;
                user.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Kullanıcı başarıyla silindi"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteUser error for ID: {UserId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kullanıcı silinirken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

      
        [HttpPatch("{id}/status")]
        public async Task<ActionResult> UpdateUserStatus(int id, [FromBody] bool isActive)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "Kullanıcı bulunamadı" });
                }

                user.IsActive = isActive;
                user.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                var statusText = isActive ? "aktif" : "pasif";
                return Ok(new
                {
                    success = true,
                    message = $"Kullanıcı başarıyla {statusText} yapıldı"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateUserStatus error for ID: {UserId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Kullanıcı durumu güncellenirken bir hata oluştu",
                    error = ex.Message
                });
            }
        }

        
        [HttpGet("statistics")]
        public async Task<ActionResult> GetUserStatistics()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync(u => u.IsActive);
                var verifiedUsers = await _context.Users.CountAsync(u => u.IsActive && u.EmailVerified);

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        totalUsers,
                        verifiedUsers
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetUserStatistics error");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Bir hata oluştu",
                    error = ex.Message
                });
            }
        }


        
        [HttpPost("{id}/avatar")]
        public async Task<ActionResult> UploadAvatar(int id, IFormFile avatar)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "Kullanıcı bulunamadı" });
                }

                if (avatar == null || avatar.Length == 0)
                {
                    return BadRequest(new { success = false, message = "Dosya seçilmedi" });
                }

               
                if (avatar.Length > 2 * 1024 * 1024)
                {
                    return BadRequest(new { success = false, message = "Dosya boyutu 2MB'dan küçük olmalıdır" });
                }

                
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(avatar.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { success = false, message = "Sadece JPG, PNG ve GIF dosyaları kabul edilir" });
                }

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                if (!string.IsNullOrEmpty(user.Avatar))
                {
                    var oldAvatarPath = Path.Combine(uploadsFolder, user.Avatar);
                    if (System.IO.File.Exists(oldAvatarPath))
                    {
                        System.IO.File.Delete(oldAvatarPath);
                    }
                }

                var fileName = $"{user.Id}_{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

              
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await avatar.CopyToAsync(fileStream);
                }

              
                user.Avatar = fileName;
                user.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Avatar başarıyla yüklendi",
                    data = new { avatarPath = fileName }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UploadAvatar error for ID: {UserId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Avatar yüklenirken bir hata oluştu",
                    error = ex.Message
                });
            }
        }



        [HttpPost("{id}/change-password")]
        public async Task<ActionResult> ChangePassword(int id, [FromBody] ChangePasswordRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "Kullanıcı bulunamadı" });
                }

              
                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
                {
                    return BadRequest(new { success = false, message = "Mevcut şifre hatalı" });
                }

                if (string.IsNullOrEmpty(request.NewPassword) || request.NewPassword.Length < 6)
                {
                    return BadRequest(new { success = false, message = "Yeni şifre en az 6 karakter olmalıdır" });
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                user.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Şifre başarıyla değiştirildi"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ChangePassword error for ID: {UserId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Şifre değiştirilirken bir hata oluştu",
                    error = ex.Message
                });
            }



        }

      
        public class CreateUserRequest
        {
            public string Email { get; set; }
            public string FirstName { get; set; }
            public string? LastName { get; set; }
            public string? Password { get; set; }
            public string? Role { get; set; }
            public string? Phone { get; set; }
        }

        public class UpdateUserRequest
        {
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
            public string? Phone { get; set; }
            public string? Role { get; set; }
        }


        public class ChangePasswordRequest
        {
            public string CurrentPassword { get; set; }
            public string NewPassword { get; set; }
        }


    }
}
