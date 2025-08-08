using AIVentory_backend.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace AIVentory_backend.Models.DTOs.Auth
{
    public class RegisterRequestDto
    {
        [Required(ErrorMessage = "Ad alanı zorunludur")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Soyad alanı zorunludur")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email alanı zorunludur")]
        [EmailAddress(ErrorMessage = "Geçerli bir email adresi giriniz")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Şifre alanı zorunludur")]
        [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Şirket ID zorunludur")]
        public int CompanyId { get; set; }
        
        [Required(ErrorMessage = "Rol zorunludur")]
        public UserRole Role { get; set; }
    }
}