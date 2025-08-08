using AIVentory.API.Models.Common; 
using AIVentory_backend.Models.Entities;
using AIVentory_backend.Models.Enums;
using AIVentory_backend.Data;
using AIVentory_backend.Helpers;
using AIVentory_backend.Models.DTOs.Auth;
using AIVentory_backend.Models.DTOs.User;
using AIVentory_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AIVentory_backend.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(ApplicationDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<ApiResponse<LoginResponseDto>> LoginAsync(LoginRequestDto request)
        {
            var user = await _context.Users
                .Include(u => u.Company)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !PasswordHelper.VerifyPassword(request.Password, user.PasswordHash))
            {
                return ApiResponse<LoginResponseDto>.ErrorResponse("Email veya şifre hatalı");
            }

            if (!user.IsActive)
            {
                return ApiResponse<LoginResponseDto>.ErrorResponse("Hesabınız aktif değil");
            }

            
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = _jwtHelper.GenerateToken(user);

            var loginResponse = new LoginResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role.ToString().ToLower(),
                    CompanyId = user.CompanyId,
                    CompanyName = user.Company?.Name
                }
            };

            return ApiResponse<LoginResponseDto>.SuccessResponse(loginResponse, "Giriş başarılı");
        }

        public async Task<ApiResponse<LoginResponseDto>> RegisterAsync(RegisterRequestDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return ApiResponse<LoginResponseDto>.ErrorResponse("Bu email adresi zaten kullanılıyor");
            }

            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == request.CompanyId);
            if (company == null)
            {
                return ApiResponse<LoginResponseDto>.ErrorResponse("Geçersiz şirket ID'si. Bu şirket bulunamadı.");
            }

            

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = PasswordHelper.HashPassword(request.Password),
                CompanyId = request.CompanyId,
                Role = request.Role,
                IsActive = true,
                EmailVerified = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

          
            user = await _context.Users
                .Include(u => u.Company)
                .FirstOrDefaultAsync(u => u.Id == user.Id);

            var token = _jwtHelper.GenerateToken(user);

            var loginResponse = new LoginResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role.ToString().ToLower(),
                    CompanyId = user.CompanyId,
                    CompanyName = user.Company?.Name ?? ""
                }
            };

            return ApiResponse<LoginResponseDto>.SuccessResponse(loginResponse, "Kayıt başarılı");
        }

    }
}