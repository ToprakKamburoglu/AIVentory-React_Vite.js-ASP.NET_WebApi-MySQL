using AIVentory.API.Models.Common;
using AIVentory_backend.Models.Common;
using AIVentory_backend.Models.DTOs.Auth;

namespace AIVentory_backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<LoginResponseDto>> LoginAsync(LoginRequestDto request);
        Task<ApiResponse<LoginResponseDto>> RegisterAsync(RegisterRequestDto request);
    }
}