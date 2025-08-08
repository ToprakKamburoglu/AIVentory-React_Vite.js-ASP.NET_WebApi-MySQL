using AIVentory_backend.Models.DTOs.User;

namespace AIVentory_backend.Models.DTOs.Auth
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public UserDto User { get; set; }
    }
}