using AIVentory.API.Models.Common;
using AIVentory_backend.Models.Common;
using AIVentory_backend.Models.DTOs.Auth;
using AIVentory_backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AIVentory_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login(LoginRequestDto request)
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Register(RegisterRequestDto request)
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }

        [HttpPost("logout")]
        public ActionResult<ApiResponse<bool>> Logout()
        {
           
            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Başarıyla çıkış yapıldı"
            });
        }
    }
}